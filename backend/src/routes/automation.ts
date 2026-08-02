import { Router } from "express";
import { store } from "../lib/store";

export const automationRouter = Router();

automationRouter.get("/activity", async (_req, res) => {
  try {
    res.json(await store.listActivity());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load activity" });
  }
});

automationRouter.get("/stats", async (_req, res) => {
  try {
    res.json(await store.getDashboardStats());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load stats" });
  }
});

automationRouter.get("/rules", async (_req, res) => {
  try {
    res.json(await store.listRules());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load rules" });
  }
});

automationRouter.post("/rules/:id/toggle", async (req, res) => {
  try {
    const rule = await store.toggleRule(req.params.id);
    if (!rule) return res.status(404).json({ error: "rule not found" });

    await store.logActivity({
      label: `Rule ${rule.enabled ? "enabled" : "disabled"}: ${rule.trigger} → ${rule.action}`,
      source: "automation",
    });

    res.json(rule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not toggle rule" });
  }
});

automationRouter.post("/rules/:id/run", async (req, res) => {
  try {
    const rule = await store.runRule(req.params.id);
    if (!rule) return res.status(404).json({ error: "rule not found" });

    const entry = await store.logActivity({
      label: `Rule fired: ${rule.trigger} → ${rule.action}`,
      source: "automation",
    });

    res.json({ rule, activity: entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not run rule" });
  }
});

// Demo endpoint: simulates a workflow trigger firing (e.g. called by the
// cron scheduler in index.ts, or by a webhook from an order system).
automationRouter.post("/trigger", async (req, res) => {
  try {
    const { label } = req.body as { label?: string };
    const entry = await store.logActivity({
      label: label || "A workflow rule fired",
      source: "automation",
    });
    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not log activity" });
  }
});
