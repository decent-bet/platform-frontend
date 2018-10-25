#!/bin/bash
VERSION=$1

echo "Building version $VERSION"
docker build -t us.gcr.io/dbet-platform/platform-frontend:$VERSION .
docker tag us.gcr.io/dbet-platform/platform-frontend:$VERSION us.gcr.io/dbet-platform/platform-frontend:$VERSION
echo "Pushing version $VERSION"
docker push us.gcr.io/dbet-platform/platform-frontend