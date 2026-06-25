import {
  mainNavigation,
  utilityLinks,
  type NavItem,
  type NavLink,
  type NavSection,
} from "@/config/navigation";
import { legalLinks } from "@/config/site";
import { legalPages } from "@/config/legal-content";

export type PageContext = {
  href: string;
  link: NavLink;
  parent: NavItem;
  section: NavSection;
  siblings: NavLink[];
  breadcrumbs: { label: string; href: string }[];
};

export function getAllNavLinks(): NavLink[] {
  const seen = new Set<string>();
  const links: NavLink[] = [];

  const add = (link: NavLink) => {
    if (link.external || link.href.startsWith("http")) return;
    if (!seen.has(link.href)) {
      seen.add(link.href);
      links.push(link);
    }
  };

  utilityLinks.forEach(add);
  legalLinks.forEach((link) => add({ ...link }));

  for (const item of mainNavigation) {
    if (item.featured) add(item.featured);
    item.sections?.forEach((section) => {
      section.links.forEach(add);
    });
  }

  return links;
}

export function findPageContext(href: string): PageContext | null {
  for (const parent of mainNavigation) {
    if (parent.featured?.href === href) {
      const allLinks = parent.sections?.flatMap((s) => s.links) ?? [];
      return {
        href,
        link: parent.featured,
        parent,
        section: { title: parent.label, links: allLinks },
        siblings: allLinks,
        breadcrumbs: [
          { label: "Home", href: "/" },
          { label: parent.label, href: parent.featured.href },
        ],
      };
    }

    for (const section of parent.sections ?? []) {
      const match = section.links.find((l) => l.href === href);
      if (match) {
        const parentHref =
          parent.featured?.href ?? section.links[0]?.href ?? "/";
        const breadcrumbs: { label: string; href: string }[] = [
          { label: "Home", href: "/" },
        ];
        if (parent.featured || parentHref !== href) {
          breadcrumbs.push({ label: parent.label, href: parentHref });
        }
        breadcrumbs.push({ label: match.label, href: match.href });

        return {
          href,
          link: match,
          parent,
          section,
          siblings: section.links.filter((l) => l.href !== href),
          breadcrumbs,
        };
      }
    }
  }

  const utility = utilityLinks.find((l) => l.href === href);
  if (utility) {
    return {
      href,
      link: utility,
      parent: { label: utility.label },
      section: { title: utility.label, links: [] },
      siblings: utilityLinks.filter((l) => l.href !== href),
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: utility.label, href: utility.href },
      ],
    };
  }

  const legal = legalLinks.find((l) => l.href === href);
  if (legal && legalPages[href]) {
    return {
      href,
      link: { label: legal.label, href: legal.href, description: legalPages[href].description },
      parent: { label: "Legal" },
      section: { title: "Legal", links: legalLinks.map((l) => ({ label: l.label, href: l.href })) },
      siblings: legalLinks.filter((l) => l.href !== href).map((l) => ({ label: l.label, href: l.href })),
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: legal.label, href: legal.href },
      ],
    };
  }

  return null;
}

export function isLegalPage(href: string): boolean {
  return href in legalPages;
}

export function isHubPage(href: string): boolean {
  return mainNavigation.some((item) => item.featured?.href === href);
}

export function getHubSections(href: string): NavSection[] {
  const item = mainNavigation.find((i) => i.featured?.href === href);
  return item?.sections ?? [];
}

export type PageCategory =
  | "marketplace"
  | "ai"
  | "guides"
  | "passive-house"
  | "services"
  | "community"
  | "utility";

export function getPageCategory(href: string): PageCategory {
  if (href.startsWith("/marketplace") || href === "/store") return "marketplace";
  if (href.startsWith("/ai")) return "ai";
  if (href.startsWith("/guides")) return "guides";
  if (href.startsWith("/passive-house")) return "passive-house";
  if (href.startsWith("/services")) return "services";
  if (href.startsWith("/community") || href === "/eco-homes") return "community";
  if (href in legalPages) return "utility";
  return "utility";
}
