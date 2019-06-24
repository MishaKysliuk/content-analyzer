from django.urls import path, include

from . import views
urlpatterns = [
    path('', views.index),
    path('indexing', views.indexing_page),
    path('accounts/', include('django.contrib.auth.urls'))
]