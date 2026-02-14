#!/usr/bin/env python3
"""
Scrape BC9.co peptide products with all variants and prices
"""
import requests
from bs4 import BeautifulSoup
import json
import re
import time
from urllib.parse import urljoin

def extract_mg(text):
    """Extract milligrams from text like '5mg', '10 mg', etc."""
    if not text:
        return None
    match = re.search(r'(\d+(?:\.\d+)?)\s*mg', text.lower())
    return float(match.group(1)) if match else None

def extract_price(text):
    """Extract price from text like '$34.95' or '34.95'"""
    if not text:
        return None
    match = re.search(r'\$?(\d+(?:\.\d+)?)', text.replace(',', ''))
    return match.group(1) if match else None

def is_peptide_product(name, description=''):
    """Determine if a product is a peptide (not nootropic, accessory, etc.)"""
    name_lower = name.lower()
    desc_lower = description.lower()
    
    # Skip obvious non-peptides
    skip_keywords = [
        'modafinil', 'phenibut', 'racetam', 'noopept', 'adrafinil',
        'alpha-gpc', 'huperzine', 'syring', 'needle', 'bac water',
        'mixing', 'calculator', 'book', 'ebook', 'merchandise',
        'powder' # Many nootropics are powders
    ]
    
    for keyword in skip_keywords:
        if keyword in name_lower or keyword in desc_lower:
            # Exception: some peptides might have "powder" in name
            if 'peptide' in name_lower or 'peptide' in desc_lower:
                continue
            return False
    
    # Include if explicitly marked as peptide or has common peptide names
    peptide_keywords = [
        'peptide', 'bpc-', 'tb-500', 'cjc-', 'ipamorelin', 'sermorelin',
        'aod', 'fragment', 'mod grf', 'ghrp', 'hexarelin', 'selank',
        'semax', 'thymosin', 'epithalon', 'ghk-cu', 'adipotide',
        'tesamorelin', 'pt-141', 'melanotan', 'kisspeptin', 'gonadorelin',
        'igf', 'follistatin', 'aod', 'retatrutide', 'semaglutide',
        'tirzepatide', 'hgh', 'growth hormone', 'mots-c', 'humanin',
        'b7-33', 'arg'
    ]
    
    for keyword in peptide_keywords:
        if keyword in name_lower or keyword in desc_lower:
            return True
    
    return False

def scrape_product_details(url):
    """Scrape individual product page for variants and prices"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Get product name
        title_elem = soup.select_one('h1.product_title, h1')
        product_name = title_elem.text.strip() if title_elem else 'Unknown'
        
        # Check if it's a peptide
        description = soup.select_one('.woocommerce-product-details__short-description, .product-description')
        desc_text = description.text if description else ''
        
        if not is_peptide_product(product_name, desc_text):
            return []
        
        variants = []
        
        # Check for variations (dropdown)
        variation_select = soup.select_one('select#pa_size, select[name*="attribute"]')
        if variation_select:
            options = variation_select.find_all('option')
            for option in options:
                if option.get('value') and option.get('value') != '':
                    size_text = option.text.strip()
                    strength = extract_mg(size_text)
                    
                    # Try to find price for this variant
                    # This is tricky - WooCommerce often loads prices via JS
                    # We might need to make additional requests
                    variants.append({
                        'size_text': size_text,
                        'strength_mg': strength,
                        'price': None  # Will try to get from variation data
                    })
        
        # Try to find variation data in JSON
        variation_script = soup.find('script', text=re.compile(r'variations'))
        if variation_script:
            # Extract JSON data
            match = re.search(r'variations":\s*(\[.*?\])', variation_script.string, re.DOTALL)
            if match:
                try:
                    import json as json_module
                    variations_data = json_module.loads(match.group(1))
                    
                    for var_data in variations_data:
                        if 'attributes' in var_data and 'display_price' in var_data:
                            attrs = var_data['attributes']
                            size_attr = attrs.get('attribute_pa_size') or attrs.get('attribute_size', '')
                            price = var_data.get('display_price')
                            strength = extract_mg(size_attr)
                            
                            variants.append({
                                'size_text': size_attr,
                                'strength_mg': strength,
                                'price': str(price) if price else None
                            })
                except Exception as e:
                    print(f"Error parsing variation JSON: {e}")
        
        # If no variations found, check for simple product price
        if not variants:
            price_elem = soup.select_one('.price .amount, .woocommerce-Price-amount')
            if price_elem:
                price_text = price_elem.text.strip()
                price = extract_price(price_text)
                
                # Try to find size in product name or description
                strength = extract_mg(product_name) or extract_mg(desc_text)
                
                variants.append({
                    'size_text': product_name,
                    'strength_mg': strength,
                    'price': price
                })
        
        return [(product_name, var) for var in variants]
        
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return []

def scrape_bc9_shop():
    """Scrape all peptide products from BC9 shop"""
    base_url = "https://bc9.co/shop/"
    all_products = []
    
    # BC9 has 19 pages
    for page in range(1, 20):
        print(f"Scraping page {page}/19...")
        
        page_url = f"{base_url}?product-page={page}" if page > 1 else base_url
        
        try:
            response = requests.get(page_url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find product links
            product_links = soup.select('a.woocommerce-LoopProduct-link, h2.woocommerce-loop-product__title a, h3 a[href*="/product/"]')
            
            print(f"Found {len(product_links)} product links on page {page}")
            
            for link in product_links:
                product_url = link.get('href')
                if product_url:
                    product_url = urljoin(base_url, product_url)
                    print(f"  Fetching: {product_url}")
                    
                    product_variants = scrape_product_details(product_url)
                    all_products.extend(product_variants)
                    
                    # Be nice to the server
                    time.sleep(0.5)
            
            # Be nice between pages
            time.sleep(1)
            
        except Exception as e:
            print(f"Error scraping page {page}: {e}")
            continue
    
    return all_products

def main():
    """Main scraping function"""
    print("Starting BC9 scrape...")
    products = scrape_bc9_shop()
    
    print(f"\nFound {len(products)} peptide product variants")
    
    # Convert to required format
    output = []
    for product_name, variant in products:
        strength = variant.get('strength_mg')
        price = variant.get('price')
        
        # Calculate price per mg
        price_per_mg = None
        if price and strength and float(price) > 0 and strength > 0:
            price_per_mg = f"{float(price) / strength:.2f}"
        
        output.append({
            "peptide": product_name,
            "strength": f"{strength}mg" if strength else variant.get('size_text', 'Unknown'),
            "price": price if price else "Unknown",
            "vendor": "BC9",
            "prcProduct": "No",
            "pricePerMg": price_per_mg if price_per_mg else "N/A"
        })
    
    # Save to JSON
    output_path = "/Users/frabrizio/.openclaw/workspace/bc9_products.json"
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\nSaved {len(output)} products to {output_path}")

if __name__ == "__main__":
    main()
