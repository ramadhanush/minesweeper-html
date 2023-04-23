FROM nginx:latest
COPY . /usr/share/nginx/html
EXPOSE 6000
CMD ["nginx", "-g", "daemon off;"]