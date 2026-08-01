import { Router } from "express";
import { serverStartedAt } from "../lib/store";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    status: "ok",
    uptimeSeconds: (Date.now() - serverStartedAt.getTime()) / 1000,
    lastDeployedAt: serverStartedAt.toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});
