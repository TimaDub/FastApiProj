"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Shield, MessageCircle, LinkIcon, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [telegramConnected, setTelegramConnected] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    telegram: false,
  })

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    telegramUsername: "",
  })

  // Pre-populate form with user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        bio: "", // Bio is not in the current user model
        telegramUsername: "",
      })
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!user) return
    
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return
      
      const response = await fetch('http://192.168.0.245:7070/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: profile.firstName,
          last_name: profile.lastName
        })
      })
      
      if (response.ok) {
        const updatedUser = await response.json()
        updateUser(updatedUser)
        console.log('Profile updated successfully')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleConnectTelegram = () => {
    // Handle Telegram connection logic
    setTelegramConnected(!telegramConnected)
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-700">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-700">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-gray-700">
              <LinkIcon className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-gray-700">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.profile_photo || "/placeholder.svg?height=80&width=80"} />
                    <AvatarFallback className="bg-blue-600 text-white text-xl">
                      {profile.firstName ? profile.firstName[0] : user?.username?.[0] || "U"}
                      {profile.lastName ? profile.lastName[0] : user?.username?.[1] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file && user) {
                          setUploading(true)
                          try {
                            // Convert file to base64 data URL for simple storage
                            const reader = new FileReader()
                            reader.onload = async (event) => {
                              const dataUrl = event.target?.result as string
                              
                              const token = localStorage.getItem('access_token')
                              if (!token) return
                              
                              const response = await fetch('http://192.168.0.245:7070/api/auth/profile', {
                                method: 'PUT',
                                headers: {
                                  'Authorization': `Bearer ${token}`,
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                  profile_photo: dataUrl
                                })
                              })
                              
                              if (response.ok) {
                                const updatedUser = await response.json()
                                updateUser(updatedUser)
                                console.log('Profile photo updated successfully')
                              }
                              setUploading(false)
                            }
                            reader.readAsDataURL(file)
                          } catch (error) {
                            console.error('Failed to update profile photo:', error)
                            setUploading(false)
                          }
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Change Photo'}
                    </Button>
                    <p className="text-sm text-gray-400 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-300">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-300">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>

                <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose how you want to be notified about news updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-400">Receive news updates via email</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Push Notifications</h4>
                      <p className="text-sm text-gray-400">Get instant notifications in your browser</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Telegram Notifications</h4>
                      <p className="text-sm text-gray-400">Receive updates via Telegram bot</p>
                    </div>
                    <Switch
                      checked={notifications.telegram}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, telegram: checked }))}
                      disabled={!telegramConnected}
                    />
                  </div>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Connected Accounts</CardTitle>
                <CardDescription className="text-gray-400">
                  Connect your social accounts for enhanced features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border border-slate-600 rounded-lg p-4 bg-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-8 w-8 text-blue-400" />
                      <div>
                        <h4 className="text-white font-medium">Telegram</h4>
                        <p className="text-sm text-gray-400">Connect your Telegram account to receive news updates</p>
                      </div>
                    </div>
                    <Badge
                      variant={telegramConnected ? "default" : "secondary"}
                      className={telegramConnected ? "bg-blue-600" : "bg-gray-600"}
                    >
                      {telegramConnected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>

                  {telegramConnected ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Username:</span>
                        <span className="text-white">@{profile.telegramUsername || user?.username}</span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleConnectTelegram}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                      >
                        Disconnect Telegram
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Input
                        placeholder="Enter your Telegram username"
                        value={profile.telegramUsername}
                        onChange={(e) => setProfile((prev) => ({ ...prev, telegramUsername: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Button
                        onClick={handleConnectTelegram}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={!profile.telegramUsername}
                      >
                        Connect Telegram
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border border-gray-700 rounded-lg p-4 opacity-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-400">X</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Twitter/X</h4>
                        <p className="text-sm text-gray-400">Coming soon</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-gray-600">
                      Coming Soon
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Security Settings</CardTitle>
                <CardDescription className="text-gray-400">Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Change Password</h4>
                    <div className="space-y-3">
                      <Input
                        type="password"
                        placeholder="Current password"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Input
                        type="password"
                        placeholder="New password"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Button className="bg-blue-600 hover:bg-blue-700">Update Password</Button>
                    </div>
                  </div>


                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-red-400 font-medium mb-2">Danger Zone</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      Permanently delete your account and all associated data
                    </p>
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
