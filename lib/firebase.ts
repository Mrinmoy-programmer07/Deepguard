import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"

// Flag to determine if we're in development/preview mode
const isDevelopment =
  process.env.NODE_ENV === "development" ||
  process.env.VERCEL_ENV === "preview" ||
  (typeof window !== "undefined" && window.location.hostname === "localhost")

// Check if Firebase config is available and valid
const hasValidFirebaseConfig =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("AIza") && // Basic validation for API key format
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

// Create a development Firebase app for preview/development environments
// NOTE: This is just a placeholder config, it won't actually work with Firebase services
// You must provide real Firebase config variables in .env.local for authentication to work
const devFirebaseConfig = {
  apiKey: "AIzaSyDevelopmentModeKey123456789",
  authDomain: "deepguard-dev.firebaseapp.com",
  projectId: "deepguard-dev",
  storageBucket: "deepguard-dev.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789",
}

// Use real config if available and valid, otherwise use dev config
const firebaseConfig = hasValidFirebaseConfig
  ? {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }
  : devFirebaseConfig

// Initialize Firebase with error handling
let app
let auth
let firebaseInitialized = false
let initError = null

try {
  if (!hasValidFirebaseConfig && isDevelopment) {
    console.warn(
      "Firebase configuration is missing or invalid. Please add the required environment variables in .env.local:\n" +
      "NEXT_PUBLIC_FIREBASE_API_KEY\n" +
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN\n" +
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID\n" +
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET\n" +
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID\n" +
      "NEXT_PUBLIC_FIREBASE_APP_ID"
    )
    console.warn("Authentication will run in demo mode - no actual authentication will occur.")
  }

  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  auth = getAuth(app)
  firebaseInitialized = true
} catch (error) {
  initError = error
  console.error("Firebase initialization error:", error)
  
  if (error.code === "auth/invalid-api-key") {
    console.error("Invalid Firebase API key. Check your NEXT_PUBLIC_FIREBASE_API_KEY in .env.local")
  } else if (error.message?.includes("auth/invalid-project-id")) {
    console.error("Invalid Firebase project ID. Check your NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env.local")
  }
  
  // Create a minimal app and auth for the UI to work without errors
  app = null
  auth = null
  firebaseInitialized = false
}

export { app, auth, firebaseInitialized, isDevelopment, initError }
