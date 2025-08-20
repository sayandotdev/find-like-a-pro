import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

export const QDRANT_COLLECTION_NAME = "documents";
export const QDRANT_VECTOR_SIZE = 1536;
export const qdrantConfig = {
  collection: QDRANT_COLLECTION_NAME,
  url: process.env.QDRANT_URL
};
