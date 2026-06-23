import Link from "next/link";
import { Leaf, Mail, Youtube, Instagram } from "lucide-react";
import { mainNavigation, utilityLinks } from "@/config/navigation";
import { legalLinks, siteConfig } from "@/config/site";
import { NavHref } from "@/components/NavHref";

export function Footer() {
  return (
    <footer className="border-t border-sage-200/60 bg-forest-950 text-sage-300">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-600 text-white">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-bold text-white">
                EcoModern Living
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sage-400">
              AI-powered sustainable living — eco products, passive house
              education, and tools to build a greener home.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <NavHref
                href={siteConfig.social.youtube}
                external
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-900 text-sage-400 hover:bg-forest-800 hover:text-white transition-colors"
              >
                <Youtube className="h-4 w-4" />
                <span className="sr-only">YouTube</span>
              </NavHref>
              <NavHref
                href={siteConfig.social.instagram}
                external
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-900 text-sage-400 hover:bg-forest-800 hover:text-white transition-colors"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </NavHref>
              <NavHref
                href={siteConfig.social.pinterest}
                external
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-900 text-sage-400 hover:bg-forest-800 hover:text-white transition-colors"
              >
                <span className="text-xs font-bold">P</span>
                <span className="sr-only">Pinterest</span>
              </NavHref>
            </div>
          </div>

          {mainNavigation.slice(0, 3).map((item) => (
            <div key={item.label}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-sage-200">
                {item.label}
              </h3>
              <ul className="mt-4 space-y-2">
                {item.sections?.flatMap((s) => s.links.slice(0, 3)).map((link) => (
                  <li key={link.href}>
                    <NavHref
                      href={link.href}
                      external={link.external}
                      className="text-sm text-sage-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </NavHref>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-sage-800 pt-8 sm:flex-row">
          <p className="text-sm text-sage-500">
            © {new Date().getFullYear()} EcoModern Living. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-sage-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-sage-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/community/newsletter"
              className="inline-flex items-center gap-1.5 text-sm text-forest-400 hover:text-forest-300 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Newsletter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
