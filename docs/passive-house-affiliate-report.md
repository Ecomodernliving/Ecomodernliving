# Passive House Affiliate Opportunities Report

## Strategy

Passive House education content creates high-intent traffic for building envelope products, mechanical systems, and monitoring tools. Every educational page links to relevant marketplace categories with affiliate transparency.

## High-Value Categories

| Category | Est. Intent | Amazon | Home Depot | Lowe's | Avg. Commission |
|----------|-------------|--------|------------|--------|-----------------|
| ERV/HRV & ducts | Very high | ✓ | ✓ | ✓ | 3–8% |
| Insulation & air barriers | Very high | ✓ | ✓ | ✓ | 3–6% |
| Heat pumps & mini-splits | High | ✓ | Limited | Limited | 2–4% |
| Smart thermostats | High | ✓ | ✓ | ✓ | 4–8% |
| Energy monitors | Medium | ✓ | ✓ | ✓ | 4–6% |
| Solar & batteries | High | ✓ | ✓ | ✓ | 2–4% |
| Water fixtures (DHW) | Medium | ✓ | ✓ | ✓ | 4–6% |
| Low-VOC finishes | Medium | ✓ | ✓ | ✓ | 4–8% |

## Content → Product Funnels

| Content Page | Primary Affiliate Destination |
|--------------|-------------------------------|
| `/passive-house-principles` | `/passive-house-products` |
| `/passive-house-calculators` | `/marketplace/insulation` (post-calc CTA) |
| `/passive-house-faq` | Contextual links per answer |
| `/passive-house/envelope` | `/marketplace/insulation`, `/marketplace/passive-house-materials` |
| `/passive-house/hvac` | `/marketplace/heat-pumps`, `/marketplace/passive-house-materials` |
| `/guides/passive-house` | `/passive-house-products` |
| SEO articles (50) | Mapped per `affiliateCategories` in article JSON |

## Recommendation Tables by Topic

### Airtightness
- Liquid-applied membranes (Prosoco, SIGA alternatives on Amazon)
- Airtight tapes (3M, Tescon-style)
- Blower door fan rentals (local partners — lead gen opportunity)

### Windows
- High-performance triple-pane (limited on Amazon — link to manufacturer partners)
- Interior storm panels (retrofit entry point)
- Exterior shading products

### Ventilation
- Central HRV/ERV units
- Replacement filters (recurring revenue)
- Duct insulation sleeves

## Revenue Optimization

1. **Direct `/dp/` links** — already implemented in marketplace catalog
2. **Comparison tables** — add to top SEO articles as they're written
3. **Calculator CTAs** — "Shop insulation for your R-value target"
4. **Email nurture** — newsletter sequences per funnel stage
5. **AI recommender** — map `passive-house-knowledge-base.json` product tags to RAG responses

## Compliance

- All pages include affiliate disclosure in footer and marketplace sections
- Product claims tied to published specs (NFRC, Energy Star), not course materials
