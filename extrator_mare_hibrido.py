import pdfplumber, re, json, sys, glob, os
from datetime import datetime

MESES = ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO',
         'JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO']
MESES_ALT = {'MARCO': 'MARÇO'}

def normalize_mes(w):
    w = w.upper()
    return MESES_ALT.get(w, w)

def extract_metadata(text0):
    nome_linha = ""
    for l in text0.split('\n')[:15]:
        if 'PORTO' in l.upper() or 'TERMINAL' in l.upper() or 'ILHA' in l.upper() or '(ESTADO' in l.upper():
            nome_linha = l
            break
            
    if not nome_linha:
        nome_linha = text0.split('\n')[0]

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

    return {
        'porto': nome_limpo,
        'estado': estado,
        'lat': lat_match.group(1).strip() if lat_match else '',
        'lon': lon_match.group(1).strip() if lon_match else '',
        'fuso': ('UTC' + fuso_match.group(1)) if fuso_match else 'UTC-3',
        'nivel_medio': float(nivel_match.group(1)) if nivel_match else None,
        'ano': ano
    }

def extrair_pdf(caminho_pdf):
    with pdfplumber.open(caminho_pdf) as pdf:
        text0 = pdf.pages[0].extract_text() or ''
        meta = extract_metadata(text0)
        ano = meta['ano']

        eventos_map = {} # data_str -> list of mares

        for page_num, page in enumerate(pdf.pages):
            # **ABORDAGEM HÍBRIDA: Tentar extração por colunas primeiro**
            words = page.extract_words()
            if not words:
                continue
            
            # Tentar encontrar header HORA
            header_tops = [w['top'] for w in words if w['text'] == 'HORA']
            
            if header_tops:
                # **MÉTODO 1: Extração por colunas (layout posicional)**
                header_y = min(header_tops)
                
                # Encontrar meses na página
                month_words = [w for w in words if header_y - 60 < w['top'] < header_y - 10]
                meses_in_page = []
                m_words_sorted = sorted(month_words, key=lambda w: (round(w['top']/4)*4, w['x0']))
                for w in m_words_sorted:
                    text = re.sub(r'[^A-Za-zÀ-Úà-úÇç]', '', w['text'])
                    text = normalize_mes(text)
                    if text in MESES:
                        idx = MESES.index(text) + 1
                        if idx not in meses_in_page:
                            meses_in_page.append(idx)
                            
                if len(meses_in_page) < 4:
                    start_m = page_num * 4 + 1
                    meses_in_page = [start_m, start_m+1, start_m+2, start_m+3]
                    
                # Filtrar palavras abaixo do header
                data_words = [w for w in words if w['top'] > header_y + 10]
                
                # 8 colunas
                cols = [ [] for _ in range(8) ]
                for w in data_words:
                    col_idx = int((w['x0'] - 15) / 63.78)
                    if 0 <= col_idx <= 7:
                        cols[col_idx].append(w)
                        
                # Processar cada coluna
                for col_idx in range(8):
                    c_words = sorted(cols[col_idx], key=lambda w: w['top'])
                    if not c_words:
                        continue
                        
                    # Agrupar por linha
                    lines = []
                    for w in c_words:
                        if not lines or abs(w['top'] - lines[-1][0]['top']) > 5:
                            lines.append([w])
                        else:
                            lines[-1].append(w)
                            
                    current_day = None
                    mes_num = meses_in_page[col_idx // 2] if (col_idx // 2) < len(meses_in_page) else meses_in_page[-1]
                    
                    for line in lines:
                        line = sorted(line, key=lambda w: w['x0'])
                        chunk = " ".join(w['text'] for w in line)
                        
                        tokens = chunk.split()
                        if not tokens: continue
                        
                        if re.match(r'^\d{1,2}$', tokens[0]):
                            current_day = int(tokens[0])
                            tokens = tokens[1:]
                            
                        if current_day and 1 <= current_day <= 31:
                            rem_chunk = " ".join(tokens)
                            match = re.search(r'(\d{4})\s+(-?\d+\.\d+)', rem_chunk)
                            if match:
                                hstr = match.group(1)
                                alt = float(match.group(2))
                                
                                hh, mm = int(hstr[:2]), int(hstr[2:])
                                if 0 <= hh <= 23 and 0 <= mm <= 59:
                                    data_str = f'{ano}-{mes_num:02d}-{current_day:02d}'
                                    
                                    if data_str not in eventos_map:
                                        eventos_map[data_str] = []
                                        
                                    eventos_map[data_str].append({
                                        'hora': f'{hh:02d}:{mm:02d}',
                                        'altura_m': alt
                                    })
            
            else:
                # **MÉTODO 2: Extração linear (fallback)**
                text = page.extract_text()
                lines = text.split('\n')
                
                current_month = None
                
                for i, line in enumerate(lines):
                    # Verificar se é um mês
                    for month_name in MESES:
                        if month_name in line:
                            current_month = MESES.index(month_name) + 1
                            break
                    
                    # Verificar se é um dia
                    if line.strip().isdigit() and current_month:
                        day_num = int(line.strip())
                        
                        if 1 <= day_num <= 31:
                            # Procurar dados de maré nas próximas linhas
                            mares = []
                            j = i + 1
                            
                            while j < min(i + 8, len(lines)) and len(mares) < 6:
                                next_line = lines[j].strip()
                                tide_pattern = r'(\d{4})\s+(-?\d+\.?\d*)'
                                matches = re.findall(tide_pattern, next_line)
                                
                                for match in matches:
                                    hora_raw = match[0]
                                    if len(hora_raw) == 4:
                                        hora_formatted = f"{hora_raw[:2]}:{hora_raw[2:]}"
                                    else:
                                        hora_formatted = hora_raw
                                    
                                    altura = float(match[1])
                                    mares.append({
                                        "hora": hora_formatted,
                                        "altura_m": altura
                                    })
                                
                                if matches:
                                    j += 1
                                elif j < len(lines) and lines[j].strip().isdigit():
                                    break
                                else:
                                    j += 1
                            
                            # Se encontrou dados, adiciona
                            if mares:
                                data_str = f"{ano}-{current_month:02d}-{day_num:02d}"
                                if data_str not in eventos_map:
                                    eventos_map[data_str] = []
                                eventos_map[data_str].extend(mares)

    # Processar final
    eventos_list = []
    
    for data_str in sorted(eventos_map.keys()):
        mares = []
        seen_hours = set()
        for m in sorted(eventos_map[data_str], key=lambda x: x['hora']):
            if m['hora'] not in seen_hours:
                seen_hours.add(m['hora'])
                mares.append(m)
        
        eventos_list.append({
            'data': data_str,
            'mares': mares
        })

    meta['eventos'] = eventos_list
    return meta

if __name__ == '__main__':
    entrada = sys.argv[1] if len(sys.argv) > 1 else 'pdfs'
    saida_dir = sys.argv[2] if len(sys.argv) > 2 else 'data_hibrido'
    os.makedirs(saida_dir, exist_ok=True)

    pdfs = []
    if os.path.isdir(entrada):
        all_files = glob.glob(os.path.join(entrada, '*'))
        for f in all_files:
            if f.lower().endswith('.pdf'):
                pdfs.append(f)
        pdfs = sorted(list(set(pdfs)))
    else:
        pdfs = [entrada]

    if not pdfs:
        print(f'Nenhum PDF encontrado em: {entrada}')
        sys.exit(1)

    print(f'Processando {len(pdfs)} PDF(s) com extrator HÍBRIDO V9\n')

    ok = avisos = erros = 0

    for pdf_path in pdfs:
        nome_base = os.path.splitext(os.path.basename(pdf_path))[0]
        nome_json = re.sub(r'[^\w\-]', '_', nome_base).lower() + '.json'
        saida_path = os.path.join(saida_dir, nome_json)

        try:
            print(f"  Processando: {nome_base}")
            resultado = extrair_pdf(pdf_path)
            total_dias = len(resultado['eventos'])
            
            if total_dias > 0:
                primeiro_dia = resultado['eventos'][0]['data']
                ultimo_dia = resultado['eventos'][-1]['data']
            else:
                primeiro_dia = ultimo_dia = 'N/A'
            
            missing_tides_count = sum(1 for ev in resultado['eventos'] if len(ev['mares']) != 4)
            total_mares = sum(len(ev['mares']) for ev in resultado['eventos'])
            media_mares = total_mares / total_dias if total_dias > 0 else 0

            status = '[OK]' if total_dias >= 150 else '[AVISO]' if total_dias >= 50 else '[ERRO]'
            print(f'  {status} {nome_base}')
            print(f'         Porto : {resultado["porto"]} ({resultado["estado"]})')
            print(f'         Dias  : {total_dias} | Período: {primeiro_dia} a {ultimo_dia}')
            print(f'         Mares/dia média: {media_mares:.2f} | Dias com != 4 marés: {missing_tides_count}')

            with open(saida_path, 'w', encoding='utf-8') as f:
                json.dump(resultado, f, ensure_ascii=False, indent=2)
            print(f'         Salvo : {saida_path}\n')

            ok += 1 if total_dias >= 150 else 0
            avisos += 1 if 50 <= total_dias < 150 else 0
            erros += 1 if total_dias < 50 else 0

        except Exception as e:
            import traceback
            print(f'  [ERRO] {nome_base}: {e}')
            traceback.print_exc()
            erros += 1

    print(f'\n{"="*60}')
    print(f'Concluido: {ok} OK (>=150 dias) | {avisos} AVISO | {erros} ERRO')
    print(f'{"="*60}')
    print(f'✅ Extração HÍBRIDA concluída!')
