'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  articleId: number
}

export function ViewTracker({ articleId }: ViewTrackerProps) {
  useEffect(() => {
    const sessionKey = `viewed_article_${articleId}`
    const hasViewed = sessionStorage.getItem(sessionKey)
    
    if (!hasViewed) {
      // Mark as viewed in session storage
      sessionStorage.setItem(sessionKey, 'true')
      
      // Here you would typically make an API call to increment views
      // For now, we'll just log it
      console.log(`Tracking view for article ${articleId}`)
      
      // Example API call (uncomment when backend endpoint is ready):
      // fetch(`/api/articles/${articleId}/view`, { 
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // }).catch(console.error)
    }
  }, [articleId])

  return null // This component doesn't render anything
}