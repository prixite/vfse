from django.db.models import Q

from core import models


class UserOganizationMixin:
    def get_user_organizations(self):
        queryset = models.Organization.objects.filter(is_customer=True, is_default=False)
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return queryset

        return queryset.filter(
            id__in=self.request.user.get_organizations()
        )
