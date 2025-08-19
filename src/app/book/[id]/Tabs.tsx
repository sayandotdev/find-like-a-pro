"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextInput from "./TextInput";
import FileUpload from "./FileUpload";

interface TabsProps {
  bookId: string;
}

const Tabs: React.FC<TabsProps> = ({ bookId }) => {
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [direction, setDirection] = useState<number>(0);

  const handleTabChange = (newTab: "text" | "file") => {
    const tabIndex = { text: 0, file: 1 };
    const newDirection = tabIndex[newTab] > tabIndex[activeTab] ? 1 : -1;
    setDirection(newDirection);
    setActiveTab(newTab);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-700 mb-4">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "text"
              ? "text-pink-400 border-b-2 border-pink-400"
              : "text-gray-400"
          }`}
          onClick={() => handleTabChange("text")}
        >
          Text
        </button>
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "file"
              ? "text-pink-400 border-b-2 border-pink-400"
              : "text-gray-400"
          }`}
          onClick={() => handleTabChange("file")}
        >
          File Upload
        </button>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={{
              hidden: { x: 50, opacity: 0 },
              visible: { x: 0, opacity: 1 },
              exit: { x: -50, opacity: 0 },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={direction}
            className="h-full"
          >
            {activeTab === "text" ? (
              <TextInput bookId={bookId} />
            ) : (
              <FileUpload bookId={bookId} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs;
