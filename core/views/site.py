import duo_universal
from django.conf import settings
from django.contrib.auth import login as auth_login
from django.contrib.auth import views as auth_views
from django.http import HttpResponseRedirect
from django.shortcuts import redirect, render, resolve_url
from django.views.generic.base import TemplateView
from duo_universal.client import DuoException

from core import forms, models, serializers


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


class LoginView(auth_views.LoginView):
    template_name = "core/registration/login.html"
    redirect_authenticated_user = True
    form_class = forms.UserLoginForm

    def form_valid(self, form):
        user = form.get_user()
        if not user.profile.mfa_enabled:
            return super().form_valid(form)

        duo_client = duo_universal.Client(
            settings.DUO_CLIENT_ID,
            settings.DUO_CLIENT_SECRET,
            settings.DUO_API_HOSTNAME,
            settings.DUO_REDIRECT_URI,
        )

        try:
            duo_client.health_check()
        except DuoException:
            return super().form_valid(form)

        self.request.session["state"] = duo_client.generate_state()
        self.request.session["duo_username"] = user.username

        return HttpResponseRedirect(
            duo_client.create_auth_url(
                self.request.session["duo_username"], self.request.session["state"]
            )
        )


def duo_login(request):
    if request.session.pop("state") != request.GET["state"]:
        return render(request, "core/registration/mfa_failed.html")

    duo_client = duo_universal.Client(
        settings.DUO_CLIENT_ID,
        settings.DUO_CLIENT_SECRET,
        settings.DUO_API_HOSTNAME,
        settings.DUO_REDIRECT_URI,
    )

    username = request.session.pop("duo_username")

    duo_client.exchange_authorization_code_for_2fa_result(
        request.GET["duo_code"], username
    )

    auth_login(request, models.User.objects.get(username=username))
    return HttpResponseRedirect(resolve_url(settings.LOGIN_REDIRECT_URL))


class WelcomeView(TemplateView):
    template_name = "core/welcome.html"

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

    def get(self, request, *args, **kwargs):
        flags = list(self.get_context_data()["user_data"]["flags"])

        if not flags or len(flags) > 1:
            return super().get(request, *args, **kwargs)

        redirect_map = {
            "organization": "/organizations/",
            "user": "/users/",
            "modality": "/modality/",
            "documentation": "/documentation/",
            "vfse": "/vfse/",
        }

        return redirect(redirect_map[flags[0]])
