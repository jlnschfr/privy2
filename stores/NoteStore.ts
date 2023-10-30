import { defineStore } from "pinia";
import { Database } from "@/types/database.types";

export const useNoteStore = defineStore("NoteStore", () => {
  const notes: Ref<Note[]> = ref([]);
  const isSyncing: Ref<boolean> = ref(false);
  const currentTag: Ref<string> = ref("");

  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const getNotes = computed(() => {
    if (!notes.value.length) return {};
    return notes.value;
  });

  const getNote = (id: string): Note => {
    if (!notes.value.length) return;
    const data = notes.value.find((note) => note.id === id);
    return data;
  };

  const fetchNotes = async () => {
    const { data } = await client
      .from("notes")
      .select("id, created_at, edited_at, title, favorite, tags, user_id")
      .match({ user_id: user.value.id })
      .order("created_at");

    notes.value = data;
  };

  const addNote = async (details: Partial<Note>) => {
    const { data } = await client
      .from("notes")
      .upsert({
        user_id: user.value.id,
        ...(details.title && { title: details.title }),
        ...(details.favorite && { favorite: details.favorite }),
      })
      .select("id, created_at, edited_at, title, favorite, tags, user_id")
      .single();

    notes.value.push(data);

    await navigateTo({
      path: `/note/${data.id}`,
    });
  };

  const updateNote = async (id: string, details: Partial<Note>) => {
    const { data } = await client
      .from("notes")
      .update({ ...details })
      .match({ id, user_id: user.value.id })
      .select(
        "id, created_at, edited_at, title, positions, favorite, tags, user_id",
      )
      .single();

    notes.value = notes.value.map((note) =>
      note.id === data.id ? data : note,
    );
  };

  const deleteNote = async (id: string) => {
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
    getNotes,
    getNote,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote,
  };
});