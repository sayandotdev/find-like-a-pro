"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Image from "next/image";

interface Message {
  role: "user" | "bot";
  content: string;
}

const Chatbox: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) {
      return;
    }

    const userMessage: Message = { role: "user", content: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput("");
    setLoading(true);
    setError(null);

    try {
      const botMessage: Message = {
        role: "bot",
        content: "No response from AI.",
      };
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError("Failed to get AI response. Please try again.");
      const errorMessage: Message = {
        role: "bot",
        content: "Sorry, I couldn't process your request. Try again later.",
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800/50 rounded-lg border border-gray-700 p-4">
      <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-600 mb-4">
        Ask Away
      </h3>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            } items-start gap-2`}
          >
            {msg.role === "bot" && (
              <Image
                src="/robot.png"
                alt="Bot Avatar"
                width={50}
                height={50}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div
              className={`max-w-[70%] p-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-pink-600/20 border border-pink-500 text-gray-100"
                  : "bg-violet-600/20 border border-violet-500 text-gray-100"
              }`}
            >
              <p className="text-gray-300">{msg.content}</p>
            </div>
            {msg.role === "user" && (
              <Image
                src="/user.png"
                alt="User Avatar"
                width={50}
                height={50}
                className="w-8 h-8 rounded-full"
              />
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start items-center gap-2">
            <img
              src="/bot-avatar.png"
              alt="Bot Avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="bg-violet-600/20 border border-violet-500 text-gray-100 p-2 rounded-lg">
              <p className="text-violet-400 text-sm font-semibold">Bot:</p>
              <p className="text-gray-300">Thinking...</p>
            </div>
          </div>
        )}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 p-2 bg-gray-900 text-gray-100 border border-gray-700 rounded focus:outline-none focus:border-pink-500"
          onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
          disabled={loading}
        />
        <button
          className={`py-1.5 px-2 rounded-md ${
            !chatInput || loading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 transition-all"
          }`}
          onClick={handleChatSubmit}
          disabled={!chatInput || loading}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
