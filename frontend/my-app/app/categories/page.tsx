"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, Filter, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { apiClient, type Category, type PlatformStats, type Article } from "@/lib/api"
import { NewsCard } from "@/components/news-card"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

// Category icons mapping
const categoryIcons = {
  politics: "🏛️",
  technology: "💻",
  business: "💼",
  health: "🏥",
  science: "🔬",
  environment: "🌱",
  sports: "🏆",
  entertainment: "🎬",
}

export default function CategoriesPage() {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')
  
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState<PlatformStats>({
    total_articles: 0,
    total_users: 0,
    accuracy_rate: 0,
  })
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, statsData] = await Promise.all([
          apiClient.getCategories(),
          apiClient.getStats(),
        ])
        
        setCategories(categoriesData.items)
        setStats(statsData)

        // If a category is selected via URL, set it as active and fetch its articles
        if (selectedCategory) {
          setActiveTab(selectedCategory)
          const categoryArticles = await apiClient.getCategoryArticles(selectedCategory, { limit: 12 })
          setArticles(categoryArticles.items)
        } else {
          // Fetch all articles for "all" tab
          const allArticles = await apiClient.getArticles({ limit: 12 })
          setArticles(allArticles.items)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory])

  const handleTabChange = async (value: string) => {
    setActiveTab(value)
    setLoading(true)
    
    try {
      if (value === "all") {
        const allArticles = await apiClient.getArticles({ limit: 12 })
        setArticles(allArticles.items)
      } else {
        const categoryArticles = await apiClient.getCategoryArticles(value, { limit: 12 })
        setArticles(categoryArticles.items)
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-48 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <section className="bg-gray-800 py-16 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">News Categories</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore verified news across all topics. Every article is fact-checked and verified by our editorial team.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" suppressHydrationWarning />
              <Input
                placeholder="Search categories or topics..."
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <TabsList className="bg-gray-800 border-gray-700 flex-wrap h-auto p-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">
              All Categories
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger 
                key={category.slug} 
                value={category.slug} 
                className="data-[state=active]:bg-gray-700"
              >
                <span className="mr-2">
                  {categoryIcons[category.slug as keyof typeof categoryIcons] || "📰"}
                </span>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.slug} onClick={() => handleTabChange(category.slug)}>
                    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-200 h-full cursor-pointer group">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-3 rounded-lg bg-gray-700">
                            <span className="text-2xl">
                              {categoryIcons[category.slug as keyof typeof categoryIcons] || "📰"}
                            </span>
                          </div>
                          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                            {category.article_count} articles
                          </Badge>
                        </div>
                        <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="text-gray-400">{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Recent Activity</span>
                            <div className="flex items-center gap-1 text-green-400">
                              <TrendingUp className="h-3 w-3" suppressHydrationWarning />
                              <span className="text-xs">Active</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {category.article_count > 0 ? "Recently updated" : "No articles yet"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-400">
                  <p>No categories available at the moment.</p>
                </div>
              )}
            </div>

            {/* Show all articles when "all" tab is selected */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Latest Articles</h2>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Updated recently</span>
                </div>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-64 bg-gray-800 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-lg mb-2">No articles available at the moment.</p>
                  <p className="text-sm">Check back soon for the latest verified news.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Individual category tabs */}
          {categories.map((category) => (
            <TabsContent key={category.slug} value={category.slug}>
              <div className="space-y-8">
                {/* Category Header */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gray-700">
                      <span className="text-3xl">
                        {categoryIcons[category.slug as keyof typeof categoryIcons] || "📰"}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
                      <p className="text-gray-300">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{category.article_count}</div>
                      <div className="text-gray-400 text-sm">Articles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">100%</div>
                      <div className="text-gray-400 text-sm">Verified</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">24/7</div>
                      <div className="text-gray-400 text-sm">Updated</div>
                    </div>
                  </div>
                </div>

                {/* Articles for this category */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Latest {category.name} Articles</h2>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Updated recently</span>
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-64 bg-gray-800 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {articles.map((article) => (
                        <NewsCard key={article.id} article={article} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-lg mb-2">No articles available in this category yet.</p>
                      <p className="text-sm">Check back soon for the latest verified news.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Stats */}
        <section>
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-center">Platform Statistics</CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Our commitment to verified journalism across all categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">{stats.total_articles.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Total Articles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-400 mb-2">{categories.length}</div>
                  <div className="text-gray-400 text-sm">Categories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">{stats.accuracy_rate}%</div>
                  <div className="text-gray-400 text-sm">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
                  <div className="text-gray-400 text-sm">Fact Checking</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
