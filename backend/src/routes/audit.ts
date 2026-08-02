import { Router } from "express";
import { getGeminiJsonModel, AUDIT_SYSTEM_PROMPT } from "../lib/gemini";
import { store } from "../lib/store";

export const auditRouter = Router();

const VALID_TOOL_NAMES = [
  "Auto-Reply",
  "Order Taken",
  "Abandoned Cart Recovery",
  "Low-Stock Alerts",
  "Review Requests",
  "Daily/Weekly Summaries",
  "AI Assistant",
  "Content Studio",
  "Insights",
  "Custom App Development",
  "End-to-end Maintenance",
];

interface AuditTool {
  name: string;
  when: string;
  then: string;
  why: string;
}

interface AuditResult {
  tagline: string;
  painPoints: string[];
  competitiveInsight: string;
  tools: AuditTool[];
}

auditRouter.post("/", async (req, res) => {
  const { businessName, category, location, customNeeds, currentSetup, email } = req.body as {
    businessName?: string;
    category?: string;
    location?: string;
    customNeeds?: string;
    currentSetup?: string[];
    email?: string;
  };

  if (!businessName || !category) {
    return res.status(400).json({ error: "businessName and category are required" });
  }

  const model = getGeminiJsonModel(AUDIT_SYSTEM_PROMPT);
  if (!model) {
    return res.status(503).json({ error: "GEMINI_API_KEY not configured on the server" });
  }

  const context = `Business name: ${businessName}
Category: ${category}
Location: ${location || "not specified"}
In their own words, what they're looking for: ${customNeeds?.trim() || "not provided"}
What they currently have/lack (selected from a checklist): ${
    currentSetup && currentSetup.length ? currentSetup.join("; ") : "not specified"
  }`;

  try {
    const genResult = await model.generateContent(context);
    const rawText = genResult.response.text().trim();

    let result: AuditResult;
    try {
      result = JSON.parse(rawText);
    } catch {
      console.error("Audit JSON parse failed, raw text:", rawText);
      return res.status(502).json({ error: "Could not generate a valid audit right now" });
    }

    // Guard against a hallucinated tool name slipping through — filter to only
    // tools that actually exist in the product, rather than showing something wrong.
    if (Array.isArray(result.tools)) {
      const filtered = result.tools.filter((t) => VALID_TOOL_NAMES.includes(t.name));
      if (filtered.length < result.tools.length) {
        console.warn(
          `Audit dropped ${result.tools.length - filtered.length} tool(s) with an unrecognized name`
        );
      }
      result.tools = filtered;
    }
    if (!result.tools?.length || !result.painPoints?.length || !result.tagline) {
      return res.status(502).json({ error: "Generated audit was incomplete — please try again" });
    }

    // Log as a real lead if they left an email — same pipeline as the Contact form
    if (email) {
      await store.addLead({
        name: businessName,
        email,
        message: `Automation Audit requested (${category}${location ? `, ${location}` : ""})`,
      });
    }
    await store.logActivity({
      label: `Automation Audit generated for "${businessName}" (${category})`,
      source: "ai",
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Audit generation failed" });
  }
});
