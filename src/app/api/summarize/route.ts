import Anthropic from "@anthropic-ai/sdk";
import { sanitizeString } from "@/lib/security";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_MESSAGES = 50;
const MAX_MESSAGE_LEN = 1500;
const MAX_SUMMARY_INPUT = 6000; // total chars sent to summarizer

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const rawMessages = body?.messages;

  if (!Array.isArray(rawMessages) || rawMessages.length > MAX_MESSAGES) {
    return Response.json({ summary: "Client project brief submitted via Motivo AI intake." }, { status: 200 });
  }

  const userMessages = rawMessages
    .filter((m: unknown): m is { role: string; content: string } => {
      if (!m || typeof m !== "object") return false;
      const o = m as { role?: string; content?: unknown };
      return o.role === "user" && typeof o.content === "string";
    })
    .map((m) => sanitizeString(m.content, MAX_MESSAGE_LEN))
    .join(" | ")
    .slice(0, MAX_SUMMARY_INPUT);

  if (!userMessages.trim()) {
    return Response.json({ summary: "Client project brief submitted via Motivo AI intake." }, { status: 200 });
  }

  try {
    const response = await client.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role:    "user",
          content: `Summarize this client's project needs in 2-3 sentences, written professionally as if briefing a creative team. Be specific about what they want. Client messages: "${userMessages}"`,
        },
      ],
    });

    const summary =
      response.content[0].type === "text"
        ? response.content[0].text
        : "Client project brief submitted via Motivo AI intake.";

    return Response.json({ summary });
  } catch (error) {
    console.error("Summarize error:", error);
    return Response.json(
      { summary: "Client project brief submitted via Motivo AI intake." },
      { status: 200 },
    );
  }
}
