// import RSSParser from "rss-parser/dist/rss-parser.min.js";
import Parser from "rss-parser";

export const handler = async () => {
  const parser = new Parser();
  const feed = await parser.parseURL("https://www.reddit.com/.rss");
  console.log(feed.title); // feed will have a `foo` property, type as a string

  feed.items.forEach((item) => {
    console.log(item.title + ":" + item.link); // item will have a `bar` property type as a number
  });

  return {
    statusCode: 200,
    body: JSON.stringify(feed),
  };
};
