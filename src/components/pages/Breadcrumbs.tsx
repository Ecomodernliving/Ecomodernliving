import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type Breadcrumb = { label: string; href: string };

const crumbLinkClass =
  "inline-flex min-h-11 items-center rounded-lg px-2.5 py-2 text-xs text-sage-500 transition-colors hover:bg-sage-100 hover:text-forest-600 sm:px-3 sm:text-sm";

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex justify-center sm:mb-8">
      <ol className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-1.5">
        <li>
          <Link href="/" className={crumbLinkClass}>
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.slice(1).map((item, i, arr) => (
          <li key={`${item.href}-${item.label}`} className="flex items-center gap-0.5 sm:gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-sage-300" aria-hidden="true" />
            {i === arr.length - 1 ? (
              <span className="inline-flex min-h-11 max-w-[12rem] items-center truncate rounded-lg px-2.5 py-2 text-xs font-medium text-forest-800 sm:max-w-none sm:px-3 sm:text-sm">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className={`${crumbLinkClass} max-w-[9rem] truncate sm:max-w-none`}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
