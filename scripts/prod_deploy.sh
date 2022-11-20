#!/usr/bin/env bash
sudo docker-compose -f docker-compose.prod.yml build;
sudo docker-compose -f docker-compose.prod.yml up -d;
sudo docker-compose -f docker-compose.prod.yml exec app ./manage.py migrate;
sudo docker-compose -f docker-compose.prod.yml exec app npm run build;
sudo docker-compose -f docker-compose.prod.yml exec app ./manage.py collectstatic --noinput;
