const axios = require("axios");
const { supabase } = require("@/utils/supabase");

export async function POST(req) {
  try {
    const { episodeTitle, episodeDescription, podcastId } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY; // Your OpenAI API Key
    if (!apiKey) {
      throw new Error("API Key is missing");
    }

    console.log("Sending request to OpenAI API...");
    console.log("API Key:", apiKey);
    console.log("Episode Title:", episodeTitle);
    console.log("Episode Description:", episodeDescription);

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Summarize this podcast: ${episodeTitle} - ${episodeDescription}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const insight = response.data.choices[0].message.content;

    const { data, error } = await supabase
      .from("insights")
      .insert([{ podcast_id: podcastId, episode_title: episodeTitle, insight }]);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ insight }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Error:", error);
    return new Response(
      JSON.stringify({ error: "AI Insights Failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
