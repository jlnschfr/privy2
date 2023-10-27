import { Database } from "~~/types/database.types";

export async function useUpdateNote(
  id: string,
  details: Partial<Note>,
): Promise<Note> {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const { data: note } = await client
    .from("notes")
    .update({ ...details })
    .match({ id, user_id: user.value.id })
    .select("id, created_at, title, positions, favorite, tags, user_id")
    .single();

  return note;
}
