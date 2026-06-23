/**
 * Site-wide configuration. Override via environment variables in production.
 * Copy .env.example → .env.local and fill in your values.
 */

export const siteConfig = {
  name: "EcoModern Living",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ecomodernliving.ai",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@ecomodernliving.ai",

  amazonAffiliateTag: process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG ?? "",

  formspree: {
    contact: process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID ?? "",
    newsletter: process.env.NEXT_PUBLIC_FORMSPREE_NEWSLETTER_ID ?? "",
    audit: process.env.NEXT_PUBLIC_FORMSPREE_AUDIT_ID ?? "",
  },

  social: {
    youtube:
      process.env.NEXT_PUBLIC_YOUTUBE_URL ??
      "https://www.youtube.com/@EcoModernLiving",
    discord:
      process.env.NEXT_PUBLIC_DISCORD_URL ?? "https://discord.gg/ecomodernliving",
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
      "https://www.instagram.com/ecomodernliving",
    pinterest:
      process.env.NEXT_PUBLIC_PINTEREST_URL ??
      "https://www.pinterest.com/ecomodernliving",
  },
} as const;

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
] as const;
