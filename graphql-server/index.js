// https://github.com/prisma/graphql-yoga/tree/master/examples/lambda

const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers: {
    Query: {
      user(root, args, context) {
        return context.prisma.user({ id: args.userId });
      },
      allUsers(root, args, context) {
        return context.prisma.users();
      }
    }
  },
  context: context => ({
    ...context,
    prisma
  })
});

const port = process.env.PORT || 4000;

server.start(
  {
    port,
    cors: {
      origin: true,
      credentials: true
    }
  },
  () => console.log(`GraphQL-Server is running on http://localhost:${port}`)
);
