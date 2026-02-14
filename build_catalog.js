var fs = require('fs');
var md = fs.readFileSync('product_descriptions_v3.md', 'utf8');

// Parse products from markdown
var sections = md.split(/\n## /);
var categories = [];
var allProducts = [];

var categoryColors = {
  'Neuropeptides & Cognitive Research': { cls: 'cat-neuro', color: '#8B5CF6', id: 'neuropeptides', intro: 'Compounds shaping the frontier of neuroscience — from anxiolytic peptides to neurotrophic complexes.' },
  'GLP Receptor Agonists': { cls: 'cat-glp', color: '#2B7DE9', id: 'glp-agonists', intro: 'The molecules redefining metabolic research — single, dual, and triple receptor agonists.' },
  'Growth Hormone Secretagogues': { cls: 'cat-gh', color: '#06B6D4', id: 'growth-hormone', intro: 'Precision tools for studying the GH axis — from GHRH analogues to ghrelin receptor agonists.' },
  'Tissue Repair & Regeneration': { cls: 'cat-tissue', color: '#10B981', id: 'tissue-repair', intro: 'The repair toolkit — peptides that drive angiogenesis, cell migration, and tissue remodeling.' },
  'Metabolic Research Compounds': { cls: 'cat-metabolic', color: '#F59E0B', id: 'metabolic', intro: 'From mitochondrial-derived peptides to lipotropic blends — every metabolic pathway covered.' },
  'Antioxidants & Cellular Health': { cls: 'cat-antioxidant', color: '#EF4444', id: 'antioxidants', intro: 'Cellular defense compounds — NAD+ cofactors, glutathione systems, and mitochondrial protectors.' },
  'Senolytic & Longevity Research': { cls: 'cat-longevity', color: '#8B5CF6', id: 'longevity', intro: 'The longevity frontier — senescent cell clearance, telomerase modulation, and neuroprotection.' },
  'Melanocortin System Research': { cls: 'cat-melanocortin', color: '#EC4899', id: 'melanocortin', intro: 'Melanocortin receptor pharmacology — MC3R, MC4R, and opioid receptor research tools.' },
  'Cosmetic & Dermatological Research': { cls: 'cat-cosmetic', color: '#F472B6', id: 'cosmetic', intro: 'Neurotoxins and dermatological research compounds for neuromuscular and skin biology.' },
  'Tissue Protection & Repair (Advanced)': { cls: 'cat-advanced', color: '#14B8A6', id: 'advanced', intro: 'Next-generation tissue protection — innate repair receptor agonists and targeted therapeutics.' }
};

for (var i = 1; i < sections.length; i++) {
  var section = sections[i];
  var lines = section.split('\n');
  var catName = lines[0].trim();
  
  if (!categoryColors[catName]) continue;
  
  var catInfo = categoryColors[catName];
  var products = section.split(/\n### /).slice(1);
  var catProducts = [];
  
  products.forEach(function(prod) {
    var pLines = prod.split('\n');
    var nameMatch = pLines[0].trim();
    
    // Parse fields
    var product = { name: nameMatch, category: catName, catInfo: catInfo };
    var fullText = prod;
    
    // Category & purity line
    var catLine = fullText.match(/\*\*([^*]+)\*\*\s*\|\s*\*\*Purity:\*\*\s*([^|*]+)/);
    if (catLine) {
      product.subcategory = catLine[1].trim();
      product.purity = catLine[2].trim();
    }
    
    // Origin
    var originMatch = fullText.match(/\*\*Origin:\*\*\s*([^\n]+)/);
    if (originMatch) product.origin = originMatch[1].trim();
    
    // SEO Title
    var seoMatch = fullText.match(/\*\*SEO Title:\*\*\s*"([^"]+)"/);
    if (seoMatch) product.seo = seoMatch[1];
    
    // Hook line (bold text after SEO title)
    var hookMatch = fullText.match(/\*\*SEO Title:\*\*[^\n]+\n\n\*\*([^*]+)\*\*/);
    if (hookMatch) product.hook = hookMatch[1].trim();
    
    // Description paragraphs (between hook and Research Applications or Molecular Profile)
    var descStart = fullText.indexOf(product.hook ? product.hook + '**' : '');
    var descEnd = fullText.indexOf('**Research Applications');
    if (descEnd === -1) descEnd = fullText.indexOf('**Molecular Profile');
    if (descEnd === -1) descEnd = fullText.indexOf('**Handling');
    
    if (descStart > -1 && descEnd > -1) {
      var descBlock = fullText.substring(descStart + (product.hook || '').length + 3, descEnd).trim();
      // Clean up markdown
      descBlock = descBlock.replace(/\*\*/g, '').trim();
      // Split into paragraphs
      var paras = descBlock.split(/\n\n/).filter(function(p) { return p.trim().length > 20; });
      product.description = paras.map(function(p) { return p.replace(/\n/g, ' ').trim(); });
    }
    
    // Research Applications
    var raMatch = fullText.match(/\*\*Research Applications:\*\*\s*\n([^\n]+(?:\n[^\n*]+)*)/);
    if (raMatch) {
      product.applications = raMatch[1].trim().split(/,\s*/).map(function(a) { return a.trim(); }).filter(function(a) { return a.length > 0; });
    }
    
    // Molecular Profile
    var formulaMatch = fullText.match(/Formula:\s*([^\n]+)/);
    var casMatch = fullText.match(/CAS:\s*([^\n]+)/);
    var mwMatch = fullText.match(/Molecular Weight:\s*([^\n]+)/);
    
    product.formula = formulaMatch ? formulaMatch[1].trim() : null;
    product.cas = casMatch ? casMatch[1].trim() : null;
    product.mw = mwMatch ? mwMatch[1].trim() : null;
    
    // Handling & Storage
    var storageMatch = fullText.match(/\*\*Handling & Storage:\*\*\s*\n([^\n]+(?:\n[^\n*]+)*)/);
    if (storageMatch) product.storage = storageMatch[1].trim().replace(/\n/g, ' ');
    
    // Researchers Also Explore
    var relMatch = fullText.match(/\*\*Researchers Also Explore:\*\*\s*\n([^\n]+(?:\n[^\n#]+)*)/);
    if (relMatch) {
      var relText = relMatch[1].trim();
      product.related = relText.split(/,\s*(?=[A-Z\d])/).map(function(r) {
        var nameOnly = r.split('(')[0].trim();
        return nameOnly;
      }).filter(function(r) { return r.length > 0; });
    }
    
    catProducts.push(product);
    allProducts.push(product);
  });
  
  if (catProducts.length > 0) {
    categories.push({ name: catName, info: catInfo, products: catProducts });
  }
}

console.log('Parsed ' + allProducts.length + ' products in ' + categories.length + ' categories');

// Generate HTML
function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

var productCards = '';
categories.forEach(function(cat) {
  productCards += '<section class="category-section" id="' + cat.info.id + '">\n';
  productCards += '<div class="category-header"><h2 class="category-title">' + esc(cat.name) + '</h2>';
  productCards += '<p class="category-intro">' + esc(cat.info.intro) + '</p></div>\n';
  
  cat.products.forEach(function(p) {
    var nameId = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    productCards += '<div class="product-card ' + p.catInfo.cls + '" data-name="' + esc(p.name) + '" id="' + nameId + '">\n';
    
    // Badges
    productCards += '<div class="card-badges">';
    if (p.subcategory) productCards += '<span class="badge badge-category">' + esc(p.subcategory) + '</span>';
    if (p.purity) productCards += '<span class="badge badge-purity">' + esc(p.purity) + '</span>';
    productCards += '</div>\n';
    
    // Name & meta
    productCards += '<h3 class="product-name">' + esc(p.name) + '</h3>\n';
    if (p.origin) productCards += '<div class="product-meta">' + esc(p.origin) + '</div>\n';
    
    // Hook
    if (p.hook) productCards += '<div class="product-hook">' + esc(p.hook) + '</div>\n';
    
    // Description
    if (p.description && p.description.length > 0) {
      productCards += '<div class="product-desc">';
      p.description.forEach(function(para) {
        if (para.length > 20) productCards += '<p style="margin-bottom:0.75rem">' + esc(para) + '</p>';
      });
      productCards += '</div>\n';
    }
    
    // Research Applications
    if (p.applications && p.applications.length > 0) {
      productCards += '<div class="info-box"><div class="info-title">Research Applications</div>';
      productCards += '<div class="tags">';
      p.applications.forEach(function(app) {
        productCards += '<span class="tag">' + esc(app) + '</span>';
      });
      productCards += '</div></div>\n';
    }
    
    // Molecular Profile
    if (p.formula || p.cas || p.mw) {
      productCards += '<div class="info-box"><div class="info-title">Molecular Profile</div>';
      if (p.formula) productCards += '<div class="mol-row"><span class="mol-label">Formula</span><span class="mol-value">' + esc(p.formula) + '</span></div>';
      if (p.cas) productCards += '<div class="mol-row"><span class="mol-label">CAS</span><span class="mol-value">' + esc(p.cas) + '</span></div>';
      if (p.mw) productCards += '<div class="mol-row"><span class="mol-label">MW</span><span class="mol-value">' + esc(p.mw) + '</span></div>';
      productCards += '</div>\n';
    }
    
    // Storage
    if (p.storage) {
      productCards += '<div class="info-box storage-box"><div class="info-title">Handling & Storage</div>';
      productCards += '<p style="font-size:0.8rem;color:#92400E">' + esc(p.storage) + '</p></div>\n';
    }
    
    // Related
    if (p.related && p.related.length > 0) {
      productCards += '<div style="margin-top:1rem"><div class="info-title">Researchers Also Explore</div>';
      productCards += '<div class="related">';
      p.related.forEach(function(r) {
        var rid = r.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        productCards += '<a href="#' + rid + '" class="rel-link">' + esc(r) + ' &rarr;</a>';
      });
      productCards += '</div></div>\n';
    }
    
    productCards += '</div>\n\n';
  });
  
  productCards += '</section>\n\n';
});

var navPills = '';
categories.forEach(function(cat) {
  navPills += '<a href="#' + cat.info.id + '" class="category-pill">' + esc(cat.name.split('&')[0].trim().split('(')[0].trim()) + '</a>\n';
});

var html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
'<meta charset="UTF-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">\n' +
'<title>PRC Product Catalog | Peptide Resource Center</title>\n' +
'<style>\n' +
'* { margin: 0; padding: 0; box-sizing: border-box; }\n' +
'html { scroll-behavior: smooth; }\n' +
'body { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", sans-serif; background: #FAFBFC; color: #475569; line-height: 1.75; font-size: 0.875rem; -webkit-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; }\n' +
'.container { max-width: 720px; margin: 0 auto; padding: 0 1rem; }\n' +

// Header
'header { background: #FFFFFF; border-bottom: 1px solid #E2E8F0; padding: 2.5rem 0 2rem; }\n' +
'.header-content { text-align: center; }\n' +
'.brand { font-size: 2.75rem; font-weight: 900; color: #2B7DE9; letter-spacing: -1.5px; margin-bottom: 0.15rem; }\n' +
'.brand-full { font-size: 0.8rem; color: #94A3B8; text-transform: uppercase; letter-spacing: 4px; font-weight: 600; }\n' +
'.tagline { font-size: 0.85rem; color: #1E293B; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid #E2E8F0; display: inline-block; }\n' +

// Stats bar
'.stats-bar { background: #F8FAFC; border-top: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0; padding: 1rem 0; text-align: center; font-size: 0.8rem; color: #64748B; letter-spacing: 0.5px; margin-bottom: 2rem; }\n' +
'.stats-bar strong { color: #1E293B; font-weight: 700; }\n' +
'.stats-sep { display: inline-block; margin: 0 0.75rem; color: #CBD5E1; }\n' +

// Search
'.search-section { margin-bottom: 1.5rem; }\n' +
'.search-input { width: 100%; padding: 0.875rem 1rem; border: 2px solid #E2E8F0; border-radius: 12px; font-size: 0.95rem; font-family: inherit; background: #FFFFFF; transition: all 0.2s; }\n' +
'.search-input:focus { outline: none; border-color: #2B7DE9; box-shadow: 0 0 0 3px rgba(43,125,233,0.1); }\n' +
'.search-input::placeholder { color: #94A3B8; }\n' +

// Category nav — sticky on scroll
'.nav-wrap { position: sticky; top: 0; z-index: 100; background: #FAFBFC; padding-top: 0.5rem; margin: 0 -1rem; padding-left: 1rem; padding-right: 1rem; }\n' +
'.category-nav { display: flex; gap: 0.5rem; overflow-x: auto; padding: 0.5rem 0 1rem; -webkit-overflow-scrolling: touch; }\n' +
'.category-nav::-webkit-scrollbar { height: 0; }\n' +
'.category-pill { display: inline-block; padding: 0.5rem 1rem; background: #FFFFFF; color: #64748B; border: 1.5px solid #E2E8F0; border-radius: 24px; font-size: 0.75rem; font-weight: 700; text-decoration: none; white-space: nowrap; transition: all 0.2s; }\n' +
'.category-pill:hover { background: #2B7DE9; color: #FFFFFF; border-color: #2B7DE9; }\n' +
// Back to top
'.back-top { position: fixed; bottom: 1.5rem; right: 1.5rem; width: 44px; height: 44px; background: #2B7DE9; color: #FFFFFF; border: none; border-radius: 50%; font-size: 1.2rem; cursor: pointer; box-shadow: 0 2px 8px rgba(43,125,233,0.3); z-index: 99; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: all 0.2s; }\n' +
'.back-top:hover { background: #1D6AD4; transform: scale(1.1); }\n' +

// Category sections
'.category-section { margin-bottom: 3rem; }\n' +
'.category-header { margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #F1F5F9; }\n' +
'.category-title { font-size: 1.5rem; font-weight: 800; color: #0F172A; margin-bottom: 0.4rem; letter-spacing: -0.5px; }\n' +
'.category-intro { font-size: 0.875rem; color: #64748B; line-height: 1.6; font-style: italic; }\n' +

// Product cards
'.product-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 1.75rem; margin-bottom: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03); transition: all 0.25s ease; }\n' +
'.product-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04); transform: translateY(-1px); }\n' +
'.cat-neuro { border-top: 3px solid #8B5CF6; }\n' +
'.cat-glp { border-top: 3px solid #2B7DE9; }\n' +
'.cat-gh { border-top: 3px solid #06B6D4; }\n' +
'.cat-tissue { border-top: 3px solid #10B981; }\n' +
'.cat-metabolic { border-top: 3px solid #F59E0B; }\n' +
'.cat-antioxidant { border-top: 3px solid #EF4444; }\n' +
'.cat-longevity { border-top: 3px solid #8B5CF6; }\n' +
'.cat-melanocortin { border-top: 3px solid #EC4899; }\n' +
'.cat-cosmetic { border-top: 3px solid #F472B6; }\n' +
'.cat-advanced { border-top: 3px solid #14B8A6; }\n' +

// Badges
'.card-badges { display: flex; gap: 0.4rem; margin-bottom: 0.75rem; flex-wrap: wrap; }\n' +
'.badge { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 12px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }\n' +
'.badge-category { background: #E0F2FE; color: #0369A1; }\n' +
'.badge-purity { background: #D1FAE5; color: #065F46; }\n' +

// Product content
'.product-name { font-size: 1.35rem; font-weight: 800; color: #1E293B; margin-bottom: 0.3rem; line-height: 1.3; letter-spacing: -0.5px; }\n' +
'.product-meta { font-size: 0.75rem; color: #94A3B8; margin-bottom: 0.5rem; font-weight: 500; }\n' +
'.product-hook { font-size: 0.9rem; font-style: italic; color: #2B7DE9; margin: 1rem 0; padding: 0.75rem 1rem; border-left: 3px solid #2B7DE9; background: rgba(43,125,233,0.03); border-radius: 0 8px 8px 0; line-height: 1.6; }\n' +
'.product-desc { margin-bottom: 1rem; }\n' +
'.product-desc p { margin-bottom: 0.75rem; line-height: 1.75; }\n' +

// Info boxes
'.info-box { margin-top: 1rem; padding: 1rem; background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; }\n' +
'.info-title { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 2px; color: #94A3B8; font-weight: 800; margin-bottom: 0.65rem; }\n' +
'.tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }\n' +
'.tag { display: inline-block; padding: 0.25rem 0.6rem; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; font-size: 0.7rem; color: #64748B; font-weight: 500; }\n' +

// Molecular profile
'.mol-row { display: grid; grid-template-columns: 75px 1fr; gap: 0.5rem; margin-bottom: 0.35rem; font-size: 0.8rem; align-items: baseline; }\n' +
'.mol-label { color: #94A3B8; font-weight: 700; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; }\n' +
'.mol-value { font-family: "SF Mono", "Courier New", monospace; color: #334155; font-size: 0.78rem; word-break: break-all; }\n' +

// Storage
'.storage-box { background: #FFFBEB; border-color: #FDE68A; }\n' +
'.storage-box p { font-size: 0.8rem; color: #92400E; line-height: 1.6; }\n' +

// Related products
'.related-section { margin-top: 1.25rem; }\n' +
'.related { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.5rem; }\n' +
'.rel-link { display: inline-block; padding: 0.35rem 0.75rem; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; color: #2B7DE9; text-decoration: none; font-size: 0.75rem; font-weight: 600; transition: all 0.2s; }\n' +
'.rel-link:hover { background: #2B7DE9; color: #FFFFFF; border-color: #2B7DE9; }\n' +

// Footer
'footer { background: #0F172A; color: #94A3B8; padding: 2.5rem 0 2rem; margin-top: 4rem; }\n' +
'.footer-content { text-align: center; max-width: 600px; margin: 0 auto; padding: 0 1rem; }\n' +
'.footer-brand { font-size: 1.5rem; font-weight: 900; color: #2B7DE9; margin-bottom: 0.25rem; }\n' +
'.footer-tagline { font-size: 0.7rem; color: #64748B; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1.5rem; }\n' +
'.disclaimer { font-size: 0.8rem; line-height: 1.7; margin-bottom: 1.5rem; padding: 1.25rem; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); border-radius: 12px; }\n' +
'.disclaimer-title { color: #F59E0B; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 0.5rem; }\n' +
'.footer-meta { font-size: 0.7rem; color: #475569; }\n' +

// Desktop enhancements
'@media(min-width:768px){ .container{max-width:760px;padding:0 2rem} .product-card{padding:2rem 2.25rem} .header-content{padding:0.5rem 0} .brand{font-size:3rem} .category-header{margin-bottom:2rem} .info-box{padding:1.25rem} .product-hook{padding:1rem 1.25rem} }\n' +
'@media(min-width:1024px){ .container{max-width:800px} }\n' +

// Mobile
'@media(max-width:640px){ .brand{font-size:2rem} .brand-full{font-size:0.7rem;letter-spacing:3px} .tagline{font-size:0.75rem;letter-spacing:1.5px} .product-card{padding:1.25rem;border-radius:12px;margin-bottom:1rem} .product-name{font-size:1.15rem} .product-hook{font-size:0.85rem;padding:0.6rem 0.75rem} .product-desc p{font-size:0.82rem} .mol-row{grid-template-columns:60px 1fr;gap:0.35rem} .mol-value{font-size:0.72rem} .category-title{font-size:1.25rem} .category-intro{font-size:0.8rem} .tags{gap:0.25rem} .tag{font-size:0.65rem;padding:0.2rem 0.5rem} .info-box{padding:0.75rem} .badge{font-size:0.6rem;padding:0.15rem 0.5rem} .stats-bar{font-size:0.75rem} .stats-sep{margin:0 0.5rem} .related{gap:0.3rem} .rel-link{font-size:0.7rem;padding:0.3rem 0.6rem} .search-input{font-size:0.9rem;padding:0.75rem 0.85rem} }\n' +
'@media(max-width:380px){ .brand{font-size:1.75rem} .product-name{font-size:1.05rem} .product-card{padding:1rem} .mol-row{grid-template-columns:55px 1fr} }\n' +
'</style>\n</head>\n<body>\n' +

// Header
'<header>\n<div class="container">\n<div class="header-content">\n' +
'<div class="brand">PRC</div>\n' +
'<div class="brand-full">Peptide Resource Center</div>\n' +
'<div class="tagline">Precision Is Not Optional</div>\n' +
'</div>\n</div>\n</header>\n\n' +

// Stats
'<div class="stats-bar"><div class="container">\n' +
'<strong>' + allProducts.length + '</strong> Research Compounds' +
'<span class="stats-sep">•</span>' +
'<strong>' + categories.length + '</strong> Categories' +
'<span class="stats-sep">•</span>' +
'<strong>&ge;98%</strong> Purity Standard' +
'</div></div>\n\n' +

// Main content
'<div class="container">\n' +

// Search
'<div class="search-section">\n' +
'<input type="text" class="search-input" id="searchInput" placeholder="Search 43 compounds by name...">\n' +
'</div>\n' +

// Category nav (sticky)
'<div class="nav-wrap"><nav class="category-nav">\n' + navPills + '</nav></div>\n\n' +

// Product cards
productCards +

'</div>\n\n' +

// Footer
'<footer>\n<div class="footer-content">\n' +
'<div class="footer-brand">PRC</div>\n' +
'<div class="footer-tagline">Peptide Resource Center &mdash; The Peptide Authority</div>\n' +
'<div class="disclaimer">\n' +
'<div class="disclaimer-title">&mdash; For Research Use Only &mdash;</div>\n' +
'All products listed are intended for research and laboratory use only. Not for human consumption. ' +
'The information provided is for educational and reference purposes. Products have not been evaluated ' +
'by regulatory agencies for safety or efficacy in humans.\n' +
'</div>\n' +
'<div class="footer-meta">February 2026 &middot; peptideresourcecenter.com</div>\n' +
'</div>\n</footer>\n\n' +

// Back to top button
'<a href="#" class="back-top" aria-label="Back to top">&uarr;</a>\n\n' +

// JS filter
'<script>\n' +
'(function(){\n' +
'var si=document.getElementById("searchInput");\n' +
'if(!si)return;\n' +
'si.addEventListener("input",function(){\n' +
'var q=this.value.toLowerCase();\n' +
'var cards=document.querySelectorAll(".product-card");\n' +
'var sections=document.querySelectorAll(".category-section");\n' +
'for(var i=0;i<cards.length;i++){\n' +
'var n=cards[i].getAttribute("data-name")||"";\n' +
'cards[i].style.display=n.toLowerCase().indexOf(q)>-1?"":"none";\n' +
'}\n' +
'for(var j=0;j<sections.length;j++){\n' +
'var visible=sections[j].querySelectorAll(".product-card:not([style*=none])");\n' +
'sections[j].style.display=visible.length>0?"":"none";\n' +
'}\n' +
'});\n' +
'})();\n' +
'<\/script>\n' +
'</body>\n</html>';

fs.writeFileSync('prc_product_catalog.html', html);
console.log('Built catalog: ' + (Buffer.byteLength(html)/1024).toFixed(1) + 'KB');
console.log('Products: ' + allProducts.length);
console.log('Categories: ' + categories.length);

// Debug: show products per category
categories.forEach(function(c) {
  console.log('  ' + c.name + ': ' + c.products.length + ' products');
});
