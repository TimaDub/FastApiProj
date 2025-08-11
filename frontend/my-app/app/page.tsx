"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"
import { NewsCard } from "@/components/news-card"
import { CategoryNav } from "@/components/category-nav"
import { apiClient } from "@/lib/api"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const searchParams = useSearchParams()
  const [featuredNews, setFeaturedNews] = useState<any[]>([])
  const [trendingNews, setTrendingNews] = useState<any[]>([])
  const [stats, setStats] = useState({ total_articles: 0, total_users: 0, accuracy_rate: 0 })
  const [loading, setLoading] = useState(true)

  const fetchData = async (categorySlug?: string | null) => {
    setLoading(true)
    try {
      const [featuredResponse, trendingResponse, statsResponse] = await Promise.all([
        apiClient.getArticles({ 
          limit: 3, 
          sort: "featured",
          ...(categorySlug && { category: categorySlug })
        }),
        apiClient.getTrending(6),
        apiClient.getStats()
      ])
      
      setFeaturedNews(featuredResponse.items || [])
      setTrendingNews(trendingResponse || [])
      setStats(statsResponse || { total_articles: 0, total_users: 0, accuracy_rate: 0 })
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const categorySlug = searchParams.get('category')
    fetchData(categorySlug)
  }, [searchParams])

  const handleCategoryChange = (categorySlug: string | null) => {
    fetchData(categorySlug)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-16 border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-primary" suppressHydrationWarning />
              <h1 className="text-4xl md:text-6xl font-bold">NewsGuard</h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Your trusted source for verified, fact-checked journalism
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                <Shield className="h-4 w-4 mr-1" suppressHydrationWarning />
                Fake News Detection
              </Badge>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                <Eye className="h-4 w-4 mr-1" suppressHydrationWarning />
                Fact Verified
              </Badge>
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                <TrendingUp className="h-4 w-4 mr-1" suppressHydrationWarning />
                Real-time Updates
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <CategoryNav onCategoryChange={handleCategoryChange} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured News */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Latest Verified News</h2>
              <Link href="/news">
                <Button variant="outline" className="border-border text-foreground hover:bg-accent bg-transparent">
                  View All News
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : featuredNews.length > 0 ? (
                featuredNews.map((article) => <NewsCard key={article.id} article={article} featured />)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No articles available for this category.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending News */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <TrendingUp className="h-5 w-5" suppressHydrationWarning />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trendingNews.length > 0 ? (
                  trendingNews.map((article) => (
                    <div key={article.id} className="border-b border-border pb-3 last:border-b-0">
                      <Link href={`/news/${article.id}`} className="block hover:text-primary transition-colors">
                        <h4 className="font-medium text-sm mb-2 text-card-foreground">{article.title}</h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <Badge variant="outline" className="border-border text-muted-foreground">
                            {article.category.name}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" suppressHydrationWarning />
                            {article.views_count.toLocaleString()}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No trending articles available.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Platform Stats */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Shield className="h-5 w-5" suppressHydrationWarning />
                  Platform Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Articles:</span>
                  <span className="text-card-foreground font-medium">{stats.total_articles.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Users:</span>
                  <span className="text-primary font-medium">{stats.total_users.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accuracy Rate:</span>
                  <span className="text-primary font-medium">{stats.accuracy_rate}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Anti-Fake News Info */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Shield className="h-5 w-5" suppressHydrationWarning />
                  Fighting Misinformation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Every article is verified through our AI-powered fact-checking system and reviewed by our editorial
                  team.
                </CardDescription>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90">Learn More</Button>
              </CardContent>
            </Card>

            {/* Newsletter Signup - Only show when not authenticated */}
            {!isAuthenticated && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Stay Informed</CardTitle>
                  <CardDescription className="text-muted-foreground">Get verified news delivered to your inbox</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button className="bg-primary hover:bg-primary/90">Subscribe</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
