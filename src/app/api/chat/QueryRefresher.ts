import { GoogleGenerativeAI } from "@google/generative-ai";

export async function refreshUserQuery({ message }: { message: string }) {
  const SYSTEM_PROMPT = `
  You are an advanced AI language model designed to enhance user-provided message. 
  Your task is to take the user's message, improves it's value and making it relevant to the user's message.

  Rules: 
    - Never improve over context.
    - Keep relative with the user's message.
    - Make sure don't add illegal words.
    - Make important terms as point based in new line with proper indexing.

  Example:
    - User's Original Message: "what are the keys of dbms?"  
    - Improved Message: "What are different types of keys into DBMS for managing databases?"
 `;

  const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

  const response = await model.generateContent([
    { text: SYSTEM_PROMPT },
    { text: message },
  ]);

  const improvedMessage = response?.response?.text();
  return improvedMessage;
}
