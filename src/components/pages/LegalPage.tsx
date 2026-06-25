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
      <section className="relative overflow-hidden border-b border-sage-200/60 bg-white/40">
        <div className="absolute inset-0 mesh-bg opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 py-14 text-center lg:px-6 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-500">
            Legal
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-forest-950 sm:text-4xl">
            {content.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-sage-600">
            {content.description}
          </p>
          <p className="mt-3 text-sm text-sage-400">
            Last updated: {content.lastUpdated}
          </p>
          <div
            className="mx-auto mt-5 h-0.5 w-10 rounded-full bg-gradient-to-r from-forest-400 to-forest-600"
            aria-hidden="true"
          />
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-6 lg:py-14">
        <Breadcrumbs items={breadcrumbs} />

        <article className="mt-4 space-y-10 rounded-2xl border border-sage-200/60 bg-white/90 p-6 shadow-sm sm:p-10">
          {content.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-center font-display text-xl font-semibold text-forest-900">
                {section.title}
              </h2>
              <div
                className="mx-auto mt-2 mb-4 h-0.5 w-8 rounded-full bg-forest-200"
                aria-hidden="true"
              />
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

        <nav className="mt-10 flex flex-wrap justify-center gap-4 border-t border-sage-200 pt-8">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-forest-600 hover:bg-forest-50 hover:text-forest-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
