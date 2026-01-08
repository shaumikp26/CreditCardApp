export type Database = {
  public: {
    Tables: {
      credit_cards: {
        Row: {
          id: string;
          card_name: string;
          issuer: string;
          notes: string | null;
          expiry_date: string | null;
        };
        Insert: {
          id?: string;
          card_name: string;
          issuer: string;
          notes?: string | null;
          expiry_date?: string | null;
        };
        Update: {
          id?: string;
          card_name?: string;
          issuer?: string;
          notes?: string | null;
          expiry_date?: string | null;
        };
        Relationships: [];
      };
      cashback_categories: {
        Row: {
          id: string;
          card_id: string;
          category: string;
          cashback_rate: number;
          cap: string | null;
        };
        Insert: {
          id?: string;
          card_id: string;
          category: string;
          cashback_rate: number;
          cap?: string | null;
        };
        Update: {
          id?: string;
          card_id?: string;
          category?: string;
          cashback_rate?: number;
          cap?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};


