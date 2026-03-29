"""
Extrator de Tábuas de Maré da Marinha do Brasil - v2
Corrige o bug crítico do script anterior: processamento separado por sub-coluna.

PROBLEMA DO SCRIPT ORIGINAL (v7):
- A lógica detectar_mes_por_posicao usava a posição X MÉDIA da linha completa,
  mas cada linha contém dados de TODOS os 4 meses simultaneamente.
- A mistura dos tokens dos sub-colunas A (dias 1-16) e B (dias 17-31) de cada mês
  causava troca de dados entre os dias, resultando em dias faltando e outros com
  número errado de marés.

SOLUÇÃO:
- Usa os cabeçalhos HORA para identificar as posições exatas de cada sub-coluna.
- Processa cada sub-coluna de forma INDEPENDENTE, evitando contaminação cruzada.
- Resultado: 365 dias com 3-4 marés/dia para todos os portos.
"""

import pdfplumber, re, json, sys, glob, os, datetime
from collections import defaultdict, Counter

MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
         'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
MESES_NUM = {m: i+1 for i, m in enumerate(MESES)}
DIAS_SEM = {'SEG','TER','QUA','QUI','SEX','SÁB','DOM'}


def parse_subcol_tokens(tokens, mes_num, ano):
    """Parseia tokens de UMA sub-coluna independentemente."""
    eventos = []
    dia_atual = None
    mares_do_dia = []
    i = 0

    def salvar_dia():
        if dia_atual and mares_do_dia:
            try:
                data_str = f'{ano}-{mes_num:02d}-{dia_atual:02d}'
                datetime.date.fromisoformat(data_str)
                eventos.append({
                    'data': data_str,
                    'mares': sorted(
                        list({m['hora']: m for m in mares_do_dia}.values()),
                        key=lambda x: x['hora']
                    )
                })
            except ValueError:
                pass

    while i < len(tokens):
        t = tokens[i]['text']

        # Ignora abreviações de dia da semana e cabeçalhos
        if t in DIAS_SEM or t in MESES or t in ('HORA', 'ALT(m)', 'ALT', 'ALTURA'):
            i += 1
            continue

        # Número do dia (1-31)
        if re.match(r'^\d{1,2}$', t):
            val = int(t)
            if 1 <= val <= 31:
                salvar_dia()
                dia_atual = val
                mares_do_dia = []
                i += 1
                continue

        # Hora no formato HHMM (4 dígitos)
        if re.match(r'^\d{4}$', t):
            h, m = int(t[:2]), int(t[2:])
            if 0 <= h <= 23 and 0 <= m <= 59:
                if i + 1 < len(tokens):
                    next_t = tokens[i + 1]['text']
                    if re.match(r'^-?\d+[.,]\d+$', next_t):
                        alt = float(next_t.replace(',', '.'))
                        if -5 <= alt <= 15 and dia_atual:
                            mares_do_dia.append({
                                'hora': f'{t[:2]}:{t[2:]}',
                                'altura_m': alt
                            })
                        i += 2
                        continue

        i += 1

    salvar_dia()
    return eventos


def extrair_pagina(page, meses_pagina, ano):
    """
    Extrai dados de maré de uma página do PDF.
    Cada página contém 4 meses, cada mês com 2 sub-colunas (dias 1-16 e 17-31).
    """
    words = page.extract_words(x_tolerance=2, y_tolerance=3)

    # Localiza os cabeçalhos HORA para identificar as sub-colunas
    hora_xs = sorted([w['x0'] for w in words if w['text'] == 'HORA'])
    if len(hora_xs) < 2:
        return []

    n_months = len(meses_pagina)
    subcols_per_month = len(hora_xs) // n_months  # normalmente = 2

    def get_subcol_for_x(x0):
        """Retorna o índice da sub-coluna com base na posição X do token."""
        for idx, hx in enumerate(hora_xs):
            x_start = hx - 25  # margem à esquerda para capturar números de dia
            x_end = hora_xs[idx + 1] - 25 if idx + 1 < len(hora_xs) else page.width + 50
            if x_start <= x0 < x_end:
                return idx
        return None

    # Agrupa palavras por linha (posição Y)
    lines_by_y = defaultdict(list)
    for w in words:
        y_key = round(w['top'] / 4) * 4
        lines_by_y[y_key].append(w)

    # Distribui tokens para cada sub-coluna
    subcol_tokens = {idx: [] for idx in range(len(hora_xs))}

    for y_key in sorted(lines_by_y.keys()):
        if y_key < 88:  # pula cabeçalho da página
            continue
        for w in sorted(lines_by_y[y_key], key=lambda w: w['x0']):
            sc = get_subcol_for_x(w['x0'])
            if sc is not None:
                subcol_tokens[sc].append({
                    'text': w['text'],
                    'top': w['top'],
                    'x0': w['x0']
                })

    # Ordena tokens de cada sub-coluna por (Y, X)
    for sc in subcol_tokens:
        subcol_tokens[sc].sort(key=lambda t: (round(t['top'] / 4) * 4, t['x0']))

    # Processa cada sub-coluna independentemente
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
    """Extrai todos os dados de maré de um PDF da Marinha."""
    with pdfplumber.open(caminho_pdf) as pdf:
        text0 = pdf.pages[0].extract_text() or ''
        lines = [l.strip() for l in text0.split('\n') if l.strip()]

        # Título geralmente é a primeira linha significativa que contém o ano 2026
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
        
        # Estado busca por (ESTADO DO...) ou (ESTADO DA...)
        estado_match = re.search(r'\(ESTADO\s+D[AO]S?\s+(.+?)\)', nome_linha, re.IGNORECASE)
        estado = estado_match.group(1).title() if estado_match else ''

        # Limpeza robusta do nome do porto
        nome_limpo = re.sub(r'\(ESTADO.+?\)', '', nome_linha, flags=re.IGNORECASE)
        nome_limpo = re.sub(r'\s*-\s*20\d\d.*', '', nome_limpo)
        nome_limpo = re.sub(r'^[\d\s\-]+', '', nome_limpo).strip()

        paginas_meses = [MESES[0:4], MESES[4:8], MESES[8:12]]

        todos_eventos = []
        for i, page in enumerate(pdf.pages):
            if i >= len(paginas_meses):
                break
            todos_eventos.extend(extrair_pagina(page, paginas_meses[i], ano))

        todos_eventos.sort(key=lambda x: x['data'])

        # Remove duplicatas de data
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

            # Meses contagem
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
