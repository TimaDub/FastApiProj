from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ArticleBase(BaseModel):
    title: str = Field(..., max_length=200)
    content: str
    summary: Optional[str] = None
    author: str = Field(..., max_length=100)
    meta_description: Optional[str] = Field(None, max_length=160)
    featured_image: Optional[str] = None
    is_featured: bool = False
    is_breaking_news: bool = False


class ArticleCreate(ArticleBase):
    category_id: int
    slug: Optional[str] = None
    status: str = Field(default="draft", pattern="^(draft|published|archived)$")


class ArticleUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    content: Optional[str] = None
    summary: Optional[str] = None
    author: Optional[str] = Field(None, max_length=100)
    meta_description: Optional[str] = Field(None, max_length=160)
    featured_image: Optional[str] = None
    is_featured: Optional[bool] = None
    is_breaking_news: Optional[bool] = None
    category_id: Optional[int] = None
    status: Optional[str] = Field(None, pattern="^(draft|published|archived|flagged)$")


class CategorySummary(BaseModel):
    id: int
    name: str
    slug: str


class ArticleResponse(BaseModel):
    id: int
    title: str
    slug: str
    content: str
    summary: Optional[str]
    author: str
    status: str
    meta_description: Optional[str]
    featured_image: Optional[str]
    views_count: int
    likes_count: int
    dislikes_count: int = 0
    shares_count: int
    is_featured: bool
    is_trending: bool
    is_breaking_news: bool
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    category: CategorySummary

    class Config:
        from_attributes = True


class ArticleListItem(BaseModel):
    id: int
    title: str
    slug: str
    summary: Optional[str]
    author: str
    status: str
    featured_image: Optional[str]
    views_count: int
    likes_count: int
    dislikes_count: int = 0
    is_featured: bool
    is_trending: bool
    is_breaking_news: bool
    published_at: Optional[datetime]
    created_at: datetime
    category: CategorySummary

    class Config:
        from_attributes = True


class ArticleListResponse(BaseModel):
    items: List[ArticleListItem]
    total: int
    page: int
    limit: int
    pages: int


class TrendingArticleResponse(BaseModel):
    id: int
    title: str
    slug: str
    summary: Optional[str]
    author: str
    featured_image: Optional[str]
    views_count: int
    likes_count: int
    dislikes_count: int = 0
    published_at: Optional[datetime]
    category: CategorySummary

    class Config:
        from_attributes = True