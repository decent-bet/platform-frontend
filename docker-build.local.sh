#!/bin/bash
VERSION=$1
APP_ENV=$2

echo "Building version $VERSION for environment $APP_ENV"
docker build --build-arg APP_ENV=$APP_ENV -t dbet-platform/platform-frontend:latest .
docker tag dbet-platform/platform-frontend:latest dbet-platform/platform-frontend:latest
echo "done $VERSION"
docker-compose up --force-recreate