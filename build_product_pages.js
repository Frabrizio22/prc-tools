#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔨 PRC Product Pages Builder v3 - REAL DESCRIPTIONS\n');

// Read template
const template = fs.readFileSync('product_page_template.html', 'utf8');

// Category mappings
const categories = {
  'glp': { name: 'GLP Receptor Agonists', color: '#2563EB' },
  'tissue': { name: 'Tissue Repair', color: '#059669' },
  'gh': { name: 'Growth Hormone Secretagogues', color: '#EA580C' },
  'metabolic': { name: 'Metabolic', color: '#DC2626' },
  'antioxidants': { name: 'Antioxidants', color: '#7C3AED' },
  'neuropeptides': { name: 'Neuropeptides', color: '#0891B2' },
  'longevity': { name: 'Longevity', color: '#B45309' },
  'melanocortin': { name: 'Melanocortin', color: '#DB2777' },
  'cosmetic': { name: 'Cosmetic', color: '#A21CAF' },
  'advanced': { name: 'Advanced', color: '#475569' }
};

// Complete product data with descriptions from v3
const products = [
  // GLP AGONISTS
  { 
    slug: 'semaglutide', 
    name: 'Semaglutide', 
    price: 30, 
    cat: 'glp', 
    qty: '5mg', 
    cas: '910463-68-2', 
    mw: '4113.6 g/mol', 
    formula: 'C<sub>187</sub>H<sub>291</sub>N<sub>45</sub>O<sub>59</sub>',
    seoTitle: 'Semaglutide (GLP-1) | ≥98% Pure | Long-Acting GLP-1 Agonist | PRC Peptides',
    metaDesc: 'Semaglutide GLP-1 receptor agonist for metabolic research. ≥98% purity, third-party tested, fatty acid-modified for extended half-life. COA available.',
    shortDesc: 'The benchmark long-acting GLP-1 receptor agonist—a fatty acid-modified peptide that redefined incretin-based metabolic research.',
    fullDescription: '<p>Semaglutide represents the culmination of decades of incretin biology research. Novo Nordisk\'s scientists engineered this glucagon-like peptide-1 analogue with a strategic fatty acid modification that enables albumin binding, dramatically extending its half-life from minutes to days. This single molecular modification transformed GLP-1 from a rapidly degraded hormone into a sustained metabolic signaling tool, enabling researchers to study prolonged GLP-1 receptor activation without the confounding variables of pulsatile dosing.</p><p>The compound\'s potency at GLP-1 receptors—combined with its resistance to DPP-4 degradation—has made it the gold standard in metabolic research models. Studies investigating glucose homeostasis, pancreatic beta-cell function, appetite regulation via hypothalamic pathways, and incretin receptor pharmacology consistently rely on semaglutide as the reference GLP-1 agonist.</p>',
    researchApplications: ['GLP-1 receptor binding and signaling studies', 'Glucose homeostasis mechanisms', 'Pancreatic beta-cell function research', 'Appetite regulation pathways', 'Incretin pharmacology', 'Metabolic disease models'],
    storage: 'Store lyophilized at -20°C protected from light. Upon reconstitution with bacteriostatic water, store at 2-8°C and use within 30 days. The acylated structure provides enhanced stability compared to native GLP-1.'
  },
  { 
    slug: 'tirzepatide-30mg', 
    name: 'Tirzepatide 30mg', 
    price: 46, 
    cat: 'glp', 
    qty: '30mg', 
    cas: '2023788-19-2', 
    mw: '4813.5 g/mol', 
    formula: 'C<sub>225</sub>H<sub>348</sub>N<sub>48</sub>O<sub>68</sub>',
    seoTitle: 'Tirzepatide 30mg | ≥98% Pure | Higher-Dose Dual Agonist | PRC Peptides',
    metaDesc: 'Tirzepatide 30mg dual GLP-1/GIP agonist for incretin research. ≥98% purity, third-party tested, balanced receptor activation. COA available.',
    shortDesc: 'The first dual incretin receptor agonist—a fusion peptide that simultaneously activates GLP-1 and GIP pathways for unprecedented metabolic effects.',
    fullDescription: '<p>Tirzepatide represents a paradigm shift in incretin biology. Where previous research focused on single-receptor agonism, Eli Lilly scientists engineered this novel peptide to activate both glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptors with balanced potency. The compound\'s structure—based on the native GIP sequence with modifications that confer GLP-1 activity—creates a dual agonist profile impossible to achieve with natural hormones.</p><p>This dual incretin activation reveals synergistic metabolic effects: GIP enhances insulin secretion and may support beta-cell health, while GLP-1 provides appetite suppression and delays gastric emptying. Researchers studying incretin receptor cross-talk, synergistic metabolic signaling, or the distinct contributions of GIP versus GLP-1 pathways find tirzepatide indispensable for dissecting complex incretin physiology.</p>',
    researchApplications: ['Dual incretin pathway research', 'GIP/GLP-1 receptor synergy', 'Incretin receptor pharmacology', 'Metabolic signaling cascade studies', 'Pancreatic islet function', 'Comparative incretin biology'],
    storage: 'Store lyophilized at -20°C in sealed container. Reconstitute with bacteriostatic water; maintain at 2-8°C for up to 30 days. The fatty acid modification provides proteolytic resistance and extended stability.'
  },
  { 
    slug: 'tirzepatide-20mg', 
    name: 'Tirzepatide 20mg', 
    price: 44, 
    cat: 'glp', 
    qty: '20mg', 
    cas: '2023788-19-2', 
    mw: '4813.5 g/mol', 
    formula: 'C<sub>225</sub>H<sub>348</sub>N<sub>48</sub>O<sub>68</sub>',
    seoTitle: 'Tirzepatide 20mg | ≥98% Pure | Dual GLP-1/GIP Agonist | PRC Peptides',
    metaDesc: 'Tirzepatide 20mg dual incretin agonist for metabolic research. ≥98% purity, third-party tested, simultaneous GLP-1/GIP activation. COA available.',
    shortDesc: 'The first dual incretin receptor agonist—a fusion peptide that simultaneously activates GLP-1 and GIP pathways for unprecedented metabolic effects.',
    fullDescription: '<p>Tirzepatide represents a paradigm shift in incretin biology. Where previous research focused on single-receptor agonism, Eli Lilly scientists engineered this novel peptide to activate both glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptors with balanced potency. The compound\'s structure—based on the native GIP sequence with modifications that confer GLP-1 activity—creates a dual agonist profile impossible to achieve with natural hormones.</p><p>This dual incretin activation reveals synergistic metabolic effects: GIP enhances insulin secretion and may support beta-cell health, while GLP-1 provides appetite suppression and delays gastric emptying. Researchers studying incretin receptor cross-talk, synergistic metabolic signaling, or the distinct contributions of GIP versus GLP-1 pathways find tirzepatide indispensable for dissecting complex incretin physiology.</p>',
    researchApplications: ['Dual incretin pathway research', 'GIP/GLP-1 receptor synergy', 'Incretin receptor pharmacology', 'Metabolic signaling cascade studies', 'Pancreatic islet function', 'Comparative incretin biology'],
    storage: 'Store lyophilized at -20°C in sealed container. Reconstitute with bacteriostatic water; maintain at 2-8°C for up to 30 days. The fatty acid modification provides proteolytic resistance and extended stability.'
  },
  { 
    slug: 'retatrutide-20mg', 
    name: 'Retatrutide 20mg', 
    price: 55, 
    cat: 'glp', 
    qty: '20mg', 
    cas: '2381089-83-2', 
    mw: '4731.0 g/mol', 
    formula: 'C<sub>221</sub>H<sub>342</sub>N<sub>46</sub>O<sub>68</sub>',
    seoTitle: 'Retatrutide 20mg | ≥98% Pure | Triple Incretin-Glucagon Agonist | PRC Peptides',
    metaDesc: 'Retatrutide 20mg triple GLP-1/GIP/Glucagon agonist. ≥98% purity, third-party tested, next-generation metabolic research compound. COA available.',
    shortDesc: 'The world\'s first triple-agonist peptide—simultaneously activating GLP-1, GIP, and glucagon receptors to unlock metabolic effects impossible with dual agonism.',
    fullDescription: '<p>Retatrutide represents the frontier of incretin research. Building on tirzepatide\'s dual-agonist success, Eli Lilly scientists engineered this peptide with an unprecedented pharmacological profile: balanced activation of three distinct hormone receptors—GLP-1, GIP, and glucagon. This triple agonism creates a metabolic phenotype unattainable through any combination of existing compounds: incretin-mediated glucose regulation and appetite suppression, plus glucagon-driven energy expenditure.</p><p>The addition of glucagon receptor activity—traditionally avoided in metabolic therapies due to hyperglycemic concerns—proves synergistic when balanced with GLP-1 and GIP signaling. Researchers investigating energy balance, thermogenesis, complex metabolic pathway interactions, or next-generation incretin pharmacology find retatrutide essential for exploring multi-receptor agonism strategies.</p>',
    researchApplications: ['Triple-receptor agonism studies', 'GLP-1/GIP/glucagon pathway synergy', 'Energy expenditure mechanisms', 'Complex metabolic signaling', 'Thermogenesis research', 'Next-generation incretin biology'],
    storage: 'Store lyophilized at -20°C protected from moisture. Reconstitute with bacteriostatic water; stable at 2-8°C for 30 days. Handle with care—this represents one of the most complex peptide agonists in metabolic research.'
  },
  { 
    slug: 'cagrilintide', 
    name: 'Cagrilintide 5mg', 
    price: 25, 
    cat: 'glp', 
    qty: '5mg', 
    cas: '2374769-38-1', 
    mw: '4409.5 g/mol', 
    formula: 'C<sub>194</sub>H<sub>312</sub>N<sub>54</sub>O<sub>59</sub>S<sub>2</sub>',
    seoTitle: 'Cagrilintide 5mg | ≥98% Pure | Long-Acting Amylin Analogue | PRC Peptides',
    metaDesc: 'Cagrilintide 5mg amylin receptor agonist for satiety research. ≥98% purity, third-party tested, extended half-life amylin analogue. COA available.',
    shortDesc: 'A next-generation amylin receptor agonist with extended half-life—enabling sustained study of amylin\'s role in satiety, gastric emptying, and glucose regulation.',
    fullDescription: '<p>Cagrilintide reimagines amylin pharmacology. While the first-generation amylin analogue pramlintide required frequent dosing and suffered from limited stability, Novo Nordisk\'s structural modifications created a compound with dramatically extended receptor residence time and proteolytic resistance. This long-acting analogue enables researchers to study sustained amylin receptor activation—revealing roles for this often-overlooked hormone in metabolic regulation that short-acting compounds cannot illuminate.</p><p>Amylin, co-secreted with insulin from pancreatic beta cells, serves as a critical satiety signal and gastric motility regulator. Cagrilintide\'s enhanced pharmacokinetics make it ideal for investigating amylin receptor biology, the interplay between amylin and incretin pathways, and the therapeutic potential of sustained amylin agonism in metabolic disease models.</p>',
    researchApplications: ['Amylin receptor signaling research', 'Gastric emptying mechanisms', 'Satiety pathway studies', 'Pancreatic beta-cell co-secretion', 'Pramlintide comparison pharmacology', 'Calcitonin receptor family research'],
    storage: 'Store lyophilized at -20°C in sealed vial. Upon reconstitution, maintain refrigerated at 2-8°C and use within 30 days. The acylated structure provides exceptional stability compared to native amylin.'
  },
  
  // TISSUE REPAIR
  { 
    slug: 'bpc-157-tb-500', 
    name: 'BPC-157/TB-500', 
    price: 40, 
    cat: 'tissue', 
    qty: '10mg/10mg', 
    cas: '137525-51-0', 
    mw: '1419.5 g/mol', 
    formula: 'C<sub>62</sub>H<sub>98</sub>N<sub>16</sub>O<sub>22</sub>',
    seoTitle: 'BPC-157/TB-500 10mg/10mg | ≥98% Pure | Dual Tissue Repair Complex | PRC Peptides',
    metaDesc: 'BPC-157/TB-500 combination for tissue repair research. ≥98% purity, third-party tested, cytoprotective and angiogenic. COA available.',
    shortDesc: 'The most widely researched tissue repair combination—pairing BPC-157\'s cytoprotective mechanisms with TB-500\'s actin-mediated cell migration for comprehensive healing studies.',
    fullDescription: '<p>Tissue repair requires coordinated processes: inflammatory resolution, angiogenesis, cell migration, extracellular matrix remodeling, and cytoprotection. This combination targets multiple phases simultaneously. BPC-157, a pentadecapeptide partial sequence of the body protection compound isolated from gastric juice, demonstrates remarkable cytoprotective properties in mucosal tissue while promoting angiogenesis through VEGF modulation. TB-500 (Thymosin Beta-4 fragment) facilitates actin polymerization and cytoskeletal reorganization, driving cell migration to injury sites and promoting extracellular matrix formation.</p><p>Their mechanisms complement: BPC-157 protects existing tissue and stimulates new vessel formation, while TB-500 mobilizes repair cells and promotes structural regeneration. With hundreds of published studies investigating each peptide individually, researchers increasingly combine them to model multi-phase tissue healing—from acute injury response through complete structural restoration.</p>',
    researchApplications: ['Wound healing models', 'Angiogenesis research', 'Cytoprotection mechanisms', 'Cell migration assays', 'Collagen synthesis studies', 'Anti-inflammatory pathway research', 'Musculoskeletal repair models'],
    storage: 'Store lyophilized at -20°C protected from moisture. Both peptides remain stable when co-reconstituted; maintain at 2-8°C and use within 30 days. Compatible in the same solution without interaction.'
  },
  { 
    slug: 'kpv', 
    name: 'KPV', 
    price: 36, 
    cat: 'tissue', 
    qty: '10mg', 
    cas: '61090-95-7', 
    mw: '342.4 g/mol', 
    formula: 'C<sub>16</sub>H<sub>30</sub>N<sub>4</sub>O<sub>4</sub>',
    seoTitle: 'KPV 10mg | ≥98% Pure | α-MSH Anti-Inflammatory Peptide | PRC Peptides',
    metaDesc: 'KPV 10mg anti-inflammatory tripeptide for NF-κB research. ≥98% purity, third-party tested, α-MSH C-terminal fragment. COA available.',
    shortDesc: 'The isolated anti-inflammatory domain of α-MSH—a tripeptide that retains potent NF-κB inhibition without melanocortin receptor activation.',
    fullDescription: '<p>KPV (Lysine-Proline-Valine) represents molecular dissection of anti-inflammatory signaling. As the C-terminal tripeptide of alpha-melanocyte stimulating hormone, KPV retains the parent molecule\'s remarkable anti-inflammatory properties while eliminating melanocortin receptor-mediated effects like pigmentation. This separation of functions makes KPV uniquely valuable: it modulates inflammatory gene transcription through NF-κB pathway inhibition and reduces pro-inflammatory cytokine production without the broader melanocortin system effects.</p><p>Research has demonstrated KPV\'s effectiveness in inflammatory bowel disease models, dermal inflammation studies, and wound healing research where inflammation must be controlled without suppressing the entire immune response. Its ability to penetrate epithelial barriers and concentrate in inflamed tissues makes it particularly relevant for mucosal inflammation research.</p>',
    researchApplications: ['NF-κB signaling inhibition', 'Inflammatory cytokine modulation', 'Inflammatory bowel disease models', 'Mucosal immunity research', 'Wound healing inflammation control', 'Melanocortin peptide fragment studies'],
    storage: 'Store lyophilized at -20°C. Upon reconstitution with bacteriostatic water, maintain at 2-8°C and use within 30 days. This small peptide demonstrates excellent stability in solution.'
  },
  { 
    slug: 'ghk-cu', 
    name: 'GHK-Cu', 
    price: 31, 
    cat: 'tissue', 
    qty: '100mg', 
    cas: '49557-75-7', 
    mw: '404.0 g/mol', 
    formula: 'C<sub>14</sub>H<sub>24</sub>N<sub>6</sub>O<sub>4</sub>·Cu',
    seoTitle: 'GHK-Cu 100mg | ≥98% Pure | Copper-Binding Tripeptide | PRC Peptides',
    metaDesc: 'GHK-Cu 100mg copper peptide for collagen research. ≥98% purity, third-party tested, metalloproteinase modulator. COA available.',
    shortDesc: 'The archetypal copper-peptide complex—a naturally occurring tripeptide that chelates Cu²⁺ to modulate metalloproteinases, collagen synthesis, and tissue remodeling.',
    fullDescription: '<p>Glycyl-L-Histidyl-L-Lysine bound to copper represents one of nature\'s elegant metal-mediated signaling systems. First isolated from human plasma in the 1970s by Dr. Loren Pickart, GHK-Cu demonstrates the biological importance of copper-peptide coordination chemistry. The copper ion, precisely positioned by the peptide\'s histidine and terminal amine, activates the complex\'s biological functions: stimulating collagen and glycosaminoglycan synthesis, modulating metalloproteinase activity for balanced extracellular matrix remodeling, and providing localized antioxidant effects.</p><p>GHK-Cu\'s plasma concentration declines with age, correlating with diminished tissue repair capacity—a relationship that has driven extensive research into its role in wound healing, dermal remodeling, and tissue regeneration. The peptide\'s ability to simultaneously promote matrix synthesis and regulate degradation makes it irreplaceable in studies of balanced tissue remodeling.</p>',
    researchApplications: ['Collagen synthesis mechanisms', 'Metalloproteinase regulation', 'Copper-dependent enzyme research', 'Extracellular matrix remodeling', 'Wound healing biology', 'Antioxidant copper chemistry', 'Tissue regeneration models'],
    storage: 'Store lyophilized at -20°C protected from light (copper complexes are photosensitive). Reconstitute with sterile water; the copper complex remains stable at 2-8°C for 30 days. Avoid oxidizing agents.'
  },
  { 
    slug: 'll-37', 
    name: 'LL-37', 
    price: 29, 
    cat: 'tissue', 
    qty: '5mg', 
    cas: '154947-66-7', 
    mw: '4493.3 g/mol', 
    formula: 'C<sub>205</sub>H<sub>340</sub>N<sub>60</sub>O<sub>53</sub>',
    seoTitle: 'LL-37 5mg | ≥98% Pure | Human Cathelicidin Peptide | PRC Peptides',
    metaDesc: 'LL-37 5mg antimicrobial peptide for innate immunity research. ≥98% purity, third-party tested, human cathelicidin. COA available.',
    shortDesc: 'The sole human cathelicidin—a 37-amino acid amphipathic peptide representing the first line of innate immune defense against pathogens.',
    fullDescription: '<p>LL-37 occupies a unique position in human immunology: it is the only antimicrobial peptide produced by the human cathelicidin family, unlike other species that express multiple cathelicidin variants. Cleaved from the C-terminus of the hCAP18 precursor protein, this amphipathic alpha-helical peptide demonstrates broad-spectrum antimicrobial activity against bacteria, fungi, and enveloped viruses through membrane disruption. Beyond direct antimicrobial action, LL-37 exhibits immunomodulatory functions—recruiting immune cells, modulating inflammatory responses, and promoting wound closure.</p><p>Expression of LL-37 is induced by vitamin D, linking nutritional status to innate immune capacity—a relationship that has made this peptide central to research on vitamin D-dependent immunity. Its multi-functional profile (antimicrobial, chemotactic, angiogenic, and wound-healing) makes LL-37 essential for studying the complex roles of antimicrobial peptides beyond simple pathogen killing.</p>',
    researchApplications: ['Antimicrobial mechanism studies', 'Innate immunity research', 'Membrane disruption models', 'Biofilm penetration research', 'Immune cell chemotaxis', 'Wound healing immunity', 'Vitamin D-dependent peptide regulation'],
    storage: 'Store lyophilized at -20°C. Upon reconstitution, maintain at 2-8°C and use within 30 days. The amphipathic structure requires gentle handling to prevent aggregation at higher concentrations.'
  },
  { 
    slug: 'thymalin', 
    name: 'Thymalin', 
    price: 37, 
    cat: 'tissue', 
    qty: '10mg', 
    cas: 'Thymic extract', 
    mw: 'Peptide mixture', 
    formula: 'Short peptides',
    seoTitle: 'Thymalin 10mg | ≥98% Pure | Thymic Peptide Complex | PRC Peptides',
    metaDesc: 'Thymalin 10mg thymic bioregulator for immune research. ≥98% purity, third-party tested, T-cell modulation studies. COA available.',
    shortDesc: 'A pharmaceutical-grade thymic extract representing the bioregulator class—short peptides that modulate organ-specific cellular function through epigenetic mechanisms.',
    fullDescription: '<p>Thymalin belongs to a unique category of biological compounds developed in the Soviet Union: bioregulators—short peptides (typically 2-4 amino acids) extracted from specific organs that demonstrate tissue-specific regulatory effects. Isolated from thymus tissue, Thymalin contains peptides that appear to modulate T-cell differentiation and thymic function through mechanisms still being elucidated, possibly involving chromatin remodeling and gene expression regulation.</p><p>The bioregulator hypothesis suggests these short peptides bind to DNA regulatory regions, influencing cell differentiation and function in their tissue of origin. While mechanistic details continue to emerge, decades of research in Russia and Eastern Europe have characterized Thymalin\'s effects on immune function, T-cell populations, and adaptive immunity—making it valuable for thymic biology research and immunosenescence studies.</p>',
    researchApplications: ['T-cell differentiation studies', 'Thymic function research', 'Bioregulator peptide mechanisms', 'Immune system modulation', 'Immunosenescence models', 'Adaptive immunity research', 'Peptide-DNA interaction studies'],
    storage: 'Store lyophilized at -20°C protected from moisture. Reconstitute with sterile or bacteriostatic water; maintain at 2-8°C and use within 30 days. As a biological extract, handle with standard peptide precautions.'
  },
  { 
    slug: 'laennec', 
    name: 'Laennec', 
    price: 425, 
    cat: 'tissue', 
    qty: '10 ampules', 
    cas: 'Placental extract', 
    mw: 'Multi-factor complex', 
    formula: '>50 growth factors',
    form: 'Ampules',
    seoTitle: 'Laennec Ampules | Pharmaceutical Grade | Human Placental Extract | PRC Peptides',
    metaDesc: 'Laennec pharmaceutical-grade placental extract for regenerative research. Multi-growth factor complex, Japanese manufacture. COA available.',
    shortDesc: 'A pharmaceutical-grade human placental hydrolysate containing over 50 identified growth factors—the most complex multi-factor biological preparation available for regenerative research.',
    fullDescription: '<p>Laennec represents the biological complexity that single-molecule research cannot capture. This pharmaceutical-grade extract, derived from healthy human placenta and manufactured under strict Japanese pharmaceutical standards, contains a remarkably diverse array of bioactive molecules: multiple growth factor families (FGF, EGF, VEGF, HGF), cytokines, amino acids, vitamins, and minerals that collectively drive tissue regeneration. The placenta—nature\'s most rapidly growing temporary organ—concentrates factors that promote cell proliferation, angiogenesis, and tissue remodeling.</p><p>Unlike recombinant single-factor preparations, Laennec provides the factor combinations and ratios that occur naturally during development and healing. Researchers studying complex tissue regeneration, investigating growth factor synergies, or modeling multi-factor biological environments find this extract invaluable for capturing biological complexity that simplified systems miss.</p>',
    researchApplications: ['Multi-growth factor signaling', 'Tissue regeneration models', 'Cytokine interaction studies', 'Complex biological system research', 'Angiogenesis with multiple factors', 'Cellular metabolism in growth factor-rich environments'],
    storage: 'Store refrigerated at 2-8°C in sealed ampules. Do not freeze—freezing damages the biological factor profile. Protect from direct light. Use immediately upon opening; no preservatives present. Stable 24 months unopened under proper refrigeration.'
  },
  
  // GROWTH HORMONE
  { 
    slug: 'sermorelin', 
    name: 'Sermorelin', 
    price: 38, 
    cat: 'gh', 
    qty: '5mg', 
    cas: '86168-78-7', 
    mw: '3357.9 g/mol', 
    formula: 'C<sub>149</sub>H<sub>246</sub>N<sub>44</sub>O<sub>42</sub>S',
    seoTitle: 'Sermorelin 5mg | ≥98% Pure | GHRH(1-29) Fragment | PRC Peptides',
    metaDesc: 'Sermorelin 5mg GHRH analogue for growth hormone research. ≥98% purity, third-party tested, bioactive GHRH fragment. COA available.',
    shortDesc: 'The truncated yet fully bioactive fragment of human GHRH—a 29-amino acid sequence that retains complete growth hormone releasing activity.',
    fullDescription: '<p>Sermorelin represents elegant peptide design: by identifying the minimal bioactive sequence within full-length GHRH(1-44), researchers created a compound with identical receptor activity but enhanced stability and reduced immunogenicity. This 29-amino acid fragment contains the entire receptor-binding domain, making it indispensable for studying GHRH receptor pharmacology without the complications of the full 44-residue hormone.</p><p>The peptide binds selectively to GHRH receptors on pituitary somatotrophs, triggering endogenous growth hormone release through natural pulsatile mechanisms. Unlike exogenous growth hormone administration, sermorelin preserves the physiological feedback loops governing GH secretion, making it the preferred tool for studying growth hormone axis regulation, pituitary function, and the upstream control of IGF-1 production.</p>',
    researchApplications: ['GHRH receptor binding studies', 'Pituitary somatotroph function', 'Growth hormone secretion dynamics', 'Pulsatile GH release mechanisms', 'IGF-1 pathway research', 'Growth hormone axis physiology'],
    storage: 'Store lyophilized at -20°C protected from light. Reconstitute with bacteriostatic water; maintain at 2-8°C and use within 30 days. The truncated structure provides improved stability versus full-length GHRH.'
  },
  { 
    slug: 'ipamorelin', 
    name: 'Ipamorelin', 
    price: 21, 
    cat: 'gh', 
    qty: '5mg', 
    cas: '170851-70-4', 
    mw: '711.9 g/mol', 
    formula: 'C<sub>38</sub>H<sub>49</sub>N<sub>9</sub>O<sub>5</sub>',
    seoTitle: 'Ipamorelin 5mg | ≥98% Pure | Selective Ghrelin Receptor Agonist | PRC Peptides',
    metaDesc: 'Ipamorelin 5mg selective growth hormone secretagogue. ≥98% purity, third-party tested, GH-specific without prolactin elevation. COA available.',
    shortDesc: 'The most selective growth hormone secretagogue available—a pentapeptide with exceptional specificity for GH release without prolactin or cortisol elevation.',
    fullDescription: '<p>Ipamorelin solved a critical problem in growth hormone secretagogue research: earlier ghrelin mimetics like GHRP-6 and GHRP-2 stimulated GH release but also elevated prolactin and cortisol through off-target receptor activation. Novo Nordisk\'s Ipamorelin, a carefully designed pentapeptide, demonstrates near-exclusive selectivity for the ghrelin receptor (GHS-R1a) on somatotrophs, triggering GH secretion without the hormonal side effects that confound experimental interpretation.</p><p>This selectivity makes ipamorelin the gold standard for dissecting ghrelin receptor pharmacology and GH secretion mechanisms. Researchers studying the distinction between GHRH-mediated and ghrelin-mediated GH release, or investigating selective GH secretagogue approaches, find this peptide essential for clean, interpretable results.</p>',
    researchApplications: ['Ghrelin receptor (GHS-R1a) pharmacology', 'Selective GH secretion mechanisms', 'Growth hormone pulse dynamics', 'Somatotroph receptor selectivity', 'GHRP comparative studies', 'Non-GHRH secretagogue pathways'],
    storage: 'Store lyophilized at -20°C. Upon reconstitution with bacteriostatic water, refrigerate at 2-8°C and utilize within 30 days. Ipamorelin demonstrates excellent stability in solution compared to earlier secretagogues.'
  },
  { 
    slug: 'cjc-1295', 
    name: 'CJC-1295 (no DAC)', 
    price: 42, 
    cat: 'gh', 
    qty: '5mg', 
    cas: '863288-34-0', 
    mw: '3647.2 g/mol', 
    formula: 'C<sub>165</sub>H<sub>269</sub>N<sub>47</sub>O<sub>46</sub>',
    seoTitle: 'CJC-1295 no DAC 5mg | ≥98% Pure | Modified GRF(1-29) | PRC Peptides',
    metaDesc: 'CJC-1295 no DAC 5mg GHRH analogue for pulsatile GH research. ≥98% purity, third-party tested, enhanced stability without DAC. COA available.',
    shortDesc: 'A strategically modified GHRH analogue with enhanced proteolytic resistance—offering the benefits of extended stability without the prolonged binding of DAC-conjugated versions.',
    fullDescription: '<p>CJC-1295 without Drug Affinity Complex (commonly called Modified GRF 1-29 or Mod GRF) represents refined GHRH analogue design. Through targeted amino acid substitutions at positions vulnerable to enzymatic cleavage, researchers created a peptide significantly more stable than natural GHRH yet without the week-long half-life of DAC-conjugated CJC-1295. This intermediate stability profile proves ideal for studying pulsatile GH release—the natural physiological pattern that continuous GHRH exposure would obscure.</p><p>The compound binds GHRH receptors with high affinity while resisting degradation by plasma peptidases, enabling multi-hour experimental windows without the supraphysiological, sustained activation that DAC conjugation creates. Researchers investigating natural GH pulse architecture, GHRH receptor desensitization, or physiological GH secretion patterns prefer this version for its balance of stability and pulsatility.</p>',
    researchApplications: ['GHRH analogue pharmacology', 'Pulsatile GH release patterns', 'GHRH receptor binding kinetics', 'Peptide stability mechanisms', 'Growth hormone secretion dynamics', 'Somatotroph physiology'],
    storage: 'Store lyophilized at -20°C protected from light and moisture. Reconstitute with bacteriostatic water; stable at 2-8°C for 30 days. The structural modifications provide significant proteolytic resistance.'
  },
  { 
    slug: 'cjc-ipamorelin', 
    name: 'CJC-1295/Ipamorelin', 
    price: 42, 
    cat: 'gh', 
    qty: '5mg/5mg', 
    cas: 'Combination', 
    mw: 'Dual compound', 
    formula: 'Combined formulation',
    seoTitle: 'CJC-1295/Ipamorelin 5mg/5mg | ≥98% Pure | Dual GH Pathway Blend | PRC Peptides',
    metaDesc: 'CJC-1295/Ipamorelin combination for synergistic GH research. ≥98% purity, third-party tested, dual GHRH/ghrelin pathway. COA available.',
    shortDesc: 'A precision-balanced combination targeting both GHRH and ghrelin pathways—enabling investigation of synergistic GH secretion mechanisms that single agents cannot reveal.',
    fullDescription: '<p>Growth hormone release is governed by two parallel pathways: GHRH signaling through pituitary GHRH receptors, and ghrelin acting via GHS-R1a receptors. This combination recognizes that dual-pathway activation produces supra-additive effects—the GH pulse amplitude from combined GHRH/ghrelin agonism exceeds the sum of individual stimulation. The mechanism involves distinct intracellular signaling cascades that converge on GH granule release, with ghrelin potentially amplifying GHRH\'s effects through calcium mobilization.</p><p>Researchers studying GH secretion physiology, investigating secretagogue synergy, or modeling maximal endogenous GH release find this pre-optimized ratio invaluable. The combination eliminates dosing variables, ensuring consistent GHRH:ghrelin pathway stimulation across experiments—a critical factor in reproducible GH research.</p>',
    researchApplications: ['Dual-pathway GH secretagogue studies', 'GHRH/ghrelin synergy mechanisms', 'Amplified GH pulse research', 'Combined secretagogue pharmacodynamics', 'Maximal endogenous GH release models'],
    storage: 'Store lyophilized at -20°C in sealed dual-chamber vial. Reconstitute both components simultaneously; maintain at 2-8°C and use within 30 days. Both peptides exhibit excellent co-stability in solution.'
  },
  { 
    slug: 'hgh-fragment-191', 
    name: 'HGH Fragment 191', 
    price: 28, 
    cat: 'gh', 
    qty: '5mg', 
    cas: '12629-01-5', 
    mw: '22124 g/mol', 
    formula: 'C<sub>990</sub>H<sub>1528</sub>N<sub>262</sub>O<sub>300</sub>S<sub>7</sub>',
    seoTitle: 'HGH 191 1500iu | ≥98% Pure | Recombinant Human Somatotropin | PRC Peptides',
    metaDesc: 'HGH 191 recombinant human growth hormone for receptor research. ≥98% purity, third-party tested, bioidentical 191-AA somatotropin. COA available.',
    shortDesc: 'Bioidentical 191-amino acid human growth hormone produced via recombinant DNA technology—the reference standard for GH receptor research.',
    fullDescription: '<p>This represents human somatotropin in its native form: 191 amino acids in the precise sequence and tertiary structure found in pituitary-derived growth hormone. Produced through recombinant DNA technology in E. coli expression systems, this rHGH is structurally indistinguishable from endogenous GH, making it the unambiguous choice for studying growth hormone receptor binding, GH-mediated signal transduction, and the direct effects of somatotropin on target tissues.</p><p>Where secretagogues provide indirect GH elevation through endogenous release, direct GH administration enables precise dose-response studies, receptor saturation experiments, and investigation of GH signaling independent of pituitary function. With over four decades of research characterizing GH\'s effects on IGF-1 production, lipolysis, protein synthesis, and tissue remodeling, this molecule remains central to endocrine and metabolic research.</p>',
    researchApplications: ['GH receptor binding and signaling', 'IGF-1 pathway research', 'Somatotropin receptor pharmacology', 'Anabolic signaling mechanisms', 'Direct GH effects vs. secretagogue comparison', 'Protein synthesis research'],
    storage: 'Store lyophilized at -20°C protected from light. Upon reconstitution with bacteriostatic water, maintain at 2-8°C and use within 14 days—shorter than peptide secretagogues due to protein aggregation susceptibility. Avoid agitation; gently swirl to dissolve.'
  },
  
  // METABOLIC
  { 
    slug: 'aod-9604', 
    name: 'AOD-9604', 
    price: 20, 
    cat: 'metabolic', 
    qty: '2mg', 
    cas: '221231-10-3', 
    mw: '1815.1 g/mol', 
    formula: 'C<sub>78</sub>H<sub>123</sub>N<sub>23</sub>O<sub>23</sub>S<sub>2</sub>',
    seoTitle: 'AOD-9604 2mg | ≥98% Pure | Lipolytic HGH Fragment | PRC Peptides',
    metaDesc: 'AOD-9604 2mg modified GH fragment for lipolysis research. ≥98% purity, third-party tested, fat mobilization without GH receptor activation. COA available.',
    shortDesc: 'A strategically modified fragment of growth hormone\'s C-terminus—retaining lipolytic activity while eliminating GH receptor activation and IGF-1 elevation.',
    fullDescription: '<p>AOD-9604 (Advanced Obesity Drug) represents molecular surgery on growth hormone. Australian researchers at Monash University identified the 176-191 C-terminal region as responsible for GH\'s lipolytic effects, then added stabilizing modifications to create a fragment that stimulates lipolysis without growth hormone receptor binding. The result: a peptide that mimics GH\'s fat-mobilizing properties while completely avoiding effects on growth, glucose metabolism, or IGF-1—a clean separation impossible with full-length GH.</p><p>This selective action makes AOD-9604 invaluable for dissecting GH\'s metabolic effects. Researchers can investigate lipolytic signaling mechanisms, study adipocyte beta-oxidation, and explore growth hormone\'s metabolic functions without the confounding variables of receptor-mediated GH actions. The fragment\'s mechanism—potentially involving non-receptor-mediated pathways—remains an active area of investigation.</p>',
    researchApplications: ['Lipolysis mechanism research', 'GH fragment biology', 'Lipid metabolism studies', 'Adipocyte signaling independent of GH receptor', 'Selective metabolic pathway activation', 'Non-receptor GH effects'],
    storage: 'Store lyophilized at -20°C. Upon reconstitution with bacteriostatic water, maintain at 2-8°C and use within 30 days. The modifications provide enhanced stability compared to unmodified HGH fragments.'
  },
  { 
    slug: 'mots-c', 
    name: 'MOTS-c', 
    price: 28, 
    cat: 'metabolic', 
    qty: '10mg', 
    cas: '1627580-64-6', 
    mw: '2174.6 g/mol', 
    formula: 'C<sub>101</sub>H<sub>152</sub>N<sub>28</sub>O<sub>22</sub>S<sub>2</sub>',
    seoTitle: 'MOTS-c 10mg | ≥98% Pure | Mitochondrial Genome-Encoded Peptide | PRC Peptides',
    metaDesc: 'MOTS-c 10mg mitochondrial-derived peptide for metabolic research. ≥98% purity, third-party tested, AMPK activator. COA available.',
    shortDesc: 'The first identified mitochondrial open reading frame-encoded peptide—a 16-amino acid sequence that translocates to the nucleus to regulate metabolism.',
    fullDescription: '<p>MOTS-c represents a paradigm shift in cellular biology. Discovered in 2015 by researchers at USC, this peptide revealed that the mitochondrial genome—long thought to encode only 13 proteins—contains open reading frames for signaling peptides that regulate nuclear gene expression. MOTS-c, encoded within the mitochondrial 12S rRNA gene, acts as a mitochondrial-to-nuclear messenger: during metabolic stress, it translocates to the nucleus and binds DNA regulatory regions, modulating expression of genes involved in glucose metabolism and insulin sensitivity.</p><p>This mitochondrial-nuclear communication pathway challenges traditional views of metabolic regulation. MOTS-c activates AMPK, enhances glucose uptake, and improves metabolic flexibility—effects that position it at the intersection of aging research, metabolic disease modeling, and the study of retrograde signaling from mitochondria to nucleus.</p>',
    researchApplications: ['Mitochondrial-nuclear signaling', 'Metabolic homeostasis mechanisms', 'AMPK pathway research', 'Insulin sensitivity studies', 'Mitochondrial genome function', 'Retrograde signaling research', 'Exercise mimetic studies'],
    storage: 'Store lyophilized at -20°C protected from moisture. Reconstitute with bacteriostatic water; stable at 2-8°C for 30 days. Handle as a standard peptide despite its mitochondrial origin.'
  },
  { 
    slug: '5-amino-1mq', 
    name: '5-Amino-1MQ', 
    price: 25, 
    cat: 'metabolic', 
    qty: '5mg', 
    cas: '42464-96-0', 
    mw: '159.2 g/mol', 
    formula: 'C<sub>10</sub>H<sub>11</sub>N<sub>2</sub><sup>+</sup>', 
    form: 'Oral Capsule',
    seoTitle: '5-Amino-1MQ 5mg | ≥98% Pure | NNMT Enzyme Inhibitor | PRC Peptides',
    metaDesc: '5-Amino-1MQ 5mg NNMT inhibitor for NAD+ research. ≥98% purity, third-party tested, oral small molecule. COA available.',
    shortDesc: 'A selective small molecule inhibitor of nicotinamide N-methyltransferase—increasing cellular NAD+ availability through enzymatic blockade of the methylation pathway.',
    fullDescription: '<p>5-Amino-1-methylquinolinium targets a metabolic bottleneck: nicotinamide N-methyltransferase (NNMT), an enzyme that consumes NAD+ precursors by methylating nicotinamide for excretion. By inhibiting NNMT, 5-Amino-1MQ preserves intracellular nicotinamide, allowing its recycling back to NAD+ through the salvage pathway. This mechanism provides an alternative approach to NAD+ augmentation—rather than supplying more precursor, block the pathway that depletes it.</p><p>NNMT overexpression correlates with metabolic dysfunction and adiposity in preclinical models, suggesting this enzyme represents a metabolic control point. Research with 5-Amino-1MQ explores NNMT\'s role in NAD+ homeostasis, methylation reactions, energy metabolism, and the enzyme\'s potential as a metabolic regulatory target. Note: This is an oral small molecule, not an injectable peptide.</p>',
    researchApplications: [],  // Not an injectable, no research applications
    storage: 'Store at room temperature (15-30°C) in sealed container protected from moisture. This small molecule exhibits excellent stability. For research use, dissolve in appropriate vehicle according to experimental protocol.'
  },
  { 
    slug: 'lipo-c-max', 
    name: 'Lipo-C MAX Blend', 
    price: 42, 
    cat: 'metabolic', 
    qty: '10ml', 
    cas: 'Lipotropic blend', 
    mw: 'Multi-component', 
    formula: 'MIC + L-Carnitine',
    seoTitle: 'Lipo-C MAX Blend | ≥98% Pure | MIC Lipotropic Complex | PRC Peptides',
    metaDesc: 'Lipo-C MAX lipotropic blend for metabolic research. ≥98% purity per component, third-party tested, MIC+L-Carnitine. COA available.',
    shortDesc: 'A precision-formulated lipotropic blend combining methionine, inositol, choline, and L-carnitine—the foundational "MIC" factors that support hepatic lipid metabolism research.',
    fullDescription: '<p>The Lipo-C MAX formulation recognizes that lipid metabolism requires multiple cofactors working in concert. Methionine provides the methyl groups essential for phosphatidylcholine synthesis and methylation reactions. Inositol participates in lipid messenger signaling and cell membrane formation. Choline serves as a precursor for phosphatidylcholine and prevents hepatic lipid accumulation. L-carnitine shuttles long-chain fatty acids into mitochondria for beta-oxidation. Together, these lipotropic factors create the biochemical environment for efficient hepatic lipid processing.</p><p>Researchers studying hepatic steatosis models, investigating lipotropic factor deficiencies, or exploring the interplay between methylation and lipid metabolism find this standardized combination valuable for consistent multi-factor supplementation. The blend enables study of synergistic lipotropic mechanisms that isolated factor research cannot reveal.</p>',
    researchApplications: ['Lipotropic factor research', 'Hepatic lipid metabolism', 'Methyl donor biology', 'Choline metabolism', 'Mitochondrial fatty acid transport', 'One-carbon metabolism', 'Phospholipid synthesis studies'],
    storage: 'Store lyophilized at -20°C. Upon reconstitution, maintain at 2-8°C and use within 30 days. All components remain stable when combined in solution.'
  },
  { 
    slug: 'l-carnitine', 
    name: 'L-Carnitine', 
    price: 26, 
    cat: 'metabolic', 
    qty: '600mg', 
    cas: '541-15-1', 
    mw: '161.2 g/mol', 
    formula: 'C<sub>7</sub>H<sub>15</sub>NO<sub>3</sub>',
    seoTitle: 'L-Carnitine 600mg | ≥98% Pure | Mitochondrial Transport Cofactor | PRC Peptides',
    metaDesc: 'L-Carnitine 600mg for fatty acid transport research. ≥98% purity, third-party tested, mitochondrial shuttle system cofactor. COA available.',
    shortDesc: 'The essential cofactor for mitochondrial fatty acid oxidation—a quaternary ammonium compound that shuttles long-chain fatty acids across the impermeable inner mitochondrial membrane.',
    fullDescription: '<p>L-Carnitine (β-hydroxy-γ-trimethylaminobutyric acid) solves a fundamental problem in cellular energetics: long-chain fatty acids cannot cross the inner mitochondrial membrane where beta-oxidation occurs. Carnitine serves as the shuttle—the carnitine palmitoyltransferase (CPT) system conjugates fatty acids to carnitine, transports them across the membrane, then releases them inside the mitochondrial matrix. Without adequate carnitine, long-chain fatty acids cannot be oxidized for energy, regardless of other metabolic factors.</p><p>This bottleneck role makes L-carnitine fundamental to metabolic research. Studies of mitochondrial fatty acid oxidation, investigation of the carnitine shuttle mechanism, research into acyl-carnitine species as metabolic biomarkers, and exploration of carnitine\'s role in various metabolic states all require this essential cofactor.</p>',
    researchApplications: ['Mitochondrial fatty acid transport', 'Beta-oxidation mechanisms', 'Carnitine shuttle system research', 'Acyl-carnitine metabolism', 'Energy substrate utilization', 'Mitochondrial function studies', 'Carnitine deficiency models'],
    storage: 'Store lyophilized at -20°C. Upon reconstitution with bacteriostatic water or sterile water, refrigerate at 2-8°C and use within 30 days. L-Carnitine demonstrates excellent solution stability.'
  },
  { 
    slug: 'lipo-c-plus', 
    name: 'Lipo-C Plus', 
    price: 42, 
    cat: 'metabolic', 
    qty: '10ml', 
    cas: 'Enhanced blend', 
    mw: 'Multi-component', 
    formula: 'MIC + Amino acids',
    seoTitle: 'Lipo-C Plus Blend | ≥98% Pure | Enhanced Metabolic Complex | PRC Peptides',
    metaDesc: 'Lipo-C Plus enhanced lipotropic blend for metabolic research. ≥98% purity per component, third-party tested, MIC+amino acids. COA available.',
    shortDesc: 'An advanced metabolic research formulation extending beyond basic lipotropic factors—incorporating amino acids and cofactors for comprehensive cellular energy metabolism studies.',
    fullDescription: '<p>Building upon the foundation of methionine, inositol, choline, and L-carnitine, the Lipo-C Plus formulation adds complementary factors that participate in energy production, mitochondrial function, and metabolic performance. This enhanced blend recognizes that optimal cellular metabolism requires not just lipid processing factors, but also amino acids for protein synthesis, cofactors for enzymatic reactions, and compounds that support mitochondrial efficiency.</p><p>The formulation enables researchers to investigate integrated metabolic responses—how lipotropic factors, amino acids, and energy cofactors interact to influence overall cellular bioenergetics. Studies of performance metabolism, research into multi-pathway metabolic optimization, and investigation of synergistic cofactor effects benefit from this comprehensive approach.</p>',
    researchApplications: ['Integrated metabolic pathway research', 'Cellular bioenergetics', 'Multi-cofactor synergy', 'Performance metabolism models', 'Energy production mechanisms', 'Comprehensive metabolic support systems'],
    storage: 'Store lyophilized at -20°C protected from moisture. Upon reconstitution, maintain at 2-8°C and use within 30 days. All components demonstrate co-stability in solution.'
  },
  { 
    slug: 'lipo-c-ultra', 
    name: 'Lipo-C Ultra Blend', 
    price: 42, 
    cat: 'metabolic', 
    qty: '10ml', 
    cas: 'Premium blend', 
    mw: 'Multi-component', 
    formula: 'Complete metabolic',
    seoTitle: 'Lipo-C Ultra Blend | ≥98% Pure | Comprehensive Metabolic Complex | PRC Peptides',
    metaDesc: 'Lipo-C Ultra premium metabolic blend for comprehensive research. ≥98% purity per component, third-party tested, full metabolic support. COA available.',
    shortDesc: 'The most comprehensive metabolic research formulation available—a premium blend combining lipotropic factors, amino acids, performance compounds, and mitochondrial cofactors for complete metabolic pathway coverage.',
    fullDescription: '<p>Lipo-C Ultra represents the apex of multi-component metabolic formulation. This premium blend incorporates every category of metabolic support compound: classic lipotropic factors for hepatic lipid processing, amino acids for protein synthesis and neurotransmitter production, mitochondrial cofactors for energy production, and performance-enhancing compounds for cellular optimization. The result: a research tool that enables investigation of fully-supported metabolic systems rather than isolated pathways.</p><p>Researchers exploring maximal metabolic capacity, investigating how multiple metabolic pathways integrate under optimal conditions, or studying comprehensive metabolic interventions find this formulation essential. The blend eliminates the limitation of single-factor studies, revealing system-level metabolic responses that emerge only when all necessary cofactors and substrates are available.</p>',
    researchApplications: ['Comprehensive metabolic system research', 'Multi-pathway integration studies', 'Maximal metabolic capacity models', 'System-level bioenergetics', 'Performance optimization research', 'Complex metabolic phenotyping'],
    storage: 'Store lyophilized at -20°C in sealed container with desiccant. Upon reconstitution, maintain at 2-8°C and use within 30 days. Despite complexity, all components maintain stability in combined solution.'
  },
  
  // ANTIOXIDANTS
  { 
    slug: 'nad-1000mg', 
    name: 'NAD+ 1000mg', 
    price: 30, 
    cat: 'antioxidants', 
    qty: '1000mg', 
    cas: '53-84-9', 
    mw: '663.4 g/mol', 
    formula: 'C<sub>21</sub>H<sub>27</sub>N<sub>7</sub>O<sub>14</sub>P<sub>2</sub>',
    seoTitle: 'NAD+ 1000mg | ≥98% Pure | High-Dose NAD+ Cofactor | PRC Peptides',
    metaDesc: 'NAD+ 1000mg cellular cofactor for metabolic research. ≥98% purity, third-party tested, essential redox cofactor for 500+ enzymes. COA available.',
    shortDesc: 'The central redox cofactor in all living cells—a pyridine nucleotide essential for over 500 enzymatic reactions governing energy metabolism, DNA repair, and cellular signaling.',
    fullDescription: '<p>Nicotinamide adenine dinucleotide occupies a position of unparalleled importance in cellular biochemistry. This dinucleotide serves simultaneously as an electron carrier in redox reactions (the NAD+/NADH couple drives glycolysis, the TCA cycle, and oxidative phosphorylation), a substrate for sirtuins (deacetylases that regulate metabolism and longevity pathways), a substrate for PARPs (DNA repair enzymes), and a precursor for calcium signaling molecules. Without adequate NAD+, cellular energy production, gene expression regulation, and DNA maintenance all collapse.</p><p>NAD+ levels decline with age across tissues, correlating with metabolic dysfunction and cellular senescence—a relationship that has positioned NAD+ at the center of aging research. Studies investigating sirtuins, researching cellular energy metabolism, exploring DNA repair mechanisms, or modeling age-related NAD+ decline require direct NAD+ administration or measurement.</p>',
    researchApplications: ['Redox biochemistry', 'Sirtuin activation research', 'Cellular energy metabolism', 'PARP enzyme function', 'Mitochondrial studies', 'NAD+/NADH ratio measurement', 'Cellular aging mechanisms', 'DNA repair pathways'],
    storage: 'Store lyophilized at -20°C protected from light (NAD+ is photosensitive). Upon reconstitution with sterile water, use immediately or store at 2-8°C for up to 30 days. Avoid repeated freeze-thaw cycles which degrade the dinucleotide.'
  },
  { 
    slug: 'nad-500mg', 
    name: 'NAD+ 500mg', 
    price: 30, 
    cat: 'antioxidants', 
    qty: '500mg', 
    cas: '53-84-9', 
    mw: '663.4 g/mol', 
    formula: 'C<sub>21</sub>H<sub>27</sub>N<sub>7</sub>O<sub>14</sub>P<sub>2</sub>',
    seoTitle: 'NAD+ 500mg | ≥98% Pure | Nicotinamide Adenine Dinucleotide | PRC Peptides',
    metaDesc: 'NAD+ 500mg essential cellular cofactor for energy research. ≥98% purity, third-party tested, central metabolic coenzyme. COA available.',
    shortDesc: 'The central redox cofactor in all living cells—a pyridine nucleotide essential for over 500 enzymatic reactions governing energy metabolism, DNA repair, and cellular signaling.',
    fullDescription: '<p>Nicotinamide adenine dinucleotide occupies a position of unparalleled importance in cellular biochemistry. This dinucleotide serves simultaneously as an electron carrier in redox reactions (the NAD+/NADH couple drives glycolysis, the TCA cycle, and oxidative phosphorylation), a substrate for sirtuins (deacetylases that regulate metabolism and longevity pathways), a substrate for PARPs (DNA repair enzymes), and a precursor for calcium signaling molecules. Without adequate NAD+, cellular energy production, gene expression regulation, and DNA maintenance all collapse.</p><p>NAD+ levels decline with age across tissues, correlating with metabolic dysfunction and cellular senescence—a relationship that has positioned NAD+ at the center of aging research. Studies investigating sirtuins, researching cellular energy metabolism, exploring DNA repair mechanisms, or modeling age-related NAD+ decline require direct NAD+ administration or measurement.</p>',
    researchApplications: ['Redox biochemistry', 'Sirtuin activation research', 'Cellular energy metabolism', 'PARP enzyme function', 'Mitochondrial studies', 'NAD+/NADH ratio measurement', 'Cellular aging mechanisms', 'DNA repair pathways'],
    storage: 'Store lyophilized at -20°C protected from light (NAD+ is photosensitive). Upon reconstitution with sterile water, use immediately or store at 2-8°C for up to 30 days. Avoid repeated freeze-thaw cycles which degrade the dinucleotide.'
  },
  { 
    slug: 'glutathione-korean', 
    name: 'Glutathione Korean', 
    price: 85, 
    cat: 'antioxidants', 
    qty: '1200mg x10', 
    cas: '70-18-8', 
    mw: '307.3 g/mol', 
    formula: 'C<sub>10</sub>H<sub>17</sub>N<sub>3</sub>O<sub>6</sub>S',
    form: 'Ampules',
    seoTitle: 'Glutathione 1200mg Korean | Pharmaceutical Grade | Master Antioxidant | PRC Peptides',
    metaDesc: 'Glutathione 1200mg Korean pharmaceutical grade for redox research. Master antioxidant tripeptide, 10 vials, third-party tested. COA available.',
    shortDesc: 'The cell\'s master antioxidant—a thiol-containing tripeptide that serves as the primary reducing agent, maintains redox homeostasis, and detoxifies xenobiotics across all mammalian tissues.',
    fullDescription: '<p>Glutathione (γ-L-glutamyl-L-cysteinyl-glycine) represents the first line of antioxidant defense. This tripeptide, present in millimolar concentrations in cells, functions as the primary reducing agent that neutralizes reactive oxygen species before they damage proteins, lipids, or DNA. The peptide\'s cysteine thiol group (-SH) provides the reducing power—glutathione oscillates between reduced (GSH) and oxidized (GSSG) forms, with the GSH/GSSG ratio serving as a key indicator of cellular redox status.</p><p>Beyond direct antioxidant action, glutathione serves as a cofactor for glutathione peroxidases (which reduce hydrogen peroxide) and glutathione S-transferases (which detoxify electrophilic compounds and xenobiotics). Manufactured in Korea to pharmaceutical standards, this preparation provides research-grade glutathione for oxidative stress studies, redox biology research, and investigation of the glutathione system\'s central role in cellular protection.</p>',
    researchApplications: ['Redox biology', 'Oxidative stress models', 'Glutathione peroxidase studies', 'Cellular detoxification pathways', 'Thiol biochemistry', 'Xenobiotic metabolism', 'GSH/GSSG ratio studies', 'Antioxidant defense mechanisms'],
    storage: 'Store refrigerated at 2-8°C in sealed pharmaceutical vials. After opening, use immediately or maintain at 2-8°C for up to 7 days. This pharmaceutical preparation is formulated for immediate research use.'
  },
  { 
    slug: 'glutathione-1500mg', 
    name: 'Glutathione 1500mg', 
    price: 38, 
    cat: 'antioxidants', 
    qty: '1500mg', 
    cas: '70-18-8', 
    mw: '307.3 g/mol', 
    formula: 'C<sub>10</sub>H<sub>17</sub>N<sub>3</sub>O<sub>6</sub>S',
    seoTitle: 'Glutathione 1500mg | ≥98% Pure | Reduced Glutathione (GSH) | PRC Peptides',
    metaDesc: 'Glutathione 1500mg master antioxidant for cellular research. ≥98% purity, third-party tested, reduced GSH form. COA available.',
    shortDesc: 'The cell\'s master antioxidant—a thiol-containing tripeptide that serves as the primary reducing agent, maintains redox homeostasis, and detoxifies xenobiotics across all mammalian tissues.',
    fullDescription: '<p>Glutathione (γ-L-glutamyl-L-cysteinyl-glycine) represents the first line of antioxidant defense. This tripeptide, present in millimolar concentrations in cells, functions as the primary reducing agent that neutralizes reactive oxygen species before they damage proteins, lipids, or DNA. The peptide\'s cysteine thiol group (-SH) provides the reducing power—glutathione oscillates between reduced (GSH) and oxidized (GSSG) forms, with the GSH/GSSG ratio serving as a key indicator of cellular redox status.</p><p>Beyond direct antioxidant action, glutathione serves as a cofactor for glutathione peroxidases (which reduce hydrogen peroxide) and glutathione S-transferases (which detoxify electrophilic compounds and xenobiotics). This higher-dose preparation enables concentration-dependent studies and research requiring substantial glutathione supplementation in experimental models.</p>',
    researchApplications: ['Redox biology', 'Oxidative stress models', 'Glutathione peroxidase studies', 'Cellular detoxification pathways', 'Thiol biochemistry', 'Xenobiotic metabolism', 'GSH/GSSG ratio studies', 'Antioxidant defense mechanisms'],
    storage: 'Store lyophilized at -20°C protected from light and oxidizing conditions. Upon reconstitution with sterile water, use promptly or store at 2-8°C for up to 30 days. Glutathione oxidizes over time; fresh solutions provide optimal reducing capacity.'
  },
  { 
    slug: 'ss-31', 
    name: 'SS-31', 
    price: 55, 
    cat: 'antioxidants', 
    qty: '10mg', 
    cas: '736992-21-5', 
    mw: '639.8 g/mol', 
    formula: 'C<sub>32</sub>H<sub>49</sub>N<sub>9</sub>O<sub>5</sub>',
    seoTitle: 'SS-31 (Elamipretide) 10mg | ≥98% Pure | Cardiolipin-Targeting Peptide | PRC Peptides',
    metaDesc: 'SS-31 10mg mitochondria-targeting peptide for organelle research. ≥98% purity, third-party tested, cardiolipin-specific. COA available.',
    shortDesc: 'The first peptide to selectively target and protect the inner mitochondrial membrane—an aromatic-cationic tetrapeptide that binds cardiolipin to stabilize cristae structure and reduce ROS production.',
    fullDescription: '<p>SS-31 (Szeto-Schiller peptide 31, D-Arg-Dmt-Lys-Phe-NH2) represents a breakthrough in mitochondria-targeted therapeutics. This cell-permeable tetrapeptide contains alternating cationic and aromatic residues that enable it to penetrate cells and selectively accumulate at the inner mitochondrial membrane, where it binds with high affinity to cardiolipin—the signature phospholipid of mitochondrial membranes. This cardiolipin interaction stabilizes cristae architecture, the elaborately folded inner membrane structures that house the electron transport chain.</p><p>Unlike broad antioxidants, SS-31 concentrates precisely where mitochondrial ROS are generated—at the electron transport chain. By optimizing cristae structure and reducing electron leak, SS-31 decreases reactive oxygen species production at the source while preserving mitochondrial membrane potential and ATP synthesis. This mechanism has made SS-31 invaluable in ischemia-reperfusion research, neurodegenerative disease models, and studies of mitochondrial dysfunction.</p>',
    researchApplications: ['Mitochondrial membrane research', 'Cardiolipin interaction studies', 'Cristae structure biology', 'Mitochondrial ROS modulation', 'Ischemia-reperfusion models', 'Mitochondrial bioenergetics', 'Targeted mitochondrial protection'],
    storage: 'Store lyophilized at -20°C protected from light. Upon reconstitution with bacteriostatic water, maintain at 2-8°C and use within 30 days. The aromatic-cationic structure provides excellent peptide stability.'
  },
  { 
    slug: 'thioctic-acid', 
    name: 'Thioctic Acid', 
    price: 75, 
    cat: 'antioxidants', 
    qty: '25mg/5ml', 
    cas: '1077-28-7', 
    mw: '206.3 g/mol', 
    formula: 'C<sub>8</sub>H<sub>14</sub>O<sub>2</sub>S<sub>2</sub>',
    form: 'Solution',
    seoTitle: 'Alpha-Lipoic Acid 25mg/5ml | ≥98% Pure | Universal Antioxidant | PRC Peptides',
    metaDesc: 'Alpha-lipoic acid 25mg/5ml universal antioxidant for mitochondrial research. ≥98% purity, third-party tested, lipid and water soluble. COA available.',
    shortDesc: 'The only antioxidant that functions in both aqueous and lipid environments—a dithiol cofactor essential for mitochondrial energy metabolism and capable of regenerating other antioxidants.',
    fullDescription: '<p>Alpha-lipoic acid (1,2-dithiolane-3-pentanoic acid) occupies a unique position in antioxidant biology: its amphipathic structure allows it to scavenge reactive species in both water-soluble compartments (cytoplasm) and lipid-rich environments (membranes)—a property no other antioxidant possesses. Beyond direct free radical neutralization, lipoic acid serves as an essential cofactor for mitochondrial α-ketoacid dehydrogenase complexes (pyruvate dehydrogenase, α-ketoglutarate dehydrogenase), linking its antioxidant function directly to energy metabolism.</p><p>The reduced form (dihydrolipoic acid) demonstrates remarkable antioxidant activity, directly scavenging reactive oxygen and nitrogen species while regenerating other antioxidants—reducing oxidized vitamin C, vitamin E, and glutathione back to their active forms. This antioxidant network amplification makes lipoic acid a force multiplier in cellular antioxidant defense.</p>',
    researchApplications: ['Mitochondrial cofactor function', 'Universal antioxidant mechanisms', 'Antioxidant regeneration studies', 'Glucose metabolism research', 'Neuroprotection models', 'Metal chelation research', 'Redox signaling pathways'],
    storage: 'Store refrigerated at 2-8°C protected from light (light-sensitive). Supplied in solution for immediate use. Maintain sealed until use; utilize within 30 days after opening. Protect from oxidizing conditions.'
  },
  { 
    slug: 'vitamin-c-iv', 
    name: 'Vitamin C IV', 
    price: 75, 
    cat: 'antioxidants', 
    qty: '10mg/20ml', 
    cas: '50-81-7', 
    mw: '176.1 g/mol', 
    formula: 'C<sub>6</sub>H<sub>8</sub>O<sub>6</sub>',
    form: 'Solution',
    seoTitle: 'Vitamin C 10mg/20ml | Pharmaceutical Grade | Ascorbic Acid Injectable | PRC Peptides',
    metaDesc: 'Vitamin C 10mg/20ml pharmaceutical injectable for antioxidant research. Water-soluble reducing agent, collagen synthesis cofactor. COA available.',
    shortDesc: 'The essential water-soluble antioxidant and enzymatic cofactor—a powerful reducing agent required for collagen synthesis, neurotransmitter production, and immune cell function.',
    fullDescription: '<p>L-Ascorbic acid (vitamin C) serves multiple critical biochemical roles beyond its well-known antioxidant function. As a cofactor for prolyl and lysyl hydroxylases, ascorbate is absolutely required for collagen triple helix stability—without adequate vitamin C, collagen synthesis fails, manifesting as scurvy. The vitamin also serves as cofactor for dopamine β-hydroxylase (converting dopamine to norepinephrine) and other copper-containing monooxygenases essential for neurotransmitter synthesis.</p><p>As an antioxidant, ascorbate directly reduces reactive oxygen species and serves as the first line of defense in aqueous environments. It functions synergistically with vitamin E by reducing tocopheroxyl radicals back to active tocopherol, linking water-soluble and lipid-soluble antioxidant systems. This pharmaceutical-grade injectable preparation enables precise dosing in controlled research applications.</p>',
    researchApplications: ['Collagen hydroxylation research', 'Ascorbate-dependent enzyme studies', 'Antioxidant mechanism research', 'Iron metabolism', 'Neurotransmitter synthesis pathways', 'Immune cell function studies', 'Vitamin C-dependent biochemistry'],
    storage: 'Store refrigerated at 2-8°C protected from light (photosensitive). Use within 14 days after opening. Ascorbic acid oxidizes in solution over time; fresh preparations provide optimal activity. Do not freeze.'
  },
  
  // NEUROPEPTIDES
  { 
    slug: 'cerebrolysin', 
    name: 'Cerebrolysin', 
    price: 23, 
    cat: 'neuropeptides', 
    qty: '60mg', 
    cas: 'Neuropeptide complex', 
    mw: '<10 kDa peptides', 
    formula: 'Multi-peptide',
    seoTitle: 'Cerebrolysin 60mg | Pharmaceutical Grade | Neurotrophic Peptide Complex | PRC Peptides',
    metaDesc: 'Cerebrolysin 60mg neurotrophic complex for neuroprotection research. Pharmaceutical grade, multi-factor brain-derived peptides. COA available.',
    shortDesc: 'The only commercially available multi-factor neurotrophic complex that mimics endogenous brain-derived growth factors across multiple receptor systems.',
    fullDescription: '<p>Cerebrolysin stands apart in neuroprotection research: where most compounds target a single pathway, this pharmaceutical-grade preparation contains a complex mixture of low-molecular-weight neuropeptides and amino acids derived from porcine brain tissue. The result is a biological profile that simultaneously activates multiple neurotrophic signaling cascades—mimicking BDNF, NGF, CNTF, and GDNF pathways that govern neuroplasticity, cell survival, and synaptic remodeling.</p><p>Developed in Austria and extensively studied across European and Asian research institutions, Cerebrolysin has accumulated over 300 published studies in neurodegenerative disease models, stroke recovery, and traumatic brain injury research. Its mechanism—providing exogenous neurotrophic support when endogenous systems fail—makes it irreplaceable in neuroprotection studies where single-target interventions prove insufficient.</p>',
    researchApplications: ['Multi-pathway neuroprotection', 'Neurodegenerative disease models', 'Post-stroke neuroplasticity', 'Synaptic preservation studies', 'Neurotrophic factor signaling', 'Cognitive impairment research'],
    storage: 'Store refrigerated at 2-8°C in original sealed ampules. Do not freeze. Protect from direct light. Use immediately upon opening; this product does not contain preservatives. Stable unopened for 24 months under proper conditions.'
  },
  { 
    slug: 'selank-5mg', 
    name: 'Selank 5mg', 
    price: 36, 
    cat: 'neuropeptides', 
    qty: '5mg', 
    cas: '129954-34-3', 
    mw: '751.9 g/mol', 
    formula: 'C<sub>33</sub>H<sub>57</sub>N<sub>11</sub>O<sub>9</sub>',
    seoTitle: 'Selank 5mg | ≥98% Pure | Russian-Developed Anxiolytic Peptide | PRC Peptides',
    metaDesc: 'Selank 5mg anxiolytic neuropeptide for neuroscience research. ≥98% purity, third-party tested, cytokine-modulating peptide. COA available.',
    shortDesc: 'One of the few synthetic anxiolytic peptides with documented cytokine-modulating activity available for neurochemical research.',
    fullDescription: '<p>Developed at Moscow\'s Institute of Molecular Genetics, Selank represents a rational design approach to neuropeptide therapeutics—a synthetic heptapeptide built upon the immune peptide tuftsin\'s structural scaffold. This derivative demonstrates the rare capacity to simultaneously modulate IL-6 expression and influence monoaminergic neurotransmitter systems, bridging neuroimmune signaling in ways few compounds can. Its dual action on GABA and serotonin pathways has positioned it as a cornerstone tool in anxiety neurobiology research.</p><p>Researchers investigating the intersection of immune signaling and behavioral neuroscience find Selank indispensable. Over two decades of Russian neurochemical research have characterized its mechanism across multiple systems, making it one of the most comprehensively studied synthetic anxiolytics in contemporary neuropharmacology.</p>',
    researchApplications: ['Anxiety model studies', 'Cognitive function research', 'Immune-neuro axis modulation', 'GABAergic pathway studies', 'Stress response mechanisms', 'Cytokine regulation research'],
    storage: 'Store lyophilized at -20°C in sealed vial. Upon reconstitution with bacteriostatic water, maintain at 2-8°C and utilize within 30 days. Avoid freeze-thaw cycles to preserve peptide integrity.'
  },
  { 
    slug: 'selank-10mg', 
    name: 'Selank 10mg', 
    price: 36, 
    cat: 'neuropeptides', 
    qty: '10mg', 
    cas: '129954-34-3', 
    mw: '751.9 g/mol', 
    formula: 'C<sub>33</sub>H<sub>57</sub>N<sub>11</sub>O<sub>9</sub>',
    seoTitle: 'Selank 10mg | ≥98% Pure | Higher-Dose Anxiolytic Peptide | PRC Peptides',
    metaDesc: 'Selank 10mg higher-dose anxiolytic neuropeptide. ≥98% purity, third-party tested, immune-neuro axis modulator. COA available.',
    shortDesc: 'One of the few synthetic anxiolytic peptides with documented cytokine-modulating activity available for neurochemical research.',
    fullDescription: '<p>Developed at Moscow\'s Institute of Molecular Genetics, Selank represents a rational design approach to neuropeptide therapeutics—a synthetic heptapeptide built upon the immune peptide tuftsin\'s structural scaffold. This derivative demonstrates the rare capacity to simultaneously modulate IL-6 expression and influence monoaminergic neurotransmitter systems, bridging neuroimmune signaling in ways few compounds can. Its dual action on GABA and serotonin pathways has positioned it as a cornerstone tool in anxiety neurobiology research.</p><p>Researchers investigating the intersection of immune signaling and behavioral neuroscience find Selank indispensable. Over two decades of Russian neurochemical research have characterized its mechanism across multiple systems, making it one of the most comprehensively studied synthetic anxiolytics in contemporary neuropharmacology.</p>',
    researchApplications: ['Anxiety model studies', 'Cognitive function research', 'Immune-neuro axis modulation', 'GABAergic pathway studies', 'Stress response mechanisms', 'Cytokine regulation research'],
    storage: 'Store lyophilized at -20°C in sealed vial. Upon reconstitution with bacteriostatic water, maintain at 2-8°C and utilize within 30 days. Avoid freeze-thaw cycles to preserve peptide integrity.'
  },
  { 
    slug: 'semax', 
    name: 'Semax', 
    price: 31, 
    cat: 'neuropeptides', 
    qty: '5mg', 
    cas: '80714-61-0', 
    mw: '813.9 g/mol', 
    formula: 'C<sub>37</sub>H<sub>51</sub>N<sub>9</sub>O<sub>10</sub>S',
    seoTitle: 'Semax 5mg | ≥98% Pure | ACTH-Derived Nootropic Peptide | PRC Peptides',
    metaDesc: 'Semax 5mg nootropic neuropeptide for BDNF research. ≥98% purity, third-party tested, ACTH-derived cognitive enhancer. COA available.',
    shortDesc: 'The only synthetic ACTH analogue specifically engineered to penetrate the blood-brain barrier and elevate BDNF expression.',
    fullDescription: '<p>Semax emerged from the same Moscow laboratory that produced Selank, but with an entirely different objective: augmenting cognitive capacity through neurotrophic upregulation. This heptapeptide analogue of the ACTH(4-10) fragment demonstrates a mechanism rare among small peptides—it crosses the blood-brain barrier intact and directly increases brain-derived neurotrophic factor expression in cortical and hippocampal regions. The result: enhanced neuroplasticity, improved dopaminergic and serotonergic tone, and measurable effects on memory consolidation in experimental models.</p><p>Where most nootropics rely on neurotransmitter modulation alone, Semax operates upstream—influencing the very production of proteins that govern synaptic remodeling. Its effects on cerebrovascular function have made it a staple in stroke recovery research, while cognitive neuroscientists value its ability to enhance working memory without stimulant-like side effects.</p>',
    researchApplications: ['BDNF upregulation research', 'Cognitive enhancement models', 'Neuroprotection studies', 'Cerebrovascular function research', 'Attention and memory mechanisms', 'Stroke recovery pathways'],
    storage: 'Store lyophilized at -20°C protected from light. Reconstitute with bacteriostatic or sterile water; maintain at 2-8°C and use within 30 days. This peptide exhibits enhanced stability compared to unmodified ACTH fragments.'
  },
  { 
    slug: 'dsip', 
    name: 'DSIP', 
    price: 31, 
    cat: 'neuropeptides', 
    qty: '5mg', 
    cas: '62568-57-4', 
    mw: '848.8 g/mol', 
    formula: 'C<sub>35</sub>H<sub>48</sub>N<sub>10</sub>O<sub>15</sub>',
    seoTitle: 'DSIP 5mg | ≥98% Pure | Sleep-Inducing Neuropeptide | PRC Peptides',
    metaDesc: 'DSIP 5mg sleep-inducing neuropeptide for circadian research. ≥98% purity, third-party tested, delta sleep architecture modulator. COA available.',
    shortDesc: 'The original sleep-inducing peptide—a naturally occurring nonapeptide that launched the field of endogenous sleep regulation research.',
    fullDescription: '<p>Delta Sleep-Inducing Peptide represents a landmark discovery in chronobiology. Isolated from the cerebral venous blood of sleeping rabbits in 1977 by Swiss researchers Schoenenberger and Monnier, DSIP opened scientific inquiry into endogenous sleep architecture modulation. Unlike sedatives that suppress neural activity, this nonapeptide appears to facilitate natural sleep-wake transitions through circadian rhythm entrainment and stress hormone regulation.</p><p>The peptide\'s mechanism extends beyond simple sleep induction: it modulates stress response systems, exhibits analgesic properties in pain perception studies, and demonstrates cortisol-regulating effects that have made it valuable in neuroendocrine research. Decades of investigation have revealed DSIP\'s subtle, multi-system influence—acting more as a biological rhythm optimizer than a traditional sleep agent.</p>',
    researchApplications: ['Sleep architecture studies', 'Circadian rhythm regulation', 'Stress-response neuroendocrine pathways', 'Pain perception modulation', 'Cortisol dynamics research', 'Delta wave sleep mechanisms'],
    storage: 'Store lyophilized at -20°C in amber vial to protect from light degradation. Upon reconstitution, store refrigerated (2-8°C) and utilize within 30 days for optimal peptide stability.'
  },
  { 
    slug: 'dsip-night-blend', 
    name: 'DSIP Night Blend', 
    price: 42, 
    cat: 'neuropeptides', 
    qty: '5mg', 
    cas: 'Proprietary blend', 
    mw: 'Multi-peptide', 
    formula: 'Sleep complex',
    seoTitle: 'DSIP Night Blend | ≥98% Pure | Synergistic Sleep Research Complex | PRC Peptides',
    metaDesc: 'DSIP Night Blend multi-peptide sleep complex. ≥98% purity per component, third-party tested, synergistic circadian blend. COA available.',
    shortDesc: 'A rare multi-peptide formulation combining three complementary sleep-regulating neuropeptides studied for their synergistic effects on circadian biology.',
    fullDescription: '<p>Sleep architecture involves layered neurochemical systems—GABAergic inhibition, serotonergic tone, melatonergic timing, and neuropeptide signaling all converge to orchestrate restorative sleep. This proprietary blend recognizes that complexity, combining DSIP with complementary peptides that target distinct but overlapping pathways in sleep-wake regulation. The formulation enables researchers to investigate multi-system sleep modulation in ways single-agent studies cannot capture.</p><p>Unlike crude sedative approaches, this blend mirrors the brain\'s endogenous sleep-promoting cascade—facilitating rather than forcing the transition to restorative sleep states. Chronobiology researchers studying circadian misalignment, sleep disorder pathophysiology, or the molecular architecture of sleep cycles find this combination invaluable for modeling natural sleep regulation.</p>',
    researchApplications: ['Multi-peptide sleep architecture studies', 'Circadian entrainment mechanisms', 'Neurotransmitter interaction models in sleep', 'Restorative sleep pathway research', 'Sleep disorder neurochemistry'],
    storage: 'Store lyophilized at -20°C protected from light and moisture. Reconstituted solution remains stable at 2-8°C for up to 30 days when stored properly. Single-use aliquoting recommended for repeated experiments.'
  },
  
  // LONGEVITY
  { 
    slug: 'foxo4-dri', 
    name: 'FOXO4-DRI', 
    price: 67, 
    cat: 'longevity', 
    qty: '10mg', 
    cas: '1639871-79-4', 
    mw: '~5040 g/mol', 
    formula: 'D-retro-inverso',
    seoTitle: 'FOXO4-DRI 10mg | ≥98% Pure | Senolytic Peptide Disruptor | PRC Peptides',
    metaDesc: 'FOXO4-DRI 10mg senolytic peptide for cellular aging research. ≥98% purity, third-party tested, D-retro-inverso design. COA available.',
    shortDesc: 'The first peptide-based senolytic—a D-retro-inverso modified sequence that selectively disrupts the FOXO4-p53 interaction in senescent cells, triggering their apoptotic elimination.',
    fullDescription: '<p>FOXO4-DRI represents molecular precision in anti-aging research. Senescent cells—aged cells that cease dividing but resist apoptosis—accumulate with age and secrete inflammatory factors (the senescence-associated secretory phenotype, SASP) that damage surrounding tissues. Dutch researchers discovered that in senescent cells, FOXO4 protein binds and sequesters p53, preventing p53-mediated apoptosis. FOXO4-DRI, a peptide mimicking the p53-binding domain of FOXO4, competitively disrupts this interaction—freeing p53 to trigger apoptosis specifically in senescent cells.</p><p>The D-retro-inverso modification—constructing the peptide from D-amino acids in reverse sequence—creates a molecule with identical binding surface topology but dramatically enhanced proteolytic stability. This senolytic approach—selectively eliminating senescent cells while sparing healthy ones—represents a targeted strategy for addressing cellular aging.</p>',
    researchApplications: ['Senescent cell biology', 'FOXO4-p53 interaction studies', 'Senolytic mechanism research', 'Cellular aging models', 'Apoptosis pathway research', 'SASP modulation', 'Targeted cellular aging interventions'],
    storage: 'Store lyophilized at -20°C protected from moisture. Upon reconstitution, maintain at 2-8°C and use within 30 days. D-amino acid peptides demonstrate exceptional proteolytic stability.'
  },
  { 
    slug: 'epithalon', 
    name: 'Epithalon', 
    price: 66, 
    cat: 'longevity', 
    qty: '50mg', 
    cas: '307297-39-8', 
    mw: '390.3 g/mol', 
    formula: 'C<sub>14</sub>H<sub>22</sub>N<sub>4</sub>O<sub>9</sub>',
    seoTitle: 'Epithalon 50mg | ≥98% Pure | Telomerase Activator Peptide | PRC Peptides',
    metaDesc: 'Epithalon 50mg telomerase modulator for longevity research. ≥98% purity, third-party tested, pineal-derived tetrapeptide. COA available.',
    shortDesc: 'A synthetic tetrapeptide that mimics the pineal gland\'s epithalamin—demonstrating telomerase activation and circadian regulation in aging research models.',
    fullDescription: '<p>Epithalon (Epitalon, Ala-Glu-Asp-Gly) emerged from decades of Russian gerontology research led by Professor Vladimir Khavinson. This tetrapeptide, designed to replicate bioactive sequences from the pineal peptide epithalamin, demonstrates two remarkable properties in experimental models: activation of telomerase (the enzyme that maintains telomere length) and modulation of circadian rhythms through melatonin regulation. These dual mechanisms position Epithalon at the intersection of cellular aging and chronobiology research.</p><p>Telomeres—the protective caps on chromosome ends—shorten with each cell division, eventually triggering senescence. Telomerase can extend telomeres, but most somatic cells suppress this enzyme. Epithalon\'s apparent ability to transiently activate telomerase in adult tissues has driven extensive research into its mechanism and potential for studying telomere biology and cellular aging interventions.</p>',
    researchApplications: ['Telomerase activity research', 'Telomere biology', 'Circadian rhythm regulation', 'Pineal peptide research', 'Cellular aging mechanisms', 'Melatonin regulation studies', 'Longevity pathway research'],
    storage: 'Store lyophilized at -20°C. Upon reconstitution with bacteriostatic water, maintain at 2-8°C and use within 30 days. This short peptide demonstrates good stability in solution.'
  },
  { 
    slug: 'pe-22-28', 
    name: 'PE 22-28', 
    price: 30, 
    cat: 'longevity', 
    qty: '10mg', 
    cas: 'Sortilin fragment', 
    mw: 'Heptapeptide', 
    formula: 'Spadin derivative',
    seoTitle: 'PE 22-28 10mg | ≥98% Pure | TREK-1 Channel Modulator | PRC Peptides',
    metaDesc: 'PE 22-28 10mg neuroprotective heptapeptide for neuroplasticity research. ≥98% purity, third-party tested, TREK-1 modulator. COA available.',
    shortDesc: 'A synthetic fragment of the sortilin propeptide—a heptapeptide that modulates TREK-1 potassium channels to influence neuroplasticity and neuroprotection.',
    fullDescription: '<p>PE 22-28 represents targeted neuroplasticity research. This heptapeptide, corresponding to amino acids 22-28 of the propeptide region of sortilin (a protein involved in neurotrophin sorting), was identified through research into spadin—an endogenous peptide with neuroprotective properties. PE 22-28 interacts with TREK-1 (TWIK-related potassium channel), a background potassium channel involved in neuronal excitability, synaptic plasticity, and stress response.</p><p>By modulating TREK-1 channel activity, PE 22-28 influences neuronal membrane potential and excitability, with downstream effects on neurotrophic signaling and synaptic remodeling. Research suggests this peptide may enhance neuroplasticity—the brain\'s capacity to reorganize synaptic connections—making it valuable for studying neuroadaptation, neuroprotection mechanisms, and the role of potassium channels in cognitive function.</p>',
    researchApplications: ['TREK-1 channel modulation', 'Neuroplasticity mechanisms', 'Neuroprotection studies', 'Potassium channel biology', 'Synaptic plasticity research', 'Neurogenesis studies', 'Neurotrophic signaling pathways'],
    storage: 'Store lyophilized at -20°C. Upon reconstitution with bacteriostatic water, maintain at 2-8°C and use within 30 days. Standard peptide handling precautions apply.'
  },
  
  // MELANOCORTIN
  { 
    slug: 'pt-141', 
    name: 'PT-141', 
    price: 36, 
    cat: 'melanocortin', 
    qty: '10mg', 
    cas: '189691-06-3', 
    mw: '1025.2 g/mol', 
    formula: 'C<sub>50</sub>H<sub>68</sub>N<sub>14</sub>O<sub>10</sub>',
    seoTitle: 'PT-141 (Bremelanotide) | ≥98% Pure | MC3R/MC4R Agonist | PRC Peptides',
    metaDesc: 'PT-141 melanocortin receptor agonist for CNS research. ≥98% purity, third-party tested, selective MC3R/MC4R activation. COA available.',
    shortDesc: 'A cyclic heptapeptide melanocortin agonist with preferential activity at MC3R and MC4R—a Melanotan II metabolite engineered for selective melanocortin receptor research.',
    fullDescription: '<p>PT-141 emerged from structure-activity relationship studies of Melanotan II, a synthetic α-MSH analogue. While Melanotan II activates multiple melanocortin receptor subtypes (MC1R through MC5R), its metabolite PT-141 demonstrates preferential activity at MC3R and MC4R with reduced MC1R activation—eliminating much of the pigmentation effect while retaining central melanocortin activity. This selectivity makes PT-141 invaluable for dissecting the distinct roles of melanocortin receptor subtypes.</p><p>MC3R and MC4R, expressed primarily in the hypothalamus, regulate energy balance, autonomic function, and motivated behaviors through melanocortin signaling. PT-141 enables researchers to study these central melanocortin pathways without the confounding peripheral effects of broader melanocortin activation, making it the preferred tool for investigating hypothalamic melanocortin biology.</p>',
    researchApplications: ['Melanocortin receptor subtype pharmacology', 'MC3R/MC4R signaling research', 'Central melanocortin pathway studies', 'Receptor selectivity research', 'Hypothalamic signaling mechanisms', 'Melanocortin system biology'],
    storage: 'Store lyophilized at -20°C. Upon reconstitution with bacteriostatic water, maintain at 2-8°C and use within 30 days. The cyclic structure provides enhanced proteolytic stability.'
  },
  { 
    slug: 'dermorphin', 
    name: 'Dermorphin', 
    price: 22, 
    cat: 'melanocortin', 
    qty: '5mg', 
    cas: '77614-16-5', 
    mw: '802.9 g/mol', 
    formula: 'C<sub>40</sub>H<sub>50</sub>N<sub>8</sub>O<sub>10</sub>',
    seoTitle: 'Dermorphin 5mg | ≥98% Pure | Selective μ-Opioid Agonist | PRC Peptides',
    metaDesc: 'Dermorphin 5mg selective μ-opioid agonist for receptor research. ≥98% purity, third-party tested, D-amino acid peptide. COA available.',
    shortDesc: 'A naturally occurring heptapeptide with extraordinary μ-opioid receptor selectivity—notable for its D-alanine residue and exceptional potency in opioid receptor research.',
    fullDescription: '<p>Dermorphin stands as one of pharmacology\'s most intriguing discoveries. Isolated from the skin secretions of South American Phyllomedusa frogs, this heptapeptide contains an unusual D-alanine in position 2—one of the rare instances of D-amino acids in biologically active peptides. This structural quirk contributes to dermorphin\'s exceptional properties: nanomolar μ-opioid receptor affinity, selectivity ratios exceeding 1000:1 for μ over δ and κ receptors, and resistance to peptidase degradation.</p><p>The peptide\'s extraordinary selectivity and potency have made it an essential tool in opioid receptor biology—enabling precise study of μ-opioid receptor pharmacology, structure-activity relationships, and receptor-ligand interactions. Researchers investigating opioid signaling mechanisms, studying receptor binding kinetics, or exploring the structural determinants of receptor selectivity consistently rely on dermorphin as a reference μ-selective agonist.</p>',
    researchApplications: ['μ-opioid receptor pharmacology', 'Receptor subtype selectivity studies', 'Opioid receptor binding kinetics', 'Structure-activity relationships', 'Receptor signaling mechanisms', 'D-amino acid peptide biology', 'Opioid tolerance mechanisms'],
    storage: 'Store lyophilized at -20°C protected from moisture and light. Upon reconstitution with sterile or bacteriostatic water, maintain at 2-8°C and use within 30 days. The D-amino acid provides proteolytic resistance.'
  },
  
  // COSMETIC
  { 
    slug: 'botulinum-100u', 
    name: 'Botulinum 100u', 
    price: 135, 
    cat: 'cosmetic', 
    qty: '100u', 
    cas: '93384-43-1', 
    mw: '~150 kDa', 
    formula: 'Protein complex',
    seoTitle: 'Botulinum Toxin Type A 100u | Pharmaceutical Grade | SNARE Research Tool | PRC Peptides',
    metaDesc: 'Botulinum Toxin 100u for synaptic research. Pharmaceutical grade, SNAP-25 protease, neuromuscular junction studies. COA available.',
    shortDesc: 'The most potent biological toxin known—a 150 kDa metalloprotease that cleaves SNAP-25 with absolute specificity, making it essential for studying synaptic vesicle fusion and neurotransmitter release.',
    fullDescription: '<p>Botulinum neurotoxin type A represents the gold standard for studying exocytosis. This large protein complex, produced by Clostridium botulinum, consists of a heavy chain (responsible for binding and internalization) and a light chain (the zinc-dependent endopeptidase that cleaves SNAP-25). By specifically cleaving SNAP-25—a protein essential for SNARE complex formation—BoNT/A prevents synaptic vesicles from fusing with the presynaptic membrane, completely blocking neurotransmitter release.</p><p>This exquisite molecular specificity makes botulinum toxin invaluable beyond its clinical applications. Researchers studying SNARE protein biology, investigating synaptic vesicle fusion mechanisms, exploring neuromuscular junction physiology, or dissecting the molecular machinery of exocytosis rely on BoNT/A\'s specific, irreversible SNAP-25 cleavage. The toxin serves as a molecular scalpel that precisely disrupts a single step in neurotransmitter release.</p>',
    researchApplications: ['SNARE protein biology', 'Synaptic vesicle fusion mechanisms', 'Neuromuscular junction research', 'Acetylcholine release studies', 'Exocytosis research', 'Presynaptic signaling', 'Metalloprotease mechanism studies'],
    storage: 'Store lyophilized at -20°C. Upon reconstitution, use immediately or store at 2-8°C for a maximum of 4 hours—this protein loses activity rapidly in solution. Handle with extreme care following institutional biosafety protocols.'
  },
  { 
    slug: 'botulinum-200u', 
    name: 'Botulinum 200u', 
    price: 170, 
    cat: 'cosmetic', 
    qty: '200u', 
    cas: '93384-43-1', 
    mw: '~150 kDa', 
    formula: 'Protein complex',
    seoTitle: 'Botulinum Toxin Type A 200u | Pharmaceutical Grade | Synaptic Research Tool | PRC Peptides',
    metaDesc: 'Botulinum Toxin 200u for neurotransmitter research. Pharmaceutical grade, SNAP-25 cleavage, synaptic biology. COA available.',
    shortDesc: 'The most potent biological toxin known—a 150 kDa metalloprotease that cleaves SNAP-25 with absolute specificity, making it essential for studying synaptic vesicle fusion and neurotransmitter release.',
    fullDescription: '<p>Botulinum neurotoxin type A represents the gold standard for studying exocytosis. This large protein complex, produced by Clostridium botulinum, consists of a heavy chain (responsible for binding and internalization) and a light chain (the zinc-dependent endopeptidase that cleaves SNAP-25). By specifically cleaving SNAP-25—a protein essential for SNARE complex formation—BoNT/A prevents synaptic vesicles from fusing with the presynaptic membrane, completely blocking neurotransmitter release.</p><p>This exquisite molecular specificity makes botulinum toxin invaluable beyond its clinical applications. Researchers studying SNARE protein biology, investigating synaptic vesicle fusion mechanisms, exploring neuromuscular junction physiology, or dissecting the molecular machinery of exocytosis rely on BoNT/A\'s specific, irreversible SNAP-25 cleavage. The toxin serves as a molecular scalpel that precisely disrupts a single step in neurotransmitter release.</p>',
    researchApplications: ['SNARE protein biology', 'Synaptic vesicle fusion mechanisms', 'Neuromuscular junction research', 'Acetylcholine release studies', 'Exocytosis research', 'Presynaptic signaling', 'Metalloprotease mechanism studies'],
    storage: 'Store lyophilized at -20°C. Upon reconstitution, use immediately or store at 2-8°C for a maximum of 4 hours—this protein loses activity rapidly in solution. Handle with extreme care following institutional biosafety protocols.'
  },
  
  // ADVANCED
  { 
    slug: 'ara-290', 
    name: 'ARA-290', 
    price: 24, 
    cat: 'advanced', 
    qty: '10mg', 
    cas: '1448671-31-5', 
    mw: '1257.3 g/mol', 
    formula: 'C<sub>51</sub>H<sub>84</sub>N<sub>16</sub>O<sub>21</sub>',
    seoTitle: 'ARA-290 10mg | ≥98% Pure | Tissue-Protective EPO Derivative | PRC Peptides',
    metaDesc: 'ARA-290 10mg innate repair receptor agonist. ≥98% purity, third-party tested, EPO-derived tissue protection peptide. COA available.',
    shortDesc: 'An 11-amino acid fragment of erythropoietin engineered to selectively activate the innate repair receptor—providing tissue protection and anti-inflammatory signaling without erythropoietic activity.',
    fullDescription: '<p>ARA-290 represents molecular refinement of erythropoietin\'s tissue-protective properties. While full-length EPO stimulates red blood cell production through the classical EPO receptor, it also activates a distinct receptor complex called the innate repair receptor (IRR or tissue-protective receptor)—a heteromeric complex that triggers cell protection, reduces inflammation, and promotes tissue repair. ARA-290, an 11-amino acid EPO-derived peptide, selectively activates the IRR without engaging the erythropoietic EPO receptor.</p><p>This separation of functions enables clean investigation of EPO\'s tissue-protective mechanisms without the confounding hematological effects. Research has demonstrated ARA-290\'s effects in neuropathy models, ischemia-reperfusion injury, and inflammatory conditions—all mediated through IRR signaling pathways distinct from classical EPO effects. The peptide provides a unique tool for studying tissue protection mechanisms and innate repair receptor biology.</p>',
    researchApplications: ['Innate repair receptor signaling', 'Tissue protection mechanisms', 'EPO receptor biology', 'Neuroprotection studies', 'Anti-inflammatory pathways', 'Ischemia-reperfusion injury models', 'Diabetic neuropathy research'],
    storage: 'Store lyophilized at -20°C. Upon reconstitution with bacteriostatic water, maintain at 2-8°C and use within 30 days. This peptide demonstrates good stability in solution.'
  }
];

// Default FAQ for all products
const defaultFAQ = [
  {q: 'How should I reconstitute this product?', a: 'Reconstitute with bacteriostatic water (supplied with order). Add water slowly down the side of the vial, allow to dissolve naturally without shaking. Full protocols available at peptideresourcecenter.com.'},
  {q: 'What purity testing is performed?', a: 'All products undergo dual verification: manufacturer HPLC testing (≥98% purity) plus independent third-party lab verification. Certificates of Analysis are available for every batch—request via email at support@prcpeptides.com.'},
  {q: 'How should I store this product?', a: 'Lyophilized (powder): Store at -20°C in original sealed vial. Reconstituted: Store at 2-8°C (refrigerated) and use within 30 days. Do not freeze reconstituted product. Keep away from direct light.'},
  {q: 'Do you provide Certificates of Analysis?', a: 'Yes. Every product has an available COA from both the manufacturer and our independent third-party testing lab. Request your batch-specific COA by emailing support@prcpeptides.com with your order number.'}
];

// Helper functions
function escapeForJS(str) {
  return str.replace(/'/g, "\\'").replace(/\n/g, ' ');
}

function generateFAQ(faqs) {
  return `<div class="faq-section">
<h2>Frequently Asked Questions</h2>
${faqs.map(faq => `<details>
<summary>${faq.q}</summary>
<p>${faq.a}</p>
</details>`).join('\n')}
</div>`;
}

function generateRelated(related) {
  return `<div class="related-products">
<h2>Researchers Also Explore</h2>
<div class="related-grid">
${related.map(r => `<a href="${r.slug}.html" class="related-card"><div class="related-cat">${r.category}</div><div class="related-name">${r.name}</div><div class="related-price">$${r.price}</div><div class="related-coa">COA ✓</div></a>`).join('\n')}
</div>
</div>`;
}

function generateResearchApps(apps) {
  if (!apps || apps.length === 0) return '';
  return `<h2>Research Applications</h2>
<ul>${apps.map(app => `<li>${app}</li>`).join('')}</ul>`;
}

// Process each product
let count = 0;
for (const product of products) {
  const cat = categories[product.cat];
  const form = product.form || 'Lyophilized Powder';
  
  // Get related products (same category + 1 different)
  const sameCat = products.filter(p => p.cat === product.cat && p.slug !== product.slug).slice(0, 2);
  const diffCat = products.filter(p => p.cat !== product.cat).slice(0, 1);
  const related = [...sameCat, ...diffCat].map(p => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    category: categories[p.cat].name.replace('Growth Hormone Secretagogues', 'Growth Hormone').replace('GLP Receptor Agonists', 'GLP Agonists')
  }));
  
  // Build page
  let page = template;
  page = page.replace(/\{\{PRODUCT_NAME\}\}/g, product.name);
  page = page.replace(/\{\{PRODUCT_NAME_JS\}\}/g, escapeForJS(product.name));
  page = page.replace(/\{\{PRODUCT_NAME_ENCODED\}\}/g, encodeURIComponent(product.name));
  page = page.replace(/\{\{SLUG\}\}/g, product.slug);
  page = page.replace(/\{\{PRICE\}\}/g, product.price);
  page = page.replace(/\{\{CATEGORY\}\}/g, cat.name);
  page = page.replace(/\{\{CATEGORY_SLUG\}\}/g, product.cat);
  page = page.replace(/\{\{CATEGORY_COLOR\}\}/g, cat.color);
  page = page.replace(/\{\{FORM\}\}/g, form);
  page = page.replace(/\{\{QUANTITY\}\}/g, product.qty);
  page = page.replace(/\{\{PURITY\}\}/g, '≥98%');
  page = page.replace(/\{\{CAS\}\}/g, product.cas);
  page = page.replace(/\{\{MOLECULAR_WEIGHT\}\}/g, product.mw);
  page = page.replace(/\{\{MOLECULAR_FORMULA\}\}/g, product.formula);
  page = page.replace(/\{\{SHORT_DESC\}\}/g, product.shortDesc);
  page = page.replace(/\{\{FULL_DESCRIPTION\}\}/g, product.fullDescription);
  page = page.replace(/\{\{STORAGE\}\}/g, product.storage);
  page = page.replace(/\{\{RESEARCH_APPLICATIONS\}\}/g, generateResearchApps(product.researchApplications));
  page = page.replace(/\{\{FAQ_SECTION\}\}/g, generateFAQ(defaultFAQ));
  page = page.replace(/\{\{RELATED_PRODUCTS\}\}/g, generateRelated(related));
  page = page.replace(/\{\{SEO_TITLE\}\}/g, product.seoTitle);
  page = page.replace(/\{\{META_DESCRIPTION\}\}/g, product.metaDesc);
  
  // Write file
  const outputPath = path.join('prc-tools', 'products', `${product.slug}.html`);
  fs.writeFileSync(outputPath, page);
  console.log(`✓ ${product.name.padEnd(30)} → ${product.slug}.html`);
  count++;
}

console.log(`\n✅ Generated ${count} product pages with REAL v3 descriptions!\n`);
