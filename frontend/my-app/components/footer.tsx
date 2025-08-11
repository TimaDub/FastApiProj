import { Shield, Twitter, Facebook, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-400" suppressHydrationWarning />
              <span className="text-xl font-bold">NewsGuard</span>
            </div>
            <p className="text-gray-400 text-sm">
              Fighting misinformation with verified, fact-checked journalism. Your trusted source for truth.
            </p>
            <div className="flex gap-4">
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" suppressHydrationWarning />
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer" suppressHydrationWarning />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-400 cursor-pointer" suppressHydrationWarning />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-pointer" suppressHydrationWarning />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white">
                  Latest News
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/politics" className="text-gray-400 hover:text-white">
                  Politics
                </Link>
              </li>
              <li>
                <Link href="/category/technology" className="text-gray-400 hover:text-white">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/category/business" className="text-gray-400 hover:text-white">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/category/health" className="text-gray-400 hover:text-white">
                  Health
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/fact-check" className="text-gray-400 hover:text-white">
                  Fact-Check Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 NewsGuard. All rights reserved. Fighting misinformation since 2025.</p>
        </div>
      </div>
    </footer>
  )
}
