from django.urls import path
from .views import CustomerAPI, LoginAPI, ForgotPasswordLinkAPI, ResetPasswordAPI

urlpatterns = [
    path('', CustomerAPI.as_view()),                 
    path('<int:id>/', CustomerAPI.as_view()),        
    path('login/', LoginAPI.as_view()), 
    path('forgot-password/', ForgotPasswordLinkAPI.as_view()), # Generates Link
    path('reset-password/', ResetPasswordAPI.as_view()),       # Validates Token & Resets
]