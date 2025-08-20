"use client";

import { useState, useRef } from "react";
import { Upload, File, Cloud, ArrowUpFromLine, BookMarked } from "lucide-react";
import { useParams } from "next/navigation";

interface FileUploadProps {
  bookId: string;
}

interface Data {
  message: string;
  filePath: string;
}

const FileUpload: React.FC<FileUploadProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const { id: urlName } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [secondLoading, setSecondLoading] = useState<boolean>(false);
  const [data, setData] = useState<Data | null>(null);

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

  const handleIndex = async (filePath: string) => {
    if (!filePath) return;

    setSecondLoading(true);
    setData(null);
    setError("");

    try {
      const response = await fetch("/api/indexing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: filePath,
          bookId: urlName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Indexing failed: ${response.statusText}`);
      }

      const ResData = await response.json();
      setData(ResData);
    } catch (err: any) {
      setError(err?.message || "An error occurred during indexing");
    } finally {
      setSecondLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!response) {
        throw new Error("Upload failed");
      }

      const resData = await response.json();
      if (resData) {
        setData(resData?.message);
        await handleIndex(resData?.filePath);
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred during upload");
    } finally {
      setFile(null);
      setLoading(false);
    }

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
        accept=".pdf, .doc, .docx, .csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        className="w-full h-96 bg-gray-900 border border-gray-700 rounded flex items-center justify-center cursor-pointer hover:border-pink-500 transition-all"
        onClick={handleDivClick}
      >
        <div className="flex flex-col items-center gap-2">
          {!loading ? (
            file ? (
              <File className="h-12 w-12 text-gray-400 hover:text-pink-400 transition-colors" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400 hover:text-pink-400 transition-colors" />
            )
          ) : secondLoading ? (
            <span>
              <BookMarked size={50} />
              <p className="pt-2 text-center text-green-400">Indexing...</p>
            </span>
          ) : (
            <>
              <span className="relative flex justify-center">
                <Cloud size={50} />
                <ArrowUpFromLine
                  size={30}
                  className="absolute -bottom-2 animate-bounce"
                />
              </span>
              <p className="text-orange-500 text-center">Uploading...</p>
            </>
          )}
          <p className="text-gray-400 text-sm">
            {file ? file.name : "Click to upload PDF"}
          </p>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {data && <p className="text-green-500 text-sm">{data?.message}</p>}
      <button
        className={`px-4 py-2 rounded-md ${
          !file
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-pink-600 to-violet-600 text-whitehover:from-pink-500 hover:to-violet-500 transition-all"
        }`}
        onClick={handleUpload}
        disabled={!file}
      >
        {loading
          ? "Uploading..."
          : secondLoading
          ? "Indexing..."
          : "Upload File"}
      </button>
    </div>
  );
};

export default FileUpload;
