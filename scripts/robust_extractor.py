import pdfplumber, os, re, json, datetime
from collections import defaultdict

# Configurações
MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
         'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
MESES_NUM = {m: i+1 for i, m in enumerate(MESES)}

def get_month_names_from_page(page_idx):
    if page_idx == 0: return MESES[0:4]   # Jan-Abr
    if page_idx == 1: return MESES[4:8]   # Mai-Ago
    if page_idx == 2: return MESES[8:12]  # Set-Dez
    return []

def split_fused_token(text):
    # Regex to catch fused time and height. Ex: "13471.2" -> ("13:47", 1.2)
    # Usually matches 4 digits (time) followed by height (with dot or comma)
    m = re.match(r'^(\d{2})(\d{2})(-?\d+[,.]\d+)$', text)
    if m:
        return f"{m.group(1)}:{m.group(2)}", float(m.group(3).replace(',', '.'))
    
    # Matches "08190.8" or "8190.8" (3-4 digits then height)
    m = re.match(r'^(\d{3,4})(-?\d+[,.]\d+)$', text)
    if m:
        t = m.group(1).zfill(4)
        return f"{t[:2]}:{t[2:]}", float(m.group(2).replace(',', '.'))
        
    return None, None

def extract_robust(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        # Detect year from first page
        text0 = pdf.pages[0].extract_text()
        ano_match = re.search(r'(202\d)', text0)
        ano = int(ano_match.group(1)) if ano_match else 2026
        
        # Metadata
        porto_meta = ""
        for line in text0.split('\n')[:5]:
            if str(ano) in line:
                porto_meta = line.strip()
                break
        
        all_eventos = []
        
        for p_idx, page in enumerate(pdf.pages):
            meses_na_pagina = get_month_names_from_page(p_idx)
            if not meses_na_pagina: continue
            
            # Extract words with minimal tolerance to prevent fusion
            words = page.extract_words(x_tolerance=0.5, y_tolerance=3)
            
            # Map headers (HORA position determines col behavior)
            headers = [w for w in words if any(x in w['text'].upper() for x in ['HORA', 'ALT'])]
            hora_cols = sorted([w for w in headers if 'HORA' in w['text'].upper()], key=lambda w: w['x0'])
            
            if not hora_cols: continue
            
            # Determine columns by X-ranges
            # Each month usually has 2 HORA/ALT columns.
            # We'll group words by their X center relative to headers.
            
            lines = defaultdict(list)
            for w in words:
                if w['top'] > 120: # Skip meta headers
                    y_key = round(w['top'] / 4) * 4
                    lines[y_key].append(w)
            
            for y in sorted(lines.keys()):
                line_words = sorted(lines[y], key=lambda w: w['x0'])
                
                # Each month block might have its own "Day" column
                # Strategy: Identify tokens that look like days (1-31) in early X positions
                # Then look for time/height pairs in the matched HORA columns.
                
                for m_idx, mes in enumerate(meses_na_pagina):
                    mes_num = MESES_NUM[mes]
                    
                    # Approximate X range for this month block (usually 1/4 of page)
                    m_x_start = (page.width / 4) * m_idx
                    m_x_end = (page.width / 4) * (m_idx + 1)
                    
                    m_words = [w for w in line_words if m_x_start - 5 <= w['x0'] < m_x_end + 5]
                    if not m_words: continue
                    
                    # Find day
                    dia_tokens = [w for w in m_words if re.match(r'^\d{1,2}$', w['text']) and w['x0'] < m_x_start + 40]
                    if not dia_tokens: continue
                    
                    dia = int(dia_tokens[0]['text'])
                    if not (1 <= dia <= 31): continue
                    
                    mares = []
                    # Find time/height pairs for this day/month
                    # We look for HH:MM tokens and adjacent height tokens
                    for i, w in enumerate(m_words):
                        t = w['text'].strip()
                        
                        # Already correct time format HH:MM
                        if re.match(r'^\d{2}:\d{2}$', t):
                            time_str = t
                            # Height should be next
                            if i + 1 < len(m_words):
                                h_text = m_words[i+1]['text']
                                try:
                                    h_val = float(h_text.replace(',', '.'))
                                    if -2.0 <= h_val <= 15.0:
                                        mares.append({'hora': time_str, 'altura_m': h_val})
                                except: pass
                        
                        # HHMM format (fused?)
                        elif re.match(r'^\d{4}$', t):
                            # Check next token first (it might be a separate height)
                            found_separate = False
                            if i + 1 < len(m_words):
                                h_text = m_words[i+1]['text']
                                try:
                                    h_val = float(h_text.replace(',', '.'))
                                    if -2.0 <= h_val <= 15.0:
                                        t_fmt = f"{t[:2]}:{t[2:]}"
                                        mares.append({'hora': t_fmt, 'altura_m': h_val})
                                        found_separate = True
                                except: pass
                            
                            if not found_separate:
                                # Maybe fused with height in this same token? But regex ^\d{4}$ excludes that.
                                # Just HHMM without height or height skipped.
                                t_fmt = f"{t[:2]}:{t[2:]}"
                                # Search for height in nearby words if not yet found
                                pass
                        
                        # Fused token (the "Santos" problem)
                        else:
                            t_fmt, h_val = split_fused_token(t)
                            if t_fmt and -2.0 <= h_val <= 15.0:
                                mares.append({'hora': t_fmt, 'altura_m': h_val})
                    
                    if mares:
                        # Clean date
                        try:
                            # Re-verify month/day validity
                            date_obj = datetime.date(ano, mes_num, dia)
                            all_eventos.append({
                                'data': date_obj.isoformat(),
                                'mares': sorted(mares, key=lambda x: x['hora'])
                            })
                        except: pass
                        
        # Final cleanup: deduplicate dates and sort
        all_eventos.sort(key=lambda x: x['data'])
        unique_eventos = []
        seen_dates = set()
        for ev in all_eventos:
            if ev['data'] not in seen_dates:
                seen_dates.add(ev['data'])
                unique_eventos.append(ev)
                
        return {
            'porto': porto_meta,
            'ano': ano,
            'eventos': unique_eventos
        }

if __name__ == "__main__":
    # Test on Santos
    test_pdf = r'c:\Users\gusta\Desktop\pdfmarinha\46 - PORTO DE SANTOS - 148 - 150.pdf'
    res = extract_robust(test_pdf)
    print(f"Porto: {res['porto']}")
    print(f"Total dias: {len(res['eventos'])}")
    if res['eventos']:
        print(f"Exemplo: {res['eventos'][0]}") # Check first day
        # Find April 17th
        apr17 = [e for e in res['eventos'] if e['data'] == '2026-04-17']
        print(f"Abril 17: {apr17}")
