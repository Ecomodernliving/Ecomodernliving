export type LegalSection = {
  title: string;
  paragraphs: string[];
  list?: string[];
};

export type LegalPageContent = {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export const legalPages: Record<string, LegalPageContent> = {
  "/privacy": {
    title: "Privacy Policy",
    description: "How EcoModern Living collects, uses, and protects your information.",
    lastUpdated: "June 22, 2026",
    sections: [
      {
        title: "Overview",
        paragraphs: [
          "EcoModern Living (\"we,\" \"us,\" or \"our\") operates ecomodernliving.ai. This Privacy Policy explains what information we collect when you use our website, forms, and tools, and how we use it.",
        ],
      },
      {
        title: "Information We Collect",
        paragraphs: ["We may collect the following when you interact with our site:"],
        list: [
          "Contact details you submit (name, email, message) via our contact form",
          "Email address when you subscribe to our newsletter",
          "Home energy audit inputs (square footage, utility bill estimates, state)",
          "Standard usage data such as pages visited, browser type, and referring URL (if analytics are enabled)",
        ],
      },
      {
        title: "How We Use Your Information",
        paragraphs: ["We use collected information to:"],
        list: [
          "Respond to inquiries and support requests",
          "Send newsletters and product updates you opt into",
          "Improve our content, tools, and user experience",
          "Comply with legal obligations",
        ],
      },
      {
        title: "Third-Party Services",
        paragraphs: [
          "We use third-party services to operate the site, including form providers (e.g. Formspree), hosting (e.g. Vercel), and affiliate retailers (e.g. Amazon). These providers process data according to their own privacy policies.",
          "Our site contains affiliate links. If you click a product link and make a purchase, the retailer may collect information according to their policy. We may earn a commission at no extra cost to you.",
        ],
      },
      {
        title: "Cookies & Analytics",
        paragraphs: [
          "We may use cookies or similar technologies for essential site functionality and, if enabled, analytics to understand traffic patterns. You can control cookies through your browser settings.",
        ],
      },
      {
        title: "Your Rights",
        paragraphs: [
          "Depending on your location, you may have rights to access, correct, or delete personal data we hold. To exercise these rights, contact us at hello@ecomodernliving.ai.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          "Questions about this policy? Email hello@ecomodernliving.ai.",
        ],
      },
    ],
  },
  "/terms": {
    title: "Terms of Service",
    description: "Terms governing your use of EcoModern Living.",
    lastUpdated: "June 22, 2026",
    sections: [
      {
        title: "Acceptance of Terms",
        paragraphs: [
          "By accessing ecomodernliving.ai, you agree to these Terms of Service. If you do not agree, please do not use the site.",
        ],
      },
      {
        title: "Use of the Site",
        paragraphs: ["You agree to use this site only for lawful purposes. You may not:"],
        list: [
          "Attempt to disrupt or compromise site security",
          "Scrape or reproduce content without permission",
          "Misrepresent your identity when submitting forms",
          "Use automated tools to abuse forms or services",
        ],
      },
      {
        title: "Content & Tools",
        paragraphs: [
          "Our guides, product recommendations, AI tools, and passive house documentation are provided for informational purposes only. They do not constitute professional engineering, architectural, financial, or legal advice.",
          "Energy audit estimates, ROI projections, and AI recommendations are approximations. Always consult qualified professionals before making construction, HVAC, solar, or financial decisions.",
        ],
      },
      {
        title: "Affiliate Links",
        paragraphs: [
          "Some links on this site are affiliate links. We may earn a commission when you purchase through them. See our Affiliate Disclosure for details.",
        ],
      },
      {
        title: "Intellectual Property",
        paragraphs: [
          "Site content, branding, and original materials are owned by EcoModern Living unless otherwise noted. You may not copy, distribute, or create derivative works without written permission.",
        ],
      },
      {
        title: "Limitation of Liability",
        paragraphs: [
          "EcoModern Living is provided \"as is.\" We are not liable for damages arising from your use of the site, reliance on content, or purchases made through third-party retailers.",
        ],
      },
      {
        title: "Changes",
        paragraphs: [
          "We may update these terms at any time. Continued use of the site after changes constitutes acceptance of the revised terms.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          "Questions? Contact hello@ecomodernliving.ai.",
        ],
      },
    ],
  },
  "/affiliate-disclosure": {
    title: "Affiliate Disclosure",
    description: "How EcoModern Living earns revenue from product recommendations.",
    lastUpdated: "June 22, 2026",
    sections: [
      {
        title: "FTC Disclosure",
        paragraphs: [
          "EcoModern Living participates in affiliate programs. This means we may earn a commission when you click certain links on our site and make a purchase — at no additional cost to you.",
          "We are a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.",
        ],
      },
      {
        title: "What This Means for You",
        paragraphs: [
          "Affiliate relationships help fund our free guides, passive house education, and AI tools. Our recommendations are based on sustainability criteria, performance, and relevance — not solely on commission rates.",
          "Prices and availability on retailer sites may change. Always verify details on the retailer's website before purchasing.",
        ],
      },
      {
        title: "Partners",
        paragraphs: ["We may earn commissions through links to:"],
        list: [
          "Amazon",
          "Home Depot",
          "Lowe's",
          "Wayfair",
          "Other eco and home improvement retailers",
        ],
      },
      {
        title: "Transparency",
        paragraphs: [
          "Product pages labeled \"View on Amazon\" or similar link to affiliate destinations. We clearly mark sponsored relationships in accordance with FTC guidelines.",
          "If you have questions about our affiliate practices, contact hello@ecomodernliving.ai.",
        ],
      },
    ],
  },
};
