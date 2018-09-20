# STEP 1: build a static website

## Create a builderbuilder 
FROM node:9-alpine as builder

# Add Git and Build Tools.
RUN apk update && apk --no-cache --virtual build-dependencies add \
    git \
    openssh \
    python \
    make \
    g++

RUN mkdir -p /srv/platform-frontend
WORKDIR /srv/platform-frontend

## Copy, install app dependencies and build
COPY . .
RUN yarn install --silent

## Update game submodules
RUN git submodule foreach git pull origin master
## Copy app source code and build
RUN yarn build

# STEP 2: build a small nginx image with static website

## Switch to nginx 
FROM nginx:alpine
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /srv/platform-frontend/build /usr/share/nginx/html

## Expose port and start application
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
