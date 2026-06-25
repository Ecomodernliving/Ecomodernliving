"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavIcon } from "@/components/NavIcon";
import type { NavIconName } from "@/config/navigation";
import type { PageCategory } from "@/lib/navigation-utils";
import { getCategoryAccent } from "@/config/page-content";

type PageHeroProps = {
  title: string;
  description: string;
  icon?: NavIconName;
  badge?: string;
  eyebrow?: string;
  category: PageCategory;
  comingSoon?: boolean;
};

export function PageHero({
  title,
  description,
  icon,
  badge,
  eyebrow,
  category,
  comingSoon,
}: PageHeroProps) {
  const accent = getCategoryAccent(category);

  return (
    <section className="relative overflow-hidden border-b border-sage-200/60 bg-white/40">
      <div className={`absolute inset-0 bg-gradient-to-b ${accent.gradient} opacity-[0.06]`} />
      <div className="absolute inset-0 mesh-bg opacity-70" />
      <div
        className="absolute left-1/2 top-0 h-64 w-[min(100%,48rem)] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background: `linear-gradient(180deg, color-mix(in srgb, var(--color-forest-300) 40%, transparent), transparent)`,
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:py-16 lg:px-6 lg:py-20">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-500">
            {eyebrow}
          </p>
        )}

        {icon && (
          <div
            className={`mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${accent.gradient} text-white shadow-lg shadow-forest-900/15 ring-4 ring-white/80 sm:h-[4.5rem] sm:w-[4.5rem]`}
          >
            <NavIcon name={icon} className="h-8 w-8 sm:h-9 sm:w-9" />
          </div>
        )}

        {(badge || comingSoon) && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {badge && (
              <span className="rounded-full bg-forest-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                {badge}
              </span>
            )}
            {comingSoon && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-800">
                Coming Soon
              </span>
            )}
          </div>
        )}

        <h1 className="mt-5 break-words font-display text-2xl font-bold tracking-tight text-forest-950 min-[400px]:text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-sage-600 sm:text-lg">
          {description}
        </p>

        <div
          className={`mx-auto mt-6 h-1 w-14 rounded-full bg-gradient-to-r ${accent.gradient} opacity-80`}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

type CTAButtonProps = {
  label: string;
  href: string;
  category: PageCategory;
};

export function CTAButton({ label, href, category }: CTAButtonProps) {
  const accent = getCategoryAccent(category);
  const className = `inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${accent.gradient} px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-forest-900/10 hover:opacity-95 hover:shadow-xl transition-all`;

  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {label}
        <ArrowRight className="h-4 w-4" />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
