from fastapi import APIRouter, HTTPException, Request
from typing import Optional
from datetime import datetime

from db.models import Article, ArticleView
from shemas.article_schemas import ArticleResponse
from shemas.common_schemas import MessageResponse

router = APIRouter()


@router.get("/{id}", response_model=ArticleResponse)
async def get_article_by_id(id: int, request: Request):
    """Get single article by ID and track view"""
    
    article = await Article.get_or_none(
        id=id, 
        status="published"
    ).prefetch_related("category")
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Track view (get IP from request)
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "")
    
    # Create view record
    await ArticleView.create(
        article=article,
        ip_address=client_ip,
        user_agent=user_agent
    )
    
    # Increment view count
    article.views_count += 1
    await article.save(update_fields=["views_count"])
    
    # Return article data
    return ArticleResponse(
        id=article.id,
        title=article.title,
        slug=article.slug,
        content=article.content,
        summary=article.summary,
        author=article.author,
        status=article.status,
        meta_description=article.meta_description,
        featured_image=article.featured_image,
        views_count=article.views_count,
        likes_count=article.likes_count,
        dislikes_count=getattr(article, 'dislikes_count', 0),
        shares_count=article.shares_count,
        is_featured=article.is_featured,
        is_trending=article.is_trending,
        is_breaking_news=article.is_breaking_news,
        published_at=article.published_at,
        created_at=article.created_at,
        updated_at=article.updated_at,
        category={
            "id": article.category.id,
            "name": article.category.name,
            "slug": article.category.slug
        }
    )


@router.post("/{id}/like", response_model=MessageResponse)
async def like_article(id: int):
    """Like an article (increment like count)"""
    
    article = await Article.get_or_none(id=id, status="published")
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    article.likes_count += 1
    await article.save(update_fields=["likes_count"])
    
    return MessageResponse(
        message=f"Article liked! Total likes: {article.likes_count}",
        success=True
    )


@router.post("/{id}/dislike", response_model=MessageResponse)
async def dislike_article(id: int):
    """Dislike an article (increment dislike count)"""
    
    article = await Article.get_or_none(id=id, status="published")
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    article.dislikes_count += 1
    await article.save(update_fields=["dislikes_count"])
    
    return MessageResponse(
        message=f"Article disliked! Total dislikes: {article.dislikes_count}",
        success=True
    )


@router.post("/{id}/share", response_model=MessageResponse) 
async def share_article(id: int):
    """Share an article (increment share count)"""
    
    article = await Article.get_or_none(id=id, status="published")
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    article.shares_count += 1
    await article.save(update_fields=["shares_count"])
    
    return MessageResponse(
        message=f"Article shared! Total shares: {article.shares_count}",
        success=True
    )