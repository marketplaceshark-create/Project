from django.urls import path
from .views import UserAPI, UserLoginAPI, SendUserOTP, VerifyUserOTP, ResetUserPassword,BulkUploadAPI

urlpatterns = [
    path("", UserAPI.as_view()),
    path("<int:id>/", UserAPI.as_view()),
    path("login/", UserLoginAPI.as_view()),
    path("send-otp/", SendUserOTP.as_view()),
    path("verify-otp/", VerifyUserOTP.as_view()),
    path("reset-password/", ResetUserPassword.as_view()),
    path("bulk-upload/<str:model_name>/", BulkUploadAPI.as_view()),
]