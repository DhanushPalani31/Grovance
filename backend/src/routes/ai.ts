import { Router } from "express";
import { getGeminiModel, BRAND_SYSTEM_PROMPT, MARKETING_SYSTEM_PROMPT, INSIGHTS_SYSTEM_PROMPT } from "../lib/gemini";
import { store } from "../lib/store";

export const aiRouter = Router();

aiRouter.post("/chat", async (req, res) => {
  const { message, persona } = req.body as { message?: string; persona?: "brand" | "marketing" };
  if (!message) return res.status(400).json({ error: "message is required" });

  const model = getGeminiModel(persona === "marketing" ? MARKETING_SYSTEM_PROMPT : BRAND_SYSTEM_PROMPT);
  if (!model) {
    return res.status(503).json({
      error: "GEMINI_API_KEY not configured on the server",
    });
  }

  try {
    const result = await model.generateContent(message);
    const reply = result.response.text();

    await store.logActivity({ label: "AI Assistant answered a customer question", source: "ai" });

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

aiRouter.post("/generate", async (req, res) => {
  const { prompt, kind } = req.body as { prompt?: string; kind?: string };
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  const instructions: Record<string, string> = {
    "product-description": "Write a short, appealing product description (2-3 sentences) for a brand.",
    "social-caption": "Write a catchy, brief social media caption with 1-2 relevant hashtags.",
    "promo-offer": "Write a short, enticing promotional offer message for a brand's customers.",
  };

  const model = getGeminiModel(instructions[kind || "product-description"] || instructions["product-description"]);
  if (!model) {
    return res.status(503).json({
      error: "GEMINI_API_KEY not configured on the server",
    });
  }

  try {
    const result = await model.generateContent(prompt);
    const generated = result.response.text();

    await store.logActivity({ label: `Content Studio generated a ${kind || "product-description"}`, source: "ai" });

    res.json({ result: generated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

aiRouter.post("/insights", async (_req, res) => {
  const model = getGeminiModel(INSIGHTS_SYSTEM_PROMPT);
  if (!model) {
    return res.status(503).json({
      error: "GEMINI_API_KEY not configured on the server",
    });
  }

  try {
    const activity = (await store.listActivity()).slice(0, 15);
    const rules = await store.listRules();
    const leads = await store.listLeads();

    const contextSummary = `
Recent activity log (most recent first):
${activity.map((a) => `- [${a.source}] ${a.label} (${a.timestamp})`).join("\n")}

Active automation rules: ${rules.filter((r) => r.enabled).length} of ${rules.length} enabled.
New leads captured this period: ${leads.length}.
`;

    const result = await model.generateContent(contextSummary);
    const summary = result.response.text();

    await store.logActivity({ label: "Weekly AI insights summary generated", source: "ai" });

    res.json({ summary, generatedAt: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});
