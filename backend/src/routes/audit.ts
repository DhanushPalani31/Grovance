import { Router } from "express";
import { getAnthropicClient, AUDIT_SYSTEM_PROMPT } from "../lib/anthropic";
import { store } from "../lib/store";

export const auditRouter = Router();

const MODEL = "claude-sonnet-4-6";

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
  tools: AuditTool[];
}

auditRouter.post("/", async (req, res) => {
  const { businessName, category, currentSetup, email } = req.body as {
    businessName?: string;
    category?: string;
    currentSetup?: string[];
    email?: string;
  };

  if (!businessName || !category) {
    return res.status(400).json({ error: "businessName and category are required" });
  }

  const anthropic = getAnthropicClient();
  if (!anthropic) {
    return res.status(503).json({ error: "ANTHROPIC_API_KEY not configured on the server" });
  }

  const context = `Business name: ${businessName}
Category: ${category}
What they currently have/lack: ${
    currentSetup && currentSetup.length ? currentSetup.join("; ") : "not specified"
  }`;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: AUDIT_SYSTEM_PROMPT,
      messages: [{ role: "user", content: context }],
    });

    const rawText = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n")
      .trim();

    // Defensive: strip accidental markdown code fences even though the prompt
    // explicitly forbids them — models occasionally add them anyway.
    const text = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    let result: AuditResult;
    try {
      result = JSON.parse(text);
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
      store.addLead({ name: businessName, email, message: `Automation Audit requested (${category})` });
    }
    store.logActivity({
      label: `Automation Audit generated for "${businessName}" (${category})`,
      source: "ai",
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Audit generation failed" });
  }
});
