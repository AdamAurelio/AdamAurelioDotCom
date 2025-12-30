from django.db import models
from django.contrib.auth.models import User

class BaseModel(models.Model):
    """Abstract base model with common fields"""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class SiteSettings(models.Model):
    """Global site settings"""
    site_name = models.CharField(max_length=200, default="AdamAurelio.com")
    tagline = models.CharField(max_length=500, blank=True)
    about_text = models.TextField(blank=True)
    contact_email = models.EmailField(blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    
    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"
    
    def __str__(self):
        return self.site_name
