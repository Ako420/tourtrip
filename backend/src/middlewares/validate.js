export const validate = (schemas) => (req, res, next) => {
  req.validated ??= {};

  Object.entries(schemas).forEach(([part, schema]) => {
    // A request with no body still reports each missing field by name.
    req.validated[part] = schema.parse(req[part] ?? {});
  });

  next();
};
