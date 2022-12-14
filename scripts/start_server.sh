docker-compose -f docker-compose.staging.yml build;
docker-compose -f docker-compose.staging.yml up -d;
docker-compose -f docker-compose.staging.yml exec app ./manage.py migrate;
docker-compose -f docker-compose.staging.yml exec app npm run build;
docker-compose -f docker-compose.staging.yml exec app ./manage.py collectstatic --noinput;
