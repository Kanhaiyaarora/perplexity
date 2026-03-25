import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import {
  AIMessage,
  createAgent,
  HumanMessage,
  SystemMessage,
  tool,
} from "langchain";
import { webSearch } from "./webSearch.service.js";
import * as z from "zod";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});


// this tools helps getting realtime data from the internet using tavily
const webSearchTool = tool(webSearch, {
  name: "webSearch",
  description:
    "use this tool to get the real-time news updates or latest information or details from the Internet.",
  schema: z.object({
    query: z
      .string()
      .describe(
        "The search query to look on the internet for latest information or real-time news updates.",
      ),
  }),
});

const agent = createAgent({
  model: geminiModel,
  tools: [webSearchTool],
});

export const generateResponse = async (messages) => {
  const response = await agent.invoke({
    messages: [
      new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date or real-time information, use the "webSearchTool" tool to get the latest information or real-time details from the internet and then answer based on the search results.
            `),
      ...messages.map((msg) => {
        if (msg.role == "user") {
          return new HumanMessage(msg.content);
        } else if (msg.role == "ai") {
          return new AIMessage(msg.content);
        }
      }),
    ],
  });

  return response.messages[response.messages.length - 1].text;
};



export const generateChatTitle = async (message) => {
  const response = await mistralModel.invoke([
    new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
        `),
    new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
            `),
  ]);
  return response.text;
};
