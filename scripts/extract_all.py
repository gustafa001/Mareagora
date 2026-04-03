"""
Extrai TODOS os PDFs de pdfmarinha e gera JSONs na pasta data/
Usa o extrator digital (reextract_missing) para PDFs pequenos
e OCR para PDFs grandes (scans)
"""
import pdfplumber, re, json, sys, os, datetime, glob
from collections import defaultdict, Counter

MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
         'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
MESES_NUM = {m: i+1 for i, m in enumerate(MESES)}
DIAS_SEM = {'SEG','TER','QUA','QUI','SEX','SÁB','DOM'}

def _hora_to_min(hora_str):
    try:
        h, m = map(int, hora_str.split(':'))
        return h * 60 + m
    except:
        return 0

def select_best_tides(mares, max_tides=4):
    if not mares: return []
    # Remove duplicates by time
    unique_by_time = {}
    for m in mares:
        if m['hora'] not in unique_by_time:
            unique_by_time[m['hora']] = m
    
    sorted_mares = sorted(unique_by_time.values(), key=lambda x: x['hora'])
    if len(sorted_mares) <= max_tides:
        return sorted_mares
        
    # Logic to pick the best 4: usually 2 highs and 2 lows
    # For now, just take the first 4 if they are well-spaced
    return sorted_mares[:max_tides]


def parse_subcol_tokens(tokens, mes_num, ano):
    eventos = []
    dia_atual = None
    mares_do_dia = []

    def salvar_dia():
        if dia_atual and mares_do_dia:
            try:
                data_str = f'{ano}-{mes_num:02d}-{dia_atual:02d}'
                datetime.date.fromisoformat(data_str)
                eventos.append({
                    'data': data_str,
                    'mares': select_best_tides(mares_do_dia)
                })
            except ValueError:
                pass

    i = 0
    while i < len(tokens):
        t = tokens[i]['text'].strip()
        if not t or t in DIAS_SEM or t in MESES or any(x in t.upper() for x in ['HORA', 'ALT', 'METROS']):
            i += 1
            continue
            
        # Day marker
        if re.match(r'^\d{1,2}$', t):
            val = int(t)
            if 1 <= val <= 31:
                salvar_dia()
                dia_atual = val
                mares_do_dia = []
                i += 1
                continue
                
        # Time marker (usually HH:MM or HHMM)
        if re.match(r'^\d{2}:?\d{2}$', t):
            hora = t if ':' in t else f"{t[:2]}:{t[2:]}"
            # Check next token for height
            if i + 1 < len(tokens):
                h_text = tokens[i+1]['text'].replace(',', '.')
                try:
                    altura = float(h_text)
                    # SANITY CHECK: Height must be reasonable (e.g. -2.0m to 10.0m)
                    # If it's a huge number, it's probably a misread time or coordinate
                    if -2.0 <= altura <= 10.0:
                        mares_do_dia.append({'hora': hora, 'altura_m': altura})
                        i += 2
                        continue
                    else:
                        # Possibly a misread. Skip height but keep time? 
                        # Or maybe the height is missing.
                        pass
                except ValueError:
                    pass
        i += 1
    salvar_dia()
    return eventos


def extrair_pagina(page, meses_pagina, ano):
    # REDUCED x_tolerance to better separate columns (HORA vs ALTURA)
    words = page.extract_words(x_tolerance=1.5, y_tolerance=3)
    
    # Identify column start X-positions
    hora_xs = sorted([w['x0'] for w in words if 'HORA' in w['text'].upper()])
    if not hora_xs:
        return []
        
    n_months = len(meses_pagina)
    # Some pages have 2 months, some have 4 columns per month (2 sets of HORA/ALT)
    # We need to group tokens by their horizontal position
    
    lines_by_y = defaultdict(list)
    for w in words:
        y_key = round(w['top'] / 4) * 4
        lines_by_y[y_key].append(w)

    # Group tokens by column
    def get_column_idx(x0):
        for idx, hx in enumerate(hora_xs):
            x_start = hx - 10
            x_end = hora_xs[idx+1] - 10 if idx + 1 < len(hora_xs) else 9999
            if x_start <= x0 < x_end:
                return idx
        return None

    col_tokens = {idx: [] for idx in range(len(hora_xs))}
    for y in sorted(lines_by_y.keys()):
        for w in sorted(lines_by_y[y], key=lambda x: x['x0']):
            c_idx = get_column_idx(w['x0'])
            if c_idx is not None:
                col_tokens[c_idx].append(w)

    eventos = []
    # Usually 12 columns total (4 months per page, 3 columns per month (DIA, HORA, ALT)?)
    # NO: The Marinha digital PDF usually has 4 months per page, 
    # but each month has TWO sub-columns of (HORA, ALT).
    # Total HORA columns = 8 for 4 months.
    
    subcols_per_month = len(hora_xs) // n_months if n_months > 0 else 1
    
    for c_idx in range(len(hora_xs)):
        m_idx = c_idx // subcols_per_month
        if m_idx < n_months:
            mes = meses_pagina[m_idx]
            mes_num = MESES_NUM[mes]
            eventos.extend(parse_subcol_tokens(col_tokens[c_idx], mes_num, ano))
            
    return eventos


def extrair_pdf(caminho_pdf):
    with pdfplumber.open(caminho_pdf) as pdf:
        text0 = pdf.pages[0].extract_text() or ''
        lines = [l.strip() for l in text0.split('\n') if l.strip()]
        
        # Find the line with the year
        nome_linha = ""
        for l in lines[:5]:
            if '2026' in l or '2025' in l:
                nome_linha = l
                break
        if not nome_linha and lines:
            nome_linha = lines[0]

        ano_match = re.search(r'(20\d\d)', nome_linha)
        ano = int(ano_match.group(1)) if ano_match else 2026

        lat_match = re.search(r"Latitude\s+([\d°\s'\\.]+[NS])", text0)
        lon_match = re.search(r"Longitude\s+([\d°\s'\\.]+[WE])", text0)
        fuso_match = re.search(r"Fuso\s+UTC\s*([-+]?\d+\.?\d*)", text0)
        nivel_match = re.search(r'Nível\s+Médio\s+([\d\\.]+)\s*m', text0)
        estado_match = re.search(r'\(ESTADO\s+D[AO]S?\s+(.+?)\)', nome_linha, re.IGNORECASE)
        estado = estado_match.group(1).title() if estado_match else ''
        
        # Clean porto name - more robust
        nome_limpo = re.sub(r'\(ESTADO.+?\)', '', nome_linha, flags=re.IGNORECASE)
        nome_limpo = re.sub(r'\s*-\s*20\d\d.*', '', nome_limpo)
        nome_limpo = re.sub(r'^\d+\s*[-–]\s*', '', nome_limpo).strip()
        nome_limpo = re.sub(r'\s*-\s*Páginas.*', '', nome_limpo).strip()
        
        # Extra cleanup: remove harmonic component info that sometimes leaks
        nome_limpo = re.sub(r'\s*(CHM|IBGE|UMISAN|DHN)\s+\d+\s+Componentes.*', '', nome_limpo, flags=re.IGNORECASE).strip()
        nome_limpo = re.sub(r'\s*Latitude\s+.*', '', nome_limpo, flags=re.IGNORECASE).strip()
        nome_limpo = re.sub(r'\s*\d+\s+Componentes.*', '', nome_limpo, flags=re.IGNORECASE).strip()

        paginas_meses = [MESES[0:4], MESES[4:8], MESES[8:12]]
        todos_eventos = []
        for i, page in enumerate(pdf.pages):
            if i >= len(paginas_meses):
                break
            todos_eventos.extend(extrair_pagina(page, paginas_meses[i], ano))

        todos_eventos.sort(key=lambda x: x['data'])
        seen = set()
        eventos_unicos = []
        for ev in todos_eventos:
            if ev['data'] not in seen:
                seen.add(ev['data'])
                eventos_unicos.append(ev)

        return {
            'porto': nome_limpo,
            'estado': estado,
            'lat': lat_match.group(1).strip() if lat_match else '',
            'lon': lon_match.group(1).strip() if lon_match else '',
            'fuso': ('UTC' + fuso_match.group(1)) if fuso_match else 'UTC-3',
            'nivel_medio': float(nivel_match.group(1)) if nivel_match else None,
            'ano': ano,
            'eventos': eventos_unicos
        }


# ============================================================
# NOME CORRETO baseado no nome do arquivo PDF
# ============================================================
def nome_do_pdf(pdf_basename):
    """Extrai nome limpo do porto a partir do nome do arquivo PDF"""
    n = pdf_basename.replace('.pdf', '')
    # Remove prefixo numérico
    n = re.sub(r'^\d+\s*[-–]\s*', '', n)
    # Remove sufixo de páginas
    n = re.sub(r'\s*[-–]\s*\d+\s*[-–]\s*\d+.*$', '', n)
    # Remove "(ESTADO ...)"
    n = re.sub(r'\s*\(ESTADO.+?\)', '', n, flags=re.IGNORECASE)
    # Remove "- 2026" etc
    n = re.sub(r'\s*[-–]\s*20\d\d.*', '', n)
    # Remove " - RJ" etc
    n = re.sub(r'\s*[-–]\s*[A-Z]{2}\s*$', '', n)
    # Remove "Páginas..."
    n = re.sub(r'\s*[-–]?\s*Páginas.*', '', n, flags=re.IGNORECASE)
    return n.strip()


if __name__ == '__main__':
    pdfs_dir = r'C:\Users\gusta\Desktop\pdfmarinha'
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    pdfs = sorted(glob.glob(os.path.join(pdfs_dir, '*.pdf')))
    
    print(f"Extraindo {len(pdfs)} PDFs de: {pdfs_dir}")
    print(f"Salvando em: {data_dir}")
    print("=" * 70)
    
    ok = avisos = erros = 0
    
    for pdf_path in pdfs:
        basename = os.path.basename(pdf_path)
        tamanho = os.path.getsize(pdf_path)
        
        # Gerar nome do JSON
        json_name = re.sub(r'[^\w\-]', '_', os.path.splitext(basename)[0]).lower() + '.json'
        json_path = os.path.join(data_dir, json_name)
        
        # Skip PDFs grandes (scans de 2025) que já foram processados
        if tamanho > 1024 * 1024:
            print(f"  [SCAN] {basename[:55]} ({tamanho/1024/1024:.1f}MB) - pulando (requer OCR)")
            continue
        
        try:
            resultado = extrair_pdf(pdf_path)
            total_dias = len(resultado.get('eventos', []))
            
            # Se o nome ficou ruim, usar o nome do PDF
            porto_nome = resultado['porto']
            if not porto_nome or any(x in porto_nome for x in ['Latitude', 'Componentes', 'CHM', 'IBGE', 'UMISAN', 'Nível']):
                porto_nome = nome_do_pdf(basename)
                resultado['porto'] = porto_nome
            
            # Só sobrescreve se tiver mais dados que o existente
            if os.path.exists(json_path):
                with open(json_path, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
                existing_dias = len(existing.get('eventos', []))
                if existing_dias >= total_dias and existing_dias >= 350:
                    # Mas corrige o nome se necessário
                    existing_nome = existing.get('porto', '')
                    if any(x in existing_nome for x in ['Latitude', 'Componentes', 'CHM', 'IBGE', 'UMISAN']):
                        existing['porto'] = porto_nome
                        with open(json_path, 'w', encoding='utf-8') as f:
                            json.dump(existing, f, ensure_ascii=False, indent=2)
                        print(f"  [NOME] {basename[:55]} - Nome corrigido para '{porto_nome}'")
                    else:
                        print(f"  [SKIP] {basename[:55]} - já tem {existing_dias} dias")
                    ok += 1
                    continue
            
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(resultado, f, ensure_ascii=False, indent=2)
            
            status = 'OK' if total_dias >= 350 else 'AVISO' if total_dias >= 200 else 'ERRO'
            print(f"  [{status}] {basename[:55]} -> {total_dias} dias | {porto_nome}")
            
            if total_dias >= 350: ok += 1
            elif total_dias >= 200: avisos += 1
            else: erros += 1
            
        except Exception as e:
            print(f"  [ERRO] {basename[:55]}: {e}")
            erros += 1
    
    print(f"\n{'=' * 70}")
    print(f"Resultado: {ok} OK | {avisos} AVISO | {erros} ERRO")
    print(f"{'=' * 70}")
    
    # Auditoria final
    print(f"\nAUDITORIA FINAL:")
    jsons = sorted(glob.glob(os.path.join(data_dir, '*.json')))
    total = len(jsons)
    bons = 0
    ruins = []
    for f in jsons:
        with open(f, 'r', encoding='utf-8') as fh:
            d = json.load(fh)
        dias = len(d.get('eventos', []))
        if dias >= 350:
            bons += 1
        else:
            ruins.append((os.path.basename(f), dias, d.get('porto', '???')))
    
    print(f"  Total JSONs: {total}")
    print(f"  Com >= 350 dias: {bons}")
    if ruins:
        print(f"  Problemas:")
        for nome, dias, porto in ruins:
            print(f"    {dias:3d} dias | {porto[:40]} | {nome}")
    else:
        print(f"  Sem problemas!")
