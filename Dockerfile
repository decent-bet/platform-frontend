# STEP 1 build static website

## create a builderbuilder 
FROM node:9-alpine as builder

# Add Git and Build Tools.
RUN apk update && apk --no-cache --virtual build-dependencies add \
    git \
    openssh \
    python \
    make \
    g++

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
## Install app dependencies
COPY package.json yarn.lock /usr/src/app/
RUN yarn install --silent
## Copy app source code and build
COPY . .
RUN yarn build

# STEP 2 build a small nginx image with static website
## switch to nginx 
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
## Remove default nginx website
COPY --from=builder /usr/src/app/build_webpack /usr/share/nginx/html

## Expose port and start application
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
