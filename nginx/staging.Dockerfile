FROM nginx:1.17.6

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.staging.conf /etc/nginx/conf.d
