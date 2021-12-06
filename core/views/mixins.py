from core import models


class UserOganizationMixin:
    def get_user_organizations(self):
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.Organization.objects.all()
        return models.Organization.objects.filter(
            id__in=self.request.user.get_organizations()
        )
