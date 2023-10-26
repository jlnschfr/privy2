export async function useGetNote(id) {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const { data: note } = await useAsyncData("notes", async () => {
    const { data } = await client
      .from("notes")
      .select("id, title")
      .eq("user_id", user.value.id)
      .eq("id", id)
      .single();

    return data;
  });
  return { note };
}
