import { Shield, Upload, FileCheck, AlertTriangle } from "lucide-react"

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        
        <div className="max-w-3xl mx-auto bg-[#121824]/50 backdrop-blur-sm border border-[#1e2330] rounded-lg p-6">
          <p className="text-[#e4e4e7]/80 mb-8 text-center">
            DeepGuard uses advanced AI technology to detect manipulated or synthetic media, protecting you from deepfakes and disinformation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-[#0d1117] p-4 rounded-full mb-4">
                <Upload className="h-6 w-6 text-[#3b82f6]" />
              </div>
              <h3 className="text-lg font-medium mb-2">Upload Media</h3>
              <p className="text-sm text-[#e4e4e7]/70">
                Upload an image or provide a URL of the media you want to verify.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-[#0d1117] p-4 rounded-full mb-4">
                <Shield className="h-6 w-6 text-[#3b82f6]" />
              </div>
              <h3 className="text-lg font-medium mb-2">AI Analysis</h3>
              <p className="text-sm text-[#e4e4e7]/70">
                Our AI model analyzes the media for signs of manipulation or synthetic generation.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-[#0d1117] p-4 rounded-full mb-4">
                <FileCheck className="h-6 w-6 text-[#10b981]" />
              </div>
              <h3 className="text-lg font-medium mb-2">Get Results</h3>
              <p className="text-sm text-[#e4e4e7]/70">
                Review the analysis results to determine if the media is authentic or manipulated.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-[#0d1117] p-4 rounded-full mb-4">
                <AlertTriangle className="h-6 w-6 text-[#ef4444]" />
              </div>
              <h3 className="text-lg font-medium mb-2">Stay Protected</h3>
              <p className="text-sm text-[#e4e4e7]/70">
                Use DeepGuard regularly to protect yourself from digital misinformation.
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-[#0d1117] rounded-lg border border-[#1e2330]">
            <h4 className="text-sm font-medium mb-2 text-[#e4e4e7]/90">Technical Note</h4>
            <p className="text-xs text-[#e4e4e7]/70">
              DeepGuard uses state-of-the-art machine learning models to detect digital manipulation patterns. 
              Our system has a high accuracy rate but remains under continuous improvement as deepfake technology evolves.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 