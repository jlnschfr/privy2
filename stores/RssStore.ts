import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { v4 as uuid } from "uuid";
import { createEmptyNote } from "@/utils/note";
import type { Database } from "@/types/database.types";

export const useRssStore = defineStore("RssStore", () => {
  const syncStore = useSyncStore();
  const noteStore = useNoteStore();
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const feeds: Ref<Feed[]> = useLocalStorage(`rss-${user?.value?.id}`, []);
  // const feedLastUpdated: Ref<number> = useLocalStorage(
  //   `rss-last-updated-${user?.value?.id}`,
  //   0,
  // );

  // const isLocalFeedUpToDate: ComputedRef<boolean> = computed(() => {
  //   if (!feedLastUpdated.value) return false;

  //   const offset = 60 * 60 * 1000; // 60 minutes in ms
  //   return new Date().getTime() - feedLastUpdated.value <= offset;
  // });

  const get = (id: string): Feed => {
    if (!feeds.value?.length) return;
    return feeds.value?.find((feed) => feed.id === id);
  };

  const add = async (url: string) => {
    syncStore.setIsSyncing(true);
    const feed: Feed = {
      id: uuid(),
      url,
      user_id: user?.value?.id,
      created_items: [],
    };
    const { data } = await useFetch("/api/rss", { query: { url } });

    if (data?.value) {
      feed.data = data.value as FeedData;
      feeds.value?.push(feed);

      await client.from("rss").upsert(feed);
      addFeedsToNotes();
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
      await client.from("rss").delete().match({ id, user_id: user?.value?.id });

      // show snackbar with undo action
    } else {
      // show snackbar with error
    }

    syncStore.setIsSyncing(false, 500);
  };

  const update = async (id: string, details: Partial<Feed>) => {
    syncStore.setIsSyncing(true);

    const updatedFeed: Feed = {
      ...get(id),
      ...details,
      updated_at: new Date().toISOString(),
    };

    feeds.value = feeds.value?.map((feed) =>
      feed.id === updatedFeed.id ? updatedFeed : feed,
    );

    await client
      .from("rss")
      .update(updatedFeed)
      .match({ id, user_id: user?.value?.id });

    syncStore.setIsSyncing(false, 500);
  };

  const fetchAll = async () => {
    syncStore.setIsSyncing(true);

    const { data } = await client
      .from("rss")
      .select("id, created_at, updated_at, url, data, user_id, created_items")
      .match({ user_id: user?.value?.id })
      .order("created_at");

    feeds.value = data;

    feeds.value?.forEach(async (feed) => {
      // TODO: check if feed is up to date and only update when older than 60min
      const { data } = await useFetch("/api/rss", {
        query: { url: feed.url },
      });
      if (data) {
        feed.data = data.value as FeedData;
        addFeedsToNotes();
      }
    });

    syncStore.setIsSyncing(false, 500);
  };

  const addFeedsToNotes = () => {
    feeds.value.forEach((feed) => {
      for (let i = 0; i < 2; i++) {
        const id = feed.data?.items[i].guid;
        const title = feed.data?.items[i].title;
        const author = feed.data?.title;
        const contentEncoded = feed.data?.items[i]["content:encoded"];
        const link = `<p><a href="${feed.data?.items[i].link}">${author}: ${title}</a><p>`;
        const content = contentEncoded || feed.data?.items[i].content + link;

        if (!id || !title || feed.created_items.includes(id)) return;

        const note: Note = createEmptyNote();
        note.title = title;
        note.tags.push({ text: "rss" });
        note.items.push({
          id: uuid(),
          type: "Markdown",
          data: {
            text: content,
          },
        });
        noteStore.add(note, { redirect: false });

        feed.created_items.push(id);
        update(feed.id, { created_items: feed.created_items });
      }
    });
  };

  return {
    feeds,
    get,
    update,
    add,
    remove,
    fetchAll,
  };
});
