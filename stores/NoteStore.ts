import { defineStore } from "pinia";
import { Database } from "@/types/database.types";

export const useNoteStore = defineStore("NoteStore", () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const notes: Ref<Note[]> = ref([]);
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

  const fetchAll = async () => {
    const { data } = await client
      .from("notes")
      .select(
        "id, created_at, edited_at, items, title, favorite, tags, user_id",
      )
      .match({ user_id: user.value.id })
      .order("created_at");

    notes.value = data;
  };

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

  const add = async (details: Partial<Note>) => {
    const { data } = await client
      .from("notes")
      .upsert({
        user_id: user.value.id,
        ...details,
      })
      .select(
        "id, created_at, edited_at, title, items, favorite, tags, user_id",
      )
      .single();

    notes.value.push(data);

    await navigateTo({
      path: `/note/${data.id}`,
    });
  };

  const update = async (id: string, details: Partial<Note>) => {
    const { data } = await client
      .from("notes")
      .update({ ...details, edited_at: new Date().toISOString() })
      .match({ id, user_id: user.value.id })
      .select(
        "id, created_at, edited_at, title, items, favorite, tags, user_id",
      )
      .single();

    notes.value = notes.value.map((note) =>
      note.id === data.id ? data : note,
    );
  };

  const remove = async (id: string) => {
    await client.from("notes").delete().match({ id, user_id: user.value.id });

    const index = notes.value.findIndex((note) => note.id === id);
    notes.value.splice(index, 1);

    await navigateTo({
      path: "/notes",
    });
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
