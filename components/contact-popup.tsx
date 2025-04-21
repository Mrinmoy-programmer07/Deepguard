"use client"

import { useState, useEffect } from "react"
import { Github, Instagram, Linkedin, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContactPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  // Close popup when ESC key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleEsc)
    
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed top-0 right-0 bottom-0 z-50 flex items-center">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />
      <div className="bg-[#121824] border-l border-[#1e2330] h-screen w-60 z-50 shadow-xl animate-slideIn relative overflow-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-3 left-3 text-[#e4e4e7]/70 hover:text-[#e4e4e7]"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="py-14 px-4">
          <h2 className="text-sm font-medium mb-6 text-center text-[#e4e4e7]/90">Connect</h2>
          
          <div className="flex flex-col space-y-5">
            <a 
              href="https://github.com/Mrinmoy-programmer07" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[#e4e4e7]/70 hover:text-[#e4e4e7] transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="text-xs">GitHub</span>
            </a>
            
            <a 
              href="https://www.instagram.com/with_.mrinmoy_/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[#e4e4e7]/70 hover:text-[#e4e4e7] transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="text-xs">Instagram</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/mrinmoy-das07/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[#e4e4e7]/70 hover:text-[#e4e4e7] transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="text-xs">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 