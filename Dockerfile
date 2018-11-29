# base
FROM node:10-alpine AS builder

ARG APP_ENV

ENV NPM_CONFIG_LOGLEVEL=error
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
RUN git submodule foreach git checkout master && git submodule foreach git pull origin master
RUN npm run build:${APP_ENV}


## Switch to nginx 
FROM nginx:alpine

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /var/service/build /usr/share/nginx/html

## Expose port and start application
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
