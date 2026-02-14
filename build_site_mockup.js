var fs = require('fs');
var md = fs.readFileSync('product_descriptions_v3.md', 'utf8');

// Parse products from markdown
var sections = md.split(/\n## /);
var categories = [];
var allProducts = [];

var categoryColors = {
  'Neuropeptides & Cognitive Research': { color: '#8B5CF6', id: 'neuropeptides' },
  'GLP Receptor Agonists': { color: '#EC4899', id: 'glp-agonists' },
  'Growth Hormone Secretagogues': { color: '#2B7DE9', id: 'growth-hormone' },
  'Tissue Repair & Regeneration': { color: '#10B981', id: 'tissue-repair' },
  'Metabolic Research Compounds': { color: '#F59E0B', id: 'metabolic' },
  'Antioxidants & Cellular Health': { color: '#06B6D4', id: 'antioxidants' },
  'Senolytic & Longevity Research': { color: '#6366F1', id: 'longevity' },
  'Melanocortin System Research': { color: '#F97316', id: 'melanocortin' },
  'Cosmetic & Dermatological Research': { color: '#D946EF', id: 'cosmetic' },
  'Tissue Protection & Repair (Advanced)': { color: '#64748B', id: 'advanced' }
};

// Oral/small molecule products that should NOT show Research Applications
var oralProducts = ['5-Amino-1MQ'];

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
    var name = pLines[0].trim();
    var fullText = prod;

    // Hook
    var hookMatch = fullText.match(/\*\*SEO Title:\*\*[^\n]+\n\n\*\*([^*]+)\*\*/);
    var hook = hookMatch ? hookMatch[1].trim() : '';

    // Brief description - first real paragraph after hook
    var descStart = hook ? fullText.indexOf(hook + '**') : -1;
    var desc = '';
    if (descStart > -1) {
      var afterHook = fullText.substring(descStart + hook.length + 2).trim();
      var paras = afterHook.split(/\n\n/).filter(function(p) {
        return p.trim().length > 30 && !p.trim().startsWith('**');
      });
      if (paras.length > 0) {
        desc = paras[0].replace(/\n/g, ' ').replace(/\*\*/g, '').trim();
        // Truncate to ~200 chars for card
        if (desc.length > 220) desc = desc.substring(0, 220).replace(/\s+\S*$/, '') + '…';
      }
    }
    if (!desc && hook) desc = hook;

    // Check if oral/small molecule
    var isOral = false;
    oralProducts.forEach(function(o) { if (name.indexOf(o) > -1) isOral = true; });

    // Research Applications
    var apps = [];
    if (!isOral) {
      var raMatch = fullText.match(/\*\*Research Applications:\*\*\s*\n([^\n]+(?:\n[^\n*]+)*)/);
      if (raMatch) {
        apps = raMatch[1].trim().split(/,\s*/).map(function(a) { return a.trim(); }).filter(function(a) { return a.length > 0; });
      }
    }

    var product = {
      name: name,
      category: catName,
      catId: catInfo.id,
      catColor: catInfo.color,
      hook: hook,
      desc: desc,
      applications: apps
    };

    catProducts.push(product);
    allProducts.push(product);
  });

  if (catProducts.length > 0) {
    categories.push({ name: catName, id: catInfo.id, color: catInfo.color, products: catProducts });
  }
}

console.log('Parsed ' + allProducts.length + ' products in ' + categories.length + ' categories');
categories.forEach(function(c) { console.log('  ' + c.name + ': ' + c.products.length); });

function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

// Featured products (best sellers)
var featured = [
  'Semaglutide (GLP-1 Receptor Agonist)',
  'Tirzepatide (20mg)',
  'BPC-157/TB-500 Combination (10mg/10mg)',
  'NAD+ (500mg)',
  'CJC-1295/Ipamorelin Combination (5mg/5mg)',
  'Selank (10mg)',
  'MOTS-c (10mg)',
  'Epithalon (50mg)'
];

// Build featured cards
var featuredHtml = '';
allProducts.forEach(function(p) {
  if (featured.indexOf(p.name) === -1) return;
  featuredHtml += '<div class="featured-card" style="border-top:3px solid ' + p.catColor + '">' +
    '<span class="cat-tag" style="background:' + p.catColor + '15;color:' + p.catColor + '">' + esc(p.catId.replace(/-/g, ' ')) + '</span>' +
    '<h3 class="fc-name">' + esc(p.name) + '</h3>' +
    '<p class="fc-desc">' + esc(p.desc) + '</p>' +
    '<a href="#prod-' + allProducts.indexOf(p) + '" class="fc-btn">View Details</a>' +
    '</div>\n';
});

// Build category filter tabs
var filterTabs = '<button class="filter-tab active" data-cat="all">All (' + allProducts.length + ')</button>\n';
categories.forEach(function(c) {
  var shortName = c.name.split('&')[0].split('(')[0].trim();
  filterTabs += '<button class="filter-tab" data-cat="' + c.id + '" style="--tab-color:' + c.color + '">' + esc(shortName) + ' (' + c.products.length + ')</button>\n';
});

// Build product grid
var gridHtml = '';
allProducts.forEach(function(p, idx) {
  gridHtml += '<div class="grid-card" data-cat="' + p.catId + '" data-name="' + esc(p.name.toLowerCase()) + '" id="prod-' + idx + '">' +
    '<div class="gc-top" style="border-left:4px solid ' + p.catColor + '">' +
    '<span class="cat-tag" style="background:' + p.catColor + '15;color:' + p.catColor + '">' + esc(p.catId.replace(/-/g, ' ')) + '</span>' +
    '<h3 class="gc-name">' + esc(p.name) + '</h3>' +
    '</div>' +
    '<p class="gc-desc">' + esc(p.desc) + '</p>' +
    (p.applications.length > 0 ? '<div class="gc-apps">' + p.applications.slice(0, 4).map(function(a) { return '<span class="app-tag">' + esc(a) + '</span>'; }).join('') + '</div>' : '') +
    '<button class="view-btn" style="color:' + p.catColor + '">View Details &rarr;</button>' +
    '</div>\n';
});

var html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
'<meta charset="UTF-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'<title>Peptide Resource Center | Premium Research Peptides</title>\n' +
'<style>\n' +
'*{margin:0;padding:0;box-sizing:border-box}\n' +
'html{scroll-behavior:smooth}\n' +
'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#fff;color:#334155;line-height:1.6;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased}\n' +
'a{text-decoration:none;color:inherit}\n' +

/* Sticky Header */
'.site-header{position:sticky;top:0;z-index:1000;background:rgba(255,255,255,0.95);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid #e2e8f0;padding:0.75rem 0}\n' +
'.header-inner{max-width:1200px;margin:0 auto;padding:0 1.5rem;display:flex;align-items:center;justify-content:space-between}\n' +
'.logo{font-size:1.5rem;font-weight:900;color:#0A1628;letter-spacing:-1px}\n' +
'.logo span{color:#2B7DE9}\n' +
'.nav-links{display:flex;gap:1.5rem;font-size:0.85rem;font-weight:600;color:#64748B}\n' +
'.nav-links a:hover{color:#2B7DE9}\n' +
'@media(max-width:640px){.nav-links{display:none}}\n' +

/* Hero */
'.hero{background:linear-gradient(135deg,#0A1628 0%,#1a2744 50%,#0d2847 100%);color:#fff;padding:5rem 1.5rem 4rem;text-align:center;position:relative;overflow:hidden}\n' +
'.hero::before{content:"";position:absolute;top:-50%;right:-30%;width:80%;height:200%;background:radial-gradient(ellipse,rgba(43,125,233,0.15) 0%,transparent 70%);pointer-events:none}\n' +
'.hero::after{content:"";position:absolute;bottom:-50%;left:-30%;width:80%;height:200%;background:radial-gradient(ellipse,rgba(6,182,212,0.1) 0%,transparent 70%);pointer-events:none}\n' +
'.hero-inner{max-width:800px;margin:0 auto;position:relative;z-index:1}\n' +
'.hero-label{font-size:0.75rem;text-transform:uppercase;letter-spacing:4px;color:#06B6D4;font-weight:700;margin-bottom:1.5rem}\n' +
'.hero h1{font-size:3.25rem;font-weight:900;letter-spacing:-2px;line-height:1.1;margin-bottom:1rem}\n' +
'.hero h1 .accent{color:#2B7DE9}\n' +
'.hero-tagline{font-size:1.1rem;color:#8E99A4;max-width:550px;margin:0 auto 2.5rem;line-height:1.7}\n' +
'.hero-stats{display:flex;justify-content:center;gap:3rem;flex-wrap:wrap}\n' +
'.stat{text-align:center}\n' +
'.stat-num{font-size:2.5rem;font-weight:900;color:#fff;line-height:1}\n' +
'.stat-label{font-size:0.75rem;text-transform:uppercase;letter-spacing:2px;color:#8E99A4;margin-top:0.25rem}\n' +
'@media(max-width:640px){.hero{padding:3.5rem 1.25rem 3rem}.hero h1{font-size:2rem;letter-spacing:-1px}.hero-stats{gap:1.5rem}.stat-num{font-size:1.75rem}}\n' +

/* Trust badges */
'.trust{background:#f8fafc;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;padding:2rem 1.5rem}\n' +
'.trust-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;text-align:center}\n' +
'.trust-item{padding:1rem}\n' +
'.trust-icon{font-size:1.75rem;margin-bottom:0.5rem}\n' +
'.trust-title{font-size:0.8rem;font-weight:800;color:#0A1628;text-transform:uppercase;letter-spacing:1px}\n' +
'.trust-sub{font-size:0.75rem;color:#8E99A4;margin-top:0.25rem}\n' +
'@media(max-width:640px){.trust-inner{grid-template-columns:repeat(2,1fr);gap:0.75rem}.trust-item{padding:0.75rem}}\n' +

/* Section common */
'.section{max-width:1200px;margin:0 auto;padding:4rem 1.5rem}\n' +
'.section-label{font-size:0.7rem;text-transform:uppercase;letter-spacing:3px;color:#2B7DE9;font-weight:700;margin-bottom:0.5rem}\n' +
'.section-title{font-size:2rem;font-weight:900;color:#0A1628;letter-spacing:-1px;margin-bottom:0.5rem}\n' +
'.section-sub{font-size:0.95rem;color:#8E99A4;max-width:600px;margin-bottom:2.5rem}\n' +

/* Featured products */
'.featured-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem}\n' +
'.featured-card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;transition:all 0.25s ease}\n' +
'.featured-card:hover{box-shadow:0 8px 30px rgba(0,0,0,0.08);transform:translateY(-2px)}\n' +
'.cat-tag{display:inline-block;font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:0.2rem 0.6rem;border-radius:20px;margin-bottom:0.75rem}\n' +
'.fc-name{font-size:1.1rem;font-weight:800;color:#0A1628;margin-bottom:0.5rem;line-height:1.3}\n' +
'.fc-desc{font-size:0.82rem;color:#64748B;line-height:1.6;margin-bottom:1rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}\n' +
'.fc-btn{display:inline-block;font-size:0.8rem;font-weight:700;color:#2B7DE9;padding:0.5rem 1rem;border:1.5px solid #2B7DE9;border-radius:8px;transition:all 0.2s}\n' +
'.fc-btn:hover{background:#2B7DE9;color:#fff}\n' +

/* Catalog section */
'.catalog-header{display:flex;flex-wrap:wrap;align-items:center;gap:1rem;margin-bottom:1.5rem}\n' +
'.search-box{flex:1;min-width:220px;padding:0.7rem 1rem;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;font-family:inherit;background:#fff;transition:border-color 0.2s}\n' +
'.search-box:focus{outline:none;border-color:#2B7DE9;box-shadow:0 0 0 3px rgba(43,125,233,0.1)}\n' +
'.filter-wrap{display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:2rem;overflow-x:auto;padding-bottom:0.5rem}\n' +
'.filter-tab{padding:0.4rem 0.9rem;border:1.5px solid #e2e8f0;border-radius:20px;font-size:0.72rem;font-weight:700;font-family:inherit;background:#fff;color:#64748B;cursor:pointer;white-space:nowrap;transition:all 0.2s}\n' +
'.filter-tab:hover,.filter-tab.active{background:#0A1628;color:#fff;border-color:#0A1628}\n' +
'.no-results{display:none;text-align:center;padding:3rem 1rem;color:#8E99A4;font-size:0.95rem}\n' +

/* Product grid */
'.product-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.25rem}\n' +
'.grid-card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;transition:all 0.25s ease;display:flex;flex-direction:column}\n' +
'.grid-card:hover{box-shadow:0 8px 30px rgba(0,0,0,0.08);transform:translateY(-2px)}\n' +
'.grid-card.hidden{display:none}\n' +
'.gc-top{padding-left:0.75rem;margin-bottom:0.75rem}\n' +
'.gc-name{font-size:1rem;font-weight:800;color:#0A1628;line-height:1.3;margin-top:0.4rem}\n' +
'.gc-desc{font-size:0.8rem;color:#64748B;line-height:1.6;margin-bottom:1rem;flex:1;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}\n' +
'.gc-apps{display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:1rem}\n' +
'.app-tag{font-size:0.65rem;padding:0.15rem 0.5rem;border-radius:12px;background:#f1f5f9;color:#475569;font-weight:500}\n' +
'.view-btn{background:none;border:none;font-family:inherit;font-size:0.8rem;font-weight:700;cursor:pointer;padding:0;text-align:left;transition:opacity 0.2s}\n' +
'.view-btn:hover{opacity:0.7}\n' +
'@media(max-width:700px){.product-grid{grid-template-columns:1fr}.featured-grid{grid-template-columns:1fr}}\n' +
'@media(min-width:700px) and (max-width:1024px){.product-grid{grid-template-columns:repeat(2,1fr)}}\n' +

/* Back to top */
'.btt{position:fixed;bottom:1.5rem;right:1.5rem;width:44px;height:44px;background:#0A1628;color:#fff;border:none;border-radius:50%;font-size:1.2rem;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:999;display:none;align-items:center;justify-content:center;transition:all 0.2s}\n' +
'.btt:hover{background:#2B7DE9;transform:scale(1.1)}\n' +
'.btt.show{display:flex}\n' +

/* Footer */
'footer{background:#0A1628;color:#8E99A4;padding:3rem 1.5rem 2rem}\n' +
'.footer-inner{max-width:1200px;margin:0 auto;text-align:center}\n' +
'.footer-brand{font-size:1.75rem;font-weight:900;color:#fff;margin-bottom:0.25rem}\n' +
'.footer-brand span{color:#2B7DE9}\n' +
'.footer-tag{font-size:0.7rem;text-transform:uppercase;letter-spacing:3px;color:#475569;margin-bottom:2rem}\n' +
'.disclaimer-box{max-width:700px;margin:0 auto 2rem;padding:1.25rem 1.5rem;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:10px;text-align:left}\n' +
'.disclaimer-box h4{font-size:0.7rem;text-transform:uppercase;letter-spacing:2px;color:#F59E0B;margin-bottom:0.5rem}\n' +
'.disclaimer-box p{font-size:0.8rem;line-height:1.7;color:#94A3B8}\n' +
'.footer-bottom{font-size:0.7rem;color:#475569}\n' +
'</style>\n' +
'</head>\n<body>\n\n' +

/* Header */
'<header class="site-header">\n' +
'<div class="header-inner">\n' +
'<div class="logo"><span>PRC</span> Peptide Resource Center</div>\n' +
'<nav class="nav-links">\n' +
'<a href="#featured">Featured</a>\n' +
'<a href="#catalog">Catalog</a>\n' +
'<a href="#about">About</a>\n' +
'</nav>\n' +
'</div>\n' +
'</header>\n\n' +

/* Hero */
'<section class="hero">\n' +
'<div class="hero-inner">\n' +
'<div class="hero-label">Peptide Resource Center</div>\n' +
'<h1>Premium Research<br><span class="accent">Peptides &amp; Compounds</span></h1>\n' +
'<p class="hero-tagline">Precision Is Not Optional. Explore our comprehensive catalog of research-grade peptides, metabolic compounds, and cellular health products — all for laboratory use only.</p>\n' +
'<div class="hero-stats">\n' +
'<div class="stat"><div class="stat-num" id="statProducts">44+</div><div class="stat-label">Products</div></div>\n' +
'<div class="stat"><div class="stat-num" id="statCats">10</div><div class="stat-label">Categories</div></div>\n' +
'<div class="stat"><div class="stat-num" id="statGrade">&ge;98%</div><div class="stat-label">Purity Standard</div></div>\n' +
'</div>\n' +
'</div>\n' +
'</section>\n\n' +

/* Trust */
'<section class="trust">\n' +
'<div class="trust-inner">\n' +
'<div class="trust-item"><div class="trust-icon">&#9878;</div><div class="trust-title">Research Grade</div><div class="trust-sub">&ge;98% purity verified</div></div>\n' +
'<div class="trust-item"><div class="trust-icon">&#9889;</div><div class="trust-title">Fast Shipping</div><div class="trust-sub">Priority processing</div></div>\n' +
'<div class="trust-item"><div class="trust-icon">&#128274;</div><div class="trust-title">Secure Payments</div><div class="trust-sub">Encrypted transactions</div></div>\n' +
'<div class="trust-item"><div class="trust-icon">&#128172;</div><div class="trust-title">Expert Support</div><div class="trust-sub">Knowledgeable team</div></div>\n' +
'</div>\n' +
'</section>\n\n' +

/* Featured */
'<section class="section" id="featured">\n' +
'<div class="section-label">Popular Picks</div>\n' +
'<h2 class="section-title">Featured Products</h2>\n' +
'<p class="section-sub">Our most requested research compounds, selected by researchers worldwide.</p>\n' +
'<div class="featured-grid">\n' + featuredHtml + '</div>\n' +
'</section>\n\n' +

/* Catalog */
'<section class="section" id="catalog">\n' +
'<div class="section-label">Full Catalog</div>\n' +
'<h2 class="section-title">All Research Compounds</h2>\n' +
'<p class="section-sub">Browse all ' + allProducts.length + ' products across ' + categories.length + ' research categories.</p>\n' +
'<div class="catalog-header">\n' +
'<input type="text" class="search-box" id="searchInput" placeholder="Search products by name&hellip;">\n' +
'</div>\n' +
'<div class="filter-wrap" id="filterWrap">\n' + filterTabs + '</div>\n' +
'<div id="noResults" class="no-results">No products match your search.</div>\n' +
'<div class="product-grid" id="productGrid">\n' + gridHtml + '</div>\n' +
'</section>\n\n' +

/* Footer */
'<footer id="about">\n' +
'<div class="footer-inner">\n' +
'<div class="footer-brand"><span>PRC</span></div>\n' +
'<div class="footer-tag">Peptide Resource Center &mdash; Precision Is Not Optional</div>\n' +
'<div class="disclaimer-box">\n' +
'<h4>For Research Use Only</h4>\n' +
'<p>All products listed are intended for research and laboratory use only. Not for human consumption. The information provided is for educational and reference purposes. Products have not been evaluated by regulatory agencies for safety or efficacy in humans.</p>\n' +
'</div>\n' +
'<div class="footer-bottom">&copy; 2026 Peptide Resource Center &middot; peptideresourcecenter.com</div>\n' +
'</div>\n' +
'</footer>\n\n' +

/* Back to top */
'<button class="btt" id="btt" aria-label="Back to top">&uarr;</button>\n\n' +

/* JS - ES5 only, progressive enhancement */
'<script>\n' +
'(function(){\n' +
'"use strict";\n' +

// Search + filter
'var si=document.getElementById("searchInput");\n' +
'var grid=document.getElementById("productGrid");\n' +
'var cards=grid?grid.querySelectorAll(".grid-card"):[];\n' +
'var tabs=document.querySelectorAll(".filter-tab");\n' +
'var noRes=document.getElementById("noResults");\n' +
'var activeCat="all";\n' +
'\n' +
'function filterCards(){\n' +
'  var q=si?si.value.toLowerCase():"";\n' +
'  var visible=0;\n' +
'  for(var i=0;i<cards.length;i++){\n' +
'    var c=cards[i];\n' +
'    var matchCat=activeCat==="all"||c.getAttribute("data-cat")===activeCat;\n' +
'    var matchSearch=!q||c.getAttribute("data-name").indexOf(q)>-1;\n' +
'    if(matchCat&&matchSearch){c.classList.remove("hidden");visible++;}else{c.classList.add("hidden");}\n' +
'  }\n' +
'  if(noRes)noRes.style.display=visible===0?"block":"none";\n' +
'}\n' +
'\n' +
'if(si)si.addEventListener("input",filterCards);\n' +
'for(var t=0;t<tabs.length;t++){\n' +
'  tabs[t].addEventListener("click",function(){\n' +
'    for(var j=0;j<tabs.length;j++)tabs[j].classList.remove("active");\n' +
'    this.classList.add("active");\n' +
'    activeCat=this.getAttribute("data-cat");\n' +
'    filterCards();\n' +
'  });\n' +
'}\n' +

// Back to top
'var btt=document.getElementById("btt");\n' +
'if(btt){\n' +
'  window.addEventListener("scroll",function(){\n' +
'    if(window.pageYOffset>600)btt.classList.add("show");else btt.classList.remove("show");\n' +
'  });\n' +
'  btt.addEventListener("click",function(){window.scrollTo(0,0);});\n' +
'}\n' +

// Animated stats
'function animateNum(el,end,suffix){\n' +
'  var start=0;var dur=1500;var st=null;\n' +
'  function step(ts){\n' +
'    if(!st)st=ts;var p=Math.min((ts-st)/dur,1);\n' +
'    var v=Math.floor(p*end);\n' +
'    el.textContent=v+(suffix||"");\n' +
'    if(p<1)requestAnimationFrame(step);\n' +
'  }\n' +
'  requestAnimationFrame(step);\n' +
'}\n' +
'var sp=document.getElementById("statProducts");\n' +
'var sc=document.getElementById("statCats");\n' +
'if(sp)animateNum(sp,44,"+");\n' +
'if(sc)animateNum(sc,10,"");\n' +

'})();\n' +
'<\/script>\n' +
'</body>\n</html>';

fs.writeFileSync('prc_site_mockup_v2.html', html);
var size = (Buffer.byteLength(html) / 1024).toFixed(1);
console.log('Built: prc_site_mockup_v2.html (' + size + 'KB)');
console.log('Total products in output: ' + allProducts.length);
