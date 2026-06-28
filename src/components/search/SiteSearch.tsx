"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CornerDownLeft,
  FileText,
  HelpCircle,
  Loader2,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { mainNavigation } from "@/config/navigation";
import { NavIcon } from "@/components/NavIcon";
import type { SearchResult, SearchResultType } from "@/lib/search";

const TYPE_LABELS: Record<SearchResultType, string> = {
  page: "Pages",
  product: "Products",
  faq: "FAQ",
};

const TYPE_ORDER: SearchResultType[] = ["page", "product", "faq"];

const quickLinks = mainNavigation
  .map((item) => item.featured)
  .filter((link): link is NonNullable<typeof link> => Boolean(link));

function ResultIcon({ result }: { result: SearchResult }) {
  if (result.type === "product")
    return <ShoppingBag className="h-4 w-4" />;
  if (result.type === "faq") return <HelpCircle className="h-4 w-4" />;
  if (result.icon) return <NavIcon name={result.icon} className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
}

export function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(0);
  }, []);

  // Open with Cmd/Ctrl+K (or "/" when not typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        return;
      }
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const id = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => {
        document.body.style.overflow = "";
        window.clearTimeout(id);
      };
    }
  }, [open]);

  // Debounced fetch.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const id = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(Array.isArray(data.results) ? data.results : []);
        setActiveIndex(0);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      controller.abort();
      window.clearTimeout(id);
    };
  }, [query]);

  const groups = useMemo(() => {
    return TYPE_ORDER.map((type) => ({
      type,
      label: TYPE_LABELS[type],
      items: results.filter((r) => r.type === type),
    })).filter((g) => g.items.length > 0);
  }, [results]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const go = useCallback(
    (result: SearchResult | undefined) => {
      if (!result) return;
      close();
      if (result.external || result.href.startsWith("http")) {
        window.open(result.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(result.href);
      }
    },
    [close, router]
  );

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(flat[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const showResults = query.trim().length >= 2;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-sage-200 bg-cream-50 px-3 text-sage-500 transition-colors hover:border-forest-300 hover:text-forest-700 lg:w-56 lg:justify-start lg:px-3.5"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden text-[13px] lg:inline">Search…</span>
        <span className="ml-auto hidden items-center gap-0.5 rounded border border-sage-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-sage-400 lg:inline-flex">
          ⌘K
        </span>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-[8vh] sm:pt-[12vh]">
            <button
              type="button"
              aria-label="Close search"
              className="absolute inset-0 bg-forest-950/40 backdrop-blur-sm"
              onClick={close}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Site search"
              className="relative flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-sage-200 bg-white shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-sage-100 px-4">
                <Search className="h-5 w-5 shrink-0 text-sage-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="Search products, guides, tools…"
                  className="min-h-14 flex-1 bg-transparent text-base text-sage-800 placeholder:text-sage-400 focus:outline-none"
                  autoComplete="off"
                  spellCheck={false}
                />
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin text-sage-400" />
                )}
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="rounded-md p-1 text-sage-400 hover:bg-sage-100 hover:text-sage-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain">
                {!showResults ? (
                  <div className="p-4">
                    <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-sage-400">
                      Browse
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {quickLinks.map((link) => (
                        <button
                          key={link.href}
                          type="button"
                          onClick={() =>
                            go({
                              id: link.href,
                              type: "page",
                              title: link.label,
                              href: link.href,
                            })
                          }
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sage-700 transition-colors hover:bg-forest-50 hover:text-forest-700"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sage-100 text-sage-500">
                            <NavIcon name={link.icon} className="h-3.5 w-3.5" />
                          </span>
                          <span className="truncate text-[13px] font-medium">
                            {link.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : flat.length === 0 && !loading ? (
                  <div className="px-4 py-10 text-center">
                    <p className="text-sm text-sage-500">
                      No results for{" "}
                      <span className="font-semibold text-sage-700">
                        “{query.trim()}”
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-sage-400">
                      Try a product name, category, or topic.
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    {groups.map((group) => {
                      const startIndex = flat.findIndex(
                        (r) => r.id === group.items[0].id
                      );
                      return (
                        <div key={group.type} className="mb-1">
                          <p className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-sage-400">
                            {group.label}
                          </p>
                          {group.items.map((result, i) => {
                            const index = startIndex + i;
                            const active = index === activeIndex;
                            return (
                              <button
                                key={result.id}
                                type="button"
                                data-index={index}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => go(result)}
                                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                  active ? "bg-forest-50" : "hover:bg-sage-50"
                                }`}
                              >
                                <span
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                    active
                                      ? "bg-forest-100 text-forest-700"
                                      : "bg-sage-100 text-sage-500"
                                  }`}
                                >
                                  <ResultIcon result={result} />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-center gap-2">
                                    <span className="truncate text-sm font-medium text-sage-800">
                                      {result.title}
                                    </span>
                                    {result.category && (
                                      <span className="shrink-0 rounded bg-sage-100 px-1.5 py-0.5 text-[10px] font-medium text-sage-500">
                                        {result.category}
                                      </span>
                                    )}
                                  </span>
                                  {result.subtitle && (
                                    <span className="mt-0.5 line-clamp-1 block text-xs text-sage-500">
                                      {result.subtitle}
                                    </span>
                                  )}
                                </span>
                                <ArrowRight
                                  className={`h-4 w-4 shrink-0 ${
                                    active ? "text-forest-500" : "text-sage-300"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="hidden items-center gap-4 border-t border-sage-100 px-4 py-2 text-[11px] text-sage-400 sm:flex">
                <span className="inline-flex items-center gap-1">
                  <CornerDownLeft className="h-3 w-3" /> to select
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="rounded border border-sage-200 px-1">↑</span>
                  <span className="rounded border border-sage-200 px-1">↓</span>
                  to navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="rounded border border-sage-200 px-1">esc</span>
                  to close
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
