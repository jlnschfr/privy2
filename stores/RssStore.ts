import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { Database } from "@/types/database.types";

export const useRssStore = defineStore("RssStore", () => {
  const syncStore = useSyncStore();
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const feeds: Ref<Feed[]> = useLocalStorage(`rss-${user?.value?.id}`, []);
  const feedLastUpdated: Ref<number> = useLocalStorage(
    `rss-last-updated-${user?.value?.id}`,
    0,
  );

  const add = async (url: string) => {
    syncStore.setIsSyncing(true);
    const feed: Feed = { url, user_id: user?.value?.id };
    const { data } = await useFetch("/api/rss", { query: { url } });

    if (data?.value) {
      feed.data = data.value as FeedData;

      feeds.value?.push(feed);
      storeToLocalStorage();

      await client.from("rss").upsert(feed);
    } else {
      // show snackbar with error
    }

    syncStore.setIsSyncing(false, 500);
  };

  const remove = async (url: string) => {
    syncStore.setIsSyncing(true);
    const index = feeds.value?.findIndex((feed) => feed.url === url);

    if (index >= 0) {
      const { id } = feeds.value[index];
      feeds.value?.splice(index, 1);
      storeToLocalStorage();

      await client
        .from("rss")
        .delete()
        .match({ id, user_id: user?.value?.id });

      // show snackbar with undo action
    } else {
      // show snackbar with error
    }

    syncStore.setIsSyncing(false, 500);
  };

  const fetchAll = async () => {
    syncStore.setIsSyncing(true);

    if (!checkIfLocalFeedIsUpToDate()) {
      const { data } = await client
        .from("rss")
        .select("id, created_at, url, data, user_id")
        .match({ user_id: user?.value?.id })
        .order("created_at");

      feeds.value = data;
      storeToLocalStorage();

      feeds.value?.forEach(async (feed) => {
        const { data } = await useFetch("/api/rss", {
          query: { url: feed.url },
        });
        if (data) {
          feed.data = data.value as FeedData;
        }
      });
    }

    syncStore.setIsSyncing(false, 500);
  };

  const checkIfLocalFeedIsUpToDate = (): Boolean => {
    const THIRTY_MINUTES = 60 * 60 * 1000; // 60 minutes in milliseconds
    return new Date().getTime() - feedLastUpdated.value <= THIRTY_MINUTES;
  };

  const storeToLocalStorage = () => {
    localStorage.setItem(`rss-${user?.value?.id}`, JSON.stringify(feeds.value));
    localStorage.setItem(
      `rss-last-updated-${user?.value?.id}`,
      JSON.stringify(new Date().getTime()),
    );
  };

  return {
    feeds,
    add,
    remove,
    fetchAll,
  };
});
