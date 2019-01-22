# Cloud Build

Debug locally

```bash
# execute from ci-travis
cloud-build-local --config=frontend/staging.cloudbuild.yaml --dryrun=false --substitutions \_APP_ENGINE_FRONTEND_SERVICE="http://frontend" .
```
