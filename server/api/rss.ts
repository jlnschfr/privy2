import Parser from "rss-parser";
import type { Output } from "rss-parser";

export default defineEventHandler(async (event): Promise<Output<any>> => {
  const query = getQuery(event);
  if (!query.url || typeof query.url !== "string") return;

  const parser: Parser = new Parser();
  const feed: Output<any> = await parser.parseURL(query.url);

  return feed;
});
