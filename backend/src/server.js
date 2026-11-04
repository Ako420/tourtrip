import app from "./app.js";
import { connectDB, prisma } from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }

  const server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });

  const shutdown = () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer();
