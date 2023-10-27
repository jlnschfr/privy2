import { Database } from "@/types/database.types";

export async function useGetNotes(): Promise<Ref<Note[]>> {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const { data: notes } = await useAsyncData("notes", async () => {
    const { data } = await client
      .from("notes")
      .select("id, created_at, title, favorite, tags, user_id")
      .match({ user_id: user.value.id })
      .order("created_at");

    return data;
  });
  return notes;
}
