"use client";

import { useState, useRef } from "react";
import { Upload, File } from "lucide-react";

interface FileUploadProps {
  bookId: string;
}

const FileUpload: React.FC<FileUploadProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/csv",
        "application/vnd.ms-excel",
      ];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        setError("Please upload a PDF, DOC/DOCX, or CSV file.");
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } else {
      setFile(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      return;
    }
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
            {file ? file.name : "Click to upload PDF, DOC, or CSV"}
          </p>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        className={`px-4 py-2 rounded-md ${
          !file
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-pink-600 to-violet-600 text-whitehover:from-pink-500 hover:to-violet-500 transition-all"
        }`}
        onClick={handleUpload}
        disabled={!file}
      >
        Upload File
      </button>
    </div>
  );
};

export default FileUpload;
