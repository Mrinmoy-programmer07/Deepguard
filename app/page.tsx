"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { UploadSection } from "@/components/upload-section"
import { ResultsSection } from "@/components/results-section"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/contexts/auth-context"

// Define the ScanResult interface
interface ScanResult {
  score: number
  isReal: boolean
  explanation: string
  modelId: string
  mediaUrl: string
}

export default function Home() {
  const [scanResults, setScanResults] = useState<ScanResult | null>(null)
  const [showResults, setShowResults] = useState(false)

  // Handle scan results from UploadSection
  const handleResultsChange = (results: ScanResult | null) => {
    setScanResults(results)
    setShowResults(!!results)
  }

  // Reset scan results
  const handleReset = () => {
    setShowResults(false)
    // Clear results after animation
    setTimeout(() => {
      setScanResults(null)
    }, 300)
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0d1117] text-[#e4e4e7]">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <HeroSection />
          <UploadSection onResultsChange={handleResultsChange} />
          <ResultsSection 
            results={scanResults} 
            onReset={handleReset} 
            visible={showResults} 
          />
          <HowItWorks />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
