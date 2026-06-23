import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import {
  ArrowRight,
  Bot,
  ChevronRight,
  Fan,
  Hammer,
  Home,
  Leaf,
  PanelTop,
  Shield,
  ShoppingBag,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";

const heroBadges = [
  {
    icon: Home,
    title: "Superior Insulation",
    description: "High performance thermal envelope",
  },
  {
    icon: PanelTop,
    title: "Triple Glazed Windows",
    description: "Maximum efficiency & comfort",
  },
  {
    icon: Shield,
    title: "Air Tightness",
    description: "Sealed for clean, healthy air",
  },
  {
    icon: Fan,
    title: "Heat Recovery Ventilation",
    description: "Fresh air, low energy use",
  },
  {
    icon: Sun,
    title: "Solar Energy",
    description: "Renewable, clean power",
  },
  {
    icon: Leaf,
    title: "Green Roof",
    description: "Improves insulation & biodiversity",
  },
];

const features = [
  {
    icon: Bot,
    title: "AI Home Advisor",
    description: "Upload photos & utility bills — get personalized upgrade plans with ROI estimates.",
    href: "/ai/home-advisor",
    span: "col-span-1 row-span-1",
    accent: "bg-gradient-to-br from-emerald-500 to-forest-700",
  },
  {
    icon: ShoppingBag,
    title: "Eco Marketplace",
    description: "Solar, heat pumps, smart thermostats, non-toxic furniture & 50+ curated categories.",
    href: "/marketplace",
    span: "col-span-1 row-span-1",
    accent: "bg-gradient-to-br from-teal-500 to-forest-600",
  },
  {
    icon: Hammer,
    title: "Our Passive House Build",
    description: "Follow our real eco-modern passive house journey — design, materials, costs & lessons.",
    href: "/passive-house",
    span: "col-span-1 md:col-span-2 row-span-1",
    accent: "bg-gradient-to-br from-amber-400 to-forest-600",
    badge: "Live Build",
    featured: true,
  },
  {
    icon: Sparkles,
    title: "Guides & Reviews",
    description: "Best eco sofas, heat pumps, low-VOC paints — content that ranks and converts.",
    href: "/guides/reviews",
    span: "col-span-1 row-span-1",
    accent: "bg-gradient-to-br from-sage-400 to-forest-600",
  },
  {
    icon: Zap,
    title: "Free Energy Audit",
    description: "Estimate energy waste, solar savings & available tax credits in minutes.",
    href: "/ai/energy-audit",
    span: "col-span-1 row-span-1",
    accent: "bg-gradient-to-br from-lime-500 to-forest-600",
  },
];

const trustItems = [
  "Passive House principles",
  "AI-powered recommendations",
  "Affiliate-verified products",
  "Real build documentation",
];

export default function HomePage() {
  return (
    <>
      {/* Hero — industry-standard full-bleed with dimmed scrim */}
      <section className="hero-fullbleed relative w-full overflow-hidden">
        <div className="relative h-[clamp(520px,46vw,760px)] w-full">
          {/* Background image */}
          <Image
            src="/images/hero-passive-house.jpg"
            alt="Modern eco passive house at dusk with solar panels, green roof, triple-glazed windows, and sustainable landscaping"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Dim overlay for text contrast */}
          <div className="hero-scrim hero-scrim-center absolute inset-0 z-[1]" aria-hidden="true" />

          {/* Foreground copy — centered over building */}
          <div className="absolute inset-0 z-[2] flex items-center justify-center px-4 pb-28 sm:px-6 sm:pb-32 lg:px-8 lg:pb-36">
            <div className="w-full max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/95 shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Sustainable solutions for modern living
              </div>

              <h1 className="mt-4 font-display text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">
                Build smarter.{" "}
                <span className="text-gradient-light">Live greener.</span>
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
                AI-powered tools, curated eco products, and a real passive house
                build — everything you need for a sustainable modern home.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-8">
                <Link
                  href="/ai/energy-audit"
                  className="inline-flex items-center gap-2 rounded-full bg-forest-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/25 hover:bg-forest-400 hover:-translate-y-0.5 transition-all"
                >
                  <Zap className="h-4 w-4" />
                  Free Energy Audit
                </Link>
                <Link
                  href="/passive-house"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
                >
                  Follow Our Build
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Passive house feature badges */}
          <div className="absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-forest-950/90 via-forest-950/55 to-transparent px-3 pb-4 pt-10 sm:px-6 sm:pb-5 sm:pt-12 lg:px-8">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-5 lg:grid-cols-6">
              {heroBadges.map((badge) => (
                <div key={badge.title} className="flex flex-col items-center text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-forest-800 shadow-lg sm:h-12 sm:w-12">
                    <badge.icon className="h-5 w-5 text-white" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <p className="mt-2 text-[9px] font-bold uppercase leading-tight tracking-wide text-white sm:text-[10px]">
                    {badge.title}
                  </p>
                  <p className="mt-0.5 max-w-[9rem] text-[8px] leading-snug text-white/75 sm:text-[9px]">
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-sage-200/60 bg-white/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-4 lg:px-6">
          {trustItems.map((item) => (
            <span
              key={item}
              className="flex items-center gap-2 text-xs font-medium text-sage-600"
            >
              <Leaf className="h-3.5 w-3.5 text-forest-500" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Bento feature grid */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest-600">
              Platform
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-forest-950 sm:text-4xl">
              Everything for your eco-modern home
            </h2>
            <p className="mt-3 text-base text-sage-600">
              From AI-powered audits to curated products and our own passive
              house build — one platform for sustainable living.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className={clsx(
                  "bento-card group relative overflow-hidden p-6",
                  feature.span,
                  feature.featured && "md:p-8"
                )}
              >
                {feature.badge && (
                  <span className="absolute right-5 top-5 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                    {feature.badge}
                  </span>
                )}

                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.accent} text-white shadow-md`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold text-forest-900 group-hover:text-forest-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sage-500">
                  {feature.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-forest-600">
                  Explore
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>

                {feature.featured && (
                  <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-gradient-to-br from-amber-100/80 to-forest-100/60 blur-2xl" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Passive house spotlight */}
      <section className="relative overflow-hidden bg-forest-950 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(61,139,99,0.25)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(45,111,78,0.2)_0%,_transparent_50%)]" />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-forest-700 bg-forest-900/80 px-3 py-1 text-xs font-semibold text-forest-300">
                <Hammer className="h-3.5 w-3.5" />
                Our Passive House Journey
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                From blueprint to keys — documented every step
              </h2>
              <p className="mt-4 text-base leading-relaxed text-sage-400">
                We&apos;re building a real eco-modern passive house and sharing
                everything: envelope design, ERV systems, material choices, costs,
                and lessons learned along the way.
              </p>
              <ul className="mt-6 space-y-2.5">
                {[
                  "Weekly build journal with photos",
                  "Transparent cost breakdown & ROI",
                  "Material decisions with product links",
                  "Virtual tours when complete",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-sage-300"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-800 text-forest-400">
                      <ChevronRight className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/passive-house/journal"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest-900 hover:bg-forest-50 transition-colors"
              >
                Read the build journal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Decorative grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Design", value: "Complete", icon: Sparkles },
                { label: "Envelope", value: "In Progress", icon: Shield },
                { label: "HVAC / ERV", value: "Planned", icon: Bot },
                { label: "Solar", value: "Planned", icon: Sun },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-forest-800/80 bg-forest-900/60 p-5 backdrop-blur-sm"
                >
                  <card.icon className="h-5 w-5 text-forest-400" />
                  <p className="mt-3 text-xs text-sage-500">{card.label}</p>
                  <p className="mt-0.5 font-display text-sm font-semibold text-white">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-sage-200/80 bg-gradient-to-br from-forest-50 via-white to-sage-50 px-8 py-14 text-center sm:px-16">
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-forest-100/60 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-sage-100/60 blur-3xl" />

            <div className="relative">
              <h2 className="font-display text-2xl font-bold text-forest-950 sm:text-3xl">
                Get weekly eco living tips
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-sage-600">
                Product picks, AI smart home trends, energy savings hacks, and
                updates from our passive house build.
              </p>
              <Link
                href="/community/newsletter"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-forest-700 transition-colors"
              >
                Join the newsletter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
