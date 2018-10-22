#!/bin/bash
VERSION=$(cat ./VERSION)

echo "Updating submodules..."
git submodule foreach git pull origin develop

echo "Install dependencies and build..."
npm i --silent && npm build

echo "Building version $VERSION"
docker build -t us.gcr.io/dbet-platform/platform-frontend:$VERSION .
docker tag us.gcr.io/dbet-platform/platform-frontend:$VERSION us.gcr.io/dbet-platform/platform-frontend:$VERSION
echo "Building version $VERSION"
docker push us.gcr.io/dbet-platform/platform-frontend