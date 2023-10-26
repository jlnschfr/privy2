export async function useUpdateNote(id, details) {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const { data: note } = await client
    .from("notes")
    .update({ ...details })
    .match({ id })
    .match({ user_id: user.value.id })
    .select("id, title")
    .single();

  return { note };
}
