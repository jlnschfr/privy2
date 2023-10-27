import { Database } from "@/types/database.types";

export async function useCreateNote(details: Partial<Note>): Promise<Note> {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const { data: note } = await client
    .from("notes")
    .upsert({
      user_id: user.value.id,
      ...(details.title && { title: details.title }),
      ...(details.favorite && { favorite: details.favorite }),
    })
    .select("id, created_at, edited_at, title, favorite, tags, user_id")
    .single();

  await navigateTo({
    path: `/note/${note.id}`,
  });

  return note;
}
