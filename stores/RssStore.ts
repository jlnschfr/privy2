import { defineStore } from "pinia";
import Parser from "rss-parser";

export const useRssStore = defineStore("RssStore", () => {
  const feeds: Ref<Feed[]> = ref([]);
  const parser: Parser = new Parser({
    defaultRSS: 2.0,
  });

  const fetchAll = async () => {
    // const feed = await parser.parseURL("https://www.reddit.com/.rss");
    // console.log(feed.title);
    // console.log(feed.items);
  };

  return {
    feeds,
    fetchAll,
  };
});
