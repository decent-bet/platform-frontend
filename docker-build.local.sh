#!/bin/bash
VERSION=$(cat ./VERSION)

echo "Updating submodules..."
git submodule foreach git pull origin master

docker build -t us.gcr.io/dbet-platform/platform-frontend:latest .
docker tag us.gcr.io/dbet-platform/platform-frontend:latest us.gcr.io/dbet-platform/platform-frontend:latest
docker-compose up