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
    model: "text-davinci-003",
    stream: true,
    prompt,
  });

  // Transform the response into a readable stream
  const stream = OpenAIStream(response);

  // Return a StreamingTextResponse, which can be consumed by the client
  return new StreamingTextResponse(stream);
}
