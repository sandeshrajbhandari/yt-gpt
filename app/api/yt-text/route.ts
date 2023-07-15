import { YoutubeTranscript } from "youtube-transcript";
import { getSubtitles, getVideoDetails } from "youtube-caption-extractor";
// YoutubeTranscript.fetchTranscript(
//     "https://www.youtube.com/watch?v=GC3YCvOSKQ4"
//   ).then(console.log);
// export async function POST(req) {
//   let url = await req.headers.get("url");
//   console.log(url);

//   res.status(200).json({ message: message });
//   return message;
// }
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

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  //   console.log(req);
  console.log(body.url);
  let url = body.url;
  let videoID = getVideoID(url);
  let { title, subtitles } = await fetchVideoDetails(videoID);
  // concat all the text field in the an array of objects with text, duration and offset keys
  let transcript = subtitles.map((item) => item.text).join(" ");
  //   console.log(`${title}\n\n${transcript}`);
}
