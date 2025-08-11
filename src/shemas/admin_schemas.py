from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from .article_schemas import ArticleListItem


class AdminStatsResponse(BaseModel):
    total_articles: int
    published_articles: int
    draft_articles: int
    flagged_articles: int
    total_categories: int
    newsletter_subscribers: int
    total_views: int
    accuracy_rate: float
    recent_articles: List[ArticleListItem]


class ContentFlagCreate(BaseModel):
    article_id: int
    reason: str = Field(..., max_length=100)
    description: str
    reporter_email: Optional[str] = None


class ContentFlagResponse(BaseModel):
    id: int
    article_id: int
    article_title: str
    reason: str
    description: str
    reporter_email: Optional[str]
    status: str
    flagged_at: datetime
    reviewed_at: Optional[datetime]
    reviewer_notes: Optional[str]

    class Config:
        from_attributes = True


class ModerationAction(BaseModel):
    action: str = Field(..., pattern="^(approve|reject)$")
    notes: Optional[str] = None