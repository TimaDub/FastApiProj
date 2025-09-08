"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, Search, User, Menu, Bell, Settings, LogOut, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const router = useRouter()
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-1 md:px-1 lg:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" suppressHydrationWarning />
            <span className="text-2xl font-bold text-foreground">NewsGuard</span>
            <Badge className="bg-primary text-primary-foreground text-xs lg:block hidden">Verified</Badge>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-6">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">
              Latest
            </Link>
            <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" suppressHydrationWarning />
              <Input
                placeholder="Search verified news..."
                className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground focus:border-ring w-32 lg:w-auto"
              />
            </div>

            {/* Admin Button */}
            {isAuthenticated && isAdmin && (
              <Link href="/admin">
                <Button 
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground flex items-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-muted-foreground hover:text-primary p-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profile_photo || "/placeholder.svg?height=32&width=32"} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user?.first_name ? user.first_name[0] : user?.username?.[0] || "U"}
                        {user?.last_name ? user.last_name[0] : user?.username?.[1] || ""}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border">
                  <DropdownMenuLabel className="text-card-foreground">{user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem className="text-muted-foreground hover:text-primary hover:bg-accent">
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem className="text-muted-foreground hover:text-primary hover:bg-accent">
                      <Link href="/admin" className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-muted-foreground hover:text-primary hover:bg-accent">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-muted-foreground hover:text-primary hover:bg-accent">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    className="text-muted-foreground hover:text-primary hover:bg-accent cursor-pointer"
                    onClick={() => {
                      logout()
                      router.push('/')
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                {/* Single Auth button for tablet range (768px-1023px) */}
                <div className="hidden md:block lg:hidden">
                  <Link href="/signin">
                    <Button className="bg-primary hover:bg-primary/90 text-xs px-2">
                      Auth
                    </Button>
                  </Link>
                </div>
                
                {/* Two separate buttons for large screens (1024px+) */}
                <div className="hidden lg:flex gap-2">
                  <Link href="/signin">
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-primary hover:bg-primary/90">Sign Up</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden text-muted-foreground hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" suppressHydrationWarning />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4 items-center">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-center">
                Home
              </Link>
              <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors text-center">
                Latest
              </Link>
              <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors text-center">
                Categories
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-center">
                About
              </Link>
              <div className="pt-4 border-t border-border">
                <Input
                  placeholder="Search verified news..."
                  className="mb-4 bg-input border-border text-foreground placeholder-muted-foreground"
                />
                {!isAuthenticated && (
                  <div className="flex gap-2 justify-center">
                    <Link href="/signin" className="flex-1">
                      <Button variant="outline" className="w-full border-border text-muted-foreground hover:text-primary bg-transparent">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
