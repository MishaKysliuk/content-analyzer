from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=255, unique=True)
    default = models.BooleanField()
    groups_have_access = models.ManyToManyField(
        Group,
        blank=True
    )

    def clean(self):
        default_project = Project.objects.filter(default=True)
        if self.default and default_project and default_project.get() != self:
            raise ValidationError('Default project is already set. Unset it first.')

    def __str__(self):
        return self.name


class SavedPage(models.Model):
    url = models.URLField()
    related_project = models.ForeignKey(Project, on_delete=models.CASCADE)


class ContentUnit(models.Model):
    related_page = models.ForeignKey(SavedPage, on_delete=models.CASCADE)
    tag = models.CharField(max_length=30)
    text = models.TextField()


class TargetKeyword(models.Model):
    related_page = models.ForeignKey(SavedPage, on_delete=models.CASCADE)
    keyword = models.CharField(max_length=255)


class IgnoredKeyword(models.Model):
    related_page = models.ForeignKey(SavedPage, on_delete=models.CASCADE)
    keyword = models.CharField(max_length=255)
