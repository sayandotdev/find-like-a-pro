"use client";

import { useState } from "react";

interface TextInputProps {
  bookId: string;
}

const TextInput: React.FC<TextInputProps> = () => {
  const [textContent, setTextContent] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
        placeholder="Write your notes here..."
        className="w-full h-96 p-4 bg-gray-900 text-gray-100 border border-gray-700 rounded focus:outline-none focus:border-pink-500 resize-none"
      />
      <button
        className={`px-4 py-2 rounded-md ${
          textContent
            ? "bg-gradient-to-r from-pink-600 to-violet-600 text-white rounded hover:from-pink-500 hover:to-violet-500 transition-all"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        } `}
        disabled={!textContent}
      >
        Save Text
      </button>
    </div>
  );
};

export default TextInput;
