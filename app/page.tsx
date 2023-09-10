"use client";
import { useState, useEffect } from "react";
import { useCompletion } from "ai/react";
import { useDebouncedCallback } from "use-debounce";
import { BallTriangle } from "react-loader-spinner";
import Image from "next/image";
import Header from "./components/Header";
import { useSession, signIn, signOut } from "next-auth/react";
// import { serialize } from "next-mdx-remote/serialize";
// import { MDXRemote } from "next-mdx-remote"; //support markdown formatting later.

export default function Completion() {
  const { data: session, status } = useSession();
  console.log(status);
  // use useEffect to rerender if auth status changes
  useEffect(() => {
    if (status === "authenticated") {
      console.log("authenticated");
    }
  }, [status]);

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/chat-yt", //added a custom api route to handle summary request
  });

  const [value, setValue] = useState("");
  const handleInputChange = useDebouncedCallback(() => {
    complete(value);
  }, 500);

  const sendLink = async (e) => {
    e.preventDefault();
    handleInputChange();
  };

  return (
    <>
      {/* <div className="w-full container mx-auto flex flex-col justify-center"> */}
      <div className="flex max-w-6xl mx-auto flex-col items-center justify-center">
        <Header photo={session?.user?.image || undefined} />

        {!(status === "authenticated") ? (
          <>
            <div className="py-2 flex bg-gray-200 w-full flex-col items-center space-y-6">
              <div className="max-w-xl text-gray-600 text-center">
                Login to continue. We only use your email to save your progress.
              </div>
              <button
                onClick={() => signIn("google")}
                className="bg-black text-white font-semibold py-3 px-6 rounded-2xl flex items-center space-x-2"
              >
                <span>Sign in with Google</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gray-200 w-full flex justify-center">
              <h1 className="text-xl font-bold">Welcome</h1>
            </div>
            <div className="p-2 w-full flex flex-col items-center bg-gray-200">
              {/* <p>Current state: {isLoading ? "Generating..." : "Idle"}</p> */}
              {isLoading ? (
                <div className="flex flex-col justify-center mx-auto">
                  <p>Current state: Loading</p>
                  {/* <div className="flex justify-content w-1">
                <BallTriangle
                  height={100}
                  width={100}
                  radius={5}
                  color="#010101"
                  ariaLabel="ball-triangle-loading"
                  visible={true}
                />
              </div> */}
                </div>
              ) : (
                <p>Current state: Idle</p>
              )}
              <form
                onSubmit={sendLink}
                className="p-4 w-full flex flex-col content-center"
              >
                <p className="text-3xl self-center font-bold">
                  Summarize any{" "}
                  <svg
                    className="inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    // make red color
                    fill="#ff0000"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10 9.333l5.333 2.662-5.333 2.672v-5.334zm14-4.333v14c0 2.761-2.238 5-5 5h-14c-2.761 0-5-2.239-5-5v-14c0-2.761 2.239-5 5-5h14c2.762 0 5 2.239 5 5zm-4 7c-.02-4.123-.323-5.7-2.923-5.877-2.403-.164-7.754-.163-10.153 0-2.598.177-2.904 1.747-2.924 5.877.02 4.123.323 5.7 2.923 5.877 2.399.163 7.75.164 10.153 0 2.598-.177 2.904-1.747 2.924-5.877z" />
                  </svg>
                  <span> Youtube Video</span>
                </p>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="mx-auto mt-5 w-2 rounded-lg border border-gray-500 p-3 outline-1 outline-white sm:mt-7 sm:w-3/4"
                />
                {!isLoading && (
                  <button
                    className="z-10 mx-auto mt-7 w-3/4 rounded-2xl border-gray-500 bg-black p-3 text-lg text-white font-medium transition hover:bg-teal-500 sm:mt-10 sm:w-1/3"
                    type="submit"
                  >
                    Summarize
                  </button>
                )}
              </form>

              {completion && (
                <div className="mb-10 px-4 flex-1">
                  <h2 className="mx-auto mt-4 w-3xl border-gray-600 pt-8 text-center text-3xl font-bold sm:text-5xl">
                    Summary
                  </h2>

                  <div className="mx-auto mt-6 max-w-3xl text-lg leading-7">
                    {completion.split("- ").map((sentence, index) => (
                      <div key={index}>
                        {sentence.length > 0 && (
                          <li className="mb-2 list-disc">{sentence}</li>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
