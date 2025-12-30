from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .models import BlogPost, Category, Tag
from .serializers import BlogPostSerializer, CategorySerializer, TagSerializer


class BlogPostViewSet(viewsets.ModelViewSet):
    """ViewSet for blog posts"""
    queryset = BlogPost.objects.filter(status='published')
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'author']
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['created_at', 'published_date', 'title']
    ordering = ['-published_date']
    lookup_field = 'slug'


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for tags"""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'
