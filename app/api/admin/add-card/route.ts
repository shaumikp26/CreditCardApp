import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Body = {
  passcode?: string;
  card?: {
    card_name?: string;
    issuer?: string;
    expiry_date?: string; // YYYY-MM-DD
    notes?: string | null;
  };
  categories?: Array<{
    category?: string;
    cashback_rate?: number;
    cap?: string | null;
  }>;
};

export async function POST(req: Request) {
  const adminPasscode = process.env.ADMIN_PASSCODE;
  if (!adminPasscode) {
    return NextResponse.json(
      { ok: false, error: "Server misconfigured: ADMIN_PASSCODE missing." },
      { status: 500 }
    );
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server misconfigured." },
      { status: 500 }
    );
  }

  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  if ((body.passcode ?? "") !== adminPasscode) {
    return NextResponse.json({ ok: false, error: "Invalid passcode." }, { status: 401 });
  }

  const card_name = (body.card?.card_name ?? "").trim();
  const issuer = (body.card?.issuer ?? "").trim();
  const expiry_date = (body.card?.expiry_date ?? "").trim();
  const notes = body.card?.notes ?? null;

  if (!card_name) {
    return NextResponse.json({ ok: false, error: "card_name is required." }, { status: 400 });
  }
  if (!issuer) {
    return NextResponse.json({ ok: false, error: "issuer is required." }, { status: 400 });
  }
  if (!expiry_date) {
    return NextResponse.json({ ok: false, error: "expiry_date is required." }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expiry_date)) {
    return NextResponse.json(
      { ok: false, error: "expiry_date must be YYYY-MM-DD." },
      { status: 400 }
    );
  }

  const categoriesRaw = Array.isArray(body.categories) ? body.categories : [];
  const categories = categoriesRaw
    .map((c) => ({
      category: (c.category ?? "").trim(),
      cashback_rate: Number(c.cashback_rate),
      cap: c.cap ?? null,
    }))
    .filter((c) => c.category.length > 0);

  if (categories.length === 0) {
    return NextResponse.json(
      { ok: false, error: "At least one category row is required." },
      { status: 400 }
    );
  }
  if (categories.some((c) => Number.isNaN(c.cashback_rate))) {
    return NextResponse.json(
      { ok: false, error: "cashback_rate must be a number." },
      { status: 400 }
    );
  }

  const insertedCard = await supabaseAdmin
    .from("credit_cards")
    .insert({
      card_name,
      issuer,
      expiry_date,
      notes,
    })
    .select("id")
    .single();

  if (insertedCard.error || !insertedCard.data) {
    return NextResponse.json(
      { ok: false, error: insertedCard.error?.message ?? "Failed to insert card." },
      { status: 500 }
    );
  }

  const card_id = insertedCard.data.id as string;

  const insertedCategories = await supabaseAdmin.from("cashback_categories").insert(
    categories.map((c) => ({
      card_id,
      category: c.category,
      cashback_rate: c.cashback_rate,
      cap: c.cap,
    }))
  );

  if (insertedCategories.error) {
    return NextResponse.json(
      { ok: false, error: insertedCategories.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, card_id });
}


