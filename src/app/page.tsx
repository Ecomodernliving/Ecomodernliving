import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronRight,
  Fan,
  Home,
  Leaf,
  PanelTop,
  Shield,
  ShoppingBag,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import { NewsletterForm } from "@/components/pages/PageSections";

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
    icon: BookOpen,
    title: "Passive House Guide",
    description: "Principles, calculators, product picks & 100+ FAQs — everything homeowners need to plan smarter.",
    href: "/passive-house",
    span: "col-span-1 md:col-span-2 row-span-1",
    accent: "bg-gradient-to-br from-amber-400 to-forest-600",
    badge: "Education",
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
  "Passive House education",
  "AI-powered recommendations",
  "Affiliate-verified products",
  "Research-backed guides",
];

const stats = [
  { value: "100+", label: "FAQ answers", sub: "Searchable passive house knowledge" },
  { value: "4", label: "Free calculators", sub: "Heat loss, airtightness & more" },
  { value: "50+", label: "Product categories", sub: "Curated eco marketplace" },
  { value: "AI", label: "Home tools", sub: "Audits, advisors & recommenders" },
];

const howItWorks = [
  {
    step: "01",
    title: "Assess your home",
    description: "Run a free energy audit or upload bills for AI-powered upgrade recommendations.",
    href: "/ai/energy-audit",
    cta: "Start free audit",
    icon: Zap,
    accent: "from-lime-500 to-forest-600",
  },
  {
    step: "02",
    title: "Learn the standard",
    description: "Explore passive house principles, calculators, and 100+ FAQs to plan smarter.",
    href: "/passive-house",
    cta: "Browse guides",
    icon: BookOpen,
    accent: "from-amber-400 to-forest-600",
  },
  {
    step: "03",
    title: "Shop with confidence",
    description: "Discover curated products across solar, HVAC, insulation, and smart home.",
    href: "/marketplace",
    cta: "Visit marketplace",
    icon: ShoppingBag,
    accent: "from-teal-500 to-forest-700",
  },
];

const popularCategories = [
  {
    label: "Solar",
    href: "/marketplace/solar",
    icon: Sun,
    description: "Panels, inverters & home batteries",
    accent: "from-amber-400 to-orange-500",
  },
  {
    label: "Heat Pumps",
    href: "/marketplace/heat-pumps",
    icon: Fan,
    description: "Air-source, ground-source & mini-splits",
    accent: "from-sky-400 to-teal-600",
  },
  {
    label: "Windows",
    href: "/marketplace/windows",
    icon: PanelTop,
    description: "Triple-pane, low-E & tilt-turn systems",
    accent: "from-blue-400 to-forest-600",
  },
  {
    label: "Insulation",
    href: "/marketplace/insulation",
    icon: Shield,
    description: "Mineral wool, cellulose & rigid foam",
    accent: "from-sage-400 to-forest-600",
  },
  {
    label: "Passive House",
    href: "/marketplace/passive-house-materials",
    icon: Leaf,
    description: "Membranes, ERVs & high-performance units",
    accent: "from-emerald-400 to-forest-700",
  },
  {
    label: "Smart Home",
    href: "/marketplace/smart-home",
    icon: Sparkles,
    description: "Automation, sensors & energy monitoring",
    accent: "from-violet-400 to-forest-600",
  },
];

const phCards = [
  { label: "Principles", value: "5 guides", icon: Shield, href: "/passive-house-principles" },
  { label: "Calculators", value: "4 tools", icon: Sparkles, href: "/passive-house-calculators" },
  { label: "FAQ", value: "100+ answers", icon: BookOpen, href: "/passive-house-faq" },
  { label: "Products", value: "Curated picks", icon: ShoppingBag, href: "/passive-house-products" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — industry-standard full-bleed with dimmed scrim */}
      <section className="hero-fullbleed relative w-full overflow-hidden">
        <div className="relative h-[clamp(420px,72svh,760px)] w-full">
          <Image
            src="/images/hero-passive-house.jpg"
            alt="Modern eco passive house at dusk with solar panels, green roof, triple-glazed windows, and sustainable landscaping"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="hero-scrim hero-scrim-center absolute inset-0 z-[1]" aria-hidden="true" />

          <div className="absolute inset-0 z-[2] flex items-center justify-center px-4 pb-36 sm:px-6 sm:pb-40 md:pb-32 lg:px-8 lg:pb-36">
            <div className="w-full max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/95 shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Sustainable solutions for modern living
              </div>

              <h1 className="mt-4 font-display text-[1.75rem] font-bold leading-[1.1] tracking-tight text-white min-[400px]:text-3xl sm:text-4xl lg:text-5xl lg:leading-tight">
                Build smarter.{" "}
                <span className="text-gradient-light">Live greener.</span>
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
                AI-powered tools, curated eco products, and expert passive house
                education — everything you need for a sustainable modern home.
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
                  Passive House Guide
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-forest-950/90 via-forest-950/55 to-transparent px-3 pb-3 pt-8 sm:px-6 sm:pb-4 sm:pt-10 lg:px-8 lg:pt-12">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-6 md:gap-y-5">
              {heroBadges.map((badge) => (
                <div key={badge.title} className="flex flex-col items-center text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-forest-800 shadow-lg sm:h-12 sm:w-12">
                    <badge.icon className="h-4 w-4 text-white sm:h-5 sm:w-5" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <p className="mt-1.5 text-[10px] font-bold uppercase leading-tight tracking-wide text-white sm:mt-2 sm:text-xs">
                    {badge.title}
                  </p>
                  <p className="mt-0.5 hidden text-[10px] leading-snug text-white/75 sm:block sm:text-[11px]">
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-sage-200/50 bg-gradient-to-r from-forest-50/90 via-white to-sage-50/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2.5 px-4 py-5 lg:gap-3 lg:px-6">
          {trustItems.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-sage-200/80 bg-white/90 px-4 py-2 text-xs font-medium text-sage-700 shadow-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-forest-500" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="absolute inset-0 mesh-bg opacity-80" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-600">
              Why EcoModern Living
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-forest-950 sm:text-4xl">
              One platform for sustainable homes
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-sage-600">
              Education, AI tools, and curated products — designed to help homeowners
              make confident, energy-smart decisions.
            </p>
            <div
              className="mx-auto mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-forest-400 to-forest-600"
              aria-hidden="true"
            />
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-sage-200/70 bg-white/90 p-5 text-center shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md sm:p-6"
              >
                <p className="font-display text-3xl font-bold text-forest-700 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-forest-900">{stat.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-sage-500">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-forest-200/50 bg-gradient-to-br from-forest-100/80 via-forest-50 to-emerald-50/60 py-20 lg:py-28">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--color-forest-300) 25%, transparent) 0%, transparent 50%), radial-gradient(circle at 80% 70%, color-mix(in srgb, var(--color-emerald-400) 15%, transparent) 0%, transparent 45%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute left-1/2 top-0 h-80 w-[min(100%,48rem)] -translate-x-1/2 rounded-full bg-forest-300/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-forest-300/50 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-forest-800 shadow-sm">
              Platform
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-forest-950 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              Everything for your{" "}
              <span className="text-gradient">eco-modern home</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-sage-600 sm:text-lg">
              From AI-powered audits to curated products and in-depth passive house
              guides — one place to learn, plan, and shop.
            </p>
            <div
              className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-forest-400 to-emerald-500"
              aria-hidden="true"
            />
          </div>

          <div className="mx-auto mt-14 max-w-5xl space-y-4">
            {features
              .filter((feature) => feature.featured)
              .map((feature) => (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-forest-200/80 bg-white p-8 text-center shadow-md ring-2 ring-forest-100/80 transition-all duration-300 hover:-translate-y-1 hover:border-forest-300 hover:shadow-xl hover:shadow-forest-900/10 sm:p-10"
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-forest-500 to-emerald-500"
                    aria-hidden="true"
                  />
                  {feature.badge && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                      {feature.badge}
                    </span>
                  )}
                  <div
                    className={`mt-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.accent} text-white shadow-lg ring-4 ring-white`}
                  >
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-forest-900 transition-colors group-hover:text-forest-600 sm:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-sage-500 sm:text-base">
                    {feature.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-5 py-2.5 text-sm font-semibold text-forest-700 transition-colors group-hover:bg-forest-100">
                    Explore guide
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <div className="pointer-events-none absolute -bottom-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-100/60 to-forest-100/40 blur-3xl" />
                </Link>
              ))}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features
                .filter((feature) => !feature.featured)
                .map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-sage-200/70 bg-white/95 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-forest-200/80 hover:shadow-lg hover:shadow-forest-900/5 sm:p-8"
                  >
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-forest-400 to-emerald-500 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.accent} text-white shadow-md ring-4 ring-white`}
                    >
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-forest-900 transition-colors group-hover:text-forest-600">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-sage-500">
                      {feature.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-forest-600">
                      Explore
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-sage-200/50 bg-cream-50/80 py-20 lg:py-28">
        <div className="absolute inset-0 mesh-bg opacity-40" aria-hidden="true" />
        <div
          className="absolute bottom-0 left-1/2 h-64 w-[min(100%,36rem)] -translate-x-1/2 translate-y-1/2 rounded-full bg-forest-200/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-forest-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-forest-700 shadow-sm">
              How it works
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-forest-950 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              Three steps to a{" "}
              <span className="text-gradient">greener home</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-sage-600 sm:text-lg">
              A simple path from understanding your home to learning best practices
              and finding the right sustainable products.
            </p>
            <div
              className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-forest-400 to-emerald-500"
              aria-hidden="true"
            />
          </div>

          <div className="relative mx-auto mt-14 max-w-5xl">
            <div
              className="pointer-events-none absolute left-[8%] right-[8%] top-[4.5rem] hidden h-0.5 bg-gradient-to-r from-forest-200 via-forest-300 to-forest-200 lg:block"
              aria-hidden="true"
            />

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
              {howItWorks.map((item) => (
                <div
                  key={item.step}
                  className="group relative flex flex-col items-center rounded-3xl border border-sage-200/70 bg-white/95 p-7 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-forest-200/80 hover:shadow-lg hover:shadow-forest-900/5 sm:p-8"
                >
                  <div
                    className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-forest-600 text-[10px] font-bold text-white shadow-md lg:hidden"
                    aria-hidden="true"
                  >
                    {item.step.replace(/^0/, "")}
                  </div>

                  <div className="relative">
                    <div
                      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-lg shadow-forest-900/15 ring-4 ring-white transition-transform group-hover:scale-105`}
                    >
                      <item.icon className="h-7 w-7" />
                    </div>
                    <span className="absolute -right-2 -top-2 hidden h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-forest-950 text-xs font-bold text-white shadow-md lg:flex">
                      {item.step}
                    </span>
                  </div>

                  <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-forest-500">
                    Step {item.step}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-forest-900 sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-sage-600">
                    {item.description}
                  </p>

                  <Link
                    href={item.href}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest-50 px-5 py-2.5 text-sm font-semibold text-forest-700 transition-all group-hover:bg-gradient-to-r group-hover:from-forest-600 group-hover:to-forest-700 group-hover:text-white group-hover:shadow-md"
                  >
                    {item.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-forest-50/30 to-white" aria-hidden="true" />
        <div className="absolute inset-0 mesh-bg opacity-30" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-forest-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-forest-700 shadow-sm">
              <ShoppingBag className="h-3.5 w-3.5" />
              Marketplace
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-forest-950 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              Popular{" "}
              <span className="text-gradient">categories</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-sage-600 sm:text-lg">
              Curated sustainable products across solar, HVAC, building materials,
              and smart home — verified picks to help you shop with confidence.
            </p>
            <div
              className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-forest-400 to-emerald-500"
              aria-hidden="true"
            />
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {popularCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-sage-200/70 bg-white/95 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-forest-200/80 hover:shadow-lg hover:shadow-forest-900/5 sm:p-7"
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${cat.accent} opacity-0 transition-opacity group-hover:opacity-100`}
                  aria-hidden="true"
                />
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${cat.accent} text-white shadow-md ring-4 ring-white transition-transform group-hover:scale-105`}
                >
                  <cat.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-forest-900 transition-colors group-hover:text-forest-600 sm:text-lg">
                  {cat.label}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-sage-500 sm:text-sm">
                  {cat.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-forest-600 opacity-80 transition-all group-hover:gap-1.5 group-hover:opacity-100 sm:text-sm">
                  Browse
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest-600 to-forest-700 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-forest-900/15 transition-all hover:opacity-95 hover:shadow-xl"
            >
              View all categories
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/ai/product-recommender"
              className="inline-flex items-center gap-2 rounded-full border border-sage-200/80 bg-white px-7 py-3 text-sm font-semibold text-forest-700 shadow-sm transition-all hover:border-forest-300 hover:bg-forest-50"
            >
              <Bot className="h-4 w-4" />
              AI Product Recommender
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-forest-950 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(61,139,99,0.28)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(45,111,78,0.22)_0%,_transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-forest-700 bg-forest-900/80 px-3.5 py-1.5 text-xs font-semibold text-forest-300">
                <BookOpen className="h-3.5 w-3.5" />
                Passive House Education
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                Learn the standard.{" "}
                <span className="text-gradient-light">Plan your project.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-sage-400">
                Clear, practical guidance on passive house principles — envelope
                design, ventilation, certification criteria, costs, and product
                recommendations to help you make informed decisions.
              </p>
              <ul className="mt-6 space-y-3 text-left">
                {[
                  "Five core principles explained simply",
                  "Free calculators for heat loss & airtightness",
                  "100+ searchable FAQs",
                  "Curated products for every building system",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-sage-300"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-800 text-forest-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link
                  href="/passive-house-principles"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest-900 shadow-lg hover:bg-forest-50 transition-colors"
                >
                  Explore the five principles
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/passive-house-calculators"
                  className="inline-flex items-center gap-2 rounded-full border border-forest-700 px-6 py-3 text-sm font-semibold text-forest-200 hover:border-forest-500 hover:bg-forest-900/60 transition-colors"
                >
                  Try calculators
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {phCards.map((card) => (
                <Link
                  key={card.label}
                  href={card.href}
                  className="group rounded-2xl border border-forest-800/80 bg-forest-900/50 p-5 backdrop-blur-sm transition-all hover:border-forest-600/60 hover:bg-forest-900/80 hover:shadow-lg hover:shadow-black/20 sm:p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-800/80 text-forest-400 transition-colors group-hover:bg-forest-700 group-hover:text-white">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wide text-sage-500">
                    {card.label}
                  </p>
                  <p className="mt-1 font-display text-base font-semibold text-white sm:text-lg">
                    {card.value}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-forest-400 opacity-0 transition-opacity group-hover:opacity-100">
                    Open
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-sage-200/80 bg-gradient-to-br from-forest-50 via-white to-sage-50 px-6 py-12 shadow-sm sm:px-12 sm:py-16">
            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-forest-100/50 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-sage-100/50 blur-3xl" aria-hidden="true" />

            <div className="relative mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-500 to-forest-700 text-white shadow-lg">
                <Leaf className="h-7 w-7" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-forest-950 sm:text-3xl">
                Get weekly eco living tips
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-sage-600 sm:text-base">
                Product picks, AI smart home trends, energy savings hacks, and
                passive house education — delivered to your inbox.
              </p>
              <div className="mx-auto mt-8 max-w-md">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
