# base
FROM node:10-alpine AS builder
ARG APP_ENV
ENV HOME=/var/service

# Add Git and Build Tools.
RUN apk --no-cache --virtual build-dependencies add \
    git \
    openssh \
    python \
    make \
    g++

WORKDIR $HOME

# Install app dependencies
COPY . $HOME/
RUN npm i --silent
CMD ["npm", "run", "build:$APP_ENV"]


## Switch to nginx 
FROM nginx:alpine

ENV SOURCE=/var/service/build

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder $SOURCE /usr/share/nginx/html


## Expose port and start application
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
