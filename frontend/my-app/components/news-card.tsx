import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, Shield, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Article {
  id: number
  title: string
  summary?: string
  author: string
  published_at?: string
  views_count: number
  is_featured: boolean
  featured_image?: string
  category: {
    id: number
    name: string
    slug: string
  }
}

interface NewsCardProps {
  article: Article
  featured?: boolean
}

export function NewsCard({ article, featured = false }: NewsCardProps) {
  const publishedDate = article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Draft'

  return (
    <div className={featured ? "flex h-64 lg:h-80 bg-card rounded-lg overflow-hidden border border-border hover:bg-card/90 transition-colors" : ""}>
      {featured ? (
        <>
          {/* Image taking up 50% with rounded left corners */}
          <div className="w-1/2 relative">
            <Image
              src={article.featured_image || "/placeholder.svg"}
              alt={article.title}
              width={1200}
              height={500}
              className="w-full h-full object-cover rounded-l-lg"
              suppressHydrationWarning
            />
            {/* Gradient overlay that fades from transparent to the box color */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent from-0% via-transparent via-70% to-[#27293c] to-100% rounded-l-lg"></div>
          </div>
          
          {/* Colored info box taking up 50% */}
          <div className="w-1/2 bg-card flex flex-col justify-center p-4 lg:p-6">
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                  {article.category.name}
                </Badge>
                {article.is_featured && (
                  <Badge className="bg-primary text-primary-foreground text-xs" suppressHydrationWarning>
                    <Shield className="h-3 w-3 mr-1" suppressHydrationWarning />
                    Featured
                  </Badge>
                )}
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-foreground hover:text-primary transition-colors leading-tight">
                <Link href={`/news/${article.id}`}>{article.title}</Link>
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm lg:text-base line-clamp-3">{article.summary}</p>
              <div className="flex flex-col gap-2 text-xs lg:text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 lg:h-4 lg:w-4" suppressHydrationWarning />
                    <span className="truncate">{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 lg:h-4 lg:w-4" suppressHydrationWarning />
                    {Math.ceil((article.summary?.length || 0) / 200)} min
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 lg:h-4 lg:w-4" suppressHydrationWarning />
                    {article.views_count.toLocaleString()}
                  </div>
                  <span>{publishedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Card className="bg-card border-border hover:bg-card/90 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="border-border text-muted-foreground">
                {article.category.name}
              </Badge>
              {article.is_featured && (
                <Badge className="bg-primary text-primary-foreground" suppressHydrationWarning>
                  <Shield className="h-3 w-3 mr-1" suppressHydrationWarning />
                  Featured
                </Badge>
              )}
            </div>
            <CardTitle className="text-card-foreground hover:text-primary transition-colors">
              <Link href={`/news/${article.id}`}>{article.title}</Link>
            </CardTitle>
            <CardDescription className="text-muted-foreground">{article.summary}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" suppressHydrationWarning />
                  {article.author}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" suppressHydrationWarning />
                  {Math.ceil((article.summary?.length || 0) / 200)} min read
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" suppressHydrationWarning />
                  {article.views_count.toLocaleString()}
                </div>
                <span>{publishedDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
