"""
Re-extrai apenas os PDFs grandes (corretos) e salva com o nome esperado pelo app.
Mapeamento: PDF grande → nome do JSON que o app usa
"""

import pdfplumber, re, json, sys, os, datetime
from collections import defaultdict, Counter

MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
         'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
MESES_NUM = {m: i+1 for i, m in enumerate(MESES)}
DIAS_SEM = {'SEG','TER','QUA','QUI','SEX','SÁB','DOM'}

def _hora_to_min(hora_str):
    try:
        if ':' in hora_str:
            h, m = map(int, hora_str.split(':'))
        else:
            h, m = int(hora_str[:2]), int(hora_str[2:])
        return h * 60 + m
    except:
        return 0

def select_best_tides(mares, max_tides=4):
    if not mares: return []
    vistas = {}
    for m in mares:
        if m['hora'] not in vistas: vistas[m['hora']] = m
    unicas = sorted(vistas.values(), key=lambda x: x['hora'])
    if len(unicas) <= max_tides: return unicas
    alturas = [m['altura_m'] for m in unicas]
    mediana = sum(alturas) / len(alturas)
    preamares = sorted([m for m in unicas if m['altura_m'] >= mediana], key=lambda x: x['hora'])
    baixamares = sorted([m for m in unicas if m['altura_m'] < mediana], key=lambda x: x['hora'])
    selecionadas = []
    def add_safe(lista):
        for m in lista:
            if len(selecionadas) >= max_tides: break
            if not any(abs(_hora_to_min(m['hora']) - _hora_to_min(s['hora'])) < 30 for s in selecionadas):
                selecionadas.append(m)
    p, b = 0, 0
    while len(selecionadas) < max_tides and (p < len(preamares) or b < len(baixamares)):
        if p < len(preamares): add_safe([preamares[p]]); p += 1
        if b < len(baixamares): add_safe([baixamares[b]]); b += 1
    return sorted(selecionadas, key=lambda x: x['hora'])


# PDFs grandes → JSON destino esperado pelo app
# Formato: (nome_pdf, json_destino)
MAPA_PDFS = [
    # PDFs com versão grande correta (>500 KB)
    ("38 - PORTO DO AÇU - RJ - 122-124.pdf",              "38_-_porto_do_açu_-_124_-_126.json"),
    ("39 - TERMINAL MARÍTIMO DE IMBETIBA - RJ - 125-127.pdf", "39_-_terminal_marítimo_de_imbetiba_-_127_-_129.json"),
    ("41 - PORTO DE ITAGUAÍ - RJ - 131-133.pdf",          "41_-_porto_de_itaguaí_-_133_-_135.json"),
    ("42 - PORTO DO FORNO - RJ - 134-136.pdf",            "42_-_porto_do_forno_-_136_-_138.json"),
    ("44 - PORTO DE ANGRA DOS REIS - RJ - 140-142.pdf",   "44_-_porto_de_angra_dos_reis_-_142_-144.json"),
    # PDFs que geraram JSONs parciais - usar versão grande
    ("46 - PORTO DE SANTOS -  146-148.pdf",                "46_-_porto_de_santos_-_148_-_150.json"),
    # PDFs de 2025 (podem ter dados de anos anteriores) - testar
    ("4 - PORTO DO RIO DE JANEIRO - ILHA FISCAL (ESTADO DO RIO DE JANEIRO) - 2025 - Páginas 129 a 131.pdf",
                                                           "40_-_porto_do_rio_de_janeiro_-_i_fiscal_-_130_-_132.json"),
    ("5 - TERMINAL DA ILHA GUAÍBA (ESTADO DO RIO DE JANEIRO) - 2025 - Páginas 137 a 139.pdf",
                                                           "43_-_terminal_da_ilha_guaíba_-_139_-_141.json"),
    ("6 - PORTO DO RIO GRANDE (ESTADO DO RIO GRANDE DO SUL) - 2025 - Páginas 173 a 175.pdf",
                                                           "55_-_porto_do_rio_grande_-_175_-177.json"),
]

# Também rodar todos os PDFs pequenos de portos que têm JSON vazio (234 bytes)
PDFS_PEQUENOS_FALTANDO = [
    ("40 - PORTO DO RIO DE JANEIRO - I FISCAL - 130 - 132.pdf",
                                                           "40_-_porto_do_rio_de_janeiro_-_i_fiscal_-_130_-_132.json"),
    ("43 - TERMINAL DA ILHA GUAÍBA - 139 - 141.pdf",      "43_-_terminal_da_ilha_guaíba_-_139_-_141.json"),
    ("45 - PORTO DE SÃO SEBASTIÃO - 145 - 147.pdf",       "45_-_porto_de_são_sebastião_-_145_-_147.json"),
    ("47 - TERMINAL PORTUÁRIO DA PONTA DO FÉLIX  151 - 153.pdf",
                                                           "47_-_terminal_portuário_da_ponta_do_félix__151_-_153.json"),
    ("48 - PORTO DE PARANAGUÁ - CAIS OESTE - 154 - 156.pdf",
                                                           "48_-_porto_de_paranaguá_-_cais_oeste_-_154_-_156.json"),
    ("49 - BARRA DE PARANAGUÁ - CANAL SUESTE 157 - 159.pdf",
                                                           "49_-_barra_de_paranaguá_-_canal_sueste_157_-_159.json"),
    ("50 - BARRA DE PARANAGUÁ - CANAL DA GALHETA 160 -162.pdf",
                                                           "50_-_barra_de_paranaguá_-_canal_da_galheta_160_-162.json"),
    ("51 - PORTO DE SÃO FRANCISCO DO SUL - 163 -165.pdf", "51_-_porto_de_são_francisco_do_sul_-_163_-165.json"),
    ("52 - PORTO DE ITAJAÍ - 166 - 168.pdf",              "52_-_porto_de_itajaí_-_166_-_168.json"),
    ("55 - PORTO DO RIO GRANDE - 175 -177.pdf",           "55_-_porto_do_rio_grande_-_175_-177.json"),
]

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
        t = tokens[i]['text']
        if t in DIAS_SEM or t in MESES or t in ('HORA', 'ALT(m)', 'ALT', 'ALTURA'):
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
        if re.match(r'^\d{4}$', t):
            h, m = int(t[:2]), int(t[2:])
            if 0 <= h <= 23 and 0 <= m <= 59:
                if i + 1 < len(tokens):
                    next_t = tokens[i + 1]['text']
                    if re.match(r'^-?\d+[.,]\d+$', next_t):
                        alt = float(next_t.replace(',', '.'))
                        if -5 <= alt <= 15 and dia_atual:
                            mares_do_dia.append({'hora': f'{t[:2]}:{t[2:]}', 'altura_m': alt})
                        i += 2
                        continue
        i += 1
    salvar_dia()
    return eventos


def extrair_pagina(page, meses_pagina, ano):
    words = page.extract_words(x_tolerance=2, y_tolerance=3)
    hora_xs = sorted([w['x0'] for w in words if w['text'] == 'HORA'])
    if len(hora_xs) < 2:
        return []
    n_months = len(meses_pagina)
    subcols_per_month = len(hora_xs) // n_months

    def get_subcol_for_x(x0):
        for idx, hx in enumerate(hora_xs):
            x_start = hx - 25
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
                subcol_tokens[sc].append({'text': w['text'], 'top': w['top'], 'x0': w['x0']})

    for sc in subcol_tokens:
        subcol_tokens[sc].sort(key=lambda t: (round(t['top'] / 4) * 4, t['x0']))

    eventos = []
    for sc_idx in range(len(hora_xs)):
        month_idx = sc_idx // subcols_per_month
        if month_idx >= n_months:
            break
        mes = meses_pagina[month_idx]
        mes_num = MESES_NUM[mes]
        eventos.extend(parse_subcol_tokens(subcol_tokens[sc_idx], mes_num, ano))
    return eventos


def extrair_pdf(caminho_pdf):
    with pdfplumber.open(caminho_pdf) as pdf:
        text0 = pdf.pages[0].extract_text() or ''
        lines = [l.strip() for l in text0.split('\n') if l.strip()]
        nome_linha = ""
        for l in lines[:5]:
            if '2026' in l or '2025' in l:
                nome_linha = l
                break
        if not nome_linha and lines:
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
        nome_limpo = re.sub(r'^\d+\s*[-–]\s*', '', nome_limpo).strip()
        nome_limpo = re.sub(r'\s*-\s*Páginas.*', '', nome_limpo).strip()

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


if __name__ == '__main__':
    pdfs_dir = os.path.join(os.path.dirname(__file__), '..', 'pdfs')
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(data_dir, exist_ok=True)

    # Combina: PDFs grandes prioritários + PDFs pequenos complementares
    # Os grandes têm prioridade (substituem os pequenos)
    todos = list(MAPA_PDFS) + list(PDFS_PEQUENOS_FALTANDO)

    print(f"Iniciando re-extração de {len(todos)} PDF(s)...\n{'='*60}")
    ok = avisos = erros = 0

    for pdf_nome, json_dest in todos:
        pdf_path = os.path.join(pdfs_dir, pdf_nome)
        json_path = os.path.join(data_dir, json_dest)

        if not os.path.exists(pdf_path):
            print(f"  [SKIP] PDF não encontrado: {pdf_nome}")
            continue

        try:
            # Se o PDF for muito grande (> 1MB), é scan e precisa de OCR
            tamanho = os.path.getsize(pdf_path)
            if tamanho > 1024 * 1024:
                print(f"  [OCR] {pdf_nome} ({tamanho/1024/1024:.1f} MB)...")
                import subprocess
                # Usa o script de OCR existente
                cmd = [sys.executable, os.path.join(os.path.dirname(__file__), 'ocr_tide_extractor_v2.py'), pdf_path, json_path]
                proc = subprocess.run(cmd, capture_output=True, text=True)
                if proc.returncode == 0:
                    with open(json_path, 'r', encoding='utf-8') as f:
                        resultado = json.load(f)
                else:
                    print(f"  [ERRO OCR] {proc.stderr}")
                    erros += 1
                    continue
            else:
                resultado = extrair_pdf(pdf_path)

            total_dias = len(resultado.get('eventos', []))

            total_mares = sum(len(ev['mares']) for ev in resultado['eventos'])
            media = total_mares / total_dias if total_dias else 0

            # Se já existe um JSON melhor (mais dias), não sobrescreve
            if os.path.exists(json_path):
                with open(json_path, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
                existing_dias = len(existing.get('eventos', []))
                if existing_dias >= total_dias and existing_dias >= 350:
                    print(f"  [SKIP] {json_dest} já tem {existing_dias} dias (atual: {total_dias}) — mantido")
                    ok += 1
                    continue

            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(resultado, f, ensure_ascii=False, indent=2)

            status = '[OK]' if total_dias >= 350 else '[AVISO]' if total_dias >= 200 else '[ERRO]'
            print(f"  {status} {pdf_nome[:55]}")
            print(f"        Porto : {resultado['porto']}")
            print(f"        Dias  : {total_dias} | Marés/dia: {media:.2f} | Ano: {resultado['ano']}")
            print(f"        Salvo : {json_dest}\n")

            if total_dias >= 350: ok += 1
            elif total_dias >= 200: avisos += 1
            else: erros += 1

        except Exception as e:
            import traceback
            print(f"  [ERRO] {pdf_nome}: {e}")
            traceback.print_exc()
            erros += 1

    print(f"\n{'='*60}")
    print(f"Concluído: {ok} OK (>=350 dias) | {avisos} AVISO | {erros} ERRO")
    print(f"{'='*60}")

