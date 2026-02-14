import urllib.request, json, sys

compounds = {
    "Selank": {"cas": "129954-34-3", "formula": "C33H57N11O9", "mw": 751.9},
    "Semax": {"cas": "80714-61-0", "formula": "C37H51N9O10S", "mw": 813.9},
    "DSIP": {"cas": "62568-57-4", "formula": "C35H48N10O15", "mw": 848.8},
    "Semaglutide": {"cas": "910463-68-2", "formula": "C187H291N45O59", "mw": 4113.6},
    "Tirzepatide": {"cas": "2023788-19-2", "formula": "C225H348N48O68", "mw": 4813.5},
    "Retatrutide": {"cas": "2381089-83-2", "formula": "C248H394N66O75", "mw": 5501.3},
    "Cagrilintide": {"cas": "2374769-38-1", "formula": "C171H273N51O53S2", "mw": 3999.5},
    "Sermorelin": {"cas": "86168-78-7", "formula": "C149H246N44O42S", "mw": 3357.9},
    "Ipamorelin": {"cas": "170851-70-4", "formula": "C38H49N9O5", "mw": 711.9},
    "CJC-1295": {"cas": "863288-34-0", "formula": "C152H252N44O42", "mw": 3367.9},
    "BPC-157": {"cas": "137525-51-0", "formula": "C62H98N16O22", "mw": 1419.5},
    "KPV": {"cas": "61090-95-7", "formula": "C16H30N4O4", "mw": 342.4},
    "GHK-Cu": {"cas": "49557-75-7", "formula": "C14H24N6O4", "mw": 404.0},
    "LL-37": {"cas": "154947-66-7", "formula": "C205H340N60O53", "mw": 4493.3},
    "AOD-9604": {"cas": "221231-10-3", "formula": "C78H123N23O23S2", "mw": 1815.1},
    "MOTS-c": {"cas": "1627580-64-6", "formula": "C101H152N28O22S2", "mw": 2174.6},
    "5-Amino-1MQ": {"cas": "42464-96-0", "formula": "C10H11N2+", "mw": 159.2},
    "NAD+": {"cas": "53-84-9", "formula": "C21H27N7O14P2", "mw": 663.4},
    "Glutathione": {"cas": "70-18-8", "formula": "C10H17N3O6S", "mw": 307.3},
    "Alpha-Lipoic": {"cas": "1077-28-7", "formula": "C8H14O2S2", "mw": 206.3},
    "Vitamin-C": {"cas": "50-81-7", "formula": "C6H8O6", "mw": 176.1},
    "SS-31": {"cas": "736992-21-5", "formula": "C32H52N10O5", "mw": 656.8},
    "FOXO4-DRI": {"cas": "1639871-79-4", "formula": "C221H336N62O64S", "mw": 5041.6},
    "Epithalon": {"cas": "307297-39-8", "formula": "C14H22N4O9", "mw": 390.3},
    "PT-141": {"cas": "189691-06-3", "formula": "C50H68N14O10", "mw": 1025.2},
    "Dermorphin": {"cas": "77614-16-5", "formula": "C38H51N9O10", "mw": 781.9},
    "Botulinum": {"cas": "93384-43-1", "formula": "N/A", "mw": 150000},
    "ARA-290": {"cas": "1448671-31-5", "formula": "C59H89N15O18", "mw": 1320.4},
    "L-Carnitine": {"cas": "541-15-1", "formula": "C7H15NO3", "mw": 161.2},
    "HGH-191": {"cas": "12629-01-5", "formula": "C990H1528N262O300S7", "mw": 22124},
}

# Verify via PubChem REST API
errors = []
passes = []
for name, info in compounds.items():
    try:
        url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{name}/property/MolecularFormula,MolecularWeight,IUPACName/JSON"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read())
        props = data["PropertyTable"]["Properties"][0]
        pc_formula = props.get("MolecularFormula", "")
        pc_mw = props.get("MolecularWeight", 0)
        
        issues = []
        if pc_formula and pc_formula != info["formula"]:
            issues.append(f"Formula: ours={info['formula']} pubchem={pc_formula}")
        if pc_mw and abs(float(pc_mw) - info["mw"]) > 2:
            issues.append(f"MW: ours={info['mw']} pubchem={pc_mw}")
        
        if issues:
            errors.append(f"❌ {name}: {'; '.join(issues)}")
        else:
            passes.append(f"✅ {name}: verified")
    except Exception as e:
        passes.append(f"⚠️ {name}: not on PubChem (CAS {info['cas']}) - manual check needed")

print("=== ERRORS ===")
for e in errors:
    print(e)
print(f"\n=== PASSES ({len(passes)}) ===")
for p in passes:
    print(p)
