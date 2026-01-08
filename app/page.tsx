import { CardRecommender } from "@/components/CardRecommender";
import { HomeScreenLink } from "@/components/HomeScreenLink";
import { supabaseServer } from "@/lib/supabaseServer";
import type { CashbackCategory, CreditCard } from "@/lib/types";

export const revalidate = 300;

export default async function Home() {
  const [cardsRes, cashbackRes] = await Promise.all([
    supabaseServer
      .from("credit_cards")
      .select("id, card_name, issuer, notes")
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
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto w-full max-w-md px-4 pt-[calc(env(safe-area-inset-top)+24px)] pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <CardRecommender
          cards={cards}
          cashbackCategories={cashbackCategories}
          categories={categories}
          loadError={loadError}
        />

        <footer className="mt-8 space-y-3 text-center text-xs text-zinc-500 dark:text-zinc-500">
          <div>
            <HomeScreenLink />
          </div>
          <div>Data is loaded from Supabase (public read-only).</div>
        </footer>
      </main>
    </div>
  );
}
