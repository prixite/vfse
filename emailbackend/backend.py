from django.core.mail.backends.base import BaseEmailBackend

from emailbackend.models import Email


class DatabaseBackend(BaseEmailBackend):
    def send_messages(self, email_messages):
        """
        Send one or more EmailMessage objects and return the number of email
        messages sent.
        """
        for email in email_messages:
            Email.objects.create(
                email_from=email.from_email,
                email_to=",".join(email.to),
                body=email.body,
                html=email.alternatives[0][0] if email.alternatives else None,
                subject=email.subject,
            )

        return len(email_messages)
