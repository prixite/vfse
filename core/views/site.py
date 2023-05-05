import re

import duo_universal
from django.conf import settings
from django.contrib.auth import login as auth_login
from django.contrib.auth import views as auth_views
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render, resolve_url
from django.views.generic.base import TemplateView
from duo_universal.client import DuoException
from revproxy.views import ProxyView

from core import forms, models


class HomeView(TemplateView):
    template_name = "index.html"


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
    prefix = "/clients"
    redirect_map = {
        "organization": "/",
        "modality": "/systems/",
        "user": "/users/",
        "documentation": "/documentation/",
        "vfse": "/knowledge-base/",
        "appearance": "/appearance/",
    }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        try:
            client_id = self.request.user.get_default_organization().id
        except AttributeError:
            context["url_map"] = {}
            context["user_data"] = {"flags": []}
            return context

        if self.request.user.is_authenticated:
            context["user_data"] = dict(
                flags=self.request.user.get_organization_flags(client_id)
            )

        context["url_map"] = {
            key: f"{self.prefix}/{client_id}{path}"
            for key, path in self.redirect_map.items()
        }
        return context

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        flags = list(context["user_data"]["flags"])

        if not flags or len(flags) > 1:
            return super().get(request, *args, **kwargs)

        return redirect(context["url_map"][flags[0]])


class RequestView(TemplateView):
    template_name = "request.html"


class HttpProxyView(ProxyView):
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponse("User is not authenticated")

        upstream_url = ""
        organization_id = request.GET.get("organization_id", None)
        system_id = request.GET.get("system_id", None)

        try:
            system = (
                request.user.get_organization_systems(organization_id)
                .filter(id=system_id)
                .get()
            )
        except models.System.DoesNotExist:
            raise Http404("System not found")

        if not system.connection_options.get("service_web_browser"):
            return HttpResponse("No service browser access for system")

        url_pattern = re.compile(r"^https?://\S+$")
        if url_pattern.match(system.service_page_url):
            upstream_url = system.service_page_url

        if system.service_page_url.startswith("/"):
            upstream_url = f"http://{system.ip_address}{system.service_page_url}"

        if not upstream_url:
            return HttpResponse("upstream url not found.")

        self.upstream = upstream_url
        return super().dispatch(request, *args, **kwargs)
