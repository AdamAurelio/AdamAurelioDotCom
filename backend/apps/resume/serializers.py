from rest_framework import serializers
from .models import Resume, Experience, Education, Project


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            "id",
            "company",
            "position",
            "location",
            "start_date",
            "end_date",
            "description",
            "is_current",
            "created_at",
            "updated_at",
        ]


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            "id",
            "institution",
            "degree",
            "field_of_study",
            "start_date",
            "end_date",
            "description",
            "created_at",
            "updated_at",
        ]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "technologies",
            "project_url",
            "github_url",
            "image",
            "created_at",
            "updated_at",
        ]


class ResumeSerializer(serializers.ModelSerializer):
    experiences = ExperienceSerializer(many=True, read_only=True)
    education = EducationSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)

    class Meta:
        model = Resume
        fields = [
            "id",
            "headline",
            "summary",
            "skills",
            "experiences",
            "education",
            "projects",
            "created_at",
            "updated_at",
        ]
