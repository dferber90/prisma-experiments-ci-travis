// https://github.com/prisma/graphql-yoga/tree/master/examples/lambda

const { GraphQLServerLambda } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

const lambda = new GraphQLServerLambda({
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

exports.server = lambda.graphqlHandler;
exports.playground = lambda.playgroundHandler;
