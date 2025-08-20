import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { NextRequest, NextResponse } from "next/server";
import { QdrantVectorStore } from "@langchain/qdrant";
import { qdrantConfig } from "@/config/qdrant.config";
import { GoogleGenAI } from "@google/genai";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: "gemini-embedding-001",
});

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      qdrantConfig
    );

    const vectorSearcher = vectorStore.asRetriever({
      k: 3,
    });

    const relevantChunks = await vectorSearcher.invoke(message);

    const SYSTEM_PROMPT = `
        You are an AI assistant who helps resolving user query based on the context available to you from a PDF file and text that user typed with the content and page number.
        Only ans based on the available context from the file only.
        Also give the source page number as the output, for example: (Source: Page 2 - 3)

        Context: ${JSON.stringify(relevantChunks)}
    `;

    const response = await client.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    return NextResponse.json(
      {
        message: response?.text,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
