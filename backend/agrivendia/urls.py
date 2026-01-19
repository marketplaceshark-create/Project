from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("category/", include('category.urls')),
    path("customer/", include('customer.urls')),
    path("user/", include('user.urls')),
    path("plan/", include('plan.urls')),
    path("product/", include('product.urls')),
    path("product_buy/", include('product_buy.urls')),
    path("product_sell/", include('product_sell.urls')),
    path("product_bid/", include('product_bid.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)