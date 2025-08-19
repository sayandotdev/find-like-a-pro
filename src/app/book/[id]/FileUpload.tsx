"use client";

import { useState, useRef } from "react";
import { Upload, File } from "lucide-react";

interface FileUploadProps {
  bookId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ bookId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Clear previous errors
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/csv",
        "application/vnd.ms-excel",
      ];
      console.log("File selected:", {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      });
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        console.log("Valid file type:", selectedFile.type);
      } else {
        setError("Please upload a PDF, DOC/DOCX, or CSV file.");
        console.log("Invalid file type:", selectedFile.type);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } else {
      console.log("No file selected");
      setFile(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      console.log("No file to upload");
      return;
    }
    const content = { text: "", file: file.name };
    localStorage.setItem(`book-content-${bookId}`, JSON.stringify(content));
    console.log("File metadata saved to localStorage:", file.name);
    alert("File metadata saved!");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      console.log("File input reset");
    }
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
      console.log("Upload div clicked, triggering file input");
    } else {
      console.error("fileInputRef is not assigned");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        ref={fileInputRef}
        id="file-of-user"
        accept=".pdf,.doc,.docx,.csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        className="w-full h-96 bg-gray-900 border border-gray-700 rounded flex items-center justify-center cursor-pointer hover:border-pink-500 transition-all"
        onClick={handleDivClick}
      >
        <div className="flex flex-col items-center gap-2">
          {file ? (
            <File className="h-12 w-12 text-gray-400 hover:text-pink-400 transition-colors" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400 hover:text-pink-400 transition-colors" />
          )}
          <p className="text-gray-400 text-sm">
            {file ? "File selected" : "Click to upload PDF, DOC, or CSV"}
          </p>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        className="px-4 py-2 bg-gradient-to-r from-pink-600 to-violet-600 text-white rounded hover:from-pink-500 hover:to-violet-500 transition-all"
        onClick={handleUpload}
        disabled={!file}
      >
        Upload File
      </button>
      {file && <p className="text-gray-400">Selected: {file.name}</p>}
    </div>
  );
};

export default FileUpload;
