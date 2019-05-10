"""content_analyzer URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from content_analyzer import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/retrieve_content', views.retrieve_content),
    path('api/retrieve_gwt', views.retrieve_gwt),
    path('api/retrieve_analysis', views.retrieve_phrases_analysis),
    path('api/save_url', views.save_url),
    path('api/retrieve_urls', views.retrieve_saved_urls),
    path('api/retrieve_saved_content', views.retrieve_content_by_page),
    path('api/retrieve_saved_keywords', views.retrieve_keywords_by_page),
    path('api/delete_saved_page', views.delete_saved_page),
    path('', include('frontend.urls')),
]
