"use client";

import clsx from "clsx";
import type { CashbackCategory, CreditCard } from "@/lib/types";

function fnv1a(str: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function fakeCardNumberFromId(id: string) {
  // Deterministic 16 digits without BigInt (works with TS targets < ES2020)
  const seed = fnv1a(id.replace(/-/g, ""));
  let x = seed || 1;

  const digits: string[] = [];
  for (let i = 0; i < 16; i++) {
    // LCG: x_{n+1} = (a*x + c) mod 2^32
    x = (Math.imul(1664525, x) + 1013904223) >>> 0;
    digits.push(String(x % 10));
  }

  return digits.join("").replace(/(\\d{4})(?=\\d)/g, "$1 ");
}

function issuerTheme(issuer: string) {
  const i = issuer.toLowerCase();
  if (i.includes("amex") || i.includes("american express")) {
    return "from-sky-500 via-cyan-500 to-slate-900";
  }
  if (i.includes("chase")) {
    return "from-slate-900 via-indigo-900 to-sky-700";
  }
  if (i.includes("citi")) {
    return "from-slate-900 via-blue-700 to-red-500";
  }
  if (i.includes("capital")) {
    return "from-slate-900 via-sky-700 to-red-500";
  }
  if (i.includes("discover")) {
    return "from-zinc-900 via-orange-500 to-yellow-400";
  }
  return "from-zinc-900 via-zinc-700 to-zinc-900";
}

function formatExpiry(expiry?: string | null) {
  if (!expiry) return "—";
  // Supabase date typically comes as YYYY-MM-DD
  const m = expiry.match(/^(\d{4})-(\d{2})-/);
  if (!m) return expiry;
  return `${m[2]}/${m[1].slice(2)}`;
}

function formatRate(rate: number) {
  const asString = Number.isInteger(rate) ? String(rate) : rate.toFixed(2);
  return `${asString.replace(/\\.00$/, "")}%`;
}

export function CreditCardTile(props: {
  card: CreditCard;
  cashback: CashbackCategory;
  variant?: "best" | "normal";
}) {
  const { card, cashback, variant = "normal" } = props;
  const number = fakeCardNumberFromId(card.id);

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-3xl p-4 text-white shadow-sm",
        "bg-gradient-to-br",
        issuerTheme(card.issuer),
        variant === "best" ? "ring-2 ring-zinc-900/30" : "ring-1 ring-white/10"
      )}
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/30 blur-2xl" />
        <div className="absolute -left-24 -bottom-24 h-56 w-56 rounded-full bg-black/40 blur-2xl" />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold">{card.card_name}</div>
            <div className="mt-0.5 text-xs text-white/80">{card.issuer}</div>
          </div>

          <div className="shrink-0 rounded-2xl bg-white/15 px-3 py-2 text-right backdrop-blur">
            <div className="text-[10px] uppercase tracking-wide text-white/70">
              Cashback
            </div>
            <div className="text-lg font-semibold leading-5">
              {formatRate(cashback.cashback_rate)}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="h-8 w-12 rounded-lg bg-white/20" />
          <div className="text-xs text-white/70">{cashback.category}</div>
        </div>

        <div className="mt-4 font-mono text-sm tracking-[0.18em]">{number}</div>

        <div className="mt-3 flex items-end justify-between text-[11px] text-white/80">
          <div className="space-y-0.5">
            <div className="text-[10px] uppercase tracking-wide text-white/60">
              Exp
            </div>
            <div>{formatExpiry(card.expiry_date)}</div>
          </div>

          <div className="text-right">
            {cashback.cap ? (
              <div className="max-w-[14rem] text-[11px] text-white/80">
                Cap: {cashback.cap}
              </div>
            ) : (
              <div className="text-[11px] text-white/60">No cap listed</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


