"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CashbackCategory, CreditCard } from "@/lib/types";
import { CategoryChips } from "@/components/CategoryChips";
import { CardRecommender } from "@/components/CardRecommender";
import { HomeScreenLink } from "@/components/HomeScreenLink";

export function HomeClient(props: {
  cards: CreditCard[];
  cashbackCategories: CashbackCategory[];
  categories: string[];
  loadError?: string | null;
}) {
  const { cards, cashbackCategories, categories, loadError } = props;

  const defaultCategory = useMemo(() => categories[0] ?? "", [categories]);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);

  return (
    <div className="min-h-[100dvh] bg-white text-zinc-900">
      <main className="mx-auto w-full max-w-md px-4 pt-[calc(env(safe-area-inset-top)+20px)] pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <header className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold tracking-tight">Card Cashback</div>
            <div className="text-xs text-zinc-500">
              Tap a category to see the best card
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Home
            </Link>
            <Link
              href="/add"
              className="rounded-full bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800"
            >
              Add
            </Link>
          </nav>
        </header>

        <div className="mt-5">
          <CategoryChips
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        <div className="mt-5">
          <CardRecommender
            cards={cards}
            cashbackCategories={cashbackCategories}
            selectedCategory={selectedCategory}
            loadError={loadError}
          />
        </div>

        <footer className="mt-8 space-y-3 text-center text-xs text-zinc-500">
          <div>
            <HomeScreenLink />
          </div>
          <div>Data is loaded from Supabase (public read-only).</div>
        </footer>
      </main>
    </div>
  );
}


