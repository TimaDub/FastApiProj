from contextlib import asynccontextmanager
from api.v1.routes.admin import router as admin_router
from api.v1.routes.router import router as main_router
from api.v1.routes.category import router as category_router
from api.v1.routes.articles import router as articles_router
from api.v1.routes.auth import router as auth_router
from config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import RegisterTortoise, tortoise_exception_handlers
from db.models import Category


DEFAULT_CATEGORIES = [
    {"name": "Technology", "slug": "technology", "description": "Latest tech news and innovations"},
    {"name": "Business", "slug": "business", "description": "Business news and market updates"},
    {"name": "Sports", "slug": "sports", "description": "Sports news and updates"},
    {"name": "Politics", "slug": "politics", "description": "Political news and government updates"},
    {"name": "Health", "slug": "health", "description": "Health and wellness news"},
    {"name": "Entertainment", "slug": "entertainment", "description": "Entertainment and celebrity news"},
    {"name": "Science", "slug": "science", "description": "Scientific discoveries and research"},
    {"name": "World", "slug": "world", "description": "International news and global events"}
]


async def seed_default_categories():
    """Create default categories if they don't exist"""
    for cat_data in DEFAULT_CATEGORIES:
        existing = await Category.get_or_none(slug=cat_data["slug"])
        if not existing:
            await Category.create(**cat_data)


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with RegisterTortoise(
        app=app,
        db_url=settings.DATABASE_URL,
        modules={"models": ["db.models"]},
        timezone="UTC",
        generate_schemas=True,
    ):
        # Seed default categories on startup
        await seed_default_categories()
        yield

app = FastAPI(
    lifespan=lifespan,
    exception_handlers=tortoise_exception_handlers(),
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.PROJECT_VERSION,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api", tags=["authentication"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
app.include_router(main_router, prefix="/api", tags=["public"])
app.include_router(category_router, prefix="/api/category", tags=["categories"])
app.include_router(articles_router, prefix="/api/articles", tags=["articles"])


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to NewsGuard API",
        "version": settings.PROJECT_VERSION,
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": settings.PROJECT_NAME}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=7070,
        log_level="info",
        reload=True
    )
