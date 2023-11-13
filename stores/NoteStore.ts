import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { Database } from "@/types/database.types";

export const useNoteStore = defineStore("NoteStore", () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const notes: Ref<Note[]> = ref(
    useLocalStorage(`notes-${user?.value?.id}`, []),
  );
  const isSyncing: Ref<boolean> = ref(false);

  const notesNotTrashed: ComputedRef<Note[]> = computed(() =>
    notes.value.filter(
      (note) => !note.tags.some((tag) => tag.text.toLowerCase() === "trash"),
    ),
  );

  const notesTrashed: ComputedRef<Note[]> = computed(() =>
    notes.value.filter((note) =>
      note.tags.some((tag) => tag.text.toLowerCase() === "trash"),
    ),
  );

  const get = (id: string): Note => {
    if (!notes.value.length) return;
    const data = notes.value.find((note) => note.id === id);
    return data;
  };

  const getFiltered = (filter: string): Note[] => {
    if (!notes.value.length) return;

    if (filter === "Trash") {
      return notesTrashed.value;
    } else if (filter) {
      return notesNotTrashed.value.filter((note) =>
        note.tags.some(
          (tag) => tag.text.toLowerCase() === filter.toLowerCase(),
        ),
      );
    } else {
      return notesNotTrashed.value;
    }
  };

  const fetchAll = async () => {
    setIsSyncing(true);
    const { data } = await client
      .from("notes")
      .select(
        "id, created_at, edited_at, items, title, favorite, tags, user_id",
      )
      .match({ user_id: user?.value?.id })
      .order("created_at");

    notes.value = data;
    setIsSyncing(false, 500);
    sortNotes();
  };

  const add = async (note: Note, options: { redirect: boolean }) => {
    const noteWithUserId: Note = {
      ...note,
      user_id: user?.value?.id,
    };

    setIsSyncing(true);

    notes.value.push(noteWithUserId);
    storeToLocalStorage();
    sortNotes();

    await client.from("notes").upsert(noteWithUserId);

    setIsSyncing(false, 500);

    if (options.redirect) {
      await navigateTo({
        path: `/note/${note.id}`,
      });
    }
  };

  const update = async (id: string, details: Partial<Note>) => {
    const note: Note = {
      ...get(id),
      ...details,
      edited_at: new Date().toISOString(),
    };

    setIsSyncing(true);

    notes.value = notes.value.map((n) => (n.id === note.id ? note : n));
    storeToLocalStorage();
    sortNotes();

    await client
      .from("notes")
      .update(note)
      .match({ id, user_id: user?.value?.id });

    setIsSyncing(false, 500);
  };

  const remove = async (id: string) => {
    setIsSyncing(true);

    const index = notes.value.findIndex((note) => note.id === id);
    notes.value.splice(index, 1);
    storeToLocalStorage();
    sortNotes();

    await client
      .from("notes")
      .delete()
      .match({ id, user_id: user?.value?.id });

    setIsSyncing(false, 500);
  };

  const sortNotes = () => {
    notes.value.sort((a, b) => {
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

  const storeToLocalStorage = () => {
    localStorage.setItem(
      `notes-${user?.value?.id}`,
      JSON.stringify(notes.value),
    );
  };

  const setIsSyncing = (value: boolean, delay: number = 0) => {
    setTimeout(() => {
      isSyncing.value = value;
    }, delay);
  };

  return {
    notes,
    isSyncing,
    notesTrashed,
    notesNotTrashed,
    fetchAll,
    get,
    getFiltered,
    add,
    update,
    remove,
  };
});
