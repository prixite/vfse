from functools import wraps

from django import test
from rest_framework.authtoken.models import Token


def add_default_json_content_type(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        if "content_type" not in kwargs:
            kwargs["content_type"] = "application/json"

        return func(self, *args, **kwargs)

    return wrapper


class Client(test.Client):
    def __init__(self, *args, **kwargs):
        self.default_headers = {}
        super().__init__(*args, **kwargs)

    @add_default_json_content_type
    def get(self, *args, **kwargs):
        return super().get(*args, **{**self.default_headers, **kwargs})

    @add_default_json_content_type
    def post(self, *args, **kwargs):
        return super().post(*args, **{**self.default_headers, **kwargs})

    @add_default_json_content_type
    def put(self, *args, **kwargs):
        return super().put(*args, **kwargs)

    @add_default_json_content_type
    def patch(self, *args, **kwargs):
        return super().patch(*args, **kwargs)

    def force_token_login(self, user):
        self.default_headers[
            "HTTP_AUTHORIZATION"
        ] = f"Token {Token.objects.get(user=user).key}"
