import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new Anthropic({ apiKey });
  return client;
}

export const SHOP_SYSTEM_PROMPT = `You are the AI Assistant embedded in a Grovance-powered
storefront for a small local shop called "The Corner Store". Answer customer questions
about products, store hours (Mon–Sat, 9am–7pm), and orders in a warm, concise way.
If you don't know something specific to this shop, say so honestly and offer to connect
them with the owner.`;
