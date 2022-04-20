from django.apps import AppConfig


class VfseConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "vfse"

    def ready(self):
        # import for implicit side affect
        import vfse.signals  # noqa
