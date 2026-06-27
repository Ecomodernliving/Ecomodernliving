/**
 * Site-wide configuration. Override via environment variables in production.
 * Copy .env.example → .env.local and fill in your values.
 */

export const siteConfig = {
  name: "EcoModern Living",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ecomodernliving.ai",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@ecomodernliving.ai",

  amazonAffiliateTag:
    process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "ecomodernliving-20",

  formspree: {
    contact: process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID ?? "",
    newsletter: process.env.NEXT_PUBLIC_FORMSPREE_NEWSLETTER_ID ?? "",
    audit: process.env.NEXT_PUBLIC_FORMSPREE_AUDIT_ID ?? "",
  },

  social: {
    youtube:
      process.env.NEXT_PUBLIC_YOUTUBE_URL ??
      "https://www.youtube.com/@EcoModernLiving",
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
      "https://www.instagram.com/ecomodernliving.ai/",
    pinterest:
      process.env.NEXT_PUBLIC_PINTEREST_URL ??
      "https://www.pinterest.com/ecomodernliving/",
    facebook:
      process.env.NEXT_PUBLIC_FACEBOOK_URL ??
      "https://www.facebook.com/ecomodernliving",
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_URL ??
      "https://www.linkedin.com/company/ecomodernliving",
    tiktok:
      process.env.NEXT_PUBLIC_TIKTOK_URL ??
      "https://www.tiktok.com/@ecomodernliving",
    discord:
      process.env.NEXT_PUBLIC_DISCORD_URL ?? "https://discord.gg/ecomodernliving",
  },
} as const;

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
] as const;
