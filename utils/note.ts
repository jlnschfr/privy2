import { v4 as uuid } from "uuid";

export const createEmptyNote = (): Note => ({
  user_id: "",
  id: uuid(),
  created_at: new Date().toISOString(),
  edited_at: new Date().toISOString(),
  title: "",
  items: [],
  favorite: true,
  tags: [],
});
