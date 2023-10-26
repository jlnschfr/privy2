export async function useAddNote(details) {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const { data: note } = await client
    .from("notes")
    .upsert({
      user_id: user.value.id,
      ...details,
    })
    .select("id, title")
    .single();

  await navigateTo({
    path: `/note/${note.id}`,
  });

  return { note };
}
