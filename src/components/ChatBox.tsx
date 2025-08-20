"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

interface Message {
  role: "user" | "bot";
  content: string;
}

interface Book {
  id: string;
  name: string;
  urlName: string;
  lastEdited: string;
}

const Chatbox: React.FC = () => {
  const { id: urlName } = useParams<{ id: string }>();
  const [bookId, setBookId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
      const books: Book[] = JSON.parse(storedBooks);
      const book = books.find((b) => b.urlName === urlName);
      if (book) {
        setBookId(book.id);
        const savedChats = localStorage.getItem(`book-chat-${book.id}`);
        if (savedChats) {
          setChatMessages(JSON.parse(savedChats));
        }
      } else {
        setError("Book not found.");
      }
    }
  }, [urlName]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, loading]);

  useEffect(() => {
    if (bookId && chatMessages.length > 0) {
      localStorage.setItem(`book-chat-${bookId}`, JSON.stringify(chatMessages));
    }
  }, [chatMessages, bookId]);

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) {
      return;
    }
    if (!bookId) {
      setError("Book not found.");
      return;
    }

    const userMessage: Message = { role: "user", content: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: chatInput, bookId: urlName }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        role: "bot",
        content: data?.message || "No response from AI.",
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
      <div
        ref={chatContainerRef}
        className="flex-1 max-h-96 overflow-y-auto mb-4 space-y-4"
      >
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
            <Image
              src="/robot.png"
              alt="Bot Avatar"
              width={50}
              height={50}
              className="w-8 h-8 rounded-full"
            />
            <div className="bg-violet-600/20 border border-violet-500 text-gray-100 p-2 rounded-lg">
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
          disabled={loading || !bookId}
        />
        <button
          className={`py-1.5 px-2 rounded-md ${
            !chatInput || loading || !bookId
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 transition-all"
          }`}
          onClick={handleChatSubmit}
          disabled={!chatInput || loading || !bookId}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
