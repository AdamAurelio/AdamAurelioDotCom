from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"", views.ResumeViewSet, basename="resume")
router.register(r"experience", views.ExperienceViewSet, basename="experience")
router.register(r"education", views.EducationViewSet, basename="education")
router.register(r"projects", views.ProjectViewSet, basename="project")

urlpatterns = [
    path("", include(router.urls)),
]
