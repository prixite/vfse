from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import path, re_path
from drf_yasg2 import openapi
from drf_yasg2.views import get_schema_view
from rest_framework import permissions

from core import views

schema_view = get_schema_view(
    openapi.Info(
        title="vFSE API documentation",
        default_version="v1",
        description="vFSE RESTfull API documentation.",
        contact=openapi.Contact(email="contact@snippets.local"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    path(
        "api/docs/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("admin/", admin.site.urls),
    path("", login_required(views.HomeView.as_view())),
    path(
        "api/organizations/",
        views.OrganizationViewSet.as_view(
            {
                "get": "list",
            }
        ),
    ),
    path(
        "api/organizations/<str:organization_pk>/health_networks/",
        views.OrganizationHealthNetworkViewSet.as_view(
            {
                "get": "list",
            }
        ),
    ),
]
