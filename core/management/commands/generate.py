from django.core.management.base import BaseCommand
from django.db import transaction

from app import settings
from core.tests import factories
from vfse.tests import factories as vfse_factories


class Command(BaseCommand):
    help = "Generate fake date"

    @transaction.atomic
    def handle(self, *args, **options):
        factories.UserWithPasswordFactory(
            username="mfa@example.com",
            is_superuser=True,
            is_staff=True,
            profile__mfa_enabled=True,
        )

        super_user = factories.UserWithPasswordFactory(
            is_superuser=True, is_staff=True, username="super-admin@example.com"
        )

        factories.UserWithPasswordFactory(
            is_supermanager=True,
            username="super-manager@example.com",
            profile__manager=super_user,
        )

        customer_admin = factories.UserWithPasswordFactory(
            username="customer-admin@example.com"
        )
        fse_admin = factories.UserWithPasswordFactory(
            username="fse-admin@example.com", profile__manager=customer_admin
        )
        user_admin = factories.UserWithPasswordFactory(
            username="user-admin@example.com", profile__manager=customer_admin
        )
        fse_role = factories.UserWithPasswordFactory(
            username="fse@example.com", profile__manager=customer_admin
        )
        end_user_role = factories.UserWithPasswordFactory(
            username="end-user@example.com", profile__manager=customer_admin
        )
        view_only = factories.UserWithPasswordFactory(
            username="view-only@example.com", profile__manager=customer_admin
        )
        one_time_role = factories.UserWithPasswordFactory(
            username="one-time@example.com",
            profile__manager=customer_admin,
            profile__is_one_time=True,
        )
        cryo = factories.UserWithPasswordFactory(
            username="cryo@example.com", profile__manager=customer_admin
        )
        cryo_fse = factories.UserWithPasswordFactory(
            username="cryo-fse@example.com", profile__manager=customer_admin
        )
        cryo_admin = factories.UserWithPasswordFactory(
            username="cryo-admin@example.com", profile__manager=customer_admin
        )

        ssh_user = factories.UserWithPasswordFactory(
            username="ssh-user@example.com",
            profile__manager=super_user,
            is_remote_user=True,
        )
        users = [
            one_time_role,
            view_only,
            end_user_role,
            fse_role,
            user_admin,
            customer_admin,
            fse_admin,
            cryo,
            cryo_admin,
            cryo_fse,
        ]

        orgnization = factories.OrganizationFactory(
            is_default=True,
            name="626",
            number_of_seats=10,
        )
        product_model = factories.ProductModelFactory(
            modality__users=users,
            modality__users__organization=orgnization,
        )
        factories.HealthNetworkFactory(
            name="626 Health Network",
            organizations=[orgnization],
            users=users,
            site__users=users,
            site__system__users=users,
            site__system__product_model=product_model,
        )
        organization = factories.OrganizationFactory(
            name="All Data",
            is_customer=True,
            number_of_seats=10,
            site__name="All data Site",
            site__users=users,
            site__system__users=users,
            fse_admin_roles=[fse_admin],
            customer_admin_roles=[customer_admin],
            user_admin_roles=[user_admin],
            fse_roles=[fse_role, ssh_user],
            end_user_roles=[end_user_role],
            view_only_roles=[view_only],
            one_time_roles=[one_time_role],
            cryo_roles=[cryo],
            cryo_fse_roles=[cryo_fse],
            cryo_admin_roles=[cryo_admin],
            sites=True,
        )

        health_network = factories.HealthNetworkFactory(
            name="Health Network with Sites",
            organizations=[organization],
            site__name="sites with Systems",
            users=users + [ssh_user],
            site__users=users,
            site__system__users=users,
            site__system__product_model=product_model,
            site__system__connection_monitoring=True,
        )

        site = factories.SiteFactory(
            name="Site with Systems",
            organization=health_network,
            system__connection_monitoring=True,
            system__users=users + [ssh_user],
            users=users + [ssh_user],
        )

        factories.SystemFactory(
            name="Remote System",
            site=site,
            ip_address="173.230.135.166",
            ssh_password="HsB7&Jf}>o",
            users=[ssh_user],
            connection_options={
                "virtual_media_control": False,
                "service_web_browser": False,
                "ssh": True,
                "vfse": False,
            },
        )

        # Crothal
        orgnization = factories.OrganizationFactory(
            name="Crothal",
            is_customer=True,
            number_of_seats=10,
            sites=True,
            site__users=users,
            site__system__users=users,
            site__name="Crothal Site",
            site__system__name="Crothal System",
            site__system__seats=True,
        )
        factories.HealthNetworkFactory(
            name="Crothal Health Network",
            organizations=[orgnization],
            users=users,
            site__users=users,
            site__system__users=users,
            site__system__product_model=product_model,
        )
        # Alira
        orgnization = factories.OrganizationFactory(
            name="Alira Health",
            logo="https://"
            + settings.AWS_STORAGE_BUCKET_NAME
            + ".s3.us-east-2.amazonaws.com/alirahealth.png",
            number_of_seats=10,
            is_customer=True,
            sites=True,
            site__users=users,
            site__system__users=users,
            site__name="Alira Site",
            site__system__name="Alira System",
            site__system__seats=True,
        )
        factories.HealthNetworkFactory(
            name="Alira Health Network",
            organizations=[orgnization],
            users=users,
            site__users=users,
            site__system__users=users,
            site__system__product_model=product_model,
        )
        factories.SystemFactory.create_batch(
            10, seats=True, site=organization.sites.first()
        )
        # Conni
        orgnization = factories.OrganizationFactory(
            name="Conni Health",
            logo="https://"
            + settings.AWS_STORAGE_BUCKET_NAME
            + ".s3.us-east-2.amazonaws.com/connihealth.png",
            number_of_seats=10,
            is_customer=True,
            sites=True,
            site__name="Conni Site",
            site__system__name="Conni System",
            site__system__seats=True,
            site__users=users,
            site__system__users=users,
        )
        factories.HealthNetworkFactory(
            name="Conni Health Network",
            organizations=[orgnization],
            users=users,
            site__users=users,
            site__system__users=users,
            site__system__product_model=product_model,
        )
        # Coventry
        orgnization = factories.OrganizationFactory(
            name="Conventry Health",
            logo="https://"
            + settings.AWS_STORAGE_BUCKET_NAME
            + ".s3.us-east-2.amazonaws.com/coventry.png",
            number_of_seats=10,
            is_customer=True,
            sites=True,
            site__name="Conventry Site",
            site__system__name="Conventry System",
            site__system__seats=True,
            site__users=users,
            site__system__users=users,
        )
        factories.HealthNetworkFactory(
            name="Conventry Health Network",
            organizations=[orgnization],
            users=users,
            site__users=users,
            site__system__users=users,
            site__system__product_model=product_model,
        )
        # Heart Beat
        orgnization = factories.OrganizationFactory(
            name="Heartbeat Health",
            logo="https://"
            + settings.AWS_STORAGE_BUCKET_NAME
            + ".s3.us-east-2.amazonaws.com/heartbeat.png",
            is_customer=True,
            number_of_seats=10,
            sites=True,
            site__name="Heartbeat Site",
            site__system__name="Heartbeat System",
            site__system__seats=True,
            site__users=users,
            site__system__users=users,
        )
        product_model = factories.ProductModelFactory(
            modality__users=users,
            modality__users__organization=organization,
        )
        factories.HealthNetworkFactory(
            name="Heartbeat Health Network",
            organizations=[orgnization],
            users=users,
            site__users=users,
            site__system__users=users,
            site__system__product_model=product_model,
        )

        # Bulk Creations
        factories.SystemFactory.create_batch(
            5,
            site=site,
            users=users,
        )
        factories.OrganizationFactory.create_batch(
            175,
            is_customer=True,
            number_of_seats=10,
        )
        factories.HealthNetworkFactory.create_batch(
            5,
            organizations=[organization],
            users=users,
            site__system__product_model=product_model,
        )
        factories.SiteFactory.create_batch(
            5,
            organization=health_network,
            users=users,
            system__users=users,
            system__product_model=product_model,
        )
        factories.SystemFactory.create_batch(
            10,
            seats=True,
            site=health_network.sites.first(),
            users=users,
        )
        factories.SiteFactory.create_batch(
            5,
            organization=organization.health_networks.last().health_network,
            users=users,
        )

        factories.SystemFactory(
            ip_address="10.21.2.21",
            site=site,
            connection_monitoring=True,
            product_model=product_model,
        )
        factories.SystemFactory(
            ip_address="10.21.11.70", site=site, connection_monitoring=True
        )
        factories.SystemFactory(
            ip_address="10.21.12.70", site=site, connection_monitoring=True
        )
        factories.SystemFactory(
            ip_address="10.21.16.70", site=site, connection_monitoring=True
        )

        category1 = vfse_factories.CategoryFactory(name="UltraSound")
        category2 = vfse_factories.CategoryFactory(name="MRI")
        category3 = vfse_factories.CategoryFactory(name="ECG")
        category4 = vfse_factories.CategoryFactory(name="CT")

        folder = vfse_factories.FolderFactory(
            categories=[category1, category2, category3, category4]
        )
        vfse_factories.FolderFactory(
            categories=[category1, category2, category3, category4]
        )
        vfse_factories.FolderFactory(
            categories=[category1, category2, category3, category4]
        )
        vfse_factories.FolderFactory(
            categories=[category1, category2, category3, category4]
        )

        vfse_factories.DocumentFactory.create_batch(
            10, folder=folder, categories=[category1, category2, category3, category4]
        )

        topic_1 = vfse_factories.TopicFactory(
            user=super_user, followers=users[2:7], categories=[category1, category2]
        )
        topic_2 = vfse_factories.TopicFactory(
            user=super_user, followers=users[1:4], categories=[category3]
        )
        topic_3 = vfse_factories.TopicFactory(
            user=super_user, followers=users[3:7], categories=[category4]
        )
        topic_4 = vfse_factories.TopicFactory(
            user=super_user, followers=users[4:6], categories=[category3, category2]
        )
        topic_5 = vfse_factories.TopicFactory(
            user=customer_admin,
            followers=users[2:7] + [super_user],
            categories=[category1, category4],
        )

        vfse_factories.CommentFactory.create_batch(
            size=3, topic=topic_1, user=fse_admin
        )
        vfse_factories.CommentFactory.create_batch(size=5, topic=topic_2, user=fse_role)
        vfse_factories.CommentFactory.create_batch(
            size=2, topic=topic_3, user=user_admin
        )
        vfse_factories.CommentFactory.create_batch(
            size=6, topic=topic_4, user=customer_admin
        )
        vfse_factories.CommentFactory.create_batch(
            size=4, topic=topic_5, user=fse_admin
        )

        self.stdout.write(self.style.SUCCESS("Successfully generated data."))
