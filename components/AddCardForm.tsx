"use client";

import { useMemo, useState } from "react";

type CategoryRow = {
  category: string;
  cashback_rate: string;
  cap: string;
};

export function AddCardForm() {
  const [passcode, setPasscode] = useState("");
  const [cardName, setCardName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");

  const [rows, setRows] = useState<CategoryRow[]>([
    { category: "", cashback_rate: "", cap: "" },
  ]);

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (!passcode.trim()) return false;
    if (!cardName.trim()) return false;
    if (!issuer.trim()) return false;
    if (!expiryDate.trim()) return false;
    if (rows.length === 0) return false;
    if (rows.some((r) => !r.category.trim() || !r.cashback_rate.trim()))
      return false;
    return true;
  }, [passcode, cardName, issuer, expiryDate, rows]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    setSuccessId(null);

    const payload = {
      passcode,
      card: {
        card_name: cardName.trim(),
        issuer: issuer.trim(),
        expiry_date: expiryDate.trim(),
        notes: notes.trim() ? notes.trim() : null,
      },
      categories: rows
        .map((r) => ({
          category: r.category.trim(),
          cashback_rate: Number(r.cashback_rate),
          cap: r.cap.trim() ? r.cap.trim() : null,
        }))
        .filter((r) => r.category.length > 0),
    };

    const res = await fetch("/api/admin/add-card", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => null)) as
      | { ok: true; card_id: string }
      | { ok: false; error: string }
      | null;

    if (!res.ok || !data || data.ok !== true) {
      setStatus("error");
      setError((data && "error" in data && data.error) || "Request failed.");
      return;
    }

    setStatus("success");
    setSuccessId(data.card_id);
    setCardName("");
    setIssuer("");
    setExpiryDate("");
    setNotes("");
    setRows([{ category: "", cashback_rate: "", cap: "" }]);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-900">Admin passcode</label>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/10"
          placeholder="Enter passcode"
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900">Card name</label>
          <input
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/10"
            placeholder="e.g. Amex Gold"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900">Issuer</label>
          <input
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/10"
            placeholder="e.g. American Express"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900">Expiry date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/10"
          />
          <div className="text-xs text-zinc-500">
            Stored in <code>credit_cards.expiry_date</code> (date).
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[96px] w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/10"
            placeholder="Any fine print, perks, exclusions…"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-zinc-900">
              Category percentages
            </div>
            <div className="text-xs text-zinc-500">
              Add one or more categories for this card.
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              setRows((r) => [...r, { category: "", cashback_rate: "", cap: "" }])
            }
            className="rounded-full bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800"
          >
            + Add row
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {rows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2">
              <input
                value={row.category}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((x, i) => (i === idx ? { ...x, category: e.target.value } : x))
                  )
                }
                className="col-span-6 h-11 rounded-2xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="Category (e.g. Groceries)"
              />
              <input
                inputMode="decimal"
                value={row.cashback_rate}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((x, i) =>
                      i === idx ? { ...x, cashback_rate: e.target.value } : x
                    )
                  )
                }
                className="col-span-3 h-11 rounded-2xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="%"
              />
              <input
                value={row.cap}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((x, i) => (i === idx ? { ...x, cap: e.target.value } : x))
                  )
                }
                className="col-span-3 h-11 rounded-2xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="Cap"
              />

              <div className="col-span-12 flex justify-end">
                <button
                  type="button"
                  onClick={() => setRows((r) => r.filter((_, i) => i !== idx))}
                  disabled={rows.length === 1}
                  className="rounded-full px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {status === "error" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {status === "success" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          Saved! New card id: <span className="font-mono">{successId}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit || status === "submitting"}
        className="h-12 w-full rounded-2xl bg-zinc-900 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:opacity-60"
      >
        {status === "submitting" ? "Saving…" : "Save card"}
      </button>
    </form>
  );
}


