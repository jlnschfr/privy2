import Parser from "rss-parser";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const { url } = event.queryStringParameters ?? {};
  if (!url || typeof url !== "string") {
    return { statusCode: 400, body: "{}" };
  }

  try {
    const parser: Parser = new Parser();
    const feed = await parser.parseURL(url);

    return {
      statusCode: 200,
      body: JSON.stringify(feed),
    };
  } catch {
    return { statusCode: 400, body: "{}" };
  }
};
