#!/bin/bash
VERSION=$(cat ./VERSION)
echo "Updating submodules for games"
git submodule foreach git pull origin master

echo "Creating a build for production"
nvm use
yarn install --silent
yarn build

echo "Building and pushing version $VERSION"
docker build -t us.gcr.io/dbet-platform/platform-frontend:$VERSION .
docker tag us.gcr.io/dbet-platform/platform-frontend:$VERSION us.gcr.io/dbet-platform/platform-frontend:$VERSION
docker push us.gcr.io/dbet-platform/platform-frontend