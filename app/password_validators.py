import re

from django.core.exceptions import ValidationError
from django.utils.translation import ugettext as _


class ContainsNumberValidator:
    def validate(self, password, user=None):
        if not re.search(r"\d+", password):
            raise ValidationError(
                _("The password must contain atleast one number"),
                code="password_no_number",
            )

    def get_help_text(self):
        return _("Your Password must contain atleast one number.")


class ContainsUpperCaseValidator:
    def validate(self, password, user=None):
        if not re.search(r"[A-Z]+", password):
            raise ValidationError(
                _("The password must contain atleast one Upper case letter"),
                code="password_no_uppercase",
            )

    def get_help_text(self):
        return _("Your password must contain at least one Upper case letter")


class ContainsLowerCaseValidator:
    def validate(self, password, user=None):
        if not re.search(r"[a-z]+", password):
            raise ValidationError(
                _("The password must contain atleast one lower case letter"),
                code="password_no_lowercase",
            )

    def get_help_text(self):
        return _("Your password must contain at least one lower case letter")


class ContainsSpecialCharacterValidator:
    def validate(self, password, user=None):
        if not re.search(r'[()[\]{}|\\`~!@#$%^&*_\-+=;:\'",<>./?]+', password):
            raise ValidationError(
                _("The password must contain atleast 1 special character"),
                code="password_no_special_character",
            )

    def get_help_text(self):
        return _("Your password must contain at least 1 special character")
