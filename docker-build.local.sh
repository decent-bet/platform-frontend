#!/bin/bash
VERSION=$(cat ./VERSION)

echo "Updating submodules..."
git submodule foreach git pull origin master

echo "Install dependencies and build..."
npm i --silent && npm build

echo "Building version $VERSION"
docker build -t dbet-platform/platform-frontend:latest .
docker tag dbet-platform/platform-frontend:latest dbet-platform/platform-frontend:latest
docker-compose up --force-recreate