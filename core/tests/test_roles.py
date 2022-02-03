import re

from django import urls

from core.tests.base import BaseTestCase


class PermissionTestCase(BaseTestCase):
    def test_super_user_permissions(self):
        self.client.force_login(self.super_admin)
        urlpaths = urls.get_resolver(urls.get_urlconf())
        paths = [
            str(path.pattern)
            for path in urlpaths.url_patterns
            if str(path.pattern).startswith("api/")
        ]

        print("Checking GET requests,", end=" ")
        for url in paths:
            url_path = re.sub(r"<([\w:]+)>", "1", str(url))
            response = self.client.get(f"/{url_path}")
            self.assertNotEqual(response.status_code, 403)
        print("completed successfully.")

        print("Checking POST requests,", end=" ")
        for url in paths:
            url_path = re.sub(r"<([\w:]+)>", "1", str(url))
            response = self.client.post(f"/{url_path}", data={})
            self.assertNotEqual(response.status_code, 403)
        print("completed successfully.")

        print("Checking PATCH requests,", end=" ")
        for url in paths:
            url_path = re.sub(r"<([\w:]+)>", "1", str(url))
            response = self.client.patch(
                f"/{url_path}", data={"users": [], "health_networks": [], "email": ""}
            )
            self.assertNotEqual(response.status_code, 403)
        print("completed successfully.")

        print("Checking PUT requests,", end=" ")
        for url in paths:
            url_path = re.sub(r"<([\w:]+)>", "1", str(url))
            response = self.client.put(
                f"/{url_path}", data={"users": [], "health_networks": []}
            )
            self.assertNotEqual(response.status_code, 403)
        print("completed successfully.")

    def test_customer_admin_role(self):
        pass
