var fs = require('fs');
var md = fs.readFileSync(__dirname + '/product_descriptions_v3.md', 'utf8');
var vendorMd = fs.readFileSync(__dirname + '/vendor_directory.md', 'utf8');

// Category mapping with colors matching the spec
var categoryMap = {
  'Neuropeptides & Cognitive Research': { label: 'Neuropeptides', color: '#8B5CF6', count: 0 },
  'GLP Receptor Agonists': { label: 'GLP Receptor Agonists', color: '#EC4899', count: 0 },
  'Growth Hormone Secretagogues': { label: 'Growth Hormone Secretagogues', color: '#2B7DE9', count: 0 },
  'Tissue Repair & Regeneration': { label: 'Tissue Repair', color: '#10B981', count: 0 },
  'Metabolic Research Compounds': { label: 'Metabolic', color: '#F59E0B', count: 0 },
  'Antioxidants & Cellular Health': { label: 'Antioxidants', color: '#06B6D4', count: 0 },
  'Senolytic & Longevity Research': { label: 'Longevity', color: '#6366F1', count: 0 },
  'Melanocortin System Research': { label: 'Melanocortin', color: '#F97316', count: 0 },
  'Cosmetic & Dermatological Research': { label: 'Cosmetic', color: '#D946EF', count: 0 },
  'Tissue Protection & Repair (Advanced)': { label: 'Advanced', color: '#64748B', count: 0 }
};

// Parse products
var sections = md.split(/\n## /);
var allProducts = [];

for (var i = 1; i < sections.length; i++) {
  var section = sections[i];
  var lines = section.split('\n');
  var catName = lines[0].trim();
  if (!categoryMap[catName]) continue;
  var catInfo = categoryMap[catName];

  var products = section.split(/\n### /).slice(1);
  products.forEach(function(prod) {
    var pLines = prod.split('\n');
    var name = pLines[0].trim();
    var fullText = prod;

    var p = { name: name, category: catName, catLabel: catInfo.label, catColor: catInfo.color };

    // Hook
    var hookMatch = fullText.match(/\*\*SEO Title:\*\*[^\n]+\n\n\*\*([^*]+)\*\*/);
    if (hookMatch) p.hook = hookMatch[1].trim();

    // Description paragraphs
    var descStart = fullText.indexOf(p.hook ? p.hook + '**' : '');
    var descEnd = fullText.indexOf('**Research Applications');
    if (descEnd === -1) descEnd = fullText.indexOf('**Molecular Profile');
    if (descEnd === -1) descEnd = fullText.indexOf('**Handling');
    if (descStart > -1 && descEnd > -1) {
      var descBlock = fullText.substring(descStart + (p.hook || '').length + 3, descEnd).trim();
      descBlock = descBlock.replace(/\*\*/g, '').trim();
      var paras = descBlock.split(/\n\n/).filter(function(x) { return x.trim().length > 20; });
      p.description = paras.map(function(x) { return x.replace(/\n/g, ' ').trim(); });
    }

    // Research Applications
    var raMatch = fullText.match(/\*\*Research Applications:\*\*\s*\n([^\n]+(?:\n[^\n*]+)*)/);
    if (raMatch) {
      p.applications = raMatch[1].trim().split(/,\s*/).map(function(a) { return a.trim(); }).filter(function(a) { return a.length > 0; });
    }

    // Molecular Profile
    var formulaMatch = fullText.match(/Formula:\s*([^\n]+)/);
    var casMatch = fullText.match(/CAS:\s*([^\n]+)/);
    var mwMatch = fullText.match(/Molecular Weight:\s*([^\n]+)/);
    p.formula = formulaMatch ? formulaMatch[1].trim() : null;
    p.cas = casMatch ? casMatch[1].trim() : null;
    p.mw = mwMatch ? mwMatch[1].trim() : null;

    // Storage
    var storageMatch = fullText.match(/\*\*Handling & Storage:\*\*\s*\n([^\n]+(?:\n[^\n*]+)*)/);
    if (storageMatch) p.storage = storageMatch[1].trim().replace(/\n/g, ' ');

    // Is injectable? (NOT 5-Amino-1MQ)
    p.isInjectable = name.indexOf('5-Amino-1MQ') === -1;

    catInfo.count++;
    allProducts.push(p);
  });
}

console.log('Parsed ' + allProducts.length + ' products');

// Parse vendors
var vendors = { green: [], yellow: [], red: [] };
var sections = vendorMd.split(/\n## /);
for (var s = 0; s < sections.length; s++) {
  var section = sections[s];
  if (section.indexOf('GREEN TIER') > -1) {
    var lines = section.split('\n');
    for (var l = 0; l < lines.length; l++) {
      var line = lines[l];
      if (line.match(/^\|\s*\d+\s*\|/)) {
        var parts = line.split('|').map(function(p) { return p.trim(); });
        if (parts.length >= 4) {
          vendors.green.push({ name: parts[2], notes: parts[3], affiliate: parts[4] || '', tier: 'green' });
        }
      }
    }
  } else if (section.indexOf('YELLOW TIER') > -1) {
    var lines = section.split('\n');
    for (var l = 0; l < lines.length; l++) {
      var line = lines[l];
      if (line.match(/^\|\s*\d+\s*\|/)) {
        var parts = line.split('|').map(function(p) { return p.trim(); });
        if (parts.length >= 3) {
          vendors.yellow.push({ name: parts[2], notes: parts[3] || '', affiliate: '', tier: 'yellow' });
        }
      }
    }
  } else if (section.indexOf('RED TIER') > -1) {
    var lines = section.split('\n');
    for (var l = 0; l < lines.length; l++) {
      var line = lines[l];
      if (line.match(/^\|\s*\d+\s*\|/)) {
        var parts = line.split('|').map(function(p) { return p.trim(); });
        if (parts.length >= 3) {
          vendors.red.push({ name: parts[2], notes: parts[3] || '', affiliate: '', tier: 'red' });
        }
      }
    }
  }
}

// Sort alphabetically within each tier
vendors.green.sort(function(a, b) { return a.name.localeCompare(b.name); });
vendors.yellow.sort(function(a, b) { return a.name.localeCompare(b.name); });
vendors.red.sort(function(a, b) { return a.name.localeCompare(b.name); });

var allVendors = vendors.green.concat(vendors.yellow).concat(vendors.red);
console.log('Parsed vendors: ' + vendors.green.length + ' green, ' + vendors.yellow.length + ' yellow, ' + vendors.red.length + ' red');

// Build vendor directory HTML
var vendorHtml = '';
allVendors.forEach(function(v) {
  var tierColor = v.tier === 'green' ? '#10B981' : (v.tier === 'yellow' ? '#F59E0B' : '#EF4444');
  var tierLabel = v.tier === 'green' ? 'Trusted' : (v.tier === 'yellow' ? 'Caution' : 'Flagged');
  vendorHtml += '<div class="vendor-row" data-tier="' + v.tier + '" data-name="' + e(v.name.toLowerCase()) + '">';
  vendorHtml += '<div class="vendor-name">' + e(v.name) + '</div>';
  vendorHtml += '<span class="vendor-tier" style="color:' + tierColor + '">' + tierLabel + '</span>';
  if (v.notes) vendorHtml += '<div class="vendor-notes">' + e(v.notes) + '</div>';
  if (v.affiliate) vendorHtml += '<div class="vendor-aff">Code: <strong>' + e(v.affiliate) + '</strong></div>';
  vendorHtml += '</div>\n';
});

var vendorsJson = JSON.stringify(allVendors.map(function(v) {
  return { name: v.name, tier: v.tier, notes: v.notes, affiliate: v.affiliate };
}));

// HTML escape
function e(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }

// Short description for card face (first sentence of first description paragraph, or hook truncated)
function shortDesc(p) {
  if (p.hook) {
    var h = p.hook;
    if (h.length > 120) h = h.substring(0, 117) + '...';
    return h;
  }
  if (p.description && p.description[0]) {
    var d = p.description[0];
    if (d.length > 120) d = d.substring(0, 117) + '...';
    return d;
  }
  return '';
}

// Build product cards HTML
var cardsHtml = '';
allProducts.forEach(function(p, idx) {
  cardsHtml += '<div class="p-card" data-cat="' + e(p.catLabel) + '" data-name="' + e(p.name.toLowerCase()) + '" onclick="openModal(' + idx + ')" style="border-top:3px solid ' + p.catColor + '">';
  cardsHtml += '<div class="p-name">' + e(p.name) + '</div>';
  cardsHtml += '<div class="p-cat" style="color:' + p.catColor + '">' + e(p.catLabel) + '</div>';
  cardsHtml += '<div class="p-desc">' + e(shortDesc(p)) + '</div>';
  cardsHtml += '</div>\n';
});

// Build category pills
var catLabels = [];
var seen = {};
allProducts.forEach(function(p) {
  if (!seen[p.catLabel]) {
    seen[p.catLabel] = true;
    catLabels.push({ label: p.catLabel, color: p.catColor, count: categoryMap[p.category].count });
  }
});
var pillsHtml = '<button class="pill active" onclick="filterCat(this,\'all\')">All (' + allProducts.length + ')</button>';
catLabels.forEach(function(c) {
  pillsHtml += '<button class="pill" onclick="filterCat(this,\'' + e(c.label) + '\')" style="--pill-color:' + c.color + '">' + e(c.label) + ' (' + c.count + ')</button>';
});

// Product data JSON for modal (ES5 safe)
var productsJson = JSON.stringify(allProducts.map(function(p) {
  return {
    name: p.name,
    catLabel: p.catLabel,
    catColor: p.catColor,
    hook: p.hook || '',
    description: p.description || [],
    applications: (p.isInjectable && p.applications) ? p.applications : null,
    formula: p.formula,
    cas: p.cas,
    mw: p.mw,
    storage: p.storage || ''
  };
}));

// Full HTML
var html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
'<meta charset="UTF-8">\n' +
'<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=5.0">\n' +
'<title>Peptide Resource Center - The Peptide Authority</title>\n' +
'<style>\n' +
'*{margin:0;padding:0;box-sizing:border-box}\n' +
'html{scroll-behavior:smooth}\n' +
'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1a1a2e;background:#fff;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased}\n' +

// HEADER
'.site-header{position:sticky;top:0;z-index:200;background:#fff;border-bottom:1px solid #e5e7eb;padding:12px 20px;display:flex;align-items:center;justify-content:space-between}\n' +
'.header-brand{display:flex;flex-direction:column}\n' +
'.header-title{font-size:1.2rem;font-weight:800;color:#0A1628;letter-spacing:-0.5px;line-height:1.2}\n' +
'.header-sub{font-size:0.6rem;text-transform:uppercase;letter-spacing:2.5px;color:#2B7DE9;font-weight:700;border-top:1.5px solid #2B7DE9;padding-top:3px;margin-top:3px;display:inline-block}\n' +
'.header-nav{display:flex;gap:24px}\n' +
'.header-nav label,.header-nav a{font-size:0.82rem;color:#64748b;text-decoration:none;cursor:pointer;font-weight:500;padding:4px 0;border-bottom:2px solid transparent;transition:color 0.15s}\n' +
'.header-nav label:hover,.header-nav a:hover{color:#0A1628}\n' +
'@media(max-width:640px){.header-nav{display:none}}\n' +

// HERO
'.hero{background:#0A1628;padding:48px 20px 40px;text-align:center}\n' +
'.hero-title{font-size:2rem;font-weight:900;color:#fff;letter-spacing:-0.5px;line-height:1.1}\n' +
'.hero-auth{font-size:0.75rem;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:3px;margin-top:8px;font-weight:500}\n' +
'.hero-sub{font-size:0.85rem;color:rgba(255,255,255,0.65);margin-top:16px;line-height:1.5;max-width:560px;margin-left:auto;margin-right:auto}\n' +
'.hero-stats{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:20px;font-size:0.72rem;color:rgba(255,255,255,0.5);font-weight:500}\n' +
'.hero-stats span{background:rgba(255,255,255,0.06);padding:5px 12px;border-radius:20px}\n' +
'.hero-stats strong{color:rgba(255,255,255,0.85)}\n' +
'.hero-btns{margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}\n' +
'.btn-primary{background:#2B7DE9;color:#fff;border:none;padding:10px 24px;border-radius:8px;font-size:0.82rem;font-weight:700;cursor:pointer;text-decoration:none}\n' +
'.btn-outline{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,0.3);padding:10px 24px;border-radius:8px;font-size:0.82rem;font-weight:700;cursor:pointer;text-decoration:none}\n' +
'.btn-primary:hover{background:#1D6AD4}\n' +
'.btn-outline:hover{border-color:#fff}\n' +
'@media(max-width:640px){.hero{padding:32px 16px 28px}.hero-title{font-size:1.5rem}}\n' +

// TRUST BAR
'.trust-bar{background:#f8f9fa;padding:10px 20px;text-align:center;font-size:0.72rem;color:#64748b;font-weight:500;letter-spacing:0.3px;border-bottom:1px solid #e5e7eb}\n' +

// TAB SYSTEM (CSS-only)
'.tab-radio{display:none}\n' +
'.tab-bar{position:sticky;top:49px;z-index:150;background:#fff;border-bottom:1px solid #e5e7eb;display:flex;justify-content:center;gap:0}\n' +
'.tab-bar label{padding:12px 20px;font-size:0.82rem;font-weight:600;color:#64748b;cursor:pointer;border-bottom:2.5px solid transparent;transition:all 0.15s}\n' +
'.tab-bar label:hover{color:#0A1628}\n' +
'#tab-resources:checked ~ .tab-bar label[for="tab-resources"],' +
'#tab-shop:checked ~ .tab-bar label[for="tab-shop"],' +
'#tab-learn:checked ~ .tab-bar label[for="tab-learn"],' +
'#tab-contact:checked ~ .tab-bar label[for="tab-contact"]{color:#2B7DE9;border-bottom-color:#2B7DE9}\n' +
'.tab-content{display:none}\n' +
'#tab-resources:checked ~ .tabs-container .content-resources{display:block}\n' +
'#tab-shop:checked ~ .tabs-container .content-shop{display:block}\n' +
'#tab-learn:checked ~ .tabs-container .content-learn{display:block}\n' +
'#tab-contact:checked ~ .tabs-container .content-contact{display:block}\n' +
'@media(max-width:640px){.tab-bar label{padding:10px 14px;font-size:0.75rem}}\n' +

// CONTENT CONTAINER
'.content-wrap{max-width:1100px;margin:0 auto;padding:32px 20px}\n' +
'@media(max-width:640px){.content-wrap{padding:20px 16px}}\n' +

// RESOURCES TAB
'.res-banner{background:linear-gradient(135deg,#0A1628 0%,#1a2744 100%);border-radius:12px;padding:28px 24px;color:#fff;margin-bottom:28px}\n' +
'.res-banner h3{font-size:1.1rem;font-weight:800;margin-bottom:6px}\n' +
'.res-banner p{font-size:0.8rem;color:rgba(255,255,255,0.7);margin-bottom:16px;line-height:1.5}\n' +
'.res-banner .btn-primary{font-size:0.78rem;padding:8px 20px}\n' +
'.quick-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:32px}\n' +
'@media(min-width:768px){.quick-grid{grid-template-columns:1fr 1fr 1fr 1fr}}\n' +
'.quick-tile{background:#f8f9fa;border:1px solid #e5e7eb;border-radius:10px;padding:16px;text-align:center;cursor:pointer;text-decoration:none;color:#1a1a2e;transition:all 0.15s}\n' +
'.quick-tile:hover{border-color:#2B7DE9;background:#f0f7ff}\n' +
'.quick-tile h4{font-size:0.78rem;font-weight:700;margin-bottom:2px}\n' +
'.quick-tile p{font-size:0.65rem;color:#64748b}\n' +
'.res-section{margin-bottom:28px}\n' +
'.res-section h3{font-size:1rem;font-weight:800;color:#0A1628;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #e5e7eb}\n' +
'.res-section p,.res-section li{font-size:0.82rem;color:#475569;line-height:1.6}\n' +
'.res-section ul{padding-left:18px;margin-top:6px}\n' +
'.res-section li{margin-bottom:4px}\n' +
'.vendor-cards{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:10px}\n' +
'@media(max-width:640px){.vendor-cards{grid-template-columns:1fr}}\n' +
'.vendor-card{background:#f8f9fa;border:1px solid #e5e7eb;border-radius:8px;padding:14px}\n' +
'.vendor-card h4{font-size:0.78rem;font-weight:700;color:#0A1628;margin-bottom:4px}\n' +
'.vendor-card p{font-size:0.7rem;color:#64748b;line-height:1.4}\n' +

// Vendor Directory
'.vendor-controls{display:flex;flex-direction:column;gap:10px;margin-bottom:16px}\n' +
'.vendor-filter-pills{display:flex;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch}\n' +
'.vendor-filter-pills::-webkit-scrollbar{height:0}\n' +
'.v-pill{padding:6px 14px;border-radius:20px;font-size:0.7rem;font-weight:600;border:1.5px solid #e5e7eb;background:#fff;color:#64748b;cursor:pointer;white-space:nowrap;font-family:inherit;transition:all 0.15s}\n' +
'.v-pill:hover{border-color:#0A1628;color:#0A1628}\n' +
'.v-pill.active{background:var(--v-color,#0A1628);color:#fff;border-color:var(--v-color,#0A1628)}\n' +
'.vendor-search{width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:0.82rem;font-family:inherit;background:#f8f9fa}\n' +
'.vendor-search:focus{outline:none;border-color:#2B7DE9;background:#fff}\n' +
'.vendor-count{font-size:0.72rem;color:#94a3b8;font-weight:500}\n' +
'.vendor-list{display:flex;flex-direction:column;gap:0;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;max-height:600px;overflow-y:auto}\n' +
'.vendor-row{padding:12px 16px;border-bottom:1px solid #f0f0f0;background:#fff;display:flex;flex-direction:column;gap:4px;transition:background 0.1s}\n' +
'.vendor-row:last-child{border-bottom:none}\n' +
'.vendor-row:hover{background:#f8f9fa}\n' +
'.vendor-name{font-size:0.82rem;font-weight:700;color:#0A1628;line-height:1.2}\n' +
'.vendor-tier{font-size:0.62rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:2px 0}\n' +
'.vendor-notes{font-size:0.72rem;color:#64748b;line-height:1.4}\n' +
'.vendor-aff{font-size:0.7rem;color:#2B7DE9;font-family:"SF Mono","Fira Code",monospace}\n' +
'.vendor-aff strong{font-weight:700}\n' +

// SHOP TAB
'.pills-row{display:flex;gap:6px;overflow-x:auto;padding:0 0 12px;-webkit-overflow-scrolling:touch}\n' +
'.pills-row::-webkit-scrollbar{height:0}\n' +
'.pill{display:inline-block;padding:6px 14px;border-radius:20px;font-size:0.7rem;font-weight:600;border:1.5px solid #e5e7eb;background:#fff;color:#64748b;cursor:pointer;white-space:nowrap;font-family:inherit;transition:all 0.15s}\n' +
'.pill:hover,.pill.active{background:#0A1628;color:#fff;border-color:#0A1628}\n' +
'.search-row{display:flex;align-items:center;gap:12px;margin:16px 0}\n' +
'.search-input{flex:1;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:0.82rem;font-family:inherit;background:#f8f9fa}\n' +
'.search-input:focus{outline:none;border-color:#2B7DE9;background:#fff}\n' +
'.search-count{font-size:0.72rem;color:#94a3b8;white-space:nowrap;font-weight:500}\n' +

// PRODUCT GRID
'.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}\n' +
'@media(min-width:640px){.p-grid{grid-template-columns:1fr 1fr 1fr}}\n' +
'@media(min-width:900px){.p-grid{grid-template-columns:1fr 1fr 1fr 1fr}}\n' +
'.p-card{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;cursor:pointer;transition:all 0.15s;display:flex;flex-direction:column}\n' +
'.p-card:hover{box-shadow:0 4px 16px rgba(0,0,0,0.08);transform:translateY(-1px)}\n' +
'.p-name{font-size:0.82rem;font-weight:700;color:#0A1628;line-height:1.3;margin-bottom:4px}\n' +
'.p-cat{font-size:0.62rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px}\n' +
'.p-desc{font-size:0.7rem;color:#94a3b8;line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}\n' +

// MODAL
'.modal-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center;padding:20px}\n' +
'.modal-overlay.open{display:flex}\n' +
'.modal{background:#fff;border-radius:14px;max-width:600px;width:100%;max-height:85vh;overflow-y:auto;position:relative}\n' +
'.modal-accent{height:4px;border-radius:14px 14px 0 0}\n' +
'.modal-body{padding:28px 24px}\n' +
'.modal-close{position:absolute;top:12px;right:16px;background:none;border:none;font-size:1.5rem;color:#94a3b8;cursor:pointer;line-height:1}\n' +
'.modal-close:hover{color:#0A1628}\n' +
'.modal-name{font-size:1.3rem;font-weight:800;color:#0A1628;margin-bottom:4px}\n' +
'.modal-cat{font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:16px}\n' +
'.modal-hook{font-size:0.85rem;color:#475569;font-style:italic;margin-bottom:16px;line-height:1.5;padding:12px 16px;background:#f8f9fa;border-radius:8px;border-left:3px solid #2B7DE9}\n' +
'.modal-desc p{font-size:0.82rem;color:#475569;line-height:1.7;margin-bottom:12px}\n' +
'.modal-section{margin-top:20px;padding-top:16px;border-top:1px solid #f0f0f0}\n' +
'.modal-section h4{font-size:0.65rem;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;font-weight:800;margin-bottom:10px}\n' +
'.mol-grid{display:grid;grid-template-columns:80px 1fr;gap:6px;font-size:0.8rem}\n' +
'.mol-label{color:#94a3b8;font-weight:700;font-size:0.7rem;text-transform:uppercase}\n' +
'.mol-val{font-family:"SF Mono","Fira Code",monospace;color:#1a1a2e;font-size:0.78rem;word-break:break-all}\n' +
'.modal-storage{font-size:0.8rem;color:#92400e;background:#fffbeb;padding:12px 16px;border-radius:8px;line-height:1.5}\n' +
'.modal-tags{display:flex;flex-wrap:wrap;gap:6px}\n' +
'.modal-tag{padding:4px 10px;background:#f0f7ff;border-radius:14px;font-size:0.7rem;color:#2B7DE9;font-weight:500}\n' +

// LEARN TAB
'.learn-section{margin-bottom:32px}\n' +
'.learn-section h3{font-size:1.05rem;font-weight:800;color:#0A1628;margin-bottom:8px}\n' +
'.learn-section p{font-size:0.85rem;color:#475569;line-height:1.7;margin-bottom:10px}\n' +

// CONTACT TAB
'.contact-wrap{text-align:center;max-width:480px;margin:0 auto;padding:40px 0}\n' +
'.contact-wrap h3{font-size:1.3rem;font-weight:800;color:#0A1628;margin-bottom:8px}\n' +
'.contact-wrap p{font-size:0.85rem;color:#475569;line-height:1.6;margin-bottom:16px}\n' +
'.contact-wrap a{color:#2B7DE9;text-decoration:none;font-weight:600}\n' +
'.contact-wrap a:hover{text-decoration:underline}\n' +
'.contact-disc{font-size:0.72rem;color:#94a3b8;margin-top:28px;padding-top:20px;border-top:1px solid #e5e7eb;line-height:1.5}\n' +

// FOOTER
'footer{background:#0A1628;padding:32px 20px;text-align:center}\n' +
'.footer-brand{font-size:0.85rem;font-weight:700;color:#fff;margin-bottom:2px}\n' +
'.footer-sub{font-size:0.6rem;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px}\n' +
'.footer-links{display:flex;gap:20px;justify-content:center;margin-bottom:16px}\n' +
'.footer-links label{font-size:0.75rem;color:rgba(255,255,255,0.5);cursor:pointer}\n' +
'.footer-links label:hover{color:#fff}\n' +
'.footer-disc{font-size:0.65rem;color:rgba(255,255,255,0.3);max-width:500px;margin:0 auto;line-height:1.5}\n' +
'.footer-copy{font-size:0.62rem;color:rgba(255,255,255,0.25);margin-top:12px}\n' +
'</style>\n' +
'</head>\n<body>\n\n' +

// RADIO INPUTS (must be at top of body for CSS sibling selectors)
'<input type="radio" name="tab" id="tab-resources" class="tab-radio" checked>\n' +
'<input type="radio" name="tab" id="tab-shop" class="tab-radio">\n' +
'<input type="radio" name="tab" id="tab-learn" class="tab-radio">\n' +
'<input type="radio" name="tab" id="tab-contact" class="tab-radio">\n\n' +

// HEADER
'<header class="site-header">\n' +
'<div class="header-brand">\n' +
'<div class="header-title">PEPTIDE RESOURCE CENTER</div>\n' +
'<div class="header-sub">The Peptide Authority</div>\n' +
'</div>\n' +
'<nav class="header-nav">\n' +
'<label for="tab-resources">Home</label>\n' +
'<label for="tab-resources">Resources</label>\n' +
'<label for="tab-shop">Shop</label>\n' +
'<label for="tab-learn">Learn</label>\n' +
'<label for="tab-contact">Contact</label>\n' +
'</nav>\n' +
'</header>\n\n' +

// HERO
'<section class="hero">\n' +
'<div class="hero-title">PEPTIDE RESOURCE CENTER</div>\n' +
'<div class="hero-auth">The Peptide Authority</div>\n' +
'<p class="hero-sub">Your comprehensive destination for research peptide resources, education, and premium products</p>\n' +
'<div class="hero-stats">\n' +
'<span><strong>44+</strong> Products</span>\n' +
'<span><strong>23+</strong> Vendors Compared</span>\n' +
'<span><strong>10</strong> Categories</span>\n' +
'<span><strong>&ge;98%</strong> Purity</span>\n' +
'</div>\n' +
'<div class="hero-btns">\n' +
'<label for="tab-resources" class="btn-primary">Explore Resources</label>\n' +
'<label for="tab-shop" class="btn-outline">Shop Products</label>\n' +
'</div>\n' +
'</section>\n\n' +

// TRUST BAR
'<div class="trust-bar">Research Grade &bull; Fast Shipping &bull; Secure Payments &bull; Expert Support</div>\n\n' +

// TAB BAR
'<div class="tab-bar">\n' +
'<label for="tab-resources">Resources</label>\n' +
'<label for="tab-shop">Shop</label>\n' +
'<label for="tab-learn">Learn</label>\n' +
'<label for="tab-contact">Contact</label>\n' +
'</div>\n\n' +

// TABS CONTAINER
'<div class="tabs-container">\n\n' +

// === RESOURCES TAB ===
'<div class="tab-content content-resources">\n<div class="content-wrap">\n' +

// Price comparison banner
'<div class="res-banner">\n' +
'<h3>Price Comparison Tool</h3>\n' +
'<p>Compare prices across 387 products from 23+ verified vendors. Find the best value for your research needs.</p>\n' +
'<a href="https://frabrizio22.github.io/prc-tools/" class="btn-primary" target="_blank" rel="noopener">Launch Price Tool</a>\n' +
'</div>\n\n' +

// Quick links
'<div class="quick-grid">\n' +
'<a href="#vendor-dir" class="quick-tile" onclick="document.getElementById(\'vendor-dir\').scrollIntoView({behavior:\'smooth\'});return false"><h4>Vendor Directory</h4><p>Trusted suppliers</p></a>\n' +
'<label for="tab-learn" class="quick-tile"><h4>Peptide Education</h4><p>Learn the science</p></label>\n' +
'<a href="#review-resources" class="quick-tile" onclick="document.getElementById(\'review-resources\').scrollIntoView({behavior:\'smooth\'});return false"><h4>Vendor Reviews</h4><p>Community feedback</p></a>\n' +
'<a href="#testing-labs" class="quick-tile" onclick="document.getElementById(\'testing-labs\').scrollIntoView({behavior:\'smooth\'});return false"><h4>Testing Labs</h4><p>Third-party analysis</p></a>\n' +
'</div>\n\n' +

// Vendor Directory
'<div class="res-section" id="vendor-dir">\n' +
'<h3>Vendor Directory</h3>\n' +
'<p>Curated list of research peptide suppliers organized by region and specialty.</p>\n' +
'<div class="vendor-cards">\n' +
'<div class="vendor-card"><h4>US-Based Vendors</h4><p>Domestic suppliers with fast shipping, US-based customer support, and domestic quality testing.</p></div>\n' +
'<div class="vendor-card"><h4>International Vendors</h4><p>Global suppliers offering competitive pricing with international shipping options.</p></div>\n' +
'<div class="vendor-card"><h4>Specialty Vendors</h4><p>Niche suppliers focusing on rare peptides, custom synthesis, and specialty compounds.</p></div>\n' +
'</div>\n' +
'</div>\n\n' +

// Review Resources
'<div class="res-section" id="review-resources">\n' +
'<h3>Review Resources</h3>\n' +
'<ul>\n' +
'<li>Community vendor reviews and ratings</li>\n' +
'<li>Third-party testing comparison reports</li>\n' +
'<li>Vendor reliability tracking</li>\n' +
'<li>Shipping speed and customer service ratings</li>\n' +
'</ul>\n' +
'</div>\n\n' +

// Testing Labs
'<div class="res-section" id="testing-labs">\n' +
'<h3>Testing Labs</h3>\n' +
'<p>Independent third-party laboratories offering HPLC purity analysis, mass spectrometry, and endotoxin testing for research peptides. Always verify your compounds through independent analysis to ensure research integrity.</p>\n' +
'</div>\n\n' +

// Books
'<div class="res-section">\n' +
'<h3>Books &amp; Reading</h3>\n' +
'<ul>\n' +
'<li><strong>Peptide Chemistry and Drug Design</strong> by Ben M. Dunn</li>\n' +
'<li><strong>Introduction to Peptides and Proteins</strong> by Ulo Langel et al.</li>\n' +
'<li><strong>Peptide Drug Discovery and Development</strong> by Miguel Castanho</li>\n' +
'<li><strong>The Handbook of Biologically Active Peptides</strong> by Abba Kastin</li>\n' +
'</ul>\n' +
'</div>\n\n' +

// Vendor Directory Full List
'<div class="res-section">\n' +
'<h3>Complete Vendor Directory</h3>\n' +
'<p style="margin-bottom:12px">Browse ' + allVendors.length + ' research peptide vendors organized by trust level. All data sourced from peptideresourcecenter.com (Feb 2026).</p>\n' +
'<div class="vendor-controls">\n' +
'<div class="vendor-filter-pills">\n' +
'<button class="v-pill active" onclick="filterVendors(this,\'all\')">All (' + allVendors.length + ')</button>\n' +
'<button class="v-pill" onclick="filterVendors(this,\'green\')" style="--v-color:#10B981">Trusted (' + vendors.green.length + ')</button>\n' +
'<button class="v-pill" onclick="filterVendors(this,\'yellow\')" style="--v-color:#F59E0B">Caution (' + vendors.yellow.length + ')</button>\n' +
'<button class="v-pill" onclick="filterVendors(this,\'red\')" style="--v-color:#EF4444">Flagged (' + vendors.red.length + ')</button>\n' +
'</div>\n' +
'<input type="text" class="vendor-search" id="vendorSearch" placeholder="Search vendors...">\n' +
'<div class="vendor-count" id="vendorCount">Showing ' + allVendors.length + ' vendors</div>\n' +
'</div>\n' +
'<div class="vendor-list" id="vendorList">' + vendorHtml + '</div>\n' +
'</div>\n' +

'</div>\n</div>\n\n' +

// === SHOP TAB ===
'<div class="tab-content content-shop">\n<div class="content-wrap">\n' +

// Category pills
'<div class="pills-row" id="pills">' + pillsHtml + '</div>\n' +

// Search
'<div class="search-row">\n' +
'<input type="text" class="search-input" id="shopSearch" placeholder="Search products...">\n' +
'<span class="search-count" id="searchCount">Showing ' + allProducts.length + ' of ' + allProducts.length + ' products</span>\n' +
'</div>\n' +

// Grid
'<div class="p-grid" id="productGrid">' + cardsHtml + '</div>\n' +

'</div>\n</div>\n\n' +

// === LEARN TAB ===
'<div class="tab-content content-learn">\n<div class="content-wrap" style="max-width:700px">\n' +

'<div class="learn-section">\n' +
'<h3>What Are Research Peptides?</h3>\n' +
'<p>Research peptides are short chains of amino acids, typically between 2 and 50 residues, synthesized for use in scientific investigation. Unlike proteins, peptides are small enough to be produced through solid-phase synthesis, enabling precise control over sequence and purity. They serve as essential tools in molecular biology, pharmacology, and biochemistry research.</p>\n' +
'<p>Research-grade peptides are produced under strict quality controls and are intended exclusively for in vitro studies, laboratory experiments, and scientific investigation. They are not intended for human consumption or therapeutic use.</p>\n' +
'</div>\n\n' +

'<div class="learn-section">\n' +
'<h3>Understanding Peptide Purity</h3>\n' +
'<p>Purity is the single most important quality metric for research peptides. A purity rating of 98% or higher, as determined by high-performance liquid chromatography (HPLC), indicates that at least 98% of the material is the desired peptide sequence, with less than 2% consisting of truncated sequences, deletion products, or other synthesis byproducts.</p>\n' +
'<p>Higher purity matters because impurities can confound experimental results. Truncated sequences may have partial biological activity, creating dose-response artifacts. Deletion products can compete for receptor binding sites without producing the expected signal. For reproducible research, 98% purity represents the minimum standard for most applications.</p>\n' +
'</div>\n\n' +

'<div class="learn-section">\n' +
'<h3>Proper Storage &amp; Handling</h3>\n' +
'<p><strong>Lyophilized peptides</strong> should be stored at -20 degrees C or below in sealed containers protected from moisture. Most lyophilized peptides remain stable for 12-24 months under these conditions.</p>\n' +
'<p><strong>Reconstituted peptides</strong> should be stored at 2-8 degrees C (standard refrigeration) and used within 30 days. Use bacteriostatic water (containing 0.9% benzyl alcohol) to prevent microbial contamination. Avoid repeated freeze-thaw cycles, which cause peptide aggregation and degradation.</p>\n' +
'<p><strong>Light sensitivity:</strong> Many peptides are photosensitive. Store in amber vials or wrap in foil. Copper-peptide complexes and NAD+ are particularly light-sensitive.</p>\n' +
'</div>\n\n' +

'<div class="learn-section">\n' +
'<h3>Reading Lab Results</h3>\n' +
'<p><strong>HPLC (High-Performance Liquid Chromatography):</strong> The primary method for determining peptide purity. Look for a single dominant peak representing your target peptide, with minimal secondary peaks. The percentage area under the main peak indicates purity. Results above 98% are considered research grade.</p>\n' +
'<p><strong>Mass Spectrometry (MS):</strong> Confirms molecular identity by measuring the peptide\'s mass-to-charge ratio. The observed molecular weight should match the theoretical weight within instrument tolerance (typically within 1 Da). This confirms you have the correct sequence, not just a pure sample of something else.</p>\n' +
'<p>Together, HPLC and MS provide complementary verification: HPLC tells you how pure it is, and MS tells you what it is.</p>\n' +
'</div>\n' +

'</div>\n</div>\n\n' +

// === CONTACT TAB ===
'<div class="tab-content content-contact">\n<div class="content-wrap">\n' +
'<div class="contact-wrap">\n' +
'<h3>Get in Touch</h3>\n' +
'<p>Have questions about our research products or need guidance on peptide selection for your laboratory? Our team is here to help.</p>\n' +
'<p><a href="mailto:support@prcpeptides.com">support@prcpeptides.com</a></p>\n' +
'<p><a href="https://www.facebook.com/prcpeptides" target="_blank" rel="noopener">Follow us on Facebook</a></p>\n' +
'<div class="contact-disc">All products are intended for research and laboratory use only. Not for human consumption. No medical claims are made or implied. Products have not been evaluated by regulatory agencies for safety or efficacy in humans.</div>\n' +
'</div>\n' +
'</div>\n</div>\n\n' +

'</div>\n\n' + // close tabs-container

// MODAL
'<div class="modal-overlay" id="modalOverlay" onclick="closeModal(event)">\n' +
'<div class="modal" onclick="event.stopPropagation()">\n' +
'<div class="modal-accent" id="modalAccent"></div>\n' +
'<button class="modal-close" onclick="closeModal()">&times;</button>\n' +
'<div class="modal-body" id="modalBody"></div>\n' +
'</div>\n' +
'</div>\n\n' +

// FOOTER
'<footer>\n' +
'<div class="footer-brand">Peptide Resource Center</div>\n' +
'<div class="footer-sub">The Peptide Authority</div>\n' +
'<div class="footer-links">\n' +
'<label for="tab-resources">Resources</label>\n' +
'<label for="tab-shop">Shop</label>\n' +
'<label for="tab-learn">Learn</label>\n' +
'<label for="tab-contact">Contact</label>\n' +
'</div>\n' +
'<div class="footer-disc">All products are intended for research and laboratory use only. Not for human consumption. For research purposes only.</div>\n' +
'<div class="footer-copy">&copy; 2026 Peptide Resource Center</div>\n' +
'</footer>\n\n' +

// JAVASCRIPT (ES5 only, for modal + search + filter)
'<script>\n' +
'var products = ' + productsJson + ';\n\n' +

'function openModal(idx) {\n' +
'  var p = products[idx];\n' +
'  if (!p) return;\n' +
'  var h = "";\n' +
'  h += "<div class=\\"modal-name\\">" + esc(p.name) + "</div>";\n' +
'  h += "<div class=\\"modal-cat\\" style=\\"color:" + p.catColor + "\\">" + esc(p.catLabel) + "</div>";\n' +
'  if (p.hook) h += "<div class=\\"modal-hook\\">" + esc(p.hook) + "</div>";\n' +
'  if (p.description && p.description.length > 0) {\n' +
'    h += "<div class=\\"modal-desc\\">";\n' +
'    for (var i = 0; i < p.description.length; i++) {\n' +
'      if (p.description[i].length > 20) h += "<p>" + esc(p.description[i]) + "</p>";\n' +
'    }\n' +
'    h += "</div>";\n' +
'  }\n' +
'  if (p.formula || p.cas || p.mw) {\n' +
'    h += "<div class=\\"modal-section\\"><h4>Molecular Profile</h4><div class=\\"mol-grid\\">";\n' +
'    if (p.formula) h += "<div class=\\"mol-label\\">Formula</div><div class=\\"mol-val\\">" + esc(p.formula) + "</div>";\n' +
'    if (p.mw) h += "<div class=\\"mol-label\\">MW</div><div class=\\"mol-val\\">" + esc(p.mw) + "</div>";\n' +
'    if (p.cas) h += "<div class=\\"mol-label\\">CAS</div><div class=\\"mol-val\\">" + esc(p.cas) + "</div>";\n' +
'    h += "</div></div>";\n' +
'  }\n' +
'  if (p.storage) {\n' +
'    h += "<div class=\\"modal-section\\"><h4>Handling &amp; Storage</h4>";\n' +
'    h += "<div class=\\"modal-storage\\">" + esc(p.storage) + "</div></div>";\n' +
'  }\n' +
'  if (p.applications && p.applications.length > 0) {\n' +
'    h += "<div class=\\"modal-section\\"><h4>Research Applications</h4><div class=\\"modal-tags\\">";\n' +
'    for (var j = 0; j < p.applications.length; j++) {\n' +
'      h += "<span class=\\"modal-tag\\">" + esc(p.applications[j]) + "</span>";\n' +
'    }\n' +
'    h += "</div></div>";\n' +
'  }\n' +
'  document.getElementById("modalAccent").style.background = p.catColor;\n' +
'  document.getElementById("modalBody").innerHTML = h;\n' +
'  document.getElementById("modalOverlay").className = "modal-overlay open";\n' +
'  document.body.style.overflow = "hidden";\n' +
'}\n\n' +

'function closeModal(evt) {\n' +
'  if (evt && evt.target && evt.target !== document.getElementById("modalOverlay")) return;\n' +
'  document.getElementById("modalOverlay").className = "modal-overlay";\n' +
'  document.body.style.overflow = "";\n' +
'}\n\n' +

'function esc(s) {\n' +
'  if (!s) return "";\n' +
'  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");\n' +
'}\n\n' +

// Search
'var searchInput = document.getElementById("shopSearch");\n' +
'if (searchInput) {\n' +
'  searchInput.addEventListener("input", function() {\n' +
'    var q = this.value.toLowerCase();\n' +
'    var cards = document.getElementById("productGrid").children;\n' +
'    var shown = 0;\n' +
'    for (var i = 0; i < cards.length; i++) {\n' +
'      var name = cards[i].getAttribute("data-name") || "";\n' +
'      var cat = cards[i].getAttribute("data-cat") || "";\n' +
'      var match = name.indexOf(q) > -1 || cat.toLowerCase().indexOf(q) > -1;\n' +
'      var catOk = !activeCat || activeCat === "all" || cards[i].getAttribute("data-cat") === activeCat;\n' +
'      var vis = match && catOk;\n' +
'      cards[i].style.display = vis ? "" : "none";\n' +
'      if (vis) shown++;\n' +
'    }\n' +
'    document.getElementById("searchCount").textContent = "Showing " + shown + " of " + ' + allProducts.length + ' + " products";\n' +
'  });\n' +
'}\n\n' +

// Filter by category
'var activeCat = "all";\n' +
'function filterCat(btn, cat) {\n' +
'  activeCat = cat;\n' +
'  var pills = document.querySelectorAll(".pill");\n' +
'  for (var i = 0; i < pills.length; i++) pills[i].className = "pill";\n' +
'  btn.className = "pill active";\n' +
'  var q = (document.getElementById("shopSearch") || {}).value || "";\n' +
'  q = q.toLowerCase();\n' +
'  var cards = document.getElementById("productGrid").children;\n' +
'  var shown = 0;\n' +
'  for (var j = 0; j < cards.length; j++) {\n' +
'    var name = cards[j].getAttribute("data-name") || "";\n' +
'    var c = cards[j].getAttribute("data-cat") || "";\n' +
'    var catOk = cat === "all" || c === cat;\n' +
'    var searchOk = !q || name.indexOf(q) > -1 || c.toLowerCase().indexOf(q) > -1;\n' +
'    var vis = catOk && searchOk;\n' +
'    cards[j].style.display = vis ? "" : "none";\n' +
'    if (vis) shown++;\n' +
'  }\n' +
'  document.getElementById("searchCount").textContent = "Showing " + shown + " of " + ' + allProducts.length + ' + " products";\n' +
'}\n\n' +

// Close modal on Escape
'document.addEventListener("keydown", function(e) {\n' +
'  if (e.keyCode === 27) closeModal();\n' +
'});\n\n' +

// Vendor directory filter and search
'var activeVendorTier = "all";\n' +
'var vendorSearchTerm = "";\n' +
'function filterVendors(btn, tier) {\n' +
'  activeVendorTier = tier;\n' +
'  var pills = document.querySelectorAll(".v-pill");\n' +
'  for (var i = 0; i < pills.length; i++) pills[i].className = "v-pill";\n' +
'  btn.className = "v-pill active";\n' +
'  updateVendorDisplay();\n' +
'}\n' +
'function updateVendorDisplay() {\n' +
'  var rows = document.getElementById("vendorList").children;\n' +
'  var shown = 0;\n' +
'  for (var i = 0; i < rows.length; i++) {\n' +
'    var tier = rows[i].getAttribute("data-tier");\n' +
'    var name = rows[i].getAttribute("data-name") || "";\n' +
'    var tierOk = activeVendorTier === "all" || tier === activeVendorTier;\n' +
'    var searchOk = !vendorSearchTerm || name.indexOf(vendorSearchTerm) > -1;\n' +
'    var vis = tierOk && searchOk;\n' +
'    rows[i].style.display = vis ? "" : "none";\n' +
'    if (vis) shown++;\n' +
'  }\n' +
'  document.getElementById("vendorCount").textContent = "Showing " + shown + " vendors";\n' +
'}\n' +
'var vendorSearchInput = document.getElementById("vendorSearch");\n' +
'if (vendorSearchInput) {\n' +
'  vendorSearchInput.addEventListener("input", function() {\n' +
'    vendorSearchTerm = this.value.toLowerCase();\n' +
'    updateVendorDisplay();\n' +
'  });\n' +
'}\n\n' +

'<\/script>\n' +
'</body>\n</html>';

fs.writeFileSync(__dirname + '/prc_site_mockup_final.html', html);
console.log('Generated: prc_site_mockup_final.html');
console.log('Size: ' + (Buffer.byteLength(html) / 1024).toFixed(1) + ' KB');
console.log('Lines: ' + html.split('\n').length);
console.log('Products: ' + allProducts.length);

// Verify all products
allProducts.forEach(function(p) { console.log('  [' + p.catLabel + '] ' + p.name); });

// Check for banned terms
var banned = ['Ozempic', 'Wegovy', 'Mounjaro', 'Zepbound', 'COA', 'certificate of analysis', 'health claim'];
banned.forEach(function(term) {
  if (html.toLowerCase().indexOf(term.toLowerCase()) > -1) {
    console.log('WARNING: Found banned term: ' + term);
  }
});
