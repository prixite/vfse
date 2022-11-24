FROM vfse_app

RUN apt-get update && apt-get install -y cron

COPY ./docker/scripts/crontab /etc/cron.d/crontab

RUN chmod 0644 /etc/cron.d/crontab
RUN /usr/bin/crontab /etc/cron.d/crontab
# Run cron in foreground as PID 1. We use PID 1 for redirection in scripts/crontab
CMD ["cron", "-f"]
