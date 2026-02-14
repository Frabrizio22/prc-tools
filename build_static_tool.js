var fs = require('fs');
var data = JSON.parse(fs.readFileSync('peptide_data.json', 'utf8'));

// Calculate stats
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

// Sort data by peptide name
data.sort(function(a, b) {
  var ap = a.peptide.toLowerCase(), bp = b.peptide.toLowerCase();
  if (ap < bp) return -1;
  if (ap > bp) return 1;
  return 0;
});

// Build spotlight HTML
var spotlightHTML = '';
topSavings.forEach(function(s) {
  spotlightHTML += '<div class="spot-card">' +
    '<div class="spot-name">' + s.peptide + ' ' + s.strength + '</div>' +
    '<div class="spot-detail">PRC $' + s.prcPrice.toFixed(2) + ' vs $' + s.compPrice.toFixed(2) + ' at ' + s.compVendor + '</div>' +
    '<div class="spot-save">SAVE ' + s.pct + '%</div></div>';
});

// Build table rows
var rowsHTML = '';
data.forEach(function(d) {
  var isPRC = d.prcProduct === 'Yes';
  var key = d.peptide + '|' + d.strength;
  var price = parseFloat(d.price);
  var isBest = bestPrices[key] && Math.abs(bestPrices[key].price - price) < 0.01;
  var ppm = d.pricePerMg ? '$' + d.pricePerMg : '';

  rowsHTML += '<tr class="' + (isPRC ? 'prc-row' : '') + '" data-peptide="' + d.peptide.toLowerCase() + '" data-vendor="' + d.vendor + '" data-prc="' + d.prcProduct + '">' +
    '<td>' + d.peptide + '</td>' +
    '<td>' + d.strength + '</td>' +
    '<td class="' + (isPRC ? 'vendor-prc' : '') + '">' + d.vendor + '</td>' +
    '<td class="price">$' + price.toFixed(2) + (isBest ? ' <span class="best">BEST</span>' : '') + '</td>' +
    '<td>' + ppm + '</td>' +
    '<td>' + (d.discountCode ? '<span class="code">' + d.discountCode + '</span>' : '') + '</td>' +
    '</tr>\n';
});

// Build vendor filter options
var vendorNames = Object.keys(vendors).sort();
var vendorOptionsHTML = '<option value="">All Vendors</option>';
vendorNames.forEach(function(v) {
  vendorOptionsHTML += '<option value="' + v + '">' + v + '</option>';
});

// Build vendor directory
var vendorCounts = {};
data.forEach(function(d) {
  if (!vendorCounts[d.vendor]) vendorCounts[d.vendor] = 0;
  vendorCounts[d.vendor]++;
});

var vendorURLs = {
  "PRC": "peptideresourcecenter.com",
  "AIO": "aiopeptides.com",
  "Strate": "stratelabs.is",
  "Elev8": "elev8peptides.com",
  "Biopeptide": "biopeptide.com",
  "Penguin": "penguinpeptides.com",
  "BC9": "bc9.com",
  "Synagenics": "synagenics.com"
};
var comingSoon = ["Limitless Life Nootropics", "Core Peptides", "SwissChems", "Nootropic Source", "Peptide Sciences", "Paradigm Peptides"];

var vendorDirHTML = '';
vendorNames.forEach(function(name) {
  var url = vendorURLs[name] || '';
  var isPRC = name === 'PRC';
  vendorDirHTML += '<div class="v-card' + (isPRC ? ' prc-card' : '') + '">' +
    '<div class="v-name">' + name + '</div>' +
    '<div class="v-count">' + vendorCounts[name] + ' products</div>' +
    (url ? '<div class="v-url">' + url + '</div>' : '') +
    '</div>';
});
comingSoon.forEach(function(name) {
  vendorDirHTML += '<div class="v-card soon"><div class="v-name">' + name + '</div><div class="v-soon">Coming Soon</div></div>';
});

// Assemble full HTML
var html = '<!DOCTYPE html>\n<html lang="en"><head>\n' +
'<meta charset="UTF-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'<title>Peptide Price Comparison</title>\n' +
'<style>\n' +
'*{margin:0;padding:0;box-sizing:border-box}\n' +
'body{font-family:-apple-system,BlinkMacSystemFont,Inter,Segoe UI,sans-serif;background:#0A1628;color:#E2E8F0;line-height:1.5;-webkit-text-size-adjust:100%}\n' +
'.hdr{text-align:center;padding:2rem 1rem 1.25rem;border-bottom:1px solid rgba(43,125,233,.15)}\n' +
'.hdr h1{font-size:1.4rem;color:#fff;letter-spacing:.5px;margin-bottom:.15rem}\n' +
'.hdr .sub{font-size:.7rem;color:#2B7DE9;font-weight:600;letter-spacing:2px;text-transform:uppercase}\n' +
'.stats{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid rgba(43,125,233,.15)}\n' +
'.st{text-align:center;padding:.9rem .4rem}\n' +
'.st .n{font-size:1.5rem;font-weight:700;color:#2B7DE9}\n' +
'.st .l{font-size:.55rem;color:#8E99A4;text-transform:uppercase;letter-spacing:1.5px;margin-top:2px}\n' +
'.spot{padding:1.25rem 1rem;border-bottom:1px solid rgba(43,125,233,.15)}\n' +
'.spot h2{font-size:.65rem;color:#8E99A4;text-transform:uppercase;letter-spacing:2px;margin-bottom:.75rem}\n' +
'.spot-cards{display:flex;gap:.6rem;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:.5rem}\n' +
'.spot-card{flex:0 0 auto;min-width:210px;background:rgba(43,125,233,.06);border:1px solid rgba(43,125,233,.12);border-radius:8px;padding:.85rem 1rem}\n' +
'.spot-name{font-weight:600;font-size:.85rem;color:#fff}\n' +
'.spot-detail{font-size:.75rem;color:#8E99A4;margin-top:.15rem}\n' +
'.spot-save{display:inline-block;margin-top:.4rem;font-size:.7rem;font-weight:700;color:#10B981;background:rgba(16,185,129,.1);padding:2px 8px;border-radius:4px}\n' +
'.flt{padding:.85rem 1rem;display:flex;flex-wrap:wrap;gap:.5rem;border-bottom:1px solid rgba(43,125,233,.15)}\n' +
'.flt input,.flt select{font-size:.85rem;padding:.5rem .7rem;border-radius:6px;border:1px solid rgba(43,125,233,.25);background:#1E293B;color:#E2E8F0;outline:none;-webkit-appearance:none}\n' +
'.flt input{flex:1;min-width:120px}\n' +
'.flt select{min-width:110px}\n' +
'.flt input:focus,.flt select:focus{border-color:#2B7DE9}\n' +
'.tgl{display:flex;align-items:center;gap:.35rem;font-size:.8rem;color:#8E99A4;white-space:nowrap}\n' +
'.tgl input{width:16px;height:16px;accent-color:#2B7DE9}\n' +
'.rc{width:100%;font-size:.7rem;color:#8E99A4;margin-top:.2rem}\n' +
'.tw{overflow-x:auto;-webkit-overflow-scrolling:touch}\n' +
'table{width:100%;border-collapse:collapse;font-size:.78rem;min-width:580px}\n' +
'thead th{position:sticky;top:0;background:#1E293B;color:#8E99A4;font-size:.6rem;font-weight:600;text-transform:uppercase;letter-spacing:1px;padding:.7rem .5rem;text-align:left;border-bottom:2px solid rgba(43,125,233,.25);white-space:nowrap}\n' +
'tbody tr{border-bottom:1px solid rgba(255,255,255,.03)}\n' +
'td{padding:.55rem .5rem}\n' +
'.prc-row{background:rgba(43,125,233,.05)}\n' +
'.prc-row td:first-child{border-left:3px solid #2B7DE9}\n' +
'.vendor-prc{color:#2B7DE9;font-weight:700}\n' +
'.price{font-weight:600;font-variant-numeric:tabular-nums}\n' +
'.best{font-size:.55rem;font-weight:700;color:#10B981;background:rgba(16,185,129,.1);padding:1px 5px;border-radius:3px;margin-left:3px;vertical-align:middle}\n' +
'.code{font-size:.65rem;color:#06B6D4;background:rgba(6,182,212,.08);padding:2px 6px;border-radius:3px;font-family:SF Mono,Menlo,monospace}\n' +
'.vd{padding:1.25rem 1rem;border-top:1px solid rgba(43,125,233,.15)}\n' +
'.vd h2{font-size:.65rem;color:#8E99A4;text-transform:uppercase;letter-spacing:2px;margin-bottom:.85rem}\n' +
'.vg{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:.5rem}\n' +
'.v-card{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.05);border-radius:6px;padding:.65rem .75rem}\n' +
'.prc-card{border-color:rgba(43,125,233,.25)}\n' +
'.v-name{font-weight:600;font-size:.8rem;color:#fff}\n' +
'.v-count{font-size:.65rem;color:#10B981;margin-top:1px}\n' +
'.v-url{font-size:.6rem;color:#2B7DE9;margin-top:2px}\n' +
'.v-soon{font-size:.65rem;color:#F59E0B;margin-top:1px}\n' +
'.soon{opacity:.6}\n' +
'.ft{text-align:center;padding:1.5rem 1rem;border-top:1px solid rgba(43,125,233,.15);font-size:.65rem;color:#8E99A4}\n' +
'.ft .vb{display:inline-block;background:rgba(16,185,129,.1);color:#10B981;padding:3px 10px;border-radius:4px;margin-bottom:.6rem;font-weight:600}\n' +
'.ft p{margin-top:.4rem}\n' +
'@media(max-width:480px){.hdr h1{font-size:1.15rem}.stats{grid-template-columns:repeat(2,1fr)}.st .n{font-size:1.2rem}.flt{flex-direction:column}.flt input,.flt select{width:100%}table{font-size:.7rem}}\n' +
'</style></head><body>\n' +

'<div class="hdr"><h1>Peptide Price Comparison</h1><div class="sub">By Peptide Resource Center</div></div>\n' +

'<div class="stats">' +
'<div class="st"><div class="n">' + pCount + '</div><div class="l">Peptides</div></div>' +
'<div class="st"><div class="n">' + vCount + '</div><div class="l">Vendors</div></div>' +
'<div class="st"><div class="n">' + prcCount + '</div><div class="l">PRC Products</div></div>' +
'<div class="st"><div class="n">70%</div><div class="l">Max Savings</div></div>' +
'</div>\n' +

'<div class="spot"><h2>Top PRC Savings</h2><div class="spot-cards">' + spotlightHTML + '</div></div>\n' +

'<div class="flt">' +
'<input type="text" id="search" placeholder="Search peptides..." oninput="filt()">' +
'<select id="vf" onchange="filt()">' + vendorOptionsHTML + '</select>' +
'<div class="tgl"><input type="checkbox" id="po" onchange="filt()"><label for="po">PRC Only</label></div>' +
'<div class="rc" id="rc">' + data.length + ' of ' + data.length + ' results</div>' +
'</div>\n' +

'<div class="tw"><table><thead><tr>' +
'<th>Peptide</th><th>Strength</th><th>Vendor</th><th>Price</th><th>$/mg</th><th>Code</th>' +
'</tr></thead><tbody id="tb">\n' + rowsHTML + '</tbody></table></div>\n' +

'<div class="vd"><h2>Vendor Directory</h2><div class="vg">' + vendorDirHTML + '</div></div>\n' +

'<div class="ft"><div class="vb">Prices verified February 13, 2026</div>' +
'<p>Peptide Resource Center — The Peptide Authority</p>' +
'<p>All products are for research purposes only. Not for human consumption.</p></div>\n' +

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
'if(s&&r.getAttribute("data-peptide").indexOf(s)===-1)show=false;\n' +
'if(v&&r.getAttribute("data-vendor")!==v)show=false;\n' +
'if(p&&r.getAttribute("data-prc")!=="Yes")show=false;\n' +
'r.style.display=show?"":"none";\n' +
'if(show)c++;\n' +
'}\n' +
'document.getElementById("rc").textContent=c+" of "+rows.length+" results";\n' +
'}\n' +
'<\/script>\n' +
'</body></html>';

fs.writeFileSync('peptide_comparison_tool.html', html);
console.log('Built! Size: ' + (Buffer.byteLength(html) / 1024).toFixed(1) + 'KB');
console.log('Rows: ' + data.length);
