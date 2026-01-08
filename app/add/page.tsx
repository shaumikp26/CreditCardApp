import Link from "next/link";
import { AddCardForm } from "@/components/AddCardForm";

export default function AddPage() {
  return (
    <div className="min-h-[100dvh] bg-white text-zinc-900">
      <main className="mx-auto w-full max-w-md px-4 pt-[calc(env(safe-area-inset-top)+20px)] pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <header className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold tracking-tight">Add a card</div>
            <div className="text-xs text-zinc-500">Admin-only (passcode required)</div>
          </div>
          <Link
            href="/"
            className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Back
          </Link>
        </header>

        <div className="mt-5">
          <AddCardForm />
        </div>
      </main>
    </div>
  );
}


