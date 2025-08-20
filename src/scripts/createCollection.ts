import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

async function createCollection(bookId: string) {
  const collectionName = `book-${bookId}`;
  try {
    await qdrantClient.createCollection(collectionName, {
      vectors: { size: 1536, distance: "Cosine" },
    });
  } catch {}
}

createCollection(process.argv[2]);
