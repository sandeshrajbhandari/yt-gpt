import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Header({ photo }: { photo?: string | undefined }) {
  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-2">
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
          yt-gpt
        </h1>
      </Link>
      {photo ? (
        <>
          <img
            alt="Profile picture"
            src={photo}
            className="w-10 rounded-full"
            width={32}
            height={28}
          />
          <button className="bg-gray-200 text-black font-semibold p-2 rounded-2xl flex items-center space-x-2">
            <span onClick={() => signOut()}>Sign Out</span>
          </button>
        </>
      ) : (
        <a
          href="https://vercel.com/templates/next.js/ai-photo-restorer"
          target="_blank"
          rel="noreferrer"
        >
          Powered by Vercel
        </a>
      )}
    </header>
  );
}
