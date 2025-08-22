"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { PlusCircle, BookOpen, Sparkles, Trash2 } from "lucide-react";

const features = [
  {
    icon: <BookOpen className="h-12 w-12 text-pink-400" />,
    title: "Smart Organization",
    description:
      "Effortlessly categorize and search your notebooks with AI-powered tagging.",
  },
  {
    icon: <Sparkles className="h-12 w-12 text-violet-400" />,
    title: "Creative Freedom",
    description:
      "Customize your notebooks with themes, layouts, and rich media support. [Coming soon...]",
  },
  {
    icon: <PlusCircle className="h-12 w-12 text-pink-400" />,
    title: "Collaborate Seamlessly",
    description:
      "Share and collaborate on notebooks in real-time with your team. [Coming soon...]",
  },
];

const HomePage: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [books, setBooks] = useState<
    { id: string; name: string; urlName: string; lastEdited: string }[]
  >([]);
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [newBookName, setNewBookName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    }
  }, []);

  const handleCreateBook = () => {
    if (!newBookName.trim()) {
      return;
    }
    const urlName = newBookName.trim().toLowerCase().replace(/\s+/g, "-");
    const newBook = {
      id: uuidv4(),
      name: newBookName.trim(),
      urlName,
      lastEdited: new Date().toISOString(),
    };
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
    setNewBookName("");
    setIsCreatePopupOpen(false);
    router.push(`/book/${urlName}`);
  };

  const handleDeleteBook = async (id: string) => {
    const book = books.find((b) => b.id === id);
    if (book) {
      const res = await fetch(`/api/delete-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: book?.urlName }),
      });
      if (res?.ok) {
        const updatedBooks = books.filter((b) => b.id !== id);
        setBooks(updatedBooks);
        localStorage.setItem("books", JSON.stringify(updatedBooks));
        localStorage.removeItem(`book-chat-${id}`);
        localStorage.removeItem(`book-content-${id}`);
      }
    }
    setDeleteBookId(null);
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <motion.section
        className="relative flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-5xl md:text-7xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-violet-500 to-pink-500">
          FIND LIKE A PRO
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
          Create, organize, and explore your thoughts with{" "}
          <strong className="text-pink-400">FLAP</strong>. Turn your ideas into
          reality with our intuitive platform.
        </p>
        <button
          className="group relative inline-flex cursor-pointer items-center px-6 py-3 text-lg font-semibold bg-gradient-to-r from-pink-600 to-violet-600 rounded-full hover:from-pink-500 hover:to-violet-500 transition-all duration-300"
          onClick={() => setIsCreatePopupOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <PlusCircle className="mr-2 h-6 w-6" />
          Create Book
          <motion.span
            className="absolute inset-0 bg-white opacity-10 rounded-full"
            animate={{ scale: isHovered ? 1.2 : 1 }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </motion.section>

      {isCreatePopupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h4 className="text-xl font-semibold text-gray-100 mb-4">
              Create New Book
            </h4>
            <input
              type="text"
              value={newBookName}
              autoFocus={true}
              onChange={(e) => setNewBookName(e.target.value)}
              placeholder="Enter book name"
              onKeyDown={(e) => e.key === "Enter" && handleCreateBook()}
              className="w-full p-2 mb-4 bg-gray-900 text-gray-100 border border-gray-700 rounded focus:outline-none focus:border-pink-500"
            />
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                onClick={() => setIsCreatePopupOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-pink-600 rounded hover:bg-pink-700 transition-colors"
                onClick={handleCreateBook}
                disabled={!newBookName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative py-16 px-4 md:px-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-600">
          Why FLAP?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-pink-500 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold text-gray-100 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative py-16 px-4 md:px-16 bg-gradient-to-r from-gray-900 to-gray-800 ">
        <h3 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-600">
          Your Recent Books
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {books.length > 0 ? (
            books.map((book) => (
              <motion.div
                key={book.id}
                className="p-6 bg-gray-800/70 rounded-lg border border-gray-700/50 hover:border-violet-500 transition-all duration-300 flex justify-between items-center"
                whileHover={{ scale: 1.03 }}
              >
                <Link href={`/book/${book.urlName}`} className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-100 mb-2">
                    {book.name}
                  </h4>
                  <p className="text-gray-400">
                    Last edited: {new Date(book.lastEdited).toLocaleString()}
                  </p>
                </Link>
                <button
                  className="p-2 cursor-pointer rounded-full hover:bg-red-600/50 transition-colors"
                  onClick={() => setDeleteBookId(book.id)}
                >
                  <Trash2 className="h-5 w-5 text-red-400" />
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">
              No books yet. Create one to get started!
            </p>
          )}
        </div>
      </section>

      {deleteBookId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h4 className="text-xl font-semibold text-gray-100 mb-4">
              Delete Book
            </h4>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this book? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                onClick={() => setDeleteBookId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                onClick={() => handleDeleteBook(deleteBookId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
