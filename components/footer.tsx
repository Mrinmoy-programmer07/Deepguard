import Link from "next/link"
import { Github, Linkedin, Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#0a0d14] border-t border-[#1e2330] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-[#3b82f6]" />
              <span className="text-lg font-bold bg-gradient-to-r from-[#3b82f6] to-[#10b981] bg-clip-text text-transparent">
                DeepGuard
              </span>
            </div>
            <p className="text-sm text-[#e4e4e7]/70 mb-4">
              Advanced AI-powered deepfake detection platform to protect digital authenticity.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com/Mrinmoy-programmer07" target="_blank" rel="noopener noreferrer" className="text-[#e4e4e7]/70 hover:text-[#3b82f6] transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-[#e4e4e7]/70 hover:text-[#3b82f6] transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-[#e4e4e7]/70 hover:text-[#3b82f6] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#e4e4e7]/70 hover:text-[#3b82f6] transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#e4e4e7]/70 hover:text-[#3b82f6] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#e4e4e7]/70 hover:text-[#3b82f6] transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-[#e4e4e7]/70 hover:text-[#3b82f6] transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#e4e4e7]/70 hover:text-[#3b82f6] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#e4e4e7]/70 hover:text-[#3b82f6] transition-colors">
                  Research
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#e4e4e7]/70 hover:text-[#3b82f6] transition-colors">
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-[#e4e4e7]/70 hover:text-[#3b82f6] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#e4e4e7]/70 hover:text-[#3b82f6] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#e4e4e7]/70 hover:text-[#3b82f6] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#e4e4e7]/70 hover:text-[#3b82f6] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1e2330] text-center text-sm text-[#e4e4e7]/50">
          <p>© 2025 DeepGuard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
