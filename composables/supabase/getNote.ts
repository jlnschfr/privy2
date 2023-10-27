import { Database } from "~~/types/database.types";

export async function useGetNote(id: number) {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const { data: note } = await useAsyncData("notes", async () => {
    const { data } = await client
      .from("notes")
      .select("id, created_at, title, positions, favorite, tags, user_id")
      .match({ id, user_id: user.value.id })
      .single();

    return data;
  });
  return { note };
}
