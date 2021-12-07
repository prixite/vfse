from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError

class UserLoginForm(AuthenticationForm):
    
    def confirm_login_allowed(self, user):
        if user.profile.is_one_time and user.profile.one_time_complete:
            raise ValidationError(
                self.error_messages['invalid_login'],
                code='invalid_login'
            )
        else:
            user.profile.one_time_complete = True
            user.profile.save()
            
        if not user.is_active:
            raise ValidationError(
                self.error_messages['invalid_login'],
                code='invalid_login'
            )

        super().confirm_login_allowed

