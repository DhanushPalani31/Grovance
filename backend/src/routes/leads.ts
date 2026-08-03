import { Router } from "express";
import { store } from "../lib/store";
import { notifyNewLead, sendReplyToVisitor, canReplyToVisitors } from "../lib/email";
import { generateText, CONTACT_AUTO_REPLY_PROMPT } from "../lib/gemini";

export const leadsRouter = Router();

leadsRouter.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body as { name?: string; email?: string; message?: string };

    if (!name || !email || !message) {
      return res.status(400).json({ error: "name, email, and message are required" });
    }

    // Step 1: store in the database
    const lead = await store.addLead({ name, email, message });

    // This is the automation piece: a new lead automatically gets logged as an
    // activity, exactly like the rules shown in the Automation Center demo.
    await store.logActivity({
      label: `New lead captured from contact form: ${name}`,
      source: "automation",
    });

    // Step 2: notify the site owner. Fire-and-forget — a notification
    // failure should never block the visitor's submission from succeeding.
    notifyNewLead({ source: "Contact form", name, email, message });

    // Step 3: send the visitor a contextual auto-reply — actually responding
    // to what they wrote, not a generic "thanks for reaching out." Only
    // fires if a verified sending domain is configured (see canReplyToVisitors);
    // also fire-and-forget so a slow/failed AI call never blocks the response.
    if (canReplyToVisitors()) {
      generateText(CONTACT_AUTO_REPLY_PROMPT, `Their message: "${message}"\n(Their name: ${name})`)
        .then((result) => {
          if (result) {
            sendReplyToVisitor(email, `Thanks for reaching out, ${name}`, result.text);
          }
        })
        .catch((err) => console.error("Contact auto-reply generation failed:", err));
    }

    res.status(201).json({ received: true, id: lead.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save lead" });
  }
});

leadsRouter.get("/", async (_req, res) => {
  try {
    res.json(await store.listLeads());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load leads" });
  }
});
