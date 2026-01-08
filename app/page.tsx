import { HomeClient } from "@/components/HomeClient";
import { supabaseServer } from "@/lib/supabaseServer";
import type { CashbackCategory, CreditCard } from "@/lib/types";

export const revalidate = 300;

export default async function Home() {
  const [cardsRes, cashbackRes] = await Promise.all([
    supabaseServer
      .from("credit_cards")
      .select("id, card_name, issuer, notes, expiry_date")
      .order("issuer", { ascending: true })
      .order("card_name", { ascending: true }),
    supabaseServer
      .from("cashback_categories")
      .select("id, card_id, category, cashback_rate, cap")
      .order("category", { ascending: true }),
  ]);

  const loadError = cardsRes.error?.message ?? cashbackRes.error?.message ?? null;
  const cards = (cardsRes.data ?? []) as CreditCard[];
  const cashbackCategories = (cashbackRes.data ?? []) as CashbackCategory[];

  const categories = Array.from(
    new Set(
      cashbackCategories
        .map((c) => (c.category ?? "").trim())
        .filter((c) => c.length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));

  return (
    <HomeClient
      cards={cards}
      cashbackCategories={cashbackCategories}
      categories={categories}
      loadError={loadError}
    />
  );
}
