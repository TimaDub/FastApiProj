from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from math import ceil

from db.models import Article, Category
from shemas.article_schemas import ArticleListResponse, ArticleListItem
from shemas.category_schemas import CategoryWithArticlesResponse
from config import settings

router = APIRouter()


@router.get("/{slug}/articles", response_model=ArticleListResponse)
async def get_articles_by_category(
    slug: str,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=settings.MAX_PAGE_SIZE),
    sort: str = Query("created_at", regex="^(created_at|views_count|title)$")
):
    """Get articles for specific category"""
    
    # Check if category exists
    category = await Category.get_or_none(slug=slug)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Build query for published articles in this category
    query = Article.filter(category=category, status="published")
    
    # Get total count
    total = await query.count()
    
    # Apply sorting
    if sort == "created_at":
        query = query.order_by("-created_at")
    elif sort == "views_count":
        query = query.order_by("-views_count")
    elif sort == "title":
        query = query.order_by("title")
    
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


@router.get("/{slug}", response_model=CategoryWithArticlesResponse)
async def get_category_with_articles(
    slug: str,
    limit: int = Query(5, ge=1, le=20)
):
    """Get category with recent articles"""
    
    # Get category
    category = await Category.get_or_none(slug=slug)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Get recent articles for this category
    articles = await Article.filter(
        category=category, 
        status="published"
    ).order_by("-created_at").limit(limit).prefetch_related("category")
    
    # Convert articles to response format
    article_items = []
    for article in articles:
        article_items.append(ArticleListItem(
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
    
    return CategoryWithArticlesResponse(
        id=category.id,
        name=category.name,
        slug=category.slug,
        description=category.description,
        created_at=category.created_at,
        updated_at=category.updated_at,
        articles=article_items
    )