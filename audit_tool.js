const fs = require('fs');
const html = fs.readFileSync('peptide_comparison_tool.html', 'utf8');

// Extract peptideData array
const match = html.match(/const peptideData = \[([\s\S]*?)\];/);
if (!match) { console.log('Could not find peptideData'); process.exit(1); }

const entries = match[1].match(/\{[^}]+\}/g);
console.log('Total entries in HTML:', entries.length);

const data = entries.map(e => {
  const get = (key) => {
    const m = e.match(new RegExp(key + ':\\s*["\u0027](.*?)["\u0027]'));
    return m ? m[1] : '';
  };
  const getNum = (key) => {
    const m = e.match(new RegExp(key + ':\\s*([\\d.]+)'));
    return m ? parseFloat(m[1]) : 0;
  };
  return {
    name: get('name'),
    vendor: get('vendor'),
    price: getNum('price'),
    strength: get('strength'),
    code: get('code')
  };
});

// Group by vendor
const byVendor = {};
data.forEach(d => {
  if (!byVendor[d.vendor]) byVendor[d.vendor] = [];
  byVendor[d.vendor].push(d);
});

Object.keys(byVendor).sort().forEach(v => {
  console.log('\n--- ' + v + ' (' + byVendor[v].length + ' entries) ---');
  byVendor[v].forEach(d => {
    console.log('  ' + d.name + ' | ' + d.strength + ' | $' + d.price + (d.code ? ' | code: ' + d.code : ''));
  });
});

// Now compare with CSV
console.log('\n\n=== CSV COMPARISON ===\n');
const csv = fs.readFileSync('price_comparison_final.csv', 'utf8');
const lines = csv.split('\n').slice(1).filter(l => l.trim());

// Parse CSV (handle quoted fields)
const csvData = lines.map(line => {
  const parts = [];
  let current = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { parts.push(current.trim()); current = ''; continue; }
    current += ch;
  }
  parts.push(current.trim());
  return { name: parts[0], strength: parts[1], price: parseFloat(parts[2]) || 0, vendor: parts[3], code: parts[4] };
});

// Check removed vendors that should be added back
const addedBack = ['AIO', 'Strate', 'Tydes', 'Elev8', 'Biopeptide', 'AMP', 'FelixChem', 'Felix Chem', 'Royal'];
const mismatches = [];

csvData.filter(c => addedBack.some(v => c.vendor && c.vendor.includes(v))).forEach(csvEntry => {
  // Find matching HTML entry
  const htmlMatch = data.find(h => 
    h.vendor.toLowerCase().includes(csvEntry.vendor.toLowerCase().replace(' ', '')) && 
    h.name.toLowerCase().replace(/[\s-]/g, '').includes(csvEntry.name.toLowerCase().replace(/[\s-]/g, '').substring(0, 8))
  );
  
  if (!htmlMatch) {
    mismatches.push('MISSING: ' + csvEntry.vendor + ' | ' + csvEntry.name + ' ' + csvEntry.strength + ' | $' + csvEntry.price);
  } else if (Math.abs(htmlMatch.price - csvEntry.price) > 0.02) {
    mismatches.push('PRICE MISMATCH: ' + csvEntry.vendor + ' | ' + csvEntry.name + ' - CSV: $' + csvEntry.price + ' vs HTML: $' + htmlMatch.price);
  }
});

if (mismatches.length) {
  console.log('ISSUES FOUND:');
  mismatches.forEach(m => console.log('  ' + m));
} else {
  console.log('All restored vendor data matches CSV!');
}
