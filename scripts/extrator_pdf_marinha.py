import pdfplumber, re, json, sys, glob, os
from collections import defaultdict, Counter
import datetime

MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
         'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
MESES_NUM = {m: i+1 for i, m in enumerate(MESES)}

def detectar_blocos_x(words, page):
    """
    Versão robusta:
    - aceita variações de 'HORA'
    - tolerância maior de posição
    - fallback automático se falhar
    """

    def is_hora(text):
        t = text.replace(" ", "").upper()
        return "HORA" in t

    hora_headers = [
        w for w in words
        if is_hora(w['text']) and 80 < w['top'] < 140
    ]

    # Ordenar por X0 para agrupar em pares
    hora_headers.sort(key=lambda w: w['x0'])

    # ✅ Layout padrão detectado
    if len(hora_headers) >= 4:
        blocos = []

        for i in range(0, len(hora_headers), 2):
            if i+1 >= len(hora_headers):
                break

            h1 = hora_headers[i]
            h2 = hora_headers[i + 1]

            h1_next = h2
            h2_next = hora_headers[i + 2] if i + 2 < len(hora_headers) else None

            blocos.append((h1['x0'] - 23, h1['x0'], h1['x0'] + 19, h1_next['x0'] - 5))
            blocos.append((h2['x0'] - 23, h2['x0'], h2['x0'] + 19,
                           (h2_next['x0'] - 5) if h2_next else h2['x0'] + 60))

        return blocos

    # 🔴 FALLBACK (usado se não detectar os cabeçalhos HORA, não perdendo a página)
    print("  [FALLBACK] Usando divisão por largura da página", file=sys.stderr)

    largura = page.width
    col_width = largura / 8

    blocos = []
    for i in range(8):
        x_base = i * col_width
        blocos.append((
            x_base,
            x_base + col_width * 0.3,
            x_base + col_width * 0.6,
            x_base + col_width
        ))

    return blocos

def extrair_pagina(page, meses_pagina, ano):
    words = page.extract_words(x_tolerance=2, y_tolerance=2)
    blocos = detectar_blocos_x(words, page)

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

            # DIA
            if x_dia <= x0 < x_hora:
                m_dia = re.match(r'^(\d{1,2})$', txt)
                if m_dia:
                    d = int(m_dia.group(1))
                    if 1 <= d <= 31:
                        dia_atual = d

            # HORA
            elif x_hora <= x0 < x_alt and dia_atual is not None:
                if re.match(r'^\d{4}$', txt):
                    resultados[mes][dia_atual].append(
                        {'hora': txt[:2] + ':' + txt[2:], 'altura_m': None}
                    )

            # ALTURA (aceita ponto ou vírgula)
            elif x_alt <= x0 < x_fim and dia_atual is not None:
                if re.match(r'^-?\d+[.,]?\d*$', txt):
                    alt = float(txt.replace(',', '.'))

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
