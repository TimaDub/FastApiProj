from pydantic import BaseModel, EmailStr
from typing import Generic, List, TypeVar, Optional, Any
from datetime import datetime

T = TypeVar('T')


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    limit: int
    pages: int


class MessageResponse(BaseModel):
    message: str
    success: bool = True


class StatsResponse(BaseModel):
    total_articles: int
    total_users: int
    accuracy_rate: float
    

class SearchResponse(BaseModel):
    query: str
    results: List[Any]
    total: int
    page: int
    limit: int


# Authentication Schemas
class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserSignin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    profile_photo: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class AdminResponse(BaseModel):
    id: int
    role: str
    permissions: List[str]
    user: UserResponse
    created_at: datetime
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    is_admin: bool = False


class ModerationAction(BaseModel):
    content_type: str
    content_id: int
    action: str
    reason: Optional[str] = None
    notes: Optional[str] = None


class ModerationResponse(BaseModel):
    id: int
    content_type: str
    content_id: int
    action: str
    reason: Optional[str]
    notes: Optional[str]
    status: str
    moderated_at: datetime
    moderator: UserResponse
    
    class Config:
        from_attributes = True