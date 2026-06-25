# Passive House Internal Linking Recommendations

## Hub Architecture

```
/passive-house (hub)
├── /passive-house-principles
├── /passive-house-products
├── /passive-house-calculators
├── /passive-house-faq
├── /passive-house/vision … /passive-house/tours (build journey)
└── /guides/passive-house (guides funnel entry)
```

## Priority Link Matrix

| From | To | Anchor Context |
|------|-----|----------------|
| `/` homepage | `/passive-house` | Hero badges, build journey CTA |
| `/guides/passive-house` | `/passive-house-principles` | "Learn the five principles" |
| `/guides/passive-house` | `/passive-house-calculators` | "Try our free calculators" |
| `/passive-house-principles` | `/marketplace/windows` | Windows principle section |
| `/passive-house-principles` | `/passive-house/envelope` | Insulation & airtightness |
| `/passive-house-calculators` | `/passive-house-faq` | "Questions about results?" |
| `/passive-house-faq` | `/ai/energy-audit` | "Get a personalized audit" |
| `/passive-house-products` | `/marketplace/*` | Product cards |
| `/passive-house/envelope` | `/passive-house-calculators` | ACH50 & R-value tools |
| `/passive-house/hvac` | `/marketplace/heat-pumps` | System sizing |
| `/ai/home-advisor` | `/passive-house-principles` | PH methodology |
| `/ai/energy-audit` | `/passive-house-calculators` | Deeper calculations |
| All SEO articles | 2–3 internal links each | Per article JSON `internalLinks` |

## Footer & Navigation

- **Our Passive House** nav now includes Education Hub section (5 links)
- Consider adding `/passive-house-faq` to footer under Resources

## Schema & SEO

- FAQ page: implement `FAQPage` JSON-LD from `passive-house-faq-data.json`
- Article pages: `Article` + `FAQPage` schema when full articles are written
- Breadcrumbs: already auto-generated via `navigation-utils.ts`

## Cross-Category Links

| Sustainable Living | Passive House Link |
|--------------------|-------------------|
| `/guides/healthy-homes` | `/passive-house/hvac` (ventilation) |
| `/guides/zero-waste` | `/passive-house-products` (durable materials) |
| `/guides/incentives` | `/passive-house/costs` |

| Green Construction | Passive House Link |
|--------------------|-------------------|
| `/guides/net-zero` | `/passive-house-principles` |
| `/guides/eco-architecture` | `/passive-house/design` |
