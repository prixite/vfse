from django.urls import path

from vfse.views import api

urlpatterns = [
    path(
        "categories/",
        api.CategoryViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "categories/<int:pk>/",
        api.CategoryViewSet.as_view(
            {
                "patch": "partial_update",
                "get": "retrieve",
            }
        ),
    ),
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
                "get": "retrieve",
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
            {"delete": "destroy", "patch": "partial_update", "get": "retrieve"}
        ),
    ),
    path(
        "topics/<int:pk>/comments/",
        api.CommentViewset.as_view({"get": "list", "post": "create"}),
    ),
    path(
        "topics/",
        api.TopicViewset.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "topics/<int:pk>/",
        api.TopicViewset.as_view(
            {
                "get": "retrieve",
                "delete": "destroy",
                "patch": "partial_update",
            }
        ),
    ),
    path("user/activity/", api.TopicActivityViewSet.as_view()),
    path("dashboard/", api.DashboardView.as_view()),
    path("topics/popular/", api.PopularTopicsViewset.as_view({"get": "list"})),
    path(
        "workorders/",
        api.WorkOrderViewset.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "workorders/<int:pk>/",
        api.WorkOrderViewset.as_view(
            {
                "get": "retrieve",
            }
        ),
    ),
    path(
        "topics/<int:pk>/follow/",
        api.FollowtopicViewset.as_view(
            {
                "patch": "partial_update",
            }
        ),
    ),
]
