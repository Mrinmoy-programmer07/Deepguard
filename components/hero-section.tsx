"use client"

import { Shield, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { SignInButton } from "@/components/auth/sign-in-button"

export function HeroSection() {
  const { user, isConfigured } = useAuth()

  return (
    <section className="py-20 md:py-32 flex flex-col items-center text-center">
      <div className="relative mb-8">
        <Shield className="h-20 w-20 text-[#3b82f6]" />
        <AlertTriangle className="h-10 w-10 text-[#10b981] absolute -bottom-2 -right-2" />
      </div>

      <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-[#3b82f6] to-[#10b981] bg-clip-text text-transparent">
        DeepGuard
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#f97316]">
        Let's See Who's Faking It
      </h2>

      {isConfigured && user ? (
        <p className="text-xl md:text-2xl mb-8 max-w-2xl text-[#e4e4e7]/80">
          Welcome back, <span className="font-semibold text-[#3b82f6]">{user.displayName?.split(" ")[0]}</span>! Ready
          to analyze some media?
        </p>
      ) : (
        <p className="text-xl md:text-2xl mb-8 max-w-2xl text-[#e4e4e7]/80">Expose the Fake. Protect the Truth.</p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {!isConfigured || !user ? <SignInButton /> : null}
      </div>

      <div className="mt-8 w-full max-w-4xl mx-auto bg-[#121824]/50 backdrop-blur-sm rounded-xl p-6 border border-[#1e2330]">
        <p className="text-[#e4e4e7]/70">
          DeepGuard uses advanced AI to detect manipulated media with high accuracy. Our technology can identify
          deepfakes, synthetic images, and AI-generated content to help combat misinformation and protect digital
          authenticity.
        </p>
      </div>
    </section>
  )
}
