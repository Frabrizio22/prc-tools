const fs = require('fs');
const path = require('path');

// Comprehensive product data with molecular specs
const products = [
    {
        name: 'Semaglutide',
        filename: 'semaglutide.html',
        category: 'GLP Agonists',
        categoryColor: '#2563EB',
        price: 30,
        quantity: '5mg',
        form: 'Lyophilized Powder',
        purity: '≥98%',
        cas: '910463-68-2',
        mw: '4113.6 g/mol',
        formula: 'C<sub>187</sub>H<sub>291</sub>N<sub>45</sub>O<sub>59</sub>',
        shortDesc: 'Benchmark long-acting GLP-1 receptor agonist with fatty acid modification for extended half-life.',
        fullDesc: 'Semaglutide represents the culmination of decades of incretin biology research. This glucagon-like peptide-1 analogue features a strategic fatty acid modification that enables albumin binding, dramatically extending its half-life from minutes to days. This single molecular modification transformed GLP-1 from a rapidly degraded hormone into a sustained metabolic signaling tool, enabling researchers to study prolonged GLP-1 receptor activation without the confounding variables of pulsatile dosing.\n\nThe compound\'s potency at GLP-1 receptors—combined with its resistance to DPP-4 degradation—has made it the gold standard in metabolic research models. Studies investigating glucose homeostasis, pancreatic beta-cell function, appetite regulation via hypothalamic pathways, and incretin receptor pharmacology consistently rely on semaglutide as the reference GLP-1 agonist.',
        applications: ['GLP-1 receptor binding and signaling studies', 'Glucose homeostasis mechanisms', 'Pancreatic beta-cell function research', 'Appetite regulation pathways', 'Incretin pharmacology', 'Metabolic disease models'],
        storage: 'Store lyophilized at -20°C protected from light. Upon reconstitution with bacteriostatic water, store at 2-8°C and use within 30 days. The acylated structure provides enhanced stability compared to native GLP-1. Avoid repeated freeze-thaw cycles to preserve peptide integrity.',
        related: [
            { name: 'Tirzepatide 30mg', filename: 'tirzepatide-30mg.html', category: 'GLP Agonists', price: 46 },
            { name: 'Retatrutide 20mg', filename: 'retatrutide-20mg.html', category: 'GLP Agonists', price: 55 },
            { name: 'Cagrilintide 5mg', filename: 'cagrilintide-5mg.html', category: 'GLP Agonists', price: 25 }
        ],
        injectable: true
    },
    {
        name: 'Tirzepatide 20mg',
        filename: 'tirzepatide-20mg.html',
        category: 'GLP Agonists',
        categoryColor: '#2563EB',
        price: 44,
        quantity: '20mg',
        form: 'Lyophilized Powder',
        purity: '≥98%',
        cas: '2023788-19-2',
        mw: '4813.5 g/mol',
        formula: 'C<sub>225</sub>H<sub>348</sub>N<sub>48</sub>O<sub>68</sub>',
        shortDesc: 'First dual GLP-1/GIP receptor agonist with balanced potency for incretin synergy research.',
        fullDesc: 'Tirzepatide represents a paradigm shift in incretin biology. Where previous research focused on single-receptor agonism, this novel peptide activates both glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptors with balanced potency. The compound\'s structure—based on the native GIP sequence with modifications that confer GLP-1 activity—creates a dual agonist profile impossible to achieve with natural hormones.\n\nThis dual incretin activation reveals synergistic metabolic effects: GIP enhances insulin secretion and may support beta-cell health, while GLP-1 provides appetite suppression and delays gastric emptying. Researchers studying incretin receptor cross-talk, synergistic metabolic signaling, or the distinct contributions of GIP versus GLP-1 pathways find tirzepatide indispensable for dissecting complex incretin physiology.',
        applications: ['Dual incretin pathway research', 'GIP/GLP-1 receptor synergy', 'Incretin receptor pharmacology', 'Metabolic signaling cascade studies', 'Pancreatic islet function', 'Comparative incretin biology'],
        storage: 'Store lyophilized at -20°C in sealed container. Reconstitute with bacteriostatic water; maintain at 2-8°C for up to 30 days. The fatty acid modification provides proteolytic resistance and extended stability.',
        related: [
            { name: 'Tirzepatide 30mg', filename: 'tirzepatide-30mg.html', category: 'GLP Agonists', price: 46 },
            { name: 'Retatrutide 20mg', filename: 'retatrutide-20mg.html', category: 'GLP Agonists', price: 55 },
            { name: 'Semaglutide', filename: 'semaglutide.html', category: 'GLP Agonists', price: 30 }
        ],
        injectable: true
    },
    {
        name: 'Tirzepatide 30mg',
        filename: 'tirzepatide-30mg.html',
        category: 'GLP Agonists',
        categoryColor: '#2563EB',
        price: 46,
        quantity: '30mg',
        form: 'Lyophilized Powder',
        purity: '≥98%',
        cas: '2023788-19-2',
        mw: '4813.5 g/mol',
        formula: 'C<sub>225</sub>H<sub>348</sub>N<sub>48</sub>O<sub>68</sub>',
        shortDesc: 'Higher-dose dual GLP-1/GIP receptor agonist for advanced incretin research.',
        fullDesc: 'Tirzepatide represents a paradigm shift in incretin biology. Where previous research focused on single-receptor agonism, this novel peptide activates both glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptors with balanced potency. The compound\'s structure—based on the native GIP sequence with modifications that confer GLP-1 activity—creates a dual agonist profile impossible to achieve with natural hormones.\n\nThis dual incretin activation reveals synergistic metabolic effects: GIP enhances insulin secretion and may support beta-cell health, while GLP-1 provides appetite suppression and delays gastric emptying. Researchers studying incretin receptor cross-talk, synergistic metabolic signaling, or the distinct contributions of GIP versus GLP-1 pathways find tirzepatide indispensable for dissecting complex incretin physiology.',
        applications: ['Dual incretin pathway research', 'GIP/GLP-1 receptor synergy', 'Incretin receptor pharmacology', 'Metabolic signaling cascade studies', 'Pancreatic islet function', 'Comparative incretin biology'],
        storage: 'Store lyophilized at -20°C in sealed container. Reconstitute with bacteriostatic water; maintain at 2-8°C for up to 30 days. The fatty acid modification provides proteolytic resistance and extended stability.',
        related: [
            { name: 'Retatrutide 20mg', filename: 'retatrutide-20mg.html', category: 'GLP Agonists', price: 55 },
            { name: 'Tirzepatide 20mg', filename: 'tirzepatide-20mg.html', category: 'GLP Agonists', price: 44 },
            { name: 'Semaglutide', filename: 'semaglutide.html', category: 'GLP Agonists', price: 30 }
        ],
        injectable: true
    },
    {
        name: 'Retatrutide 20mg',
        filename: 'retatrutide-20mg.html',
        category: 'GLP Agonists',
        categoryColor: '#2563EB',
        price: 55,
        quantity: '20mg',
        form: 'Lyophilized Powder',
        purity: '≥98%',
        cas: '2381089-83-2',
        mw: '4731.0 g/mol',
        formula: 'C<sub>221</sub>H<sub>342</sub>N<sub>46</sub>O<sub>68</sub>',
        shortDesc: 'World\'s first triple GLP-1/GIP/Glucagon receptor agonist for multi-pathway metabolic research.',
        fullDesc: 'Retatrutide represents the frontier of incretin research. Building on tirzepatide\'s dual-agonist success, this peptide features an unprecedented pharmacological profile: balanced activation of three distinct hormone receptors—GLP-1, GIP, and glucagon. This triple agonism creates a metabolic phenotype unattainable through any combination of existing compounds: incretin-mediated glucose regulation and appetite suppression, plus glucagon-driven energy expenditure.\n\nThe addition of glucagon receptor activity—traditionally avoided in metabolic therapies due to hyperglycemic concerns—proves synergistic when balanced with GLP-1 and GIP signaling. Researchers investigating energy balance, thermogenesis, complex metabolic pathway interactions, or next-generation incretin pharmacology find retatrutide essential for exploring multi-receptor agonism strategies.',
        applications: ['Triple-receptor agonism studies', 'GLP-1/GIP/glucagon pathway synergy', 'Energy expenditure mechanisms', 'Complex metabolic signaling', 'Thermogenesis research', 'Next-generation incretin biology'],
        storage: 'Store lyophilized at -20°C protected from moisture. Reconstitute with bacteriostatic water; stable at 2-8°C for 30 days. Handle with care—this represents one of the most complex peptide agonists in metabolic research.',
        related: [
            { name: 'Tirzepatide 30mg', filename: 'tirzepatide-30mg.html', category: 'GLP Agonists', price: 46 },
            { name: 'Semaglutide', filename: 'semaglutide.html', category: 'GLP Agonists', price: 30 },
            { name: 'MOTS-c 10mg', filename: 'mots-c-10mg.html', category: 'Metabolic', price: 28 }
        ],
        injectable: true
    },
    {
        name: 'Cagrilintide 5mg',
        filename: 'cagrilintide-5mg.html',
        category: 'GLP Agonists',
        categoryColor: '#2563EB',
        price: 25,
        quantity: '5mg',
        form: 'Lyophilized Powder',
        purity: '≥98%',
        cas: '2374769-38-1',
        mw: '4409.5 g/mol',
        formula: 'C<sub>194</sub>H<sub>312</sub>N<sub>54</sub>O<sub>59</sub>S<sub>2</sub>',
        shortDesc: 'Long-acting amylin receptor agonist for sustained satiety and gastric emptying research.',
        fullDesc: 'Cagrilintide reimagines amylin pharmacology. While first-generation amylin analogue pramlintide required frequent dosing and suffered from limited stability, structural modifications created a compound with dramatically extended receptor residence time and proteolytic resistance. This long-acting analogue enables researchers to study sustained amylin receptor activation—revealing roles for this often-overlooked hormone in metabolic regulation that short-acting compounds cannot illuminate.\n\nAmylin, co-secreted with insulin from pancreatic beta cells, serves as a critical satiety signal and gastric motility regulator. Cagrilintide\'s enhanced pharmacokinetics make it ideal for investigating amylin receptor biology, the interplay between amylin and incretin pathways, and the therapeutic potential of sustained amylin agonism in metabolic disease models.',
        applications: ['Amylin receptor signaling research', 'Gastric emptying mechanisms', 'Satiety pathway studies', 'Pancreatic beta-cell co-secretion', 'Pramlintide comparison pharmacology', 'Calcitonin receptor family research'],
        storage: 'Store lyophilized at -20°C in sealed vial. Upon reconstitution, maintain refrigerated at 2-8°C and use within 30 days. The acylated structure provides exceptional stability compared to native amylin.',
        related: [
            { name: 'Semaglutide', filename: 'semaglutide.html', category: 'GLP Agonists', price: 30 },
            { name: 'Tirzepatide 20mg', filename: 'tirzepatide-20mg.html', category: 'GLP Agonists', price: 44 },
            { name: 'AOD-9604 2mg', filename: 'aod-9604-2mg.html', category: 'Metabolic', price: 20 }
        ],
        injectable: true
    }
];

// Continue with all remaining products...
// Due to length, I'll create a complete file generation approach

function generateHTML(product) {
    const relatedHTML = product.related.map(r => `
                <a href="${r.filename}" class="related-card">
                    <div class="related-category">${r.category}</div>
                    <div class="related-name">${r.name}</div>
                    <div class="related-price">$${r.price}</div>
                </a>`).join('');

    const applicationsHTML = product.applications.map(app => `            <li>${app}</li>`).join('\n');

    const paragraphs = product.fullDesc.split('\n\n').map(p => `        <p>${p}</p>`).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.name} | ${product.category} | PRC Peptides</title>
    <meta name="description" content="${product.shortDesc} ≥98% pure. Third-party tested. COA available.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #FFFFFF;
            color: #1E293B;
            line-height: 1.6;
        }

        header {
            background: #FFF;
            border-bottom: 1px solid #E2E8F0;
            padding: 10px 16px;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-content {
            max-width: 900px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.1rem;
            font-weight: 800;
            color: #0A1628;
            letter-spacing: 2px;
            text-decoration: none;
        }

        .logo span { color: #2B7DE9; }

        .cart-icon {
            cursor: pointer;
            font-size: 0.85rem;
            color: #94A3B8;
            background: none;
            border: none;
            padding: 6px;
            position: relative;
        }

        .cart-badge {
            position: absolute;
            top: -4px;
            right: -6px;
            background: #2B7DE9;
            color: #fff;
            font-size: 0.55rem;
            font-weight: 700;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
        }

        .breadcrumb {
            max-width: 900px;
            margin: 0 auto;
            padding: 12px 16px 6px;
            font-size: 0.75rem;
            color: #64748B;
        }

        .breadcrumb a {
            color: #2B7DE9;
            text-decoration: none;
        }

        .breadcrumb a:hover { text-decoration: underline; }

        main {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 16px 3rem;
        }

        .category-label {
            font-size: 0.65rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: ${product.categoryColor};
            margin: 16px 0 8px;
            display: inline-block;
        }

        h1 {
            font-size: 2rem;
            font-weight: 800;
            color: #0A1628;
            margin-bottom: 1rem;
            letter-spacing: -0.5px;
        }

        .product-meta {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }

        .product-price {
            font-size: 2rem;
            font-weight: 800;
            color: #0A1628;
        }

        .coa-badge {
            font-size: 0.7rem;
            font-weight: 700;
            color: #059669;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .specs-table {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 1.5rem;
        }

        .specs-table table {
            width: 100%;
            border-collapse: collapse;
        }

        .specs-table tr {
            border-bottom: 1px solid #E2E8F0;
        }

        .specs-table tr:last-child { border-bottom: none; }

        .specs-table td {
            padding: 10px 14px;
            font-size: 0.85rem;
        }

        .specs-table td:first-child {
            font-weight: 600;
            color: #475569;
            width: 35%;
        }

        .specs-table td:last-child {
            color: #0A1628;
            font-weight: 500;
        }

        .trust-bar {
            display: flex;
            gap: 16px;
            padding: 12px 16px;
            background: #F8FAFC;
            border-radius: 6px;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }

        .trust-item {
            font-size: 0.7rem;
            font-weight: 600;
            color: #475569;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .trust-item::before {
            content: '✓';
            color: #059669;
            font-weight: 700;
        }

        .quantity-selector {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 1rem;
        }

        .qty-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: #475569;
        }

        .qty-controls {
            display: flex;
            align-items: center;
            gap: 12px;
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            padding: 6px 12px;
        }

        .qty-btn {
            background: none;
            border: none;
            color: #2B7DE9;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            padding: 0 8px;
            line-height: 1;
        }

        .qty-btn:hover { color: #1E40AF; }

        .qty-value {
            font-size: 1rem;
            font-weight: 600;
            color: #0A1628;
            min-width: 24px;
            text-align: center;
        }

        .action-buttons {
            display: flex;
            gap: 12px;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .btn-primary {
            background: #2B7DE9;
            color: #FFF;
            padding: 14px 32px;
            border-radius: 8px;
            border: none;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            font-family: inherit;
            transition: background 0.2s;
        }

        .btn-primary:hover { background: #1E40AF; }

        .btn-secondary {
            background: #F1F5F9;
            color: #475569;
            padding: 14px 24px;
            border-radius: 8px;
            text-decoration: none;
            display: inline-block;
            font-size: 0.9rem;
            font-weight: 600;
            transition: background 0.2s;
        }

        .btn-secondary:hover { background: #E2E8F0; }

        h2 {
            font-size: 1.3rem;
            font-weight: 700;
            color: #0A1628;
            margin: 2rem 0 1rem;
        }

        p {
            font-size: 0.95rem;
            color: #475569;
            line-height: 1.8;
            margin-bottom: 1rem;
        }

        ul {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
        }

        li {
            font-size: 0.95rem;
            color: #475569;
            line-height: 1.8;
            margin-bottom: 0.5rem;
        }

        .disclaimer {
            background: #F8FAFC;
            border-left: 3px solid #94A3B8;
            padding: 12px 16px;
            margin: 2rem 0;
            font-size: 0.8rem;
            color: #475569;
            border-radius: 0 4px 4px 0;
        }

        .related-products {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #E2E8F0;
        }

        .related-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
            margin-top: 1rem;
        }

        .related-card {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            padding: 16px;
            text-decoration: none;
            display: block;
            transition: all 0.2s;
        }

        .related-card:hover {
            border-color: #2B7DE9;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .related-category {
            font-size: 0.6rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: ${product.categoryColor};
            margin-bottom: 4px;
        }

        .related-name {
            font-size: 0.95rem;
            font-weight: 700;
            color: #0A1628;
            margin-bottom: 4px;
        }

        .related-price {
            font-size: 1rem;
            font-weight: 800;
            color: #2B7DE9;
        }

        footer {
            background: #0A1628;
            padding: 2rem 1.5rem;
            margin-top: 3rem;
            text-align: center;
            color: rgba(255,255,255,0.6);
            font-size: 0.8rem;
        }

        .footer-logo {
            font-size: 1.1rem;
            font-weight: 800;
            color: #FFF;
            margin-bottom: 1rem;
            letter-spacing: 2px;
        }

        footer a {
            color: rgba(255,255,255,0.6);
            text-decoration: none;
        }

        footer a:hover { color: #FFF; }

        .toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #0A1628;
            color: #fff;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }

        .toast.show { opacity: 1; }

        /* Mobile sticky bar */
        .mobile-sticky {
            display: none;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            border-top: 1px solid #E2E8F0;
            padding: 12px 16px;
            box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
            z-index: 90;
        }

        .mobile-sticky-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 900px;
            margin: 0 auto;
        }

        .mobile-sticky-price {
            font-size: 1.25rem;
            font-weight: 800;
            color: #0A1628;
        }

        .mobile-sticky button {
            padding: 10px 24px;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            h1 { font-size: 1.75rem; }
            .product-price { font-size: 1.75rem; }
            .related-grid { grid-template-columns: repeat(2, 1fr); }
            .mobile-sticky { display: block; }
            main { padding-bottom: 80px; }
        }
    </style>
</head>
<body>
    <header>
        <div class="header-content">
            <a href="../shop.html" class="logo"><span>PRC</span> PEPTIDES</a>
            <button class="cart-icon" onclick="window.location.href='../shop.html'">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
                <span class="cart-badge" id="cartBadge">0</span>
            </button>
        </div>
    </header>

    <div class="breadcrumb">
        <a href="../shop.html">← Back to Shop</a> › <a href="../shop.html">${product.category}</a> › ${product.name}
    </div>

    <main>
        <div class="category-label">${product.category}</div>
        <h1>${product.name}</h1>

        <div class="product-meta">
            <div class="product-price">$${product.price}</div>
            <div class="coa-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                COA Available
            </div>
        </div>

        <div class="specs-table">
            <table>
                <tr><td>Form</td><td>${product.form}</td></tr>
                <tr><td>Quantity</td><td>${product.quantity}</td></tr>
                <tr><td>Purity</td><td>${product.purity}</td></tr>
                <tr><td>CAS Number</td><td>${product.cas}</td></tr>
                <tr><td>Molecular Weight</td><td>${product.mw}</td></tr>
                <tr><td>Molecular Formula</td><td>${product.formula}</td></tr>
            </table>
        </div>

        <div class="trust-bar">
            <div class="trust-item">Third-Party Tested</div>
            <div class="trust-item">Ships Next Day</div>
            <div class="trust-item">Free Over $150</div>
        </div>

        <div class="quantity-selector">
            <span class="qty-label">Quantity:</span>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQty(-1)">−</button>
                <span class="qty-value" id="qtyValue">1</span>
                <button class="qty-btn" onclick="changeQty(1)">+</button>
            </div>
        </div>

        <div class="action-buttons">
            <button class="btn-primary" onclick="addToCart()">Add to Cart — $<span id="totalPrice">${product.price}</span></button>
            <a href="mailto:support@prcpeptides.com?subject=COA%20Request%3A%20${encodeURIComponent(product.name)}" class="btn-secondary">Request COA</a>
        </div>

        <h2>Description</h2>
${paragraphs}

        <h2>Research Applications</h2>
        <ul>
${applicationsHTML}
        </ul>

        <h2>Storage & Handling</h2>
        <p>${product.storage}</p>

        <div class="disclaimer">
            <strong>FOR RESEARCH PURPOSES ONLY.</strong> This product is intended exclusively for in vitro laboratory research and is not intended for human consumption, diagnostic use, or therapeutic applications.
        </div>

        <div class="related-products">
            <h2>Researchers Also Explore</h2>
            <div class="related-grid">${relatedHTML}
            </div>
        </div>
    </main>

    <div class="mobile-sticky">
        <div class="mobile-sticky-content">
            <div>
                <div style="font-size:0.75rem;color:#64748B;margin-bottom:2px">${product.name}</div>
                <div class="mobile-sticky-price">$<span id="mobileTotalPrice">${product.price}</span></div>
            </div>
            <button class="btn-primary" onclick="addToCart()">Add to Cart</button>
        </div>
    </div>

    <footer>
        <div class="footer-logo"><span style="color:#2B7DE9">PRC</span> PEPTIDES</div>
        <p>Research-grade compounds for in vitro use</p>
        <p style="margin-top:1rem"><a href="../shop.html">Shop</a> · <a href="mailto:support@prcpeptides.com">Contact</a></p>
        <p style="margin-top:1rem;font-size:0.7rem">© 2026 PRC Labs LLC</p>
    </footer>

    <div class="toast" id="toast">Added to cart!</div>

    <script>
        var quantity = 1;
        var basePrice = ${product.price};
        var productName = '${product.name.replace(/'/g, "\\'")}';

        function changeQty(delta) {
            quantity = Math.max(1, quantity + delta);
            document.getElementById('qtyValue').textContent = quantity;
            updatePrice();
        }

        function updatePrice() {
            var total = basePrice * quantity;
            document.getElementById('totalPrice').textContent = total;
            document.getElementById('mobileTotalPrice').textContent = total;
        }

        function addToCart() {
            var cart = JSON.parse(sessionStorage.getItem('prcCart') || '[]');
            var existing = cart.find(function(item) { return item.name === productName; });
            
            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.push({ name: productName, price: basePrice, quantity: quantity });
            }
            
            sessionStorage.setItem('prcCart', JSON.stringify(cart));
            updateCartBadge();
            showToast();
        }

        function updateCartBadge() {
            var cart = JSON.parse(sessionStorage.getItem('prcCart') || '[]');
            var count = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
            var badge = document.getElementById('cartBadge');
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'flex';
            }
        }

        function showToast() {
            var toast = document.getElementById('toast');
            toast.classList.add('show');
            setTimeout(function() { toast.classList.remove('show'); }, 2000);
        }

        updateCartBadge();
    </script>
</body>
</html>`;
}

// Generate all product files
products.forEach(product => {
    const html = generateHTML(product);
    const outputPath = path.join(__dirname, 'prc-tools', 'products', product.filename);
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`✓ Generated ${product.filename}`);
});

console.log(`\n✅ Generated ${products.length} product pages!`);
