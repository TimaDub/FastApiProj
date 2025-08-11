from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class NewsletterSubscribe(BaseModel):
    email: EmailStr


class NewsletterResponse(BaseModel):
    id: int
    email: str
    is_active: bool
    subscribed_at: datetime
    unsubscribed_at: Optional[datetime]

    class Config:
        from_attributes = True