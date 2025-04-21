"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth"
import { auth, firebaseInitialized, isDevelopment, initError } from "@/lib/firebase"

// Demo user for development/preview mode
const DEMO_USER = {
  uid: "demo-user-123",
  email: "demo@deepguard.ai",
  displayName: "Demo User",
  photoURL: null,
  emailVerified: true,
}

type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  isConfigured: boolean
  isDemoMode: boolean
  resetError: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  isConfigured: false,
  isDemoMode: false,
  resetError: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Function to reset error state
  const resetError = () => setError(null)

  useEffect(() => {
    // Check if we should use demo mode
    if (isDevelopment && !firebaseInitialized) {
      console.log("Using demo mode for authentication")
      setIsDemoMode(true)
      setLoading(false)

      // Set a more helpful error message if we have initialization errors
      if (initError) {
        setError(
          "Firebase authentication error: Please check your environment variables in .env.local (using demo mode for now)"
        )
      }
      return () => {}
    }

    // Check if Firebase auth is properly configured
    if (!auth) {
      setLoading(false)
      setError("Firebase authentication is not configured. Check your environment variables.")
      setIsConfigured(false)
      return () => {}
    }

    setIsConfigured(true)

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user)
        setLoading(false)
      },
      (error) => {
        console.error("Auth state change error:", error)
        setError(`Authentication error: ${error.message}`)
        setLoading(false)

        // If we get an API key error, switch to demo mode
        if (error.code === "auth/invalid-api-key" || error.code === "auth/api-key-not-valid") {
          console.log("Invalid API key detected, switching to demo mode")
          setIsDemoMode(true)
          setError("Invalid Firebase API key. Check your NEXT_PUBLIC_FIREBASE_API_KEY in .env.local (using demo mode for now)")
        }
      },
    )

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    // If in demo mode, simulate sign in with demo user
    if (isDemoMode) {
      setLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))
      setUser(DEMO_USER as unknown as User)
      setLoading(false)
      return
    }

    if (!auth) {
      setError("Firebase authentication is not configured. Check your environment variables.")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error: any) {
      console.error("Google sign-in error:", error)
      
      // Handle specific Firebase errors with clear messages
      let errorMessage = "Failed to sign in with Google"
      
      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in canceled. You closed the login popup.";
          break;
        case "auth/popup-blocked":
          errorMessage = "Sign-in popup was blocked. Please allow popups for this site.";
          break;
        case "auth/cancelled-popup-request":
          errorMessage = "Sign-in canceled due to multiple popup requests.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your internet connection.";
          break;
        case "auth/invalid-api-key":
        case "auth/api-key-not-valid":
          errorMessage = "Invalid Firebase API key. Check your environment variables.";
          break;
        default:
          errorMessage = error.message || "Failed to sign in with Google";
      }
      
      setError(errorMessage);

      // If we get an API key error, switch to demo mode
      if (error.code === "auth/invalid-api-key" || error.code === "auth/api-key-not-valid") {
        console.log("Invalid API key detected during sign-in, switching to demo mode")
        setIsDemoMode(true)
        setError("Invalid Firebase API key. Using demo mode instead.");
        // Set demo user after a short delay to simulate sign-in
        setTimeout(() => {
          setUser(DEMO_USER as unknown as User)
        }, 500)
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    // If in demo mode, simulate sign out
    if (isDemoMode) {
      setLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser(null)
      setLoading(false)
      return
    }

    if (!auth) {
      setError("Firebase authentication is not configured. Check your environment variables.")
      return
    }

    setLoading(true)
    try {
      await firebaseSignOut(auth)
    } catch (error: any) {
      console.error("Sign out error:", error)
      setError(error instanceof Error ? error.message : "Failed to sign out")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        signOut,
        isConfigured: isConfigured || isDemoMode,
        isDemoMode,
        resetError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
