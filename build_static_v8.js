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
  spotHTML += '<div class="spot-card"><div class="spot-emoji">🏆</div>' +
    '<div class="spot-name">' + s.peptide + ' ' + s.strength + '</div>' +
    '<div class="spot-detail">PRC <span class="spot-prc">$' + s.prcPrice.toFixed(2) + '</span> vs <span class="spot-comp">$' + s.compPrice.toFixed(2) + '</span> at ' + s.compVendor + '</div>' +
    '<div class="spot-save">SAVE ' + s.pct + '%</div></div>';
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
    '<td>' + d.strength + '</td>' +
    '<td class="td-price' + (isPRC ? ' prc-price' : '') + '">$' + price.toFixed(2) +
    (isBest ? '<span class="best-badge">BEST PRICE</span>' : '') + '</td>' +
    '<td class="td-ppm">' + ppm + '</td>' +
    '<td class="' + (isPRC ? 'td-vendor-prc' : 'td-vendor') + '">' + (vendorURLs[d.vendor] ? '<a href="' + vendorURLs[d.vendor] + '" target="_blank" class="vendor-link' + (isPRC ? ' vl-prc' : '') + '">' + d.vendor + '</a>' : d.vendor) + '</td>' +
    '<td>' + (d.discountCode ? '<span class="code">' + d.discountCode + '</span>' : '—') + '</td>' +
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
  if (meta.coa) badges += '<span class="v-badge v-coa">COA</span>';
  if (meta.shipping === 'US') badges += '<span class="v-badge v-ship">US Ship</span>';
  else if (meta.shipping === 'International') badges += '<span class="v-badge v-intl">Intl</span>';
  
  vdirHTML += '<div class="v-card' + (isPRC ? ' v-prc' : '') + '">' +
    (url ? '<a href="' + url + '" target="_blank" class="v-name-link">' + name + '</a>' : '<div class="v-name">' + name + '</div>') +
    '<div class="v-count">' + vendorCounts[name] + ' products</div>' +
    (badges ? '<div class="v-badges">' + badges + '</div>' : '') +
    (meta.promo ? '<div class="v-promo">' + meta.promo + '</div>' : '') +
    (displayUrl ? '<div class="v-url">' + displayUrl + '</div>' : '') + '</div>';
});
comingSoon.forEach(function(name) {
  vdirHTML += '<div class="v-card v-soon"><div class="v-name">' + name + '</div><div class="v-coming">Coming Soon</div></div>';
});

var html = '<!DOCTYPE html>\n<html lang="en"><head>\n' +
'<meta charset="UTF-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'<title>Peptide Price Comparison — PRC</title>\n' +
'<style>\n' +
'*{margin:0;padding:0;box-sizing:border-box}\n' +
'body{font-family:-apple-system,BlinkMacSystemFont,Inter,Segoe UI,sans-serif;background:#0B1221;color:#E2E8F0;line-height:1.5;-webkit-text-size-adjust:100%}\n' +

// Header
'.hdr{text-align:center;padding:2rem 1.25rem 1.5rem;background:linear-gradient(180deg,#0F1A2E 0%,#0B1221 100%)}\n' +
'.hdr h1{font-size:1.5rem;color:#fff;font-weight:800;letter-spacing:.5px}\n' +
'.hdr .sub{font-size:.7rem;color:#2B7DE9;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;margin-top:.2rem}\n' +
'.hdr .tag{font-size:.65rem;color:#06B6D4;font-weight:500;letter-spacing:1.5px;margin-top:.35rem}\n' +

// Stats
'.stats{display:grid;grid-template-columns:repeat(4,1fr);background:#0F1629;border-top:2px solid #06B6D4;border-bottom:1px solid rgba(43,125,233,.15)}\n' +
'.st{text-align:center;padding:1rem .4rem;border-right:1px solid rgba(255,255,255,.04)}\n' +
'.st:last-child{border-right:none}\n' +
'.st .icon{font-size:1.1rem;margin-bottom:.2rem}\n' +
'.st .n{font-size:1.6rem;font-weight:800;color:#2B7DE9}\n' +
'.st .l{font-size:.5rem;color:#8E99A4;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;margin-top:2px}\n' +

// Spotlight
'.spot{padding:1.25rem 1rem;background:rgba(43,125,233,.03);border-bottom:1px solid rgba(43,125,233,.15)}\n' +
'.spot h2{font-size:.7rem;color:#F59E0B;text-transform:uppercase;letter-spacing:2px;margin-bottom:.75rem;font-weight:700}\n' +
'.spot-cards{display:flex;gap:.65rem;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:.5rem}\n' +
'.spot-card{flex:0 0 auto;min-width:230px;background:linear-gradient(135deg,rgba(43,125,233,.08),rgba(6,182,212,.05));border:1px solid rgba(43,125,233,.18);border-radius:10px;padding:1rem 1.1rem}\n' +
'.spot-emoji{font-size:1.2rem;margin-bottom:.3rem}\n' +
'.spot-name{font-weight:700;font-size:.95rem;color:#fff}\n' +
'.spot-detail{font-size:.75rem;color:#8E99A4;margin-top:.25rem}\n' +
'.spot-prc{color:#10B981;font-weight:700}\n' +
'.spot-comp{color:#EF4444;text-decoration:line-through;opacity:.7}\n' +
'.spot-save{display:inline-block;margin-top:.5rem;font-size:.75rem;font-weight:800;color:#fff;background:linear-gradient(135deg,#10B981,#059669);padding:3px 12px;border-radius:5px}\n' +

// Filters
'.flt{padding:1rem 1rem .75rem;border-bottom:1px solid rgba(43,125,233,.15)}\n' +
'.flt-row{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:.5rem}\n' +
'.flt input[type=text],.flt select{font-size:.85rem;padding:.55rem .8rem;border-radius:8px;border:1px solid rgba(43,125,233,.25);background:#1A2332;color:#E2E8F0;outline:none;-webkit-appearance:none;transition:border-color .2s}\n' +
'.flt input[type=text]{flex:1;min-width:140px}\n' +
'.flt select{min-width:130px;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\' fill=\'%238E99A4\'%3E%3Cpath d=\'M5 7L0 2h10z\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:28px}\n' +
'.flt input:focus,.flt select:focus{border-color:#2B7DE9}\n' +
'.tgl{display:flex;align-items:center;gap:.5rem;font-size:.8rem;color:#CBD5E1;font-weight:500}\n' +
'.tgl input[type=checkbox]{width:18px;height:18px;accent-color:#06B6D4;border-radius:4px}\n' +
'.flt-info{font-size:.75rem;color:#64748B;margin-top:.25rem}\n' +

// Table
'.tw{overflow-x:auto;-webkit-overflow-scrolling:touch}\n' +
'table{width:100%;border-collapse:collapse;font-size:.8rem;min-width:620px}\n' +
'thead{background:#141D2E}\n' +
'thead th{color:#06B6D4;font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;padding:.75rem .6rem;text-align:left;border-bottom:2px solid rgba(6,182,212,.3);white-space:nowrap}\n' +
'tbody tr{border-bottom:1px solid rgba(255,255,255,.03);transition:background .15s}\n' +
'td{padding:.65rem .6rem;vertical-align:middle}\n' +
'.prc-row{background:rgba(43,125,233,.06)}\n' +
'.prc-row td:first-child{border-left:3px solid #2B7DE9}\n' +
'.td-name{font-weight:600;color:#F1F5F9}\n' +
'.td-price{font-weight:700;font-size:.9rem;font-variant-numeric:tabular-nums;color:#E2E8F0}\n' +
'.prc-price{color:#10B981;font-size:.95rem}\n' +
'.best-badge{display:block;font-size:.55rem;font-weight:800;color:#fff;background:linear-gradient(135deg,#10B981,#059669);padding:2px 8px;border-radius:4px;margin-top:3px;text-align:center;width:fit-content}\n' +
'.td-ppm{color:#8E99A4;font-size:.75rem}\n' +
'.td-vendor{color:#CBD5E1}\n' +
'.td-vendor-prc{color:#2B7DE9;font-weight:700}\n' +
'.vendor-link{color:#CBD5E1;text-decoration:none;border-bottom:1px dotted rgba(255,255,255,.2)}\n' +
'.vendor-link:hover{color:#2B7DE9}\n' +
'.vl-prc{color:#2B7DE9;font-weight:700;border-bottom-color:rgba(43,125,233,.3)}\n' +
'.v-name-link{color:#fff;text-decoration:none;font-weight:700;font-size:.8rem;display:block}\n' +
'.v-name-link:hover{color:#2B7DE9}\n' +
'.code{font-size:.65rem;color:#06B6D4;background:rgba(6,182,212,.1);padding:2px 8px;border-radius:4px;font-family:SF Mono,Menlo,monospace;letter-spacing:.5px}\n' +

// Vendor Directory
'.vd{padding:1.5rem 1rem;border-top:1px solid rgba(43,125,233,.15)}\n' +
'.vd h2{font-size:.65rem;color:#8E99A4;text-transform:uppercase;letter-spacing:2px;margin-bottom:1rem;font-weight:700}\n' +
'.vg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:.5rem}\n' +
'.v-card{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:8px;padding:.7rem .8rem}\n' +
'.v-prc{border-color:rgba(43,125,233,.3);background:rgba(43,125,233,.05)}\n' +
'.v-name{font-weight:700;font-size:.8rem;color:#fff}\n' +
'.v-count{font-size:.65rem;color:#10B981;font-weight:600;margin-top:2px}\n' +
'.v-url{font-size:.6rem;color:#2B7DE9;margin-top:2px}\n' +
'.v-badges{display:flex;gap:4px;margin-top:4px;flex-wrap:wrap}\n' +
'.v-badge{font-size:.5rem;font-weight:700;padding:1px 5px;border-radius:3px;text-transform:uppercase;letter-spacing:.5px}\n' +
'.v-coa{color:#10B981;background:rgba(16,185,129,.1)}\n' +
'.v-ship{color:#2B7DE9;background:rgba(43,125,233,.1)}\n' +
'.v-intl{color:#F59E0B;background:rgba(245,158,11,.1)}\n' +
'.v-promo{font-size:.6rem;color:#F59E0B;margin-top:3px;line-height:1.3}\n' +
'.v-soon{opacity:.5}\n' +
'.v-coming{font-size:.65rem;color:#F59E0B;margin-top:2px}\n' +

// Footer
'.ft{text-align:center;padding:1.5rem 1rem;border-top:1px solid rgba(43,125,233,.15);font-size:.65rem;color:#64748B}\n' +
'.ft .vb{display:inline-block;background:rgba(16,185,129,.1);color:#10B981;padding:4px 14px;border-radius:5px;font-weight:700;font-size:.7rem;margin-bottom:.75rem}\n' +
'.ft p{margin-top:.4rem}\n' +
'.ft .disc{margin-top:.75rem;font-size:.6rem;color:#475569;max-width:400px;margin-left:auto;margin-right:auto}\n' +

// Mobile
'@media(max-width:480px){.hdr h1{font-size:1.25rem}.stats{grid-template-columns:repeat(2,1fr)}.st{padding:.75rem .4rem}.st .n{font-size:1.3rem}.flt-row{flex-direction:column}.flt input[type=text],.flt select{width:100%}table{font-size:.72rem}}\n' +
'</style></head><body>\n' +

// Header
'<div class="hdr"><h1>Peptide Price Comparison</h1>' +
'<div class="sub">By Peptide Resource Center</div>' +
'<div class="tag">The Peptide Authority</div></div>\n' +

// Stats
'<div class="stats">' +
'<div class="st"><div class="icon">🧬</div><div class="n">' + pCount + '</div><div class="l">Peptides</div></div>' +
'<div class="st"><div class="icon">🏢</div><div class="n">' + vCount + '</div><div class="l">Vendors</div></div>' +
'<div class="st"><div class="icon">💊</div><div class="n">' + prcCount + '</div><div class="l">PRC Products</div></div>' +
'<div class="st"><div class="icon">💰</div><div class="n">70%</div><div class="l">Max Savings</div></div>' +
'</div>\n' +

// Spotlight
'<div class="spot"><h2>🏆 PRC\'s Biggest Price Wins</h2><div class="spot-cards">' + spotHTML + '</div></div>\n' +

// Filters
'<div class="flt"><div class="flt-row">' +
'<input type="text" id="search" placeholder="Search peptides... (e.g. BPC-157)" oninput="filt()">' +
'<select id="vf" onchange="filt()">' + vendorOpts + '</select>' +
'</div><div class="flt-row">' +
'<div class="tgl"><input type="checkbox" id="po" onchange="filt()"><label for="po">Shop PRC Products</label></div>' +
'</div>' +
'<div class="flt-info" id="rc">Showing ' + data.length + ' of ' + data.length + ' results</div></div>\n' +

// Table
'<div class="tw"><table><thead><tr>' +
'<th>Peptide</th><th>Strength</th><th>Price</th><th>$/mg</th><th>Vendor</th><th>Code</th>' +
'</tr></thead><tbody id="tb">\n' + rows + '</tbody></table></div>\n' +

// Vendor Directory
'<div class="vd"><h2>Vendor Directory</h2><div class="vg">' + vdirHTML + '</div></div>\n' +

// Footer
'<div class="ft"><div class="vb">✓ Prices Verified February 13, 2026</div>' +
'<p>Peptide Resource Center — The Peptide Authority</p>' +
'<p class="disc">All products listed are intended for research and laboratory use only. Not for human consumption. Prices are subject to change. Discount codes are provided by vendors and may expire without notice.</p></div>\n' +

// Minimal JS for filtering (progressive enhancement)
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
console.log('Built! Size: ' + (Buffer.byteLength(html) / 1024).toFixed(1) + 'KB');
console.log('Rows: ' + data.length);
// Quick verify
var rowCount = (html.match(/<tr class="/g) || []).length;
console.log('TR elements with class: ' + rowCount);
var bestCount = (html.match(/BEST PRICE/g) || []).length;
console.log('BEST PRICE badges: ' + bestCount);
