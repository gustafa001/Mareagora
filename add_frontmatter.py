import os
import re
from datetime import datetime

blog_dir = '/home/ubuntu/mareagora/content/blog'

for filename in os.listdir(blog_dir):
    if not filename.endswith('.md'):
        continue
        
    filepath = os.path.join(blog_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Check if already has frontmatter
    if content.startswith('---'):
        continue
        
    # Extract info
    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    pub_match = re.search(r'\*\*Publicado em:\*\*\s+(.+)$', content, re.MULTILINE)
    cat_match = re.search(r'\*\*Categoria:\*\*\s+(.+)$', content, re.MULTILINE)
    tags_match = re.search(r'\*\*Tags:\*\*\s+(.+)$', content, re.MULTILINE)
    
    title = title_match.group(1).strip() if title_match else filename.replace('.md', '').replace('-', ' ').title()
    
    # Parse date (e.g., "Abril de 2026" -> "2026-04-01")
    date_str = pub_match.group(1).strip() if pub_match else "2026-04-01"
    date_map = {
        'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
        'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
        'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
    }
    
    parsed_date = "2026-04-01" # Default
    for pt_month, num in date_map.items():
        if pt_month in date_str.lower():
            year_match = re.search(r'\d{4}', date_str)
            year = year_match.group(0) if year_match else "2026"
            parsed_date = f"{year}-{num}-01"
            break
            
    category = cat_match.group(1).strip() if cat_match else "Geral"
    
    tags_str = tags_match.group(1).strip() if tags_match else ""
    tags = [t.strip() for t in tags_str.split(',')] if tags_str else []
    tags_yaml = "\n".join([f"  - {t}" for t in tags])
    
    # Extract excerpt (first paragraph after the metadata block)
    # Find the end of the metadata block (usually marked by --- or just empty lines)
    parts = re.split(r'---\n+', content, 1)
    if len(parts) > 1:
        body = parts[1]
    else:
        # Try to find the first paragraph after the tags
        body_match = re.search(r'\*\*Tags:\*\*[^\n]*\n+(.+)', content, re.DOTALL)
        body = body_match.group(1) if body_match else content
        
    # Find first non-empty paragraph for excerpt
    paragraphs = [p.strip() for p in body.split('\n\n') if p.strip() and not p.strip().startswith('#')]
    excerpt = paragraphs[0] if paragraphs else ""
    # Clean up excerpt (remove markdown, truncate)
    excerpt = re.sub(r'\*\*|\*|__|_|`', '', excerpt)
    if len(excerpt) > 150:
        excerpt = excerpt[:147] + "..."
        
    # Escape quotes in title and excerpt
    title = title.replace('"', '\\"')
    excerpt = excerpt.replace('"', '\\"')
    
    frontmatter = f"""---
title: "{title}"
date: "{parsed_date}"
category: "{category}"
tags:
{tags_yaml}
excerpt: "{excerpt}"
---
"""
    
    # Remove the old metadata block from content
    new_content = re.sub(r'^#\s+.*?\n', '', content, count=1, flags=re.MULTILINE)
    new_content = re.sub(r'\*\*Publicado em:\*\*.*?\n', '', new_content, count=1)
    new_content = re.sub(r'\*\*Categoria:\*\*.*?\n', '', new_content, count=1)
    new_content = re.sub(r'\*\*Tags:\*\*.*?\n', '', new_content, count=1)
    new_content = re.sub(r'^---\n', '', new_content, count=1, flags=re.MULTILINE)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(frontmatter + new_content.lstrip())
        
print("Frontmatter adicionado a todos os ficheiros.")
