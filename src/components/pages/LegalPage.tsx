import { Breadcrumbs } from "./Breadcrumbs";
import type { LegalPageContent } from "@/config/legal-content";
import { legalLinks } from "@/config/site";
import Link from "next/link";

export function LegalPage({
  content,
  breadcrumbs,
}: {
  content: LegalPageContent;
  breadcrumbs: { label: string; href: string }[];
}) {
  return (
    <>
      <section className="border-b border-sage-200/60 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 lg:px-6 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sage-400">
            Legal
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-forest-950 sm:text-4xl">
            {content.title}
          </h1>
          <p className="mt-3 text-base text-sage-600">{content.description}</p>
          <p className="mt-2 text-sm text-sage-400">
            Last updated: {content.lastUpdated}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6 lg:py-16">
        <Breadcrumbs items={breadcrumbs} />

        <article className="prose-legal mt-8 space-y-10">
          {content.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-xl font-semibold text-forest-900">
                {section.title}
              </h2>
              {section.paragraphs.map((p) => (
                <p key={p} className="mt-3 text-sm leading-relaxed text-sage-700">
                  {p}
                </p>
              ))}
              {section.list && (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-sage-700">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        <nav className="mt-12 flex flex-wrap gap-4 border-t border-sage-200 pt-8">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-forest-600 hover:text-forest-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
