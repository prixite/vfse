from rest_framework.permissions import SAFE_METHODS, BasePermission

from core import models


class OrganizationDetailPermission(BasePermission):
    def has_object_permission(self, request, view, organization):
        if request.method in SAFE_METHODS or request.user.is_superuser:
            return True

        if request.method.lower() == "patch":
            return models.Organization.objects.filter(
                id__in=request.user.get_organizations(
                    roles=[models.Membership.Role.CUSTOMER_ADMIN]
                ),
                id=organization.id,
            ).exists()

        return False
