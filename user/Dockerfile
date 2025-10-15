FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
COPY ngnix.conf /etc/nginx/conf.d/default.conf
CMD [ "nginx", "-g", "daemon off;" ]