"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, AlertCircle, Info, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useEffect, useState } from "react"

export function SignInButton() {
  const { signInWithGoogle, loading, isConfigured, isDemoMode, error, resetError } = useAuth()
  const [showError, setShowError] = useState(false)

  // Show error alert when an error occurs
  useEffect(() => {
    if (error) {
      setShowError(true)
    }
  }, [error])

  // Hide error after 5 seconds
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false)
        resetError()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showError, resetError])

  if (!isConfigured && !isDemoMode) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled
              className="bg-gradient-to-r from-[#3b82f6]/50 to-[#10b981]/50 text-white cursor-not-allowed"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Sign in
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Firebase authentication is not configured in this environment</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="space-y-2">
      {error && showError && (
        <Alert variant="destructive" className="flex items-center justify-between">
          <AlertDescription className="text-sm">{error}</AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              setShowError(false)
              resetError()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={signInWithGoogle}
              disabled={loading}
              className="bg-gradient-to-r from-[#3b82f6] to-[#10b981] hover:from-[#3b82f6]/90 hover:to-[#10b981]/90 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  {isDemoMode && <Info className="mr-2 h-4 w-4" />}
                  {isDemoMode ? "Sign in (Demo Mode)" : "Sign in with Google"}
                </>
              )}
            </Button>
          </TooltipTrigger>
          {isDemoMode && (
            <TooltipContent>
              <p>Running in demo mode - no actual authentication will occur</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
