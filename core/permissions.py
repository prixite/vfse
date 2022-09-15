from rest_framework.permissions import SAFE_METHODS, BasePermission

from core import models


class OrganizationDetailPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_request_user:
            return False
        return True

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

        if request.user.is_request_user:
            if request.method in SAFE_METHODS:
                return True
            return False

        if request.method.lower() in ["post", "put"]:
            return models.Membership.objects.filter(
                role=models.Role.CUSTOMER_ADMIN,
                organization_id=view.kwargs["pk"],
                user=request.user,
            ).exists()

        return False


class OrganizationSitesPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.user.is_superuser:
            return True

        if request.user.is_request_user:
            if request.method in SAFE_METHODS:
                return True
            return False

        if request.method.lower() in ["post", "put"]:
            return models.Membership.objects.filter(
                role=models.Role.CUSTOMER_ADMIN,
                organization_id=view.kwargs["pk"],
                user=request.user,
            ).exists()

        return False


class OrganizationUsersPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.user.is_superuser:
            return True

        if request.user.is_request_user:
            if request.method in SAFE_METHODS:
                return True
            return False

        if request.method.lower() in ["post", "put"]:
            return models.Membership.objects.filter(
                role=models.Role.USER_ADMIN,
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


class EndUserReadOnlyPermission(BasePermission):
    def has_permission(self, request, view):
        org_id = request.user.get_default_organization().id
        if "organizations" in request.path:
            org_id = view.kwargs.get("pk", org_id)

        return not (
            models.Role.END_USER == request.user.get_organization_role(org_id)
            and request.method not in SAFE_METHODS
        )


class SystemNotePermissions(BasePermission):
    def has_permission(self, request, view):
        return request.user.profile.can_leave_notes

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser and request.method != "PATCH":
            return True
        elif not request.user.profile.can_leave_notes:
            return False
        elif request.user == obj.author:
            return True

        return False


class ViewOnlyPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True

        elif request.user.profile.view_only and request.method not in SAFE_METHODS:
            return False

        return True


class CreateUserPermissions(BasePermission):
    def has_permission(self, request, view):
        org_id = view.kwargs.get("pk", request.user.get_default_organization().id)
        return (
            request.user.is_superuser
            or models.Role.USER_ADMIN == request.user.get_organization_role(org_id)
        )
