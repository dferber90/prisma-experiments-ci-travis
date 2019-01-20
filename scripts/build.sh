#!/bin/bash

# constants
# APP_ENGINE_PROJECT_NAME is set on repo creation
# PRISMA_SERVER is set on repo creation
# PRISMA_SERVICE_NAME is set on repo creation

# testing

echo "TRAVIS_BRANCH $TRAVIS_BRANCH"
echo "TRAVIS_PULL_REQUEST $TRAVIS_PULL_REQUEST"
echo "TRAVIS_PULL_REQUEST_BRANCH $TRAVIS_PULL_REQUEST_BRANCH"

# APP_RELEASE_NAME: used as version in app engine deployment
# PRISMA_ENDPOINT: used as env-var for graphql-server

if [ "$TRAVIS_BRANCH" == "master" ]; then
  export APP_RELEASE_NAME="$(node scripts/generate-release-name.js)-$TRAVIS_BUILD_ID"
  export PRISMA_ENDPOINT="$PRISMA_SERVER/$PRISMA_SERVICE_NAME/production"
else
  # Release names may only use [a-zA-Z0-9] and be no longer than 63 chars
  # We should be able to have APP_RELEASE_NAME be "dev" / "production" as well
  # a-zA-Z0-9 and dashes, but may not start with a dash
  # see https://cloud.google.com/appengine/docs/standard/nodejs/config/appref
  export APP_RELEASE_NAME="preview-$(node scripts/generate-release-name.js)-$TRAVIS_BUILD_ID"

  # next stage
  # prisma stage depends on branch, so that we can reuse the database
  export PRISMA_ENDPOINT="$PRISMA_SERVER/$PRISMA_SERVICE_NAME/preview-$TRAVIS_PULL_REQUEST"
  # Deployments need unique names, so we generate one on every ci run
  # However, we can always have
  #  <branch-name>.<project-name>.<customer-name>.plumber.sh
  # pointing towards the latest deployment. Devs should then use that URL
  # instead of directly using the appspot URL.
  # This allows us to migrate traffic
fi


# where frontend deploys to
export FRONTEND_ENDPOINT="https://$APP_RELEASE_NAME-dot-$APP_ENGINE_PROJECT_NAME.appspot.com"
# where graphql-service deploys to
export GRAPHQL_ENDPOINT="https://$APP_RELEASE_NAME-dot-graphql-server-dot-$APP_ENGINE_PROJECT_NAME.appspot.com"

# generate client and deploy prisma schema (uses PRISMA_ENDPOINT)
pushd graphql-server/prisma-services;
prisma deploy --json;
popd

# build graphql-server (requires generated prisma client)
node scripts/generate-app-yaml.js graphql-server/app.template.yaml graphql-server/app.yaml
# yarn gs:deploy

# build frontend (requires GRAPHQL_ENDPOINT)
node scripts/generate-app-yaml.js frontend/app.template.yaml frontend/app.yaml
yarn fe:build
