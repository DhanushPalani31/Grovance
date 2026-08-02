import { Router } from "express";
import { getGeminiModel, BRAND_SYSTEM_PROMPT, MARKETING_SYSTEM_PROMPT } from "../lib/gemini";
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
