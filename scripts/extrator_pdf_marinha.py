import pdfplumber, re, json, sys, glob, os
from collections import defaultdict, Counter
import datetime

MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
         'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
MESES_NUM = {m: i+1 for i, m in enumerate(MESES)}

def detectar_blocos_x(words):
    """
    Detecta as faixas X de cada bloco dinamicamente usando os cabeçalhos HORA/ALT(m).
    O PDF tem 8 blocos por página (4 meses × 2 quinzenas).
    Cada bloco tem: [HORA] [ALT(m)] — dois cabeçalhos em top ≈ 102.
    """
    hora_headers = [w for w in words
                    if w['text'] == 'HORA' and 99 < w['top'] < 107]
    hora_headers.sort(key=lambda w: w['x0'])

    if len(hora_headers) < 8:
        return None  # fallback

    blocos = []
    for i in range(0, 8, 2):
        h1 = hora_headers[i]    # HORA da 1ª quinzena do mês
        h2 = hora_headers[i+1]  # HORA da 2ª quinzena do mês

        # Próximo cabeçalho HORA para definir fim
        h1_next = hora_headers[i+1]
        h2_next = hora_headers[i+2] if i+2 < 8 else None

        x_dia1   = h1['x0'] - 23
        x_hora1  = h1['x0']
        x_alt1   = h1['x0'] + 19
        x_fim1   = h1_next['x0'] - 5

        x_dia2   = h2['x0'] - 23
        x_hora2  = h2['x0']
        x_alt2   = h2['x0'] + 19
        x_fim2   = (h2_next['x0'] - 5) if h2_next else h2['x0'] + 60

        blocos.append((x_dia1, x_hora1, x_alt1, x_fim1))
        blocos.append((x_dia2, x_hora2, x_alt2, x_fim2))

    return blocos

def extrair_pagina(page, meses_pagina, ano):
    words = page.extract_words(x_tolerance=2, y_tolerance=2)
    blocos = detectar_blocos_x(words)

    if blocos is None:
        print(f"  [AVISO] Não foi possível detectar blocos na página", file=sys.stderr)
        return []

    resultados = {m: defaultdict(list) for m in meses_pagina}

    for bi, (x_dia, x_hora, x_alt, x_fim) in enumerate(blocos):
        mes_idx = bi // 2
        if mes_idx >= len(meses_pagina):
            continue
        mes = meses_pagina[mes_idx]

        bloco_words = [w for w in words
                       if x_dia <= w['x0'] < x_fim and w['top'] > 105]
        bloco_words.sort(key=lambda w: (round(w['top'] / 2) * 2, w['x0']))

        dia_atual = None
        for w in bloco_words:
            txt = w['text'].strip()
            x0  = w['x0']

            # Número de dia: coluna esquerda do bloco, texto 01-31
            if x_dia <= x0 < x_hora:
                m_dia = re.match(r'^(\d{1,2})$', txt)
                if m_dia:
                    d = int(m_dia.group(1))
                    if 1 <= d <= 31:
                        dia_atual = d

            # Hora: formato HHMM, 4 dígitos
            if x_hora <= x0 < x_alt and dia_atual is not None:
                if re.match(r'^\d{4}$', txt):
                    hora_fmt = txt[:2] + ':' + txt[2:]
                    resultados[mes][dia_atual].append({'hora': hora_fmt, 'altura_m': None})

            # Altitude: N.NN ou -N.NN
            if x_alt <= x0 < x_fim and dia_atual is not None:
                if re.match(r'^-?\d+\.\d+$', txt):
                    alt = float(txt)
                    for entry in reversed(resultados[mes][dia_atual]):
                        if entry['altura_m'] is None:
                            entry['altura_m'] = alt
                            break

    eventos = []
    for mes in meses_pagina:
        mes_num = MESES_NUM[mes]
        for dia in sorted(resultados[mes].keys()):
            mares = [m for m in resultados[mes][dia] if m['altura_m'] is not None]
            if not mares:
                continue
            try:
                data_str = f'{ano}-{mes_num:02d}-{dia:02d}'
                datetime.date.fromisoformat(data_str)
            except ValueError:
                continue
            mares_sorted = sorted(mares, key=lambda x: x['hora'])
            eventos.append({
                'data': data_str,
                'mares': [{'hora': m['hora'], 'altura_m': m['altura_m']} for m in mares_sorted]
            })
    return eventos

def extrair_pdf(caminho_pdf):
    with pdfplumber.open(caminho_pdf) as pdf:
        # ── Metadados da 1ª página ──
        text0 = pdf.pages[0].extract_text() or ''
        lines = [l.strip() for l in text0.split('\n') if l.strip()]

        # Título: 2ª linha não-vazia (ex: "TERMINAL DA ILHA GUAÍBA ... - 2026")
        nome_linha = lines[1] if len(lines) > 1 else ''

        ano_match  = re.search(r'(20\d\d)', nome_linha)
        ano        = int(ano_match.group(1)) if ano_match else 2026

        lat_match  = re.search(r"Latitude\s+([\d°\s'\.]+[NS])", text0)
        lon_match  = re.search(r"Longitude\s+([\d°\s'\.]+[WE])", text0)
        fuso_match = re.search(r"Fuso\s+UTC\s*([-+]?\d+\.?\d*)", text0)

        lat_str  = lat_match.group(1).strip()       if lat_match  else ''
        lon_str  = lon_match.group(1).strip()        if lon_match  else ''
        fuso_str = ('UTC' + fuso_match.group(1))     if fuso_match else 'UTC-3'

        estado_match = re.search(r'\(ESTADO\s+D[AO]\s+(.+?)\)', nome_linha, re.IGNORECASE)
        estado = estado_match.group(1).title() if estado_match else ''

        nome_limpo = re.sub(r'\s*-\s*20\d\d', '', nome_linha)
        nome_limpo = re.sub(r'\s*\(ESTADO.+?\)', '', nome_limpo, flags=re.IGNORECASE)
        nome_limpo = re.sub(r'^[\d\s\-]+', '', nome_limpo).strip()

        # Nível médio
        nivel_match = re.search(r'Nível\s+Médio\s+([\d\.]+)\s*m', text0)
        nivel_medio = float(nivel_match.group(1)) if nivel_match else None

        # ── Extração por página ──
        paginas_meses = [MESES[0:4], MESES[4:8], MESES[8:12]]
        todos_eventos = []
        for i, page in enumerate(pdf.pages):
            if i >= len(paginas_meses):
                break
            eventos_pag = extrair_pagina(page, paginas_meses[i], ano)
            todos_eventos.extend(eventos_pag)

        todos_eventos.sort(key=lambda x: x['data'])

        return {
            'porto':       nome_limpo,
            'estado':      estado,
            'lat':         lat_str,
            'lon':         lon_str,
            'fuso':        fuso_str,
            'nivel_medio': nivel_medio,
            'ano':         ano,
            'eventos':     todos_eventos
        }

# ─────────────────────────────────────────
# MODO DE USO
# ─────────────────────────────────────────
# python extrator_pdf_marinha.py PDF_OU_PASTA [OUTPUT_DIR]
#
# Exemplos:
#   python extrator_pdf_marinha.py pdfs/                    → gera JSONs em data/
#   python extrator_pdf_marinha.py pdfs/ saida/             → gera em saida/
#   python extrator_pdf_marinha.py porto_de_santos.pdf      → gera data/porto_de_santos.json
# ─────────────────────────────────────────

if __name__ == '__main__':
    entrada  = sys.argv[1] if len(sys.argv) > 1 else '.'
    saida_dir = sys.argv[2] if len(sys.argv) > 2 else 'data'
    os.makedirs(saida_dir, exist_ok=True)

    if os.path.isfile(entrada) and entrada.endswith('.pdf'):
        pdfs = [entrada]
    else:
        pdfs = sorted(glob.glob(os.path.join(entrada, '*.pdf')) +
                      glob.glob(os.path.join(entrada, '*.PDF')))

    if not pdfs:
        print(f'Nenhum PDF encontrado em: {entrada}')
        sys.exit(1)

    print(f'Processando {len(pdfs)} PDF(s)...\n')
    ok = 0
    erros = 0

    for pdf_path in pdfs:
        nome_base = os.path.splitext(os.path.basename(pdf_path))[0]
        # Normalizar nome do arquivo de saída
        nome_json = re.sub(r'[^\w\-]', '_', nome_base).lower() + '.json'
        saida_path = os.path.join(saida_dir, nome_json)

        try:
            resultado = extrair_pdf(pdf_path)
            total_dias = len(resultado['eventos'])

            if total_dias < 300:
                print(f'  [AVISO] {nome_base}')
                print(f'          → {total_dias} dias extraídos (esperado ~365)')
                # Mostrar quais meses foram capturados
                meses_cont = Counter(ev['data'][:7] for ev in resultado['eventos'])
                print(f'          → Meses: {sorted(meses_cont.keys())}')
            else:
                print(f'  [OK] {nome_base}')
                print(f'       → Porto: {resultado["porto"]} ({resultado["estado"]})')
                print(f'       → {total_dias} dias | {resultado["ano"]}')

            with open(saida_path, 'w', encoding='utf-8') as f:
                json.dump(resultado, f, ensure_ascii=False, indent=2)

            print(f'       → Salvo: {saida_path}\n')
            ok += 1

        except Exception as e:
            print(f'  [ERRO] {nome_base}: {e}\n')
            erros += 1

    print(f'Concluído: {ok} OK, {erros} erros.')
