import { Database } from "~~/types/database.types";

export async function useDeleteNote(id: number) {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const { data: note } = await client
    .from("notes")
    .delete()
    .match({ id, user_id: user.value.id });

  await navigateTo({
    path: "/notes",
  });

  return { note };
}
