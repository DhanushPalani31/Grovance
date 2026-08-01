import { Router } from "express";
import { getAnthropicClient, SHOP_SYSTEM_PROMPT, MARKETING_SYSTEM_PROMPT } from "../lib/anthropic";
import { store } from "../lib/store";

export const aiRouter = Router();

const MODEL = "claude-sonnet-4-6";

aiRouter.post("/chat", async (req, res) => {
  const { message, persona } = req.body as { message?: string; persona?: "shop" | "marketing" };
  if (!message) return res.status(400).json({ error: "message is required" });

  const anthropic = getAnthropicClient();
  if (!anthropic) {
    return res.status(503).json({
      error: "ANTHROPIC_API_KEY not configured on the server",
    });
  }

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 300,
      system: persona === "marketing" ? MARKETING_SYSTEM_PROMPT : SHOP_SYSTEM_PROMPT,
      messages: [{ role: "user", content: message }],
    });

    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n");

    store.logActivity({ label: "AI Assistant answered a customer question", source: "ai" });

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

aiRouter.post("/generate", async (req, res) => {
  const { prompt, kind } = req.body as { prompt?: string; kind?: string };
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  const anthropic = getAnthropicClient();
  if (!anthropic) {
    return res.status(503).json({
      error: "ANTHROPIC_API_KEY not configured on the server",
    });
  }

  const instructions: Record<string, string> = {
    "product-description": "Write a short, appealing product description (2-3 sentences) for a small local shop.",
    "social-caption": "Write a catchy, brief social media caption with 1-2 relevant hashtags.",
    "promo-offer": "Write a short, enticing promotional offer message for shop customers.",
  };

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 200,
      system: instructions[kind || "product-description"] || instructions["product-description"],
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n");

    store.logActivity({ label: `Content Studio generated a ${kind || "product-description"}`, source: "ai" });

    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});
