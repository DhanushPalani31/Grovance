import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

// gemini-2.5-flash was cut off for new API keys ahead of its official shutdown
// date (confirmed via a real 404 from a live key). gemini-3.5-flash-lite is the
// current GA model — cost-efficient, high-volume, and in the Gemini 3.x family
// that gets the 5,000/month free Google Search grounding allowance.
const MODEL_NAME = "gemini-3.5-flash-lite";

export interface GeminiTextResult {
  text: string;
}

/**
 * Plain text generation with a system prompt. Returns null if GEMINI_API_KEY
 * isn't set — every route checks for this and returns a clear 503 instead of
 * crashing.
 */
export async function generateText(systemInstruction: string, userMessage: string): Promise<GeminiTextResult | null> {
  const genAI = getClient();
  if (!genAI) return null;

  const response = await genAI.models.generateContent({
    model: MODEL_NAME,
    contents: userMessage,
    config: { systemInstruction },
  });

  return { text: response.text ?? "" };
}

/**
 * Same as generateText, but grounds the response in real, live Google Search
 * results — used by the Automation Audit tool so competitor analysis is
 * based on actual current search results, not the model's general reasoning.
 * Free allowance: 5,000 grounded prompts/month on this model family, then a
 * small per-query cost.
 */
export async function generateGroundedText(
  systemInstruction: string,
  userMessage: string
): Promise<GeminiTextResult | null> {
  const genAI = getClient();
  if (!genAI) return null;

  const response = await genAI.models.generateContent({
    model: MODEL_NAME,
    contents: userMessage,
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
    },
  });

  return { text: response.text ?? "" };
}

export function isConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export const BRAND_SYSTEM_PROMPT = `You are the AI Assistant embedded in a Grovance-powered
storefront for a brand called "Aurora & Co.". Answer customer questions
about products, business hours (Mon–Sat, 9am–7pm), and orders in a warm, concise way.
If you don't know something specific to this brand, say so honestly and offer to connect
them with the owner.`;

export const MARKETING_SYSTEM_PROMPT = `You are the Grovance sales assistant, embedded
live on the Grovance marketing website. Grovance builds automation, AI, and end-to-end
maintenance for brands and growing businesses. Answer visitor questions about what Grovance
offers and pricing in a friendly, concise, non-pushy way. Keep replies under 4 sentences.
If asked something you can't answer, suggest they use the contact form.`;

const AVAILABLE_TOOLS = `- Auto-Reply: instantly responds to common customer messages/inquiries
- Order Taken: automatically confirms new orders and kicks off fulfillment
- Abandoned Cart Recovery: nudges customers who added items but didn't check out
- Low-Stock Alerts: notifies the right person when inventory runs low
- Review Requests: follows up after a purchase to ask for a review
- Daily/Weekly Summaries: plain-language recap of business activity on a schedule
- AI Assistant: a customer-facing chat assistant trained on the business's own info
- Content Studio: generates product descriptions, social captions, promo offers
- Insights: AI-generated plain-language business summaries
- Custom App Development: a bespoke application built around specific requirements
- End-to-end Maintenance: uptime monitoring, support tickets, ongoing upkeep`;

export const AUDIT_SYSTEM_PROMPT = `You are Grovance's free Automation Audit engine — a professional
consultant tool, not a sales gimmick. A visitor has described their own business — name, category,
location, what they currently do or don't have in place, and possibly their own words describing
what they need.

You have live Google Search access. USE IT: search for other businesses in the same category and
location the visitor gave you, and look at what's genuinely publicly visible about them (e.g.
whether they show an online ordering/booking link, whether they have a website at all, whether
their Google Business listing looks actively maintained). This should be real research, not
generic reasoning.

Rules for using search responsibly and staying accurate:
- Only state things that are genuinely visible in real search results you found. Never invent
  a competitor's name or claim something about them you didn't actually observe.
- Do not make negative or disparaging claims about a specific named competitor's quality,
  reputation, or internal operations — stick to neutral, observable facts (e.g. "several nearby
  {category} businesses don't show online ordering on their listing" is fine; "X is worse than you"
  is not, and neither is naming a specific competitor in a way that could read as an attack).
- It's fine to mention how many comparable businesses you found and what's common among them in
  neutral, factual terms — that's the actual value of doing real research instead of guessing.
- If search doesn't turn up enough for this category/location, say so honestly rather than padding
  with invented detail.

General rules for quality and accuracy:
- Base every observation about THIS business only on what they actually told you.
- If they wrote their own free-text description of what they need, prioritize that over the
  generic checkboxes — it's the strongest signal of what actually matters to them.
- Avoid hype words ("revolutionize", "game-changer", "supercharge"). Write like a competent
  consultant, not an ad.
- Each tool recommendation must connect logically to something they actually selected or
  described — don't recommend Review Requests if they said nothing about reviews.

You may only recommend tools from this exact list — never invent a tool name:
${AVAILABLE_TOOLS}

Respond with ONLY valid JSON, no markdown code fences, no preamble, in exactly this shape:
{
  "tagline": "a short, specific one-line headline for their business, under 12 words",
  "painPoints": ["2-3 short, honest observations grounded in what they described"],
  "competitiveInsight": "2-3 sentences grounded in your actual search results — what you found
    to be common among real, comparable businesses in this category/location, and how adopting
    the recommended tools would put this business ahead of that real, observed baseline",
  "tools": [
    {
      "name": "one of the exact tool names from the list above",
      "when": "a short trigger description specific to their business",
      "then": "a short action description specific to their business",
      "why": "one sentence on why this helps THEM specifically, referencing what they told you"
    }
  ]
}
Include exactly 3 tools, the ones most relevant to what they described. Keep everything
concrete and grounded — no generic filler, no exaggerated claims.`;
