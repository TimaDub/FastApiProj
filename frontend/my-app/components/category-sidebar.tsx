"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { apiClient, type Category } from "@/lib/api"
import { X, Filter } from "lucide-react"

interface CategorySidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CategorySidebar({ isOpen, onClose }: CategorySidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
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
    // Parse selected categories from URL
    const categoryParams = searchParams.getAll('category')
    setSelectedCategories(categoryParams)
  }, [searchParams])

  const handleCategoryToggle = (categorySlug: string) => {
    const newSelected = selectedCategories.includes(categorySlug)
      ? selectedCategories.filter(slug => slug !== categorySlug)
      : [...selectedCategories, categorySlug]
    
    setSelectedCategories(newSelected)
    updateURL(newSelected)
  }

  const handleClearAll = () => {
    setSelectedCategories([])
    updateURL([])
  }

  const updateURL = (selectedSlugs: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Remove all existing category parameters
    params.delete('category')
    
    // Add new category parameters
    selectedSlugs.forEach(slug => {
      params.append('category', slug)
    })
    
    const newUrl = selectedSlugs.length > 0 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname
    
    router.push(newUrl)
  }

  const getSelectedCategoriesInfo = () => {
    if (selectedCategories.length === 0) return { count: totalArticles, text: "All Categories" }
    
    const selectedCats = categories.filter(cat => selectedCategories.includes(cat.slug))
    const count = selectedCats.reduce((sum, cat) => sum + cat.article_count, 0)
    const text = selectedCategories.length === 1 
      ? selectedCats[0]?.name || ""
      : `${selectedCategories.length} categories selected`
    
    return { count, text }
  }

  const info = getSelectedCategoriesInfo()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-card border-l border-border z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <Card className="h-full border-none rounded-none bg-transparent">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Categories Filter
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-primary"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-muted-foreground">
                {info.text}
              </div>
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                {info.count} articles
              </Badge>
            </div>
            
            {selectedCategories.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="mt-2 w-full border-border text-muted-foreground hover:text-primary"
              >
                Clear All Filters
              </Button>
            )}
          </CardHeader>
          
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded flex-1 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {categories.map((category) => (
                  <div key={category.slug} className="flex items-center space-x-3 p-2 rounded hover:bg-accent transition-colors">
                    <Checkbox
                      id={category.slug}
                      checked={selectedCategories.includes(category.slug)}
                      onCheckedChange={() => handleCategoryToggle(category.slug)}
                    />
                    <label
                      htmlFor={category.slug}
                      className="flex-1 flex items-center justify-between text-sm font-medium leading-none cursor-pointer"
                    >
                      <span className="text-card-foreground">{category.name}</span>
                      <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                        {category.article_count}
                      </Badge>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}