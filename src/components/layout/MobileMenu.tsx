"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, X, ArrowRight, Leaf } from "lucide-react";
import clsx from "clsx";
import {
  mainNavigation,
  utilityLinks,
  ctaLink,
} from "@/config/navigation";
import { NavIcon } from "@/components/NavIcon";
import { NavHref } from "@/components/NavHref";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (label: string) => {
    setExpanded((prev) => (prev === label ? null : label));
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-forest-950/40 backdrop-blur-sm animate-fade-in lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm animate-slide-in flex-col bg-white shadow-2xl lg:hidden">
        <div className="flex items-center justify-between border-b border-sage-100 px-5 py-4">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-600 text-white">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="font-display font-bold text-forest-900">
              EcoModern Living
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-sage-600 hover:bg-sage-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          <nav className="space-y-1">
            {mainNavigation.map((item) => (
              <div key={item.label}>
                {item.sections ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggle(item.label)}
                      className={clsx(
                        "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors",
                        expanded === item.label
                          ? "bg-forest-50 text-forest-800"
                          : "text-sage-800 hover:bg-sage-50"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {item.label}
                        {item.badge && (
                          <span className="rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-bold uppercase text-forest-700">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      <ChevronDown
                        className={clsx(
                          "h-4 w-4 transition-transform duration-200",
                          expanded === item.label && "rotate-180"
                        )}
                      />
                    </button>

                    {expanded === item.label && (
                      <div className="space-y-4 px-2 pb-3 pt-1">
                        {item.featured && (
                          <Link
                            href={item.featured.href}
                            onClick={onClose}
                            className="flex items-start gap-3 rounded-xl border border-forest-100 bg-gradient-to-r from-forest-50 to-sage-50 p-3"
                          >
                            {item.featured.icon && (
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest-600 text-white">
                                <NavIcon name={item.featured.icon} className="h-4 w-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-forest-800">
                                {item.featured.label}
                              </p>
                              <p className="mt-0.5 text-xs leading-relaxed text-sage-500 line-clamp-2">
                                {item.featured.description}
                              </p>
                            </div>
                          </Link>
                        )}

                        {item.sections.map((section) => (
                          <div key={section.title}>
                            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-sage-400">
                              {section.title}
                            </p>
                            <ul className="space-y-0.5">
                              {section.links.map((link) => (
                                <li key={link.href}>
                                  <NavHref
                                    href={link.href}
                                    external={link.external}
                                    onClick={onClose}
                                    className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm text-sage-700 hover:bg-forest-50 hover:text-forest-700"
                                  >
                                    {link.icon && (
                                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sage-100 text-sage-500">
                                        <NavIcon name={link.icon} className="h-3.5 w-3.5" />
                                      </div>
                                    )}
                                    <span className="font-medium">{link.label}</span>
                                  </NavHref>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href ?? "#"}
                    onClick={onClose}
                    className="block rounded-xl px-3 py-3 text-sm font-semibold text-sage-800 hover:bg-sage-50"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="my-3 border-t border-sage-100" />

            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-sage-600 hover:bg-sage-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-sage-100 p-4">
          <Link
            href={ctaLink.href}
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-forest-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg"
          >
            <NavIcon name={ctaLink.icon} className="h-4 w-4" />
            {ctaLink.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
