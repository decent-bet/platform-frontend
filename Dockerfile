## Switch to nginx 
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY ./build_webpack/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
## Expose port and start application
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
