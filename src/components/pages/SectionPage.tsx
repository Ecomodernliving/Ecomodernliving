"use client";

import { Breadcrumbs } from "./Breadcrumbs";
import { PageHero, CTAButton } from "./PageHero";
import {
  SidebarNav,
  HighlightList,
  FeatureGrid,
  ProductGrid,
  HowItWorks,
  TimelineView,
  TipsList,
  RelatedPages,
  HubGrid,
  ContactForm,
  NewsletterForm,
  AuditForm,
  CTABanner,
} from "./PageSections";
import type { PageCategory } from "@/lib/navigation-utils";
import type { PageContent } from "@/config/page-content";
import { getCategoryAccent } from "@/config/page-content";
import type { NavLink, NavSection } from "@/config/navigation";

export type SectionPageProps = {
  href: string;
  link: NavLink;
  parentLabel: string;
  parentBadge?: string;
  sectionTitle: string;
  sectionLinks: NavLink[];
  siblings: NavLink[];
  breadcrumbs: { label: string; href: string }[];
  category: PageCategory;
  content: PageContent;
  isHub: boolean;
  hubSections: NavSection[];
};

function getAllSectionLinks(sections: NavSection[]): NavLink[] {
  return sections.flatMap((s) => s.links);
}

export function SectionPage({
  href,
  link,
  parentLabel,
  parentBadge,
  sectionTitle,
  sectionLinks,
  siblings,
  breadcrumbs,
  category,
  content,
  isHub,
  hubSections,
}: SectionPageProps) {
  const accent = getCategoryAccent(category);
  const sidebarLinks = isHub ? getAllSectionLinks(hubSections) : sectionLinks;

  return (
    <>
      <PageHero
        title={link.label}
        description={content.intro}
        icon={link.icon}
        badge={link.badge ?? parentBadge}
        category={category}
        comingSoon={content.comingSoon}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          <SidebarNav
            title={isHub ? parentLabel : sectionTitle}
            links={sidebarLinks}
            currentHref={href}
          />

          <div className="min-w-0 space-y-12">
            {isHub ? (
              <HubGrid sections={hubSections} category={category} />
            ) : (
              <>
                {!content.comingSoon && content.ctaLabel && content.ctaHref && (
                  <div>
                    <CTAButton
                      label={content.ctaLabel}
                      href={content.ctaHref}
                      category={category}
                    />
                  </div>
                )}

                {content.highlights.length > 0 && (
                  <section>
                    <h2 className="mb-4 font-display text-xl font-semibold text-forest-900">
                      Key Highlights
                    </h2>
                    <HighlightList items={content.highlights} />
                  </section>
                )}

                {content.features.length > 0 && (
                  <section>
                    <h2 className="mb-4 font-display text-xl font-semibold text-forest-900">
                      Why It Matters
                    </h2>
                    <FeatureGrid features={content.features} category={category} />
                  </section>
                )}

                {content.products && content.products.length > 0 && (
                  <section>
                    <h2 className="mb-4 font-display text-xl font-semibold text-forest-900">
                      Top Picks
                    </h2>
                    <ProductGrid products={content.products} />
                  </section>
                )}

                {content.steps && content.steps.length > 0 && (
                  <section>
                    <h2 className="mb-4 font-display text-xl font-semibold text-forest-900">
                      How It Works
                    </h2>
                    <HowItWorks steps={content.steps} category={category} />
                  </section>
                )}

                {content.timeline && content.timeline.length > 0 && (
                  <section>
                    <h2 className="mb-4 font-display text-xl font-semibold text-forest-900">
                      {category === "passive-house" ? "Build Timeline" : "Project Timeline"}
                    </h2>
                    <TimelineView items={content.timeline} />
                  </section>
                )}

                {content.tips && content.tips.length > 0 && (
                  <section>
                    <TipsList tips={content.tips} />
                  </section>
                )}

                {href === "/contact" && <ContactForm />}
                {href === "/community/newsletter" && (
                  <section className={`rounded-2xl ${accent.light} p-8`}>
                    <h2 className="font-display text-xl font-semibold text-forest-900">
                      Subscribe to our newsletter
                    </h2>
                    <p className="mt-2 text-sm text-sage-600">
                      Weekly eco products, AI trends, and passive house updates.
                    </p>
                    <div className="mt-5">
                      <NewsletterForm />
                    </div>
                  </section>
                )}
                {href === "/ai/energy-audit" && (
                  <section>
                    <h2 className="mb-4 font-display text-xl font-semibold text-forest-900">
                      Start Your Free Audit
                    </h2>
                    <AuditForm />
                  </section>
                )}

                {content.comingSoon && (
                  <section className="rounded-2xl border-2 border-dashed border-sage-200 bg-sage-50/50 p-10 text-center">
                    <p className="font-display text-lg font-semibold text-forest-900">
                      Coming Soon
                    </p>
                    <p className="mt-2 text-sm text-sage-500">
                      We&apos;re building this feature. Join our newsletter to get notified at launch.
                    </p>
                    <div className="mt-6 flex justify-center">
                      <NewsletterForm />
                    </div>
                  </section>
                )}

                {siblings.length > 0 && (
                  <section>
                    <h2 className="mb-4 font-display text-xl font-semibold text-forest-900">
                      Explore More
                    </h2>
                    <RelatedPages links={siblings} category={category} />
                  </section>
                )}

                <CTABanner
                  title={
                    category === "marketplace"
                      ? "Need help choosing?"
                      : category === "passive-house"
                        ? "Follow our build journey"
                        : "Ready to get started?"
                  }
                  description={
                    category === "marketplace"
                      ? "Try our AI Product Recommender for personalized suggestions based on your home and budget."
                      : category === "passive-house"
                        ? "Subscribe for weekly build journal updates, photos, and lessons learned."
                        : "Use our free AI tools to analyze your home and discover the best sustainable upgrades."
                  }
                  ctaLabel={
                    category === "marketplace"
                      ? "Try AI Recommender"
                      : category === "passive-house"
                        ? "Read Build Journal"
                        : "Free Energy Audit"
                  }
                  ctaHref={
                    category === "marketplace"
                      ? "/ai/product-recommender"
                      : category === "passive-house"
                        ? "/passive-house/journal"
                        : "/ai/energy-audit"
                  }
                  category={category}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
