from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgres://postgres:password@localhost:5432/postgres"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    
    # API Configuration
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "NewsGuard API"
    PROJECT_VERSION: str = "1.0.0"
    PROJECT_DESCRIPTION: str = "A comprehensive news platform API with article management, categories, and admin functionality"
    
    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001", "http://192.168.0.245:3000"]
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 10
    MAX_PAGE_SIZE: int = 100
    
    # Frontend URL (for CORS and environment)
    NEXT_PUBLIC_API_URL: str = "http://192.168.0.245:7070/api"
    FRONTEND_URL: str = "http://192.168.0.245:3000"
    
    # Admin settings
    ADMIN_EMAIL: Optional[str] = None
    ADMIN_PASSWORD: Optional[str] = None
    
    # Content moderation
    MAX_ARTICLE_TITLE_LENGTH: int = 200
    MAX_ARTICLE_CONTENT_LENGTH: int = 50000
    MAX_CATEGORY_NAME_LENGTH: int = 100
    
    # Newsletter
    MAX_NEWSLETTER_EMAILS: int = 100000
    
    # Search
    MAX_SEARCH_RESULTS: int = 100
    SEARCH_MIN_QUERY_LENGTH: int = 2
    
    # Trending articles
    TRENDING_ARTICLES_LIMIT: int = 10
    TRENDING_DAYS_THRESHOLD: int = 7
    
    # File uploads (if needed later)
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: list[str] = ["image/jpeg", "image/png", "image/webp"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()