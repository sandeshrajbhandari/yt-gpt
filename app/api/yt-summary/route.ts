import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: Request) {
  //  ## parse url to get transcript and title
  let { prompt } = await req.json();
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
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt2 },
    ],
    // max_tokens: 50,
    // temperature: 0, // you want absolute certainty for spell check
    // top_p: 1,
    // frequency_penalty: 1,
    // presence_penalty: 1,
  });
  //   console.log(response);
  //   console.log(prompt2);

  // Transform the response into a readable stream
  console.log(response.status);
  const stream = OpenAIStream(response);
  // Return a StreamingTextResponse, which can be consumed by the client
  return new StreamingTextResponse(stream);
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
