import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  // Create a completion using OpenAIApi
  const response = await openai.createCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    // prompt: `Given the following post content, detect if it has typo or not.
    // Respond with a JSON array of typos ["typo1", "typo2", ...] or an empty [] if there's none. Only respond with an array. Post content:
    // ${prompt}
    // `,
    prompt: "write a haikus",
    max_tokens: 10,
    temperature: 0, // you want absolute certainty for spell check
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });

  // Transform the response into a readable stream
  const stream = OpenAIStream(response);

  // Return a StreamingTextResponse, which can be consumed by the client
  return new StreamingTextResponse(stream);
}
