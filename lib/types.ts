export type CreditCard = {
  id: string;
  card_name: string;
  issuer: string;
  notes: string | null;
  expiry_date?: string | null;
};

export type CashbackCategory = {
  id: string;
  card_id: string;
  category: string;
  cashback_rate: number;
  cap: string | null;
};


