FROM nginx:stable-alpine-perl

COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
