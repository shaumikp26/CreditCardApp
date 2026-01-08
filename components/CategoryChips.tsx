"use client";

import clsx from "clsx";

function Icon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
      {children}
    </span>
  );
}

function CategoryIcon({ category }: { category: string }) {
  const c = category.toLowerCase();

  if (c.includes("groc")) {
    return <Icon>🛒</Icon>;
  }
  if (c.includes("dining") || c.includes("restaurant") || c.includes("food")) {
    return <Icon>🍽️</Icon>;
  }
  if (c.includes("gas") || c.includes("fuel")) {
    return <Icon>⛽</Icon>;
  }
  if (c.includes("travel") || c.includes("air") || c.includes("hotel")) {
    return <Icon>✈️</Icon>;
  }
  if (c.includes("online") || c.includes("shopping")) {
    return <Icon>🛍️</Icon>;
  }
  if (c.includes("bill") || c.includes("utility")) {
    return <Icon>🧾</Icon>;
  }
  if (c.includes("transit") || c.includes("train") || c.includes("metro")) {
    return <Icon>🚆</Icon>;
  }
  if (c.includes("entertain") || c.includes("stream")) {
    return <Icon>🎬</Icon>;
  }

  return <Icon>🏷️</Icon>;
}

export function CategoryChips(props: {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}) {
  const { categories, selectedCategory, onSelect } = props;

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
        No categories available yet. Add a few rows to <code>cashback_categories</code>{" "}
        to populate this list.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
        {categories.map((category) => {
          const active = category === selectedCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className={clsx(
                "flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium shadow-sm transition",
                active
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
              )}
            >
              <CategoryIcon category={category} />
              <span className="max-w-[10.5rem] truncate">{category}</span>
            </button>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}


