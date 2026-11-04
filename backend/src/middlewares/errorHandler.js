export const errorHandler = (err, req, res, next) => {
  // Prisma unique constraint violation
  if (err.code === "P2002") {
    return res.status(409).json({ message: "Record already exists" });
  }

  const status = err.status || 500;

  if (status >= 500) {
    console.error(err);
    return res.status(status).json({ message: "Internal server error" });
  }

  res.status(status).json({ message: err.message });
};
