FROM nginx:alpine
COPY nginx /etc/nginx
COPY test /etc/nginx/html
