"use client";

import { useState, useMemo } from "react";
import { passiveHouseFaqs, faqCategories } from "@/config/passive-house-faq";

export function PassiveHouseFAQ() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return passiveHouseFaqs.filter((f) => {
      const matchCat = category === "All" || f.category === category;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, category]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Search FAQs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-lg border border-forest-200 px-4 py-2 text-sm focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
        >
          <option value="All">All categories</option>
          {faqCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <p className="mb-4 text-sm text-forest-600">
        Showing {filtered.length} of {passiveHouseFaqs.length} questions
      </p>
      <div className="space-y-3">
        {filtered.map((f) => (
          <details
            key={f.id}
            className="group rounded-xl border border-forest-100 bg-white p-4 shadow-sm open:ring-1 open:ring-forest-200"
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center font-medium text-forest-900 marker:content-none">
              <span className="flex items-start justify-between gap-2">
                {f.question}
                <span className="shrink-0 text-xs font-normal text-forest-500">{f.category}</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-forest-700">{f.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
