import pdfplumber, re, json, sys, glob, os, datetime
from collections import defaultdict, Counter

MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
         'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
MESES_NUM = {m: i+1 for i, m in enumerate(MESES)}
DIAS_SEM = {'SEG','TER','QUA','QUI','SEX','SÁB','DOM'}


def parse_subcol_tokens(tokens, mes_num, ano):
    planos = []
    for t in tokens:
        txt = t['text']
        if re.match(r'^(\d{1,2})\.(\d{2,})$', txt):
            m = re.match(r'^(\d{1,2})\.(\d{2,})$', txt)
            planos.append(m.group(1))
            planos.append('0.' + m.group(2))
        elif len(txt) > 6 and re.match(r'^\d+$', txt):
            planos.append(txt)
        else:
            planos.append(txt)

    eventos = []
    dia_atual = None
    mares_do_dia = []

    def salvar_dia():
        if dia_atual and mares_do_dia:
            data_str = f'{ano}-{mes_num:02d}-{dia_atual:02d}'
            visto = set()
            limpos = []
            for m in sorted(mares_do_dia, key=lambda x: x['hora']):
                if m['hora'] not in visto:
                    limpos.append(m)
                    visto.add(m['hora'])
            eventos.append({'data': data_str, 'mares': limpos})

    i = 0
    while i < len(planos):
        t = planos[i]
        
        if t.upper() in DIAS_SEM or t.upper() in [m.upper() for m in MESES] or \
           t.upper() in ('HORA', 'ALT(M)', 'ALT', 'ALTURA', 'DIA', 'SEM'):
            i += 1
            continue
        
        if re.match(r'^\d{1,2}$', t):
            val = int(t)
            if 1 <= val <= 31:
                salvar_dia()
                dia_atual = val
                mares_do_dia = []
                i += 1
                continue
        
        t_limpo = t.replace(':', '').replace('.', ',').replace(',', '.')
        if len(t_limpo) == 4 and re.match(r'^\d{4}$', t_limpo):
            h, m = int(t_limpo[:2]), int(t_limpo[2:])
            if 0 <= h <= 23 and 0 <= m <= 59:
                if i + 1 < len(planos):
                    next_t = planos[i+1].replace(',', '.')
                    alt_match = re.search(r'(-?\d+\.\d+)', next_t)
                    if alt_match:
                        mares_do_dia.append({
                            'hora': f'{t_limpo[:2]}:{t_limpo[2:]}',
                            'altura_m': float(alt_match.group(1))
                        })
                        i += 2
                        continue
        
        if len(t_limpo) > 4 and re.match(r'^\d{4}-?\d+\.\d+$', t_limpo):
            h, m = int(t_limpo[:2]), int(t_limpo[2:4])
            alt = float(t_limpo[4:])
            if 0 <= h <= 23 and 0 <= m <= 59 and dia_atual:
                mares_do_dia.append({'hora': f'{h:02d}:{m:02d}', 'altura_m': alt})
                i += 1
                continue

        i += 1
    
    salvar_dia()
    return eventos


def extrair_pagina(page, meses_pagina, ano):
    words = page.extract_words(x_tolerance=2, y_tolerance=3)

    hora_tokens = [w for w in words if "HORA" in w['text'].upper() or "H/M" in w['text'].upper()]
    
    if not hora_tokens:
        hora_tokens = [w for w in words if "DIA" in w['text'].upper() and w['top'] < 150]
        
    hora_xs = sorted([w['x0'] for w in hora_tokens])
    
    if len(hora_xs) < 2:
        if page.width > 500:
             hora_xs = [65, 125, 195, 255, 325, 385, 455, 515]
        else:
             return []

    n_months = len(meses_pagina)
    subcols_per_month = len(hora_xs) // n_months if n_months > 0 else 2

    def get_subcol_for_x(x0):
        for idx, hx in enumerate(hora_xs):
            x_start = hx - 40
            x_end = hora_xs[idx + 1] - 25 if idx + 1 < len(hora_xs) else page.width + 50
            if x_start <= x0 < x_end:
                return idx
        return None

    lines_by_y = defaultdict(list)
    for w in words:
        y_key = round(w['top'] / 4) * 4
        lines_by_y[y_key].append(w)

    subcol_tokens = {idx: [] for idx in range(len(hora_xs))}

    for y_key in sorted(lines_by_y.keys()):
        if y_key < 88:
            continue
        for w in sorted(lines_by_y[y_key], key=lambda w: w['x0']):
            sc = get_subcol_for_x(w['x0'])
            if sc is not None:
                subcol_tokens[sc].append({
                    'text': w['text'],
                    'top': w['top'],
                    'x0': w['x0']
                })

    for sc in subcol_tokens:
        subcol_tokens[sc].sort(key=lambda t: (round(t['top'] / 4) * 4, t['x0']))

    eventos = []
    expected_subcols = n_months * 2
    actual_subcols = len(hora_xs)
    
    for month_idx in range(n_months):
        mes = meses_pagina[month_idx]
        mes_num = MESES_NUM[mes]
        
        for sub_in_month in [0, 1]:
            sc_idx = month_idx * 2 + sub_in_month
            if sc_idx < actual_subcols:
                eventos.extend(parse_subcol_tokens(subcol_tokens[sc_idx], mes_num, ano))

    return eventos


def extrair_pdf(caminho_pdf):
    with pdfplumber.open(caminho_pdf) as pdf:
        text0 = pdf.pages[0].extract_text() or ''
        lines = [l.strip() for l in text0.split('\n') if l.strip()]

        nome_linha = ""
        for l in lines[:5]:
            if '2026' in l and ('PORTO' in l.upper() or 'TERMINAL' in l.upper() or 'ILHA' in l.upper() or re.match(r'^\d+\s*-', l)):
                nome_linha = l
                break
        
        if not nome_linha and len(lines) > 0:
            nome_linha = lines[0]

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
            text_upper = (page.extract_text() or '').upper()
            meses_na_pagina = [m for m in MESES if m.upper() in text_upper]
            
            if meses_na_pagina:
                print(f"      Processando página {i}: {', '.join(meses_na_pagina)}")
                todos_eventos.extend(extrair_pagina(page, meses_na_pagina, ano))

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

    print(f'Processando {len(pdfs)} PDF(s) - Extrator v2 (sub-colunas independentes)\n')

    ok = avisos = erros = 0
    resultados_detalhados = []

    for pdf_path in pdfs:
        nome_base = os.path.splitext(os.path.basename(pdf_path))[0]
        nome_json = re.sub(r'[^\w\-]', '_', nome_base).lower() + '.json'
        saida_path = os.path.join(saida_dir, nome_json)

        try:
            resultado = extrair_pdf(pdf_path)
            total_dias = len(resultado['eventos'])
            total_mares = sum(len(ev['mares']) for ev in resultado['eventos'])
            media_mares = total_mares / total_dias if total_dias > 0 else 0

            status = '[OK]' if total_dias >= 350 else '[AVISO]' if total_dias >= 200 else '[ERRO]'
            print(f'  {status} {nome_base}')
            print(f'         Porto : {resultado["porto"]} ({resultado["estado"]})')
            print(f'         Dias  : {total_dias} | Marés/dia média: {media_mares:.2f} | Ano: {resultado["ano"]}')

            meses_cont = Counter(ev['data'][:7] for ev in resultado['eventos'])
            
            with open(saida_path, 'w', encoding='utf-8') as f:
                json.dump(resultado, f, ensure_ascii=False, indent=2)
            print(f'         Salvo : {saida_path}\n')

            ok += 1 if total_dias >= 350 else 0
            avisos += 1 if 200 <= total_dias < 350 else 0
            erros += 1 if total_dias < 200 else 0
            resultados_detalhados.append({'porto': nome_base, 'dias': total_dias, 'status': status})

        except Exception as e:
            import traceback
            print(f'  [ERRO] {nome_base}: {e}')
            traceback.print_exc()
            erros += 1

    print(f'\n{"="*60}')
    print(f'Concluído: {ok} OK (≥350 dias) | {avisos} AVISO | {erros} ERRO')
    print(f'{"="*60}')
