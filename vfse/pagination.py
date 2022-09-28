from django.utils import timezone
from drf_link_header_pagination import LinkHeaderPagination
from rest_framework.response import Response

from core import models


class TopicPagination(LinkHeaderPagination):
    page_size = 10


class ActiveUsersPagtination(LinkHeaderPagination):
    page_size = 10

    def get_paginated_response(self, data):
        count = models.User.objects.filter(
            last_login__gte=timezone.now().astimezone() - timezone.timedelta(days=30)
        ).count()
        next_url = self.get_next_link()
        previous_url = self.get_previous_link()
        first_url = self.get_first_link()
        last_url = self.get_last_link()

        links = []
        for url, label in (
            (first_url, "first"),
            (previous_url, "prev"),
            (next_url, "next"),
            (last_url, "last"),
        ):
            if url:
                links.append('<{}>; rel="{}"'.format(url, label))

        headers = (
            {"Link": ", ".join(links), "Count": count} if links else {"Count": count}
        )

        return Response(data, headers=headers)
