import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { Database } from "@/types/database.types";

export const useRssStore = defineStore("RssStore", () => {
  const syncStore = useSyncStore();
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const feeds: Ref<Feed[]> = ref(useLocalStorage(`rss-${user?.value?.id}`, []));

  const add = async (url: string) => {
    const feed: Feed = {
      url,
      user_id: user?.value?.id,
    };

    syncStore.setIsSyncing(true);

    const { data } = await useFetch("/api/rss", { query: { url } });
    if (data) {
      feed.data = data.value;
    }

    feeds.value?.push(feed);
    storeToLocalStorage();

    await client.from("rss").upsert(feed);

    syncStore.setIsSyncing(false, 500);
  };

  const fetchAll = async () => {
    syncStore.setIsSyncing(true);
    const { data } = await client
      .from("rss")
      .select("id, created_at, url, data, user_id")
      .match({ user_id: user?.value?.id })
      .order("created_at");

    feeds.value = data;
    storeToLocalStorage();

    feeds.value?.forEach(async (feed) => {
      const { data } = await useFetch("/api/rss", { query: { url: feed.url } });
      if (data) {
        feed.data = data.value;
      }
    });

    syncStore.setIsSyncing(false, 500);
  };

  const storeToLocalStorage = () => {
    localStorage.setItem(`rss-${user?.value?.id}`, JSON.stringify(feeds.value));
  };

  return {
    feeds,
    add,
    fetchAll,
  };
});
