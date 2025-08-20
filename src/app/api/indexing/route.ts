import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { NextResponse } from "next/server";
import { QdrantVectorStore } from "@langchain/qdrant";
import { qdrantConfig } from "@/config/qdrant.config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "node:path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { filePath } = await req.json();

    if (!filePath) {
      return NextResponse.json(
        { error: "No file path provided" },
        { status: 400 }
      );
    }

    const ext = path.extname(filePath).toLowerCase();
    if (ext !== ".pdf") {
      return NextResponse.json(
        { message: "Only accept pdfs" },
        { status: 400 }
      );
    }

    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: "gemini-embedding-001",
    });

    await QdrantVectorStore.fromDocuments(docs, embeddings, qdrantConfig);
    return NextResponse.json(
      { message: "Indexing successful", filePath: filePath },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to index content" },
      { status: 500 }
    );
  }
}