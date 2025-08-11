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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="bg-gray-800 py-16 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-blue-400" suppressHydrationWarning />
              <h1 className="text-4xl md:text-6xl font-bold">NewsGuard</h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Your trusted source for verified, fact-checked journalism
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-blue-600 text-white">
                <Shield className="h-4 w-4 mr-1" suppressHydrationWarning />
                Fake News Detection
              </Badge>
              <Badge variant="secondary" className="bg-slate-600 text-white">
                <Eye className="h-4 w-4 mr-1" suppressHydrationWarning />
                Fact Verified
              </Badge>
              <Badge variant="secondary" className="bg-indigo-600 text-white">
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
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                  View All News
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-pulse">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : featuredNews.length > 0 ? (
                featuredNews.map((article) => <NewsCard key={article.id} article={article} featured />)
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No articles available for this category.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending News */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5" suppressHydrationWarning />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trendingNews.length > 0 ? (
                  trendingNews.map((article) => (
                    <div key={article.id} className="border-b border-gray-700 pb-3 last:border-b-0">
                      <Link href={`/news/${article.id}`} className="block hover:text-blue-400 transition-colors">
                        <h4 className="font-medium text-sm mb-2 text-gray-200">{article.title}</h4>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
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
                  <div className="text-center py-4 text-gray-400">
                    <p className="text-sm">No trending articles available.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Platform Stats */}
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" suppressHydrationWarning />
                  Platform Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Articles:</span>
                  <span className="text-white font-medium">{stats.total_articles.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Users:</span>
                  <span className="text-green-400 font-medium">{stats.total_users.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Accuracy Rate:</span>
                  <span className="text-blue-400 font-medium">{stats.accuracy_rate}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Anti-Fake News Info */}
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" suppressHydrationWarning />
                  Fighting Misinformation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-200">
                  Every article is verified through our AI-powered fact-checking system and reviewed by our editorial
                  team.
                </CardDescription>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Learn More</Button>
              </CardContent>
            </Card>

            {/* Newsletter Signup - Only show when not authenticated */}
            {!isAuthenticated && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Stay Informed</CardTitle>
                  <CardDescription className="text-gray-400">Get verified news delivered to your inbox</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
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
