"use client";

import { FormEvent, useState } from "react";

interface TextInputProps {
  bookId: string;
}

interface Data {
  message: string;
  filePath: string;
}

const TextInput: React.FC<TextInputProps> = ({ bookId }) => {
  const [textContent, setTextContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Data | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!textContent.trim()) {
      setError("Text cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/indexing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textContent, bookId: bookId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save text");
      }

      const jsonData = await response.json();
      setData(jsonData);
      setTextContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        name="text"
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
        placeholder="Write your notes here..."
        className="w-full h-96 p-4 bg-gray-900 text-gray-100 border border-gray-700 rounded focus:outline-none focus:border-pink-500 resize-none"
        disabled={loading}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {data && <p className="text-green-500 text-sm">{data?.message}</p>}
      <button
        type="submit"
        className={`px-4 py-2 rounded-md ${
          textContent && !loading
            ? "bg-gradient-to-r from-pink-600 to-violet-600 text-white rounded hover:from-pink-500 hover:to-violet-500 transition-all"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
        disabled={!textContent || loading}
      >
        {loading ? "Saving..." : "Save Text"}
      </button>
    </form>
  );
};

export default TextInput;
