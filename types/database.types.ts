export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: number;
          created_at?: string;
          title: string;
          positions?: string;
          favorite: boolean;
          tags: string;
          user_id?: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          title: string;
          positions?: string;
          favorite: boolean;
          tags?: string;
          user_id: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          title?: string;
          positions?: string;
          favorite?: boolean;
          tags?: string;
          user_id?: string;
        };
      };
      tasks: {
        Row: {
          id: number;
          created_at: string;
          title: string;
          completed: boolean;
          user_id: string;
          note_id: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          title?: string;
          completed?: boolean;
          user_id: string;
          note_id?: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          completed?: boolean;
          title?: string;
          user_id?: string;
          note_id?: string;
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
