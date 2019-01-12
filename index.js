const { prisma } = require("./generated/prisma-client");
const { GraphQLServer } = require("graphql-yoga");

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
server.start(
  {
    cors: {
      origin: true,
      credentials: true
    }
  },
  () => console.log("Server is running on http://localhost:4000")
);
