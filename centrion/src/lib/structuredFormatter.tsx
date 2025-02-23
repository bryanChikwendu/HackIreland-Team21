import OpenAI from "openai";

// Ensure you have your OpenAI API key in an environment variable
const openai = new OpenAI({
  apiKey: "",
  dangerouslyAllowBrowser: true
});

const defaultPrompt = `You are an event monitor. For every observation, output a single sentence that always follows this format:
1. Start with one of these categories: "Threatening", "Non-threatening", or "Unsure".
2. Follow the category with a colon and a space.
3. Describe the observed action or activity concisely.
4. End the sentence with a full stop.
Only output a single sentence following this format.
`;

export async function formatGeminiOutput(rawText, prompt = defaultPrompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // Use a lightweight model like `gpt-3.5-turbo` if needed
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Input: ${rawText}\n\nOutput:` }
      ],
      max_tokens: 50,  // Limit response length to keep it concise
      temperature: 0,  // Reduce randomness for structured output
    });

    // Extract and return the response
    return response.choices[0]?.message?.content.trim() || "";
  } catch (error) {
    console.error("Error formatting Gemini output:", error);
    return "";
  }
}
