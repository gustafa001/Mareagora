import pdfplumber, re, json, sys, glob, os
from collections import defaultdict

MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
         'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
MESES_NUM = {m: i+1 for i, m in enumerate(MESES)}


def parse_tide_from_text(text_lines, mes_num, ano):
    eventos = []
    dia_atual = None
    mares_do_dia = []
    
    def salvar_dia():
        nonlocal dia_atual, mares_do_dia
        if dia_atual and mares_do_dia:
            data_str = f'{ano}-{mes_num:02d}-{dia_atual:02d}'
            seen = set()
            clean = []
            for m in sorted(mares_do_dia, key=lambda x: x.get('hora', '')):
                h = m.get('hora', '')
                if h and h not in seen:
                    clean.append(m)
                    seen.add(h)
            if clean:
                eventos.append({'data': data_str, 'mares': clean})
            dia_atual = None
            mares_do_dia = []
    
    for line in text_lines:
        line = line.strip()
        if not line:
            continue
        
        parts = line.split()
        i = 0
        while i < len(parts):
            part = parts[i].strip()
            if not part:
                i += 1
                continue
            
            if re.match(r'^\d{1,2}$', part):
                val = int(part)
                if 1 <= val <= 31:
                    salvar_dia()
                    dia_atual = val
                    i += 1
                    continue
            
            clean = part.replace(',', '.')
            
            if len(clean) == 4 and re.match(r'^\d{4}$', clean):
                h = int(clean[:2])
                m = int(clean[2:])
                if 0 <= h <= 23 and 0 <= m <= 59 and dia_atual:
                    altura = None
                    if i + 1 < len(parts):
                        next_p = parts[i + 1].replace(',', '.')
                        alt_match = re.search(r'(\d+\.\d+)', next_p)
                        if alt_match:
                            altura = float(alt_match.group(1))
                    
                    if altura is not None:
                        mares_do_dia.append({
                            'hora': f'{h:02d}:{m:02d}',
                            'altura_m': altura
                        })
                    i += 2
                    continue
            
            if len(clean) > 4:
                match = re.match(r'^(\d{4})(\d+\.\d+)$', clean)
                if match:
                    h = int(match.group(1)[:2])
                    m_val = int(match.group(1)[2:4])
                    alt = float(match.group(2))
                    if 0 <= h <= 23 and 0 <= m_val <= 59 and dia_atual:
                        mares_do_dia.append({
                            'hora': f'{h:02d}:{m_val:02d}',
                            'altura_m': alt
                        })
                    i += 1
                    continue
            
            i += 1
    
    salvar_dia()
    return eventos


def extrair_pagina(page, meses_pagina, ano):
    text = page.extract_text()
    lines = text.split('\n')
    
    eventos = []
    for mes in meses_pagina:
        mes_num = MESES_NUM.get(mes, 1)
        page_events = parse_tide_from_text(lines, mes_num, ano)
        eventos.extend(page_events)
    
    return eventos


def extrair_pdf(caminho_pdf):
    with pdfplumber.open(caminho_pdf) as pdf:
        text0 = pdf.pages[0].extract_text() or ''
        lines = [l.strip() for l in text0.split('\n') if l.strip()]

    nome_linha = ""
    for l in lines[:15]:
        if 'PORTO' in l.upper() or 'TERMINAL' in l.upper() or 'ILHA' in l.upper():
            nome_linha = l
            break
    
    if not nome_linha:
        nome_linha = lines[0] if lines else ""

    ano_match = re.search(r'(20\d\d)', nome_linha)
    ano = int(ano_match.group(1)) if ano_match else 2026

    lat_match = re.search(r"Latitude\s+([\d°\s'\.]+[NS])", text0)
    lon_match = re.search(r"Longitude\s+([\d°\s'\.]+[WE])", text0)
    fuso_match = re.search(r"Fuso\s+UTC\s*([-+]?\d+\.?\d*)", text0)
    nivel_match = re.search(r'Nível\s+Médio\s+([\d\.]+)\s*m', text0)
    
    estado_match = re.search(r'\(ESTADO\s+D[AO]S?\s+(.+?)\)', nome_linha, re.IGNORECASE)
    estado = estado_match.group(1).title() if estado_match else ''

    nome_limpo = re.sub(r'\(ESTADO.+?\)', '', nome_linha, flags=re.IGNORECASE)
    nome_limpo = re.sub(r'\s*-\s*20\d\d.*', '', nome_limpo)
    nome_limpo = re.sub(r'^[\d\s\-]+', '', nome_limpo).strip()

    todos_eventos = []
    
    for i, page in enumerate(pdf.pages):
        text_page = page.extract_text() or ''
        text_upper = text_page.upper()
        
        meses_na_pagina = [m for m in MESES if m.upper() in text_upper]
        
        if meses_na_pagina:
            print(f"      Pagina {i}: {', '.join(meses_na_pagina)}")
            for mes in meses_na_pagina:
                mes_num = MESES_NUM.get(mes, 1)
                linhas = text_page.split('\n')
                eventos = parse_tide_from_text(linhas, mes_num, ano)
                todos_eventos.extend(eventos)

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


if __name__ == '__main__':
    entrada = sys.argv[1] if len(sys.argv) > 1 else 'pdfs'
    saida_dir = sys.argv[2] if len(sys.argv) > 2 else 'data'
    os.makedirs(saida_dir, exist_ok=True)

    pdfs = (sorted(glob.glob(os.path.join(entrada, '*.pdf')) +
                   glob.glob(os.path.join(entrada, '*.PDF')))
            if os.path.isdir(entrada) else [entrada])

    if not pdfs:
        print(f'Nenhum PDF encontrado em: {entrada}')
        sys.exit(1)

    print(f'Processando {len(pdfs)} PDF(s)\n')

    ok = avisos = erros = 0

    for pdf_path in pdfs:
        nome_base = os.path.splitext(os.path.basename(pdf_path))[0]
        nome_json = re.sub(r'[^\w\-]', '_', nome_base).lower() + '.json'
        saida_path = os.path.join(saida_dir, nome_json)

        try:
            print(f"  Processando: {nome_base}")
            resultado = extrair_pdf(pdf_path)
            total_dias = len(resultado['eventos'])
            total_mares = sum(len(ev['mares']) for ev in resultado['eventos'])
            media_mares = total_mares / total_dias if total_dias > 0 else 0

            status = '[OK]' if total_dias >= 350 else '[AVISO]' if total_dias >= 200 else '[ERRO]'
            print(f'  {status} {nome_base}')
            print(f'         Porto : {resultado["porto"]} ({resultado["estado"]})')
            print(f'         Dias  : {total_dias} | Mares/dia media: {media_mares:.2f}')

            with open(saida_path, 'w', encoding='utf-8') as f:
                json.dump(resultado, f, ensure_ascii=False, indent=2)
            print(f'         Salvo : {saida_path}\n')

            ok += 1 if total_dias >= 350 else 0
            avisos += 1 if 200 <= total_dias < 350 else 0
            erros += 1 if total_dias < 200 else 0

        except Exception as e:
            import traceback
            print(f'  [ERRO] {nome_base}: {e}')
            traceback.print_exc()
            erros += 1

    print(f'\n{"="*60}')
    print(f'Concluido: {ok} OK (>=350 dias) | {avisos} AVISO | {erros} ERRO')
    print(f'{"="*60}')
