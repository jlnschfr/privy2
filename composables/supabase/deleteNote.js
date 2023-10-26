export async function useDeleteNote(id) {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const { data: note } = await client
    .from("notes")
    .delete()
    .match({ id })
    .match({ user_id: user.value.id });

  await navigateTo({
    path: "/notes",
  });

  return { note };
}
