import RSSParser from "rss-parser/dist/rss-parser.min.js";

export const handler = async () => {
  const parser = new RSSParser();
  const feed = await parser.parseURL(
    "https://www.tagesschau.de/inland/gesellschaft/index~rss2.xml",
  );

  return {
    statusCode: 200,
    body: JSON.stringify(feed),
  };
};
