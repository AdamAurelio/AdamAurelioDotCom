from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Resume, Experience, Education, Project
from .serializers import (
    ResumeSerializer,
    ExperienceSerializer,
    EducationSerializer,
    ProjectSerializer,
)


class ResumeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for resume"""

    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for work experience"""

    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class EducationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for education"""

    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for projects"""

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
