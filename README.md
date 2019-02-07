# My Project :)

This project was used to experiment with branch deployments, with App Engine and with Cloud Build.

The application served here is not a fully featured app. See `razzle-page` instead.

## Setup

Make sure you have the required env files:

### `graphql-server/.env`

```
PRISMA_ENDPOINT=http://prisma-server.dferber.de:4466/my-app/dev
PRISMA_MANAGEMENT_API_SECRET=your-management-api-secret
PRISMA_SERVICE_SECRET=your-service-secret
```

### `frontend/.env.local`

```
GRAPHQL_ENDPOINT=http://localhost:4000
```
