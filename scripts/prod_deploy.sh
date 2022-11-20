#!/usr/bin/env bash
sudo docker-compose -f docker-compose.staging.yml build;
sudo docker-compose -f docker-compose.staging.yml up -d;
sudo docker-compose -f docker-compose.staging.yml exec app ./manage.py migrate;
sudo docker-compose -f docker-compose.staging.yml exec app npm run build;
sudo docker-compose -f docker-compose.staging.yml exec app ./manage.py collectstatic --noinput;
