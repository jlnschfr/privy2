export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string;
          created_at?: string;
          edited_at: string;
          title: string;
          items: (Markdown | Task)[];
          favorite: boolean;
          tags: Tag[];
          user_id?: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          edited_at?: string;
          title: string;
          items?: (Markdown | Task)[];
          favorite: boolean;
          tags?: Tag[];
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          edited_at?: string;
          title?: string;
          items?: (Markdown | Task)[];
          favorite?: boolean;
          tags?: Tag[];
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
