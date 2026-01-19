from django.urls import path
from . import views
from .views import CategoryAPI
urlpatterns = [
    path("",views.CategoryAPI.as_view()),
    path("<int:id>/",CategoryAPI.as_view())
]
