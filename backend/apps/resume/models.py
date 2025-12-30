from django.db import models
from apps.core.models import BaseModel


class Resume(BaseModel):
    """Resume/Portfolio model"""

    user = models.OneToOneField("auth.User", on_delete=models.CASCADE)
    headline = models.CharField(max_length=200)
    summary = models.TextField()
    skills = models.TextField(help_text="Comma-separated list of skills")

    class Meta:
        verbose_name = "Resume"
        verbose_name_plural = "Resumes"

    def __str__(self):
        return f"Resume - {self.user.username}"


class Experience(BaseModel):
    """Work experience model"""

    resume = models.ForeignKey(
        Resume, on_delete=models.CASCADE, related_name="experiences"
    )
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(
        blank=True, null=True, help_text="Leave blank if current"
    )
    description = models.TextField()
    is_current = models.BooleanField(default=False)

    class Meta:
        ordering = ["-start_date"]
        verbose_name = "Experience"
        verbose_name_plural = "Experiences"

    def __str__(self):
        return f"{self.position} at {self.company}"


class Education(BaseModel):
    """Education model"""

    resume = models.ForeignKey(
        Resume, on_delete=models.CASCADE, related_name="education"
    )
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["-start_date"]
        verbose_name = "Education"
        verbose_name_plural = "Education"

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class Project(BaseModel):
    """Portfolio project model"""

    resume = models.ForeignKey(
        Resume, on_delete=models.CASCADE, related_name="projects"
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.CharField(max_length=500, help_text="Comma-separated list")
    project_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    image = models.ImageField(upload_to="projects/", blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def __str__(self):
        return self.title
