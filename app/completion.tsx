"use client";

import { useCompletion } from "ai/react";
import { useDebouncedCallback } from "use-debounce";

export default function Completion() {
  const { complete, completion, isLoading } = useCompletion({
    api: "/api/completion",
  });

  const handleInputChange = useDebouncedCallback((e) => {
    complete(e.target.value);
  }, 500);

  return (
    <div>
      <p>Current state: {isLoading ? "Generating..." : "Idle"}</p>
      <textarea
        placeholder="Enter your prompt..."
        onChange={handleInputChange}
      />
      <p>{completion}</p>
    </div>
  );
}
