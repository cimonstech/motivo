import Anthropic from "@anthropic-ai/sdk";
import { sanitizeString } from "@/lib/security";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAX_MESSAGES = 30;
const MAX_MESSAGE_LEN = 2000;

// Motivo's project portfolio for context
const PORTFOLIO_CONTEXT = `
Motivo has worked on these projects:
- Fidelity Bank Ghana: Full brand identity system (logo, guidelines, print, digital)
- CLGB (Ghana Chamber of Licensed Gold Buyers): Brand identity + full-stack web portal
- Coca-Cola Ghana: Creative campaign direction and brand activation
- Guinness Ghana: Creative campaign direction and brand activation
- Accra Lions: Brand identity system
- Tesoro: Premium brand identity
- Logofolio: Collection of logo marks for various clients
- Motivo Chair: Custom furniture fabrication

Services offered:
1. Brand Identity - logos, visual systems, guidelines, print, campaign direction
2. Digital - websites, web applications, portals, e-commerce, CMS
3. Campaigns - creative strategy, art direction, motion, OOH, social content
4. Fabrications - 3D signage, illuminated signs, reception branding, wayfinding, installations
`;

const SYSTEM_PROMPT = `You are a calm, confident creative strategist at Motivo - a premium creative practice based in Accra, Ghana. 

Your role is to help potential clients understand which Motivo service fits their project best.

${PORTFOLIO_CONTEXT}

Rules:
- Speak warmly but professionally. Never casually.
- Never say "I'm an AI" or reference being a language model.
- Never quote prices or timelines.
- Never mention competitors.
- Ask only ONE follow-up question at a time.
- Keep responses concise - 2-4 sentences maximum.
- After 3-4 exchanges, always suggest sending the brief to the team.
- When recommending a service, reference a relevant past project naturally.
- If asked something off-topic, redirect warmly back to their project.
- End recommendations with: "Ready to go further? I can prepare your brief for the team."
- Use hyphens (-) or commas instead of em dashes for punctuation.
- Tone: thoughtful, direct, confident. Like a senior creative you trust.`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Service temporarily unavailable" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await req.json().catch(() => ({}));
  const rawMessages = body?.messages;

  if (!Array.isArray(rawMessages) || rawMessages.length > MAX_MESSAGES) {
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const messages = rawMessages
    .filter((m: unknown): m is { role: "user" | "assistant"; content: string } => {
      if (!m || typeof m !== "object") return false;
      const o = m as { role?: string; content?: unknown };
      return (o.role === "user" || o.role === "assistant") && typeof o.content === "string";
    })
    .map((m: { role: "user" | "assistant"; content: string }) => ({
      role: m.role,
      content: sanitizeString(m.content, MAX_MESSAGE_LEN),
    }))
    .filter((m) => m.content.length > 0);

  const stream = await client.messages.stream({
    model:      "claude-sonnet-4-20250514",
    max_tokens: 400,
    system:     SYSTEM_PROMPT,
    messages,
  });

  // Return as a ReadableStream for SSE - use .on("text") for reliable text capture
  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (data: { text?: string }) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      stream.on("text", (text: string) => {
        if (text) send({ text });
      });

      stream.on("error", () => {
        send({ text: "Sorry, something went wrong. Please try again or reach out on WhatsApp." });
      });

      try {
        await stream.finalMessage();
      } catch {
        send({ text: "Sorry, something went wrong. Please try again or reach out on WhatsApp." });
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection":    "keep-alive",
    },
  });
}
