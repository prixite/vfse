from django.conf.urls import include
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import path, re_path
from drf_yasg2 import openapi
from drf_yasg2.views import get_schema_view
from rest_framework import permissions, routers

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

router = routers.DefaultRouter()
router.register(r"organizations", views.OrganizationViewSet)

urlpatterns = [
    path("", login_required(views.HomeView.as_view())),
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
