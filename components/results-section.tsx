"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define the result data interface
interface ScanResult {
  score: number;
  isReal: boolean;
  explanation: string;
  modelId: string;
  mediaUrl: string;
}

// Component props interface
interface ResultsSectionProps {
  results: ScanResult | null;
  onReset: () => void;
  visible: boolean;
}

export function ResultsSection({ results, onReset, visible = true }: ResultsSectionProps) {
  if (!visible || !results) {
    return null;
  }

  const handleResetScan = () => {
    console.log("Resetting scan");
    onReset();
  };

  // Format model ID for display
  const formatModelId = (modelId: string) => {
    return modelId.split('/').pop() || modelId;
  };

  return (
    <section className="py-16 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-8 text-center">Analysis Results</h2>

      <Card className="bg-[#121824]/50 backdrop-blur-sm border-[#1e2330] max-w-3xl mx-auto overflow-hidden">
        <div className={`h-2 ${results.isReal ? "bg-[#10b981]" : "bg-[#ef4444]"}`}></div>

        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            {results.isReal ? (
              <>
                <CheckCircle className="h-5 w-5 text-[#10b981]" />
                <span>Image Appears Authentic</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-[#ef4444]" />
                <span>AI-Generated Content Detected</span>
              </>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-2xl font-bold">
              {results.isReal ? (
                <span className="text-[#10b981]">Authentic</span>
              ) : (
                <span className="text-[#ef4444]">AI-Generated</span>
              )}
            </div>
            
            <div className="w-32 h-8 bg-[#0d1117] rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  results.isReal 
                    ? "bg-gradient-to-r from-[#10b981]/80 to-[#10b981]" 
                    : "bg-gradient-to-r from-[#ef4444]/80 to-[#ef4444]"
                }`}
                style={{ width: `${results.isReal ? 100 - results.score : results.score}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Analysis</h3>
            <p className="text-[#e4e4e7]/70 text-sm">
              {results.isReal 
                ? "Our analysis indicates this image appears to be authentic. No significant signs of AI generation or manipulation were detected."
                : "Our AI model has identified this image as likely AI-generated or manipulated. The patterns detected are consistent with AI-generated imagery."}
            </p>
            <p className="text-[#e4e4e7]/70 text-xs mt-2 italic">
              Note: This analysis is powered by Hive AI's content moderation API, which specializes in detecting AI-generated imagery.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0d1117] p-4 rounded-lg">
              <h4 className="text-xs font-medium text-[#e4e4e7]/70 mb-1">Detection Method</h4>
              <p className="text-sm">{formatModelId(results.modelId)}</p>
            </div>
            <div className="bg-[#0d1117] p-4 rounded-lg">
              <h4 className="text-xs font-medium text-[#e4e4e7]/70 mb-1">Media Type</h4>
              <p className="text-sm">{results.mediaUrl.includes('data:image') ? 'Uploaded Image' : 'URL Image'}</p>
            </div>
          </div>

          {results.mediaUrl && !results.mediaUrl.startsWith('data:') && (
            <div className="mb-6">
              <h4 className="text-xs font-medium text-[#e4e4e7]/70 mb-2">Analyzed Media</h4>
              <div className="bg-[#0d1117] p-2 rounded-lg overflow-hidden">
                <img 
                  src={results.mediaUrl} 
                  alt="Analyzed media" 
                  className="w-full h-auto rounded object-contain max-h-48"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <Button
            onClick={handleResetScan}
            variant="outline"
            className="w-full border-[#1e2330] hover:bg-[#1e2330] text-[#e4e4e7]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Scan Another
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
