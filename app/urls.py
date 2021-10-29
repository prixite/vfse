from django.conf.urls import include
from django.contrib import admin
from django.urls import path
from rest_framework import routers

from core import views

router = routers.DefaultRouter()
router.register(r"organizations", views.OrganizationViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path(r"api/", include(router.urls)),
]
