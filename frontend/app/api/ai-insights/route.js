import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { title } = await req.json();

  if (!title) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: `Give me a summary for the podcast: ${title}` }],
    });

    const insight = aiResponse.choices[0].message.content;
    return Response.json({ insight });
  } catch (error) {
    console.error("AI Error:", error);
    return Response.json({ error: "AI service failed" }, { status: 500 });
  }
}
