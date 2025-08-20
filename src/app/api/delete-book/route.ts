import { QdrantClient } from "@qdrant/js-client-rest";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { qdrantClient } from "@/config/qdrant.config";

const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });

export async function POST(request: NextRequest) {
  try {
    const { bookId: collectionName } = await request.json();

    if (!collectionName) {
      return NextResponse.json(
        { error: "Collection name is required" },
        { status: 400 }
      );
    }

    await qdrantClient.deleteCollection(`book-${collectionName}`);
    const uploadDir = path.join(process.cwd(), "uploads");
    const filePath = path.join(uploadDir, `${collectionName}.pdf`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json(
      { message: "Book and collection deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
