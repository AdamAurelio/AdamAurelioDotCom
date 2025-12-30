"""
URL configuration for AdamAurelio.com project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers

# Create API router
router = routers.DefaultRouter()

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include(router.urls)),
    path('api/', include('apps.core.urls')),
    path('api/blog/', include('apps.blog.urls')),
    path('api/resume/', include('apps.resume.urls')),
    
    # Health check endpoint
    path('health/', include('apps.core.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Customize admin site
admin.site.site_header = "AdamAurelio.com Administration"
admin.site.site_title = "AdamAurelio Admin"
admin.site.index_title = "Welcome to AdamAurelio.com Administration"
