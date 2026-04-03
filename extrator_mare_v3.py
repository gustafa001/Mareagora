import pdfplumber, re, json, sys, glob, os
import pypdfium2 as pdfium
from PIL import Image
import easyocr
from collections import defaultdict, Counter

MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
         'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
MESES_NUM = {m: i+1 for i, m in enumerate(MESES)}
DIAS_SEM = {'SEG','TER','QUA','QUI','SEX','SÁB','DOM'}

reader = None

def get_reader():
    global reader
    if reader is None:
        reader = easyocr.Reader(['pt', 'en'], gpu=False, verbose=False)
    return reader

def pdf_page_to_image(pdf_path, page_num, scale=3):
    pdf = pdfium.PdfDocument(pdf_path)
    page = pdf[page_num]
    bitmap = page.render(scale=scale)
    pil_image = bitmap.to_pil()
    return pil_image

def extract_text_from_image(img):
    r = get_reader()
    import numpy as np
    img_array = np.array(img)
    results = r.readtext(img_array, detail=0)
    return results

def parse_tide_data(lines, mes_num, ano):
    eventos = []
    dia_atual = None
    mares_do_dia = []

    def salvar_dia():
        if dia_atual and mares_do_dia:
            try:
                data_str = f'{ano}-{mes_num:02d}-{dia_atual:02d}'
            except:
                return
            seen = set()
            clean = []
            for m in sorted(mares_do_dia, key=lambda x: x.get('hora', '')):
                h = m.get('hora', '')
                if h and h not in seen:
                    clean.append(m)
                    seen.add(h)
            if clean:
                eventos.append({'data': data_str, 'mares': clean})

    for line in lines:
        line = str(line).strip()
        if not line:
            continue
        
        parts = line.split()
        
        for i, part in enumerate(parts):
            part = part.strip()
            if not part:
                continue
            
            if re.match(r'^\d{1,2}$', part):
                val = int(part)
                if 1 <= val <= 31:
                    salvar_dia()
                    dia_atual = val
                    mares_do_dia = []
                    continue
            
            clean_part = part.replace(':', '').replace('.', '').replace(',', '.')
            
            if len(clean_part) == 4 and re.match(r'^\d{4}$', clean_part):
                h = int(clean_part[:2])
                m = int(clean_part[2:])
                if 0 <= h <= 23 and 0 <= m <= 59 and dia_atual:
                    altura = None
                    if i + 1 < len(parts):
                        next_p = parts[i + 1].replace(',', '.')
                        alt_m = re.search(r'(\d+\.\d+)', next_p)
                        if alt_m:
                            altura = float(alt_m.group(1))
                    
                    if altura is not None:
                        mares_do_dia.append({
                            'hora': f'{h:02d}:{m:02d}',
                            'altura_m': altura
                        })
                    continue
            
            if len(clean_part) > 4:
                match = re.match(r'^(\d{4})(\d+\.\d+)$', clean_part)
                if match:
                    h = int(match.group(1)[:2])
                    m = int(match.group(1)[2:4])
                    alt = float(match.group(2))
                    if 0 <= h <= 23 and 0 <= m <= 59 and dia_atual:
                        mares_do_dia.append({
                            'hora': f'{h:02d}:{m:02d}',
                            'altura_m': alt
                        })
    
    salvar_dia()
    return eventos

def extrair_pagina_ocr(pdf_path, page_num, meses_pagina, ano):
    try:
        img = pdf_page_to_image(pdf_path, page_num, scale=2)
        text_lines = extract_text_from_image(img)
        
        all_text = '\n'.join(text_lines)
        
        eventos = []
        for mes in meses_pagina:
            mes_num = MESES_NUM.get(mes, 1)
            page_events = parse_tide_data(text_lines, mes_num, ano)
            eventos.extend(page_events)
        
        return eventos
    except Exception as e:
        print(f"Erro na pagina {page_num}: {e}")
        return []

def extrair_pdf(caminho_pdf):
    with pdfplumber.open(caminho_pdf) as pdf:
        text0 = pdf.pages[0].extract_text() or ''
        lines = [l.strip() for l in text0.split('\n') if l.strip()]

    nome_linha = ""
    for l in lines[:10]:
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
    
    for i in range(3):
        try:
            img = pdf_page_to_image(caminho_pdf, i, scale=2)
            text_lines = extract_text_from_image(img)
            
            text_upper = ' '.join(text_lines).upper()
            meses_na_pagina = [m for m in MESES if m.upper() in text_upper]
            
            if meses_na_pagina:
                print(f"      Pagina {i}: {', '.join(meses_na_pagina)}")
                for mes in meses_na_pagina:
                    mes_num = MESES_NUM.get(mes, 1)
                    eventos = parse_tide_data(text_lines, mes_num, ano)
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

    print(f'Processando {len(pdfs)} PDF(s) - Extrator v3 (OCR)\n')

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
