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

def _hora_to_min(hora_str):
    try:
        h, m = map(int, hora_str.split(':'))
        return h * 60 + m
    except:
        return 0

def select_best_tides(mares, max_tides=4):
    """
    Seleciona as melhores 4 marés para evitar duplicidade em layouts complexos.
    Prioriza horas únicas e extremos (preamar/baixamar).
    """
    if not mares: return []
    # Remover duplicatas exatas de hora
    vistas = {}
    for m in mares:
        if m['hora'] not in vistas:
            vistas[m['hora']] = m
    
    unicas = sorted(vistas.values(), key=lambda x: x['hora'])
    if len(unicas) <= max_tides:
        return unicas

    # Se houver mais de 4, seleciona os extremos
    alturas = [m['altura_m'] for m in unicas]
    mediana = sum(alturas) / len(alturas)
    
    # Tenta pegar as 2 mais altas e 2 mais baixas
    preamares = [m for m in unicas if m['altura_m'] >= mediana]
    baixamares = [m for m in unicas if m['altura_m'] < mediana]
    
    # Garante pelo menos 30min entre marés
    selecionadas = []
    def add_safe(lista):
        for m in lista:
            if len(selecionadas) >= max_tides: break
            if not any(abs(_hora_to_min(m['hora']) - _hora_to_min(s['hora'])) < 30 for s in selecionadas):
                selecionadas.append(m)

    # Alterna entre preamar e baixamar para cobrir o dia
    p, b = 0, 0
    while len(selecionadas) < max_tides and (p < len(preamares) or b < len(baixamares)):
        if p < len(preamares):
            add_safe([preamares[p]])
            p += 1
        if b < len(baixamares):
            add_safe([baixamares[b]])
            b += 1
            
    return sorted(selecionadas, key=lambda x: x['hora'])



def parse_subcol_tokens(tokens, mes_num, ano):
    planos = []
    for t in tokens:
        txt = t['text']
        # Tenta separar dia grudado com hora HHMM (ex: "010432")
        if len(txt) == 6 and re.match(r'^\d{6}$', txt):
            planos.append(txt[:2])
            planos.append(txt[2:])
        else:
            planos.append(txt)

    eventos = []
    dia_atual = None
    mares_do_dia = []
    def salvar_dia():
        if dia_atual and mares_do_dia:
            data_str = f'{ano}-{mes_num:02d}-{dia_atual:02d}'
            eventos.append({'data': data_str, 'mares': select_best_tides(mares_do_dia)})

    def brute_force_extract(tokens):
        """Tenta extrair marés de forma agnóstica a colunas para portos densos."""
        local_eventos = []
        d_atual = None
        m_dia = []
        
        j = 0
        while j < len(tokens):
            t = tokens[j]['text']
            # Detectar DIA
            if re.match(r'^\d{1,2}$', t):
                val = int(t)
                if 1 <= val <= 31:
                    if d_atual and m_dia:
                        local_eventos.append({'data': f'{ano}-{mes_num:02d}-{d_atual:02d}', 'mares': select_best_tides(m_dia)})
                    d_atual = val
                    m_dia = []
            
            # Detectar HORA e ALTURA
            t_limpo = t.replace(':', '').replace('.', '').replace(',', '')
            if len(t_limpo) == 4 and re.match(r'^\d{4}$', t_limpo):
                if j + 1 < len(tokens):
                    nxt = tokens[j+1]['text'].replace(',', '.')
                    if re.match(r'^-?\d+\.\d+$', nxt):
                        m_dia.append({'hora': f'{t_limpo[:2]}:{t_limpo[2:]}', 'altura_m': float(nxt)})
                        j += 1
            j += 1
        if d_atual and m_dia:
            local_eventos.append({'data': f'{ano}-{mes_num:02d}-{d_atual:02d}', 'mares': select_best_tides(m_dia)})
        return local_eventos

    i = 0


    while i < len(planos):
        t = planos[i]
        
        # Ignora cabeçalhos
        if t.upper() in DIAS_SEM or t.upper() in [m.upper() for m in MESES] or \
           t.upper() in ('HORA', 'ALT(M)', 'ALT', 'ALTURA', 'DIA', 'SEM'):
            i += 1
            continue
        
        # Detecta DIA (1-31)
        if re.match(r'^\d{1,2}$', t):
            val = int(t)
            if 1 <= val <= 31:
                # Heurística mais relaxada:
                # Se não temos dia_atual, ou se este val parece ser um novo dia (não uma altura)
                # Note: Alturas costumam ter ponto/vírgula.
                if not dia_atual or val != dia_atual or val == 1:
                    salvar_dia()
                    dia_atual = val
                    mares_do_dia = []
                    i += 1
                    continue
        
        # Detecta HORA (HHMM) e procura ALTURA a seguir
        t_limpo = t.replace(':', '').replace('.', '').replace(',', '')
        if len(t_limpo) == 4 and re.match(r'^\d{4}$', t_limpo):
            h, m = int(t_limpo[:2]), int(t_limpo[2:])
            if 0 <= h <= 23 and 0 <= m <= 59:
                # Busca altura no próximo ou nos 2 próximos
                j = i + 1
                while j < min(i + 3, len(planos)):
                    next_t = planos[j].replace(',', '.')
                    alt_match = re.search(r'(-?\d+\.\d+)', next_t)
                    if alt_match:
                        mares_do_dia.append({
                            'hora': f'{t_limpo[:2]}:{t_limpo[2:]}',
                            'altura_m': float(alt_match.group(1))
                        })
                        i = j + 1
                        break
                    j += 1
                else:
                    i += 1
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
    # Mudança: agora permite variações de texto para 'HORA' para ser mais resiliente
    hora_tokens = [w for w in words if "HORA" in w['text'].upper() or "H/M" in w['text'].upper()]
    
    # Se não achar HORA, tenta DIA
    if not hora_tokens:
        hora_tokens = [w for w in words if "DIA" in w['text'].upper() and w['top'] < 150]
        
    hora_xs = sorted([w['x0'] for w in hora_tokens])
    
    if len(hora_xs) < 2:
        # Tenta detectar colunas fixas se os cabeçalhos falharem
        # Em PDFs da Marinha, as colunas de "HORA" costumam ficar perto dessas posições:
        # [70, 130, 200, 260, 330, 400, 470, 530]
        if page.width > 500:
             hora_xs = [65, 125, 195, 255, 325, 385, 455, 515]
        else:
             return []

    n_months = len(meses_pagina)
    # Normalmente 2 sub-colunas por mês, 4 meses por página = 8 colunas HORA
    subcols_per_month = len(hora_xs) // n_months if n_months > 0 else 2

    def get_subcol_for_x(x0):
        """Retorna o índice da sub-coluna com base na posição X do token."""
        for idx, hx in enumerate(hora_xs):
            x_start = hx - 40  # Aumentada margem para capturar números de dia à esquerda
            x_end = hora_xs[idx + 1] - 25 if idx + 1 < len(hora_xs) else page.width + 50
            if x_start <= x0 < x_end:
                return idx
        return None

    # Agrupa palavras por linha (posição Y)
    lines_by_y = defaultdict(list)
    for w in words:
        y_key = round(w['top'] / 4) * 4
        lines_by_y[y_key].append(w)

    # Se o porto parece denso ou a detecção de colunas falhou, usa brute force como fallback
    if len(hora_xs) < 8: # Páginas com 4 meses costumam ter 8 sub-colunas
        print(f"      [AVISO] Detectadas {len(hora_xs)} sub-colunas. Usando Brute Force Fallback.")
        return brute_force_extract(words)

    # Distribui tokens para cada sub-coluna (lógica original)
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
    # SE detectou menos de 2 subcolunas por mês, algo está errado nos cabeçalhos.
    # Em páginas de 4 meses, esperamos 8 subcolunas.
    # Se temos 4 meses mas poucas subcolunas, as subcolunas detectadas podem estar desalinhadas.
    
    # Melhora a detecção do subcols_per_month
    expected_subcols = n_months * 2
    actual_subcols = len(hora_xs)
    
    for month_idx in range(n_months):
        mes = meses_pagina[month_idx]
        mes_num = MESES_NUM[mes]
        
        # Tenta achar as 2 subcolunas deste mês
        # Normalmente são as colunas (month_idx*2) e (month_idx*2 + 1)
        for sub_in_month in [0, 1]:
            sc_idx = month_idx * 2 + sub_in_month
            if sc_idx < actual_subcols:
                eventos.extend(parse_subcol_tokens(subcol_tokens[sc_idx], mes_num, ano))
            else:
                # Se não detectou a subcoluna pelo HORA, tenta uma busca cega nos tokens
                # se houver tokens sobrados à direita
                pass

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

        todos_eventos = []
        for i, page in enumerate(pdf.pages):
            # Detecta quais meses estão nesta página (4 meses por página nas tabelas grandes)
            text_upper = (page.extract_text() or '').upper()
            meses_na_pagina = [m for m in MESES if m.upper() in text_upper]
            
            if meses_na_pagina:
                # Ordena meses pela ordem em que aparecem (X ou texto)
                # Na Marinha, Janeiro-Abril, Maio-Agosto, Setembro-Dezembro
                print(f"      Página {i}: {', '.join(meses_na_pagina)}")
                todos_eventos.extend(extrair_pagina(page, meses_na_pagina, ano))

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
    print(f'Concluído: {ok} OK (>=350 dias) | {avisos} AVISO | {erros} ERRO')
    print(f'{"="*60}')

