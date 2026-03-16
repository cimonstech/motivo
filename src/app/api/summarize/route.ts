import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const { messages } = await req.json();

  const userMessages = messages
    .filter((m: { role: string }) => m.role === "user")
    .map((m: { content: string }) => m.content)
    .join(" | ");

  try {
    const response = await client.messages.create({
      model:      "claude-3-5-haiku-20241022",
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
