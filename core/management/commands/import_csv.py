import csv

from django.core.management import BaseCommand

from core.tests import factories


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('file',nargs='+',type=str)

    def handle(self, *args, **options):
        with open(options['file'][0]) as csv_file:
            model_map={'name':'Organization Name','logo':'Organization Logo Url','site__name':'Site Name','site__address':'Site Address','site__system__name':'Name','site__system__product_model__product__name':'Product Name',
            'site__system__product_model__product__manufacturer__name':'Manufacturer Name','site__system__product_model__product__manufacturer__image__image':'Manufacturer Image URL','site__system__product_model__modality__name':'Modality',
            'site__system__product_model__documentation__url':'Documentation Link','site__system__image__image':'Image URL','site__system__software_version':'Software Version','site__system__asset_number':'Asset Number',
            'site__system__ip_address':'IP Address','site__system__local_ae_title':'Local AE Title','site__system__serial_number':'Serial Number','site__system__location_in_building':'Location in Building','site__system__system_contact_info':'Contact Info',
            'site__system__virtual_media_control':'Virtual Media Control','site__system__service_web_browser':'Service Web Browser','site__system__ssh':'SSH','site__system__connection_monitoring':'Connection Monitoring'}
            
            file = csv.DictReader(csv_file)
            headers = file.fieldnames
            for row in file:
                factories.OrganizationFactory(sites=True,
                **{col_name:row[value] for col_name,value in model_map.items()})