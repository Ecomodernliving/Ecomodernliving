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
  category: PageCategory;
  comingSoon?: boolean;
};

export function PageHero({
  title,
  description,
  icon,
  badge,
  category,
  comingSoon,
}: PageHeroProps) {
  const accent = getCategoryAccent(category);

  return (
    <section className="relative overflow-hidden border-b border-sage-200/60">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-[0.07]`} />
      <div className="absolute inset-0 mesh-bg opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 lg:px-6 lg:py-20">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            {icon && (
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent.gradient} text-white shadow-lg`}
              >
                <NavIcon name={icon} className="h-6 w-6" />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {badge && (
                <span className="rounded-full bg-forest-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  {badge}
                </span>
              )}
              {comingSoon && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-800">
                  Coming Soon
                </span>
              )}
            </div>
          </div>

          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-forest-950 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-sage-600 sm:text-xl">
            {description}
          </p>
        </div>
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

  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${accent.gradient} px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity`}
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${accent.gradient} px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity`}
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
