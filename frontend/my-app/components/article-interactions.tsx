'use client'

import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Share2, Bookmark } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/toast"
import { apiClient } from "@/lib/api"

interface ArticleInteractionsProps {
  articleId: number
  initialLikes: number
  initialDislikes?: number
  title: string
  variant?: 'header' | 'engagement'
}

export function ArticleInteractions({ 
  articleId, 
  initialLikes, 
  initialDislikes = 0,
  title,
  variant = 'engagement'
}: ArticleInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)
  const [userLiked, setUserLiked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)
  const { showToast, ToastContainer } = useToast()

  const handleLike = async () => {
    if (userLiked) {
      setLikes(likes - 1)
      setUserLiked(false)
      showToast('Like removed', 'info')
    } else {
      try {
        await apiClient.likeArticle(articleId.toString())
        setLikes(likes + 1)
        setUserLiked(true)
        showToast('Article liked!', 'success')
        if (userDisliked) {
          setDislikes(dislikes - 1)
          setUserDisliked(false)
        }
      } catch (error) {
        showToast('Failed to like article', 'error')
        console.error('Like error:', error)
      }
    }
  }

  const handleDislike = async () => {
    if (userDisliked) {
      setDislikes(dislikes - 1)
      setUserDisliked(false)
      showToast('Dislike removed', 'info')
    } else {
      try {
        await apiClient.dislikeArticle(articleId.toString())
        setDislikes(dislikes + 1)
        setUserDisliked(true)
        showToast('Article disliked', 'info')
        if (userLiked) {
          setLikes(likes - 1)
          setUserLiked(false)
        }
      } catch (error) {
        showToast('Failed to dislike article', 'error')
        console.error('Dislike error:', error)
      }
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/news/${articleId}`
    
    try {
      // Call the API to increment share count
      await apiClient.shareArticle(articleId.toString())
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: `Check out this article: ${title}`,
            url: url,
          })
        } catch (err) {
          console.log('Error sharing:', err)
          handleFallbackShare(url)
        }
      } else {
        handleFallbackShare(url)
      }
    } catch (error) {
      console.error('Share API error:', error)
      // Still allow sharing even if API fails
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: `Check out this article: ${title}`,
            url: url,
          })
        } catch (err) {
          handleFallbackShare(url)
        }
      } else {
        handleFallbackShare(url)
      }
    }
  }

  const handleFallbackShare = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Article link copied to clipboard!', 'success')
    }).catch(() => {
      showToast('Failed to copy link to clipboard', 'error')
    })
  }

  const handleSave = () => {
    const telegramUrl = `https://t.me/NewsGuard_bot?start=${articleId}`
    window.open(telegramUrl, '_blank')
    showToast('Opening Telegram bot...', 'success')
  }

  if (variant === 'header') {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            onClick={handleSave}
          >
            <Bookmark className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
        <ToastContainer />
      </>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between py-6 border-t border-b border-gray-700 mb-8">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            className={`text-gray-400 hover:text-white ${userLiked ? 'text-green-400' : ''}`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-5 w-5 mr-2" />
            {likes}
          </Button>
          <Button 
            variant="ghost" 
            className={`text-gray-400 hover:text-white ${userDisliked ? 'text-red-400' : ''}`}
            onClick={handleDislike}
          >
            <ThumbsDown className="h-5 w-5 mr-2" />
            {dislikes}
          </Button>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Article
        </Button>
      </div>
      <ToastContainer />
    </>
  )
}