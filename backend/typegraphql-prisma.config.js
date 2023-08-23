module.exports = {
  emitSchemaFile: path.resolve(__dirname, 'schema.graphql'),
  globalMiddlewares: [ErrorInterceptor],
  resolversPath: path.resolve(__dirname, 'generated/type-graphql'),
};
