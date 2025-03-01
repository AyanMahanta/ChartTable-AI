const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.RAPIDAPI_KEY;
const apiHost = process.env.RAPIDAPI_HOST;

async function testRunwayML() {
  if (!apiKey) {
    console.log("API Key is missing!");
    return;
  }

  try {
    const response = await axios.post(
      `https://${apiHost}/generate/video`,
      {
        text_prompt: "Space travel",
        video_prompt: "https://files.aivideoplayer.com/example/ship.mp4",
        structure_transformation: 0.5,
        seed: 0,
        callback_url: ""
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": apiHost
        }
      }
    );

    console.log("API Response:", response.data);
  } catch (error) {
    console.error(
      "API Error:",
      error.response ? error.response.data : error.message
    );
  }
}

testRunwayML();
