const fs = require('fs');

// Complete product database - ALL 44 PRODUCTS
const allProducts = [
  { name: "Semaglutide", file: "semaglutide.html", cat: "GLP Agonists", col: "#2563EB", price: 30, qty: "5mg", cas: "910463-68-2", mw: "4113.6 g/mol", formula: "C₁₈₇H₂₉₁N₄₅O₅₉" },
  { name: "Tirzepatide 20mg", file: "tirzepatide-20mg.html", cat: "GLP Agonists", col: "#2563EB", price: 44, qty: "20mg", cas: "2023788-19-2", mw: "4813.5 g/mol", formula: "C₂₂₅H₃₄₈N₄₈O₆₈" },
  { name: "Tirzepatide 30mg", file: "tirzepatide-30mg.html", cat: "GLP Agonists", col: "#2563EB", price: 46, qty: "30mg", cas: "2023788-19-2", mw: "4813.5 g/mol", formula: "C₂₂₅H₃₄₈N₄₈O₆₈" },
  { name: "Retatrutide 20mg", file: "retatrutide-20mg.html", cat: "GLP Agonists", col: "#2563EB", price: 55, qty: "20mg", cas: "2381089-83-2", mw: "4731.0 g/mol", formula: "C₂₂₁H₃₄₂N₄₆O₆₈" },
  { name: "Cagrilintide 5mg", file: "cagrilintide-5mg.html", cat: "GLP Agonists", col: "#2563EB", price: 25, qty: "5mg", cas: "2374769-38-1", mw: "4409.5 g/mol", formula: "C₁₉₄H₃₁₂N₅₄O₅₉S₂" },
  { name: "BPC-157/TB-500", file: "bpc-157-tb-500.html", cat: "Tissue Repair", col: "#059669", price: 40, qty: "10mg/10mg", cas: "137525-51-0", mw: "1419.5 g/mol", formula: "C₆₂H₉₈N₁₆O₂₂" },
  { name: "KPV 10mg", file: "kpv-10mg.html", cat: "Tissue Repair", col: "#059669", price: 36, qty: "10mg", cas: "61090-95-7", mw: "342.4 g/mol", formula: "C₁₆H₃₀N₄O₄" },
  { name: "GHK-Cu 100mg", file: "ghk-cu-100mg.html", cat: "Tissue Repair", col: "#059669", price: 31, qty: "100mg", cas: "49557-75-7", mw: "404.0 g/mol", formula: "C₁₄H₂₄N₆O₄·Cu" },
  { name: "LL-37 5mg", file: "ll-37-5mg.html", cat: "Tissue Repair", col: "#059669", price: 29, qty: "5mg", cas: "154947-66-7", mw: "4493.3 g/mol", formula: "C₂₀₅H₃₄₀N₆₀O₅₃" },
  { name: "Thymalin 10mg", file: "thymalin-10mg.html", cat: "Tissue Repair", col: "#059669", price: 37, qty: "10mg", cas: "N/A", mw: "Complex mixture", formula: "Short peptides" },
  { name: "Laennec Ampules", file: "laennec.html", cat: "Tissue Repair", col: "#059669", price: 425, qty: "10 ampules", cas: "N/A", mw: "Complex", formula: "Biological extract" },
  { name: "Sermorelin 5mg", file: "sermorelin-5mg.html", cat: "Growth Hormone", col: "#EA580C", price: 38, qty: "5mg", cas: "86168-78-7", mw: "3357.9 g/mol", formula: "C₁₄₉H₂₄₆N₄₄O₄₂S" },
  { name: "Ipamorelin 5mg", file: "ipamorelin-5mg.html", cat: "Growth Hormone", col: "#EA580C", price: 21, qty: "5mg", cas: "170851-70-4", mw: "711.9 g/mol", formula: "C₃₈H₄₉N₉O₅" },
  { name: "CJC-1295 (no DAC)", file: "cjc-1295-no-dac.html", cat: "Growth Hormone", col: "#EA580C", price: 42, qty: "5mg", cas: "863288-34-0", mw: "3647.2 g/mol", formula: "C₁₆₅H₂₆₉N₄₇O₄₆" },
  { name: "CJC-1295/Ipamorelin", file: "cjc-1295-ipamorelin.html", cat: "Growth Hormone", col: "#EA580C", price: 42, qty: "5mg/5mg", cas: "863288-34-0", mw: "3647.2 g/mol", formula: "Dual blend" },
  { name: "HGH 191", file: "hgh-191.html", cat: "Growth Hormone", col: "#EA580C", price: 28, qty: "1500iu", cas: "12629-01-5", mw: "22,124 g/mol", formula: "C₉₉₀H₁₅₂₈N₂₆₂O₃₀₀S₇" },
  { name: "AOD-9604 2mg", file: "aod-9604-2mg.html", cat: "Metabolic", col: "#DC2626", price: 20, qty: "2mg", cas: "221231-10-3", mw: "1815.1 g/mol", formula: "C₇₈H₁₂₃N₂₃O₂₃S₂" },
  { name: "MOTS-c 10mg", file: "mots-c-10mg.html", cat: "Metabolic", col: "#DC2626", price: 28, qty: "10mg", cas: "1627580-64-6", mw: "2174.6 g/mol", formula: "C₁₀₁H₁₅₂N₂₈O₂₂S₂" },
  { name: "5-Amino-1MQ 5mg", file: "5-amino-1mq-5mg.html", cat: "Metabolic", col: "#DC2626", price: 25, qty: "5mg", cas: "42464-96-0", mw: "159.2 g/mol", formula: "C₁₀H₁₁N₂⁺" },
  { name: "Lipo-C MAX Blend", file: "lipo-c-max.html", cat: "Metabolic", col: "#DC2626", price: 42, qty: "10ml", cas: "N/A", mw: "Blend", formula: "Multi-component" },
  { name: "L-Carnitine 600mg", file: "l-carnitine-600mg.html", cat: "Metabolic", col: "#DC2626", price: 26, qty: "600mg", cas: "541-15-1", mw: "161.2 g/mol", formula: "C₇H₁₅NO₃" },
  { name: "Lipo-C Plus Blend", file: "lipo-c-plus.html", cat: "Metabolic", col: "#DC2626", price: 42, qty: "10ml", cas: "N/A", mw: "Blend", formula: "Multi-component" },
  { name: "Lipo-C Ultra Blend", file: "lipo-c-ultra.html", cat: "Metabolic", col: "#DC2626", price: 42, qty: "10ml", cas: "N/A", mw: "Blend", formula: "Multi-component" },
  { name: "NAD+ 1000mg", file: "nad-1000mg.html", cat: "Antioxidants", col: "#7C3AED", price: 30, qty: "1000mg", cas: "53-84-9", mw: "663.4 g/mol", formula: "C₂₁H₂₇N₇O₁₄P₂" },
  { name: "NAD+ 500mg", file: "nad-500mg.html", cat: "Antioxidants", col: "#7C3AED", price: 30, qty: "500mg", cas: "53-84-9", mw: "663.4 g/mol", formula: "C₂₁H₂₇N₇O₁₄P₂" },
  { name: "Glutathione 1200mg", file: "glutathione-1200mg.html", cat: "Antioxidants", col: "#7C3AED", price: 85, qty: "1200mg", cas: "70-18-8", mw: "307.3 g/mol", formula: "C₁₀H₁₇N₃O₆S" },
  { name: "Glutathione 1500mg", file: "glutathione-1500mg.html", cat: "Antioxidants", col: "#7C3AED", price: 38, qty: "1500mg", cas: "70-18-8", mw: "307.3 g/mol", formula: "C₁₀H₁₇N₃O₆S" },
  { name: "SS-31 (Elamipretide)", file: "ss-31-10mg.html", cat: "Antioxidants", col: "#7C3AED", price: 55, qty: "10mg", cas: "736992-21-5", mw: "639.8 g/mol", formula: "C₃₂H₄₉N₉O₅" },
  { name: "Thioctic Acid (ALA)", file: "thioctic-acid.html", cat: "Antioxidants", col: "#7C3AED", price: 75, qty: "25mg/5ml", cas: "1077-28-7", mw: "206.3 g/mol", formula: "C₈H₁₄O₂S₂" },
  { name: "Vitamin C IV", file: "vitamin-c-iv.html", cat: "Antioxidants", col: "#7C3AED", price: 75, qty: "10mg/20ml", cas: "50-81-7", mw: "176.1 g/mol", formula: "C₆H₈O₆" },
  { name: "Cerebrolysin 60mg", file: "cerebrolysin-60mg.html", cat: "Neuropeptides", col: "#0891B2", price: 23, qty: "60mg", cas: "N/A", mw: "Complex", formula: "Peptide mixture" },
  { name: "Selank 5mg", file: "selank-5mg.html", cat: "Neuropeptides", col: "#0891B2", price: 36, qty: "5mg", cas: "129954-34-3", mw: "751.9 g/mol", formula: "C₃₃H₅₇N₁₁O₉" },
  { name: "Selank 10mg", file: "selank-10mg.html", cat: "Neuropeptides", col: "#0891B2", price: 36, qty: "10mg", cas: "129954-34-3", mw: "751.9 g/mol", formula: "C₃₃H₅₇N₁₁O₉" },
  { name: "Semax 5mg", file: "semax-5mg.html", cat: "Neuropeptides", col: "#0891B2", price: 31, qty: "5mg", cas: "80714-61-0", mw: "813.9 g/mol", formula: "C₃₇H₅₁N₉O₁₀S" },
  { name: "DSIP 5mg", file: "dsip-5mg.html", cat: "Neuropeptides", col: "#0891B2", price: 31, qty: "5mg", cas: "62568-57-4", mw: "848.8 g/mol", formula: "C₃₅H₄₈N₁₀O₁₅" },
  { name: "DSIP Night Blend", file: "dsip-night-blend.html", cat: "Neuropeptides", col: "#0891B2", price: 42, qty: "5mg", cas: "Proprietary", mw: "Blend", formula: "Multi-component" },
  { name: "FOXO4-DRI 10mg", file: "foxo4-dri-10mg.html", cat: "Longevity", col: "#B45309", price: 67, qty: "10mg", cas: "1639871-79-4", mw: "~5,040 g/mol", formula: "D-retro-inverso" },
  { name: "Epithalon 50mg", file: "epithalon-50mg.html", cat: "Longevity", col: "#B45309", price: 66, qty: "50mg", cas: "307297-39-8", mw: "390.3 g/mol", formula: "C₁₄H₂₂N₄O₉" },
  { name: "PE 22-28 10mg", file: "pe-22-28-10mg.html", cat: "Longevity", col: "#B45309", price: 30, qty: "10mg", cas: "N/A", mw: "Heptapeptide", formula: "7 amino acids" },
  { name: "PT-141", file: "pt-141.html", cat: "Melanocortin", col: "#DB2777", price: 36, qty: "10mg", cas: "189691-06-3", mw: "1025.2 g/mol", formula: "C₅₀H₆₈N₁₄O₁₀" },
  { name: "Dermorphin 5mg", file: "dermorphin-5mg.html", cat: "Melanocortin", col: "#DB2777", price: 22, qty: "5mg", cas: "77614-16-5", mw: "802.9 g/mol", formula: "C₄₀H₅₀N₈O₁₀" },
  { name: "Botulinum Toxin 100u", file: "botulinum-100u.html", cat: "Cosmetic", col: "#A21CAF", price: 135, qty: "100 units", cas: "93384-43-1", mw: "~150 kDa", formula: "Protein complex" },
  { name: "Botulinum Toxin 200u", file: "botulinum-200u.html", cat: "Cosmetic", col: "#A21CAF", price: 170, qty: "200 units", cas: "93384-43-1", mw: "~150 kDa", formula: "Protein complex" },
  { name: "ARA-290 10mg", file: "ara-290-10mg.html", cat: "Advanced", col: "#475569", price: 24, qty: "10mg", cas: "1448671-31-5", mw: "1257.3 g/mol", formula: "C₅₁H₈₄N₁₆O₂₁" }
];

const template = (p) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${p.name} | ${p.cat} | PRC Peptides</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#FFF;color:#1E293B;line-height:1.6}header{background:#FFF;border-bottom:1px solid #E2E8F0;padding:10px 16px;position:sticky;top:0;z-index:100}.header-content{max-width:900px;margin:0 auto;display:flex;justify-content:space-between;align-items:center}.logo{font-size:1.1rem;font-weight:800;color:#0A1628;letter-spacing:2px;text-decoration:none}.logo span{color:#2B7DE9}.breadcrumb{max-width:900px;margin:0 auto;padding:12px 16px 6px;font-size:0.75rem;color:#64748B}.breadcrumb a{color:#2B7DE9;text-decoration:none}main{max-width:900px;margin:0 auto;padding:0 16px 3rem}.category-label{font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:${p.col};margin:16px 0 8px;display:inline-block}h1{font-size:2rem;font-weight:800;color:#0A1628;margin-bottom:1rem}.product-meta{display:flex;align-items:center;gap:16px;margin-bottom:1.5rem;flex-wrap:wrap}.product-price{font-size:2rem;font-weight:800;color:#0A1628}.coa-badge{font-size:0.7rem;font-weight:700;color:#059669}.specs-table{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;overflow:hidden;margin-bottom:1.5rem}.specs-table table{width:100%;border-collapse:collapse}.specs-table tr{border-bottom:1px solid #E2E8F0}.specs-table tr:last-child{border-bottom:none}.specs-table td{padding:10px 14px;font-size:0.85rem}.specs-table td:first-child{font-weight:600;color:#475569;width:35%}.specs-table td:last-child{color:#0A1628;font-weight:500}.trust-bar{display:flex;gap:16px;padding:12px 16px;background:#F8FAFC;border-radius:6px;margin-bottom:1.5rem;flex-wrap:wrap}.trust-item{font-size:0.7rem;font-weight:600;color:#475569}.trust-item::before{content:'✓';color:#059669;font-weight:700;margin-right:4px}.btn-primary{background:#2B7DE9;color:#FFF;padding:14px 32px;border-radius:8px;border:none;font-size:1rem;font-weight:700;cursor:pointer;transition:background 0.2s}.btn-primary:hover{background:#1E40AF}h2{font-size:1.3rem;font-weight:700;color:#0A1628;margin:2rem 0 1rem}p{font-size:0.95rem;color:#475569;line-height:1.8;margin-bottom:1rem}.disclaimer{background:#F8FAFC;border-left:3px solid #94A3B8;padding:12px 16px;margin:2rem 0;font-size:0.8rem;color:#475569;border-radius:0 4px 4px 0}footer{background:#0A1628;padding:2rem 1.5rem;margin-top:3rem;text-align:center;color:rgba(255,255,255,0.6);font-size:0.8rem}.footer-logo{font-size:1.1rem;font-weight:800;color:#FFF;margin-bottom:1rem}@media(max-width:768px){h1{font-size:1.75rem}}</style></head>
<body><header><div class="header-content"><a href="../shop.html" class="logo"><span>PRC</span> PEPTIDES</a></div></header>
<div class="breadcrumb"><a href="../shop.html">← Back to Shop</a> › <a href="../shop.html">${p.cat}</a> › ${p.name}</div>
<main><div class="category-label">${p.cat}</div><h1>${p.name}</h1>
<div class="product-meta"><div class="product-price">$${p.price}</div><div class="coa-badge">✓ COA Available</div></div>
<div class="specs-table"><table>
<tr><td>Form</td><td>Lyophilized Powder</td></tr>
<tr><td>Quantity</td><td>${p.qty}</td></tr>
<tr><td>Purity</td><td>≥98%</td></tr>
<tr><td>CAS Number</td><td>${p.cas}</td></tr>
<tr><td>Molecular Weight</td><td>${p.mw}</td></tr>
<tr><td>Molecular Formula</td><td>${p.formula}</td></tr>
</table></div>
<div class="trust-bar"><div class="trust-item">Third-Party Tested</div><div class="trust-item">Ships Next Day</div><div class="trust-item">Free Over $150</div></div>
<button class="btn-primary" onclick="alert('Added to cart!')">Add to Cart — $${p.price}</button>
<h2>Description</h2><p>Research-grade ${p.name} for in vitro laboratory research. Third-party tested to ≥98% purity. Certificate of Analysis available upon request.</p>
<h2>Storage & Handling</h2><p>Store lyophilized at -20°C. Upon reconstitution, store at 2-8°C and use within 30 days. Avoid repeated freeze-thaw cycles.</p>
<div class="disclaimer"><strong>FOR RESEARCH PURPOSES ONLY.</strong> This product is intended exclusively for in vitro laboratory research.</div>
</main>
<footer><div class="footer-logo"><span style="color:#2B7DE9">PRC</span> PEPTIDES</div><p>© 2026 PRC Labs LLC</p></footer>
</body></html>`;

// Generate all files
allProducts.forEach(p => {
  fs.writeFileSync(`products/${p.file}`, template(p));
  console.log(`✓ ${p.file}`);
});

console.log(`\n✅ Generated ${allProducts.length} product pages!`);
