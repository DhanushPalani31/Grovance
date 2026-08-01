import { Router } from "express";
import { store } from "../lib/store";

export const leadsRouter = Router();

leadsRouter.post("/", (req, res) => {
  const { name, email, message } = req.body as { name?: string; email?: string; message?: string };

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are required" });
  }

  const lead = store.addLead({ name, email, message });

  // This is the automation piece: a new lead automatically gets logged as an
  // activity, exactly like the rules shown in the Automation Center demo.
  store.logActivity({
    label: `New lead captured from contact form: ${name}`,
    source: "automation",
  });

  res.status(201).json({ received: true, id: lead.id });
});

leadsRouter.get("/", (_req, res) => {
  res.json(store.listLeads());
});
