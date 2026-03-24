import { tavily as Tavily } from "@tavily/core";

const tavily = Tavily({ apiKey: process.env.TAVILY_API_KEY });

export const webSearch = async ({ query }) => {
  const searchResults = await tavily.search(query, {
    maxResults: 5,
  });
  console.log(JSON.stringify(searchResults));
  return JSON.stringify(searchResults);
};
