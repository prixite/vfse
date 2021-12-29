from django.core.management import BaseCommand
import csv

from core.tests import factories

class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('file',nargs='+',type=str)

    def handle(self, *args, **options):
        print(options['file'])
        with open(options['file'][0]) as csv_file:
            file = csv.reader(csv_file)
            headers = next(file)
            for row in file:
                print(row,'row is here')

                ['system.name', 'organization_name', 'organization.appearance.logo', 'site_name', 'site_address', 'product_name', 'manufacturer_name', 
                'manufacturer.manufactuter_image', 'product_model', 'modality.name', 'documentation_link', 'system.image', 'system.software_version', 
                'system.asset_number', 'system.ip_address', 'system.local_ae_title', 'system.serial_number', 'system.location_in_building', 
                'system.contact_info', 'Seat.system', 'system.virtual_media_control', 'system.service_browser', 'system.ssh', 'system.connection_monitoring']

        ['Name', 'Organization Name', 'Organization Logo URL', 'Site Name', 'Site Address', 'Product Name', 'Manufacturer Name', 'Manufacturer Image URL', 'Product Model', 
        'Modality', 'Documentation Link', 'Image URL', 'Software Version', 'Asset Number', 'IP Address', 
        'Local AE Title', 'Serial Number', 'Location in Building', 'Contact Info', 'vFSE', 'Virtual Media Control', 'Service Web Browser', 'SSH', 'Connection Monitoring']
            factories.OrganizationFactory(
                name = 'Organization Name',
                logo = 'Organization Logo Url',
                site__name='Site Name',
                site__address='Site Address',
                system__name='Name',
                system__product_model__product__name='Product Name',
                system__product_model__product__manfacturer__name='Manufacturer Name',
                system__product_model__product__manfacturer__image='Manufacturer Image URL',
                system__product_model='Product Model',
                system__product_model__modality="Modality",
                system__product_model__documentation='Documentation Link',
                system__image='Image URL',
                system__software_version='Software Version',
                system__asset_number="Asset Number",
                system__ip_addrss='IP Address',
                system__local_ae_title='Local AE Title',
                system__serial_number='Serial Number',
                system__location_in_building='Location in Building',
                system__system_contact_info='Contact Info',
                # Add seat
            )