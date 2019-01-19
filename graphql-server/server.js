const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers: {
    Query: require("./resolvers/Query.js")
  },
  context: context => ({ ...context, prisma })
});

const port = process.env.PORT || 4000;

server.start(
  {
    port,
    cors: { origin: true, credentials: true }
  },
  () => console.log(`GraphQL-Server is running on http://localhost:${port}`)
);
