from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List
from tortoise.queryset import Q
from math import ceil

from db.models import Article, Category, Newsletter, SiteStats, ArticleView
from shemas.article_schemas import ArticleListResponse, ArticleListItem, TrendingArticleResponse
from shemas.category_schemas import CategoryListResponse, CategoryResponse
from shemas.newsletter_schemas import NewsletterSubscribe, NewsletterResponse
from shemas.common_schemas import StatsResponse, SearchResponse, MessageResponse
from config import settings

router = APIRouter()


@router.get("/articles", response_model=ArticleListResponse)
async def get_articles(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=settings.MAX_PAGE_SIZE),
    category: Optional[List[str]] = Query(None),
    search: Optional[str] = None,
    sort: str = Query("created_at", regex="^(created_at|views_count|title|featured)$")
):
    """Get all published articles with pagination and filtering"""
    
    # Build query
    query = Article.filter(status="published")
    
    # Add category filter (OR logic for multiple categories)
    if category:
        category_q = Q()
        for cat in category:
            category_q |= Q(category__slug=cat)
        query = query.filter(category_q)
    
    # Add search filter
    if search:
        query = query.filter(
            Q(title__icontains=search) | 
            Q(content__icontains=search) |
            Q(summary__icontains=search)
        )
    
    # Get total count
    total = await query.count()
    
    # Apply sorting
    if sort == "created_at":
        query = query.order_by("-created_at")
    elif sort == "views_count":
        query = query.order_by("-views_count")
    elif sort == "title":
        query = query.order_by("title")
    elif sort == "featured":
        query = query.order_by("-is_featured", "-created_at")
    
    # Apply pagination
    offset = (page - 1) * limit
    articles = await query.offset(offset).limit(limit).prefetch_related("category")
    
    # Convert to response format
    items = []
    for article in articles:
        items.append(ArticleListItem(
            id=article.id,
            title=article.title,
            slug=article.slug,
            summary=article.summary,
            author=article.author,
            status=article.status,
            featured_image=article.featured_image,
            views_count=article.views_count,
            likes_count=article.likes_count,
            dislikes_count=getattr(article, 'dislikes_count', 0),
            is_featured=article.is_featured,
            is_trending=article.is_trending,
            is_breaking_news=article.is_breaking_news,
            published_at=article.published_at,
            created_at=article.created_at,
            category={
                "id": article.category.id,
                "name": article.category.name,
                "slug": article.category.slug
            }
        ))
    
    pages = ceil(total / limit)
    
    return ArticleListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )


@router.get("/categories", response_model=CategoryListResponse)
async def get_categories():
    """Get all categories with article counts"""
    
    categories = await Category.all()
    items = []
    
    for category in categories:
        article_count = await Article.filter(category=category, status="published").count()
        items.append(CategoryResponse(
            id=category.id,
            name=category.name,
            slug=category.slug,
            description=category.description,
            created_at=category.created_at,
            updated_at=category.updated_at,
            article_count=article_count
        ))
    
    return CategoryListResponse(
        items=items,
        total=len(items)
    )


@router.get("/categories/{slug}")
async def get_category_by_slug(slug: str):
    """Get category details by slug"""
    
    category = await Category.get_or_none(slug=slug)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    article_count = await Article.filter(category=category, status="published").count()
    
    return CategoryResponse(
        id=category.id,
        name=category.name,
        slug=category.slug,
        description=category.description,
        created_at=category.created_at,
        updated_at=category.updated_at,
        article_count=article_count
    )


@router.get("/stats", response_model=StatsResponse)
async def get_stats():
    """Get platform statistics"""
    
    # Calculate real-time stats
    total_articles = await Article.filter(status="published").count()
    total_views = await ArticleView.all().count()
    
    # Try to get existing stats for accuracy rate, or use default
    stats = await SiteStats.first()
    accuracy_rate = stats.accuracy_rate if stats else 95.0
    
    # Update or create stats record
    if stats:
        stats.total_articles = total_articles
        stats.total_views = total_views
        await stats.save(update_fields=["total_articles", "total_views", "last_updated"])
    else:
        stats = await SiteStats.create(
            total_articles=total_articles,
            total_users=0,  # Will be implemented when user system is added
            total_views=total_views,
            accuracy_rate=accuracy_rate
        )
    
    return StatsResponse(
        total_articles=total_articles,
        total_users=0,  # Will be implemented when user system is added
        accuracy_rate=accuracy_rate
    )


@router.get("/trending", response_model=List[TrendingArticleResponse])
async def get_trending_articles(limit: int = Query(10, ge=1, le=50)):
    """Get trending articles"""
    
    articles = await Article.filter(
        status="published",
        is_trending=True
    ).order_by("-views_count").limit(limit).prefetch_related("category")
    
    results = []
    for article in articles:
        results.append(TrendingArticleResponse(
            id=article.id,
            title=article.title,
            slug=article.slug,
            summary=article.summary,
            author=article.author,
            featured_image=article.featured_image,
            views_count=article.views_count,
            likes_count=article.likes_count,
            dislikes_count=getattr(article, 'dislikes_count', 0),
            published_at=article.published_at,
            category={
                "id": article.category.id,
                "name": article.category.name,
                "slug": article.category.slug
            }
        ))
    
    return results


@router.get("/search", response_model=SearchResponse)
async def search_articles(
    q: str = Query(..., min_length=settings.SEARCH_MIN_QUERY_LENGTH),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=settings.MAX_SEARCH_RESULTS),
    category: Optional[List[str]] = Query(None)
):
    """Search articles"""
    
    # Build search query
    query = Article.filter(
        status="published"
    ).filter(
        Q(title__icontains=q) | 
        Q(content__icontains=q) |
        Q(summary__icontains=q) |
        Q(author__icontains=q)
    )
    
    # Add category filter (OR logic for multiple categories)
    if category:
        category_q = Q()
        for cat in category:
            category_q |= Q(category__slug=cat)
        query = query.filter(category_q)
    
    # Get total count
    total = await query.count()
    
    # Apply pagination
    offset = (page - 1) * limit
    articles = await query.offset(offset).limit(limit).prefetch_related("category")
    
    # Convert to response format
    results = []
    for article in articles:
        results.append({
            "id": article.id,
            "title": article.title,
            "slug": article.slug,
            "summary": article.summary,
            "author": article.author,
            "featured_image": article.featured_image,
            "views_count": article.views_count,
            "published_at": article.published_at,
            "category": {
                "id": article.category.id,
                "name": article.category.name,
                "slug": article.category.slug
            }
        })
    
    return SearchResponse(
        query=q,
        results=results,
        total=total,
        page=page,
        limit=limit
    )


@router.post("/newsletter", response_model=MessageResponse)
async def subscribe_newsletter(subscription: NewsletterSubscribe):
    """Subscribe to newsletter"""
    
    try:
        # Check if email already exists
        existing = await Newsletter.get_or_none(email=subscription.email)
        if existing:
            if existing.is_active:
                return MessageResponse(
                    message="Email is already subscribed to newsletter",
                    success=True
                )
            else:
                # Reactivate subscription
                existing.is_active = True
                existing.unsubscribed_at = None
                await existing.save()
                return MessageResponse(
                    message="Newsletter subscription reactivated successfully",
                    success=True
                )
        
        # Create new subscription
        await Newsletter.create(email=subscription.email)
        return MessageResponse(
            message="Successfully subscribed to newsletter",
            success=True
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))