import csv

from django.core.management import BaseCommand
from django.db import transaction

from core import models, serializers


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("file", nargs="+", type=str)

    @transaction.atomic
    def handle(self, *args, **options):
        with open(options["file"][0]) as csv_file:
            for row in csv.DictReader(csv_file):
                organization = self.add_organization(row)
                site = self.add_site(row, organization)
                product_model = self.add_product(row)
                self.add_system(row, site, product_model)

            self.stdout.write(
                self.style.SUCCESS(
                    f"Data Imported successfully imported from {csv_file.name}"
                )
            )

    def add_organization(self, row):
        organization = serializers.OrganizationSerializer(
            data={
                "name": row["Organization Name"],
                "appearance": {
                    "sidebar_text": "#94989E",
                    "button_text": "#FFFFFF",
                    "sidebar_color": "#142139",
                    "primary_color": "#773CBD",
                    "font_one": "helvetica",
                    "font_two": "calibri",
                    "logo": row.get(
                        "Organization Logo URL",
                        "https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview.png",
                    ),
                    "banner": "http://example.com/image.jpg",
                    "icon": "http://example.com/icon.ico",
                },
            }
        )
        organization.is_valid(raise_exception=True)
        return organization.save()

    def add_site(self, row, organization):
        site = serializers.MetaSiteSerializer(
            data={
                "name": row["Site Name"],
                "address": row["Site Address"],
            }
        )
        site.is_valid(raise_exception=True)
        return site.save(organization=organization)

    def add_product(self, row):
        manufacturer_image = models.ManufacturerImage.objects.create(
            image=row["Manufacturer Image URL"]
        )
        manufacturer = models.Manufacturer.objects.create(
            name=row["Manufacturer Name"], image=manufacturer_image
        )
        product = models.Product.objects.create(
            name=row["Product Name"], manufacturer=manufacturer
        )
        modality = models.Modality.objects.create(name=row["Modality"])
        documentation = models.Documentation.objects.create(
            url=row["Documentation Link"]
        )
        product_model = serializers.ProductModelSerializer(
            data={
                "product": product.id,
                "modality": modality.id,
                "documentation": documentation.id,
            }
        )
        product_model.is_valid(raise_exception=True)
        return product_model.save()

    def add_system(self, row, site, product_model):
        system_image = models.SystemImage.objects.create(image=row["Image URL"])
        system = serializers.SystemSerializer(
            data={
                "name": row["Name"],
                "site": site.id,
                "product_model": product_model.id,
                "software_version": row["Software Version"],
                "asset_number": row["Asset Number"],
                "ip_address": row["IP Address"],
                "local_ae_title": row["Local AE Title"],
                "serial_number": row["Serial Number"],
                "location_in_building": row["Location in Building"],
                "system_contact_info": row["Contact Info"],
                "virtual_media_control": row["Virtual Media Control"],
                "service_web_browser": row["Service Web Browser"],
                "ssh": row["SSH"],
                "contection_monitoring": row["Connection Monitoring"],
                "image": system_image.id,
            }
        )

        system.is_valid(raise_exception=True)
        system.save()
