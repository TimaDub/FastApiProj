import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata: Metadata = {
  title: "NewsGuard - Verified News & Anti-Fake News Platform",
  description:
    "Your trusted source for verified, fact-checked journalism. Fighting misinformation with AI-powered detection.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-gray-900 text-white text-base font-normal">
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
