import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionPage } from "@/components/pages/SectionPage";
import {
  findPageContext,
  getAllNavLinks,
  getPageCategory,
  isHubPage,
  isLegalPage,
  getHubSections,
} from "@/lib/navigation-utils";
import { buildPageContent } from "@/config/page-content";
import { legalPages } from "@/config/legal-content";
import { LegalPage } from "@/components/pages/LegalPage";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

/** Refresh marketplace products from Google Sheet every hour */
export const revalidate = 3600;

function hrefFromSlug(slug: string[] = []): string {
  return "/" + slug.join("/");
}

export async function generateStaticParams() {
  return getAllNavLinks().map((link) => ({
    slug: link.href.split("/").filter(Boolean),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const href = hrefFromSlug(slug);
  const context = findPageContext(href);

  if (!context) {
    return { title: "Page Not Found" };
  }

  return {
    title: context.link.label,
    description: context.link.description,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const href = hrefFromSlug(slug);
  const context = findPageContext(href);

  if (!context) {
    notFound();
  }

  if (isLegalPage(href)) {
    return (
      <LegalPage
        content={legalPages[href]}
        breadcrumbs={context.breadcrumbs}
      />
    );
  }

  const category = getPageCategory(href);
  const intro =
    context.link.description ??
    `Everything you need to know about ${context.link.label.toLowerCase()} — curated guides, expert recommendations, and actionable next steps.`;
  const content = buildPageContent(
    href,
    context.link.label,
    intro,
    category,
    context.link.badge ?? context.parent.badge
  );

  const pageSlug = href.split("/").pop() ?? "";
  if (category === "marketplace" && pageSlug) {
    const { getProductsForSlug } = await import("@/lib/marketplace-catalog");
    const sheetProducts = await getProductsForSlug(pageSlug);
    if (sheetProducts.length > 0) {
      content.products = sheetProducts;
    }
  }

  return (
    <SectionPage
      href={href}
      link={context.link}
      parentLabel={context.parent.label}
      parentBadge={context.parent.badge}
      sectionTitle={context.section.title}
      sectionLinks={context.section.links}
      siblings={context.siblings}
      breadcrumbs={context.breadcrumbs}
      category={category}
      content={content}
      isHub={isHubPage(href)}
      hubSections={isHubPage(href) ? getHubSections(href) : []}
    />
  );
}
