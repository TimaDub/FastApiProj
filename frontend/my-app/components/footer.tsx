import { Shield, Twitter, Facebook, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" suppressHydrationWarning />
              <span className="text-xl font-bold">NewsGuard</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Fighting misinformation with verified, fact-checked journalism. Your trusted source for truth.
            </p>
            <div className="flex gap-4">
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" suppressHydrationWarning />
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" suppressHydrationWarning />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" suppressHydrationWarning />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" suppressHydrationWarning />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-primary">
                  Latest News
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
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
                <Link href="/category/politics" className="text-muted-foreground hover:text-primary">
                  Politics
                </Link>
              </li>
              <li>
                <Link href="/category/technology" className="text-muted-foreground hover:text-primary">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/category/business" className="text-muted-foreground hover:text-primary">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/category/health" className="text-muted-foreground hover:text-primary">
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
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/fact-check" className="text-muted-foreground hover:text-primary">
                  Fact-Check Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 NewsGuard. All rights reserved. Fighting misinformation since 2025.</p>
        </div>
      </div>
    </footer>
  )
}
