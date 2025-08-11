"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { apiClient, type Category } from "@/lib/api"

interface CategoryNavProps {
  onCategoryChange?: (category: string | null) => void
}

export function CategoryNav({ onCategoryChange }: CategoryNavProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState("All")
  const [categories, setCategories] = useState<Category[]>([])
  const [totalArticles, setTotalArticles] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await apiClient.getCategories()
        setCategories(response.items)

        // Calculate total articles
        const total = response.items.reduce((sum, cat) => sum + cat.article_count, 0)
        setTotalArticles(total)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    // Set active category from URL params
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      const category = categories.find(cat => cat.slug === categoryParam)
      setActiveCategory(category ? category.name : "All")
    } else {
      setActiveCategory("All")
    }
  }, [searchParams, categories])

  if (loading) {
    return (
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 w-24 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName)
    
    if (categoryName === "All") {
      // Remove category parameter
      router.push(window.location.pathname)
      onCategoryChange?.(null)
    } else {
      // Find category slug
      const category = categories.find(cat => cat.name === categoryName)
      if (category) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('category', category.slug)
        router.push(`${window.location.pathname}?${params.toString()}`)
        onCategoryChange?.(category.slug)
      }
    }
  }

  const allCategories = [
    { name: "All", articleCount: totalArticles, slug: null },
    ...categories.map((cat) => ({ name: cat.name, articleCount: cat.article_count, slug: cat.slug })),
  ]

  return (
    <div className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <Button
              key={category.name}
              variant={activeCategory === category.name ? "default" : "ghost"}
              className={`${
                activeCategory === category.name
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => handleCategoryClick(category.name)}
            >
              {category.name}
              <Badge variant="secondary" className="ml-2 bg-gray-600 text-gray-200" suppressHydrationWarning>
                {category.articleCount}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
