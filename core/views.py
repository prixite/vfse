from django.views.generic.base import TemplateView
from rest_framework.viewsets import ModelViewSet

from core import models, serializers
from core.models import Organization


class HomeView(TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        if self.request.user.is_authenticated:
            context["user_data"] = serializers.MeSerializer(
                self.request.user,
                context={
                    "request": self.request,
                },
            ).data

        return context


class OrganizationViewSet(ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = serializers.OrganizationSerializer

    def get_queryset(self):
        queryset = self.queryset.filter(is_default=False)
        if self.request.user.is_superuser:
            return queryset

        return queryset.filter(
            id__in=self.request.user.get_organizations(),
        )


class HealthNetworkViewSet(ModelViewSet):
    queryset = models.HealthNetwork.objects.all()
    serializer_class = serializers.HealthNetworkSerializer
