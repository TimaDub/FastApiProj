#!/usr/bin/env python3
"""
Script to populate the database with default news categories.
Run this script to add 8 common news categories to the database.
"""

import sys
import os
import asyncio
from pathlib import Path

# Add the src directory to Python path
current_dir = Path(__file__).parent
src_dir = current_dir.parent / "src"
sys.path.insert(0, str(src_dir))

from tortoise import Tortoise
from db.models import Category
from config import settings


async def create_categories():
    """Create default news categories."""
    
    categories = [
        {
            "name": "Politics",
            "slug": "politics",
            "description": "Political news, government updates, and policy discussions"
        },
        {
            "name": "Technology",
            "slug": "technology", 
            "description": "Tech industry news, innovations, and digital trends"
        },
        {
            "name": "Business",
            "slug": "business",
            "description": "Market updates, corporate news, and economic analysis"
        },
        {
            "name": "Health",
            "slug": "health",
            "description": "Healthcare news, medical breakthroughs, and wellness topics"
        },
        {
            "name": "Science",
            "slug": "science",
            "description": "Scientific discoveries, research findings, and innovation"
        },
        {
            "name": "Environment",
            "slug": "environment",
            "description": "Climate change, sustainability, and environmental issues"
        },
        {
            "name": "Sports",
            "slug": "sports",
            "description": "Sports news, matches, tournaments, and athlete updates"
        },
        {
            "name": "Entertainment",
            "slug": "entertainment",
            "description": "Movies, music, celebrities, and pop culture news"
        }
    ]
    
    print("Creating news categories...")
    
    for category_data in categories:
        # Check if category already exists
        existing = await Category.get_or_none(slug=category_data["slug"])
        if existing:
            print(f"  ✓ Category '{category_data['name']}' already exists")
            continue
            
        # Create new category
        await Category.create(**category_data)
        print(f"  ✓ Created category: {category_data['name']}")
    
    # Show final count
    total_categories = await Category.all().count()
    print(f"\nTotal categories in database: {total_categories}")


async def main():
    """Main function to initialize database and create categories."""
    try:
        # Initialize database connection
        print("Connecting to database...")
        await Tortoise.init(
            db_url=settings.DATABASE_URL,
            modules={"models": ["db.models"]}
        )
        
        # Create categories
        await create_categories()
        
        print("\n✅ Categories seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    finally:
        # Close database connection
        await Tortoise.close_connections()


if __name__ == "__main__":
    asyncio.run(main())