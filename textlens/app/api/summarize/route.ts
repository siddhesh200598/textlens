import { NextResponse } from "next/server";

// This runs on the SERVER. The API key never touches the browser.
export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // Basic input validation
    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        { error: "Please enter at least 20 characters." },
        { status: 400 }
      );
    }

    // Call Groq (OpenAI-compatible endpoint). Free, no credit card.
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.3,
          // Force the model to reply with clean JSON we can parse
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are a text analysis assistant. Respond ONLY with valid JSON " +
                'in this exact shape: {"summary": string, "keyPoints": string[], "sentiment": string}. ' +
                "summary = 2-3 sentences. keyPoints = 3 to 5 short bullet strings. " +
                "sentiment = exactly one word: Positive, Negative, or Neutral.",
            },
            { role: "user", content: text },
          ],
        }),
      }
    );

    if (!groqRes.ok) {
      return NextResponse.json(
        { error: "AI request failed. Check your API key or try again." },
        { status: 500 }
      );
    }

    const data = await groqRes.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
