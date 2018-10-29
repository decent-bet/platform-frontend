#!/bin/bash
VERSION=$1
APP_ENV=$2

echo "Building version $VERSION"
docker build --build-arg APP_ENV=$APP_ENV -t us.gcr.io/dbet-platform/platform-frontend:$VERSION .
docker tag us.gcr.io/dbet-platform/platform-frontend:$VERSION us.gcr.io/dbet-platform/platform-frontend:$VERSION
echo "Pushing version $VERSION"
docker push us.gcr.io/dbet-platform/platform-frontend