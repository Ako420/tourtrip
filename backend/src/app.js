import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import routers from "./routers/index.js";

const app = express();

app.use(helmet());
app.use(
  morgan(env.NODE_ENV === "production" ? "combined" : "dev", {
    skip: () => env.NODE_ENV === "test",
  }),
);
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api", routers);

app.use(notFound);
app.use(errorHandler);

export default app;
