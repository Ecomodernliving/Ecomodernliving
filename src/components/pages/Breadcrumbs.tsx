import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type Breadcrumb = { label: string; href: string };

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 text-sage-500 hover:text-forest-600 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.slice(1).map((item, i, arr) => (
          <li key={item.href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-sage-300" />
            {i === arr.length - 1 ? (
              <span className="font-medium text-forest-800">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-sage-500 hover:text-forest-600 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
