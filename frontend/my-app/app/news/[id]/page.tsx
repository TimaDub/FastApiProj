import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, Clock, Eye, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import { notFound } from "next/navigation"
import { ArticleInteractions } from "@/components/article-interactions"
import { ViewTracker } from "@/components/view-tracker"

async function getArticle(id: string) {
  try {
    return await apiClient.getArticle(id)
  } catch (error) {
    console.error(`Failed to fetch article ${id}:`, error)
    return null
  }
}

async function getRelatedArticles(category: {id: number, name: string, slug: string}, currentId: number) {
  try {
    const response = await apiClient.getCategoryArticles(category.slug, { limit: 4 })
    return response.items.filter((article) => article.id !== currentId).slice(0, 2)
  } catch (error) {
    console.error("Failed to fetch related articles:", error)
    return []
  }
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.category, article.id)

  const publishedDate = article.published_at 
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long", 
        day: "numeric",
      })
    : new Date(article.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ViewTracker articleId={article.id} />
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              {article.category.name}
            </Badge>
            {article.is_featured && (
              <Badge className="bg-green-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{article.title}</h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {publishedDate}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {Math.ceil((article.summary?.length || article.content.length) / 200)} min read
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {article.views_count.toLocaleString()} views
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-blue-600 text-white">
                  {article.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-medium">{article.author}</p>
                <p className="text-gray-400 text-sm">Staff Writer</p>
              </div>
            </div>

            {/* Action Buttons */}
            <ArticleInteractions 
              articleId={article.id}
              initialLikes={article.likes_count}
              initialDislikes={article.dislikes_count}
              title={article.title}
              variant="header"
            />
          </div>
        </header>

        {/* Featured Image */}
        {article.featured_image && (
          <div className="mb-8">
            <Image
              src={article.featured_image || "/placeholder.svg"}
              alt={article.title}
              width={800}
              height={500}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Verification Badge */}
        <Card className="bg-slate-800 border-slate-600 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Verified Content</h3>
            </div>
            <p className="text-gray-200 mb-4">
              This article has been thoroughly fact-checked and verified through our comprehensive review process,
              including AI-powered detection systems and expert editorial review.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-600">Fact-Checked</Badge>
              <Badge className="bg-indigo-600">Expert Reviewed</Badge>
              <Badge className="bg-purple-600">AI Verified</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Engagement */}
        <ArticleInteractions 
          articleId={article.id}
          initialLikes={article.likes_count}
          initialDislikes={article.dislikes_count}
          title={article.title}
        />

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Card key={relatedArticle.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <Badge variant="outline" className="border-gray-600 text-gray-300 mb-2">
                      {relatedArticle.category.name}
                    </Badge>
                    <h3 className="text-white font-medium mb-2">
                      <Link href={`/news/${relatedArticle.id}`} className="hover:text-blue-400">
                        {relatedArticle.title}
                      </Link>
                    </h3>
                    <p className="text-gray-400 text-sm">{relatedArticle.summary?.substring(0, 100) || relatedArticle.content.substring(0, 100)}...</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}
