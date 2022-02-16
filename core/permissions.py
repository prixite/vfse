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


class OrganizationHealthNetworksPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.user.is_superuser:
            return True

        if request.method.lower() in ["post", "put"]:
            return models.Membership.objects.filter(
                role=models.Role.CUSTOMER_ADMIN,
                organization_id=view.kwargs["pk"],
                user=request.user,
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

class OrganizationSitesPermission(BasePermission):
    def has_permission(self, request, view):
        membership_role = models.Membership.objects.get(user=request.user,organization_id=self.kwargs['pk']).role
        if request.user.is_superuser or request.user.is_supermanager or membership_role in [models.Role.CUSTOMER_ADMIN,models.Role.FSE_ADMIN]:
            return True
        return False
class SystemNotePermissions(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser and request.method != "PATCH":
            return True

        elif request.user == obj.author:
            return True

        return False
