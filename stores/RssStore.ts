import { defineStore } from "pinia";

export const useRssStore = defineStore("RssStore", () => {
  const feeds: Ref<Feed[]> = ref([]);

  const fetchAll = async () => {
    try {
      const functionUrl: string = `/.netlify/functions/rss}`;
      const functionResponse: Response = await fetch(functionUrl);
      const result = await functionResponse.json();

      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  return {
    feeds,
    fetchAll,
  };
});
