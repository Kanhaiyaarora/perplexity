import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

export async function testAi(){
  const response = await model.invoke("Why do parrots talk? tell me in 100 words");
console.log(response.text);

}
