const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");
const path = require("path");

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, "schema.graphql"),
  resolvers: {
    Query: require("./resolvers/Query.js")
  },
  context: context => ({ ...context, prisma })
});

const port = process.env.PORT || 4000;

server
  .use((req, res, next) => {
    if (req.path.startsWith("/health")) {
      res.statusCode = 200;
      res.end();
      return;
    }
    return next();
  })
  .start(
    {
      port,
      cors: { origin: true, credentials: true }
    },
    () => console.log(`GraphQL-Server is running on http://localhost:${port}`)
  );
