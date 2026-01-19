from django.urls import path
from . import views
from .views import PlanAPI
urlpatterns = [
    path("",views.PlanAPI.as_view()),
    path("<int:id>/",PlanAPI.as_view())

]

