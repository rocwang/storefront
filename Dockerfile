FROM nginx:alpine
COPY nginx /etc/nginx
COPY test /usr/share/nginx/html
