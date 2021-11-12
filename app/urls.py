from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from django.urls import path, re_path
from django.urls.conf import include
from drf_yasg2 import openapi
from drf_yasg2.views import get_schema_view
from rest_framework import permissions

from core.views import api, site

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
    path(
        "api/organizations/",
        api.OrganizationViewSet.as_view(
            {
                "get": "list",
            }
        ),
    ),
    path(
        "api/organizations/<str:organization_pk>/health_networks/",
        api.OrganizationHealthNetworkViewSet.as_view(
            {
                "get": "list",
            }
        ),
    ),
    path(
        "api/organizations/<str:organization_pk>/users/",
        api.OrganizationUserViewSet.as_view(
            {
                "get": "list",
            }
        ),
    ),
    path(
        "api/organizations/<str:organization_pk>/vfse_systems/",
        api.VfseSystemViewSet.as_view(
            {
                "get": "list",
            }
        ),
    ),
    path(
        "api/organizations/<str:organization_pk>/health_networks/<str:health_network_pk>/sites/",  # noqa
        api.OrganizationSiteViewSet.as_view(
            {
                "get": "list",
            }
        ),
    ),
    path(
        "api/sites/<str:site_pk>/systems/",
        api.SiteSystemViewSet.as_view(
            {
                "get": "list",
            }
        ),
    ),
    path(
        "accounts/logout/", auth_views.LogoutView.as_view(next_page="/"), name="logout"
    ),
    path("accounts/", include("django.contrib.auth.urls")),
    # Home should be the last mapping. We want everything else to pass to React.
    re_path(r"^.*$", login_required(site.HomeView.as_view()), name="home"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
