import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
django.setup()
