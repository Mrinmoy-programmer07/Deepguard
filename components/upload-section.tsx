"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, LinkIcon, Scan, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { detectDeepfake, uploadFileForDetection, isBackendAvailable } from "@/lib/api"

// Interface for scan result states
interface ScanResult {
  score: number;
  isReal: boolean;
  explanation: string;
  modelId: string;
  mediaUrl: string;
}

// Props including the onResultsChange function
interface UploadSectionProps {
  onResultsChange?: (results: ScanResult | null) => void;
}

export function UploadSection({ onResultsChange }: UploadSectionProps) {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'available' | 'unavailable'>('checking')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check backend availability when component mounts
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const available = await isBackendAvailable();
        setBackendStatus(available ? 'available' : 'unavailable');
        
        if (!available) {
          toast({
            title: "Backend Service Offline",
            description: "Running in demo mode with simulated results",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error checking backend:', error);
        setBackendStatus('unavailable');
      }
    };
    
    checkBackend();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create preview for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setPreview(event.target?.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setPreview(null)
      }

      console.log("File selected:", selectedFile.name)
      toast({
        title: "File selected",
        description: `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`,
      })

      // Clear any URL input when file is selected
      setUrl("")
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    // Clear any file input when URL is entered
    if (e.target.value) {
      setFile(null)
      setPreview(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)

      // Create preview for images
      if (droppedFile.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setPreview(event.target?.result as string)
        }
        reader.readAsDataURL(droppedFile)
      } else {
        setPreview(null)
      }

      console.log("File dropped:", droppedFile.name)
      toast({
        title: "File dropped",
        description: `${droppedFile.name} (${(droppedFile.size / 1024).toFixed(2)} KB)`,
      })

      // Clear any URL input when file is dropped
      setUrl("")
    }
  }

  const handleScan = async () => {
    if (!file && !url) {
      toast({
        title: "Error",
        description: "Please upload a file or enter a URL",
        variant: "destructive",
      })
      return
    }

    // Validate URL if provided
    if (url && !url.match(/^(https?:\/\/)([a-z0-9-]+\.)+[a-z]{2,}.*$/i)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL starting with http:// or https://",
        variant: "destructive",
      })
      return
    }

    try {
      setScanning(true)
      
      // Show scanning toast
      toast({
        title: "Scanning media",
        description: "Analyzing image for AI-generated content...",
      });

      let mediaUrl = url;
      
      // If a file is selected, upload it to get a URL
      if (file) {
        try {
          mediaUrl = await uploadFileForDetection(file);
          console.log("Prepared file for analysis, size:", Math.round(mediaUrl.length / 1024), "KB");
        } catch (error) {
          console.error("Error processing file:", error);
          toast({
            title: "Upload Error",
            description: "Failed to process the file. Please try again with a smaller image or use a URL.",
            variant: "destructive",
          })
          setScanning(false);
          return;
        }
      }

      // Call the API to detect fake images
      console.log("Starting detection with", file ? "uploaded file" : "URL", "...");
      const response = await detectDeepfake(mediaUrl);
      console.log("Detection result received:", response.result.label);
      
      // Check if this is a mock result (for demo purposes)
      const isMockResult = response.result.modelId === 'bcmi/fake-image-detection';
      
      // Format the results for the UI
      const { result } = response;
      const formattedResults: ScanResult = {
        score: Math.round(result.confidence * 100),
        isReal: !result.isFake,
        explanation: result.isFake 
          ? "This image appears to be AI-generated or manipulated. The patterns detected are consistent with AI-generated imagery."
          : "This image appears to be authentic. No significant signs of AI generation or manipulation were detected.",
        modelId: result.modelId,
        mediaUrl: result.mediaUrl
      };

      // Update the parent component with the results
      if (onResultsChange) {
        onResultsChange(formattedResults);
      }

      // Show success toast
      toast({
        title: isMockResult ? "Analysis Complete (Demo Mode)" : "Analysis Complete",
        description: result.isFake 
          ? "Result: AI-Generated"
          : "Result: Authentic",
      });

    } catch (error) {
      console.error("Error scanning media:", error);
      
      // Handle all errors
      toast({
        title: "Scan Error",
        description: "An error occurred during the scan. Using demo mode instead.",
        variant: "destructive",
      });
      
      // Try again with mock data after a short delay
      setTimeout(async () => {
        try {
          // Get mock result
          const mockResult = await detectDeepfake("mock-url");
          
          // Format the mock results for the UI
          const { result } = mockResult;
          const formattedResults: ScanResult = {
            score: Math.round(result.confidence * 100),
            isReal: !result.isFake,
            explanation: result.isFake 
              ? "This image appears to be AI-generated or manipulated. The patterns detected are consistent with AI-generated imagery."
              : "This image appears to be authentic. No significant signs of AI generation or manipulation were detected.",
            modelId: "demo_mode/ai_detection",
            mediaUrl: file ? "local-image" : url
          };
          
          // Update the parent component with the results
          if (onResultsChange) {
            onResultsChange(formattedResults);
          }
          
          // Show demo mode toast
          toast({
            title: "Analysis Complete (Demo Mode)",
            description: result.isFake 
              ? "Result: AI-Generated"
              : "Result: Authentic",
          });
        } catch (fallbackError) {
          console.error("Error in fallback mode:", fallbackError);
          
          // Reset results on error
          if (onResultsChange) {
            onResultsChange(null);
          }
        }
      }, 1000);
    } finally {
      setScanning(false);
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <section 
      id="upload" 
      className="py-16 scroll-mt-20" 
      tabIndex={-1}
      aria-label="Upload Media for Analysis"
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Upload Media for Analysis</h2>

      {backendStatus === 'unavailable' && (
        <div className="max-w-3xl mx-auto mb-4 p-3 bg-yellow-900/30 border border-yellow-800 rounded-md text-yellow-300 text-sm">
          <p className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Running in demo mode with simulated results
          </p>
        </div>
      )}

      <Card className="bg-[#121824]/50 backdrop-blur-sm border-[#1e2330] max-w-3xl mx-auto">
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
              isDragging ? "border-[#3b82f6] bg-[#3b82f6]/10" : "border-[#1e2330] hover:border-[#3b82f6]/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,video/*"
            />

            {preview ? (
              <div className="flex flex-col items-center">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-48 max-w-full mb-4 rounded-lg"
                />
                <p className="text-[#e4e4e7]/70">{file?.name}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-[#3b82f6] mb-4" />
                <p className="text-lg font-medium mb-2">Drag and drop or click to upload</p>
                <p className="text-[#e4e4e7]/70 text-sm">Supports images and videos up to 50MB</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <LinkIcon className="h-4 w-4 text-[#3b82f6] mr-2" />
              <p className="text-sm font-medium">Or enter a URL</p>
            </div>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={handleUrlChange}
                className="bg-[#0d1117] border-[#1e2330] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
              />
            </div>
          </div>

          <Button
            onClick={handleScan}
            disabled={scanning || (!file && !url)}
            className="w-full bg-gradient-to-r from-[#3b82f6] to-[#10b981] hover:from-[#3b82f6]/90 hover:to-[#10b981]/90"
          >
            {scanning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Scan className="h-4 w-4 mr-2" />
                Scan
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
