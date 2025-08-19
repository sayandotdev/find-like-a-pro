"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Tabs from "@/components/Tabs";
import Chatbox from "@/components/ChatBox";

const BookPage: React.FC = () => {
  const { id } = useParams();
  const [bookName, setBookName] = useState<string>("");

  useEffect(() => {
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
      const books = JSON.parse(storedBooks);
      const book = books.find((b: any) => b.urlName === id);
      if (book) {
        setBookName(book.name);
      }
    }
  }, [id]);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h4 className="text-xl text-white p-4 flex items-center gap-4">
        <Link href="/">
          <ArrowLeft className="cursor-pointer hover:text-pink-400 transition-colors" />
        </Link>
        <span className="font-bold">Book:</span> {bookName || id}
      </h4>

      <main className="max-w-7xl mx-auto p-6 ">
        <div className="flex flex-col min-h-[35rem] md:flex-row gap-6">
          <div className="md:w-1/2 flex flex-col bg-gray-800/50 rounded-lg border border-gray-700 p-4">
            <Tabs bookId={id as string} />
          </div>
          <div className="md:w-1/2 flex flex-col bg-gray-800/50 rounded-lg border border-gray-700 p-4">
            <Chatbox />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookPage;
