"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { apiClient, type Category } from "@/lib/api"
import { Filter, ChevronUp, ChevronDown, X } from "lucide-react"

export function CategoryDrawer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
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

  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Drawer */}
      <div className={`fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        {/* Always visible header */}
        <div 
          className="container mx-auto px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-primary" />
              <div>
                <span className="font-medium text-card-foreground">{info.text}</span>
                <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground">
                  {info.count}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClearAll()
                  }}
                  className="text-muted-foreground hover:text-primary"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
              {isOpen ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        {/* Expandable content */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-border">
            <Card className="border-none rounded-none bg-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Select Categories</span>
                  <Badge variant="outline" className="border-border text-muted-foreground">
                    {selectedCategories.length} selected
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-64 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <div key={category.slug} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.slug}
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={() => handleCategoryToggle(category.slug)}
                      />
                      <label
                        htmlFor={category.slug}
                        className="flex-1 flex items-center justify-between text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        <span className="text-card-foreground">{category.name}</span>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                          {category.article_count}
                        </Badge>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind the drawer */}
      <div className="h-16" />
    </>
  )
}