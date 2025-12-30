from django.contrib import admin
from .models import Resume, Experience, Education, Project


class ExperienceInline(admin.TabularInline):
    model = Experience
    extra = 1


class EducationInline(admin.TabularInline):
    model = Education
    extra = 1


class ProjectInline(admin.TabularInline):
    model = Project
    extra = 1


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ["user", "headline", "created_at"]
    inlines = [ExperienceInline, EducationInline, ProjectInline]


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ["position", "company", "start_date", "end_date", "is_current"]
    list_filter = ["is_current", "start_date"]


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ["degree", "institution", "start_date", "end_date"]
    list_filter = ["start_date"]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "created_at"]
    list_filter = ["created_at"]
