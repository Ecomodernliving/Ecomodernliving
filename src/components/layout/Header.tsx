"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronDown, Leaf, Menu, ArrowRight } from "lucide-react";
import clsx from "clsx";
import {
  mainNavigation,
  utilityLinks,
  ctaLink,
  type NavItem,
} from "@/config/navigation";
import { NavIcon } from "@/components/NavIcon";
import { MobileMenu } from "./MobileMenu";
import { NavHref } from "@/components/NavHref";

function MegaMenuDropdown({
  item,
  isOpen,
  onMouseEnter,
  onMouseLeave,
}: {
  item: NavItem;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  if (!item.sections || !isOpen) return null;

  const sectionCount = item.sections.length;

  return (
    <div
      className="absolute inset-x-0 top-full z-50 hidden animate-menu-in lg:block"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="border-t border-sage-200/60 bg-white/98 shadow-xl shadow-forest-900/8 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div
            className={clsx(
              "grid gap-8",
              item.featured ? "grid-cols-[240px_1fr]" : "grid-cols-1"
            )}
          >
            {item.featured && (
              <div className="flex flex-col rounded-2xl border border-forest-100 bg-gradient-to-br from-forest-50 to-sage-50 p-5">
                {item.featured.icon && (
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-forest-600 text-white shadow-md shadow-forest-600/20">
                    <NavIcon name={item.featured.icon} className="h-5 w-5" />
                  </div>
                )}
                {item.featured.badge && (
                  <span className="mb-2 w-fit rounded-full bg-forest-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    {item.featured.badge}
                  </span>
                )}
                <Link href={item.featured.href} className="group mt-auto">
                  <h3 className="font-display text-base font-semibold leading-snug text-forest-900 group-hover:text-forest-600 transition-colors">
                    {item.featured.label}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-sage-600">
                    {item.featured.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-forest-600 group-hover:gap-2 transition-all">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            )}

            <div
              className={clsx(
                "grid gap-x-8 gap-y-6",
                sectionCount === 2 && "grid-cols-2",
                sectionCount === 3 && "grid-cols-3",
                sectionCount >= 4 && "grid-cols-2 xl:grid-cols-4"
              )}
            >
              {item.sections.map((section) => (
                <div key={section.title} className="min-w-0">
                  <h4 className="mb-3 border-b border-sage-100 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-sage-400">
                    {section.title}
                  </h4>
                  <ul className="space-y-0.5">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <NavHref
                          href={link.href}
                          external={link.external}
                          className="group flex items-start gap-2.5 rounded-lg px-2 py-2 -mx-2 hover:bg-forest-50 transition-colors"
                        >
                          {link.icon && (
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sage-100 text-sage-500 group-hover:bg-forest-100 group-hover:text-forest-700 transition-colors">
                              <NavIcon name={link.icon} className="h-3.5 w-3.5" />
                            </div>
                          )}
                          <div className="min-w-0 pt-0.5">
                            <span className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium leading-tight text-sage-800 group-hover:text-forest-700">
                              {link.label}
                              {link.badge && (
                                <span className="rounded bg-amber-100 px-1 py-px text-[9px] font-bold uppercase text-amber-700">
                                  {link.badge}
                                </span>
                              )}
                            </span>
                            {link.description && (
                              <p className="mt-0.5 text-[11px] leading-snug text-sage-500 line-clamp-2">
                                {link.description}
                              </p>
                            )}
                          </div>
                        </NavHref>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeItem = mainNavigation.find((item) => item.label === activeMenu);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openMenu = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled || activeMenu
            ? "glass-nav shadow-sm"
            : "bg-cream-50/90 backdrop-blur-sm"
        )}
        onMouseLeave={scheduleClose}
      >
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <div className="flex h-16 items-center gap-6 lg:h-[4.25rem]">
            <Link href="/" className="group flex shrink-0 items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-forest-600 to-forest-700 text-white shadow-md shadow-forest-600/25 transition-shadow group-hover:shadow-lg">
                <Leaf className="h-5 w-5" />
              </div>
              <div className="hidden sm:block leading-none">
                <span className="font-display text-[17px] font-bold tracking-tight text-forest-900">
                  EcoModern
                </span>
                <span className="font-display text-[17px] font-light text-sage-500">
                  {" "}
                  Living
                </span>
              </div>
            </Link>

            <nav className="hidden flex-1 items-center justify-center lg:flex">
              <ul className="flex items-center">
                {mainNavigation.map((item) => (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => {
                      cancelClose();
                      if (item.sections) openMenu(item.label);
                      else setActiveMenu(null);
                    }}
                  >
                    {item.sections ? (
                      <button
                        type="button"
                        className={clsx(
                          "flex h-10 items-center gap-1 whitespace-nowrap rounded-lg px-2.5 xl:px-3 text-[13px] font-medium transition-colors",
                          activeMenu === item.label
                            ? "bg-forest-50 text-forest-700"
                            : "text-sage-700 hover:bg-sage-100/70 hover:text-forest-700"
                        )}
                        aria-expanded={activeMenu === item.label}
                        aria-haspopup="true"
                      >
                        {item.label}
                        {item.badge && (
                          <span className="rounded bg-forest-100 px-1 py-px text-[8px] font-bold uppercase tracking-wide text-forest-700">
                            {item.badge}
                          </span>
                        )}
                        <ChevronDown
                          className={clsx(
                            "h-3 w-3 shrink-0 opacity-60 transition-transform duration-200",
                            activeMenu === item.label && "rotate-180"
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href ?? "#"}
                        className="flex h-10 items-center whitespace-nowrap rounded-lg px-2.5 xl:px-3 text-[13px] font-medium text-sage-700 hover:bg-sage-100/70 hover:text-forest-700 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
              <div className="hidden items-center gap-1 md:flex">
                {utilityLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-2.5 py-2 text-[13px] font-medium text-sage-500 hover:text-forest-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <Link
                href={ctaLink.href}
                className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-full bg-forest-600 px-4 text-[13px] font-semibold text-white shadow-md shadow-forest-600/20 hover:bg-forest-700 transition-colors"
              >
                <NavIcon name={ctaLink.icon} className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">{ctaLink.label}</span>
                <span className="xl:hidden">Energy Audit</span>
              </Link>

              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sage-700 hover:bg-sage-100 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {activeItem?.sections && (
            <MegaMenuDropdown
              item={activeItem}
              isOpen={!!activeMenu}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            />
          )}
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
