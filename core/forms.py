from django.contrib.auth.forms import AuthenticationForm


class UserLoginForm(AuthenticationForm):
    def confirm_login_allowed(self, user):
        if user.profile.is_one_time and user.profile.one_time_complete:
            raise self.get_invalid_login_error()
        return super().confirm_login_allowed(user)
