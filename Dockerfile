## Switch to nginx 
FROM nginx:alpine

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY build /usr/share/nginx/html

## Expose port and start application
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
