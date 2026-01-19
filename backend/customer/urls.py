from django.urls import path
from .views import CustomerAPI, SendTelegramOTP, VerifyTelegramOTP, LoginAPI, ResetPasswordAPI

urlpatterns = [
    path('', CustomerAPI.as_view()),                 # List & Create
    path('<int:id>/', CustomerAPI.as_view()),        # Get/Update/Delete by ID
    path('login/', LoginAPI.as_view()), 
    path('send-otp/', SendTelegramOTP.as_view()), 
    path('verify-otp/', VerifyTelegramOTP.as_view()),
    path('reset-password/', ResetPasswordAPI.as_view()),
]