import { defineStore } from "pinia";
import { Database } from "@/types/database.types";

export const useNoteStore = defineStore("NoteStore", () => {
  const notes: Ref<Note[]> = ref([]);
  const isSyncing: Ref<boolean> = ref(false);
  const currentTag: Ref<string> = ref("");

  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const notesNotTrashed: ComputedRef<Note[]> = computed(() =>
    notes.value.filter(
      (note) => !note.tags.some((tag) => tag.text.toLowerCase() === "trash"),
    ),
  );

  const get = (id: string): Note => {
    if (!notes.value.length) return;
    const data = notes.value.find((note) => note.id === id);
    return data;
  };

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
    currentTag,
    notesNotTrashed,
    get,
    fetchAll,
    add,
    update,
    remove,
  };
});
