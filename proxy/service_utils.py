import re

from fastapi import Request


def is_authenticated(request: Request) -> bool:
    return 'sessionid' in request.cookies


def get_system_id_from_referrer(referrer):
    result = re.search(r"/htmlproxy/(\d+)/service/", referrer)
    if not result:
        return

    return int(result.group(1))
