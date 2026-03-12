# PRC + Vantix SEO Master Plan
## Synthesized from OpenAI + Gemini + Internal Analysis

**Revised Goal:** 200-500 organic visitors/day by **Month 10-12** (not Month 6)

**Reality Check:**
- YMYL sandbox = 3-6 months minimum throttle
- New domain = zero trust signals
- User signals (dwell time, CTR) > backlinks for breaking sandbox
- Information gain (unique data) > rehashed content

---

## PHASE 1: Foundation (Weeks 1-4) - HIGHEST PRIORITY

### Week 1: Schema + Technical SEO
**Impact:** Trust signals to escape YMYL sandbox faster

**Tasks:**
- [ ] Add Organization schema with MDx BioAnalytical association
- [ ] Add FAQ schema to all 15 existing articles
- [ ] Add Review schema for testimonials
- [ ] Add breadcrumb schema to all pages
- [ ] Verify all articles have hard-coded "Research Only" disclaimer
- [ ] Add Core Web Vitals monitoring

**Schema Template:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PRC Labs LLC",
  "url": "https://prcpeptides.com",
  "memberOf": {
    "@type": "Organization",
    "name": "MDx BioAnalytical",
    "url": "https://mdxbioanalytical.com"
  },
  "founder": {
    "@type": "Person",
    "name": "Michael Velazquez"
  }
}
```

### Week 2: Glossary Build
**Impact:** Low-competition keywords, internal linking hub

**Create:** `/glossary/index.html` + 50 term pages

**Terms to cover:**
- All peptides sold (semaglutide, BPC-157, TB-500, etc.)
- Technical terms (HPLC, lyophilized, reconstitution, etc.)
- Mechanisms (GLP-1, tissue repair, growth hormone, etc.)
- Common issues (aggregation, degradation, contamination)

**Format:** Short definitions (200-300 words) with links to deep guides

### Week 3-4: Unique Data Article
**Impact:** Information gain, backlink magnet, establishes authority

**Article:** "We Tested 5 Peptide Vendors: Purity Comparison Study"

**Structure:**
- Purchased same peptide from 5 vendors
- Sent to independent lab (or use your sourcing data)
- Compare claimed purity vs actual
- Name names (transparent)
- Include redacted lab reports
- 2,000+ words

**Alternative if no testing budget:** "Analyzing 50 Peptide COAs: What We Found"

---

## PHASE 2: Topic Depth (Months 2-4)

### Expand Major Peptide Clusters (15-30 articles each)

**Semaglutide Cluster (Target: 20 articles):**

**Already have:** research guide, buying guide, vs tirzepatide, calculator

**Add (Priority Order):**
1. Semaglutide degradation guide (troubleshooting - fast rank)
2. Semaglutide storage temperature study (unique data)
3. Semaglutide mechanism deep-dive (authority)
4. Semaglutide vs Ozempic comparison (commercial intent)
5. Semaglutide purity testing explained (trust)
6. Common semaglutide reconstitution mistakes (troubleshooting)
7. Semaglutide vendor comparison (commercial intent)
8. Semaglutide half-life explained (technical)
9. Semaglutide molecular structure guide (technical)
10. Semaglutide compounding vs research-grade (regulatory)
11. Semaglutide clinical trial summary (authority)
12. Semaglutide vs liraglutide (comparison)
13. Semaglutide stability at room temp (troubleshooting)
14. Semaglutide dosing calculations (tool/calculator)
15. How to verify semaglutide purity (trust)
16. Semaglutide regulatory status 2026 (authority)

**BPC-157 Cluster (Target: 15 articles):**

**Already have:** research guide

**Add:**
1. BPC-157 vs TB-500 (comparison - fast rank)
2. BPC-157 degradation signs (troubleshooting)
3. BPC-157 mechanism explained (authority)
4. BPC-157 storage guide (troubleshooting)
5. BPC-157 purity testing (trust)
6. BPC-157 vendor comparison (commercial)
7. BPC-157 stability study (unique data)
8. BPC-157 + TB-500 protocol (combination)
9. BPC-157 reconstitution guide (troubleshooting)
10. BPC-157 vs copper peptides (comparison)
11. BPC-157 research studies 2020-2026 (authority)
12. BPC-157 regulatory status (authority)
13. Common BPC-157 mistakes (troubleshooting)
14. How to verify BPC-157 quality (trust)

**TB-500 Cluster (Target: 12 articles):**

**Already have:** research guide

**Add similar expansion pattern**

---

## PHASE 3: User Signal Optimization (Ongoing)

### Tools & Interactivity (Boost Dwell Time)

**Build these calculators/tools:**
- [ ] Reconstitution calculator (all peptides, not just semaglutide)
- [ ] Peptide stability timeline tool (input: peptide + temp + days → degradation estimate)
- [ ] Dosing calculator (mg to IU, concentration converter)
- [ ] Batch ID lookup (if you track batches)
- [ ] Storage duration calculator
- [ ] Cost-per-dose comparison tool

**Embed videos:**
- Screen recordings of calculators
- Whiteboard explanations of mechanisms
- Even 2-3 minute videos boost dwell time significantly

**Interactive elements:**
- Expandable FAQ accordions
- Comparison tables with sort/filter
- Click-to-reveal detailed sections

---

## PHASE 4: Content Mix Strategy

**Publishing Schedule (4 articles/week):**

**Monday:** Vantix authority (1,000-1,400 words)
- Testing methodology
- Quality standards
- Advanced science

**Tuesday:** PRC deep guide (1,500+ words)
- Comprehensive peptide guides
- Mechanism deep-dives
- Research summaries

**Wednesday:** PRC troubleshooting (800-1,200 words)
- "Why is my peptide cloudy?"
- "How to tell if X degraded"
- "Reconstitution problems solved"
- **These rank fastest - prioritize**

**Thursday:** PRC comparison or data (1,000-1,500 words)
- A vs B peptide comparisons
- Vendor comparisons
- Unique data/studies

**Content Distribution:**
- 30% Deep guides (authority building)
- 30% Troubleshooting (fast ranking)
- 20% Comparisons (commercial intent)
- 10% Unique data/studies (information gain)
- 10% Glossary/definitions (low competition)

---

## PHASE 5: Keyword Strategy (Ultra Long-Tail First)

**Avoid (Too Competitive):**
- ❌ "semaglutide for research"
- ❌ "buy BPC-157"
- ❌ "best peptide vendor"

**Target (Specific = Fast Rank):**
- ✅ "semaglutide degradation at room temperature"
- ✅ "how to tell if BPC-157 has degraded"
- ✅ "reconstituted semaglutide shelf life refrigerated"
- ✅ "TB-500 vs BPC-157 mechanism difference"
- ✅ "peptide turned cloudy after reconstitution safe"
- ✅ "bacteriostatic water vs sterile water peptides"
- ✅ "lyophilized peptide storage temperature"
- ✅ "HPLC purity testing peptides explained"

**Featured Snippet Targets:**
- "How to reconstitute [peptide]"
- "What is [peptide]"
- "How long does [peptide] last"
- "Can I [action] with [peptide]"

**Format answers as:**
- Numbered lists
- Tables
- Step-by-step instructions
- Direct answers in first paragraph

---

## PHASE 6: Internal Linking Architecture

**Already Implemented:**
- ✅ GLP-1 cluster fully linked
- ✅ BPC-157 ↔ TB-500 cross-linked

**Still TODO:**
- [ ] Vendor/quality cluster linking
- [ ] Product pages → blog articles
- [ ] Glossary → deep guides
- [ ] All articles → glossary terms
- [ ] Related articles sections on remaining 9 articles

**Linking Rules:**
- Every article: 5-8 internal links minimum
- Hub pages: Link to ALL spokes
- Spokes: Link to hub + 3-5 siblings
- Product pages: Link to relevant research guide + troubleshooting
- Glossary: Link to deep guides for each term
- Footer: Link to vendor comparison (site-wide trust)

---

## PHASE 7: Backlink Strategy (Quality > Quantity)

**Month 1-2: User Signals (Priority)**
- Reddit helpful comments → link to specific technical guides
- Goal: High dwell time (4+ minutes), not link juice
- Track which articles get best engagement

**Month 3-4: Guest Posts (5-10 placements)**
Target sites:
- Siim Land blog
- Ben Greenfield Fitness
- Biohacker's Blog
- Dave Asprey Bulletproof
- Longevity subreddits (with permission)

Pitch: "The Real Cost of Untested Peptides: A Lab Testing Analysis"

**Month 5-6: Data-Driven Backlink Magnet**
Publish: "2026 Peptide Vendor Testing Report"
- Test 10 vendors
- Publish full results
- Reach out to peptide news sites, biohacking podcasts
- Goal: 10-20 natural backlinks

**Ongoing:**
- HARO (Help A Reporter Out) - peptide queries
- Podcast guest appearances (mention site)
- YouTube collaborations (peptide channels)

**Avoid:**
- Link farms
- Cheap guest post services
- Comment spam
- Footer link exchanges

---

## PHASE 8: PRC → Vantix Authority Flow

**Fix Current Linking (Gemini Concern):**

**Don't do this:**
❌ "Check out Vantix Bio for premium peptides"

**Do this:**
✅ "According to Vantix Bio's ISO 17025 testing methodology..."
✅ "As verified by independent testing (Vantix Bio, 2026)..."
✅ "Our premium line (Vantix Bio) uses dual-method verification..."

**Frame as:**
- Citation (authoritative source)
- Technical reference
- Independent verification
- Not promotion

**Link Placement:**
- Within content (contextual)
- In testing/quality discussions
- Never in footer
- Never "Recommended Vendor" style

---

## PHASE 9: Vantix Unique Content

**Remove PRC Duplicates:**
- Delete all copied blog articles from Vantix
- Keep only unique Vantix content

**Create Vantix-Only Content (1/week):**

**Month 1-2:**
- How Pharmaceutical-Grade Testing Works (cornerstone)
- Reading Third-Party COAs Guide
- Why Cheap Peptides Are Expensive
- MDx BioAnalytical: Why We Chose This Lab

**Month 3-4:**
- ISO 17025 Accreditation Explained
- HPLC-DAD vs Basic HPLC
- Triple Quad MS Verification
- Detecting Counterfeit Peptides

**Month 5-6:**
- Peptide Synthesis Quality Differences
- Pharmaceutical vs Research Grade Deep-Dive
- Advanced Stability Studies
- Chain of Custody in Peptide Manufacturing

**Vantix Keywords (Premium Focus):**
- "pharmaceutical grade peptides ISO 17025"
- "verified peptide testing third party"
- "highest quality peptides COA"
- "premium peptide supplier tested"

---

## PHASE 10: Tracking & Metrics

**Weekly Monitoring:**
- Organic visitors/day (Google Analytics)
- Indexed pages (Search Console)
- Average dwell time (Analytics)
- Bounce rate by article
- Top 10 ranking keywords
- Backlinks (Search Console)
- Conversions from organic

**Monthly Review:**
- Which article types rank fastest?
- Which keywords drove traffic?
- What's the dwell time on top articles?
- Backlink growth rate
- Competitor movement

**Adjust Strategy Based On:**
- If troubleshooting ranks fast → publish more
- If glossary gets traffic → expand it
- If certain peptides convert better → deepen those clusters
- If dwell time low → add more interactivity

---

## REALISTIC TIMELINE

**Month 1-3: Sandbox Phase (20-50 visitors/day)**
- Building foundation (schema, glossary, tools)
- Publishing consistently
- Reddit user signals
- Google indexing slowly

**Month 4-6: Breaking Out (50-150 visitors/day)**
- Long-tail keywords start ranking
- Troubleshooting articles get traction
- Guest posts going live
- Authority building via unique data

**Month 7-9: Acceleration (150-300 visitors/day)**
- Topic clusters established
- Featured snippets appearing
- Backlinks compounding
- Brand searches increasing

**Month 10-12: Authority Status (200-500 visitors/day)**
- Multiple #1 rankings
- Topical authority recognized
- Natural backlinks incoming
- Conversion rate optimizing

---

## IMMEDIATE ACTION ITEMS (Next 7 Days)

**Day 1-2: Schema Markup**
- [ ] Add Organization schema to all pages
- [ ] Add FAQ schema to 15 existing articles
- [ ] Add Review schema
- [ ] Verify hard-coded disclaimers

**Day 3-4: Glossary Foundation**
- [ ] Create /glossary/ directory
- [ ] Build glossary index page
- [ ] Write 20 high-priority terms
- [ ] Link from existing articles

**Day 5-7: First Unique Data Article**
- [ ] Draft "Peptide Vendor Comparison: What We Found"
- [ ] Use your actual sourcing/testing data
- [ ] Include screenshots/evidence
- [ ] Optimize for "peptide vendor comparison 2026"

**Ongoing This Week:**
- [ ] Finish vendor/quality cluster internal linking
- [ ] Add product page → blog links
- [ ] Update PRC → Vantix links to citation format
- [ ] Create first calculator (reconstitution for all peptides)

---

## SUCCESS CRITERIA

**Month 3:**
- 30-50 visitors/day
- 30+ indexed pages
- 2-3 backlinks
- 5+ minutes avg dwell time

**Month 6:**
- 100-150 visitors/day
- 50+ indexed pages
- 5-10 backlinks
- 3-5 featured snippets
- 2-3 conversions/week from organic

**Month 12:**
- 200-500 visitors/day
- 100+ indexed pages
- 15-25 backlinks
- 10+ featured snippets
- 10-15 conversions/week from organic
- Branded searches increasing

---

## COMPETITIVE ADVANTAGES

**What Others Don't Have:**
1. Dual-brand authority flow (PRC → Vantix)
2. ISO 17025 testing positioning (unique)
3. Topic cluster depth (15-30 articles per peptide)
4. Interactive tools (calculators, lookup systems)
5. Unique vendor data
6. Reddit credibility (109 karma, helpful expert)
7. Consistent publishing (4/week for 12 months)

**This Strategy Wins Because:**
- Realistic timeline (no false hope)
- User signals prioritized (breaks sandbox faster)
- Information gain focus (unique data)
- Topic depth (15-30 articles per cluster)
- Technical trust signals (schema, tools, data)
- Dual-brand moat (hard to replicate)

**Estimated Total Work:**
- 200+ articles over 12 months
- 10+ interactive tools
- 50+ glossary entries
- 10-20 backlinks
- Ongoing optimization

**Expected Result:** Dominant topical authority in research peptides by Month 12.
