"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Shield, Plus, Edit, Trash2, Eye, Users, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { apiClient, type AdminStats, type AdminArticlesResponse, type CreateArticleRequest, type Category } from "@/lib/api"

export default function AdminPage() {
  const [newArticle, setNewArticle] = useState<CreateArticleRequest>({
    title: "",
    content: "",
    summary: "",
    author: "",
    meta_description: "",
    featured_image: "",
    is_featured: false,
    is_breaking_news: false,
    category_id: 0,
    slug: "",
    status: "draft",
  })

  const [stats, setStats] = useState<AdminStats>({
    total_articles: 0,
    published_articles: 0,
    draft_articles: 0,
    flagged_articles: 0,
    total_categories: 0,
    newsletter_subscribers: 0,
    total_views: 0,
    accuracy_rate: 0,
    recent_articles: [],
  })

  const [articles, setArticles] = useState<AdminArticlesResponse["items"]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const [statsData, articlesData, categoriesData] = await Promise.all([
          apiClient.getAdminStats(),
          apiClient.getAdminArticles({ limit: 10 }),
          apiClient.getAdminCategories(),
        ])

        setStats(statsData)
        setArticles(articlesData.items)
        setCategories(categoriesData.items)
      } catch (error) {
        console.error("Failed to fetch admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate category is selected
    if (newArticle.category_id === 0) {
      alert("Please select a category")
      return
    }
    
    try {
      await apiClient.createArticle(newArticle)
      console.log("Article created successfully")
      // Reset form
      setNewArticle({
        title: "",
        content: "",
        summary: "",
        author: "",
        meta_description: "",
        featured_image: "",
        is_featured: false,
        is_breaking_news: false,
        category_id: 0,
        slug: "",
        status: "draft",
      })
      // Refresh articles list
      const articlesData = await apiClient.getAdminArticles({ limit: 10 })
      setArticles(articlesData.items)
    } catch (error) {
      console.error("Failed to create article:", error)
    }
  }

  const handleDeleteArticle = async (articleId: number, articleTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${articleTitle}"? This action cannot be undone.`)) {
      return
    }
    
    try {
      await apiClient.deleteArticle(articleId.toString())
      console.log("Article deleted successfully")
      // Refresh articles list
      const articlesData = await apiClient.getAdminArticles({ limit: 10 })
      setArticles(articlesData.items)
      // Refresh stats
      const statsData = await apiClient.getAdminStats()
      setStats(statsData)
    } catch (error) {
      console.error("Failed to delete article:", error)
      alert("Failed to delete article. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-4"></div>
            <div className="h-4 bg-muted rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-card rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" suppressHydrationWarning />
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Manage content, users, and platform settings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Articles</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total_articles}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" suppressHydrationWarning />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Draft Articles</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.draft_articles}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" suppressHydrationWarning />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Newsletter Subscribers</p>
                  <p className="text-2xl font-bold text-primary">{stats.newsletter_subscribers}</p>
                </div>
                <Users className="h-8 w-8 text-primary" suppressHydrationWarning />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Flagged Content</p>
                  <p className="text-2xl font-bold text-red-400">{stats.flagged_articles}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" suppressHydrationWarning />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="bg-card border-border">
            <TabsTrigger value="articles" className="data-[state=active]:bg-muted">
              <FileText className="h-4 w-4 mr-2" suppressHydrationWarning />
              Articles
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-muted">
              <Plus className="h-4 w-4 mr-2" suppressHydrationWarning />
              Create Article
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-muted">
              <Users className="h-4 w-4 mr-2" suppressHydrationWarning />
              Users
            </TabsTrigger>
            <TabsTrigger value="moderation" className="data-[state=active]:bg-muted">
              <Shield className="h-4 w-4 mr-2" suppressHydrationWarning />
              Moderation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Article Management</CardTitle>
                <CardDescription className="text-muted-foreground">Manage published and pending articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articles.length > 0 ? (
                    articles.map((article) => (
                      <div key={article.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-foreground font-medium mb-1">{article.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>By {article.author}</span>
                              <Badge variant="outline" className="border-gray-600 text-gray-300">
                                {typeof article.category === 'object' ? article.category.name : article.category}
                              </Badge>
                              <Badge
                                variant={article.status === "published" ? "default" : "secondary"}
                                className={article.status === "published" ? "bg-green-600" : "bg-yellow-600"}
                              >
                                {article.status}
                              </Badge>
                              {/* Verified badge - will be updated when backend adds this field */ false && (
                                <Badge className="bg-primary">
                                  <Shield className="h-3 w-3 mr-1" suppressHydrationWarning />
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {article.status === "published" && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mr-4">
                                <Eye className="h-4 w-4" suppressHydrationWarning />
                                {article.views_count?.toLocaleString()}
                              </div>
                            )}
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                              <Edit className="h-4 w-4" suppressHydrationWarning />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteArticle(article.id, article.title)}
                            >
                              <Trash2 className="h-4 w-4" suppressHydrationWarning />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No articles found.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Create New Article</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Publish verified news content to the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateArticle} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-300">
                      Article Title
                    </Label>
                    <Input
                      id="title"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter article title"
                      className="bg-muted border-gray-600 text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary" className="text-gray-300">
                      Summary
                    </Label>
                    <textarea
                      id="summary"
                      value={newArticle.summary}
                      onChange={(e) => setNewArticle((prev) => ({ ...prev, summary: e.target.value }))}
                      placeholder="Brief description of the article"
                      className="w-full px-3 py-2 bg-muted border border-gray-600 rounded-md text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-300">
                        Category
                      </Label>
                      <Select
                        value={newArticle.category_id === 0 ? "" : newArticle.category_id.toString()}
                        onValueChange={(value) => setNewArticle((prev) => ({ ...prev, category_id: parseInt(value) }))}
                      >
                        <SelectTrigger className="bg-muted border-gray-600 text-foreground">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-muted border-gray-600">
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author" className="text-gray-300">
                        Author
                      </Label>
                      <Input
                        id="author"
                        value={newArticle.author}
                        onChange={(e) => setNewArticle((prev) => ({ ...prev, author: e.target.value }))}
                        placeholder="Author name"
                        className="bg-muted border-gray-600 text-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slug" className="text-gray-300">
                        Slug (Optional)
                      </Label>
                      <Input
                        id="slug"
                        value={newArticle.slug}
                        onChange={(e) => setNewArticle((prev) => ({ ...prev, slug: e.target.value }))}
                        placeholder="article-url-slug"
                        className="bg-muted border-gray-600 text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="featured_image" className="text-gray-300">
                        Featured Image URL
                      </Label>
                      <Input
                        id="featured_image"
                        value={newArticle.featured_image}
                        onChange={(e) => setNewArticle((prev) => ({ ...prev, featured_image: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        className="bg-muted border-gray-600 text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_description" className="text-gray-300">
                      Meta Description (SEO)
                    </Label>
                    <textarea
                      id="meta_description"
                      value={newArticle.meta_description}
                      onChange={(e) => setNewArticle((prev) => ({ ...prev, meta_description: e.target.value }))}
                      placeholder="SEO meta description (max 160 characters)"
                      className="w-full px-3 py-2 bg-muted border border-gray-600 rounded-md text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                      maxLength={160}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-gray-300">
                      Article Content
                    </Label>
                    <textarea
                      id="content"
                      value={newArticle.content}
                      onChange={(e) => setNewArticle((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your article content here..."
                      className="w-full px-3 py-2 bg-muted border border-gray-600 rounded-md text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={10}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_featured"
                          checked={newArticle.is_featured}
                          onCheckedChange={(checked) => setNewArticle((prev) => ({ ...prev, is_featured: checked }))}
                        />
                        <Label htmlFor="is_featured" className="text-gray-300">
                          Featured Article
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_breaking_news"
                          checked={newArticle.is_breaking_news}
                          onCheckedChange={(checked) => setNewArticle((prev) => ({ ...prev, is_breaking_news: checked }))}
                        />
                        <Label htmlFor="is_breaking_news" className="text-gray-300">
                          Breaking News
                        </Label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-gray-300">
                          Status
                        </Label>
                        <Select
                          value={newArticle.status}
                          onValueChange={(value) => setNewArticle((prev) => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger className="bg-muted border-gray-600 text-foreground w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-muted border-gray-600">
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-accent bg-transparent"
                      >
                        Save Draft
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Publish Article
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">User Management</CardTitle>
                <CardDescription className="text-muted-foreground">Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" suppressHydrationWarning />
                  <p>User management interface coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Content Moderation</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Review flagged content and manage fake news detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.flagged_articles > 0 ? (
                    <div className="border border-slate-600 rounded-lg p-4 bg-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-400" suppressHydrationWarning />
                          <div>
                            <h4 className="text-foreground font-medium">Suspicious Content Detected</h4>
                            <p className="text-sm text-muted-foreground">AI flagged potential misinformation</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-600">Pending Review</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-primary/90">
                          <CheckCircle className="h-4 w-4 mr-1" suppressHydrationWarning />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-destructive hover:text-primary bg-transparent"
                        >
                          <Trash2 className="h-4 w-4 mr-1" suppressHydrationWarning />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" suppressHydrationWarning />
                      <p>No flagged content at this time</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
