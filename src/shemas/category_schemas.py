from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    slug: Optional[str] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    slug: Optional[str] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime
    article_count: int = 0

    class Config:
        from_attributes = True


class CategoryListResponse(BaseModel):
    items: List[CategoryResponse]
    total: int


class CategoryWithArticlesResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime
    articles: List["ArticleListItem"] = []

    class Config:
        from_attributes = True


# Import after definition to avoid circular imports
from .article_schemas import ArticleListItem
CategoryWithArticlesResponse.model_rebuild()