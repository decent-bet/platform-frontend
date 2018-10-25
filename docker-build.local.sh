#!/bin/bash
VERSION=$1

echo "Building version $VERSION"
docker build -t dbet-platform/platform-frontend:latest .
docker tag dbet-platform/platform-frontend:latest dbet-platform/platform-frontend:latest
echo "done $VERSION"
docker-compose up --force-recreate