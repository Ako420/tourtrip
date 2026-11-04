import { checkDatabase } from "../services/health.service.js";

export const getHealth = async (req, res) => {
  await checkDatabase();
  res.json({ status: "ok", database: "connected" });
};
