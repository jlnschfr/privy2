import Parser from "rss-parser";

export default defineEventHandler(async () => {
  const parser = new Parser();
  const feed = await parser.parseURL(
    "https://www.tagesschau.de/inland/gesellschaft/index~rss2.xml",
  );
  console.log(feed.title);

  return { feed };
});
