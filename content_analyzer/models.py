from django.db import models


class SavedPage(models.Model):
    url = models.URLField(unique=True)


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
