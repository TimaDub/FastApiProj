from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime
from math import ceil
import slugify

from db.models import Article, Category, Newsletter, ContentFlag, ArticleView
from shemas.article_schemas import (
    ArticleCreate, ArticleUpdate, ArticleResponse, 
    ArticleListResponse, ArticleListItem
)
from shemas.admin_schemas import (
    AdminStatsResponse, ContentFlagResponse, 
    ModerationAction
)
from shemas.category_schemas import CategoryListResponse, CategoryResponse
from shemas.common_schemas import MessageResponse
from config import settings

router = APIRouter()


@router.get("/categories", response_model=CategoryListResponse)
async def get_admin_categories():
    """Get all categories for admin dropdowns"""
    
    categories = await Category.all().order_by("name")
    items = []
    
    for category in categories:
        items.append(CategoryResponse(
            id=category.id,
            name=category.name,
            slug=category.slug,
            description=category.description,
            created_at=category.created_at,
            updated_at=category.updated_at,
            article_count=0  # Not needed for admin dropdown
        ))
    
    return CategoryListResponse(
        items=items,
        total=len(items)
    )


@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats():
    """Get admin dashboard statistics"""
    
    # Get article counts by status
    total_articles = await Article.all().count()
    published_articles = await Article.filter(status="published").count()
    draft_articles = await Article.filter(status="draft").count()
    flagged_articles = await Article.filter(status="flagged").count()
    
    # Get other stats
    total_categories = await Category.all().count()
    newsletter_subscribers = await Newsletter.filter(is_active=True).count()
    total_views = await ArticleView.all().count()
    
    # Get recent articles (last 10)
    recent_articles_query = await Article.all().order_by("-created_at").limit(10).prefetch_related("category")
    
    recent_articles = []
    for article in recent_articles_query:
        recent_articles.append(ArticleListItem(
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
    
    return AdminStatsResponse(
        total_articles=total_articles,
        published_articles=published_articles,
        draft_articles=draft_articles,
        flagged_articles=flagged_articles,
        total_categories=total_categories,
        newsletter_subscribers=newsletter_subscribers,
        total_views=total_views,
        accuracy_rate=95.0,  # Placeholder
        recent_articles=recent_articles
    )


@router.get("/articles", response_model=ArticleListResponse)
async def get_admin_articles(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=settings.MAX_PAGE_SIZE),
    status: Optional[str] = Query(None, regex="^(draft|published|archived|flagged)$")
):
    """Get articles for admin management"""
    
    # Build query
    query = Article.all()
    
    # Add status filter
    if status:
        query = query.filter(status=status)
    
    # Get total count
    total = await query.count()
    
    # Apply pagination and ordering
    offset = (page - 1) * limit
    articles = await query.order_by("-created_at").offset(offset).limit(limit).prefetch_related("category")
    
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


@router.post("/articles", response_model=ArticleResponse)
async def create_article(article_data: ArticleCreate):
    """Create new article"""
    
    # Check if category exists
    category = await Category.get_or_none(id=article_data.category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Generate slug if not provided
    if not article_data.slug:
        slug = slugify.slugify(article_data.title)
        # Ensure slug is unique
        existing = await Article.get_or_none(slug=slug)
        if existing:
            slug = f"{slug}-{datetime.now().timestamp()}"
    else:
        slug = article_data.slug
        # Check if slug already exists
        existing = await Article.get_or_none(slug=slug)
        if existing:
            raise HTTPException(status_code=400, detail="Slug already exists")
    
    # Set published_at if status is published
    published_at = datetime.now() if article_data.status == "published" else None
    
    # Create article
    article = await Article.create(
        title=article_data.title,
        slug=slug,
        content=article_data.content,
        summary=article_data.summary,
        author=article_data.author,
        status=article_data.status,
        meta_description=article_data.meta_description,
        featured_image=article_data.featured_image,
        is_featured=article_data.is_featured,
        is_breaking_news=article_data.is_breaking_news,
        published_at=published_at,
        category=category
    )
    
    # Fetch with category data
    await article.fetch_related("category")
    
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


@router.put("/articles/{id}", response_model=ArticleResponse)
async def update_article(id: int, article_data: ArticleUpdate):
    """Update existing article"""
    
    article = await Article.get_or_none(id=id).prefetch_related("category")
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Update fields that are provided
    update_fields = []
    
    if article_data.title is not None:
        article.title = article_data.title
        update_fields.append("title")
    
    if article_data.content is not None:
        article.content = article_data.content
        update_fields.append("content")
    
    if article_data.summary is not None:
        article.summary = article_data.summary
        update_fields.append("summary")
    
    if article_data.author is not None:
        article.author = article_data.author
        update_fields.append("author")
    
    if article_data.meta_description is not None:
        article.meta_description = article_data.meta_description
        update_fields.append("meta_description")
    
    if article_data.featured_image is not None:
        article.featured_image = article_data.featured_image
        update_fields.append("featured_image")
    
    if article_data.is_featured is not None:
        article.is_featured = article_data.is_featured
        update_fields.append("is_featured")
    
    if article_data.is_breaking_news is not None:
        article.is_breaking_news = article_data.is_breaking_news
        update_fields.append("is_breaking_news")
    
    if article_data.category_id is not None:
        category = await Category.get_or_none(id=article_data.category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        article.category = category
        update_fields.append("category")
    
    if article_data.status is not None:
        old_status = article.status
        article.status = article_data.status
        update_fields.append("status")
        
        # Set published_at when publishing
        if old_status != "published" and article_data.status == "published":
            article.published_at = datetime.now()
            update_fields.append("published_at")
    
    # Update the article
    if update_fields:
        update_fields.append("updated_at")
        await article.save(update_fields=update_fields)
    
    # Ensure category is loaded
    await article.fetch_related("category")
    
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


@router.delete("/articles/{id}", response_model=MessageResponse)
async def delete_article(id: int):
    """Delete article"""
    
    article = await Article.get_or_none(id=id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    await article.delete()
    
    return MessageResponse(
        message="Article deleted successfully",
        success=True
    )


@router.get("/moderation/flagged", response_model=List[ContentFlagResponse])
async def get_flagged_content():
    """Get flagged content"""
    
    flags = await ContentFlag.filter(status="pending").prefetch_related("article")
    
    results = []
    for flag in flags:
        results.append(ContentFlagResponse(
            id=flag.id,
            article_id=flag.article.id,
            article_title=flag.article.title,
            reason=flag.reason,
            description=flag.description,
            reporter_email=flag.reporter_email,
            status=flag.status,
            flagged_at=flag.flagged_at,
            reviewed_at=flag.reviewed_at,
            reviewer_notes=flag.reviewer_notes
        ))
    
    return results


@router.post("/moderation/{id}/approve", response_model=MessageResponse)
async def approve_flagged_content(id: int, action: ModerationAction):
    """Approve flagged content"""
    
    flag = await ContentFlag.get_or_none(id=id).prefetch_related("article")
    if not flag:
        raise HTTPException(status_code=404, detail="Content flag not found")
    
    # Update flag status
    flag.status = "approved"
    flag.reviewed_at = datetime.now()
    flag.reviewer_notes = action.notes
    await flag.save()
    
    # Remove flagged status from article if it was flagged
    if flag.article.status == "flagged":
        flag.article.status = "published"  # Or back to previous status
        await flag.article.save()
    
    return MessageResponse(
        message="Content approved successfully",
        success=True
    )


@router.post("/moderation/{id}/reject", response_model=MessageResponse)
async def reject_flagged_content(id: int, action: ModerationAction):
    """Reject flagged content"""
    
    flag = await ContentFlag.get_or_none(id=id).prefetch_related("article")
    if not flag:
        raise HTTPException(status_code=404, detail="Content flag not found")
    
    # Update flag status
    flag.status = "rejected"
    flag.reviewed_at = datetime.now()
    flag.reviewer_notes = action.notes
    await flag.save()
    
    # Keep article flagged or take other action
    flag.article.status = "archived"  # Archive rejected content
    await flag.article.save()
    
    return MessageResponse(
        message="Content rejected and archived",
        success=True
    )