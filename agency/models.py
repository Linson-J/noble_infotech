from django.db import models

class ContactSubmission(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    service_type = models.CharField(max_length=100, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"

class Service(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)  # e.g., 'SEO', 'Marketing', 'Development'
    description = models.TextField()
    icon = models.CharField(max_length=50)        # e.g., 'ri-seo-line' or 'fa-code'
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Project(models.Model):
    title = models.CharField(max_length=150)
    category = models.CharField(max_length=100)
    description = models.TextField()
    client_name = models.CharField(max_length=100, blank=True, null=True)
    revenue_generated = models.CharField(max_length=50, blank=True, null=True) # e.g., "$1.2M"
    growth_rate = models.CharField(max_length=50, blank=True, null=True)        # e.g., "+150%"
    image_url = models.URLField(blank=True, null=True)
    project_url = models.URLField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title

