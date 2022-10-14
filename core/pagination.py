import drf_link_header_pagination
from drf_link_header_pagination import LinkHeaderPagination
from drf_yasg import inspectors


class OrganizationPagination(LinkHeaderPagination):
    page_size = 50


class DjangoRestResponsePagination(inspectors.DjangoRestResponsePagination):
    def get_paginated_response(self, paginator, response_schema):
        if isinstance(paginator, drf_link_header_pagination.LinkHeaderPagination):
            return response_schema

        return super().get_paginated_response(paginator, response_schema)
