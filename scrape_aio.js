// Quick AIO scrape helper - parse snapshot text
const products = [];

// Page 1 data (from snapshot)
const p1 = [
  {name: "Prostamax", strength: "20mg", price: "64.00"},
  {name: "RETA/CAGRI", strength: "8mg/2mg", price: "92.00"},
  {name: "Cerebrolysin", strength: "60mg", price: "64.00"},
  {name: "Tesamorelin/Ipamorelin", strength: "12mg/6mg", price: "100.00"},
  {name: "VIP", strength: "5mg", price: "48.00"},
  {name: "Vesugen", strength: "20mg", price: "64.00"},
  {name: "Bronchogen", strength: "20mg", price: "64.00"},
  {name: "AHK-Cu", strength: "100mg", price: "52.00"},
];

p1.forEach(p => {
  const mg = parseFloat(p.strength);
  products.push({
    peptide: p.name,
    strength: p.strength,
    price: p.price,
    vendor: "AIO",
    prcProduct: "No",
    pricePerMg: !isNaN(mg) && mg > 0 ? (parseFloat(p.price)/mg).toFixed(2) : ""
  });
});

console.log(JSON.stringify(products, null, 2));
