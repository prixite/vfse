from core import models
from django.db.models import Q


class UserOganizationMixin:
    def get_user_organizations(self):
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.Organization.objects.filter(Q(is_customer=True) | Q(is_default=True))
        return models.Organization.objects.filter(
            id__in=self.request.user.get_organizations()
        )
