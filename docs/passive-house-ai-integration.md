# Passive House AI Integration Recommendations

## Knowledge Base for RAG

**File:** `data/passive-house-knowledge-base.json`

| Section | AI Use |
|---------|--------|
| `definitions` | Semantic search, glossary responses |
| `formulas` | Calculator validation, audit estimates |
| `topics[].faqs` | Direct Q&A retrieval |
| `certificationCriteria` | Compliance checking |
| `productMappings` | Product recommender context |
| `aiToolRecommendations` | Per-tool system prompts |

## Tool Enhancements

### AI Sustainable Home Advisor (`/ai/home-advisor`)

**Add to system context:**
- Envelope-first retrofit sequencing (air seal → insulate → windows → ventilate → HVAC → solar)
- Climate-zone R-value ranges
- Common thermal bridge locations (slab edge, balcony, parapet, chimney)

**Prompt additions:**
> "Evaluate this home against Passive House principles. Prioritize upgrades by cost-effectiveness and identify which of the five principles are weakest."

### AI Energy Audit (`/ai/energy-audit`)

**Add estimation models:**
- ACH50 estimate from construction year and type (pre-1980: ~1.5–2.5; post-2000: ~0.5–1.0)
- Insulation score by wall type (2x4 batt: low; 2x6 dense-pack: medium; exterior foam: high)
- Simplified heat loss: `Q = A × U × ΔT` with regional ΔT

**Output fields:**
- Estimated ACH50 vs 0.6 target
- Insulation score (1–10)
- Priority upgrade list with marketplace links

### AI Interior Design (`/ai/interior-design`)

**Add recommendations:**
- South-facing workspace placement for daylighting
- Exterior vs interior shading for glare control
- Thermal comfort: avoid blocking supply air diffusers
- Low-VOC material palette suggestions

## Implementation Phases

| Phase | Work | Effort |
|-------|------|--------|
| 1 | Load KB JSON into AI tool prompts | Low |
| 2 | Wire FAQ semantic search | Medium |
| 3 | Calculator results → product API | Medium |
| 4 | Full RAG with vector store (Pinecone/pgvector) | High |

## API Endpoint Suggestion

```
POST /api/ai/passive-house
Body: { question, context: { climate, tfa, constructionYear } }
Response: { answer, sources[], productLinks[] }
```

## Data Refresh

Re-run `node scripts/generate-passive-house-content.mjs` when KB is updated. Keep course PDFs as internal reference only — never feed verbatim to the model.
