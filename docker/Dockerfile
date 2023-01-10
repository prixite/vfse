FROM python:3.9.7

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

# Add buster Postgres repo. This is necessary to install postgresql-client-12
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ buster-pgdg main" | tee  /etc/apt/sources.list.d/pgdg.list

RUN apt-get update && apt-get install -y \
    postgresql-client-12 \
    libpq-dev \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    cron \
    g++

RUN curl -fsSL https://deb.nodesource.com/setup_17.x | bash -
RUN apt-get install -y nodejs

RUN pip install pip==21.1.3

WORKDIR /opt/code

COPY docker/scripts/crontab /etc/cron.d/crontab

RUN chmod 0644 /etc/cron.d/crontab
RUN /usr/bin/crontab /etc/cron.d/crontab

COPY requirements.txt requirements.txt
COPY requirements-dev.txt requirements-dev.txt

RUN pip install -r requirements-dev.txt

COPY requirements-prod.txt requirements-prod.txt
RUN pip install $(grep psycopg2 requirements-prod.txt)

COPY . ./
