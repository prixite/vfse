FROM nginx:1.17.6

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

COPY vfse.626.healthcare/cert.pem /etc/ssl/cert.pem
COPY vfse.626.healthcare/key.pem /etc/ssl/key.pem
COPY vfse.626.healthcare/password.list /etc/ssl/password.list
