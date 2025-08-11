# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a FastAPI news platform with a Next.js frontend, featuring article management, categories, and admin functionality. The project uses Tortoise ORM with AsyncPG for database operations and includes both public and admin API endpoints.

## Architecture

### Backend (FastAPI)
- **Main app**: `src/main.py` - FastAPI application with lifespan management and Tortoise ORM integration
- **API structure**: Modular router-based architecture under `src/api/v1/routes/`
  - `articles.py` - Article CRUD operations
  - `category.py` - Category management  
  - `admin.py` - Admin dashboard and moderation
  - `router.py` - Main public routes
- **Database**: Tortoise ORM models in `src/db/models.py`
- **Configuration**: Settings management in `src/config/`
- **Schemas**: Pydantic models in `src/shemas/` (note: misspelled directory name)

### Frontend (Next.js)
- **Location**: `frontend/my-app/`
- **Framework**: Next.js 15.2.4 with React 19, TypeScript, and Tailwind CSS
- **UI Components**: Radix UI components with custom styling
- **API Integration**: Connects to backend at `http://localhost:7070/api`

## Development Commands

### Backend
```bash
# Run development server
python src/main.py
# or
uvicorn src.main:app --reload --host localhost --port 7070

# Install dependencies
uv sync
```

### Frontend
```bash
cd frontend/my-app

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## API Endpoints

The backend serves a comprehensive news platform API:

### Public Routes (`/api/`)
- Articles: GET `/articles`, GET `/articles/{id}`
- Categories: GET `/categories`, GET `/categories/{slug}`
- Search: GET `/search`
- Statistics: GET `/stats`, GET `/trending`
- Newsletter: POST `/newsletter`

### Admin Routes (`/api/admin/`)
- Dashboard: GET `/admin/stats`
- Article Management: GET/POST/PUT/DELETE `/admin/articles`
- Moderation: GET `/admin/moderation/flagged`, POST `/admin/moderation/{id}/approve`

### Category Routes (`/api/category/`)
- Category-specific article listings

## Database Configuration

- **ORM**: Tortoise ORM with AsyncPG driver
- **URL**: Configured via `settings.DATABASE_URL`
- **Models**: Located in `db.models` module
- **Migrations**: Auto-generated schemas enabled

## Key Dependencies

### Backend
- FastAPI 0.116.1+ for API framework
- Tortoise ORM 0.25.1+ with AsyncPG for database
- Uvicorn for ASGI server
- Pydantic Settings for configuration
- Loguru for logging

### Frontend  
- Next.js 15.2.4 with Turbopack for development
- React 19 with TypeScript
- Tailwind CSS 4 for styling
- Radix UI for accessible components
- Lucide React for icons

## Project Structure Notes

- Most route files are currently empty (0 lines) - this appears to be a project in early development
- The main application structure is set up but implementation is minimal
- Frontend is fully configured with comprehensive API endpoint documentation in README.md
- Uses modern Python packaging with `pyproject.toml` and UV for dependency management