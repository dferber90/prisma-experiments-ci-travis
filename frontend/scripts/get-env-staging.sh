#!/bin/sh

if [[ ! $BRANCH_NAME =~ ^[a-z0-9-]+$ ]]; then
  echo "⚠️ Branch name '$BRANCH_NAME' invalid."
  echo "Branch names must be lowercase and may only contain a-z, dashes (-) and 0-9"
  exit 1
fi

export APP_ENGINE_FRONTEND_SERVICE="staging"
export APP_ENGINE_GRAPHQL_SERVER_SERVICE="graphql-server-staging"

# where frontend deploys to
export FRONTEND_ENDPOINT="https://$APP_VERSION-dot-staging-dot-$APP_ENGINE_PROJECT_NAME.appspot.com"
# where graphql-service deploys to
export GRAPHQL_ENDPOINT="https://$APP_VERSION-dot-graphql-server-staging-dot-$APP_ENGINE_PROJECT_NAME.appspot.com"

# prisma stage depends on branch, so that we can reuse the database
export PRISMA_ENDPOINT="$PRISMA_SERVER/$PRISMA_SERVICE_NAME/$BRANCH_NAME"
export PRISMA_SEED="./seed.dev.graphql"

# pushd graphql-server/prisma-services;
#   prisma deploy --json;
# popd
