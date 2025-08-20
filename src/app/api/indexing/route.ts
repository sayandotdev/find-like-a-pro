import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { NextResponse } from "next/server";
import { QdrantVectorStore } from "@langchain/qdrant";
import { qdrantClient } from "@/config/qdrant.config";
import { v4 as uuid } from "uuid";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "node:path";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { Document } from "langchain/document";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { filePath, bookId, text } = await req.json();

    if (!bookId || !(filePath || text)) {
      return NextResponse.json(
        { error: "Required parameters missing" },
        { status: 400 }
      );
    }

    let loader;
    let docs;

    if (filePath) {
      const ext = path.extname(filePath).toLowerCase();

      if (ext === ".pdf") {
        loader = new PDFLoader(filePath);
      } else if (ext === ".docx") {
        loader = new DocxLoader(filePath);
      } else if (ext === ".csv") {
        loader = new CSVLoader(filePath);
      } else if (ext === ".txt") {
        loader = new TextLoader(filePath);
      } else {
        throw new Error(
          "Unsupported file type. Only PDF, DOCX, CSV, TXT are supported."
        );
      }

      docs = await loader.load();
    } else if (text) {
      docs = [new Document({ pageContent: text })];
    } else {
      throw new Error("No file path or text provided");
    }

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: "gemini-embedding-001",
    });

    const collectionName = `book-${bookId || uuid()}`;

    await QdrantVectorStore.fromDocuments(docs, embeddings, {
      client: qdrantClient,
      collectionName: collectionName,
    });
    return NextResponse.json(
      { message: "Indexing successful", filePath: filePath },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to index content" },
      { status: 500 }
    );
  }
}
