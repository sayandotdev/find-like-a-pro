"use client";

import { useState, useEffect } from "react";

interface TextInputProps {
  bookId: string;
}

const TextInput: React.FC<TextInputProps> = ({ bookId }) => {
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    const storedContent = localStorage.getItem(`book-content-${bookId}`);
    if (storedContent) {
      const { text } = JSON.parse(storedContent);
      setTextContent(text || "");
    }
  }, [bookId]);

  const handleSave = () => {
    const content = { text: textContent, file: null };
    localStorage.setItem(`book-content-${bookId}`, JSON.stringify(content));
    alert("Text saved!");
  };

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
        placeholder="Write your notes here..."
        className="w-full h-96 p-4 bg-gray-900 text-gray-100 border border-gray-700 rounded focus:outline-none focus:border-pink-500 resize-none"
      />
      <button
        className="px-4 py-2 bg-gradient-to-r from-pink-600 to-violet-600 text-white rounded hover:from-pink-500 hover:to-violet-500 transition-all"
        onClick={handleSave}
      >
        Save Text
      </button>
    </div>
  );
};

export default TextInput;
