from django.core.management.base import BaseCommand
from django.db import transaction

from app import settings
from core.tests import factories
from vfse.tests import factories as vfse_factories


class Command(BaseCommand):
    help = "Generate fake date"

    def handle_user(self, orgname):
        customer_admin = factories.UserWithPasswordFactory(
            username="customer-admin@" + orgname + ".com"
        )
        fse_admin = factories.UserWithPasswordFactory(
            username="fse-admin@" + orgname + ".com", profile__manager=customer_admin
        )
        user_admin = factories.UserWithPasswordFactory(
            username="user-admin@" + orgname + ".com", profile__manager=customer_admin
        )
        fse_role = factories.UserWithPasswordFactory(
            username="fse@" + orgname + ".com", profile__manager=customer_admin
        )
        end_user_role = factories.UserWithPasswordFactory(
            username="end-user@" + orgname + ".com", profile__manager=customer_admin
        )
        view_only = factories.UserWithPasswordFactory(
            username="view-only@" + orgname + ".com", profile__manager=customer_admin
        )
        one_time_role = factories.UserWithPasswordFactory(
            username="one-time@" + orgname + ".com", profile__manager=customer_admin
        )
        cryo = factories.UserWithPasswordFactory(
            username="cryo@" + orgname + ".com", profile__manager=customer_admin
        )
        cryo_fse = factories.UserWithPasswordFactory(
            username="cryo-fse@" + orgname + ".com", profile__manager=customer_admin
        )
        cryo_admin = factories.UserWithPasswordFactory(
            username="cryo-admin@" + orgname + ".com", profile__manager=customer_admin
        )
        return [
            customer_admin,
            fse_admin,
            user_admin,
            fse_role,
            end_user_role,
            view_only,
            one_time_role,
            cryo,
            cryo_fse,
            cryo_admin,
        ]

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

        ssh_user = factories.UserWithPasswordFactory(
            username="ssh-user@example.com",
            profile__manager=super_user,
            is_remote_user=True,
        )

        health_network_626_users = self.handle_user("626")
        orgnization = factories.OrganizationFactory(
            is_default=True,
            name="626",
            number_of_seats=10,
        )
        product_model = factories.ProductModelFactory(
            modality__users=health_network_626_users,
            modality__users__organization=orgnization,
        )
        factories.HealthNetworkFactory(
            name="626 Health Network",
            organizations=[orgnization],
            users=health_network_626_users,
            site__users=health_network_626_users,
            site__system__users=health_network_626_users,
            site__system__product_model=product_model,
        )

        all_data_users = self.handle_user("example")
        organization = factories.OrganizationFactory(
            name="All Data",
            is_customer=True,
            number_of_seats=10,
            site__name="All data Site",
            site__users=all_data_users,
            site__system__users=all_data_users,
            fse_admin_roles=[all_data_users[1]],
            customer_admin_roles=[all_data_users[0]],
            user_admin_roles=[all_data_users[2]],
            fse_roles=[all_data_users[3], ssh_user],
            end_user_roles=[all_data_users[4]],
            view_only_roles=[all_data_users[5]],
            one_time_roles=[all_data_users[6]],
            cryo_roles=[all_data_users[7]],
            cryo_fse_roles=[all_data_users[8]],
            cryo_admin_roles=[all_data_users[9]],
            sites=True,
        )

        health_network = factories.HealthNetworkFactory(
            name="Health Network with Sites",
            organizations=[organization],
            site__name="sites with Systems",
            users=all_data_users + [ssh_user],
            site__users=all_data_users,
            site__system__users=all_data_users,
            site__system__product_model=product_model,
            site__system__connection_monitoring=True,
        )

        site = factories.SiteFactory(
            name="Site with Systems",
            organization=health_network,
            system__connection_monitoring=True,
            system__users=all_data_users + [ssh_user],
            users=all_data_users + [ssh_user],
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
            },
        )

        # Crothal
        crothal_users = self.handle_user("crothal")
        orgnization = factories.OrganizationFactory(
            name="Crothal",
            is_customer=True,
            number_of_seats=10,
            sites=True,
            site__users=crothal_users,
            site__system__users=crothal_users,
            site__name="Crothal Site",
            site__system__name="Crothal System",
            site__system__seats=True,
        )
        factories.HealthNetworkFactory(
            name="Crothal Health Network",
            organizations=[orgnization],
            users=crothal_users,
            site__users=crothal_users,
            site__system__users=crothal_users,
            site__system__product_model=product_model,
        )

        # Alira
        alira_users = self.handle_user("alira")
        orgnization = factories.OrganizationFactory(
            name="Alira Health",
            logo="https://"
            + settings.AWS_STORAGE_BUCKET_NAME
            + ".s3.us-east-2.amazonaws.com/alirahealth.png",
            number_of_seats=10,
            is_customer=True,
            sites=True,
            site__users=alira_users,
            site__system__users=alira_users,
            site__name="Alira Site",
            site__system__name="Alira System",
            site__system__seats=True,
        )
        factories.HealthNetworkFactory(
            name="Alira Health Network",
            organizations=[orgnization],
            users=alira_users,
            site__users=alira_users,
            site__system__users=alira_users,
            site__system__product_model=product_model,
        )
        factories.SystemFactory.create_batch(
            10, seats=True, site=organization.sites.first()
        )

        # Conni
        conni_users = self.handle_user("conni")
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
            site__users=conni_users,
            site__system__users=conni_users,
        )
        factories.HealthNetworkFactory(
            name="Conni Health Network",
            organizations=[orgnization],
            users=conni_users,
            site__users=conni_users,
            site__system__users=conni_users,
            site__system__product_model=product_model,
        )

        # Coventry
        coventry_users = self.handle_user("coventry")
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
            site__users=coventry_users,
            site__system__users=coventry_users,
        )
        factories.HealthNetworkFactory(
            name="Conventry Health Network",
            organizations=[orgnization],
            users=coventry_users,
            site__users=coventry_users,
            site__system__users=coventry_users,
            site__system__product_model=product_model,
        )

        # Heart Beat
        heartbeat_users = self.handle_user("heartbeat")
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
            site__users=heartbeat_users,
            site__system__users=heartbeat_users,
        )
        product_model = factories.ProductModelFactory(
            modality__users=heartbeat_users,
            modality__users__organization=organization,
        )
        factories.HealthNetworkFactory(
            name="Heartbeat Health Network",
            organizations=[orgnization],
            users=heartbeat_users,
            site__users=heartbeat_users,
            site__system__users=heartbeat_users,
            site__system__product_model=product_model,
        )

        # Bulk Creations
        factories.SystemFactory.create_batch(
            5,
            site=site,
            users=all_data_users,
        )
        factories.OrganizationFactory.create_batch(
            175,
            is_customer=True,
            number_of_seats=10,
        )
        factories.HealthNetworkFactory.create_batch(
            5,
            organizations=[organization],
            users=all_data_users,
            site__system__product_model=product_model,
        )
        factories.SiteFactory.create_batch(
            5,
            organization=health_network,
            users=all_data_users,
            system__users=all_data_users,
            system__product_model=product_model,
        )
        factories.SystemFactory.create_batch(
            10,
            seats=True,
            site=health_network.sites.first(),
            users=all_data_users,
        )
        factories.SiteFactory.create_batch(
            5,
            organization=organization.health_networks.last().health_network,
            users=all_data_users,
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
            user=super_user,
            followers=all_data_users[2:7],
            categories=[category1, category2],
        )
        topic_2 = vfse_factories.TopicFactory(
            user=super_user, followers=all_data_users[1:4], categories=[category3]
        )
        topic_3 = vfse_factories.TopicFactory(
            user=super_user, followers=all_data_users[3:7], categories=[category4]
        )
        topic_4 = vfse_factories.TopicFactory(
            user=super_user,
            followers=all_data_users[4:6],
            categories=[category3, category2],
        )
        topic_5 = vfse_factories.TopicFactory(
            user=all_data_users[0],
            followers=all_data_users[2:7] + [super_user],
            categories=[category1, category4],
        )

        vfse_factories.CommentFactory.create_batch(
            size=3, topic=topic_1, user=all_data_users[1]
        )
        vfse_factories.CommentFactory.create_batch(
            size=5, topic=topic_2, user=all_data_users[3]
        )
        vfse_factories.CommentFactory.create_batch(
            size=2, topic=topic_3, user=all_data_users[2]
        )
        vfse_factories.CommentFactory.create_batch(
            size=6, topic=topic_4, user=all_data_users[0]
        )
        vfse_factories.CommentFactory.create_batch(
            size=4, topic=topic_5, user=all_data_users[1]
        )

        self.stdout.write(self.style.SUCCESS("Successfully generated data."))
