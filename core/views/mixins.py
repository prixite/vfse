from core import models


class UserOganizationMixin:
    def get_user_organizations(self):
        queryset = models.Organization.objects.all()
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return queryset

        return queryset.filter(id__in=self.request.user.get_organizations())


class UserMixin:
    def create_membership(self, data, user_id):
        models.Membership.objects.create(
            organization=data["organization"],
            role=data["role"],
            user_id=user_id,
        )

    def add_sites(self, data, user_id):
        sites = [
            models.UserSite(
                user_id=user_id, site=site, organization=data["organization"]
            )
            for site in data["sites"]
        ]
        models.UserSite.objects.bulk_create(sites)
        models.UserHealthNetwork.objects.bulk_create(
            [
                models.UserHealthNetwork(
                    user_id=user_id,
                    organization_health_network=health_network,
                    role=data["role"],
                )
                for health_network in models.OrganizationHealthNetwork.objects.filter(
                    health_network__sites__in=data["sites"]
                ).distinct()
            ]
        )

    def add_modalities(self, data, user_id):
        modalities = [
            models.UserModality(
                user_id=user_id, modality=modality, organization=data["organization"]
            )
            for modality in data["modalities"]
        ]
        models.UserModality.objects.bulk_create(modalities)

    def update_profile(self, data, user_id):
        models.Profile.objects.filter(user_id=user_id).update(
            manager_id=data.get("manager"),
            **{
                key: data[key]
                for key in [
                    "meta",
                    "phone",
                    "fse_accessible",
                    "audit_enabled",
                    "can_leave_notes",
                    "view_only",
                    "is_one_time",
                    "documentation_url",
                ]
                if key in data
            }
        )
