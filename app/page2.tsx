"use client";

import { useChat } from "ai/react";
import { useState } from "react";
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [link, setLink] = useState("s");

  const sendLink = async (e) => {
    e.preventDefault();
    // const response = await fetch("/api/yt-text", {
    //   method: "POST",
    //   headers: {
    //     url: link,
    //   },
    // });
    // send the link state to /api/yt-text endpoint
    // const response = await fetch("/api/yt-text", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ url: link }),
    // });
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.length > 0
        ? messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === "user" ? "User: " : "AI: "}
              {m.content}
            </div>
          ))
        : null}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>

      {/* <div>
        <h1>YT LINK</h1>
        <form onSubmit={sendLink}>
          <input
            className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
            value={link}
            placeholder="YT LINK HERE"
            onChange={(e) => setLink(e.target.value)}
          />
        </form>
        <p>{summary}</p>
      </div> */}
    </div>
  );
}
