"use client";

import { useMemo, useState } from "react";
import type { CreditCard, CashbackCategory } from "@/lib/types";

type RankedCard = {
  card: CreditCard;
  cashback: CashbackCategory;
};

function formatRate(rate: number) {
  // Display as "3%" or "3.5%" depending on precision
  const asString = Number.isInteger(rate) ? String(rate) : rate.toFixed(2);
  return `${asString.replace(/\\.00$/, "")}%`;
}

export function CardRecommender(props: {
  cards: CreditCard[];
  cashbackCategories: CashbackCategory[];
  categories: string[];
  loadError?: string | null;
}) {
  const { cards, cashbackCategories, categories, loadError } = props;

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0] ?? ""
  );

  const ranked = useMemo(() => {
    if (!selectedCategory) return [];

    const cardById = new Map(cards.map((c) => [c.id, c]));
    const matches: RankedCard[] = [];

    for (const cashback of cashbackCategories) {
      if (cashback.category !== selectedCategory) continue;
      const card = cardById.get(cashback.card_id);
      if (!card) continue;
      matches.push({ card, cashback });
    }

    matches.sort((a, b) => {
      if (b.cashback.cashback_rate !== a.cashback.cashback_rate) {
        return b.cashback.cashback_rate - a.cashback.cashback_rate;
      }
      return a.card.card_name.localeCompare(b.card.card_name);
    });

    return matches;
  }, [cards, cashbackCategories, selectedCategory]);

  const best = ranked[0] ?? null;
  const rest = ranked.slice(1);

  return (
    <section className="w-full">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-pretty text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Best card for your category
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Pick a transaction category and we’ll rank cards by cashback.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <label
          htmlFor="category"
          className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
        >
          Transaction category
        </label>
        <div className="relative">
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={categories.length === 0}
            className="h-12 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 pr-10 text-base text-zinc-900 shadow-sm outline-none ring-0 transition focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 disabled:bg-zinc-50 disabled:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:ring-zinc-50/10"
          >
            {categories.length === 0 ? (
              <option value="">No categories available</option>
            ) : null}
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-500 dark:text-zinc-400">
            ▼
          </div>
        </div>
      </div>

      {loadError ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          <div className="font-medium">Couldn’t load data from Supabase</div>
          <div className="mt-1 break-words opacity-90">{loadError}</div>
          <div className="mt-3 opacity-90">
            Check your env vars and make sure Supabase RLS allows public SELECT.
          </div>
        </div>
      ) : null}

      {!selectedCategory ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          Choose a category to see recommendations.
        </div>
      ) : null}

      {selectedCategory && ranked.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          No cards found for <span className="font-medium">{selectedCategory}</span>
          .
        </div>
      ) : null}

      {best ? (
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Best match
                </div>
                <div className="mt-1 truncate text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {best.card.card_name}
                </div>
                <div className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                  {best.card.issuer}
                </div>
              </div>

              <div className="shrink-0 rounded-xl bg-zinc-900 px-3 py-2 text-center text-white dark:bg-zinc-50 dark:text-zinc-900">
                <div className="text-xs opacity-90">Cashback</div>
                <div className="text-lg font-semibold leading-5">
                  {formatRate(best.cashback.cashback_rate)}
                </div>
              </div>
            </div>

            {best.cashback.cap ? (
              <div className="mt-4 rounded-xl bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                <span className="font-medium">Cap:</span> {best.cashback.cap}
              </div>
            ) : null}

            {best.card.notes ? (
              <div className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
                {best.card.notes}
              </div>
            ) : null}
          </div>

          {rest.length > 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Other options
              </div>
              <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-900">
                {rest.map(({ card, cashback }) => (
                  <div key={cashback.id} className="py-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {card.card_name}
                        </div>
                        <div className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                          {card.issuer}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                          {formatRate(cashback.cashback_rate)}
                        </div>
                        {cashback.cap ? (
                          <div className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                            Cap: {cashback.cap}
                          </div>
                        ) : (
                          <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
                            No cap listed
                          </div>
                        )}
                      </div>
                    </div>

                    {card.notes ? (
                      <div className="mt-2 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                        {card.notes}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}


