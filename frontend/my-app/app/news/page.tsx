"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { NewsCard } from "@/components/news-card"
import { apiClient } from "@/lib/api"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function NewsPage() {
  const searchParams = useSearchParams()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("created_at")

  const fetchArticles = async (categorySlugs?: string[]) => {
    setLoading(true)
    try {
      const response = await apiClient.getArticles({ 
        limit: 12, 
        sort: sortBy,
        ...(categorySlugs && categorySlugs.length > 0 && { categories: categorySlugs })
      })
      setArticles(response.items || [])
    } catch (error) {
      console.error("Failed to fetch news:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const categorySlugs = searchParams.getAll('category')
    fetchArticles(categorySlugs)
  }, [searchParams, sortBy])

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Latest Verified News</h1>
          <p className="text-muted-foreground mb-6">Stay informed with our comprehensive collection of fact-checked articles</p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" suppressHydrationWarning />
              <Input
                placeholder="Search articles..."
                className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground focus:border-ring"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40 bg-input border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="created_at">Newest First</SelectItem>
                  <SelectItem value="views_count">Most Popular</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-border text-muted-foreground hover:bg-accent bg-transparent">
                <Filter className="h-4 w-4 mr-2" suppressHydrationWarning />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="h-40 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button className="bg-primary hover:bg-primary/90">Load More Articles</Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">No articles available for this category.</p>
            <p className="text-sm">Try selecting a different category or check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
}
