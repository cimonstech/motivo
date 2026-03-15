import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Motivo's project portfolio for context
const PORTFOLIO_CONTEXT = `
Motivo has worked on these projects:
- Fidelity Bank Ghana: Full brand identity system (logo, guidelines, print, digital)
- CLGB (Ghana Chamber of Licensed Gold Buyers): Brand identity + full-stack web portal
- Coca-Cola Ghana: Creative campaign direction and brand activation
- Guinness Ghana: Creative campaign direction and brand activation
- Accralions: Brand identity system
- Tesoro: Premium brand identity
- Logofolio: Collection of logo marks for various clients
- Motivo Chair: Custom furniture fabrication

Services offered:
1. Brand Identity — logos, visual systems, guidelines, print, campaign direction
2. Digital — websites, web applications, portals, e-commerce, CMS
3. Campaigns — creative strategy, art direction, motion, OOH, social content
4. Fabrications — 3D signage, illuminated signs, reception branding, wayfinding, installations
`;

const SYSTEM_PROMPT = `You are a calm, confident creative strategist at Motivo — a premium creative practice based in Accra, Ghana. 

Your role is to help potential clients understand which Motivo service fits their project best.

${PORTFOLIO_CONTEXT}

Rules:
- Speak warmly but professionally. Never casually.
- Never say "I'm an AI" or reference being a language model.
- Never quote prices or timelines.
- Never mention competitors.
- Ask only ONE follow-up question at a time.
- Keep responses concise — 2-4 sentences maximum.
- After 3-4 exchanges, always suggest sending the brief to the team.
- When recommending a service, reference a relevant past project naturally.
- If asked something off-topic, redirect warmly back to their project.
- End recommendations with: "Ready to go further? I can prepare your brief for the team."
- Never use em dashes (—) as punctuation. Use commas or full stops instead.
- Tone: thoughtful, direct, confident. Like a senior creative you trust.`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages } = await req.json();

  const stream = await client.messages.stream({
    model:      "claude-sonnet-4-20250514",
    max_tokens: 400,
    system:     SYSTEM_PROMPT,
    messages,
  });

  // Return as a ReadableStream for SSE
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            (event as { delta?: { type?: string; text?: string } }).delta?.type === "text_delta"
          ) {
            const text = (event as { delta?: { text?: string } }).delta?.text;
            if (text) {
              controller.enqueue(
                new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
        }
      } catch {
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify({ text: "Sorry, something went wrong. Please try again or reach out on WhatsApp." })}\n\n`)
        );
      }
      controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
      controller.close();
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
