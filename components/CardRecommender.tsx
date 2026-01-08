"use client";

import { useMemo } from "react";
import type { CreditCard, CashbackCategory } from "@/lib/types";
import { CreditCardTile } from "@/components/CreditCardTile";

type RankedCard = {
  card: CreditCard;
  cashback: CashbackCategory;
};

export function CardRecommender(props: {
  cards: CreditCard[];
  cashbackCategories: CashbackCategory[];
  selectedCategory: string;
  loadError?: string | null;
}) {
  const { cards, cashbackCategories, selectedCategory, loadError } = props;

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
      <div className="space-y-1">
        <div className="text-sm font-semibold text-zinc-900">Best match</div>
        <div className="text-xs text-zinc-500">
          Ranked by cashback rate for <span className="font-medium">{selectedCategory || "—"}</span>
        </div>
      </div>

      {loadError ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <div className="font-medium">Couldn’t load data from Supabase</div>
          <div className="mt-1 break-words opacity-90">{loadError}</div>
          <div className="mt-3 opacity-90">
            Check your env vars and make sure Supabase RLS allows public SELECT.
          </div>
        </div>
      ) : null}

      {!selectedCategory ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
          Choose a category to see recommendations.
        </div>
      ) : null}

      {selectedCategory && ranked.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
          No cards found for <span className="font-medium">{selectedCategory}</span>
          .
        </div>
      ) : null}

      {best ? (
        <div className="mt-6 space-y-3">
          <CreditCardTile card={best.card} cashback={best.cashback} variant="best" />

          {best.card.notes ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Notes
              </div>
              <div className="mt-2 leading-6">{best.card.notes}</div>
            </div>
          ) : null}

          {rest.length > 0 ? (
            <div className="space-y-3">
              <div className="text-sm font-semibold text-zinc-900">
                Other options
              </div>
              {rest.map(({ card, cashback }) => (
                <CreditCardTile key={cashback.id} card={card} cashback={cashback} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}


