export async function useGetNotes() {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const { data: notes } = await useAsyncData("notes", async () => {
    const { data } = await client
      .from("notes")
      .select("id, title")
      .eq("user_id", user.value.id)
      .order("created_at");

    return data;
  });
  return { notes };
}
