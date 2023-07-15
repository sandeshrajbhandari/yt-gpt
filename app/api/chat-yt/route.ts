// ./app/api/chat/route.ts
import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json();
  let url = prompt;
  let videoID = getVideoID(url);
  let { title, subtitles } = await fetchVideoDetails(videoID);
  // concat all the text field in the an array of objects with text, duration and offset keys
  let transcript = subtitles.map((item) => item.text).join(" ");
  //   console.log(`${title}\n\n${transcript}`);

  // ## FEED transcript and title to OpenAI API
  // Create a completion using OpenAIApi
  let prompt2 = `Write a one paragraph summary of the following youtube video transcript. Generate Questions and Answers for the video.
    Title : ${title}
    Transcript : 
    ${transcript}

    Summary:
    `;
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt2 },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = await OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);

  //  ## parse url to get transcript and title
  //   const body = await req.json();
}
import { getSubtitles, getVideoDetails } from "youtube-caption-extractor";

const getVideoID = (url) => {
  const videoID = url.split("v=")[1];
  return videoID;
};

// Fetching Video Details
const fetchVideoDetails = async (videoID: string, lang = "en") => {
  try {
    const { title, subtitles } = await getVideoDetails({ videoID, lang });
    //returns title, description, subtitles object
    return { title, subtitles };
  } catch (error) {
    console.error("Error fetching video details:", error);
  }
};
