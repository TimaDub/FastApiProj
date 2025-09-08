"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function SignUpPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }
    
    try {
      const response = await fetch("http://192.168.0.245:7070/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.email, // Using email as username
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Sign up failed")
      }
      
      const data = await response.json()
      
      // Use auth context to store authentication state
      login(data.access_token, data.user, data.is_admin)
      
      // Subscribe to newsletter if requested
      if (formData.subscribeNewsletter) {
        try {
          await fetch("http://192.168.0.245:7070/api/newsletter", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: formData.email })
          })
        } catch {
          // Newsletter signup is optional, don't fail the whole process
        }
      }
      
      // Redirect to home page
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-card-foreground">NewsGuard</span>
          </div>
          <CardTitle className="text-card-foreground">Create Account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Join our community of truth-seekers and get access to verified news
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-muted-foreground">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-ring"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-muted-foreground">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-ring"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-ring pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-muted-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-ring pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-primary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  className="border-border data-[state=checked]:bg-primary"
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:text-primary/90">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:text-primary/90">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={formData.subscribeNewsletter}
                  onCheckedChange={(checked) => handleInputChange("subscribeNewsletter", checked as boolean)}
                  className="border-border data-[state=checked]:bg-primary"
                />
                <Label htmlFor="newsletter" className="text-sm text-muted-foreground">
                  Subscribe to our newsletter for verified news updates
                </Label>
              </div>
            </div>

            {error && (
              <div className="text-destructive text-sm text-center bg-destructive/10 border border-destructive/20 rounded p-2">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={!formData.agreeToTerms || loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <Separator className="my-6 bg-border" />

          <div className="space-y-3">
            <Button variant="outline" className="w-full border-border text-muted-foreground hover:bg-accent bg-transparent">
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full border-border text-muted-foreground hover:bg-accent bg-transparent">
              Continue with GitHub
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:text-primary/90">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
