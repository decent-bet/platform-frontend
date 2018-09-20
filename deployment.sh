#!/bin/bash
VERSION=$(cat ./VERSION)

echo "Building and pushing version $VERSION"
docker build -t us.gcr.io/dbet-platform/platform-frontend:$VERSION .
docker tag us.gcr.io/dbet-platform/platform-frontend:$VERSION us.gcr.io/dbet-platform/platform-frontend:$VERSION
docker push us.gcr.io/dbet-platform/platform-frontend