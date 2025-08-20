import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { qdrantClient } from "@/config/qdrant.config";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { message, bookId } = await request.json();
    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    if (!bookId) {
      return NextResponse.json(
        { error: "bookId is required" },
        { status: 400 }
      );
    }

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: "gemini-embedding-001",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        client: qdrantClient,
        collectionName: `book-${bookId}`,
      }
    );

    const vectorSearcher = vectorStore.asRetriever({
      k: 3,
    });

    const relevantChunks = await vectorSearcher.invoke(message);

    const SYSTEM_PROMPT = `
      You are an AI assistant who helps resolve user queries based only on the context from the specified book's collection.
      Answer based solely on the provided context, including content from uploaded files and text.
      Include source page numbers if available, formatted as: (Source: Page X - Y)
      If no page numbers are available, omit the source reference.

      Context: ${JSON.stringify(relevantChunks)}
    `;

    const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

    const response = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: message },
    ]);

    let answer = response.response.text();
    const pageNumbers = relevantChunks
      .map((chunk) => chunk.metadata.pageNumber || chunk.metadata.page)
      .filter((page) => page != null)
      .sort((a, b) => a - b);

    if (pageNumbers.length > 0) {
      const minPage = Math.min(...pageNumbers);
      const maxPage = Math.max(...pageNumbers);
      answer += ` (Source: Page ${minPage}${
        minPage === maxPage ? "" : ` - ${maxPage}`
      })`;
    }

    return NextResponse.json({ message: answer }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
