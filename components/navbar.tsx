"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignInButton } from "@/components/auth/sign-in-button"
import { ProfileMenu } from "@/components/auth/profile-menu"
import { useAuth } from "@/contexts/auth-context"
import { ContactPopup } from "@/components/contact-popup"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const { user, loading, isConfigured } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const openContact = () => {
    setIsContactOpen(true)
    // Close mobile menu when opening contact popup
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#1e2330] bg-[#0d1117]/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#3b82f6]" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#10b981] bg-clip-text text-transparent">
              DeepGuard
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-[#e4e4e7] hover:text-[#3b82f6] transition-colors">
              Home
            </Link>
            <Link href="#upload" className="text-[#e4e4e7] hover:text-[#3b82f6] transition-colors">
              Upload
            </Link>
            <Link href="#how-it-works" className="text-[#e4e4e7] hover:text-[#3b82f6] transition-colors">
              How It Works
            </Link>
            <button 
              onClick={openContact}
              className="text-[#e4e4e7] hover:text-[#3b82f6] transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center ml-4">
            {!loading && isConfigured && user ? <ProfileMenu /> : <SignInButton />}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden text-[#e4e4e7]" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0d1117] border-b border-[#1e2330]">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href="/"
                className="text-[#e4e4e7] hover:text-[#3b82f6] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#upload"
                className="text-[#e4e4e7] hover:text-[#3b82f6] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Upload
              </Link>
              <Link
                href="#how-it-works"
                className="text-[#e4e4e7] hover:text-[#3b82f6] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <button
                onClick={openContact}
                className="text-[#e4e4e7] hover:text-[#3b82f6] transition-colors py-2 text-left bg-transparent border-none p-0 cursor-pointer"
              >
                Contact
              </button>
              {/* Mobile Auth */}
              <div className="pt-2">{!loading && isConfigured && user ? <ProfileMenu /> : <SignInButton />}</div>
            </div>
          </div>
        )}
      </header>

      {/* Contact Popup */}
      <ContactPopup isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  )
}
