"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: number
  username: string
  email: string
  first_name: string | null
  last_name: string | null
  profile_photo: string | null
  is_active: boolean
  is_verified: boolean
  created_at: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (token: string, userData: User, adminStatus: boolean) => void
  logout: () => void
  updateUser: (userData: User) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication on app load
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    const adminStatus = localStorage.getItem('is_admin')

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        const parsedAdmin = JSON.parse(adminStatus || 'false')
        setUser(parsedUser)
        setIsAdmin(parsedAdmin)
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        localStorage.removeItem('is_admin')
      }
    }
    setLoading(false)
  }, [])

  const login = (token: string, userData: User, adminStatus: boolean) => {
    localStorage.setItem('access_token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('is_admin', JSON.stringify(adminStatus))
    setUser(userData)
    setIsAdmin(adminStatus)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.removeItem('is_admin')
    setUser(null)
    setIsAdmin(false)
  }

  const updateUser = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin,
    login,
    logout,
    updateUser,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}