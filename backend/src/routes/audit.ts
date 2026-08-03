import { Router } from "express";
import { generateGroundedText, generateText, isConfigured, AUDIT_SYSTEM_PROMPT, AUDIT_SYSTEM_PROMPT_FALLBACK } from "../lib/gemini";
import { store } from "../lib/store";
import { notifyNewLead, sendReplyToVisitor, canReplyToVisitors } from "../lib/email";

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

  if (!isConfigured()) {
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
    let genResult;
    let grounded = true;
    try {
      genResult = await generateGroundedText(AUDIT_SYSTEM_PROMPT, context);
    } catch (groundedErr) {
      // Google Search grounding can require a billing-linked project even
      // within its nominal free allowance — some accounts get a hard quota
      // wall on the grounding tool specifically while the base API works
      // fine. Rather than fail the whole audit, fall back to an honest,
      // non-grounded generation instead (with a prompt that does NOT claim
      // to have searched, so it never fabricates a "real research" claim).
      const message = groundedErr instanceof Error ? groundedErr.message : String(groundedErr);
      const isQuotaError = message.includes("429") || message.includes("RESOURCE_EXHAUSTED");
      if (!isQuotaError) throw groundedErr;

      console.warn("Search grounding failed (quota/billing), falling back to ungrounded generation:", message);
      grounded = false;
      genResult = await generateText(AUDIT_SYSTEM_PROMPT_FALLBACK, context);
    }

    if (!genResult) {
      return res.status(503).json({ error: "GEMINI_API_KEY not configured on the server" });
    }

    // Defensive: strip accidental markdown code fences. The prompt asks for
    // raw JSON, but combining the search-grounding tool with strict JSON mode
    // isn't reliably supported, so we parse the text response manually.
    const rawText = genResult.text.trim();
    const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    let result: AuditResult;
    try {
      result = JSON.parse(cleaned);
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
      const message = `Automation Audit requested (${category}${location ? `, ${location}` : ""})${
        customNeeds ? ` — "${customNeeds}"` : ""
      }`;
      // Step 1: store
      await store.addLead({ name: businessName, email, message });
      // Step 2: notify the owner
      notifyNewLead({ source: "Automation Audit", name: businessName, email, message });
      // Step 3: email the visitor their own result — already contextual (it's
      // literally their personalized audit), so no extra AI call needed, just
      // reformat it as an email. Only sends if a verified domain is configured.
      if (canReplyToVisitors()) {
        const toolLines = result.tools
          .map((t) => `• ${t.name} — when ${t.when}, we'd automatically ${t.then}`)
          .join("\n");
        const emailBody = `Hi, here's the automation audit you just ran for ${businessName}:

${result.tagline}

What we noticed:
${result.painPoints.map((p) => `• ${p}`).join("\n")}

Where you could get ahead:
${result.competitiveInsight}

Recommended for you:
${toolLines}

Want to talk through any of this? Just reply to this email.

— The Grovance Team`;
        sendReplyToVisitor(email, `Your Automation Audit for ${businessName}`, emailBody).catch((err) =>
          console.error("Audit visitor email failed:", err)
        );
      }
    }
    await store.logActivity({
      label: `Automation Audit generated for "${businessName}" (${category})${grounded ? "" : " [ungrounded fallback]"}`,
      source: "ai",
    });

    res.json({ ...result, grounded });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Audit generation failed" });
  }
});
