import { Router } from "express";
import { store } from "../lib/store";

export const automationRouter = Router();

automationRouter.get("/activity", (_req, res) => {
  res.json(store.listActivity());
});

automationRouter.get("/stats", (_req, res) => {
  res.json(store.getDashboardStats());
});

automationRouter.get("/rules", (_req, res) => {
  res.json(store.listRules());
});

automationRouter.post("/rules/:id/toggle", (req, res) => {
  const rule = store.toggleRule(req.params.id);
  if (!rule) return res.status(404).json({ error: "rule not found" });

  store.logActivity({
    label: `Rule ${rule.enabled ? "enabled" : "disabled"}: ${rule.trigger} → ${rule.action}`,
    source: "automation",
  });

  res.json(rule);
});

automationRouter.post("/rules/:id/run", (req, res) => {
  const rule = store.runRule(req.params.id);
  if (!rule) return res.status(404).json({ error: "rule not found" });

  const entry = store.logActivity({
    label: `Rule fired: ${rule.trigger} → ${rule.action}`,
    source: "automation",
  });

  res.json({ rule, activity: entry });
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
