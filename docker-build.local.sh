#!/bin/bash
VERSION=$1

echo "Building version $VERSION"
docker build --build-arg APP_ENV=$APP_ENV -t dbet-platform/platform-frontend:latest .
docker tag dbet-platform/platform-frontend:latest dbet-platform/platform-frontend:latest
echo "done $VERSION"
docker-compose up --force-recreate