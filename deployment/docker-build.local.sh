#!/bin/bash
VERSION=$(cat ./VERSION)

echo "Building local version $VERSION"
docker build -t us.gcr.io/dbet-platform/platform-frontend:$VERSION ../
docker tag us.gcr.io/dbet-platform/platform-frontend:$VERSION us.gcr.io/dbet-platform/platform-frontend:$VERSION
cd ..
docker-compose up