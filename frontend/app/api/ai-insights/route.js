const axios = require("axios");
const { supabase } = require("@/utils/supabase");

export async function POST(req) {
  try {
    const { episodeTitle, episodeDescription, podcastId } = await req.json();

    const apiKey = process.env.DEEPSEEK_API_KEY; // Your DeepSeek API Key
    if (!apiKey) {
      throw new Error("API Key is missing");
    }

    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
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
