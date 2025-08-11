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
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-400" suppressHydrationWarning />
            <span className="text-2xl font-bold text-white">NewsGuard</span>
            <Badge className="bg-green-600 text-white text-xs">Verified</Badge>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/news" className="text-gray-300 hover:text-white transition-colors">
              Latest News
            </Link>
            <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
          </nav>

          {/* Search */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" suppressHydrationWarning />
              <Input
                placeholder="Search verified news..."
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>

            {/* Admin Button */}
            {isAuthenticated && isAdmin && (
              <Link href="/admin">
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
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
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profile_photo || "/placeholder.svg?height=32&width=32"} />
                      <AvatarFallback className="bg-blue-600 text-white text-sm">
                        {user?.first_name ? user.first_name[0] : user?.username?.[0] || "U"}
                        {user?.last_name ? user.last_name[0] : user?.username?.[1] || ""}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700">
                  <DropdownMenuLabel className="text-white">{user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                      <Link href="/admin" className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
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
                <Link href="/signin">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" suppressHydrationWarning />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/news" className="text-gray-300 hover:text-white transition-colors">
                Latest News
              </Link>
              <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
                Categories
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <div className="pt-4 border-t border-gray-700">
                <Input
                  placeholder="Search verified news..."
                  className="mb-4 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
                {!isAuthenticated && (
                  <div className="flex gap-2">
                    <Link href="/signin" className="flex-1">
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300 bg-transparent">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign Up</Button>
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
