from django.conf.urls import include
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import path
from rest_framework import routers

from core import views

router = routers.DefaultRouter()
router.register(r"organizations", views.OrganizationViewSet)

urlpatterns = [
    path("", login_required(views.HomeView.as_view())),
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path(
        "api/organizations/<str:organization_pk>/health_networks/",
        views.HealthNetworkViewSet.as_view(
            {
                "get": "list",
            }
        ),
    ),
]
