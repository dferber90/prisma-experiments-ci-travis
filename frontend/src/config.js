// Use this file to forward server-env variables to the client.
// Import the env variables from here when writing code used by server & client.
export const GRAPHQL_ENDPOINT =
  typeof window !== "undefined"
    ? window.env.GRAPHQL_ENDPOINT
    : process.env.GRAPHQL_ENDPOINT;
