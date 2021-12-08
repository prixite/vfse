from django.contrib.auth.forms import AuthenticationForm
from rest_framework.exceptions import ValidationError


class UserLoginForm(AuthenticationForm):
    def confirm_login_allowed(self, user):
        if user.profile.is_one_time and user.profile.one_time_complete:
            raise ValidationError(
                self.error_messages["invalid_login"], code="invalid_login"
            )
        return super().confirm_login_allowed()
