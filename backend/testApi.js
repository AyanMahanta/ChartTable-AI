const axios = require("axios");
require("dotenv").config(); // Load environment variables

const apiKey = process.env.OPENAI_API_KEY; // Your OpenAI API Key from .env

async function testOpenAI() {
  if (!apiKey) {
    console.log("API Key is missing!");
    return;
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "Hello, what is OpenAI?",
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

    console.log("API Response:", response.data);
  } catch (error) {
    console.error("API Error:", error.response ? error.response.data : error.message);
  }
}

testOpenAI();
