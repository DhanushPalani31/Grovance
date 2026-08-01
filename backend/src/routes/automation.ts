import { Router } from "express";
import { store } from "../lib/store";

export const automationRouter = Router();

automationRouter.get("/activity", (_req, res) => {
  res.json(store.listActivity());
});

// Demo endpoint: simulates a workflow trigger firing (e.g. called by the
// cron scheduler in index.ts, or by a webhook from an order system).
automationRouter.post("/trigger", (req, res) => {
  const { label } = req.body as { label?: string };
  const entry = store.logActivity({
    label: label || "A workflow rule fired",
    source: "automation",
  });
  res.status(201).json(entry);
});
