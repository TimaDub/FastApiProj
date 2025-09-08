const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.0.245:7070/api"

// API Client with error handling
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Articles endpoints
  async getArticles(params?: {
    page?: number
    limit?: number
    category?: string
    categories?: string[]
    search?: string
    sort?: string
  }): Promise<ArticlesResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    
    // Support both single category and multiple categories
    if (params?.category) searchParams.append("category", params.category)
    if (params?.categories && params.categories.length > 0) {
      params.categories.forEach(cat => searchParams.append("category", cat))
    }
    
    if (params?.search) searchParams.append("search", params.search)
    if (params?.sort) searchParams.append("sort", params.sort)

    const query = searchParams.toString()
    return this.request<ArticlesResponse>(`/articles${query ? `?${query}` : ""}`)
  }

  async getArticle(id: string): Promise<Article> {
    return this.request<Article>(`/articles/${id}`)
  }

  async likeArticle(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/articles/${id}/like`, {
      method: "POST",
    })
  }

  async dislikeArticle(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/articles/${id}/dislike`, {
      method: "POST",
    })
  }

  async shareArticle(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/articles/${id}/share`, {
      method: "POST",
    })
  }

  // Categories endpoints
  async getCategories(): Promise<CategoriesResponse> {
    return this.request<CategoriesResponse>("/categories")
  }

  async getCategory(slug: string): Promise<Category> {
    return this.request<Category>(`/categories/${slug}`)
  }

  async getCategoryArticles(
    slug: string,
    params?: {
      page?: number
      limit?: number
      sort?: string
    },
  ): Promise<ArticlesResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.sort) searchParams.append("sort", params.sort)

    const query = searchParams.toString()
    return this.request<ArticlesResponse>(`/category/${slug}/articles${query ? `?${query}` : ""}`)
  }

  // Platform stats
  async getStats(): Promise<PlatformStats> {
    return this.request<PlatformStats>("/stats")
  }

  // Trending articles
  async getTrending(limit?: number): Promise<TrendingArticle[]> {
    return this.request<TrendingArticle[]>(`/trending${limit ? `?limit=${limit}` : ""}`)
  }

  // Search
  async search(
    query: string,
    params?: {
      page?: number
      limit?: number
      category?: string
      categories?: string[]
    },
  ): Promise<ArticlesResponse> {
    const searchParams = new URLSearchParams({ q: query })
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    
    // Support both single category and multiple categories
    if (params?.category) searchParams.append("category", params.category)
    if (params?.categories && params.categories.length > 0) {
      params.categories.forEach(cat => searchParams.append("category", cat))
    }

    return this.request<ArticlesResponse>(`/search?${searchParams.toString()}`)
  }

  // Newsletter
  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>("/newsletter", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  // Admin endpoints
  async getAdminStats(): Promise<AdminStats> {
    return this.request<AdminStats>("/admin/stats")
  }

  async getAdminArticles(params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<AdminArticlesResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.status) searchParams.append("status", params.status)

    const query = searchParams.toString()
    return this.request<AdminArticlesResponse>(`/admin/articles${query ? `?${query}` : ""}`)
  }

  async createArticle(article: CreateArticleRequest): Promise<Article> {
    return this.request<Article>("/admin/articles", {
      method: "POST",
      body: JSON.stringify(article),
    })
  }

  async updateArticle(id: string, article: UpdateArticleRequest): Promise<Article> {
    return this.request<Article>(`/admin/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(article),
    })
  }

  async deleteArticle(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/admin/articles/${id}`, {
      method: "DELETE",
    })
  }

  async getAdminCategories(): Promise<CategoriesResponse> {
    return this.request<CategoriesResponse>("/admin/categories")
  }

  // Moderation endpoints
  async getFlaggedContent(): Promise<FlaggedContentResponse> {
    return this.request<FlaggedContentResponse>("/admin/moderation/flagged")
  }

  async approveContent(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/admin/moderation/${id}/approve`, {
      method: "POST",
    })
  }

  async rejectContent(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/admin/moderation/${id}/reject`, {
      method: "POST",
    })
  }
}

// Types for API responses
export interface Article {
  id: number
  title: string
  slug: string
  content: string
  summary?: string
  author: string
  status: string
  meta_description?: string
  featured_image?: string
  views_count: number
  likes_count: number
  dislikes_count: number
  shares_count: number
  is_featured: boolean
  is_trending: boolean
  is_breaking_news: boolean
  published_at?: string
  created_at: string
  updated_at: string
  category: {
    id: number
    name: string
    slug: string
  }
}

export interface ArticlesResponse {
  items: Article[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
  article_count: number
}

export interface CategoriesResponse {
  items: Category[]
  total: number
}

export interface PlatformStats {
  total_articles: number
  total_users: number
  accuracy_rate: number
}

export interface TrendingArticle {
  id: number
  title: string
  slug: string
  summary?: string
  author: string
  featured_image?: string
  views_count: number
  likes_count: number
  dislikes_count: number
  published_at?: string
  category: {
    id: number
    name: string
    slug: string
  }
}

export interface AdminStats {
  total_articles: number
  published_articles: number
  draft_articles: number
  flagged_articles: number
  total_categories: number
  newsletter_subscribers: number
  total_views: number
  accuracy_rate: number
  recent_articles: Article[]
}

export interface AdminArticlesResponse {
  items: Article[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface CreateArticleRequest {
  title: string
  content: string
  summary?: string
  author: string
  meta_description?: string
  featured_image?: string
  is_featured: boolean
  is_breaking_news: boolean
  category_id: number
  slug?: string
  status: string
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  status?: "published" | "draft" | "pending"
}

export interface FlaggedContentResponse {
  flaggedItems: Array<{
    id: string
    type: "article" | "comment"
    title: string
    reason: string
    flaggedAt: string
    status: "pending" | "approved" | "rejected"
  }>
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL)

// Export API base URL for reference
export { API_BASE_URL }
