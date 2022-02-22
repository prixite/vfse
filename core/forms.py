import boto3
from django import forms
from django.conf import settings
from django.contrib.auth.forms import AuthenticationForm


def upload_to_s3(file):
    uploaded = link = None
    client = boto3.client("s3")
    BUCKET_REGION = client.get_bucket_location(Bucket=settings.AWS_STORAGE_BUCKET_NAME)[
        "LocationConstraint"
    ]
    try:
        response = client.put_object(
            ACL="public-read",
            Body=file,
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=file.name,
        )
    except Exception:
        raise forms.ValidationError("Error uploading file, check AWS configurations")
    if response["ResponseMetadata"].get("HTTPStatusCode") == 200:
        uploaded = True
        link = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3-{BUCKET_REGION}.amazonaws.com/{file.name}"  # noqa
    return uploaded, link


class UserLoginForm(AuthenticationForm):
    def confirm_login_allowed(self, user):
        if user.profile.is_one_time and user.profile.one_time_complete:
            raise self.get_invalid_login_error()
        return super().confirm_login_allowed(user)


class ImageForm(forms.ModelForm):
    file = forms.ImageField(required=True)
    link = None

    class Meta:
        fields = ["file"]

    def clean_file(self):
        uploaded, link = upload_to_s3(self.files["file"])
        if uploaded:
            self.link = link
        else:
            raise forms.ValidationError("Failed to upload image")

    def save(self, commit):
        self.instance.image = self.link
        return super().save(commit)
