from django.urls import path
from . import views
from .views import ProductAPI
urlpatterns = [
    path("",views.ProductAPI.as_view()),
    path("<int:id>/",ProductAPI.as_view())
]