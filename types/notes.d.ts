declare interface Note {
  id: string;
  created_at: string;
  edited_at: string;
  title: string;
  items?: Items;
  favorite: boolean;
  tags: Tag[];
  user_id: string;
}
