#!/usr/bin/env python3
"""Add affiliate links and codes to all 26 affiliate vendors in the site mockup."""
import re

# All affiliate vendors with their URLs, codes, and expected name in HTML
AFFILIATES = {
    'aio peptides': {'url': 'https://aiopeptides.com', 'code': 'Kikiriki', 'tier': 'green', 'display': 'AIO Peptides'},
    'ameano peptides (amp)': {'url': 'https://ameanopeptides.com', 'code': 'KIKIRIKI', 'tier': 'green'},
    'ascension peptides': {'url': None, 'code': 'Kikiriki', 'tier': 'green'},
    'authentic aminos': {'url': 'https://authenticaminos.com', 'code': 'Kikiriki', 'tier': 'green', 'display': 'Authentic Aminos'},
    'bc9': {'url': 'https://bc9.co', 'code': 'Kikiriki', 'tier': 'green', 'display': 'BC9'},
    'biolongevity labs': {'url': 'https://biolongevitylabs.com', 'code': 'Kikiriki', 'tier': 'green'},
    'biopeptitech': {'url': 'https://biopeptitech.com', 'code': 'Kikiriki', 'tier': 'green'},
    'elev8': {'url': 'https://elev8labs.is', 'code': 'Kikiriki', 'tier': 'green', 'display': 'Elev8'},
    'eqno': {'url': 'https://eqno.com', 'code': 'Kikiriki', 'tier': 'green', 'display': 'EQNO'},
    'ez peptides': {'url': 'https://ezpeptides.com/ref/Kikiriki/', 'code': 'KIKIRIKI', 'tier': 'green'},
    'felix chem': {'url': 'https://felixchem.is/refer/11167/', 'code': None, 'tier': 'green'},
    "half natty's": {'url': None, 'code': 'kiki', 'tier': 'green'},
    'ignition chems': {'url': 'https://ignitionchems.com/?ref=jesekwwb', 'code': 'jesekwwb', 'tier': 'green'},
    'instant peptides': {'url': 'https://instantpeptides.com', 'code': 'Kikiriki', 'tier': 'green'},
    'licensed peptides': {'url': None, 'code': 'Affiliate5', 'tier': 'green'},
    'orbitrex peptides': {'url': 'https://orbitrexpeptide.is', 'code': 'Kikiriki10', 'tier': 'yellow'},
    'penguin peptides': {'url': 'https://penguinpeptides.com', 'code': 'Kikiriki', 'tier': 'yellow'},
    'rejuvenation wellness': {'url': None, 'code': 'bts8am95', 'tier': 'yellow'},
    'reta one labs': {'url': 'https://retaonelabs.com/ref/5cby8/', 'code': '5cby8', 'tier': 'yellow'},
    'royal peptides': {'url': 'https://royal-peptides.com', 'code': 'kikiriki', 'tier': 'yellow'},
    'sports technology labs': {'url': 'https://sportstechnologylabs.com', 'code': 'Kikiriki', 'tier': 'yellow'},
    'strate labs': {'url': 'https://stratelabs.is', 'code': 'kikiriki', 'tier': 'green'},
    'synagenics': {'url': 'https://synagenics.com', 'code': 'Kikiriki', 'tier': 'yellow'},
    'tcore biotech': {'url': 'https://tcorebiotech.com', 'code': 'Kikiriki', 'tier': 'green', 'display': 'TCore Biotech'},
    'tru lab peptides': {'url': 'https://trulabpeptides.com', 'code': 'Kikiriki', 'tier': 'yellow'},
    'tydes': {'url': 'https://tydes.is', 'code': 'Kikiriki', 'tier': 'green'},
}

with open('prc_site_mockup_final.html', 'r') as f:
    html = f.read()

updated = 0
added = 0

for name_key, info in AFFILIATES.items():
    # Check if vendor exists in HTML
    pattern = r'data-name="' + re.escape(name_key) + r'"'
    if not re.search(pattern, html, re.IGNORECASE):
        # Vendor missing — need to add it
        # Find insertion point in the correct tier section
        display = info.get('display', name_key.title())
        tier = info['tier']
        
        # Build the vendor row
        name_html = display
        if info['url']:
            name_html = '<a href="' + info['url'] + '" target="_blank" rel="noopener">' + display + '</a>'
        
        code_html = ''
        if info['code']:
            code_html = '<div class="vendor-aff">Code: <strong>' + info['code'] + '</strong></div>'
        
        new_row = '<div class="vendor-row" data-tier="' + tier + '" data-name="' + name_key + '">'
        new_row += '<div class="vendor-name">' + name_html + '</div>'
        new_row += '<span class="vendor-tier" style="color:' + ('#10B981' if tier == 'green' else '#EAB308' if tier == 'yellow' else '#F97316' if tier == 'orange' else '#EF4444') + '">'
        new_row += ('Verified' if tier == 'green' else 'Use Caution' if tier == 'yellow' else 'Warning' if tier == 'orange' else 'Not Recommended')
        new_row += '</span>'
        new_row += code_html
        new_row += '</div>\n'
        
        # Insert after the last vendor of same tier
        last_match = None
        for m in re.finditer(r'data-tier="' + tier + r'"', html):
            last_match = m
        
        if last_match:
            # Find end of that vendor row
            end_pos = html.find('</div>', last_match.end()) + 6
            html = html[:end_pos] + '\n' + new_row + html[end_pos:]
            added += 1
            print(f'ADDED: {display} ({tier})')
    else:
        # Vendor exists — update with link and code
        # Find the vendor row
        match = re.search(r'(<div class="vendor-row"[^>]*data-name="' + re.escape(name_key) + r'"[^>]*>)(.*?)(</div>\s*(?=<div class="vendor-row"|</div>))', html, re.DOTALL | re.IGNORECASE)
        if not match:
            # Try simpler pattern
            match = re.search(r'(<div class="vendor-row"[^>]*data-name="' + re.escape(name_key) + r'"[^>]*>)(.*?</div>)', html, re.DOTALL | re.IGNORECASE)
        
        if match:
            row_start = match.group(1)
            row_content = match.group(2)
            
            # Get display name
            name_match = re.search(r'<div class="vendor-name">(.*?)</div>', row_content)
            if name_match:
                current_name = name_match.group(1)
                display = info.get('display', None)
                
                # Add link if missing and we have URL
                if info['url'] and 'href=' not in current_name:
                    clean_name = re.sub(r'<[^>]+>', '', current_name).strip()
                    if display:
                        clean_name = display
                    new_name = '<a href="' + info['url'] + '" target="_blank" rel="noopener">' + clean_name + '</a>'
                    row_content = row_content.replace(current_name, new_name)
                    updated += 1
                    print(f'LINKED: {clean_name} → {info["url"]}')
                
                # Add code if missing and we have code
                if info['code'] and 'vendor-aff' not in row_content:
                    code_html = '<div class="vendor-aff">Code: <strong>' + info['code'] + '</strong></div>'
                    # Insert before closing
                    row_content = row_content.rstrip()
                    # Find the last </div> or </span> and insert after it
                    last_tag = max(row_content.rfind('</div>'), row_content.rfind('</span>'))
                    if last_tag > 0:
                        insert_pos = last_tag + (6 if row_content[last_tag+1] == '/' and row_content[last_tag+2:last_tag+5] == 'div' else 7)
                        row_content = row_content[:insert_pos] + '\n' + code_html + row_content[insert_pos:]
                    updated += 1
                    print(f'CODED: {name_key} → {info["code"]}')
            
            html = html[:match.start()] + row_start + row_content + html[match.end():]

print(f'\nTotal: {updated} updated, {added} added')

with open('prc_site_mockup_final.html', 'w') as f:
    f.write(html)
