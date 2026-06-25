"use client";



import { Breadcrumbs } from "./Breadcrumbs";

import { PageHero, CTAButton } from "./PageHero";

import {

  SectionNav,

  HighlightList,

  FeatureGrid,

  HowItWorks,

  TimelineView,

  TipsList,

  RelatedPages,

  HubGrid,

  ContactForm,

  NewsletterForm,

  AuditForm,

  CTABanner,

  SectionHeading,

} from "./PageSections";

import { PassiveHouseCalculators } from "@/components/passive-house/Calculators";

import { PassiveHouseFAQ } from "@/components/passive-house/PassiveHouseFAQ";

import { ProductCatalog } from "@/components/marketplace/ProductCatalog";
import { countUniqueProducts } from "@/lib/marketplace-product-utils";

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



function ContentSection({

  children,

  className = "",

  id,

}: {

  children: React.ReactNode;

  className?: string;

  id?: string;

}) {

  return (

    <section

      id={id}

      className={`rounded-2xl border border-sage-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6 md:p-8 ${className}`}

    >

      {children}

    </section>

  );

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

        eyebrow={parentLabel}

        category={category}

        comingSoon={content.comingSoon}

      />



      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:px-6 lg:py-14">

        <Breadcrumbs items={breadcrumbs} />



        <SectionNav

          title={isHub ? parentLabel : sectionTitle}

          links={sidebarLinks}

          currentHref={href}

        />



        <div className="min-w-0 space-y-8">

            {isHub ? (

              <ContentSection className="!bg-white/90">

                <HubGrid sections={hubSections} category={category} />

              </ContentSection>

            ) : (

              <>

                {!content.comingSoon && content.ctaLabel && content.ctaHref && (

                  <div className="flex justify-center">

                    <CTAButton

                      label={content.ctaLabel}

                      href={content.ctaHref}

                      category={category}

                    />

                  </div>

                )}



                {content.highlights.length > 0 && (

                  <ContentSection>

                    <SectionHeading

                      title="Key Highlights"

                      subtitle="What matters most for this topic"

                    />

                    <HighlightList items={content.highlights} />

                  </ContentSection>

                )}



                {content.features.length > 0 && (

                  <ContentSection>

                    <SectionHeading

                      title="Why It Matters"

                      subtitle="Core benefits and considerations"

                    />

                    <FeatureGrid features={content.features} category={category} />

                  </ContentSection>

                )}



                {content.products && content.products.length > 0 && (

                  <ContentSection id="products">

                    <SectionHeading

                      title="Top Picks"

                      subtitle={`${countUniqueProducts(content.products)} curated products — compare prices at Amazon, Home Depot, Lowe's & more`}

                    />

                    <ProductCatalog
                      products={content.products}
                      catalogSlug={href.split("/").filter(Boolean).pop()}
                    />

                  </ContentSection>

                )}



                {content.steps && content.steps.length > 0 && (

                  <ContentSection id="get-started">

                    <SectionHeading

                      title="How It Works"

                      subtitle="A simple path from start to finish"

                    />

                    <HowItWorks steps={content.steps} category={category} />

                  </ContentSection>

                )}



                {content.timeline && content.timeline.length > 0 && (

                  <ContentSection>

                    <SectionHeading

                      title={

                        category === "passive-house"

                          ? "Certification Path"

                          : "Project Timeline"

                      }

                      subtitle="Typical milestones and phases"

                    />

                    <TimelineView items={content.timeline} />

                  </ContentSection>

                )}



                {content.tips && content.tips.length > 0 && (

                  <ContentSection>

                    <TipsList tips={content.tips} />

                  </ContentSection>

                )}



                {href === "/contact" && (

                  <ContentSection>

                    <SectionHeading

                      title="Send Us a Message"

                      subtitle="We typically respond within 1–2 business days"

                    />

                    <ContactForm />

                  </ContentSection>

                )}



                {href === "/community/newsletter" && (

                  <ContentSection className={`${accent.light} border-forest-200/40`}>

                    <SectionHeading

                      title="Subscribe to Our Newsletter"

                      subtitle="Weekly eco products, AI trends, and passive house education"

                    />

                    <NewsletterForm />

                  </ContentSection>

                )}



                {href === "/ai/energy-audit" && (

                  <ContentSection>

                    <SectionHeading

                      title="Start Your Free Audit"

                      subtitle="Enter your home details for a personalized savings estimate"

                    />

                    <AuditForm />

                  </ContentSection>

                )}



                {href === "/passive-house-calculators" && (

                  <ContentSection>

                    <SectionHeading

                      title="Passive House Calculators"

                      subtitle="Educational estimates — confirm with PHPP for certification"

                    />

                    <PassiveHouseCalculators />

                  </ContentSection>

                )}



                {href === "/passive-house-faq" && (

                  <ContentSection>

                    <SectionHeading

                      title="Frequently Asked Questions"

                      subtitle="Search 100+ answers on design, construction, and certification"

                    />

                    <PassiveHouseFAQ />

                  </ContentSection>

                )}



                {content.comingSoon && (

                  <section className="rounded-3xl border-2 border-dashed border-sage-200 bg-sage-50/60 p-10 text-center sm:p-14">

                    <p className="font-display text-xl font-semibold text-forest-900 sm:text-2xl">

                      Coming Soon

                    </p>

                    <p className="mx-auto mt-3 max-w-md text-sm text-sage-500">

                      We&apos;re building this feature. Join our newsletter to get notified at launch.

                    </p>

                    <div className="mt-8 flex justify-center">

                      <NewsletterForm />

                    </div>

                  </section>

                )}



                {siblings.length > 0 && (

                  <ContentSection>

                    <SectionHeading

                      title="Explore More"

                      subtitle={`More in ${sectionTitle}`}

                    />

                    <RelatedPages links={siblings} category={category} />

                  </ContentSection>

                )}



                <CTABanner

                  title={

                    category === "marketplace"

                      ? "Need help choosing?"

                      : category === "passive-house"

                        ? "Explore Passive House guides"

                        : "Ready to get started?"

                  }

                  description={

                    category === "marketplace"

                      ? "Try our AI Product Recommender for personalized suggestions based on your home and budget."

                      : category === "passive-house"

                        ? "Use our free calculators and FAQ to plan your energy-efficient home."

                        : "Use our free AI tools to analyze your home and discover the best sustainable upgrades."

                  }

                  ctaLabel={

                    category === "marketplace"

                      ? "Try AI Recommender"

                      : category === "passive-house"

                        ? "Try Calculators"

                        : "Free Energy Audit"

                  }

                  ctaHref={

                    category === "marketplace"

                      ? "/ai/product-recommender"

                      : category === "passive-house"

                        ? "/passive-house-calculators"

                        : "/ai/energy-audit"

                  }

                  category={category}

                />

              </>

            )}

          </div>

      </div>

    </>

  );

}

