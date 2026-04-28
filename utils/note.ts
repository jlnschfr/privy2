export const createEmptyNote = (): Note => ({
  user_id: "",
  id: crypto.randomUUID(),
  created_at: new Date().toISOString(),
  edited_at: new Date().toISOString(),
  title: "",
  items: [],
  favorite: true,
  tags: [],
});
