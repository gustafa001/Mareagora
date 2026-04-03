import pdfplumber, re, json, sys, glob, os

MESES_LIST = ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO',
              'JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO']

def extract_metadata(text0, filename_hint=''):
    """
    Extract porto metadata.
    """
    header_lines = '\n'.join(text0.split('\n')[:8])
    ano_match = re.search(r'\b(20[12]\d)\b', header_lines)
    if not ano_match and filename_hint:
        ano_match = re.search(r'\b(20[12]\d)\b', os.path.basename(filename_hint))
    
    if ano_match:
        extracted_year = int(ano_match.group(1))
        # Enforce range or default to 2026 for this project
        ano = extracted_year if 2024 <= extracted_year <= 2030 else 2026
    else:
        ano = 2026

    nome_linha = ''
    for l in text0.split('\n')[:15]:
        lu = l.upper()
        if any(k in lu for k in ['PORTO', 'TERMINAL', 'ILHA', 'FUNDEADOURO',
                                  'ATRACADOURO', 'ARQUIPÉLAGO', 'ARQUIPELAGO',
                                  'BARRA']):
            nome_linha = l
            break

    if not nome_linha and filename_hint:
        base = os.path.splitext(os.path.basename(filename_hint))[0]
        base = re.sub(r'^\d+\s*-\s*', '', base)
        base = re.sub(r'\s*-\s*\d+\s*-\s*\d+.*$', '', base)
        nome_linha = base.strip()

    if not nome_linha:
        nome_linha = text0.split('\n')[0]

    lat_match  = re.search(r"Latitude\s+([\d°\s'\.]+[NS])", text0)
    lon_match  = re.search(r"Longitude\s+([\d°\s'\.]+[WE])", text0)
    fuso_match = re.search(r"Fuso\s+UTC\s*([-+]?\d+\.?\d*)", text0)
    nivel_match= re.search(r'N[ií]vel\s+M[eé]dio\s+([\d\.]+)\s*m', text0, re.IGNORECASE)

    estado_match = re.search(r'\(ESTADO\s+D[AO]S?\s+(.+?)\)', nome_linha, re.IGNORECASE)
    estado = estado_match.group(1).title() if estado_match else ''

    nome_limpo = re.sub(r'\(ESTADO.+?\)', '', nome_linha, flags=re.IGNORECASE)
    nome_limpo = re.sub(r'\s*-\s*20\d\d.*', '', nome_limpo)
    nome_limpo = re.sub(r'^[\d\s\-]+', '', nome_limpo).strip()

    return {
        'porto':       nome_limpo,
        'estado':      estado,
        'lat':         lat_match.group(1).strip()   if lat_match   else '',
        'lon':         lon_match.group(1).strip()    if lon_match   else '',
        'fuso':        ('UTC' + fuso_match.group(1)) if fuso_match  else 'UTC-3',
        'nivel_medio': float(nivel_match.group(1))   if nivel_match else None,
        'ano':         ano
    }

def detect_format(words, header_y):
    month_words = [w for w in words if header_y - 65 < w['top'] < header_y - 2]
    month_count = sum(1 for w in month_words
                      if re.sub(r'[^A-Za-zÀ-Ú]', '', w['text']).upper() in MESES_LIST)
    if month_count >= 2: return 'A'
    
    first_data = [w for w in words if header_y + 4 < w['top'] < header_y + 100]
    day_nums = [w for w in first_data if re.match(r'^(0[1-9]|[12]\d|3[01])$', w['text'])]
    if len(day_nums) >= 4: return 'A'
    return 'B'

def get_meses_in_page(words, header_y):
    month_words = [w for w in words if header_y - 65 < w['top'] < header_y - 2]
    meses = []
    for w in sorted(month_words, key=lambda x: x['x0']):
        txt = re.sub(r'[^A-Za-zÀ-Úà-úÇç]', '', w['text']).upper()
        txt = 'MARÇO' if txt == 'MARCO' else txt
        if txt in MESES_LIST:
            idx = MESES_LIST.index(txt) + 1
            if idx not in meses:
                if idx == 1 and any(m > 2 for m in meses): continue
                meses.append(idx)
    return meses

def extrair_formato_a(pdf, metainfo):
    ano = metainfo['ano']
    eventos_map = {}

    for page_num, page in enumerate(pdf.pages):
        words = page.extract_words()
        if not words: continue
        header_tops = [w['top'] for w in words if w['text'] == 'HORA']
        if not header_tops: continue
        header_y = min(header_tops)
        meses_in_page = get_meses_in_page(words, header_y)
        if len(meses_in_page) < 4:
            start_m = page_num * 4 + 1
            meses_in_page = list(range(start_m, start_m + 4))

        hora_words = sorted([w for w in words if w['text'] == 'HORA'], key=lambda w: w['x0'])
        if not hora_words:
            leftmost = min((w['x0'] for w in words if w['top'] > header_y + 4), default=30)
            hora_xs = [leftmost + 16 + i * 63.78 for i in range(8)]
        else:
            hora_xs = [w['x0'] for w in hora_words[:8]]
        
        # Calculate adaptive column widths
        widths = []
        for i in range(len(hora_xs) - 1):
            widths.append(hora_xs[i+1] - hora_xs[i])
        last_w = sorted(widths)[len(widths)//2] if widths else 63.78
        widths.append(last_w)

        col_bounds = []
        for i in range(len(hora_xs)):
            x_lo = hora_xs[i] - 30 
            x_hi = hora_xs[i] + widths[i] - 5
            if i == len(hora_xs)-1: x_hi = hora_xs[i] + 80
            col_bounds.append((x_lo, x_hi))

        data_words = [w for w in words if w['top'] >= header_y - 1.0]

        # Hybrid Sincronization (V16)
        for col_idx, (x_lo, x_hi) in enumerate(col_bounds):
            mes_idx = col_idx // 2
            mes_num = meses_in_page[mes_idx] if mes_idx < len(meses_in_page) else meses_in_page[-1]
            start_day = 17 if (col_idx % 2 == 1) else 1
            
            col_ws = [w for w in data_words if x_lo <= w['x0'] < x_hi and w['text'] not in ['HORA', 'ALTURA', 'ALT', 'DIA', 'PAGINA']]
            if not col_ws: continue
            col_ws = sorted(col_ws, key=lambda w: w['top'])

            # Group by Y bands
            rows = []
            for w in col_ws:
                if not rows or abs(w['top'] - rows[-1][0]['top']) > 2.5:
                    rows.append([w])
                else:
                    rows[-1].append(w)
            
            first_y = rows[0][0]['top']
            y_diffs = [rows[i+1][0]['top'] - rows[i][0]['top'] for i in range(min(5, len(rows)-1))]
            avg_h = sum(y_diffs)/len(y_diffs) if y_diffs else 10.0
            if avg_h < 3: avg_h = 3.0 # High precision for tiny fonts (Rio Grande)

            # Sticky Day Logic (V22)
            current_day = start_day
            for row in rows:
                row_y = row[0]['top']
                sorted_ws = sorted(row, key=lambda w: w['x0'])
                joined = "".join([w['text'] for w in sorted_ws])
                
                # Hard Sync: Explicit day number found in text
                day_match = re.search(r'([0-3][0-9])(?=\d{4})', joined)
                if day_match:
                    d = int(day_match.group(1))
                    if 1 <= d <= 31: 
                        current_day = d
                        # Strip day from string
                        sp = day_match.start(1)
                        joined = joined[:sp] + joined[sp+len(day_match.group(1)):]
                
                # Extract data (Can find multiple pairs in one row if they are merged)
                # Find all HORA+ALTURA pairs
                pairs = re.findall(r'([0-2][0-9][0-5][0-9])(-?\d*\.?\d+)', joined)
                for hstr, alt_str in pairs:
                    if '.' in alt_str:
                        parts = alt_str.split('.')
                        if len(parts[1]) > 2: alt_str = f"{parts[0]}.{parts[1][:2]}"
                    try:
                        alt = float(alt_str)
                        hh, mm = int(hstr[:2]), int(hstr[2:])
                        if 0 <= hh <= 23 and 0 <= mm <= 59:
                            data_str = f'{ano}-{mes_num:02d}-{current_day:02d}'
                            eventos_map.setdefault(data_str, {})
                            eventos_map[data_str][f'{hh:02d}:{mm:02d}'] = alt
                    except: pass
    
    return _build_eventos(eventos_map)

def extrair_formato_b(pdf, metainfo):
    ano = metainfo['ano']
    eventos_map = {}

    for page_num, page in enumerate(pdf.pages):
        words = page.extract_words()
        if not words: continue
        header_tops = [w['top'] for w in words if w['text'] == 'HORA']
        if not header_tops: continue
        header_y = min(header_tops)
        meses_in_page = get_meses_in_page(words, header_y)
        if len(meses_in_page) < 4:
            start_m = page_num * 4 + 1
            meses_in_page = list(range(start_m, start_m + 4))

        hora_words = sorted([w for w in words if w['text'] == 'HORA'], key=lambda w: w['x0'])
        if len(hora_words) < 8: continue
        hora_xs = [w['x0'] for w in hora_words[:8]]
        
        widths = []
        for i in range(len(hora_xs) - 1):
            widths.append(hora_xs[i+1] - hora_xs[i])
        last_w = sorted(widths)[len(widths)//2] if widths else 63.78
        widths.append(last_w)

        data_words = [w for w in words if w['top'] > header_y + 4.0]

        col_data = [[] for _ in range(8)]
        for w in data_words:
            best_ci = -1
            best_dist = 999
            for ci, hx in enumerate(hora_xs):
                dist = abs(w['x0'] - hx)
                rb = hx + widths[ci]
                if hx - 10 <= w['x0'] < rb - 2 and dist < best_dist:
                    best_dist = dist
                    best_ci = ci
            if best_ci >= 0: col_data[best_ci].append(w)

        for col_idx in range(8):
            mes_idx = col_idx // 2
            mes_num = meses_in_page[mes_idx] if mes_idx < len(meses_in_page) else meses_in_page[-1]
            start_day = 17 if (col_idx % 2 == 1) else 1
            # Skip header words themselves 
            col_ws = [w for w in col_data[col_idx] if w['text'] not in ['HORA', 'ALTURA', 'ALT', 'DIA']]
            if not col_ws: continue
            
            rows = []
            for w in col_ws:
                if not rows or abs(w['top'] - rows[-1][0]['top']) > 2.5:
                    rows.append([w])
                else:
                    rows[-1].append(w)
            
            first_y = rows[0][0]['top']
            y_diffs = [rows[i+1][0]['top'] - rows[i][0]['top'] for i in range(min(5, len(rows)-1))]
            avg_h = sum(y_diffs)/len(y_diffs) if y_diffs else 10.0
            if avg_h < 3: avg_h = 3.0 # High precision fallback

            for row in rows:
                row_y = row[0]['top']
                slot_idx = round((row_y - first_y) / avg_h)
                day_offset = slot_idx // 4
                current_day = start_day + day_offset
                
                sorted_ws = sorted(row, key=lambda w: w['x0'])
                joined = "".join([w['text'] for w in sorted_ws])
                match = re.search(r'([0-2][0-9][0-5][0-9])(-?\d*\.?\d+)', joined)
                if match:
                    hstr = match.group(1)
                    alt_str = match.group(2)
                    if '.' in alt_str:
                        parts = alt_str.split('.')
                        if len(parts[1]) > 2: alt_str = f"{parts[0]}.{parts[1][:2]}"
                    try:
                        alt = float(alt_str)
                        hh, mm = int(hstr[:2]), int(hstr[2:])
                        if 0 <= hh <= 23 and 0 <= mm <= 59:
                            data_str = f'{ano}-{mes_num:02d}-{current_day:02d}'
                            eventos_map.setdefault(data_str, {})
                            eventos_map[data_str][f'{hh:02d}:{mm:02d}'] = alt
                    except: pass

    return _build_eventos(eventos_map)

def _build_eventos(eventos_map):
    eventos_list = []
    for data_str in sorted(eventos_map.keys()):
        try:
            y, m, d = map(int, data_str.split('-'))
            if not (1 <= m <= 12 and 1 <= d <= 31): continue
        except: continue
        mares = sorted(
            [{'hora': h, 'altura_m': a} for h, a in eventos_map[data_str].items()],
            key=lambda x: x['hora']
        )
        eventos_list.append({'data': data_str, 'mares': mares})
    return eventos_list

def extrair_pdf(caminho_pdf):
    with pdfplumber.open(caminho_pdf) as pdf:
        text0 = pdf.pages[0].extract_text() or ''
        meta  = extract_metadata(text0, caminho_pdf)
        words0 = pdf.pages[0].extract_words()
        header_tops = [w['top'] for w in words0 if w['text'] == 'HORA']
        if header_tops:
            header_y = min(header_tops)
            fmt = detect_format(words0, header_y)
        else:
            fmt = 'B'

        if fmt == 'A':
            eventos = extrair_formato_a(pdf, meta)
        else:
            eventos = extrair_formato_b(pdf, meta)

    meta['eventos'] = eventos
    meta['formato'] = fmt
    return meta

if __name__ == '__main__':
    entrada   = sys.argv[1] if len(sys.argv) > 1 else 'pdfs'
    saida_dir = sys.argv[2] if len(sys.argv) > 2 else 'data'
    os.makedirs(saida_dir, exist_ok=True)
    pdfs = glob.glob(os.path.join(entrada, '*.pdf')) if os.path.isdir(entrada) else [entrada]
    pdfs = sorted(pdfs)

    print(f'Processando {len(pdfs)} PDF(s) — extrator V16 (Hybrid Sync)\n')
    ok = avisos = erros = 0

    for pdf_path in pdfs:
        nome_base = os.path.splitext(os.path.basename(pdf_path))[0]
        
        # Filtro de Antártica (Descartar conforme solicitado)
        if any(k in nome_base.upper() for k in ['ANTARTIDA', 'ANTÁRTICA', 'COMANDANTE FERRAZ', 'EST ANT']):
            print(f'  [DESC] {nome_base} (Ignorado: Fora do Brasil)')
            continue

        nome_json = re.sub(r'[^\w\-]', '_', nome_base).lower() + '.json'
        saida_path = os.path.join(saida_dir, nome_json)
        try:
            resultado = extrair_pdf(pdf_path)
            total_dias = len(resultado['eventos'])
            status = '[OK]' if total_dias >= 365 else '[AV]' if total_dias >= 350 else '[ER]'
            print(f'  {status} {resultado["porto"][:40]:<40} | {total_dias} dias | fmt={resultado["formato"]}')
            with open(saida_path, 'w', encoding='utf-8') as f:
                json.dump(resultado, f, ensure_ascii=False, indent=2)
            if total_dias >= 365: ok += 1
            elif total_dias >= 300: avisos += 1
            else: erros += 1
        except Exception as e:
            print(f'  [ERRO] {nome_base}: {e}')
            erros += 1

    print(f'\n{"="*60}')
    print(f'Concluído: {ok} OK (365) | {avisos} AVISO | {erros} ERRO')
    print(f'{"="*60}')
