import Link from "next/link";
import { mainNavigation, utilityLinks } from "@/config/navigation";
import { legalLinks, siteConfig } from "@/config/site";
import type { NavItem } from "@/config/navigation";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Logo } from "@/components/layout/Logo";

function getNavHref(item: NavItem): string {
  return (
    item.featured?.href ??
    item.href ??
    item.sections?.[0]?.links[0]?.href ??
    "/"
  );
}

const primaryLegalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
] as const;

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-9 items-center text-sm text-sage-400 transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}

function Dot() {
  return (
    <span className="select-none px-1.5 text-sage-700" aria-hidden="true">
      ·
    </span>
  );
}

export function Footer() {
  const secondaryLegalLinks = legalLinks.filter(
    (link) => !primaryLegalLinks.some((p) => p.href === link.href)
  );

  const bottomLinks = [
    ...primaryLegalLinks,
    ...secondaryLegalLinks,
    ...utilityLinks,
  ];

  return (
    <footer className="border-t border-forest-800/60 bg-forest-950 pb-safe text-sage-300">
      <div className="mx-auto max-w-3xl px-4 py-8 text-center sm:py-10">
        {/* Brand */}
        <Link
          href="/"
          className="group inline-flex items-center justify-center"
          aria-label="EcoModern Living home"
        >
          <Logo theme="dark" />
        </Link>

        <p className="mt-2.5 whitespace-nowrap text-[11px] text-sage-500 sm:text-sm">
          Sustainable living, curated eco products & passive house education.
        </p>

        {/* Social */}
        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-sage-600">
          Follow us
        </p>
        <div className="mt-2.5 flex justify-center">
          <SocialLinks />
        </div>

        {/* Explore */}
        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest-400">
          Explore
        </p>
        <nav
          aria-label="Footer navigation"
          className="mx-auto mt-3 flex max-w-2xl flex-wrap items-center justify-center gap-x-1 gap-y-1"
        >
          {mainNavigation.map((item, index) => {
            if (index === mainNavigation.length - 1) return null;

            if (index === mainNavigation.length - 2) {
              const services = item;
              const community = mainNavigation[index + 1];
              return (
                <span
                  key="services-community"
                  className="inline-flex items-center whitespace-nowrap"
                >
                  {index > 0 && <Dot />}
                  <FooterLink href={getNavHref(services)}>
                    {services.label}
                  </FooterLink>
                  <Dot />
                  <FooterLink href={getNavHref(community)}>
                    {community.label}
                  </FooterLink>
                </span>
              );
            }

            return (
              <span key={item.label} className="inline-flex items-center">
                {index > 0 && <Dot />}
                <FooterLink href={getNavHref(item)}>{item.label}</FooterLink>
              </span>
            );
          })}
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-forest-800/60 bg-forest-950/80 px-4 py-5 text-center">
        <p className="text-xs text-sage-500">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-sage-400">{siteConfig.name}</span>. All
          rights reserved.
        </p>

        <nav
          aria-label="Legal and site links"
          className="mx-auto mt-3 flex max-w-2xl flex-wrap items-center justify-center"
        >
          {bottomLinks.map((link, index) => {
            if (index === bottomLinks.length - 1) return null;

            if (index === bottomLinks.length - 2) {
              const about = link;
              const contact = bottomLinks[index + 1];
              return (
                <span
                  key="about-contact"
                  className="inline-flex items-center whitespace-nowrap"
                >
                  {index > 0 && <Dot />}
                  <Link
                    href={about.href}
                    className="inline-flex min-h-9 items-center px-0.5 text-xs text-sage-500 transition-colors hover:text-sage-300 sm:text-sm"
                  >
                    {about.label}
                  </Link>
                  <Dot />
                  <Link
                    href={contact.href}
                    className="inline-flex min-h-9 items-center px-0.5 text-xs text-sage-500 transition-colors hover:text-sage-300 sm:text-sm"
                  >
                    {contact.label}
                  </Link>
                </span>
              );
            }

            return (
              <span key={link.href} className="inline-flex items-center">
                {index > 0 && <Dot />}
                <Link
                  href={link.href}
                  className="inline-flex min-h-9 items-center px-0.5 text-xs text-sage-500 transition-colors hover:text-sage-300 sm:text-sm"
                >
                  {link.label}
                </Link>
              </span>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
