"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { NavIcon } from "@/components/NavIcon";
import { NavHref } from "@/components/NavHref";
import type { NavLink } from "@/config/navigation";
import type { PageCategory } from "@/lib/navigation-utils";
import { getCategoryAccent } from "@/config/page-content";
import { amazonAffiliateUrl, affiliateRel } from "@/lib/affiliate";
import { submitToFormspree } from "@/lib/formspree";

export function SidebarNav({
  title,
  links,
  currentHref,
}: {
  title: string;
  links: NavLink[];
  currentHref: string;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-2xl border border-sage-200/80 bg-white p-5 shadow-sm">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sage-400">
          {title}
        </h3>
        <ul className="mt-3 space-y-0.5">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                  link.href === currentHref
                    ? "bg-forest-50 font-semibold text-forest-700"
                    : "text-sage-600 hover:bg-sage-50 hover:text-forest-700"
                }`}
              >
                {link.icon && (
                  <NavIcon name={link.icon} className="h-4 w-4 shrink-0 opacity-70" />
                )}
                <span className="leading-tight">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function HighlightList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 rounded-xl border border-sage-200/80 bg-white p-4 shadow-sm"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-forest-500" />
          <span className="text-sm leading-relaxed text-sage-700">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function FeatureGrid({
  features,
  category,
}: {
  features: { title: string; description: string }[];
  category: PageCategory;
}) {
  const accent = getCategoryAccent(category);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {features.map((feature, i) => (
        <div
          key={feature.title}
          className="group rounded-2xl border border-sage-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent.light} ${accent.text} text-sm font-bold`}
          >
            {i + 1}
          </div>
          <h3 className="mt-3 font-display text-base font-semibold text-forest-900">
            {feature.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-sage-500">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ProductGrid({
  products,
}: {
  products: {
    name: string;
    description: string;
    tag?: string;
    priceRange?: string;
    amazonQuery?: string;
    amazonAsin?: string;
  }[];
}) {
  return (
    <div id="products" className="grid gap-4 sm:grid-cols-2">
      {products.map((product) => {
        const affiliateUrl = amazonAffiliateUrl(
          product.amazonQuery ?? product.name,
          product.amazonAsin
        );

        return (
        <div
          key={product.name}
          className="group relative overflow-hidden rounded-2xl border border-sage-200/80 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {product.tag && (
                <span className="inline-block rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-bold uppercase text-forest-700">
                  {product.tag}
                </span>
              )}
              <h3 className="mt-2 font-display text-base font-semibold text-forest-900 group-hover:text-forest-600 transition-colors">
                {product.name}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-sage-500">
                {product.description}
              </p>
            </div>
            {product.priceRange && (
              <span className="shrink-0 rounded-lg bg-sage-100 px-2 py-1 text-xs font-semibold text-sage-600">
                {product.priceRange}
              </span>
            )}
          </div>
          <a
            href={affiliateUrl}
            target="_blank"
            rel={affiliateRel}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-forest-600 hover:gap-2 transition-all"
          >
            View on Amazon
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        );
      })}
      <p className="sm:col-span-2 mt-2 text-xs text-sage-500">
        As an Amazon Associate we earn from qualifying purchases.{" "}
        <Link href="/affiliate-disclosure" className="font-medium text-forest-600 hover:underline">
          Affiliate Disclosure
        </Link>
      </p>
    </div>
  );
}

export function HowItWorks({
  steps,
  category,
}: {
  steps: { step: number; title: string; description: string }[];
  category: PageCategory;
}) {
  const accent = getCategoryAccent(category);

  return (
    <div id="get-started" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step) => (
        <div key={step.step} className="relative rounded-2xl border border-sage-200/80 bg-white p-5">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${accent.gradient} text-sm font-bold text-white shadow-md`}
          >
            {step.step}
          </div>
          <h3 className="mt-4 font-display text-sm font-semibold text-forest-900">
            {step.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-sage-500">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export function TimelineView({
  items,
}: {
  items: { title: string; status: "complete" | "in-progress" | "planned"; date?: string; description: string }[];
}) {
  const statusStyles = {
    complete: "bg-forest-500 border-forest-500",
    "in-progress": "bg-amber-400 border-amber-400 animate-pulse",
    planned: "bg-sage-200 border-sage-300",
  };

  const statusLabels = {
    complete: "Complete",
    "in-progress": "In Progress",
    planned: "Planned",
  };

  return (
    <div className="space-y-0">
      {items.map((item, i) => (
        <div key={item.title} className="relative flex gap-5 pb-8 last:pb-0">
          {i < items.length - 1 && (
            <div className="absolute left-[11px] top-6 bottom-0 w-px bg-sage-200" />
          )}
          <div
            className={`relative z-10 mt-1.5 h-[22px] w-[22px] shrink-0 rounded-full border-2 ${statusStyles[item.status]}`}
          />
          <div className="min-w-0 flex-1 rounded-xl border border-sage-200/80 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-sm font-semibold text-forest-900">
                {item.title}
              </h3>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  item.status === "complete"
                    ? "bg-forest-100 text-forest-700"
                    : item.status === "in-progress"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-sage-100 text-sage-600"
                }`}
              >
                {statusLabels[item.status]}
              </span>
              {item.date && (
                <span className="text-xs text-sage-400">{item.date}</span>
              )}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-sage-500">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TipsList({ tips }: { tips: string[] }) {
  return (
    <div className="rounded-2xl border border-forest-200/80 bg-gradient-to-br from-forest-50 to-sage-50 p-6">
      <h3 className="font-display text-base font-semibold text-forest-900">
        Pro Tips
      </h3>
      <ul className="mt-4 space-y-3">
        {tips.map((tip, i) => (
          <li key={tip} className="flex gap-3 text-sm leading-relaxed text-sage-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-600 text-[11px] font-bold text-white">
              {i + 1}
            </span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RelatedPages({
  links,
  category,
}: {
  links: NavLink[];
  category: PageCategory;
}) {
  if (links.length === 0) return null;
  const accent = getCategoryAccent(category);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {links.slice(0, 6).map((link) => (
        <NavHref
          key={link.href}
          href={link.href}
          external={link.external}
          className="group flex items-start gap-3 rounded-xl border border-sage-200/80 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          {link.icon && (
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent.light} ${accent.text}`}
            >
              <NavIcon name={link.icon} className="h-4 w-4" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-forest-900 group-hover:text-forest-600 transition-colors">
              {link.label}
            </p>
            {link.description && (
              <p className="mt-0.5 text-xs text-sage-500 line-clamp-2">
                {link.description}
              </p>
            )}
          </div>
        </NavHref>
      ))}
    </div>
  );
}

export function HubGrid({
  sections,
  category,
}: {
  sections: { title: string; links: NavLink[] }[];
  category: PageCategory;
}) {
  const accent = getCategoryAccent(category);

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="mb-4 font-display text-xl font-semibold text-forest-900">
            {section.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.links.map((link) => (
              <NavHref
                key={link.href}
                href={link.href}
                external={link.external}
                className="group relative overflow-hidden rounded-2xl border border-sage-200/80 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                {link.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                    {link.badge}
                  </span>
                )}
                {link.icon && (
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent.gradient} text-white shadow-md`}
                  >
                    <NavIcon name={link.icon} className="h-5 w-5" />
                  </div>
                )}
                <h3 className="mt-4 font-display text-base font-semibold text-forest-900 group-hover:text-forest-600 transition-colors">
                  {link.label}
                </h3>
                {link.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-sage-500 line-clamp-2">
                    {link.description}
                  </p>
                )}
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-forest-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </NavHref>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FormFeedback({
  status,
  message,
}: {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}) {
  if (status === "idle" || status === "loading") return null;

  if (status === "success") {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-forest-50 px-4 py-3 text-sm font-medium text-forest-700">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        Thank you! We&apos;ll be in touch shortly.
      </p>
    );
  }

  return (
    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const result = await submitToFormspree("contact", {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      _subject: "EcoModern Living — Contact form",
    });

    if (result.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
      setError(result.message);
    }
  }

  return (
    <form id="contact-form" onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-sage-200/80 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-sage-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            disabled={status === "loading"}
            className="mt-1.5 w-full rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm text-sage-800 placeholder:text-sage-400 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-sage-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            disabled={status === "loading"}
            className="mt-1.5 w-full rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm text-sage-800 placeholder:text-sage-400 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100 disabled:opacity-60"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-sage-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="How can we help?"
          disabled={status === "loading"}
          className="mt-1.5 w-full rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm text-sage-800 placeholder:text-sage-400 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100 resize-none disabled:opacity-60"
        />
      </div>
      <FormFeedback status={status} message={error} />
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="inline-flex items-center gap-2 rounded-full bg-forest-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-forest-700 transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send Message"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const result = await submitToFormspree("newsletter", {
      email: String(data.get("email") ?? ""),
      _subject: "EcoModern Living — Newsletter signup",
    });

    if (result.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
      setError(result.message);
    }
  }

  return (
    <div className="space-y-3">
      <form id="subscribe" onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          name="email"
          type="email"
          required
          placeholder="Enter your email"
          disabled={status === "loading" || status === "success"}
          className="flex-1 rounded-full border border-sage-200 bg-white px-5 py-3 text-sm text-sage-800 placeholder:text-sage-400 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-forest-700 transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing…" : status === "success" ? "Subscribed!" : "Subscribe Free"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      <FormFeedback status={status === "success" ? "success" : status === "error" ? "error" : "idle"} message={error} />
    </div>
  );
}

export function AuditForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const result = await submitToFormspree("audit", {
      sqft: String(data.get("sqft") ?? ""),
      bill: String(data.get("bill") ?? ""),
      state: String(data.get("state") ?? ""),
      _subject: "EcoModern Living — Energy audit request",
    });

    if (result.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
      setError(result.message);
    }
  }

  return (
    <form id="audit-form" onSubmit={handleSubmit} className="rounded-2xl border border-sage-200/80 bg-white p-6 shadow-sm space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sqft" className="block text-sm font-medium text-sage-700">
            Square Footage
          </label>
          <input
            id="sqft"
            name="sqft"
            type="number"
            required
            min={100}
            placeholder="e.g. 2000"
            disabled={status === "loading"}
            className="mt-1.5 w-full rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="bill" className="block text-sm font-medium text-sage-700">
            Monthly Electric Bill ($)
          </label>
          <input
            id="bill"
            name="bill"
            type="number"
            required
            min={0}
            placeholder="e.g. 150"
            disabled={status === "loading"}
            className="mt-1.5 w-full rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100 disabled:opacity-60"
          />
        </div>
      </div>
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-sage-700">
          State
        </label>
        <input
          id="state"
          name="state"
          type="text"
          required
          placeholder="e.g. California"
          disabled={status === "loading"}
          className="mt-1.5 w-full rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100 disabled:opacity-60"
        />
      </div>
      <p className="text-xs text-sage-500">
        We&apos;ll email your personalized savings estimate. Full AI audit results coming soon.
      </p>
      <FormFeedback status={status} message={error} />
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-forest-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {status === "loading" ? "Submitting…" : status === "success" ? "Submitted!" : "Run Free Audit"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

export function CTABanner({
  title,
  description,
  ctaLabel,
  ctaHref,
  category,
}: {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  category: PageCategory;
}) {
  const accent = getCategoryAccent(category);

  return (
    <section className={`rounded-2xl bg-gradient-to-r ${accent.gradient} p-8 text-white shadow-xl sm:p-10`}>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80">
        {description}
      </p>
      {ctaHref.startsWith("#") ? (
        <a
          href={ctaHref}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-forest-900 hover:bg-forest-50 transition-colors"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </a>
      ) : (
        <Link
          href={ctaHref}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-forest-900 hover:bg-forest-50 transition-colors"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </section>
  );
}
