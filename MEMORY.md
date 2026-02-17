# MEMORY.md

## 2026-02-12 — Day One
- First session. Frabrizio wants a peptide business focused co-pilot.
- Target: $100k/month revenue.
- My role: strategic operator, not cheerleader. Push for execution.
- **Rob Sandie** is Frabrizio's trusted business advisor. In Telegram groups with us.

## Business: Peptide Resource Center
- URL: peptideresourcecenter.com (Wix), planning prcpeptides.com (WooCommerce)
- Entity: Kikiriki Beauty & Wellness → filing as **PRC Labs LLC** (CA)
- Revenue: ~$3k/month, 20+ products, avg price ~$40
- Payment: manual Venmo/PayPal (no integrated checkout yet)
- Sourcing: China
- No LLC, no business bank account yet — both in progress

## Two-Site Strategy (CONFIRMED — don't flip on this)
- **peptideresourcecenter.com (Wix)**: resource center, blog, SEO content, tools (comparison/vendor dir/calculator), education. All content lives here.
- **prcpeptides.com (WooCommerce)**: pure shop — products, cart, checkout, accounts. NO blog/content.
- Reddit/forum links → always to resource center, never shop
- Funnel: SEO/Reddit → Resource Center → Trust → Shop
- Wix is fine for RC (free, functional). Don't overthink hosting until revenue justifies it.

## Frabrizio Personal
- Legal name: Michael Velazquez
- Address: 140 Vernon St, Apt 18, Santa Cruz, CA 95060
- Phone: +1.6195871812
- Namecheap account: mkvelazquez@outlook.com
- Traveling in Paris until Feb 24, 2026

## Hosting & Infrastructure
- **CUSTOM BUILD** — Rob pushed, I agreed. No WooCommerce, no SiteGround, no WordPress.
- Stack: Static frontend (GitHub Pages, $0) + lightweight backend for orders
- **Email:** support@prcpeptides.com → forwards to prcpeptides@gmail.com (Namecheap redirect) — **WORKING ✅** (set up Feb 16)
- **Coinbase Commerce** — **SET UP ✅** (Feb 16). API key in /workspace/.env. Display name: PRC Peptides.
- **Payment stack**: Coinbase Commerce (crypto) → Zelle/CashApp (existing) → ACH via Plaid (future) → Debit-only (future)
- **Total monthly hosting cost: $0**

## Shop Mockup (prcpeptides_mockup.html)
- Deployed at: https://frabrizio22.github.io/prc-tools/shop.html
- Category color psychology: GLP=Blue, Tissue=Green, GH=Orange, Metabolic=Red, Antioxidants=Purple, Neuro=Cyan, Longevity=Gold, Melanocortin=Pink, Cosmetic=Magenta, Advanced=Gray
- Products ordered by market demand (GLP first)
- 18+ age gate required
- Shop policies written: shop_policies.md

## Checkout System (prcpeptides.com)
- **Custom checkout LIVE** — checkout.html on GitHub Pages
- Flow: Age gate → Cart → Customer info → Shipping → Payment → Confirmation
- Payments: Crypto (Coinbase Commerce manual link for now), Zelle (5% off), CashApp (5% off)
- Shipping: $9.99 standard, $19.99 expedited, FREE over $150
- Order numbers: PRC-XXXXX format
- Email notification via mailto: to support@prcpeptides.com
- Shop "Order Now" buttons link to checkout.html?product=X&price=Y
- No sales tax for now — revisit at $10k/month
- Zelle account: support@prcpeptides.com (NEEDS VERIFICATION)
- CashApp: $PRCPeptides (NEEDS VERIFICATION)
- Future: Cloudflare Worker for automatic Coinbase Commerce charge creation

## Key Decisions
- LLC name: PRC Labs LLC (neutral, won't flag banks) — **FILED ✅** via Tailor Brands
- Domain: **prcpeptides.com PURCHASED ✅** — Namecheap, $0.00 first year (promo), order #194824031, Feb 15 2026. Domain Privacy enabled. Registered under PRC Labs LLC.
- Email: support@prcpeptides.com
- Payment processors: Durango, PaymentCloud, eMerchantBroker + Coinbase Commerce
- Don't migrate Wix yet — fix it in place, build new store separately
- Frabrizio doesn't want Fiverr — I'm doing the work
- **Frabrizio does NOT want to do social media** — prefers SEO + email + referral strategy; I write all content
- Canva (free) for visual content — full brand guide created

## Competitor Checkout Research (Feb 15)
- **Core Peptides**: WooCommerce, credit cards (high-risk processor), 103 products, volume discounts
- **Biotech Peptides**: WooCommerce, credit cards, customer reviews as social proof
- **Limitless Peptides**: Shopify (risky — could get shut down), ~20 products, premium positioning
- All three accept credit cards, none offer crypto — opportunity for PRC
- Simple checkout flows — bar is low for us to beat

## Competitive Intelligence
- Price comparison tool: 81 products, 26 vendors — massive SEO asset
- Almost all vendor discount codes are "Kikiriki" (girlfriend's affiliate deals)
- PRC price wins: NAD+ 1000mg (70% cheaper), Cerebrolysin (41%), PE 22-28 (40%)
- PRC overpriced: Selank, Thymalin, Sermorelin vs competitors
- High-demand gaps to fill: BPC-157, TB-500, Tesamorelin, CJC-1295, Ipamorelin

## Business Email
- **prcpeptides@gmail.com** — main business Google account (created Feb 13)
- Use for: Analytics, Search Console, Namecheap, business correspondence

## GitHub
- Account: **Frabrizio22** (authenticated via gh CLI)
- Repo: github.com/Frabrizio22/prc-tools
- Comparison tool live: https://frabrizio22.github.io/prc-tools/

## Content Created
- content_samples.md — 3 blog posts, 10 social posts, 3 emails, 2 Reddit answers
- canva_brand_guide.md — full brand guide with colors, fonts, template specs
- price_comparison_final.csv — cleaned comparison tool
- price_comparison_analysis.md — competitive analysis
- product_descriptions.md — rewritten product descriptions

## Reconstitution Calculator
- Built into Resources tab on site mockup
- Calculates concentration, volume to draw, doses per vial, vial duration
- iOS Safari needs type="text" inputmode="decimal" (not type="number") for reliable input events

## Jessie Design Feedback (Feb 13)
- Called current mockup "trash" — looks like 200 other websites
- Wants: font variety, cohesive themes, dynamic movement, visual engagement, personality
- She wants PRC to STAND OUT with its own identity
- Need her to send screenshots of sites she likes — fastest path to her vision
- Real design polish belongs on WooCommerce, not static mockup

## Brand Slogans
- **Shop (prcpeptides.com)**: "No hype. Just peptides."
- **Resource Center (peptideresourcecenter.com)**: "The vendor that reviews vendors." (saved for future use)
- Sub-agent generated 20+ candidates; Frabrizio chose #2 from top 5 list

## Shop Mockup Design Rules (learned through iterations)
- Hero + Trust bar + Promo bar must each have DISTINCT jobs — no repeating info
- Trust bar: light gray bg with green ✓ checkmarks (not dark — avoids 3 dark bars stacked)
- Product cards: no left borders, no description bubbles, clean white with subtle hover
- Category labels: plain colored text, NO background/border badges
- Filter pills: sticky, short labels (GLP, Neuro, etc.)
- Footer: dark navy, bookends with promo bar
- Mobile-first always — 73%+ traffic is mobile
- Products directly on homepage (standard for <100 item catalogs)
- PRC ships next business day (confirmed)
- Latest shop commit: `0f18791`

## prcpeptides.com — LIVE
- Custom domain pointed to GitHub Pages, CNAME file in repo
- index.html = copy of shop.html (MUST STAY IN SYNC)
- SSL cert provisioned by GitHub (check if HTTPS working)

## Order System (FULLY WIRED)
- Cloudflare Worker: creates Coinbase charges (crypto) + sends Telegram notifications + logs to Google Sheet + triggers customer email
- Google Apps Script URL: https://script.google.com/macros/s/AKfycbzw7r3qHQR3rPiYlCEWl-eFmzlIUKdYLNOPzbKM--pD6k6WZNVAEct95d8ks2NyXZLp_g/exec
- Google Sheet "PRC Orders": Dashboard + Orders (status dropdown) + Products tabs
- Customer gets branded HTML email with order details + payment instructions
- Frabrizio gets instant Telegram notification with full order details
- Telegram secrets stored in Cloudflare Worker (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)

## Sourcing
- Buys from Alibaba contact — NOT direct from manufacturer. Don't claim "direct from manufacturer."

## Jessie Content Boundaries
- Comparison tool, vendor directory, calculators = Jessie's ideas/content
- Don't use in resource center without her
- Focus on shop + Reddit, skip resource center for now

## 44 Product Pages
- Built at /prc-tools/products/*.html (e.g. prcpeptides.com/products/semaglutide.html)
- Shop.html not yet linked to product pages — still uses modals
- Rob pushed for individual pages + product graphics

## Reddit
- Username: **PeptideResearchGuy** (prcpeptides@gmail.com)
- Subs: r/peptides, r/Peptidesource, r/SARMs, r/Nootropics
- Strategy: lurk 2 days → helpful comments → casually mention PRC

## Affiliate Revenue
- **26 affiliate vendors** with links/codes in vendor directory + comparison tool
- 4 referral-tracked URLs (EZ, FelixChem, Ignition, RetaOne)
- 25 discount codes (mostly "Kikiriki" variants)
- Vendor names styled blue = clickable, non-affiliate stays black
- All verified against Frabrizio's .docx source file

## Telegram Groups
- DM: 513307658
- "PRC" (Frabrizio + girlfriend Jessie + bot): -5185517505
- "Frabrizio, Rob and PRC Concierge": -5264206095
- "Frabrizination": -1003739387892

## Girlfriend
- Name: Jessie (Telegram: "Jessie Pickleball")
- Built the original PRC brand, customer base, product knowledge, sourcing
- Frabrizio is building business infrastructure to impress her with results
- **Jessie controls Wix site login** — Frabrizio can't add links without her
- PRC can reach $10k/month WITHOUT resource center if Jessie doesn't collaborate
- DO NOT share personal DM conversations in group chats
- Be strictly business in the PRC group
