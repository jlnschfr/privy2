import { defineStore } from "pinia";
import type { Database } from "@/types/database.types";

export const useRssStore = defineStore("RssStore", () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const feeds: Ref<Feed[]> = ref([]);

  const add = async (url: string) => {
    const feed: Feed = {
      url,
      user_id: user?.value?.id,
    };

    // setIsSyncing(true);

    const { data } = await useFetch("/api/rss", { query: { url } });
    if (data) {
      feed.feed = data.value;
    }

    feeds.value?.push(feed);
    // storeToLocalStorage();

    await client.from("rss").upsert(feed);

    // setIsSyncing(false, 500);
  };

  const fetchAll = async () => {
    // setIsSyncing(true);
    const { data } = await client
      .from("rss")
      .select("id, created_at, url, feed, user_id")
      .match({ user_id: user?.value?.id })
      .order("created_at");

    feeds.value = data;
    // storeToLocalStorage();

    feeds.value.forEach(async (feed) => {
      const { data } = await useFetch("/api/rss", { query: { url: feed.url } });
      if (data) {
        feed.feed = data.value;
      }
    });

    // setIsSyncing(false, 500);
  };

  return {
    feeds,
    add,
    fetchAll,
  };
});
