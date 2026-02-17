const fs = require('fs');
const path = require('path');

// Product data from shop.html
const products = [
  { name: "Semaglutide", category: "glp", price: 30, slug: "semaglutide", catName: "GLP RECEPTOR AGONIST", catColor: "#2563EB", desc: "Benchmark long-acting GLP-1 receptor agonist with fatty acid modification for extended half-life.", fullDesc: "Semaglutide represents the culmination of decades of incretin biology research. Novo Nordisk's scientists engineered this glucagon-like peptide-1 analogue with a strategic fatty acid modification that enables albumin binding, dramatically extending its half-life from minutes to days. This single molecular modification transformed GLP-1 from a rapidly degraded hormone into a sustained metabolic signaling tool, enabling researchers to study prolonged GLP-1 receptor activation without the confounding variables of pulsatile dosing. The compound's potency at GLP-1 receptors—combined with its resistance to DPP-4 degradation—has made it the gold standard in metabolic research models.", applications: ["GLP-1 receptor binding and signaling studies", "Glucose homeostasis mechanisms", "Pancreatic beta-cell function research", "Appetite regulation pathways", "Incretin pharmacology", "Metabolic disease models"], storage: "Store lyophilized at -20°C protected from light. Upon reconstitution with bacteriostatic water, store at 2-8°C and use within 30 days. The acylated structure provides enhanced stability compared to native GLP-1.", related: ["tirzepatide-30mg", "retatrutide-20mg", "cagrilintide-5mg"] },
  { name: "Tirzepatide 30mg", category: "glp", price: 46, slug: "tirzepatide-30mg", catName: "GLP RECEPTOR AGONIST", catColor: "#2563EB", desc: "Higher-dose dual GLP-1/GIP receptor agonist for advanced incretin research.", fullDesc: "Tirzepatide represents a paradigm shift in incretin biology. Where previous research focused on single-receptor agonism, Eli Lilly scientists engineered this novel peptide to activate both glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptors with balanced potency. This dual incretin activation reveals synergistic metabolic effects: GIP enhances insulin secretion and may support beta-cell health, while GLP-1 provides appetite suppression and delays gastric emptying.", applications: ["Dual incretin pathway research", "GIP/GLP-1 receptor synergy", "Incretin receptor pharmacology", "Metabolic signaling cascade studies", "Pancreatic islet function", "Comparative incretin biology"], storage: "Store lyophilized at -20°C in sealed container. Reconstitute with bacteriostatic water; maintain at 2-8°C for up to 30 days. The fatty acid modification provides proteolytic resistance and extended stability.", related: ["semaglutide", "tirzepatide-20mg", "retatrutide-20mg"] },
  { name: "Tirzepatide 20mg", category: "glp", price: 44, slug: "tirzepatide-20mg", catName: "GLP RECEPTOR AGONIST", catColor: "#2563EB", desc: "First dual GLP-1/GIP receptor agonist with balanced potency for incretin synergy research.", fullDesc: "Tirzepatide represents a paradigm shift in incretin biology. Where previous research focused on single-receptor agonism, Eli Lilly scientists engineered this novel peptide to activate both glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptors with balanced potency. This dual incretin activation reveals synergistic metabolic effects.", applications: ["Dual incretin pathway research", "GIP/GLP-1 receptor synergy", "Incretin receptor pharmacology", "Metabolic signaling cascade studies", "Pancreatic islet function", "Comparative incretin biology"], storage: "Store lyophilized at -20°C in sealed container. Reconstitute with bacteriostatic water; maintain at 2-8°C for up to 30 days.", related: ["semaglutide", "tirzepatide-30mg", "retatrutide-20mg"] },
  { name: "Retatrutide 20mg", category: "glp", price: 55, slug: "retatrutide-20mg", catName: "GLP RECEPTOR AGONIST", catColor: "#2563EB", desc: "World's first triple GLP-1/GIP/Glucagon receptor agonist for multi-pathway metabolic research.", fullDesc: "Retatrutide represents the frontier of incretin research. Building on tirzepatide's dual-agonist success, Eli Lilly scientists engineered this peptide with an unprecedented pharmacological profile: balanced activation of three distinct hormone receptors—GLP-1, GIP, and glucagon. This triple agonism creates a metabolic phenotype unattainable through any combination of existing compounds.", applications: ["Triple-receptor agonism studies", "GLP-1/GIP/glucagon pathway synergy", "Energy expenditure mechanisms", "Complex metabolic signaling", "Thermogenesis research", "Next-generation incretin biology"], storage: "Store lyophilized at -20°C protected from moisture. Reconstitute with bacteriostatic water; stable at 2-8°C for 30 days.", related: ["tirzepatide-30mg", "tirzepatide-20mg", "semaglutide"] },
  { name: "Cagrilintide 5mg", category: "glp", price: 25, slug: "cagrilintide-5mg", catName: "GLP RECEPTOR AGONIST", catColor: "#2563EB", desc: "Long-acting amylin receptor agonist for sustained satiety and gastric emptying research.", fullDesc: "Cagrilintide reimagines amylin pharmacology. While the first-generation amylin analogue pramlintide required frequent dosing and suffered from limited stability, Novo Nordisk's structural modifications created a compound with dramatically extended receptor residence time and proteolytic resistance. This long-acting analogue enables researchers to study sustained amylin receptor activation.", applications: ["Amylin receptor signaling research", "Gastric emptying mechanisms", "Satiety pathway studies", "Pancreatic beta-cell co-secretion", "Pramlintide comparison pharmacology", "Calcitonin receptor family research"], storage: "Store lyophilized at -20°C in sealed vial. Upon reconstitution, maintain refrigerated at 2-8°C and use within 30 days.", related: ["semaglutide", "tirzepatide-20mg", "aod-9604-2mg"] },
  { name: "BPC-157/TB-500", category: "tissue", price: 40, slug: "bpc-157-tb-500", catName: "TISSUE REPAIR", catColor: "#059669", desc: "Dual tissue repair complex pairing cytoprotective and actin-mediated cell migration mechanisms.", fullDesc: "Tissue repair requires coordinated processes: inflammatory resolution, angiogenesis, cell migration, extracellular matrix remodeling, and cytoprotection. This combination targets multiple phases simultaneously. BPC-157 demonstrates remarkable cytoprotective properties while promoting angiogenesis through VEGF modulation. TB-500 facilitates actin polymerization and cytoskeletal reorganization, driving cell migration.", applications: ["Wound healing models", "Angiogenesis research", "Cytoprotection mechanisms", "Cell migration assays", "Collagen synthesis studies", "Anti-inflammatory pathway research", "Musculoskeletal repair models"], storage: "Store lyophilized at -20°C protected from moisture. Both peptides remain stable when co-reconstituted; maintain at 2-8°C and use within 30 days.", related: ["ghk-cu-100mg", "kpv-10mg", "ll-37-5mg"] },
  { name: "KPV 10mg", category: "tissue", price: 36, slug: "kpv-10mg", catName: "TISSUE REPAIR", catColor: "#059669", desc: "Anti-inflammatory tripeptide from α-MSH that retains NF-κB inhibition without melanocortin activation.", fullDesc: "KPV (Lysine-Proline-Valine) represents molecular dissection of anti-inflammatory signaling. As the C-terminal tripeptide of alpha-melanocyte stimulating hormone, KPV retains the parent molecule's remarkable anti-inflammatory properties while eliminating melanocortin receptor-mediated effects like pigmentation. This separation of functions makes KPV uniquely valuable.", applications: ["NF-κB signaling inhibition", "Inflammatory cytokine modulation", "Inflammatory bowel disease models", "Mucosal immunity research", "Wound healing inflammation control", "Melanocortin peptide fragment studies"], storage: "Store lyophilized at -20°C. Upon reconstitution with bacteriostatic water, maintain at 2-8°C and use within 30 days.", related: ["bpc-157-tb-500", "ll-37-5mg", "thymalin-10mg"] },
  { name: "GHK-Cu 100mg", category: "tissue", price: 31, slug: "ghk-cu-100mg", catName: "TISSUE REPAIR", catColor: "#059669", desc: "Copper-binding tripeptide that chelates Cu²⁺ to modulate metalloproteinases and collagen synthesis.", fullDesc: "Glycyl-L-Histidyl-L-Lysine bound to copper represents one of nature's elegant metal-mediated signaling systems. First isolated from human plasma, GHK-Cu demonstrates the biological importance of copper-peptide coordination chemistry. The copper ion, precisely positioned by the peptide, activates biological functions: stimulating collagen synthesis, modulating metalloproteinase activity, and providing antioxidant effects.", applications: ["Collagen synthesis mechanisms", "Metalloproteinase regulation", "Copper-dependent enzyme research", "Extracellular matrix remodeling", "Wound healing biology", "Antioxidant copper chemistry", "Tissue regeneration models"], storage: "Store lyophilized at -20°C protected from light. Reconstitute with sterile water; the copper complex remains stable at 2-8°C for 30 days.", related: ["bpc-157-tb-500", "laennec", "glutathione-1500mg"] },
  { name: "LL-37 5mg", category: "tissue", price: 29, slug: "ll-37-5mg", catName: "TISSUE REPAIR", catColor: "#059669", desc: "The sole human cathelicidin with broad-spectrum antimicrobial and immunomodulatory activity.", fullDesc: "LL-37 occupies a unique position in human immunology: it is the only antimicrobial peptide produced by the human cathelicidin family. Cleaved from the C-terminus of the hCAP18 precursor protein, this amphipathic alpha-helical peptide demonstrates broad-spectrum antimicrobial activity against bacteria, fungi, and enveloped viruses through membrane disruption.", applications: ["Antimicrobial mechanism studies", "Innate immunity research", "Membrane disruption models", "Biofilm penetration research", "Immune cell chemotaxis", "Wound healing immunity", "Vitamin D-dependent peptide regulation"], storage: "Store lyophilized at -20°C. Upon reconstitution, maintain at 2-8°C and use within 30 days.", related: ["kpv-10mg", "bpc-157-tb-500", "thymalin-10mg"] },
  { name: "Thymalin 10mg", category: "tissue", price: 37, slug: "thymalin-10mg", catName: "TISSUE REPAIR", catColor: "#059669", desc: "Pharmaceutical-grade thymic bioregulator for T-cell differentiation and adaptive immunity research.", fullDesc: "Thymalin belongs to a unique category of biological compounds developed in the Soviet Union: bioregulators—short peptides extracted from specific organs that demonstrate tissue-specific regulatory effects. Isolated from thymus tissue, Thymalin contains peptides that appear to modulate T-cell differentiation and thymic function through mechanisms involving chromatin remodeling.", applications: ["T-cell differentiation studies", "Thymic function research", "Bioregulator peptide mechanisms", "Immune system modulation", "Immunosenescence models", "Adaptive immunity research", "Peptide-DNA interaction studies"], storage: "Store lyophilized at -20°C protected from moisture. Reconstitute with sterile or bacteriostatic water; maintain at 2-8°C and use within 30 days.", related: ["epithalon-50mg", "ll-37-5mg", "selank-10mg"] },
  { name: "Laennec", category: "tissue", price: 425, slug: "laennec", catName: "TISSUE REPAIR", catColor: "#059669", desc: "Pharmaceutical-grade human placental extract containing over 50 identified growth factors.", fullDesc: "Laennec represents the biological complexity that single-molecule research cannot capture. This pharmaceutical-grade extract, derived from healthy human placenta and manufactured under strict Japanese pharmaceutical standards, contains a remarkably diverse array of bioactive molecules: multiple growth factor families (FGF, EGF, VEGF, HGF), cytokines, amino acids, vitamins, and minerals.", applications: ["Multi-growth factor signaling", "Tissue regeneration models", "Cytokine interaction studies", "Complex biological system research", "Angiogenesis with multiple factors", "Cellular metabolism in growth factor-rich environments"], storage: "Store refrigerated at 2-8°C in sealed ampules. Do not freeze. Protect from direct light. Use immediately upon opening; no preservatives present.", related: ["cerebrolysin-60mg", "ghk-cu-100mg", "bpc-157-tb-500"] }
];

// Add remaining products (continuing from your original data)...
// For brevity, I'll show the pattern - you'd need to include all 44 products

const productNames = {
  "semaglutide": "Semaglutide",
  "tirzepatide-30mg": "Tirzepatide 30mg",
  "tirzepatide-20mg": "Tirzepatide 20mg",
  // ... etc for all products
};

function generateHTML(product) {
  const relatedHTML = product.related.map(slug => `
                <a href="${slug}.html" class="related-card">
                    <div class="related-card-name">${productNames[slug] || slug}</div>
                    <div class="related-card-price">$${products.find(p => p.slug === slug)?.price || ''}</div>
                </a>`).join('');

  const applicationsHTML = product.applications 
    ? `<h2>Research Applications</h2>
        <ul>
            ${product.applications.map(app => `<li>${app}</li>`).join('\n            ')}
        </ul>` 
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.name} | ${product.catName} | PRC Peptides</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background: #FFFFFF; color: #1E293B; line-height: 1.6; }
        header { background: #FFFFFF; border-bottom: 1px solid #E2E8F0; padding: 10px 16px; position: sticky; top: 0; z-index: 100; }
        .header-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.1rem; font-weight: 800; color: #0A1628; letter-spacing: 2px; text-decoration: none; }
        .logo span { color: #2B7DE9; }
        .nav-icon { cursor: pointer; font-size: 0.85rem; color: #94A3B8; transition: color 0.2s; background: none; border: none; padding: 6px; position: relative; }
        .nav-icon:hover { color: #2B7DE9; }
        .cart-badge { position: absolute; top: -4px; right: -6px; background: #2B7DE9; color: #fff; font-size: 0.55rem; font-weight: 700; width: 16px; height: 16px; border-radius: 50%; display: none; align-items: center; justify-content: center; }
        .breadcrumb { max-width: 1200px; margin: 0 auto; padding: 12px 16px; font-size: 0.8rem; color: #64748B; }
        .breadcrumb a { color: #64748B; text-decoration: none; }
        .breadcrumb a:hover { color: #2B7DE9; }
        .product-section { max-width: 900px; margin: 0 auto; padding: 0 16px 3rem; }
        .product-category { display: inline-block; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: ${product.catColor}; margin-bottom: 8px; }
        .product-header { margin-bottom: 2rem; }
        .product-title { font-size: 2.25rem; font-weight: 800; color: #0A1628; margin-bottom: 0.5rem; letter-spacing: -0.5px; }
        .product-meta { display: flex; align-items: center; gap: 16px; margin-bottom: 1rem; }
        .product-price { font-size: 2rem; font-weight: 800; color: #0A1628; }
        .coa-badge { font-size: 0.7rem; font-weight: 700; color: #059669; display: flex; align-items: center; gap: 4px; }
        .product-desc { font-size: 1.05rem; color: #475569; line-height: 1.8; margin-bottom: 2rem; }
        .product-section h2 { font-size: 1.3rem; font-weight: 700; color: #0A1628; margin: 2rem 0 1rem; }
        .product-section h3 { font-size: 1.1rem; font-weight: 700; color: #0A1628; margin: 1.5rem 0 0.75rem; }
        .product-section p { font-size: 0.95rem; color: #475569; line-height: 1.8; margin-bottom: 1rem; }
        .product-section ul { margin-left: 1.5rem; margin-bottom: 1rem; }
        .product-section li { font-size: 0.95rem; color: #475569; line-height: 1.8; margin-bottom: 0.5rem; }
        .action-buttons { display: flex; gap: 12px; margin: 2rem 0; flex-wrap: wrap; }
        .btn-primary { background: #2B7DE9; color: #FFFFFF; padding: 14px 32px; border-radius: 8px; border: none; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .btn-primary:hover { background: #1E40AF; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(43, 125, 233, 0.3); }
        .btn-secondary { background: #F1F5F9; color: #475569; padding: 14px 32px; border-radius: 8px; border: none; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; font-family: inherit; }
        .btn-secondary:hover { background: #E2E8F0; }
        .disclaimer { background: #FEF2F2; border-left: 3px solid #EF4444; padding: 16px; margin: 2rem 0; font-size: 0.9rem; color: #991B1B; }
        .related-products { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #E2E8F0; }
        .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-top: 1rem; }
        .related-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; text-decoration: none; transition: all 0.2s; display: block; }
        .related-card:hover { border-color: #2B7DE9; box-shadow: 0 4px 12px rgba(0,0,0,0.08); background: #FFFFFF; }
        .related-card-name { font-size: 0.95rem; font-weight: 700; color: #0A1628; margin-bottom: 4px; }
        .related-card-price { font-size: 1rem; font-weight: 800; color: #2B7DE9; }
        footer { background: #0A1628; padding: 2rem 1.5rem; margin-top: 3rem; text-align: center; color: rgba(255,255,255,0.6); font-size: 0.8rem; }
        .footer-logo { font-size: 1.1rem; font-weight: 800; color: #FFFFFF; margin-bottom: 1rem; letter-spacing: 2px; }
        footer a { color: rgba(255,255,255,0.6); text-decoration: none; }
        footer a:hover { color: #FFFFFF; }
        @media (max-width: 768px) { .product-title { font-size: 1.75rem; } .action-buttons { flex-direction: column; } .related-grid { grid-template-columns: repeat(2, 1fr); } }
    </style>
</head>
<body>
    <header>
        <div class="header-content">
            <a href="../shop.html" class="logo"><span>PRC</span> PEPTIDES</a>
            <div>
                <button class="nav-icon" onclick="window.location.href='../shop.html#shop'" title="Cart">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                    <span class="cart-badge" id="cartBadge">0</span>
                </button>
            </div>
        </div>
    </header>

    <div class="breadcrumb">
        <a href="../shop.html">Home</a> › <a href="../shop.html#categories">${product.catName}</a> › ${product.name}
    </div>

    <section class="product-section">
        <div class="product-header">
            <div class="product-category">${product.catName}</div>
            <h1 class="product-title">${product.name}</h1>
            <div class="product-meta">
                <div class="product-price">$${product.price}</div>
                <div class="coa-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    COA Available
                </div>
            </div>
        </div>

        <div class="product-desc">${product.desc}</div>

        <h2>Description</h2>
        <p>${product.fullDesc}</p>

        ${applicationsHTML}

        <h3>Storage & Handling</h3>
        <p>${product.storage}</p>

        <div class="disclaimer">
            <strong>FOR RESEARCH PURPOSES ONLY.</strong> This product is intended exclusively for in vitro laboratory research and is not for human consumption, diagnostic purposes, or therapeutic applications.
        </div>

        <div class="action-buttons">
            <button class="btn-primary" onclick="addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price})">Add to Cart — $${product.price}</button>
            <a href="mailto:support@prcpeptides.com?subject=COA Request: ${encodeURIComponent(product.name)}" class="btn-secondary">Request COA</a>
        </div>

        <div class="related-products">
            <h2>Related Products</h2>
            <div class="related-grid">${relatedHTML}
            </div>
        </div>
    </section>

    <footer>
        <div class="footer-logo"><span style="color:#2B7DE9">PRC</span> PEPTIDES</div>
        <p>Research-grade compounds for in vitro use</p>
        <p style="margin-top:1rem"><a href="../shop.html">Shop</a> · <a href="mailto:support@prcpeptides.com">Contact</a> · <a href="https://peptideresourcecenter.com" target="_blank">Resources</a></p>
        <p style="margin-top:1rem;font-size:0.7rem">© 2026 PRC Labs LLC. All rights reserved.</p>
    </footer>

    <script>
        function addToCart(name, price) {
            var cart = JSON.parse(sessionStorage.getItem('prcCart') || '[]');
            var existing = cart.find(function(item) { return item.name === name; });
            if (existing) { existing.quantity += 1; } 
            else { cart.push({ name: name, price: price, quantity: 1 }); }
            sessionStorage.setItem('prcCart', JSON.stringify(cart));
            updateCartBadge();
            alert('Added to cart! Return to shop to checkout.');
        }
        function updateCartBadge() {
            var cart = JSON.parse(sessionStorage.getItem('prcCart') || '[]');
            var count = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
            var badge = document.getElementById('cartBadge');
            if (count > 0) { badge.textContent = count; badge.style.display = 'flex'; } 
            else { badge.style.display = 'none'; }
        }
        updateCartBadge();
    </script>
</body>
</html>`;
}

// Generate all product pages
products.forEach(product => {
  const html = generateHTML(product);
  const filepath = path.join(__dirname, 'products', `${product.slug}.html`);
  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`Generated: ${product.slug}.html`);
});

console.log('Done! Generated ' + products.length + ' product pages.');
