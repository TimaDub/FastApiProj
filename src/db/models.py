from tortoise.models import Model
from tortoise import fields
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=50, unique=True)
    email = fields.CharField(max_length=255, unique=True)
    password_hash = fields.CharField(max_length=255)
    first_name = fields.CharField(max_length=50, null=True)
    last_name = fields.CharField(max_length=50, null=True)
    profile_photo = fields.CharField(max_length=500, null=True)
    
    is_active = fields.BooleanField(default=True)
    is_verified = fields.BooleanField(default=False)
    
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    last_login = fields.DatetimeField(null=True)
    
    class Meta:
        table = "users"
        
    def set_password(self, password: str):
        self.password_hash = pwd_context.hash(password)
    
    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.password_hash)
    
    @property
    def full_name(self) -> str:
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
        
    def __str__(self):
        return self.username


class Admin(Model):
    id = fields.IntField(pk=True)
    user = fields.OneToOneField("models.User", related_name="admin_profile")
    role = fields.CharField(max_length=20, default="admin")
    permissions = fields.JSONField(default=list)
    
    created_at = fields.DatetimeField(auto_now_add=True)
    created_by = fields.ForeignKeyField("models.User", related_name="created_admins", null=True)
    
    class Meta:
        table = "admins"
        
    def __str__(self):
        return f"Admin: {self.user.username}"


class Moderation(Model):
    id = fields.IntField(pk=True)
    
    # What's being moderated
    content_type = fields.CharField(max_length=50)  # 'article', 'comment', etc.
    content_id = fields.IntField()
    
    # Moderation details
    action = fields.CharField(max_length=20)  # 'approve', 'reject', 'flag', 'ban'
    reason = fields.CharField(max_length=100, null=True)
    notes = fields.TextField(null=True)
    
    # Who and when
    moderator = fields.ForeignKeyField("models.User", related_name="moderation_actions")
    moderated_at = fields.DatetimeField(auto_now_add=True)
    
    # Status tracking
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("appealed", "Appealed"),
        ("overturned", "Overturned")
    ]
    status = fields.CharField(max_length=20, choices=STATUS_CHOICES, default="completed")
    
    class Meta:
        table = "moderations"
        ordering = ["-moderated_at"]
        
    def __str__(self):
        return f"{self.action} {self.content_type}:{self.content_id} by {self.moderator.username}"


class Category(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=100, unique=True)
    slug = fields.CharField(max_length=100, unique=True)
    description = fields.TextField(null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    
    # Reverse relation to articles
    articles: fields.ReverseRelation["Article"]
    
    class Meta:
        table = "categories"
        
    def __str__(self):
        return self.name


class Article(Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=200)
    slug = fields.CharField(max_length=200, unique=True)
    content = fields.TextField()
    summary = fields.TextField(null=True)
    author = fields.CharField(max_length=100)  # Keep for backward compatibility
    # author_user = fields.ForeignKeyField("models.User", related_name="authored_articles", null=True)  # Disabled until needed
    
    # Article status
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("published", "Published"),
        ("archived", "Archived"),
        ("flagged", "Flagged")
    ]
    status = fields.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    
    # SEO and metadata
    meta_description = fields.CharField(max_length=160, null=True)
    featured_image = fields.CharField(max_length=500, null=True)
    
    # Analytics
    views_count = fields.IntField(default=0)
    likes_count = fields.IntField(default=0)
    dislikes_count = fields.IntField(default=0)
    shares_count = fields.IntField(default=0)
    
    # Content flags
    is_featured = fields.BooleanField(default=False)
    is_trending = fields.BooleanField(default=False)
    is_breaking_news = fields.BooleanField(default=False)
    
    # Timestamps
    published_at = fields.DatetimeField(null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    
    # Relationships
    category = fields.ForeignKeyField("models.Category", related_name="articles")
    
    class Meta:
        table = "articles"
        ordering = ["-created_at"]
        
    def __str__(self):
        return self.title


class Newsletter(Model):
    id = fields.IntField(pk=True)
    email = fields.CharField(max_length=255, unique=True)
    is_active = fields.BooleanField(default=True)
    subscribed_at = fields.DatetimeField(auto_now_add=True)
    unsubscribed_at = fields.DatetimeField(null=True)
    
    class Meta:
        table = "newsletter_subscriptions"
        
    def __str__(self):
        return self.email


class ArticleView(Model):
    id = fields.IntField(pk=True)
    article = fields.ForeignKeyField("models.Article", related_name="article_views")
    ip_address = fields.CharField(max_length=45)
    user_agent = fields.TextField(null=True)
    viewed_at = fields.DatetimeField(auto_now_add=True)
    
    class Meta:
        table = "article_views"


class ContentFlag(Model):
    id = fields.IntField(pk=True)
    article = fields.ForeignKeyField("models.Article", related_name="flags")
    reason = fields.CharField(max_length=100)
    description = fields.TextField()
    reporter_email = fields.CharField(max_length=255, null=True)
    
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected")
    ]
    status = fields.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    
    flagged_at = fields.DatetimeField(auto_now_add=True)
    reviewed_at = fields.DatetimeField(null=True)
    reviewer_notes = fields.TextField(null=True)
    
    class Meta:
        table = "content_flags"
        
    def __str__(self):
        return f"Flag for {self.article.title} - {self.reason}"


class SiteStats(Model):
    id = fields.IntField(pk=True)
    total_articles = fields.IntField(default=0)
    total_users = fields.IntField(default=0)
    total_views = fields.IntField(default=0)
    accuracy_rate = fields.FloatField(default=95.0)
    last_updated = fields.DatetimeField(auto_now=True)
    
    class Meta:
        table = "site_stats"