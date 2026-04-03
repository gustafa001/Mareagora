"""
Extrator de marés v2 - PDFs da Marinha do Brasil 2026
Melhorias em relação à v1:
  - Filtro de zona Y restritivo (102 < top < 790): exclui cabeçalho, rodapé
    "DG6-63 Original", número de página, símbolos de lua e dias da semana
    rotacionados que ficavam na zona "top < 5000" anterior
  - Validação de HORA: apenas tokens 4-dígitos com HH<=23 e MM<=59 são aceitos,
    excluindo números como "1405" (Carta náutica), "2026" (ano), etc.
  - Gap Y adaptativo: detecta automaticamente o limiar de separação entre dias
    a partir do espaçamento real da fonte no PDF — robusto para PDFs com
    tamanhos de fonte distintos
  - Largura da última coluna calculada pela mediana das demais, não fixada em 80px
  - Filtro de HORA duplicada por Y: evita contar duas vezes tokens na mesma linha
    horizontal (artefato de extração em PDFs com overlapping bounding boxes)
  - Fallback de agrupamento por reinício de hora mantido como segurança

Uso:
    python extrator_mare_2026.py                     # lê de ./pdfs/, salva em ./data/
    python extrator_mare_2026.py C:/pasta/pdfs       # pasta customizada de PDFs
    python extrator_mare_2026.py C:/pdfs C:/saida    # PDFs e saída customizados

Requisito: pip install pdfplumber
"""

import pdfplumber, re, json, datetime, calendar, glob, os, sys
from collections import defaultdict, Counter

MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
         'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
MESES_NUM = {m: i+1 for i, m in enumerate(MESES)}

# ── Zona de dados válida ────────────────────────────────────────────────────
# Cabeçalho (Latitude, HORA ALT(m)...): top ≈ 66–102
# Última linha de dados:                top ≈ 768–785
# Rodapé "DG6-63 Original":            top ≈ 23721
# Dias da semana rotacionados:          top ≈ 19225
# Número de página (124/125/126):       top ≈ 40–55 (abaixo do filtro de 102)
Y_MIN = 102   # exclui cabeçalho e número de página
Y_MAX = 790   # exclui tudo abaixo da última linha de dados


def hora_valida(token: str) -> bool:
    """Retorna True apenas para strings HHMM onde HH<=23 e MM<=59."""
    if not re.match(r'^\d{4}$', token):
        return False
    return int(token[:2]) <= 23 and int(token[2:]) <= 59


def detectar_gap_inter_dia(col_tokens):
    """
    Calcula o limiar de gap Y que separa linhas de dias distintos.

    Estratégia:
      - Coleta todos os gaps positivos entre horas consecutivas.
      - O gap intra-dia (entre marés do mesmo dia) é o mais frequente e pequeno.
      - O gap inter-dia (entre o último registro de um dia e o primeiro do próximo)
        é claramente maior.
      - Retorna o ponto médio entre os dois clusters de gap mais distintos.
    """
    tops = [w['top'] for w in col_tokens if hora_valida(w['text'])]
    if len(tops) < 4:
        return 15  # fallback seguro

    gaps = sorted(set(round(b - a, 1) for a, b in zip(tops, tops[1:]) if b - a > 0))
    if not gaps:
        return 15

    # Encontrar o maior salto no conjunto de gaps (ponto de corte entre clusters)
    if len(gaps) == 1:
        return gaps[0] * 1.5

    diffs = [(gaps[i+1] - gaps[i], i) for i in range(len(gaps)-1)]
    split_idx = max(diffs)[1]  # índice do maior salto

    intra = gaps[split_idx]       # gap maior do cluster intra-dia
    inter = gaps[split_idx + 1]   # gap menor do cluster inter-dia
    threshold = (intra + inter) / 2

    return max(threshold, 10)  # nunca menos que 10px por segurança


def get_hora_col_xs(mares_words):
    """Detecta automaticamente as posições X das colunas de HORA."""
    hora_xs_raw = sorted(set(round(w['x0']) for w in mares_words
                             if hora_valida(w['text'])))
    hora_xs_clean = []
    for x in hora_xs_raw:
        if not hora_xs_clean or x - hora_xs_clean[-1] > 20:
            hora_xs_clean.append(x)
    return hora_xs_clean[:8]


def calcular_largura_colunas(hora_col_xs):
    """
    Retorna lista de larguras de cada coluna.
    Para colunas intermediárias usa a diferença até a próxima.
    Para a última, usa a mediana das demais (mais robusto que fixar 80px).
    """
    n = len(hora_col_xs)
    widths = []
    for i in range(n - 1):
        widths.append(hora_col_xs[i+1] - hora_col_xs[i])
    if widths:
        median_w = sorted(widths)[len(widths)//2]
        widths.append(median_w)
    else:
        widths.append(80)
    return widths


def agrupar_pares(pares, gap_threshold):
    """
    Agrupa pares (hora, alt, y) em dias usando dois critérios:
    1. Gap de Y > gap_threshold entre horas consecutivas (adaptativo)
    2. Reinício de hora (hora atual < hora anterior em mais de 3h)
    """
    grupos = []
    grupo = []
    y_ant = -999
    hora_ant_min = -1

    for hora, alt, y in pares:
        hora_min = int(hora[:2]) * 60 + int(hora[3:])
        gap_y = y - y_ant
        reinicio = grupo and hora_min < hora_ant_min - 180

        if grupo and (gap_y > gap_threshold or reinicio):
            grupos.append(grupo)
            grupo = []
            hora_ant_min = -1

        grupo.append((hora, alt))
        y_ant = y
        hora_ant_min = hora_min

    if grupo:
        grupos.append(grupo)

    return grupos


def extrair_pdf(caminho_pdf):
    """
    Extrai todos os dados de maré de um PDF da Marinha.
    Retorna dict com porto, coordenadas, ano e lista de eventos.
    """
    with pdfplumber.open(caminho_pdf) as pdf:

        # ── Metadados (página 0) ──────────────────────────────────────────
        text0 = pdf.pages[0].extract_text() or ''
        lines0 = [l.strip() for l in text0.split('\n') if l.strip()]
        nome_linha = next(
            (l for l in lines0[:10] if '2026' in l or '2025' in l),
            lines0[0] if lines0 else ''
        )

        ano_match = re.search(r'(20\d\d)', nome_linha)
        ano = int(ano_match.group(1)) if ano_match else 2026

        lat_m  = re.search(r"Latitude\s+([\d°\s'\.]+[NS])", text0)
        lon_m  = re.search(r"Longitude\s+([\d°\s'\.]+[WE])", text0)
        fuso_m = re.search(r"Fuso\s+UTC\s*([-+]?\d+\.?\d*)", text0)
        niv_m  = re.search(r'Nível\s+Médio\s+([\d\.]+)\s*m', text0)
        est_m  = re.search(r'\(ESTADO\s+D[AO]S?\s+(.+?)\)', nome_linha, re.IGNORECASE)

        estado = est_m.group(1).title() if est_m else ''
        nome = re.sub(r'\(ESTADO.+?\)', '', nome_linha, flags=re.IGNORECASE)
        nome = re.sub(r'\s*-\s*20\d\d.*', '', nome)
        nome = re.sub(r'^\d+\s*[-–]\s*', '', nome)
        nome = re.sub(r'\s*-\s*Páginas.*', '', nome, flags=re.IGNORECASE).strip()

        todos_eventos = {}

        # ── Extrair dados de cada página ──────────────────────────────────
        for page_idx, page in enumerate(pdf.pages):
            meses_pag = MESES[page_idx * 4 : page_idx * 4 + 4]
            if not meses_pag:
                break

            words = page.extract_words(x_tolerance=2, y_tolerance=2)

            # ── FILTRO DE ZONA Y ─────────────────────────────────────────
            # Exclui: cabeçalho, número de página, símbolos de lua,
            # dias da semana rotacionados (top~19225) e rodapé DG6-63 (top~23721)
            mares_words = [w for w in words if Y_MIN < w['top'] < Y_MAX]

            hora_col_xs = get_hora_col_xs(mares_words)
            col_widths   = calcular_largura_colunas(hora_col_xs)
            n_cols = min(len(hora_col_xs), 8)

            for col_idx in range(n_cols):
                mes_idx = col_idx // 2
                sub_idx = col_idx % 2
                if mes_idx >= len(meses_pag):
                    continue

                mes_num = MESES_NUM[meses_pag[mes_idx]]
                total_dias = calendar.monthrange(ano, mes_num)[1]
                all_dias = list(range(1, total_dias + 1))
                dias_esperados = all_dias[:16] if sub_idx == 0 else all_dias[16:]

                hx     = hora_col_xs[col_idx]
                hx_max = hx + col_widths[col_idx] - 5

                # Tokens desta coluna: HORA válida ou altitude decimal
                col_tokens = sorted(
                    [w for w in mares_words
                     if hx - 5 <= w['x0'] < hx_max
                     and (hora_valida(w['text'])
                          or re.match(r'^-?\d+\.\d+$', w['text']))],
                    key=lambda w: w['top']
                )

                # ── Detectar gap inter-dia adaptativo ────────────────────
                gap_threshold = detectar_gap_inter_dia(col_tokens)

                # ── Parsear pares (hora, altitude, y_posição) ─────────────
                # Remove duplicatas por Y (overlapping bounding boxes)
                seen_y = set()
                pares = []
                i = 0
                while i < len(col_tokens) - 1:
                    t1 = col_tokens[i]
                    t2 = col_tokens[i + 1]
                    if hora_valida(t1['text']):
                        # Descartar se já existe uma hora neste Y exato
                        y_key = round(t1['top'], 1)
                        if y_key in seen_y:
                            i += 1
                            continue
                        try:
                            alt = float(t2['text'].replace(',', '.'))
                            if -2.0 <= alt <= 10.0:
                                hora = f"{t1['text'][:2]}:{t1['text'][2:]}"
                                pares.append((hora, alt, t1['top']))
                                seen_y.add(y_key)
                                i += 2
                                continue
                        except ValueError:
                            pass
                    i += 1

                # ── Agrupar por dia ───────────────────────────────────────
                grupos = agrupar_pares(pares, gap_threshold)

                # ── Associar grupo[i] -> dia[i] ───────────────────────────
                for i, dia in enumerate(dias_esperados):
                    if i >= len(grupos):
                        break
                    mares = grupos[i]
                    if not mares:
                        continue
                    try:
                        data_str = f'{ano}-{mes_num:02d}-{dia:02d}'
                        datetime.date.fromisoformat(data_str)
                        if data_str not in todos_eventos:
                            todos_eventos[data_str] = {}
                        for hora, alt in mares:
                            todos_eventos[data_str][hora] = alt
                    except ValueError:
                        pass

        # ── Montar lista de eventos ordenada ─────────────────────────────
        eventos_list = []
        for data_str in sorted(todos_eventos.keys()):
            mares = [{'hora': h, 'altura_m': a}
                     for h, a in sorted(todos_eventos[data_str].items())]
            eventos_list.append({'data': data_str, 'mares': mares})

        return {
            'porto':       nome,
            'estado':      estado,
            'lat':         lat_m.group(1).strip() if lat_m else '',
            'lon':         lon_m.group(1).strip() if lon_m else '',
            'fuso':        ('UTC' + fuso_m.group(1)) if fuso_m else 'UTC-3',
            'nivel_medio': float(niv_m.group(1)) if niv_m else None,
            'ano':         ano,
            'eventos':     eventos_list
        }


# ──────────────────────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    pdfs_dir = sys.argv[1] if len(sys.argv) > 1 else 'pdfs'
    data_dir = sys.argv[2] if len(sys.argv) > 2 else 'data'
    os.makedirs(data_dir, exist_ok=True)

    pdfs = sorted(glob.glob(os.path.join(pdfs_dir, '*.pdf')))
    if not pdfs:
        print(f"Nenhum PDF encontrado em: {pdfs_dir}")
        sys.exit(1)

    print(f"Extraindo {len(pdfs)} PDFs de: {pdfs_dir}")
    print(f"Salvando JSONs em: {data_dir}")
    print("=" * 65)

    ok = avisos = erros = 0

    for pdf_path in pdfs:
        basename = os.path.basename(pdf_path)
        json_name = re.sub(r'[^\w\-]', '_', os.path.splitext(basename)[0]).lower() + '.json'
        json_path = os.path.join(data_dir, json_name)

        try:
            resultado = extrair_pdf(pdf_path)
            total_dias = len(resultado['eventos'])
            porto = resultado['porto'] or basename

            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(resultado, f, ensure_ascii=False, indent=2)

            if total_dias >= 360:
                status = 'OK '
                ok += 1
            elif total_dias >= 300:
                status = 'AVS'
                avisos += 1
            else:
                status = 'ERR'
                erros += 1

            print(f"  [{status}] {basename[:50]:50s} {total_dias:3d} dias | {porto[:30]}")

        except Exception as e:
            print(f"  [ERR] {basename[:50]:50s} ERRO: {e}")
            erros += 1

    print("=" * 65)
    print(f"Resultado: {ok} OK | {avisos} AVISO | {erros} ERRO")
    print("=" * 65)

    # ── Auditoria final ───────────────────────────────────────────────────
    jsons = sorted(glob.glob(os.path.join(data_dir, '*.json')))
    problemas = []
    for f in jsons:
        with open(f, encoding='utf-8') as fh:
            d = json.load(fh)
        dias = len(d.get('eventos', []))
        if dias < 360:
            problemas.append((os.path.basename(f), dias, d.get('porto', '???')))

    if problemas:
        print(f"\nArquivos com < 360 dias:")
        for nome_f, dias, porto in problemas:
            print(f"  {dias:3d} dias | {porto[:40]} | {nome_f}")
    else:
        print("\n✅ Todos os JSONs com 360+ dias!")
