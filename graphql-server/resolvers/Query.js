module.exports = {
  user(root, args, context) {
    return context.prisma.user({ id: args.userId });
  },
  allUsers(root, args, context) {
    return context.prisma.users();
  }
};
