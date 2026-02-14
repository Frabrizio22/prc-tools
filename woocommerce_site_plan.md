# PRC Peptides WooCommerce Site Plan
## prcpeptides.com

**Document Version:** 1.0  
**Date:** February 12, 2026  
**Site Type:** Research Peptide Supplier (B2B/Research Only)  
**Platform:** WordPress + WooCommerce

---

## 1. SITE STRUCTURE & PAGES

### Core Pages

#### 1.1 Homepage (`/`)
- **Purpose:** Convert visitors, establish credibility, guide to products
- **Key Elements:** Hero section, trust signals, featured products, educational content
- **CTAs:** "Browse Research Peptides", "View Lab Results", "Learn More"

#### 1.2 Shop / Product Catalog (`/shop`)
- **Layout:** Grid view (3-4 columns desktop, 1-2 mobile)
- **Filtering:** By category, purity grade, price, availability
- **Sorting:** Name, price, newest, popularity
- **Search:** Prominent search bar with autocomplete
- **Pagination:** 24 products per page
- **Sticky Filter Sidebar** (desktop)

#### 1.3 Individual Product Page (`/product/[slug]`)
- **Template Structure:** See Section 5 for detailed breakdown
- **URL Structure:** `/product/bpc-157-10mg/`
- **Related Products:** "Other researchers also viewed"

#### 1.4 About Us (`/about`)
- **Content:**
  - Company mission and values
  - Research focus and expertise
  - Quality assurance process
  - Laboratory partnerships
  - Team credentials (if applicable)
  - Timeline/history
- **Trust Elements:** Certifications, accreditations, partnerships

#### 1.5 FAQ (`/faq`)
- **Categories:**
  - Ordering & Shipping
  - Product Information & Quality
  - Research Compliance
  - Payment & Security
  - Storage & Handling
  - Returns & Refunds
- **Format:** Accordion-style, searchable
- **Compliance Focus:** Heavy emphasis on "research only" throughout

#### 1.6 Legal Disclaimers (`/disclaimers`)
- **Sections:**
  - Research Use Only Statement
  - No Medical Claims
  - Regulatory Status
  - User Responsibility
  - Liability Limitations
  - Export Restrictions
- **Accessibility:** Linked in footer and product pages

#### 1.7 Terms of Service (`/terms`)
- **Content:**
  - Acceptance of terms
  - Eligibility requirements (age, purpose)
  - Account responsibilities
  - Prohibited uses
  - Intellectual property
  - Dispute resolution
  - Governing law
- **Requirement:** Must be accepted at checkout

#### 1.8 Refund/Return Policy (`/refund-policy`)
- **Clear Structure:**
  - Return eligibility (unopened, sealed products only)
  - Time windows (e.g., 30 days)
  - Damaged goods process
  - Shipping cost responsibility
  - Non-returnable items
  - Refund processing time
  - Store credit options

#### 1.9 Contact (`/contact`)
- **Elements:**
  - Contact form (name, email, subject, message)
  - Business email address
  - Business hours
  - Estimated response time
  - Support ticket system link (optional)
  - **NO phone number** (reduces liability and unqualified inquiries)

#### 1.10 COA / Lab Results (`/lab-results`)
- **Purpose:** Build trust, show transparency
- **Structure:**
  - Searchable database of Certificates of Analysis
  - Filter by product, batch number, date
  - PDF downloads
  - HPLC/MS test results
  - Purity percentages
  - Third-party lab verification badges
- **Access:** Public or account-holders only (recommended: public for transparency)

#### 1.11 Cart (`/cart`)
- **WooCommerce Default** with modifications:
  - Age verification reminder banner
  - Research compliance checkbox (required)
  - Estimated shipping times
  - Apply coupon field
  - Save cart feature (for logged-in users)

#### 1.12 Checkout (`/checkout`)
- **Custom Requirements:**
  - Research purpose verification
  - Age confirmation (21+)
  - Terms acceptance checkboxes
  - Guest checkout option (but encourage account)
  - Multiple payment methods visible
  - SSL security badges

### Supporting Pages

#### 1.13 My Account (`/my-account`)
- Order history
- Saved payment methods
- Shipping addresses
- Download COAs for past orders
- Account details
- Logout

#### 1.14 Privacy Policy (`/privacy-policy`)
- Data collection practices
- Cookie usage
- Third-party services
- GDPR/CCPA compliance
- Data retention
- User rights

#### 1.15 Shipping Information (`/shipping`)
- Domestic/international options
- Processing times
- Carrier information
- Tracking
- Shipping restrictions by state/country
- Packaging standards (discreet, temperature-controlled if needed)

#### 1.16 Blog/Educational Resources (`/blog`) [Optional but Recommended]
- Research articles
- Peptide guides
- Storage tips
- Study references
- SEO content to drive traffic
- **Strict compliance:** No health claims, only research data

---

## 2. WORDPRESS THEME RECOMMENDATION

### Top 3 Theme Comparison

#### **Option 1: Astra (FREE version)**
- **Cost:** Free (Pro version $59/year optional)
- **WooCommerce:** Native integration, optimized layouts
- **Performance:** Lightweight (<50KB), fast load times
- **Mobile-First:** Fully responsive, touch-optimized
- **Customization:** Extensive via WordPress Customizer
- **Page Builder:** Compatible with Elementor, Beaver Builder
- **Pros:** 
  - Clean, professional design
  - Excellent documentation
  - Large user base (support community)
  - Regular updates
  - WCAG 2.0 accessibility ready
- **Cons:** 
  - Some premium features locked behind paywall
  - Requires customization out-of-box

#### **Option 2: Kadence (FREE version)**
- **Cost:** Free (Premium $129/year)
- **WooCommerce:** Excellent WooCommerce starter templates
- **Performance:** Built for speed, Core Web Vitals optimized
- **Mobile-First:** Advanced responsive controls
- **Customization:** Built-in header/footer builder
- **Page Builder:** Native block editor, works with others
- **Pros:**
  - More features in free version than Astra
  - Modern design aesthetic
  - Great typography controls
  - No jQuery dependency (faster)
- **Cons:**
  - Slightly steeper learning curve
  - Fewer third-party integrations than Astra

#### **Option 3: Storefront (FREE, by WooCommerce)**
- **Cost:** 100% Free
- **WooCommerce:** Official WooCommerce theme, perfect integration
- **Performance:** Lightweight, optimized
- **Mobile-First:** Responsive design
- **Customization:** Basic, requires CSS knowledge for heavy customization
- **Page Builder:** Works with most builders
- **Pros:**
  - Guaranteed WooCommerce compatibility
  - Long-term support assured
  - Simple, no-bloat approach
  - Deep WooCommerce hooks access
- **Cons:**
  - Basic design out-of-box
  - Limited built-in customization
  - Requires child theme for serious changes

### **RECOMMENDATION: Kadence (Free Version)**

**Why Kadence wins for PRC Peptides:**

1. **Best balance of features vs. cost** - Free version includes header builder, which is critical for custom trust signals and disclaimers
2. **Performance-focused** - Research chemical sites need fast load times for credibility
3. **Modern aesthetic** - Looks professional without customization, builds trust
4. **Mobile-first controls** - Better mobile experience out-of-box than Astra free
5. **Native block editor optimization** - Future-proof as WordPress moves away from page builders
6. **WooCommerce starter templates** - Can launch faster with pre-built shop layouts

**Implementation Notes:**
- Use Kadence's WooCommerce shop template as starting point
- Customize header to include age/research disclaimers
- Use Kadence blocks for homepage sections
- Upgrade to Kadence Pro later if needed for advanced features (conversions module, dynamic content)

---

## 3. ESSENTIAL PLUGINS LIST

### Core E-Commerce (Required)

#### 3.1 **WooCommerce** (Free)
- **Purpose:** Core shop functionality
- **Configuration:**
  - Enable guest checkout
  - Require account for COA downloads
  - Set weight units, currency (USD)
  - Configure tax rules (research chemicals often exempt, but check jurisdiction)

#### 3.2 **WooCommerce Stripe Gateway** (Free)
- **Purpose:** Credit/debit card processing
- **Notes:** 
  - Stripe may flag peptide businesses as "high-risk"
  - Have backup processor ready
  - Configure 3D Secure for fraud protection

#### 3.3 **Coinbase Commerce for WooCommerce** (Free)
- **Purpose:** Cryptocurrency payments (BTC, ETH, USDC, etc.)
- **Why Critical:** 
  - Many traditional processors ban peptide sales
  - Crypto provides payment redundancy
  - Growing customer preference in research chemical space
- **Integration:** Official Coinbase Commerce plugin

#### 3.4 **Payment Gateway for High-Risk Merchants**
- **Options:**
  - **NMI Gateway** (requires merchant account)
  - **Authorize.net** (may accept with proper documentation)
  - **PayPal Alternative:** Consider **Venmo for Business** or **Square** (review terms carefully)
- **Implementation:** Use generic WooCommerce gateway plugin or custom integration
- **Critical:** Disclose business nature upfront to avoid account freezes

### Security & Compliance (Required)

#### 3.5 **Wordfence Security** (Free version sufficient)
- **Purpose:** Firewall, malware scanning, login security
- **Configuration:**
  - Enable 2FA for admin accounts
  - Set up email alerts for suspicious activity
  - Block common attack IPs
  - Rate-limit login attempts

#### 3.6 **Really Simple SSL** (Free)
- **Purpose:** Force HTTPS across entire site
- **Why:** Required for payment processing, builds trust

#### 3.7 **Age Gate** or **Age Verification** (Free options available)
- **Plugin:** "Age Verification" by Chase Wiseman (free)
- **Configuration:**
  - Set minimum age: 21
  - Gate entire site (homepage popup)
  - Cookie-based (24hr expiry)
  - Require checkbox: "I am 21+ and purchasing for research purposes only"
  - Log verifications (optional, for compliance)
- **Alternative:** Custom implementation (see Section 7)

### Performance & Optimization (Required)

#### 3.8 **WP Rocket** (Paid, $59/year) **OR** **LiteSpeed Cache** (Free)
- **Purpose:** Caching, minification, lazy loading
- **Why WP Rocket:** 
  - Best-in-class performance
  - Easy setup
  - WooCommerce-specific optimizations
  - Worth the investment for conversion rates
- **Why LiteSpeed Cache:**
  - Free and powerful
  - Requires LiteSpeed server (check hosting)
  - More complex setup
- **Recommendation:** **WP Rocket** for ease + performance

#### 3.9 **Imagify** (Free tier + paid) **OR** **ShortPixel** (Free tier + paid)
- **Purpose:** Image optimization, WebP conversion
- **Configuration:**
  - Compress all product images
  - Convert to WebP
  - Lazy loading (if not using WP Rocket)
- **Free Tier:** Usually sufficient for small catalogs

#### 3.10 **Autoptimize** (Free) [Optional if using WP Rocket]
- **Purpose:** Minify CSS/JS, optimize delivery
- **Use Case:** If using LiteSpeed Cache instead of WP Rocket

### SEO & Marketing (Required)

#### 3.11 **Rank Math SEO** (Free) **OR** **Yoast SEO** (Free)
- **Purpose:** On-page SEO, sitemaps, schema markup
- **Why Rank Math:** 
  - More features in free version
  - Better WooCommerce integration
  - Built-in schema for products
- **Configuration:**
  - Set up product schema
  - XML sitemaps
  - Meta title/description templates
  - Breadcrumbs

#### 3.12 **MailerLite** (Free up to 1,000 subscribers) **OR** **Mailchimp for WooCommerce** (Free tier)
- **Purpose:** Email capture, newsletter, abandoned cart
- **Implementation:**
  - Popup for email capture (offer 10% off first order)
  - Abandoned cart emails
  - Order follow-up sequence
  - New product announcements
- **Compliance:** Include clear research-only messaging in all emails

#### 3.13 **OptinMonster** (Paid, $9/month) [Optional but Recommended]
- **Purpose:** Advanced email capture, exit-intent popups
- **Use Case:** Higher conversion rates justify cost
- **Alternative Free:** "Popup Maker" plugin

### Customer Experience (Recommended)

#### 3.14 **WooCommerce PDF Invoices & Packing Slips** (Free)
- **Purpose:** Auto-generate invoices, include disclaimers
- **Configuration:**
  - Add research-only disclaimer to all invoices
  - Include COA links in packing slips
  - Professional branding

#### 3.15 **WooCommerce Advanced Product Labels** (Free)
- **Purpose:** "Research Only", "New", "Popular" badges on products
- **Implementation:**
  - "RESEARCH USE ONLY" label on all products
  - "Third-Party Tested" badge
  - "New Batch" labels

#### 3.16 **YITH WooCommerce Wishlist** (Free)
- **Purpose:** Let researchers save products for later
- **Why:** Long research purchase cycles, helps retention

#### 3.17 **WooCommerce Product Search** (Free version sufficient)
- **Purpose:** Enhanced search with autocomplete
- **Configuration:**
  - Search by product name, SKU, CAS number
  - Thumbnail preview in autocomplete

### Technical Utilities (Recommended)

#### 3.18 **WP Rollback** (Free)
- **Purpose:** Rollback plugins/themes if updates break site
- **Why:** Safety net for production site

#### 3.19 **UpdraftPlus** (Free)
- **Purpose:** Automated backups to cloud storage
- **Configuration:**
  - Daily database backups
  - Weekly full site backups
  - Store on Google Drive or Dropbox

#### 3.20 **WP File Manager** (Free)
- **Purpose:** Manage files without FTP
- **Use Case:** Quick access to upload COA PDFs, product images

### Legal & Compliance (Recommended)

#### 3.21 **WP Terms Popup** (Free)
- **Purpose:** Force terms acceptance before purchase
- **Configuration:**
  - Popup at checkout
  - Require checkbox
  - Log acceptance with order data

#### 3.22 **GDPR Cookie Consent** (Free)
- **Purpose:** Cookie consent banner
- **Configuration:**
  - Simple accept/reject
  - Link to privacy policy
  - EU visitor detection

---

## 4. HOMEPAGE WIREFRAME (Text-Based)

### Layout Structure: Mobile-First

#### **SECTION 1: Above the Fold (First Screen)**

```
┌─────────────────────────────────────────┐
│  [AGE VERIFICATION MODAL OVERLAY]       │
│  - First-time visitors only             │
│  - "Are you 21 or older?" + Checkbox    │
│  - "Research purposes only" disclaimer  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ HEADER (Sticky)                         │
│ ├─ Logo (left): "PRC Peptides"        │
│ ├─ Search Bar (center, mobile: hidden)│
│ ├─ Icons (right): Account | Cart      │
│ └─ [RESEARCH USE ONLY DISCLAIMER BAR] │
│    (Red/Orange, small text, site-wide) │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ NAVIGATION (Below header)               │
│ Shop | Lab Results | About | FAQ | Blog│
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ HERO SECTION                            │
│                                         │
│  Headline (Large, Bold):                │
│  "Premium Research Peptides"           │
│  "Third-Party Tested. 99%+ Purity."    │
│                                         │
│  Subheadline:                           │
│  "For qualified researchers and        │
│   institutions. Not for human use."    │
│                                         │
│  [CTA Button 1: "Browse Catalog"]      │
│  [CTA Button 2: "View Lab Results"]    │
│                                         │
│  Background: Clean lab imagery or      │
│  subtle molecular structure graphics   │
└─────────────────────────────────────────┘
```

**Above-the-Fold Strategy:**
- **Immediate clarity:** What you sell, who it's for
- **Trust signal:** "Third-Party Tested" in hero text
- **Compliance:** "Not for human use" visible immediately
- **Dual CTAs:** Shop (conversion) + Lab Results (trust-building)

---

#### **SECTION 2: Trust Signals Bar**

```
┌─────────────────────────────────────────┐
│ TRUST SIGNALS (Icon Row)               │
│ ├─ ✓ 99%+ Purity                       │
│ ├─ ✓ Third-Party Tested                │
│ ├─ ✓ Fast Shipping                     │
│ ├─ ✓ Secure Payment                    │
│ └─ ✓ COA Available                     │
└─────────────────────────────────────────┘
```

**Placement:** Directly below hero  
**Style:** Icons + short text, single-row scroll on mobile  
**Purpose:** Overcome objections immediately

---

#### **SECTION 3: Featured/Popular Products**

```
┌─────────────────────────────────────────┐
│ FEATURED PRODUCTS                       │
│ Heading: "Popular Research Compounds"  │
│                                         │
│ [Product Grid: 3-4 columns desktop,   │
│  1-2 columns mobile, horizontal scroll]│
│                                         │
│ Each Product Card:                      │
│ ┌──────────────┐                       │
│ │ Product Image│ "RESEARCH ONLY" badge │
│ ├──────────────┤                       │
│ │ Product Name │                       │
│ │ (e.g., BPC-157 5mg)                 │
│ │ ★★★★★ (23 reviews)                  │
│ │ $XX.XX                               │
│ │ [Add to Cart]                        │
│ │ [Quick View]                         │
│ └──────────────┘                       │
│                                         │
│ [View All Products →]                  │
└─────────────────────────────────────────┘
```

**Product Count:** 4-8 products  
**Sorting:** Best-sellers or manually curated  
**CTA:** "View All Products" button below grid

---

#### **SECTION 4: Value Proposition / Why Choose Us**

```
┌─────────────────────────────────────────┐
│ WHY RESEARCHERS CHOOSE PRC PEPTIDES     │
│                                         │
│ Three-column grid (stacks on mobile):  │
│                                         │
│ [Icon: Lab Flask]                      │
│ **Third-Party Verified**               │
│ Every batch independently tested with  │
│ publicly available COAs.               │
│                                         │
│ [Icon: Certificate]                    │
│ **99%+ Purity Guaranteed**             │
│ HPLC/MS verified. No fillers or        │
│ contaminants.                           │
│                                         │
│ [Icon: Shipping Box]                   │
│ **Fast, Discreet Delivery**            │
│ Climate-controlled packaging.          │
│ Ships within 24-48 hours.              │
└─────────────────────────────────────────┘
```

**Purpose:** Reinforce trust, differentiate from competitors  
**Style:** Icons, bold headlines, 2-3 sentence descriptions

---

#### **SECTION 5: Educational/Blog Highlights** [Optional]

```
┌─────────────────────────────────────────┐
│ RESEARCH INSIGHTS                       │
│ Heading: "Latest from Our Lab"         │
│                                         │
│ [Card 1] [Card 2] [Card 3]             │
│ Blog post previews with thumbnails     │
│ (e.g., "Understanding Peptide Storage")│
│                                         │
│ [Visit Blog →]                         │
└─────────────────────────────────────────┘
```

**Purpose:** SEO value, position as authority  
**Note:** All content must be research-focused, no health claims

---

#### **SECTION 6: Social Proof / Testimonials**

```
┌─────────────────────────────────────────┐
│ WHAT RESEARCHERS SAY                    │
│                                         │
│ Carousel of 3-5 testimonials:          │
│                                         │
│ "Excellent purity and fast shipping.   │
│  COAs match product perfectly. Will    │
│  order again for our lab."             │
│  — Dr. [Initial], Research Institution │
│                                         │
│ [← →] Navigation dots                  │
└─────────────────────────────────────────┘
```

**Critical:** Only use testimonials that emphasize research use  
**Style:** Rotating carousel or static grid  
**Anonymization:** Use initials only for privacy

---

#### **SECTION 7: Newsletter Signup**

```
┌─────────────────────────────────────────┐
│ STAY INFORMED                           │
│ "Get research updates and exclusive    │
│  offers for qualified researchers."    │
│                                         │
│ [Email input field]  [Subscribe Button]│
│                                         │
│ "We respect your privacy. Research     │
│  offers only. No spam."                │
└─────────────────────────────────────────┘
```

**Purpose:** Email capture for marketing  
**Incentive:** "10% off your first order" (optional)  
**Placement:** Before footer

---

#### **SECTION 8: Footer**

```
┌─────────────────────────────────────────┐
│ FOOTER                                  │
│                                         │
│ Four-column grid (stacks on mobile):   │
│                                         │
│ SHOP              COMPANY              │
│ - All Products    - About Us            │
│ - New Arrivals    - Lab Results         │
│ - Best Sellers    - Contact             │
│                                         │
│ SUPPORT           LEGAL                 │
│ - FAQ             - Terms of Service    │
│ - Shipping Info   - Disclaimers         │
│ - Return Policy   - Privacy Policy      │
│                                         │
│ CONTACT                                 │
│ - Email: support@prcpeptides.com       │
│ - Hours: Mon-Fri 9am-5pm PST           │
│                                         │
│ [Social Icons: minimal, professional]  │
│                                         │
│ ───────────────────────────────────────│
│ © 2026 PRC Peptides. All rights        │
│ reserved. Products for research use    │
│ only. Not for human consumption.       │
│                                         │
│ [Payment Icons: Visa, MC, Crypto]      │
│ [Security Badge: SSL Secured]          │
└─────────────────────────────────────────┘
```

**Footer Strategy:**
- Comprehensive navigation (SEO value)
- Legal links prominent and accessible
- Compliance disclaimer repeated
- Trust signals (payment options, security)

---

### CTA Placement Summary

| CTA | Placement | Priority |
|-----|-----------|----------|
| Browse Catalog | Hero (primary) | High |
| View Lab Results | Hero (secondary) | Medium |
| Add to Cart | Product cards | High |
| View All Products | Below featured products | Medium |
| Subscribe | Newsletter section | Low |

### Trust Signal Strategy

**Where Trust Signals Appear:**
1. **Header bar:** Research-only disclaimer (always visible)
2. **Hero section:** "Third-Party Tested" callout
3. **Trust bar:** Icon row below hero
4. **Why Choose Us:** Detailed value props
5. **Footer:** Payment/security icons, compliance text
6. **Product pages:** Individual trust badges

**Principle:** Repeat trust-building elements without overwhelming. Every section should have at least one trust signal.

---

## 5. PRODUCT PAGE TEMPLATE

### Product Page Layout (Top to Bottom)

#### **5.1 Breadcrumbs**
```
Home > Shop > Peptides > BPC-157 > BPC-157 10mg
```
- **Purpose:** Navigation, SEO
- **Style:** Small, gray text above product title

---

#### **5.2 Product Title & Compliance Badge**

```
┌─────────────────────────────────────────┐
│ [RESEARCH USE ONLY BADGE - Prominent]  │
│                                         │
│ BPC-157 (Body Protection Compound)     │
│ 10mg Vial                               │
│                                         │
│ ★★★★★ (47 reviews) | SKU: BPC-157-10  │
└─────────────────────────────────────────┘
```

**Badge Placement:** Top-right or floating above title  
**Title Style:** H1, clear and descriptive  
**Star Rating:** Link to reviews section

---

#### **5.3 Product Gallery (Left Column, Desktop)**

```
┌─────────────────────────────────────────┐
│ PRODUCT IMAGES                          │
│                                         │
│ [Main Image - Large]                   │
│ - Product vial                          │
│ - Professional lighting                 │
│ - Zoomable on click/hover              │
│                                         │
│ [Thumbnail Strip Below]                │
│ [Img1] [Img2] [Img3] [Img4]            │
│ - Product angles                        │
│ - Packaging                             │
│ - COA preview                           │
│ - Molecular structure (optional)       │
└─────────────────────────────────────────┘
```

**Image Requirements:**
- High resolution (min 1000x1000px)
- White or lab background
- Professional photography
- Include packaging shot
- COA thumbnail with "Click to View Full COA"

**Mobile:** Swipeable gallery, pinch-to-zoom

---

#### **5.4 Product Information Panel (Right Column, Desktop)**

```
┌─────────────────────────────────────────┐
│ PRODUCT INFO PANEL                      │
│                                         │
│ Price: $89.99                           │
│ (Bulk pricing available - see below)   │
│                                         │
│ Purity: 99.2% (HPLC Verified)          │
│ Batch #: 2026-02-001                    │
│ [View Certificate of Analysis →]       │
│                                         │
│ In Stock | Ships within 24-48 hours    │
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ Quantity: [- 1 +]                │   │
│ │ [Add to Cart - Large Button]    │   │
│ │ [Add to Wishlist - Link]        │   │
│ └─────────────────────────────────┘   │
│                                         │
│ ✓ Third-Party Tested                   │
│ ✓ No Fillers or Additives              │
│ ✓ Stored at Optimal Temperature        │
│ ✓ Secure Checkout                      │
│                                         │
│ FREE shipping on orders over $150      │
│                                         │
│ ⚠ DISCLAIMER:                          │
│ This product is for research use only. │
│ Not for human or veterinary use.       │
└─────────────────────────────────────────┘
```

**Key Elements:**
- **Price:** Large, prominent
- **Purity & Batch:** Transparent, builds trust
- **COA Link:** Direct PDF download or modal
- **Stock Status:** Real-time inventory
- **Quantity Selector:** Plus/minus buttons
- **Add to Cart:** High-contrast button
- **Trust Badges:** Checkmark list
- **Shipping Info:** Clear threshold for free shipping
- **Disclaimer:** Visible but not dominating

---

#### **5.5 Bulk Pricing Table**

```
┌─────────────────────────────────────────┐
│ BULK PRICING                            │
│                                         │
│ 1 vial:    $89.99 each                 │
│ 3 vials:   $84.99 each (Save 6%)       │
│ 5 vials:   $79.99 each (Save 11%)      │
│ 10 vials:  $74.99 each (Save 17%)      │
│                                         │
│ Contact us for institutional pricing.  │
└─────────────────────────────────────────┘
```

**Purpose:** Encourage larger orders, increase AOV (average order value)  
**Implementation:** WooCommerce Dynamic Pricing plugin or custom code

---

#### **5.6 Product Tabs Section (Full Width, Below Columns)**

```
┌─────────────────────────────────────────┐
│ [Description] [Additional Info] [COA]  │
│ [Reviews] [Shipping]                    │
│ ───────────────────────────────────────│
│                                         │
│ TAB CONTENT AREA                        │
│ (Active tab content displays here)     │
│                                         │
└─────────────────────────────────────────┘
```

**Tab 1: Description**
- **Content:**
  - Research applications overview (STRICTLY NO HEALTH CLAIMS)
  - Molecular information (formula, weight, CAS number)
  - Storage instructions
  - Reconstitution guidance (if applicable)
  - Research citations (peer-reviewed studies only)
- **Tone:** Scientific, factual, compliance-focused
- **Example:**
  > "BPC-157 is a synthetic peptide derived from a protective gastric peptide. Research studies have investigated its properties in various experimental models. CAS: 137525-51-0. Molecular Formula: C₆₂H₉₈N₁₆O₂₂. Store at -20°C. Stable for 2 years frozen."

**Tab 2: Additional Information**
- Purity: 99.2% (HPLC)
- Form: Lyophilized powder
- Solubility: Water, saline
- Appearance: White to off-white powder
- Storage: -20°C (freezer)
- Shelf Life: 24 months frozen, 30 days reconstituted (refrigerated)
- Batch Number: 2026-02-001
- Country of Origin: USA

**Tab 3: Certificate of Analysis (COA)**
- Embedded PDF viewer or download link
- Batch-specific COA
- HPLC chromatogram
- Mass spectrometry data
- Purity percentage
- Third-party lab name and accreditation
- Test date
- **Note:** Auto-link COA to batch number

**Tab 4: Reviews**
- **WooCommerce native reviews with moderation**
- Display format:
  - Star rating
  - Reviewer name (initials only option)
  - "Verified Purchase" badge
  - Review text
  - Date
- **Moderation Rules:**
  - Auto-reject reviews mentioning human use
  - Require admin approval
  - Flag health claims for removal
- **Review Guidelines (displayed):**
  > "Please only review the product quality, shipping experience, and research applicability. Do not discuss human or animal use."

**Tab 5: Shipping**
- Processing time (24-48 hours)
- Carrier options (USPS, UPS, FedEx)
- Domestic shipping rates
- International availability (if applicable)
- Packaging standards (temperature-controlled, discreet)
- Tracking information
- Restrictions by state/country

---

#### **5.7 Related Products Carousel**

```
┌─────────────────────────────────────────┐
│ RELATED RESEARCH COMPOUNDS              │
│                                         │
│ [Product Card] [Product Card] [Product │
│  Card] [Product Card]                   │
│                                         │
│ Horizontal scroll/carousel             │
└─────────────────────────────────────────┘
```

**Logic:** 
- Same category products
- Frequently bought together
- Higher purity/different size options

---

#### **5.8 Compliance Footer (Product Page Only)**

```
┌─────────────────────────────────────────┐
│ ⚠ IMPORTANT RESEARCH COMPLIANCE NOTICE │
│                                         │
│ This product is sold strictly for      │
│ non-clinical research and educational  │
│ purposes only. It is not a drug, food, │
│ or cosmetic and may not be misbranded, │
│ misused, or mislabeled as such. These  │
│ products are not intended to diagnose, │
│ treat, cure, or prevent any condition  │
│ or disease. Researchers must be 21+.   │
│                                         │
│ [Full Disclaimers →]                   │
└─────────────────────────────────────────┘
```

**Placement:** Below related products, above site footer  
**Style:** Light background box, caution icon, clear text

---

### Product Page Schema Markup (SEO)

Implement JSON-LD structured data:
- Product name
- Image
- Description
- SKU
- Brand (PRC Peptides)
- Offers (price, availability)
- AggregateRating (reviews)
- **DO NOT include medical claims in schema**

**Plugin:** Rank Math SEO auto-generates this

---

## 6. MOBILE-FIRST DESIGN PRINCIPLES

### Core Philosophy
**"Thumb-First, Context-Aware, Compliance-Visible"**

Research peptide customers often browse on mobile but may purchase on desktop (higher consideration). Mobile experience must build trust and enable easy browsing even if final purchase happens elsewhere.

---

### 6.1 Navigation & Touch Targets

**Principles:**
- **Minimum touch target:** 44x44px (Apple HIG standard)
- **Thumb zone optimization:** Primary actions in bottom 1/3 of screen
- **Sticky elements:** Header with cart icon, "Add to Cart" button on product pages

**Mobile Navigation:**
- **Hamburger menu:** Slide-out from left or right
- **Mega menu categories:** Collapsible accordions
- **Search:** Prominent icon in header, full-width when opened
- **Cart icon:** Always visible in top-right with item count badge

**Implementation:**
```
Mobile Header (Sticky):
[☰ Menu] [🔍 Search] [PRC PEPTIDES Logo] [👤 Account] [🛒 Cart (2)]
                      [RESEARCH USE ONLY bar below]
```

---

### 6.2 Product Grid & Scrolling

**Shop Page (Mobile):**
- **Grid:** 2 columns (not 1, feels too slow; not 3, too cramped)
- **Infinite scroll OR pagination:** User preference (test both)
- **Filters:** Sticky filter button (bottom-right FAB) opens slide-up panel
- **Sorting:** Dropdown at top of page, always accessible

**Product Cards (Mobile):**
- Vertical orientation
- Image: 1:1 ratio (square)
- Title: 2 lines max, truncate with "..."
- Price: Large, bold
- "Add to Cart" button: Full width, high contrast
- "Research Only" badge: Top-right corner, always visible

---

### 6.3 Product Page (Mobile Optimization)

**Layout Changes:**
- **Image gallery:** Full-width swipeable carousel at top
- **Sticky "Add to Cart":** Bar at bottom of screen (remains visible while scrolling)
- **Tabs:** Convert to accordions (less tapping between sections)
- **Quantity selector:** Larger buttons (+/-) for easier thumb control
- **Bulk pricing:** Collapsible/expandable section

**Sticky Add to Cart Bar (Mobile):**
```
┌─────────────────────────────────────────┐
│ $89.99  [- 1 +]  [Add to Cart]         │
└─────────────────────────────────────────┘
```
**Behavior:**
- Appears after user scrolls past initial product info
- Remains visible until checkout
- Tapping price/quantity scrolls back to top

---

### 6.4 Forms & Checkout (Mobile)

**Form Optimization:**
- **Input fields:** Large (min 44px height), adequate spacing between fields
- **Autofill support:** Proper HTML5 autocomplete attributes
- **Field labels:** Always visible (not placeholder-only)
- **Validation:** Inline, real-time (don't wait for submit)
- **Keyboard types:** Numeric for phone/zip, email keyboard for email

**Checkout (Mobile):**
- **One field per row** (not side-by-side)
- **Progress indicator:** Step 1/3, 2/3, 3/3 at top
- **Sticky "Place Order" button:** Always visible at bottom
- **Payment icons:** Visible above fold to show options
- **Trust badges:** Repeat near payment section

**Autofill Support Example:**
```html
<input type="email" autocomplete="email" />
<input type="tel" autocomplete="tel" />
<input type="text" autocomplete="address-line1" />
```

---

### 6.5 Performance Targets (Mobile)

**Core Web Vitals:**
- **LCP (Largest Contentful Paint):** <2.5 seconds
- **FID (First Input Delay):** <100ms
- **CLS (Cumulative Layout Shift):** <0.1

**Strategy:**
- Lazy load images below fold
- Preload hero image and critical CSS
- Defer non-critical JavaScript
- Use WebP images with fallback
- Minimize third-party scripts
- CDN for assets (Cloudflare, BunnyCDN)

**Testing Tools:**
- Google PageSpeed Insights
- WebPageTest.org
- Lighthouse (Chrome DevTools)

---

### 6.6 Typography & Readability (Mobile)

**Font Sizes:**
- **Body text:** 16px minimum (prevents zoom on iOS)
- **Headings:** H1: 28-32px, H2: 24-26px, H3: 20-22px
- **Product titles:** 18-20px
- **Price:** 24-28px (prominent)
- **Disclaimers:** 14px (readable but not dominating)

**Line Height:** 1.5-1.6 for body text (easier to read)  
**Line Length:** 50-75 characters per line (optimal readability)

**Font Choice:**
- **System fonts** (fastest): -apple-system, BlinkMacSystemFont, "Segoe UI"
- **Web fonts** (if branding requires): Maximum 2 font families, 4 total weights
- **Variable fonts:** Consider for performance (one file, multiple weights)

---

### 6.7 Compliance Visibility (Mobile)

**Challenge:** Smaller screens make disclaimers less visible  
**Solution:** Strategic, repeated placement

**Mobile Disclaimer Strategy:**
1. **Age gate:** Full-screen modal (first visit)
2. **Header bar:** Persistent red/orange "RESEARCH USE ONLY" banner
3. **Product pages:** Badge above title + footer notice
4. **Cart page:** Checkbox confirmation before proceeding to checkout
5. **Checkout:** Final acceptance checkbox
6. **Order confirmation:** Disclaimer in email

**Mobile Disclaimer Bar:**
```
┌─────────────────────────────────────────┐
│ ⚠ RESEARCH USE ONLY | 21+ | NO HUMAN USE│
└─────────────────────────────────────────┘
```
**Style:** 
- Small but readable (12-14px)
- High contrast (white text on red/orange)
- Always visible (sticky header component)
- Tappable → opens full disclaimer modal

---

### 6.8 Trust Signals (Mobile)

**Above Fold (Homepage):**
- Trust icons smaller but still visible
- Rotate/carousel if space constrained
- Prioritize: "Third-Party Tested" + "99%+ Purity"

**Product Page (Mobile):**
- Trust badges below Add to Cart button
- Smaller icons (24x24px) with text
- COA link prominent (builds credibility)

**Footer (Mobile):**
- Payment icons stacked (not in a row)
- Security badge (SSL) visible
- Compliance text repeated

---

### 6.9 Touch Gestures & Interactions

**Support Natural Mobile Behaviors:**
- **Swipe:** Product image galleries, carousels
- **Pinch-to-zoom:** Product images (disable if modal zoom is better)
- **Pull-to-refresh:** Not necessary for e-commerce, disable to prevent accidental triggers
- **Long-press:** Could show quick product info (optional advanced feature)

**Avoid:**
- Hover-dependent interactions (no hover on mobile)
- Small clickable areas near screen edges
- Horizontal scrolling for critical content (okay for carousels)

---

### 6.10 Speed Optimization Checklist (Mobile)

- [ ] Implement lazy loading for images
- [ ] Use WebP format with fallback
- [ ] Minify CSS and JavaScript
- [ ] Enable GZIP/Brotli compression
- [ ] Use browser caching (WP Rocket)
- [ ] Reduce server response time (<200ms)
- [ ] Minimize redirects
- [ ] Defer offscreen content
- [ ] Preconnect to third-party domains
- [ ] Remove unused CSS/JS (PurgeCSS)

**Mobile Performance Budget:**
- **Total page weight:** <2MB
- **JavaScript:** <500KB
- **Images:** <1MB (compressed)
- **Fonts:** <200KB

---

## 7. AGE VERIFICATION GATE - BEST PRACTICES

### 7.1 Legal & Compliance Rationale

**Why Age Verification is Critical:**
- Regulatory compliance (21+ requirement for research chemicals)
- Liability protection (demonstrates good-faith effort)
- Terms of Service enforcement
- Industry best practice
- Reduces unqualified customer inquiries

**Legal Note:** Age gates are not foolproof and won't stop determined minors, but they demonstrate reasonable effort and shift liability.

---

### 7.2 Recommended Implementation

#### **Option A: Plugin-Based (Easiest)**

**Plugin:** "Age Verification" by Chase Wiseman (Free)

**Configuration:**
```
- Minimum Age: 21
- Verification Method: Checkbox + Date of Birth
- Cookie Duration: 24 hours
- Scope: Entire site (gate homepage)
- Redirect on Fail: Display message, do not allow entry
- Logging: Optional (stores verification timestamp)
```

**Appearance:**
- Modal overlay (full-screen)
- Cannot be dismissed without verification
- Dark semi-transparent background
- Clear, simple form

**Template:**
```
┌─────────────────────────────────────────┐
│         PRC PEPTIDES                    │
│                                         │
│   AGE & RESEARCH VERIFICATION           │
│                                         │
│   This site sells research chemicals   │
│   for scientific purposes only.        │
│                                         │
│   ☐ I am 21 years of age or older     │
│                                         │
│   ☐ I am purchasing for research       │
│      purposes only, not for human      │
│      or veterinary use.                │
│                                         │
│   Date of Birth: [MM] [DD] [YYYY]     │
│                                         │
│   [Enter Site]   [Exit]                │
│                                         │
│   By entering, you agree to our        │
│   Terms of Service and Disclaimers.    │
└─────────────────────────────────────────┘
```

**Key Elements:**
- Two checkboxes (age + research purpose)
- Date of birth input (optional but recommended for stronger verification)
- Enter/Exit buttons (exit redirects to Google or blank page)
- Terms agreement text
- Cannot bypass without completion

---

#### **Option B: Custom Implementation (More Control)**

**Use Case:** If plugin is insufficient or you want custom branding/logic

**Technical Approach:**
1. **JavaScript-based gate** (client-side)
2. **Cookie storage** (24-hour verification)
3. **Server-side validation** (optional, for checkout enforcement)

**Code Outline:**
```javascript
// Check for verification cookie
if (!getCookie('age_verified')) {
  showAgeGate();
}

function showAgeGate() {
  // Display modal overlay
  // Require checkbox confirmation + DOB
  // Set cookie on successful verification
  // Reload page or remove overlay
}

function getCookie(name) {
  // Standard cookie retrieval
}

function setCookie(name, value, days) {
  // Set cookie with expiration
}
```

**Validation:**
- Calculate age from DOB (must be 21+)
- Both checkboxes must be checked
- Set cookie: `age_verified=true; max-age=86400; secure; samesite=strict`

**WordPress Integration:**
- Add code to theme's `footer.php` or custom plugin
- Enqueue script and styles
- Hook into `wp_footer` action

---

### 7.3 Cookie Duration & Re-Verification

**Recommended Duration:** 24 hours

**Rationale:**
- Too short (session-only): Annoying for users
- Too long (30+ days): May be seen as insufficient for compliance
- 24 hours: Balance between UX and compliance

**Re-verification Triggers:**
- Cookie expiration (24 hours)
- User clears cookies
- Different browser/device
- Incognito/private mode

**Do NOT:**
- Permanently bypass (no "remember me forever")
- Use localStorage without re-verification logic
- Allow IP-based bypass (privacy concerns, ineffective)

---

### 7.4 Failed Verification Handling

**If User is Under 21 or Declines:**

**Option 1: Soft Block**
```
┌─────────────────────────────────────────┐
│   We're sorry, but you must be 21 or   │
│   older and purchasing for research    │
│   purposes to access this site.        │
│                                         │
│   [Exit Site]                           │
└─────────────────────────────────────────┘
```
- Display message, disable "Enter" button
- Only option is to exit

**Option 2: Hard Redirect**
- Automatically redirect to neutral page (e.g., Google, educational resource about research peptides)
- Set a "blocked" cookie to prevent repeated attempts

**Do NOT:**
- Allow multiple attempts without penalty
- Show site content to unverified users
- Use aggressive or judgmental language

---

### 7.5 Mobile Optimization (Age Gate)

**Mobile-Specific Considerations:**
- Full-screen overlay (no way to scroll around it)
- Large touch targets (checkboxes at least 44x44px)
- Large "Enter Site" button (min 48px height)
- Readable font size (16px minimum)
- Date picker: Native mobile date inputs (`<input type="date">`)

**Mobile Date Input:**
```html
<input 
  type="date" 
  max="2005-02-12" 
  required 
  aria-label="Date of Birth"
/>
```
**Note:** `max` attribute dynamically set to 21 years ago

---

### 7.6 Accessibility (Age Gate)

**WCAG 2.1 Compliance:**
- Keyboard navigable (tab through fields, enter to submit)
- Screen reader compatible (proper ARIA labels)
- High contrast (text vs. background)
- Focus indicators visible
- Error messages clear and associated with fields

**Example Accessible Markup:**
```html
<label for="age-checkbox">
  <input 
    type="checkbox" 
    id="age-checkbox" 
    required 
    aria-required="true"
  />
  I am 21 years of age or older
</label>

<label for="dob">
  Date of Birth:
  <input 
    type="date" 
    id="dob" 
    required 
    aria-label="Enter your date of birth"
  />
</label>
```

---

### 7.7 Logging & Compliance Records (Optional)

**For High-Risk Businesses:**
- Log verification events (timestamp, IP, user agent)
- Store in database (separate table)
- Do NOT store DOB (privacy concern, unnecessary)
- Store only: verification_time, IP hash, user_agent
- Use for compliance audits if needed

**Implementation:**
```php
// WordPress custom table
CREATE TABLE age_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip_hash VARCHAR(64),
  user_agent TEXT,
  verified_at DATETIME,
  INDEX (verified_at)
);
```

**Privacy Consideration:** Disclose logging in Privacy Policy

---

### 7.8 Testing Checklist

- [ ] Gate appears on first visit (no cookie)
- [ ] Gate does not appear after successful verification (cookie present)
- [ ] Gate reappears after 24 hours
- [ ] Cannot bypass by pressing Esc, clicking outside, or back button
- [ ] DOB validation works (reject if under 21)
- [ ] Both checkboxes required
- [ ] Mobile-friendly (readable, usable)
- [ ] Accessible (keyboard navigation, screen reader)
- [ ] Works across browsers (Chrome, Safari, Firefox, Edge)
- [ ] Cookie persists across site pages
- [ ] Failed verification shows appropriate message

---

### 7.9 Legal Disclaimer in Age Gate

**Include This Text:**
> "By entering this site, you certify that you are 21 years of age or older and agree to our [Terms of Service] and [Legal Disclaimers]. All products are for research purposes only and not intended for human or animal use."

**Make Hyperlinks Active:**
- "Terms of Service" → `/terms`
- "Legal Disclaimers" → `/disclaimers`

---

## 8. LEGAL DISCLAIMERS - SITE-WIDE STRATEGY

### 8.1 Core Disclaimer Text (Universal)

**Required Language for All Pages:**

> **RESEARCH USE ONLY**  
> All products sold by PRC Peptides are intended strictly for non-clinical research and educational purposes. They are not drugs, supplements, food additives, or cosmetic products and may not be misbranded, misused, or mislabeled as such. These products are not intended to diagnose, treat, cure, or prevent any disease or condition. PRC Peptides assumes no responsibility for misuse of these products.

**Placement:**
1. **Header banner** (sitewide, sticky)
2. **Product pages** (above and below product info)
3. **Cart page** (confirmation checkbox)
4. **Checkout page** (acceptance required)
5. **Footer** (all pages)
6. **Invoices and packing slips**
7. **Emails** (order confirmations, shipping notices)

---

### 8.2 Detailed Legal Disclaimers Page (`/disclaimers`)

**Full Legal Disclaimer Structure:**

#### **Section 1: Product Classification**
> The products offered by PRC Peptides are research chemicals intended solely for in vitro (outside living organisms) and non-clinical research. They are NOT pharmaceutical drugs, dietary supplements, cosmetics, or food additives. These products have not been approved by the FDA or any other regulatory agency for human or animal use.

#### **Section 2: Intended Use**
> All products are sold exclusively to qualified researchers, academic institutions, and laboratories for experimental and educational research purposes. By purchasing from PRC Peptides, you confirm that you are a qualified researcher or acting on behalf of a qualified research institution.

#### **Section 3: Prohibited Uses**
> The following uses are strictly prohibited:
> - Human consumption or administration
> - Veterinary use or animal consumption
> - Use as a drug, medicine, or therapeutic agent
> - Use in food, beverages, or dietary supplements
> - Use in cosmetics or personal care products
> - Any clinical application
> - Resale to unqualified parties
>
> Violation of these terms may result in account termination, order cancellation, and/or legal action.

#### **Section 4: No Medical Claims**
> PRC Peptides makes no claims regarding the therapeutic benefits, safety, or efficacy of any product for human or animal use. Any reference to research studies or scientific literature is for informational purposes only and does not constitute a recommendation for any particular use.

#### **Section 5: Purchaser Responsibilities**
> By purchasing products from PRC Peptides, you acknowledge and agree that:
> - You are 21 years of age or older
> - You are a qualified researcher or purchasing on behalf of a qualified institution
> - You have the necessary training, facilities, and permits to handle research chemicals safely
> - You will comply with all applicable laws, regulations, and institutional guidelines
> - You assume all risk and liability associated with the purchase, handling, and use of these products
> - You will not misuse, mislabel, or resell these products in violation of these terms

#### **Section 6: Limitation of Liability**
> PRC Peptides, its owners, employees, and affiliates shall not be held liable for any direct, indirect, incidental, consequential, or punitive damages arising from the purchase, use, misuse, or inability to use any product. This includes, but is not limited to, damages for personal injury, property damage, loss of data, or loss of profits.
>
> To the maximum extent permitted by law, PRC Peptides' total liability shall not exceed the purchase price paid for the product in question.

#### **Section 7: Indemnification**
> You agree to indemnify, defend, and hold harmless PRC Peptides, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising from your use or misuse of any product, your violation of these disclaimers, or your violation of any law or regulation.

#### **Section 8: Regulatory Compliance**
> It is the purchaser's responsibility to ensure compliance with all applicable federal, state, and local laws and regulations governing the possession, use, and handling of research chemicals. PRC Peptides makes no representation that products comply with the laws of any jurisdiction outside the United States.

#### **Section 9: Export Restrictions**
> Many research chemicals are subject to export controls. International purchasers are responsible for verifying that products can be legally imported into their country and for obtaining any necessary permits or licenses.

#### **Section 10: Changes to Disclaimers**
> PRC Peptides reserves the right to modify these disclaimers at any time. Continued use of the site after changes constitutes acceptance of the revised disclaimers.

---

### 8.3 Placement Strategy by Page Type

#### **Homepage**
- **Header bar:** "RESEARCH USE ONLY" (persistent)
- **Footer:** Link to full disclaimers + short compliance text

#### **Shop / Catalog Pages**
- **Header bar:** "RESEARCH USE ONLY"
- **Above product grid:** Small disclaimer box
- **Footer:** Standard

#### **Product Pages**
- **Badge:** "RESEARCH USE ONLY" near product title
- **Product info panel:** Short disclaimer below Add to Cart
- **Below tabs:** Full compliance notice box
- **Footer:** Standard

#### **Cart Page**
```
┌─────────────────────────────────────────┐
│ ☐ I confirm that I am purchasing these │
│   products for research purposes only   │
│   and have read the [Disclaimers].     │
│                                         │
│ [Proceed to Checkout] (disabled until  │
│  checkbox is checked)                   │
└─────────────────────────────────────────┘
```

#### **Checkout Page**
```
┌─────────────────────────────────────────┐
│ REQUIRED CONFIRMATIONS                  │
│                                         │
│ ☐ I am 21 years of age or older        │
│                                         │
│ ☐ I am a qualified researcher or       │
│   purchasing on behalf of a research   │
│   institution                           │
│                                         │
│ ☐ I agree to the [Terms of Service]    │
│   and [Legal Disclaimers]              │
│                                         │
│ ☐ I understand these products are for  │
│   research use only and not for human  │
│   or animal consumption                │
└─────────────────────────────────────────┘
```
**Validation:** All checkboxes must be checked to place order

#### **Order Confirmation Email**
```
Thank you for your order!

IMPORTANT REMINDER:
All products are for research use only. Not for human or veterinary use. 
Please review our full Legal Disclaimers: https://prcpeptides.com/disclaimers

Your COA will be available in your account after shipment.
```

#### **Invoices / Packing Slips**
```
──────────────────────────────────────────
RESEARCH USE ONLY
All products are for in vitro research only.
Not for human or animal use.
──────────────────────────────────────────
```
**Placement:** Header and footer of printed documents

---

### 8.4 Visual Design for Disclaimers

**Header Banner Style:**
- **Background:** Red (#D32F2F) or Orange (#F57C00)
- **Text:** White, bold, 12-14px
- **Height:** 32-40px
- **Position:** Sticky (always visible)
- **Text:** "⚠ RESEARCH USE ONLY | 21+ | NOT FOR HUMAN USE"

**Product Page Disclaimer Box:**
- **Border:** 2px solid red or orange
- **Background:** Light yellow (#FFF9C4) or light red (#FFEBEE)
- **Icon:** Warning triangle
- **Text:** Black, 14-16px, bold key phrases
- **Padding:** Generous (20px)

**Checkbox Disclaimers:**
- **Font size:** 14px (readable)
- **Checkbox size:** 20x20px (easy to click)
- **Links:** Underlined, opens in new tab
- **Color:** High contrast (black text, red checkboxes optional)

---

### 8.5 Compliance Checklist

**Before Launch:**
- [ ] Disclaimers appear on every page type
- [ ] Age gate implemented and tested
- [ ] Cart requires disclaimer acknowledgment
- [ ] Checkout requires multiple confirmations
- [ ] Emails include disclaimer
- [ ] Invoices include disclaimer
- [ ] Footer links to legal pages
- [ ] All product descriptions avoid health claims
- [ ] COAs are accessible and accurate
- [ ] Terms of Service is comprehensive
- [ ] Privacy Policy is GDPR/CCPA compliant
- [ ] Staff trained on compliance (if applicable)

---

### 8.6 Content Review Process

**Ongoing Compliance:**
1. **Product descriptions:** Regular audits for health claims
2. **Blog content:** Pre-publication legal review
3. **Customer service:** Scripts that reinforce research-only use
4. **Marketing materials:** Compliance check before publication
5. **Reviews:** Moderation to remove health claims or human use mentions

**Red Flags to Remove:**
- "This will help you..."
- "Benefits include..."
- "Great for recovery/muscle growth/etc."
- Any mention of human use
- Any mention of treating diseases
- Dosage recommendations for humans

**Acceptable Language:**
- "Research suggests..."
- "Studies have examined..."
- "In experimental models..."
- "Molecular structure indicates..."
- "Researchers have observed..."

---

## 9. RECOMMENDED NEXT STEPS

### Phase 1: Foundation (Week 1-2)
1. **Domain & Hosting**
   - Register prcpeptides.com (if not already)
   - Choose hosting (Siteground, Kinsta, or WP Engine recommended for WooCommerce)
   - Install WordPress
   - Install SSL certificate

2. **Theme & Core Setup**
   - Install Kadence theme
   - Install WooCommerce
   - Configure basic settings (currency, shipping zones, tax)
   - Set up payment gateways (Stripe, Coinbase Commerce)

3. **Essential Plugins**
   - Install security (Wordfence)
   - Install caching (WP Rocket)
   - Install SEO (Rank Math)
   - Install age verification

4. **Legal Pages**
   - Draft Terms of Service
   - Draft Disclaimers
   - Draft Privacy Policy
   - Draft Refund Policy
   - Have reviewed by attorney (HIGHLY RECOMMENDED)

### Phase 2: Content & Products (Week 3-4)
1. **Page Creation**
   - Build homepage (using Kadence blocks)
   - Create About page
   - Create FAQ page
   - Create Contact page
   - Create COA/Lab Results page

2. **Product Upload**
   - Prepare product photography
   - Write compliant product descriptions
   - Upload COAs
   - Configure variations (if applicable)
   - Set up bulk pricing

3. **Design Refinement**
   - Customize theme colors/fonts
   - Add trust badges
   - Configure header/footer
   - Set up navigation menus

### Phase 3: Optimization & Testing (Week 5)
1. **Performance**
   - Optimize all images
   - Configure caching
   - Test load speeds
   - Fix any issues

2. **Compliance Testing**
   - Test age gate on all devices
   - Verify disclaimer placement
   - Test checkout flow
   - Review all content for health claims

3. **User Testing**
   - Complete full purchase flow (test mode)
   - Test mobile experience
   - Test payment gateways
   - Test email notifications

### Phase 4: Launch (Week 6)
1. **Pre-Launch Checklist**
   - Backup site
   - Enable payment gateways (live mode)
   - Submit sitemap to Google
   - Set up Google Analytics
   - Configure email marketing

2. **Soft Launch**
   - Announce to small audience
   - Monitor for issues
   - Gather feedback
   - Make quick fixes

3. **Full Launch**
   - Public announcement
   - Social media (if applicable)
   - Consider PPC ads (Google may restrict, test carefully)
   - Email marketing campaigns

### Phase 5: Ongoing (Post-Launch)
1. **Content Marketing**
   - Publish blog posts (research-focused)
   - Build backlinks
   - Engage with research community

2. **SEO Optimization**
   - Monitor rankings
   - Build internal links
   - Acquire reviews (with moderation)
   - Update product descriptions

3. **Conversion Optimization**
   - A/B test CTAs
   - Optimize checkout flow
   - Reduce cart abandonment
   - Improve product photography

---

## 10. BUDGET ESTIMATE

### Minimum Viable Budget (First Year)

| Item | Cost | Frequency |
|------|------|-----------|
| **Domain Registration** | $15 | Annual |
| **Web Hosting** (WooCommerce-optimized) | $30/mo | Monthly |
| **SSL Certificate** | Included | - |
| **Kadence Theme** | Free | - |
| **WP Rocket** | $59 | Annual |
| **Wordfence Premium** (optional) | $99 | Annual |
| **Legal Review** (attorney) | $500-$2,000 | One-time |
| **Payment Processing Fees** | 2.9% + $0.30 | Per transaction |
| **Product Photography** (if outsourced) | $200-$500 | One-time |
| **Logo Design** (if needed) | $50-$500 | One-time |
| **Email Marketing** (MailerLite) | Free-$10/mo | Monthly |

**Estimated First Year Cost:** $1,200-$3,500 (excluding product inventory and processing fees)

**Note:** High-risk payment processor may charge higher fees (3.5-5% + $0.30)

---

## 11. RISK MITIGATION

### Payment Processing Risks
- **Issue:** Peptide businesses are often flagged as high-risk
- **Mitigation:**
  - Disclose business nature upfront when applying
  - Have multiple backup processors
  - Implement crypto payments as primary option
  - Consider opening offshore merchant account (consult attorney)

### Regulatory Risks
- **Issue:** FDA or state regulations may change
- **Mitigation:**
  - Monitor regulatory landscape
  - Join industry associations
  - Have attorney on retainer
  - Maintain strict compliance documentation
  - Be prepared to pivot or shut down if necessary

### Reputational Risks
- **Issue:** Customers misusing products
- **Mitigation:**
  - Aggressive disclaimer strategy
  - Refuse sales to suspicious buyers
  - Monitor customer reviews for misuse mentions
  - Educate customers proactively

### Technical Risks
- **Issue:** Site downtime, security breaches
- **Mitigation:**
  - Daily backups (UpdraftPlus)
  - Security monitoring (Wordfence)
  - Uptime monitoring (UptimeRobot)
  - Have staging environment for testing

---

## 12. CONCLUSION

This site plan provides a comprehensive blueprint for launching prcpeptides.com as a compliant, trustworthy, and high-converting research peptide supplier. The focus on mobile-first design, aggressive compliance measures, and trust-building elements positions PRC Peptides for success in a competitive and highly regulated market.

**Key Success Factors:**
1. **Unwavering compliance** - No shortcuts on legal disclaimers
2. **Transparent quality** - COAs and third-party testing front and center
3. **Professional presentation** - Clean, modern design that builds trust
4. **Mobile-optimized** - Fast, thumb-friendly experience
5. **Payment redundancy** - Multiple options to avoid processor issues

**Final Recommendations:**
- Consult with an attorney before launch (especially for Terms, Disclaimers, and state-specific regulations)
- Start small, test thoroughly, scale carefully
- Build an email list early and nurture it
- Prioritize customer education over hard selling
- Stay informed on regulatory changes

Good luck with the launch of PRC Peptides! 🧪

---

**Document End**
