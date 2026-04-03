import pdfplumber, re, json, sys, glob, os

MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
         'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
MESES_NUM = {m: i+1 for i, m in enumerate(MESES)}


def extrair_bloco_mares(line1, line2, line3, line4, dia_base):
    mares = []
    
    def processar_linha(linha, eh_primeira_linha=False):
        parts = linha.split()
        i = 0
        while i < len(parts):
            p = parts[i].replace(',', '.')
            
            if eh_primeira_linha and re.match(r'^\d{1,2}$', parts[i]):
                i += 1
                continue
            
            if len(p) == 4 and re.match(r'^\d{4}$', p):
                h = int(p[:2])
                m_val = int(p[2:])
                if 0 <= h <= 23 and 0 <= m_val <= 59:
                    if i + 1 < len(parts):
                        alt_match = re.search(r'(-?\d+\.\d+)', parts[i + 1].replace(',', '.'))
                        if alt_match:
                            mares.append({
                                'hora': f'{h:02d}:{m_val:02d}',
                                'altura_m': float(alt_match.group(1))
                            })
                        i += 2
                        continue
            i += 1
    
    processar_linha(line1, True)
    processar_linha(line2)
    processar_linha(line3)
    processar_linha(line4)
    
    return mares


def parse_tide_from_text(text_lines, mes_num, ano):
    eventos = []
    
    linhas_dados = []
    for line in text_lines:
        line = line.strip()
        if not line:
            continue
        if 'HORA' in line.upper() or 'ALT' in line.upper():
            continue
        linhas_dados.append(line)
    
    i = 0
    while i < len(linhas_dados):
        line1 = linhas_dados[i]
        parts1 = line1.split()
        
        dias_encontrados = []
        for p in parts1:
            if re.match(r'^\d{1,2}$', p):
                val = int(p)
                if 1 <= val <= 31:
                    dias_encontrados.append(val)
        
        if len(dias_encontrados) >= 2:
            dia_a = dias_encontrados[0]
            dia_b = dias_encontrados[1]
            
            mares_a = []
            mares_b = []
            
            for j in range(4):
                if i + j >= len(linhas_dados):
                    break
                line = linhas_dados[i + j]
                parts = line.split()
                
                idx_dia = 0
                col = 0
                k = 0
                while k < len(parts):
                    p = parts[k].replace(',', '.')
                    
                    if j == 0 and re.match(r'^\d{1,2}$', parts[k]):
                        if idx_dia == 0:
                            idx_dia = 1
                        elif idx_dia == 2:
                            idx_dia = 3
                        k += 1
                        continue
                    
                    if len(p) == 4 and re.match(r'^\d{4}$', p):
                        h = int(p[:2])
                        m_val = int(p[2:])
                        if 0 <= h <= 23 and 0 <= m_val <= 59:
                            if k + 1 < len(parts):
                                alt_match = re.search(r'(-?\d+\.\d+)', parts[k + 1].replace(',', '.'))
                                if alt_match:
                                    if col % 2 == 0:
                                        if idx_dia <= 1:
                                            mares_a.append({
                                                'hora': f'{h:02d}:{m_val:02d}',
                                                'altura_m': float(alt_match.group(1))
                                            })
                                        else:
                                            mares_b.append({
                                                'hora': f'{h:02d}:{m_val:02d}',
                                                'altura_m': float(alt_match.group(1))
                                            })
                                    col += 1
                            k += 2
                            continue
                    k += 1
            
            if mares_a and dia_a:
                data_str = f'{ano}-{mes_num:02d}-{dia_a:02d}'
                seen = set()
                clean_mares = []
                for m in sorted(mares_a, key=lambda x: x.get('hora', '')):
                    h = m.get('hora', '')
                    if h and h not in seen:
                        clean_mares.append(m)
                        seen.add(h)
                if clean_mares:
                    eventos.append({'data': data_str, 'mares': clean_mares})
            
            if mares_b and dia_b:
                data_str = f'{ano}-{mes_num:02d}-{dia_b:02d}'
                seen = set()
                clean_mares = []
                for m in sorted(mares_b, key=lambda x: x.get('hora', '')):
                    h = m.get('hora', '')
                    if h and h not in seen:
                        clean_mares.append(m)
                        seen.add(h)
                if clean_mares:
                    eventos.append({'data': data_str, 'mares': clean_mares})
        
        i += 4
    
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
        try:
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
        except Exception as e:
            print(f"      Erro pagina {i}: {e}")

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
