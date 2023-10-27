declare interface Note {
  id: number;
  created_at: string;
  edited_at: string;
  title: string;
  positions?: string;
  favorite: boolean;
  tags: string;
  user_id: string;
}
