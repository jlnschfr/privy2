export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string;
          created_at?: string;
          edited_at: string;
          title: string;
          items: Item[];
          favorite: boolean;
          tags: Tag[];
          user_id?: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          edited_at?: string;
          title?: string;
          items?: Item[];
          favorite?: boolean;
          tags?: Tag[];
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          edited_at?: string;
          title?: string;
          items?: Item[];
          favorite?: boolean;
          tags?: Tag[];
          user_id?: string;
        };
      };
      rss: {
        Row: {
          id?: string;
          created_at?: string;
          user_id?: string;
          url: string;
          feed?: any;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id?: string;
          url: string;
          feed?: any;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          url: string;
          feed?: any;
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
