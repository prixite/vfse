"""
Django settings for app project.

Generated by 'django-admin startproject' using Django 3.2.8.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""
import os
from pathlib import Path

import dj_database_url
import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!

env = environ.Env(
    DEBUG=(bool, False),
    DATABASE_URL=(str, None),
    NPLUSONE_RAISE=(bool, False),
    AWS_ACCESS_KEY_ID=(str, None),
    AWS_SECRET_ACCESS_KEY=(str, None),
    AWS_DEFAULT_REGION=(str, None),
    AWS_STORAGE_BUCKET_NAME=(str, None),
    AWS_THUMBNAIL_LAMBDA_ARN=(str, None),
    ALLOWED_HOSTS=(list, []),
    CSRF_TRUSTED_ORIGINS=(list, ["https://app.vfse.io"]),
    EMAIL_BACKEND=(str, None),
    EMAIL_HOST=(str, None),
    EMAIL_PORT=(int, 587),
    EMAIL_USE_TLS=(bool, True),
    EMAIL_HOST_USER=(str, None),
    EMAIL_HOST_PASSWORD=(str, None),
    DEFAULT_FROM_EMAIL=(str, "noreply@626.healthcare"),
    DUO_CLIENT_ID=(str, None),
    DUO_CLIENT_SECRET=(str, None),
    DUO_API_HOSTNAME=(str, None),
    DUO_REDIRECT_URI=(str, None),
    INFLUX_TOKEN=(str, None),
    INFLUX_ORG=(str, None),
    INFLUX_BUCKET=(str, None),
    INFLUX_DB_URL=(str, None),
    INFLUX_GPS_TOKEN=(str, None),
    INFLUX_GPS_BUCKET=(str, None),
    OPENAI_API_KEY=(str, None),
    DOMAIN_NAME=(str, "https://app.vfse.io"),
    X_CP_API_ID=(str, None),
    X_CP_API_KEY=(str, None),
    X_ECM_API_ID=(str, None),
    X_ECM_API_KEY=(str, None),
    AUTHENTICATION_CLASSES=(list, []),
)

environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

DEBUG = env("DEBUG")

SECRET_KEY = env("SECRET_KEY")

ALLOWED_HOSTS = env("ALLOWED_HOSTS")

CSRF_TRUSTED_ORIGINS = env("CSRF_TRUSTED_ORIGINS")

AUTHENTICATION_CLASSES = env("AUTHENTICATION_CLASSES")
# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_extensions",
    "django.contrib.sites",
    # 3rd party apps
    "rest_framework",
    "rest_framework.authtoken",
    "drf_yasg",
    "drf_link_header_pagination",
    "django_filters",
    "webpack_loader",
    "corsheaders",
    # apps
    "core",
    "emailbackend",
    "vfse",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

NPLUSONE_RAISE = env("NPLUSONE_RAISE")

if NPLUSONE_RAISE:
    INSTALLED_APPS += [
        "nplusone.ext.django",
    ]

    MIDDLEWARE += [
        "nplusone.ext.django.NPlusOneMiddleware",
    ]

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "static"

STATICFILES_DIRS = [
    BASE_DIR / "frontend/dist/",
    BASE_DIR / "frontend/src/",
]

ROOT_URLCONF = "app.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "app.wsgi.application"

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

if env("DATABASE_URL"):
    DATABASES = {"default": dj_database_url.parse(env("DATABASE_URL"))}

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",  # noqa
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
    {"NAME": "app.password_validators.ContainsNumberValidator"},
    {"NAME": "app.password_validators.ContainsUpperCaseValidator"},
    {"NAME": "app.password_validators.ContainsLowerCaseValidator"},
    {"NAME": "app.password_validators.ContainsSpecialCharacterValidator"},
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/


# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "core.User"

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
}
if AUTHENTICATION_CLASSES:
    REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"] = AUTHENTICATION_CLASSES

MEDIA_URL = "media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media/")

LOGIN_REDIRECT_URL = "/"

EMAIL_BACKEND = (
    "django.core.mail.backends.console.EmailBackend"
    if DEBUG and not env("EMAIL_BACKEND")
    else env("EMAIL_BACKEND")
)
EMAIL_HOST = env("EMAIL_HOST")
EMAIL_PORT = env("EMAIL_PORT")
EMAIL_USE_TLS = env("EMAIL_USE_TLS")
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL")

DUO_CLIENT_ID = env("DUO_CLIENT_ID")
DUO_CLIENT_SECRET = env("DUO_CLIENT_SECRET")
DUO_API_HOSTNAME = env("DUO_API_HOSTNAME")
DUO_REDIRECT_URI = env("DUO_REDIRECT_URI")

SWAGGER_SETTINGS = {
    "DEFAULT_INFO": "app.urls.api_info",
    "DEFAULT_PAGINATOR_INSPECTORS": [
        "core.pagination.DjangoRestResponsePagination",
        "drf_yasg.inspectors.CoreAPICompatInspector",
    ],
}

AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
AWS_DEFAULT_REGION = env("AWS_DEFAULT_REGION")
AWS_THUMBNAIL_LAMBDA_ARN = env("AWS_THUMBNAIL_LAMBDA_ARN")
AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
INFLUX_TOKEN = env("INFLUX_TOKEN")
INFLUX_ORG = env("INFLUX_ORG")
INFLUX_BUCKET = env("INFLUX_BUCKET")
INFLUX_DB_URL = env("INFLUX_DB_URL")
INFLUX_GPS_TOKEN = env("INFLUX_GPS_TOKEN")
INFLUX_GPS_BUCKET = env("INFLUX_GPS_BUCKET")

OPENAI_API_KEY = env("OPENAI_API_KEY")
DOMAIN_NAME = env("DOMAIN_NAME")

WEBPACK_LOADER = {
    "DEFAULT": {
        "CACHE": not DEBUG,
        "STATS_FILE": os.path.join(BASE_DIR, "webpack-stats.json"),
        "POLL_INTERVAL": 0.1,
        "IGNORE": [r".+\.hot-update.js", r".+\.map"],
    }
}

SITE_ID = 1

CRON_CLASSES = [
    "core.cron.CradlePointJob",
]

X_CP_API_ID = env("X_CP_API_ID")
X_CP_API_KEY = env("X_CP_API_KEY")
X_ECM_API_ID = env("X_ECM_API_ID")
X_ECM_API_KEY = env("X_ECM_API_KEY")

CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS").split(",")
