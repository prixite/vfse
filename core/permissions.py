from rest_framework.permissions import SAFE_METHODS, BasePermission

from core import models


class OrganizationDetailPermission(BasePermission):
    def has_object_permission(self, request, view, organization):
        if request.method in SAFE_METHODS or request.user.is_superuser:
            return True

        if request.method.lower() == "patch":
            return models.Organization.objects.filter(
                id__in=request.user.get_organizations(
                    roles=[models.Role.CUSTOMER_ADMIN]
                ),
                id=organization.id,
            ).exists()

        return False


class OrganizationReadOnlyPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True

        if request.method in SAFE_METHODS:
            return True

        return not models.Membership.objects.filter(
            organization_id=view.kwargs["pk"],
            user=request.user,
            role=models.Role.VIEW_ONLY,
        ).exists()


class OrganizationPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method.lower() == "post":
            if request.user.is_superuser:
                return True

            return False

        return True
