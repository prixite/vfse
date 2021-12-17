from core import models


class UserOganizationMixin:
    def get_user_organizations(self):
        queryset = models.Organization.objects.all()
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return queryset

        return queryset.filter(id__in=self.request.user.get_organizations())


class UserMixin:
    def create_membership(self, serializer, user_id):
        models.Membership.objects.create(
            organization=serializer.validated_data["organization"],
            role=serializer.validated_data["role"],
            user_id=user_id,
        )

    def add_sites(self, serializer, user_id):
        sites = [
            models.UserSite(user_id=user_id, site=site)
            for site in serializer.validated_data["sites"]
        ]
        models.UserSite.objects.bulk_create(sites)

    def add_modalities(self, serializer, user_id):
        modalities = [
            models.UserModality(user_id=user_id, modality=modality)
            for modality in serializer.validated_data["modalities"]
        ]
        models.UserModality.objects.bulk_create(modalities)

    def update_profile(self, serializer, user_id):
        models.Profile.objects.filter(user_id=user_id).update(
            **{
                key: serializer.validated_data[key]
                for key in [
                    "manager",
                    "phone",
                    "fse_accessible",
                    "audit_enabled",
                    "can_leave_notes",
                    "view_only",
                    "is_one_time",
                ]
            }
        )
