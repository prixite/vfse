from django.views.generic.base import TemplateView

from core import serializers


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
