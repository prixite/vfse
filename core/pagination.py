import drf_link_header_pagination
from drf_yasg2 import inspectors


class DjangoRestResponsePagination(inspectors.DjangoRestResponsePagination):
    def get_paginated_response(self, paginator, response_schema):
        if isinstance(paginator, drf_link_header_pagination.LinkHeaderPagination):
            return response_schema
