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

api_info = openapi.Info(
    title="vFSE API documentation",
    default_version="v1",
    description="vFSE RESTfull API documentation.",
    contact=openapi.Contact(email="contact@snippets.local"),
)

schema_view = get_schema_view(
    public=True,
    permission_classes=(permissions.AllowAny,),
)

api_urlpatterns = [
    path(
        "api/me/",
        api.MeViewSet.as_view(
            {
                "get": "retrieve",
            }
        ),
    ),
    path(
        "api/users/roles/",
        api.UserRolesView.as_view(
            {
                "get": "list",
            }
        ),
    ),
    path(
        "api/organizations/exists/",
        api.DistinctOrganizationViewSet.as_view(
            {
                "get": "retrieve",
            }
        ),
    ),
    path(
        "api/organizations/",
        api.CustomerViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "api/organizations/<int:pk>/",
        api.OrganizationViewSet.as_view(
            {
                "get": "retrieve",
                "delete": "destroy",
                "patch": "partial_update",
            }
        ),
    ),
    path(
        "api/lambda/",
        api.LambdaView.as_view({"patch": "partial_update"}),
    ),
    path(
        "api/organizations/<int:pk>/health_networks/",
        api.OrganizationHealthNetworkViewSet.as_view(
            {
                "put": "update",
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "api/organizations/<int:pk>/users/",
        api.OrganizationUserViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "api/organizations/<int:pk>/seats/",
        api.OrganizationSeatViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "api/organizations/<int:pk>/sites/",
        api.OrganizationSiteViewSet.as_view(
            {
                "post": "create",
                "put": "update",
                "get": "list",
            }
        ),
    ),
    path(
        "api/organizations/<int:pk>/systems/",
        api.OrganizationSystemViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "api/organizations/<int:pk>/systems/<int:system_pk>/",
        api.SystemViewSet.as_view(
            {
                "delete": "destroy",
                "patch": "partial_update",
            }
        ),
    ),
    path(
        "api/users/deactivate/",
        api.UserDeactivateViewSet.as_view(
            {
                "patch": "partial_update",
            }
        ),
    ),
    path(
        "api/users/activate/",
        api.UserActivateViewSet.as_view(
            {
                "patch": "partial_update",
            }
        ),
    ),
    path(
        "api/users/<int:pk>/",
        api.UserViewSet.as_view(
            {
                "patch": "partial_update",
            }
        ),
    ),
    path(
        "api/modalities/",
        api.ModalityViewSet.as_view(
            {
                "get": "list",
            }
        ),
    ),
    path(
        "api/products/",
        api.ProductViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "api/products/models/",
        api.ProductModelViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "api/products/models/<int:pk>/",
        api.ProductModelViewSet.as_view(
            {
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
    ),
    path(
        "api/products/<int:pk>/",
        api.ProductViewSet.as_view(
            {
                "delete": "destroy",
                "patch": "partial_update",
            }
        ),
    ),
    path(
        "api/manufacturers/",
        api.ManfucturerViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "api/systems/<int:pk>/notes/",
        api.SystemNoteViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "api/systems/images/",
        api.SystemImageViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "api/manufacturers/images/",
        api.ManufacturerImagesViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "api/health_networks/",
        api.HealthNetworkViewSet.as_view(
            {
                "get": "list",
            }
        ),
    ),
    path(
        "api/accounts/requests/",
        api.UserRequestAccessViewSet.as_view(
            {
                "post": "create",
            }
        ),
    ),
]

urlpatterns = (
    api_urlpatterns
    + [
        re_path(
            r"^swagger(?P<format>\.json|\.yaml)$",
            schema_view.without_ui(cache_timeout=0),
            name="schema-json",
        ),
        path(
            "",
            login_required(site.WelcomeView.as_view()),
            name="welcome",
        ),
        path(
            "openapi/",
            schema_view.with_ui("swagger", cache_timeout=0),
            name="schema-swagger-ui",
        ),
        path("admin/", admin.site.urls),
        path(
            "accounts/login/",
            site.LoginView.as_view(),
            name="login",
        ),
        path(
            "accounts/logout/",
            auth_views.LogoutView.as_view(next_page="/"),
            name="logout",
        ),
        path(
            "accounts/password_reset/",
            auth_views.PasswordResetView.as_view(
                template_name="core/registration/password_reset_form.html",
                email_template_name="core/emails/password_reset_email.html",
            ),
            name="password_reset",
        ),
        path(
            "accounts/password_reset/done/",
            auth_views.PasswordResetDoneView.as_view(
                template_name="core/registration/password_reset_done.html",
            ),
            name="password_reset_done",
        ),
        path(
            "accounts/reset/<uidb64>/<token>/",
            auth_views.PasswordResetConfirmView.as_view(
                template_name="core/registration/password_reset_confirm.html"
            ),
            name="password_reset_confirm",
        ),
        path(
            "accounts/reset/done/",
            auth_views.PasswordResetCompleteView.as_view(
                template_name="core/registration/password_reset_complete.html",
            ),
            name="password_reset_complete",
        ),
        path("accounts/", include("django.contrib.auth.urls")),
        path("accounts/duo/login/", site.duo_login, name="duo_login"),
        # Home should be the last mapping. We want everything else to pass to React.
        re_path(r"^$|^.+/$", login_required(site.HomeView.as_view()), name="home"),
    ]
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)
