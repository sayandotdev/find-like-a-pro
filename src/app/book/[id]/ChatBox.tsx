"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const Chatbox: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<
    { user: string; bot: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    const newMessage = {
      user: chatInput,
      bot: `Response to "${chatInput}" (static bot reply, replace with AI logic)`,
    };
    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-800/50 rounded-lg border border-gray-700 p-4">
      <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-600 mb-4">
        Ask Away
      </h3>
      <div className="flex-1 overflow-y-auto mb-4">
        {chatMessages.map((msg, index) => (
          <div key={index} className="mb-2">
            <p className="text-pink-400 font-semibold">You:</p>
            <p className="text-gray-300">{msg.user}</p>
            <p className="text-violet-400 font-semibold mt-2">Bot:</p>
            <p className="text-gray-300">{msg.bot}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 p-2 bg-gray-900 text-gray-100 border border-gray-700 rounded focus:outline-none focus:border-pink-500"
          onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
        />
        <button
          className="p-2 bg-gradient-to-r from-pink-600 to-violet-600 rounded hover:from-pink-500 hover:to-violet-500 transition-all"
          onClick={handleChatSubmit}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
