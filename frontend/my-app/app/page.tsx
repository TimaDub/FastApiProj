"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { NewsCard } from "@/components/news-card"
import { CategorySidebar } from "@/components/category-sidebar"
import { apiClient } from "@/lib/api"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Filter } from "lucide-react"

export default function HomePage() {
  const searchParams = useSearchParams()
  const [featuredNews, setFeaturedNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const fetchData = async (categorySlugs?: string[]) => {
    setLoading(true)
    try {
      const featuredResponse = await apiClient.getArticles({ 
        limit: 6, 
        sort: "featured",
        ...(categorySlugs && categorySlugs.length > 0 && { categories: categorySlugs })
      })
      
      setFeaturedNews(featuredResponse.items || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const categorySlugs = searchParams.getAll('category')
    fetchData(categorySlugs)
  }, [searchParams])


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Category Sidebar */}
      <CategorySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="w-full">
          {/* Featured News */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Latest Verified News</h2>
            <div className="flex items-center gap-3">
              <Link href="/news">
                <Button variant="outline" className="border-border text-foreground hover:bg-accent hover:text-primary bg-transparent">
                  View All News
                </Button>
              </Link>
              <Button
                onClick={() => setIsSidebarOpen(true)}
                className="bg-primary hover:bg-primary/90"
                size="sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Categories
              </Button>
            </div>
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
              <div>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No articles available for this category.</p>
                </div>
                <div className="h-max items-center">
                  <img className="mx-auto" src="/no-results.png" alt="No Articles" width="200" height="200"></img>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
