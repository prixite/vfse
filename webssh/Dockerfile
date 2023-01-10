FROM python:3.11.1

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8


RUN pip install pip==21.1.3

WORKDIR /opt/webssh

COPY ./webssh/requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY ./docker/scripts/run-webssh ./docker/scripts/

COPY ./webssh ./webssh
COPY ./run.py ./
