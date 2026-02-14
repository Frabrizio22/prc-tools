var fs = require('fs');
var data = JSON.parse(fs.readFileSync('peptide_data_enhanced.json', 'utf8'));
var vendorURLs = JSON.parse(fs.readFileSync('vendor_urls.json', 'utf8'));
var vendorMeta = JSON.parse(fs.readFileSync('vendor_info.json', 'utf8'));

// Stats
var peptides = {}, vendors = {}, prcCount = 0;
for (var i = 0; i < data.length; i++) {
  peptides[data[i].peptide] = 1;
  vendors[data[i].vendor] = 1;
  if (data[i].prcProduct === 'Yes') prcCount++;
}
var pCount = Object.keys(peptides).length;
var vCount = Object.keys(vendors).length;

// Best prices
var bestPrices = {};
for (var i = 0; i < data.length; i++) {
  var d = data[i];
  var key = d.peptide + '|' + d.strength;
  var p = parseFloat(d.price);
  if (!isNaN(p) && p > 0) {
    if (!bestPrices[key] || p < bestPrices[key].price) {
      bestPrices[key] = { price: p, vendor: d.vendor };
    }
  }
}

// Top savings
var prcItems = data.filter(function(d) { return d.prcProduct === 'Yes'; });
var savings = [];
prcItems.forEach(function(prc) {
  var prcPrice = parseFloat(prc.price);
  if (isNaN(prcPrice) || prcPrice <= 0) return;
  data.forEach(function(comp) {
    if (comp.prcProduct !== 'No') return;
    if (comp.peptide !== prc.peptide || comp.strength !== prc.strength) return;
    var compPrice = parseFloat(comp.price);
    if (isNaN(compPrice) || compPrice <= prcPrice) return;
    savings.push({
      peptide: prc.peptide, strength: prc.strength,
      prcPrice: prcPrice, compPrice: compPrice,
      compVendor: comp.vendor,
      pct: Math.round(((compPrice - prcPrice) / compPrice) * 100)
    });
  });
});
savings.sort(function(a, b) { return b.pct - a.pct; });
var topSavings = savings.slice(0, 3);

// Sort data
data.sort(function(a, b) {
  var ap = a.peptide.toLowerCase(), bp = b.peptide.toLowerCase();
  if (ap < bp) return -1; if (ap > bp) return 1; return 0;
});

// Spotlight HTML
var spotHTML = '';
topSavings.forEach(function(s) {
  spotHTML += '<div class="spot-card">' +
    '<div class="spot-badge">TOP SAVINGS</div>' +
    '<div class="spot-name">' + s.peptide + '</div>' +
    '<div class="spot-strength">' + s.strength + '</div>' +
    '<div class="spot-compare">' +
    '<div class="spot-prc-line"><span class="spot-label">PRC</span><span class="spot-prc-price">$' + s.prcPrice.toFixed(2) + '</span></div>' +
    '<div class="spot-comp-line"><span class="spot-label">' + s.compVendor + '</span><span class="spot-comp-price">$' + s.compPrice.toFixed(2) + '</span></div>' +
    '</div>' +
    '<div class="spot-save-pill">' + s.pct + '% SAVINGS</div>' +
    '</div>';
});

// Vendor filter options
var vendorNames = Object.keys(vendors).sort();
var vendorOpts = '<option value="">All Vendors</option>';
vendorNames.forEach(function(v) { vendorOpts += '<option value="' + v + '">' + v + '</option>'; });

// Table rows
var rows = '';
data.forEach(function(d) {
  var isPRC = d.prcProduct === 'Yes';
  var key = d.peptide + '|' + d.strength;
  var price = parseFloat(d.price);
  var isBest = bestPrices[key] && Math.abs(bestPrices[key].price - price) < 0.01;
  var ppm = d.pricePerMg ? '$' + d.pricePerMg : '—';

  rows += '<tr class="' + (isPRC ? 'prc-row' : '') + '" data-p="' + d.peptide.toLowerCase() + '" data-v="' + d.vendor + '" data-prc="' + d.prcProduct + '">' +
    '<td class="td-name">' + d.peptide + '</td>' +
    '<td class="td-strength">' + d.strength + '</td>' +
    '<td class="td-price">' +
    '<div class="price-wrap">' +
    '<span class="price-val' + (isPRC ? ' price-prc' : '') + '">$' + price.toFixed(2) + '</span>' +
    (isBest ? '<div class="best-badge">BEST PRICE</div>' : '') +
    '</div></td>' +
    '<td class="td-ppm">' + ppm + '</td>' +
    '<td class="td-vendor">' + 
    (vendorURLs[d.vendor] ? '<a href="' + vendorURLs[d.vendor] + '" target="_blank" class="vendor-link' + (isPRC ? ' vendor-link-prc' : '') + '">' + d.vendor + '</a>' : '<span class="' + (isPRC ? 'vendor-prc' : '') + '">' + d.vendor + '</span>') + 
    '</td>' +
    '<td class="td-code">' + (d.discountCode ? '<code class="disc-code">' + d.discountCode + '</code>' : '<span class="code-empty">—</span>') + '</td>' +
    '</tr>\n';
});

// Vendor directory
var vendorCounts = {};
data.forEach(function(d) { if (!vendorCounts[d.vendor]) vendorCounts[d.vendor] = 0; vendorCounts[d.vendor]++; });
var comingSoon = ["Limitless Life Nootropics", "Core Peptides", "SwissChems", "Nootropic Source", "Peptide Sciences", "Paradigm Peptides"];

var vdirHTML = '';
vendorNames.forEach(function(name) {
  var url = vendorURLs[name] || '';
  var meta = vendorMeta[name] || {};
  var isPRC = name === 'PRC';
  var displayUrl = url.replace('https://', '').replace('http://', '').replace(/\/.*/, '');
  var badges = '';
  if (meta.coa) badges += '<span class="vcard-badge badge-coa">COA</span>';
  if (meta.shipping === 'US') badges += '<span class="vcard-badge badge-us">US</span>';
  else if (meta.shipping === 'International') badges += '<span class="vcard-badge badge-intl">INTL</span>';
  
  vdirHTML += '<div class="vcard' + (isPRC ? ' vcard-prc' : '') + '">' +
    '<div class="vcard-header">' +
    (url ? '<a href="' + url + '" target="_blank" class="vcard-name">' + name + '</a>' : '<div class="vcard-name-plain">' + name + '</div>') +
    '<div class="vcard-count">' + vendorCounts[name] + ' product' + (vendorCounts[name] === 1 ? '' : 's') + '</div>' +
    '</div>' +
    (badges ? '<div class="vcard-badges">' + badges + '</div>' : '') +
    (meta.promo ? '<div class="vcard-promo">💎 ' + meta.promo + '</div>' : '') +
    (displayUrl ? '<div class="vcard-url">' + displayUrl + '</div>' : '') + 
    '</div>';
});
comingSoon.forEach(function(name) {
  vdirHTML += '<div class="vcard vcard-soon"><div class="vcard-header">' +
    '<div class="vcard-name-plain">' + name + '</div>' +
    '<div class="vcard-status">COMING SOON</div></div></div>';
});

var html = '<!DOCTYPE html>\n<html lang="en"><head>\n' +
'<meta charset="UTF-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">\n' +
'<title>Peptide Price Comparison — The Definitive Research Peptide Market Index</title>\n' +
'<style>\n' +

// Reset & Base
'*{margin:0;padding:0;box-sizing:border-box}\n' +
':root{--navy-950:#0B1221;--navy-900:#0F1629;--navy-850:#111927;--navy-800:#1A2332;--navy-700:#1E293B;' +
'--blue-500:#2B7DE9;--blue-400:#3B8EF3;--cyan-500:#06B6D4;--cyan-400:#22D3EE;' +
'--green-500:#10B981;--green-400:#34D399;--amber-500:#F59E0B;--amber-400:#FBBF24;' +
'--slate-50:#F8FAFC;--slate-100:#F1F5F9;--slate-200:#E2E8F0;--slate-300:#CBD5E1;--slate-400:#94A3B8;--slate-500:#64748B;--slate-600:#475569;' +
'--red-500:#EF4444}\n' +

'body{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Inter",Segoe UI,Roboto,sans-serif;' +
'background:var(--navy-950);color:var(--slate-200);line-height:1.6;-webkit-text-size-adjust:100%;' +
'font-feature-settings:"kern" 1,"liga" 1;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}\n' +

// Header - Premium pharma landing page feel
'.header{position:relative;padding:3rem 1.5rem 2.25rem;text-align:center;' +
'background:linear-gradient(165deg,#0F1A2E 0%,#0B1221 50%,#0B1221 100%);' +
'border-bottom:1px solid rgba(43,125,233,.12);overflow:hidden}\n' +

'.header::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;' +
'background:linear-gradient(90deg,transparent,rgba(43,125,233,.4),transparent)}\n' +

'.header::after{content:"";position:absolute;top:-50%;left:-50%;width:200%;height:200%;' +
'background:radial-gradient(circle at 50% 0%,rgba(43,125,233,.03) 0%,transparent 50%);' +
'pointer-events:none;z-index:0}\n' +

'.header-content{position:relative;z-index:1;max-width:800px;margin:0 auto}\n' +

'.header-eyebrow{font-size:.625rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;' +
'color:var(--cyan-400);margin-bottom:.75rem;opacity:.9}\n' +

'.header-title{font-size:2rem;font-weight:800;color:var(--slate-50);letter-spacing:-.02em;' +
'margin-bottom:.5rem;line-height:1.2}\n' +

'.header-subtitle{font-size:.8rem;font-weight:600;color:var(--slate-400);letter-spacing:1.5px;' +
'text-transform:uppercase;margin-top:.65rem}\n' +

// Stats - Refined cards with better hierarchy
'.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:0;' +
'background:var(--navy-900);border-top:2px solid var(--cyan-500);' +
'border-bottom:1px solid rgba(43,125,233,.08)}\n' +

'.stat{position:relative;text-align:center;padding:1.5rem .75rem;' +
'border-right:1px solid rgba(255,255,255,.03)}\n' +

'.stat:last-child{border-right:none}\n' +

'.stat::after{content:"";position:absolute;top:0;left:0;right:0;height:1px;' +
'background:linear-gradient(90deg,transparent,rgba(43,125,233,.15),transparent);opacity:0}\n' +

'.stat-icon{font-size:1.25rem;margin-bottom:.5rem;filter:grayscale(.2)}\n' +

'.stat-value{font-size:2.25rem;font-weight:800;color:var(--blue-400);' +
'line-height:1;letter-spacing:-.03em;font-variant-numeric:tabular-nums}\n' +

'.stat-label{font-size:.55rem;color:var(--slate-500);text-transform:uppercase;' +
'letter-spacing:1.8px;font-weight:700;margin-top:.5rem}\n' +

// Spotlight - Premium card design
'.spotlight{padding:2rem 1.25rem;background:linear-gradient(180deg,rgba(43,125,233,.02) 0%,transparent 100%);' +
'border-bottom:1px solid rgba(43,125,233,.08)}\n' +

'.spotlight-header{display:flex;align-items:center;gap:.5rem;margin-bottom:1.25rem}\n' +

'.spotlight-icon{font-size:1.1rem}\n' +

'.spotlight-title{font-size:.7rem;font-weight:800;color:var(--amber-400);' +
'text-transform:uppercase;letter-spacing:2.5px}\n' +

'.spotlight-cards{display:flex;gap:1rem;overflow-x:auto;-webkit-overflow-scrolling:touch;' +
'padding-bottom:.75rem;scroll-snap-type:x mandatory}\n' +

'.spot-card{flex:0 0 auto;min-width:260px;background:linear-gradient(135deg,rgba(30,41,59,.5),rgba(15,23,42,.5));' +
'border:1px solid rgba(43,125,233,.15);border-radius:14px;padding:1.25rem 1.35rem;' +
'scroll-snap-align:start;position:relative;overflow:hidden;' +
'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}\n' +

'.spot-card::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;' +
'background:linear-gradient(90deg,var(--green-500),var(--cyan-500))}\n' +

'.spot-badge{display:inline-block;font-size:.5rem;font-weight:800;color:var(--slate-950);' +
'background:linear-gradient(135deg,var(--amber-400),var(--amber-500));' +
'padding:.25rem .6rem;border-radius:6px;letter-spacing:1px;margin-bottom:.75rem}\n' +

'.spot-name{font-size:1.05rem;font-weight:700;color:var(--slate-50);' +
'letter-spacing:-.01em;line-height:1.3}\n' +

'.spot-strength{font-size:.8rem;color:var(--slate-400);margin-top:.15rem;font-weight:600}\n' +

'.spot-compare{margin-top:1rem;padding-top:1rem;' +
'border-top:1px solid rgba(255,255,255,.06)}\n' +

'.spot-prc-line,.spot-comp-line{display:flex;justify-content:space-between;' +
'align-items:center;margin-bottom:.5rem}\n' +

'.spot-label{font-size:.65rem;color:var(--slate-500);font-weight:600;' +
'text-transform:uppercase;letter-spacing:1px}\n' +

'.spot-prc-price{font-size:1rem;font-weight:800;color:var(--green-400);' +
'font-variant-numeric:tabular-nums}\n' +

'.spot-comp-price{font-size:.9rem;font-weight:700;color:var(--slate-500);' +
'text-decoration:line-through;opacity:.7;font-variant-numeric:tabular-nums}\n' +

'.spot-save-pill{display:inline-flex;align-items:center;justify-content:center;' +
'margin-top:.85rem;font-size:.7rem;font-weight:800;color:var(--slate-50);' +
'background:linear-gradient(135deg,var(--green-500),var(--green-400));' +
'padding:.4rem 1rem;border-radius:20px;letter-spacing:.5px;' +
'box-shadow:0 4px 12px rgba(16,185,129,.15)}\n' +

// Filters - Refined inputs
'.filters{padding:1.25rem 1.25rem 1rem;background:var(--navy-850);' +
'border-bottom:1px solid rgba(43,125,233,.08)}\n' +

'.filter-row{display:flex;flex-wrap:wrap;gap:.75rem;margin-bottom:.65rem}\n' +

'.filter-input,.filter-select{font-family:inherit;font-size:.875rem;padding:.7rem .95rem;' +
'border-radius:10px;border:1.5px solid rgba(43,125,233,.2);' +
'background:var(--navy-800);color:var(--slate-200);outline:none;' +
'transition:border-color .2s,box-shadow .2s;-webkit-appearance:none}\n' +

'.filter-input{flex:1;min-width:160px}\n' +

'.filter-input::placeholder{color:var(--slate-500)}\n' +

'.filter-input:focus,.filter-select:focus{border-color:var(--blue-400);' +
'box-shadow:0 0 0 3px rgba(43,125,233,.1)}\n' +

'.filter-select{min-width:150px;' +
'background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%2394A3B8\'%3E%3Cpath d=\'M6 8.5L1 3.5h10z\'/%3E%3C/svg%3E");' +
'background-repeat:no-repeat;background-position:right .85rem center;padding-right:2.5rem}\n' +

'.filter-toggle{display:flex;align-items:center;gap:.6rem;cursor:pointer}\n' +

'.filter-checkbox{width:20px;height:20px;border-radius:6px;border:2px solid rgba(43,125,233,.3);' +
'background:var(--navy-800);cursor:pointer;accent-color:var(--cyan-500);' +
'transition:all .2s}\n' +

'.filter-checkbox:checked{background:var(--cyan-500);border-color:var(--cyan-500)}\n' +

'.filter-label{font-size:.85rem;color:var(--slate-300);font-weight:600;cursor:pointer;' +
'user-select:none;-webkit-user-select:none}\n' +

'.filter-info{font-size:.75rem;color:var(--slate-500);margin-top:.35rem;font-weight:500}\n' +

// Table - Premium data table with sticky header
'.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}\n' +

'.table{width:100%;border-collapse:collapse;font-size:.85rem;min-width:700px}\n' +

'.table thead{background:var(--navy-800);position:sticky;top:0;z-index:10;' +
'box-shadow:0 1px 0 rgba(43,125,233,.15)}\n' +

'.table th{color:var(--cyan-400);font-size:.625rem;font-weight:800;' +
'text-transform:uppercase;letter-spacing:1.5px;padding:1rem .85rem;text-align:left;' +
'border-bottom:2px solid rgba(6,182,212,.25);white-space:nowrap;' +
'background:var(--navy-800)}\n' +

'.table tbody tr{border-bottom:1px solid rgba(255,255,255,.02);' +
'transition:background-color .15s ease}\n' +

'.table tbody tr:nth-child(even){background:rgba(255,255,255,.008)}\n' +

'.table tbody tr:hover{background:rgba(43,125,233,.04)}\n' +

'.table td{padding:.85rem .85rem;vertical-align:middle}\n' +

'.prc-row{background:rgba(43,125,233,.05)!important;position:relative}\n' +

'.prc-row::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;' +
'background:linear-gradient(180deg,var(--blue-400),var(--blue-500))}\n' +

'.td-name{font-weight:700;color:var(--slate-50);letter-spacing:-.01em;font-size:.9rem}\n' +

'.td-strength{color:var(--slate-400);font-weight:600;font-size:.825rem}\n' +

'.td-price{font-variant-numeric:tabular-nums}\n' +

'.price-val{font-weight:800;font-size:.95rem;color:var(--slate-200);' +
'letter-spacing:-.01em}\n' +

'.price-prc{color:var(--green-400);font-size:1rem}\n' +

'.price-wrap{display:flex;flex-direction:column;align-items:flex-start;gap:4px}\n' +
'.best-badge{display:inline-block;font-size:.5rem;font-weight:800;' +
'color:var(--slate-50);background:linear-gradient(135deg,var(--green-500),var(--green-400));' +
'padding:2px 8px;border-radius:4px;' +
'letter-spacing:.8px;white-space:nowrap;' +
'box-shadow:0 2px 8px rgba(16,185,129,.15)}\n' +

'.td-ppm{color:var(--slate-500);font-size:.8rem;font-weight:600;' +
'font-variant-numeric:tabular-nums}\n' +

'.td-vendor{font-size:.85rem}\n' +

'.vendor-link{color:var(--slate-300);text-decoration:none;font-weight:600;' +
'border-bottom:1px solid rgba(203,213,225,.2);transition:all .2s}\n' +

'.vendor-link:hover{color:var(--blue-400);border-bottom-color:var(--blue-400)}\n' +

'.vendor-link-prc{color:var(--blue-400);font-weight:700;' +
'border-bottom-color:rgba(43,125,233,.4)}\n' +

'.vendor-prc{color:var(--blue-400);font-weight:700}\n' +

'.td-code{font-size:.8rem}\n' +

'.disc-code{font-family:"SF Mono",Menlo,Monaco,Consolas,monospace;font-size:.7rem;' +
'color:var(--cyan-400);background:rgba(6,182,212,.08);' +
'padding:.3rem .65rem;border-radius:6px;border:1px solid rgba(6,182,212,.15);' +
'letter-spacing:.3px;font-weight:600}\n' +

'.code-empty{color:var(--slate-600)}\n' +

// Vendor Directory - Premium business card style
'.vendor-directory{padding:2.5rem 1.25rem 2rem;' +
'border-top:1px solid rgba(43,125,233,.08);background:rgba(15,23,42,.3)}\n' +

'.vdir-title{font-size:.7rem;color:var(--slate-500);text-transform:uppercase;' +
'letter-spacing:2.5px;margin-bottom:1.5rem;font-weight:800}\n' +

'.vendor-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));' +
'gap:.85rem}\n' +

'.vcard{background:linear-gradient(135deg,rgba(30,41,59,.4),rgba(15,23,42,.3));' +
'border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:1rem 1.1rem;' +
'transition:all .2s;position:relative;overflow:hidden}\n' +

'.vcard::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;' +
'background:linear-gradient(90deg,transparent,rgba(43,125,233,.3),transparent);' +
'opacity:0;transition:opacity .2s}\n' +

'.vcard:hover{border-color:rgba(43,125,233,.25);transform:translateY(-2px);' +
'box-shadow:0 8px 24px rgba(0,0,0,.2)}\n' +

'.vcard:hover::before{opacity:1}\n' +

'.vcard-prc{border-color:rgba(43,125,233,.25);' +
'background:linear-gradient(135deg,rgba(43,125,233,.12),rgba(43,125,233,.05))}\n' +

'.vcard-prc::before{opacity:1;background:linear-gradient(90deg,var(--blue-500),var(--cyan-500))}\n' +

'.vcard-header{margin-bottom:.5rem}\n' +

'.vcard-name{color:var(--slate-50);font-weight:800;font-size:.875rem;' +
'text-decoration:none;display:block;letter-spacing:-.01em;transition:color .2s}\n' +

'.vcard-name:hover{color:var(--blue-400)}\n' +

'.vcard-name-plain{color:var(--slate-50);font-weight:800;font-size:.875rem;' +
'letter-spacing:-.01em}\n' +

'.vcard-count{font-size:.7rem;color:var(--green-400);font-weight:700;margin-top:.25rem}\n' +

'.vcard-badges{display:flex;gap:.35rem;margin-top:.6rem;flex-wrap:wrap}\n' +

'.vcard-badge{font-size:.5rem;font-weight:800;padding:.25rem .5rem;' +
'border-radius:5px;letter-spacing:.8px;text-transform:uppercase}\n' +

'.badge-coa{color:var(--green-400);background:rgba(16,185,129,.12);' +
'border:1px solid rgba(16,185,129,.2)}\n' +

'.badge-us{color:var(--blue-400);background:rgba(43,125,233,.12);' +
'border:1px solid rgba(43,125,233,.2)}\n' +

'.badge-intl{color:var(--amber-400);background:rgba(245,158,11,.12);' +
'border:1px solid rgba(245,158,11,.2)}\n' +

'.vcard-promo{font-size:.65rem;color:var(--amber-400);margin-top:.6rem;' +
'line-height:1.4;font-weight:500}\n' +

'.vcard-url{font-size:.625rem;color:var(--blue-400);margin-top:.5rem;opacity:.7;' +
'font-weight:600}\n' +

'.vcard-soon{opacity:.35}\n' +

'.vcard-status{font-size:.65rem;color:var(--amber-500);margin-top:.25rem;' +
'font-weight:700;letter-spacing:1px}\n' +

// Footer - Professional disclaimer style
'.footer{text-align:center;padding:2rem 1.25rem 2.5rem;' +
'border-top:1px solid rgba(43,125,233,.08);background:var(--navy-950)}\n' +

'.footer-verified{display:inline-flex;align-items:center;gap:.5rem;' +
'background:linear-gradient(135deg,rgba(16,185,129,.12),rgba(16,185,129,.08));' +
'color:var(--green-400);padding:.6rem 1.25rem;border-radius:10px;' +
'font-weight:800;font-size:.75rem;margin-bottom:1.25rem;' +
'border:1px solid rgba(16,185,129,.2)}\n' +

'.footer-verified::before{content:"✓";font-size:1rem}\n' +

'.footer-brand{font-size:.75rem;color:var(--slate-400);font-weight:600;' +
'margin-bottom:.35rem;letter-spacing:.3px}\n' +

'.footer-tagline{font-size:.7rem;color:var(--slate-500);font-weight:700;' +
'letter-spacing:1.5px;text-transform:uppercase;margin-bottom:1.5rem}\n' +

'.footer-disclaimer{max-width:600px;margin:0 auto;padding:1.25rem 1.5rem;' +
'background:rgba(239,68,68,.05);border:1px solid rgba(239,68,68,.15);' +
'border-radius:10px}\n' +

'.footer-disclaimer-title{font-size:.7rem;font-weight:800;color:var(--red-500);' +
'text-transform:uppercase;letter-spacing:1.5px;margin-bottom:.5rem}\n' +

'.footer-disclaimer-text{font-size:.7rem;color:var(--slate-400);' +
'line-height:1.6;font-weight:500}\n' +

// Mobile Responsive
'@media(max-width:640px){' +
'.header{padding:2rem 1.25rem 1.5rem}' +
'.header-title{font-size:1.5rem}' +
'.header-subtitle{font-size:.7rem}' +
'.stats{grid-template-columns:repeat(2,1fr)}' +
'.stat{padding:1.25rem .6rem}' +
'.stat-value{font-size:1.85rem}' +
'.spotlight{padding:1.5rem 1rem}' +
'.spot-card{min-width:240px}' +
'.filters{padding:1rem}' +
'.filter-row{flex-direction:column}' +
'.filter-input,.filter-select{width:100%}' +
'.table{font-size:.8rem}' +
'.table th,.table td{padding:.7rem .6rem}' +
'.vendor-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}' +
'}\n' +

'@media(max-width:480px){' +
'.header-title{font-size:1.35rem}' +
'.stat-value{font-size:1.65rem}' +
'.stat-label{font-size:.5rem}' +
'.table{font-size:.75rem;min-width:650px}' +
'}\n' +

'</style></head><body>\n' +

// Header
'<header class="header"><div class="header-content">' +
'<div class="header-eyebrow">BY PEPTIDE RESOURCE CENTER</div>' +
'<h1 class="header-title">Peptide Price Comparison</h1>' +
'<div class="header-subtitle">The Definitive Research Peptide Market Index</div>' +
'</div></header>\n' +

// Stats
'<section class="stats">' +
'<div class="stat"><div class="stat-icon">🧬</div><div class="stat-value">' + pCount + '</div>' +
'<div class="stat-label">Peptides</div></div>' +
'<div class="stat"><div class="stat-icon">🏢</div><div class="stat-value">' + vCount + '</div>' +
'<div class="stat-label">Vendors</div></div>' +
'<div class="stat"><div class="stat-icon">💊</div><div class="stat-value">' + prcCount + '</div>' +
'<div class="stat-label">PRC Products</div></div>' +
'<div class="stat"><div class="stat-icon">💰</div><div class="stat-value">70%</div>' +
'<div class="stat-label">Max Savings</div></div>' +
'</section>\n' +

// Spotlight
'<section class="spotlight"><div class="spotlight-header">' +
'<span class="spotlight-icon">🏆</span>' +
'<h2 class="spotlight-title">PRC\'s Biggest Price Wins</h2></div>' +
'<div class="spotlight-cards">' + spotHTML + '</div></section>\n' +

// Filters
'<section class="filters"><div class="filter-row">' +
'<input type="text" id="search" class="filter-input" placeholder="Search peptides... (e.g. BPC-157)" oninput="filt()">' +
'<select id="vf" class="filter-select" onchange="filt()">' + vendorOpts + '</select>' +
'</div><div class="filter-row">' +
'<label class="filter-toggle">' +
'<input type="checkbox" id="po" class="filter-checkbox" onchange="filt()">' +
'<span class="filter-label">Shop PRC Products</span></label>' +
'</div><div class="filter-info" id="rc">Showing ' + data.length + ' of ' + data.length + ' results</div>' +
'</section>\n' +

// Table
'<div class="table-wrap"><table class="table"><thead><tr>' +
'<th>Peptide</th><th>Strength</th><th>Price</th><th>$/mg</th><th>Vendor</th><th>Code</th>' +
'</tr></thead><tbody id="tb">\n' + rows + '</tbody></table></div>\n' +

// Vendor Directory
'<section class="vendor-directory"><h2 class="vdir-title">Vendor Directory</h2>' +
'<div class="vendor-grid">' + vdirHTML + '</div></section>\n' +

// Footer
'<footer class="footer">' +
'<div class="footer-verified">Prices Verified February 14, 2026</div>' +
'<div class="footer-brand">Peptide Resource Center</div>' +
'<div class="footer-tagline">The Peptide Authority</div>' +
'<div class="footer-disclaimer">' +
'<div class="footer-disclaimer-title">⚠️ For Research Use Only</div>' +
'<div class="footer-disclaimer-text">All products listed are intended for research and laboratory use only. ' +
'Not for human consumption. Prices are subject to change. Discount codes are provided by vendors and may expire without notice. ' +
'This information is provided for educational and comparison purposes.</div>' +
'</div></footer>\n' +

// Minimal ES5 JS for filtering (progressive enhancement)
'<script>\n' +
'function filt(){\n' +
'var s=document.getElementById("search").value.toLowerCase();\n' +
'var v=document.getElementById("vf").value;\n' +
'var p=document.getElementById("po").checked;\n' +
'var rows=document.getElementById("tb").getElementsByTagName("tr");\n' +
'var c=0;\n' +
'for(var i=0;i<rows.length;i++){\n' +
'var r=rows[i];\n' +
'var show=true;\n' +
'if(s&&r.getAttribute("data-p").indexOf(s)===-1)show=false;\n' +
'if(v&&r.getAttribute("data-v")!==v)show=false;\n' +
'if(p&&r.getAttribute("data-prc")!=="Yes")show=false;\n' +
'r.style.display=show?"":"none";\n' +
'if(show)c++;\n' +
'}\n' +
'document.getElementById("rc").textContent="Showing "+c+" of "+rows.length+" results";\n' +
'}\n' +
'<\/script>\n' +
'</body></html>';

fs.writeFileSync('peptide_comparison_tool.html', html);
console.log('✨ Premium build complete!');
console.log('📊 File size: ' + (Buffer.byteLength(html) / 1024).toFixed(1) + 'KB');
console.log('📦 Total rows: ' + data.length);
console.log('🏆 BEST PRICE badges: ' + (html.match(/BEST PRICE/g) || []).length);
console.log('💎 Spotlight cards: ' + topSavings.length);
console.log('🏢 Vendor cards: ' + vendorNames.length);
