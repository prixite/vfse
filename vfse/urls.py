from django.urls import path

from vfse.views import api

urlpatterns = [
    path(
        "folders/",
        api.FolderViewset.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "folders/<int:pk>/",
        api.FolderViewset.as_view(
            {
                "delete": "destroy",
                "patch": "partial_update",
            }
        ),
    ),
    path(
        "documents/",
        api.DocumentViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "documents/<int:pk>/",
        api.DocumentViewSet.as_view(
            {
                "delete": "destroy",
                "patch": "partial_update",
            }
        ),
    ),
]
