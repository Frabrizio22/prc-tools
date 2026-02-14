# Peptide Vendor Scraping Summary

**Date:** February 13, 2026  
**Method:** web_fetch (HTTP-based content extraction)  
**Status:** Partial Success

## Overview

Attempted to scrape 23 peptide vendor websites for comprehensive product and pricing data. Successfully extracted data from **8 vendors** (3 complete, 5 partial), but encountered significant technical barriers preventing full catalog access for the remaining **15 vendors**.

## Results

### ✅ Successfully Scraped (Complete Data)
1. **PRC** - 24 products extracted
2. **AMP (Ameano Peptides)** - 49 products extracted  
3. **RetaOne** - 21 products extracted

**Total:** 94 products with complete pricing

### ⚠️ Partially Scraped (Incomplete Data)
4. **BC9** - Found 293 products, but only category listings with price ranges (need individual page scraping)
5. **Biopeptide** - 10 products from first page only
6. **Strate** - 11 products from first page (more exist via pagination)
7. **Synagenics** - 4 products only (site has more)
8. **PRC** - May have more products not captured

**Total:** ~318 products identified, but many need deeper scraping

### ❌ Inaccessible via web_fetch
The following 15 vendors have anti-scraping measures preventing simple HTTP-based extraction:

- **AIO** - Product URLs return 404
- **Authentic Aminos** - Catalog returns 404/disclaimers only
- **Biolongevity Labs** - Age gate/disclaimers block access
- **EQNO** - JavaScript-dependent catalog
- **EZ** - Login/verification required
- **Elev8 (peptidetherapy.shop)** - Products hidden behind JavaScript
- **FelixChem** - Age gate with terms acceptance required
- **Ignition** - Catalog blocked
- **Instant** - Research access page/login required  
- **Orbitrex** - Product catalog blocked
- **Penguin** - Catalog inaccessible
- **Royal** - Qualification/age gate blocking
- **SportsTech** - Catalog hidden
- **TCore** - Products not visible in fetched content
- **TruLab** - Catalog blocked
- **Tydes** - Login required to view products

## Technical Challenges

### 1. **Age Gates & Terms Agreements**
Many sites require users to:
- Confirm they're 18+/21+
- Agree to "Research Use Only" terms
- Accept liability disclaimers

These gates prevent `web_fetch` from accessing product pages.

### 2. **JavaScript-Rendered Catalogs**
Most modern e-commerce platforms (Shopify, WooCommerce, custom React/Vue apps) render product listings dynamically via JavaScript. `web_fetch` retrieves raw HTML before JavaScript execution, so these products never appear.

### 3. **Login/Account Requirements**
Several vendors require account creation or verification before viewing products.

### 4. **Anti-Scraping Measures**
Some sites detect automated access and serve disclaimer pages instead of product catalogs.

### 5. **Price Range Displays**
Vendors like BC9 show products with "price ranges" (e.g., "$48.16 - $189.29") rather than specific prices, requiring individual product page visits to extract exact pricing for each size/variant.

## Recommendations for Complete Scraping

To successfully scrape all 23 vendors, you would need:

### Option 1: Browser Automation (Recommended)
Use **Playwright** or **Puppeteer** to:
- Render JavaScript
- Click through age gates
- Handle cookie consent banners
- Navigate pagination
- Extract variant-specific pricing

### Option 2: API Access
Some vendors may have APIs (check for /api/ endpoints or GraphQL). This would be cleaner but requires:
- API documentation
- Possible authentication tokens
- Rate limit handling

### Option 3: Manual Extraction + Automation Hybrid
For the 15 inaccessible vendors:
- Manually create accounts where required
- Extract session cookies/tokens
- Use authenticated requests in automation scripts

## Data Quality Notes

### Current Dataset Limitations:
1. **Missing strength info** on some blends and formulations (marked with empty strings)
2. **Price per mg calculations** excluded for:
   - Combo products (e.g., "BPC-157/TB4 Blend")
   - Non-mg units (IU, mcg, mL products)
   - Products without clear mg amounts
3. **Incomplete catalogs** for BC9, Strate, Synagenics, Biopeptide (only first pages captured)
4. **Name standardization** applied, but some products may need review (e.g., vendor-specific codes like "AMP-1P")

### Products Excluded:
- Bacteriostatic water
- Reconstitution kits  
- Non-peptide accessories
- Some ambiguous "blend" products

These were included per the instructions, but flagged with empty pricePerMg values.

## Files Generated

1. **vendor_scrape_results.json** - 94 products with complete data
2. **vendor_scrape_status.json** - Detailed vendor accessibility report
3. **SCRAPE_SUMMARY.md** - This document

## Next Steps

If complete data is required:

1. Set up Playwright/Puppeteer browser automation
2. Implement age gate bypass logic (click "Yes I'm 18+" buttons)
3. Handle pagination for BC9 (19 pages), Strate, Biopeptide, etc.
4. Extract individual product variant pricing (BC9, Synagenics show ranges)
5. For login-required sites (Tydes, Instant), create test accounts
6. Implement rate limiting (2-5 second delays between requests)
7. Add retry logic for failed requests
8. Save intermediate results to avoid re-scraping on failures

**Estimated time with proper automation:** 2-4 hours for full 23-vendor dataset

## Sample Code Structure Needed

```javascript
// Playwright example for age-gated site
const browser = await playwright.chromium.launch();
const page = await browser.newPage();

// Navigate and handle age gate
await page.goto('https://vendor.com/shop');
await page.click('button:has-text("Yes, I am 18+")');
await page.waitForSelector('.product-grid');

// Extract products
const products = await page.$$eval('.product-item', items => 
  items.map(item => ({
    name: item.querySelector('.name').textContent,
    price: item.querySelector('.price').textContent,
    strength: item.querySelector('.size').textContent
  }))
);
```

## Conclusion

Successfully extracted **94 fully-priced products** from 3 vendors, with partial data for 5 more (318+ products identified). The remaining 15 vendors require browser automation to overcome anti-scraping measures. The current dataset provides a foundation but represents only **~15-20%** of the total available catalog across all 23 vendors.
