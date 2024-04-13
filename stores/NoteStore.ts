import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { Database } from "@/types/database.types";
import { Filter, Tag } from "@/types/enums";

export const useNoteStore = defineStore("NoteStore", () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const syncStore = useSyncStore();
  const notes: Ref<Note[]> = useLocalStorage(`notes-${user?.value?.id}`, []);

  const notesNotTrashed: ComputedRef<Note[]> = computed(() =>
    notes.value?.filter(
      (note) => !note.tags.some((tag) => tag.text === Tag.Trash),
    ),
  );

  const notesTrashed: ComputedRef<Note[]> = computed(() =>
    notes.value?.filter((note) =>
      note.tags.some((tag) => tag.text === Tag.Trash),
    ),
  );

  const get = (id: string): Note => {
    if (!notes.value?.length) return;
    const data = notes.value?.find((note) => note.id === id);
    return data;
  };

  const getNotesByTag = (tag: string): Note[] => {
    if (!notes.value?.length) return;

    if (tag === Tag.Trash) {
      return notesTrashed.value;
    } else if (tag) {
      return notesNotTrashed.value?.filter((note) =>
        note.tags.some((noteTag) => noteTag.text === tag),
      );
    } else {
      return notesNotTrashed.value;
    }
  };

  const getNotesByFilter = (filter: string): Note[] => {
    if (!notes.value?.length) return;

    if (filter === Filter.Favorites) {
      return notesNotTrashed.value?.filter((note) => note.favorite);
    } else {
      return notesNotTrashed.value;
    }
  };

  const fetchAll = async () => {
    syncStore.setIsSyncing(true);
    const { data } = await client
      .from("notes")
      .select(
        "id, created_at, edited_at, items, title, favorite, tags, user_id",
      )
      .match({ user_id: user?.value?.id })
      .order("created_at");

    notes.value = data;

    sortNotes();
    syncStore.setIsSyncing(false, 500);
  };

  const add = async (note: Note, options: { redirect: boolean }) => {
    const noteWithUserId: Note = {
      ...note,
      user_id: user?.value?.id,
    };

    syncStore.setIsSyncing(true);

    notes.value?.push(noteWithUserId);

    await client.from("notes").upsert(noteWithUserId);

    sortNotes();
    syncStore.setIsSyncing(false, 500);

    if (options.redirect) {
      await navigateTo({
        path: `/note/${note.id}`,
      });
    }
  };

  const update = async (
    id: string,
    details: Partial<Note>,
    options?: { updateEditedAt: boolean },
  ) => {
    const note: Note = {
      ...get(id),
      ...details,
      ...(options?.updateEditedAt && { edited_at: new Date().toISOString() }),
    };

    syncStore.setIsSyncing(true);

    notes.value = notes.value?.map((n) => (n.id === note.id ? note : n));

    await client
      .from("notes")
      .update(note)
      .match({ id, user_id: user?.value?.id });

    sortNotes();
    syncStore.setIsSyncing(false, 500);
  };

  const remove = async (id: string) => {
    syncStore.setIsSyncing(true);

    const index = notes.value?.findIndex((note) => note.id === id);
    notes.value?.splice(index, 1);

    await client.from("notes").delete().match({ id, user_id: user?.value?.id });

    sortNotes();
    syncStore.setIsSyncing(false, 500);
  };

  const sortNotes = () => {
    notes.value?.sort((a, b) => {
      if (a.favorite || b.favorite) {
        if (a.favorite && !b.favorite) {
          return -1;
        } else if (a.favorite && b.favorite) {
          return Date.parse(a.edited_at) >= Date.parse(b.edited_at) ? -1 : 1;
        } else {
          return 1;
        }
      } else if (Date.parse(a.edited_at) >= Date.parse(b.edited_at)) {
        return -1;
      } else {
        return 1;
      }
    });
  };

  return {
    notes,
    notesTrashed,
    notesNotTrashed,
    fetchAll,
    get,
    getNotesByTag,
    getNotesByFilter,
    add,
    update,
    remove,
  };
});
