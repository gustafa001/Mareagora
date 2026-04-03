import pdfplumber, os, re, json, datetime
from collections import defaultdict

# Configurações do MaréAgora
MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
         'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
MESES_NUM = {m: i+1 for i, m in enumerate(MESES)}

def split_fused_token(text):
    # Trata casos como "08191,2" (Hora + Altura colados)
    m = re.match(r'^(\d{3,4})(-?\d+[,.]\d+)$', text)
    if m:
        t = m.group(1).zfill(4)
        h = float(m.group(2).replace(',', '.'))
        return f"{t[:2]}:{t[2:]}", h
    return None, None

def get_best_pdf_for_porto(id_p):
    # Busca o PDF maior/completo primeiro entre as pastas disponíveis
    folders = ['pdfs', 'pdfmarinha']
    best_file = None
    max_size = -1
    
    for fld in folders:
        if not os.path.exists(fld): continue
        for f in os.listdir(fld):
            if f.startswith(f"{id_p} ") and f.lower().endswith('.pdf'):
                size = os.path.getsize(os.path.join(fld, f))
                if size > max_size:
                    max_size = size
                    best_file = os.path.join(fld, f)
    return best_file

def extract_content(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        # Detecta ano e nome do porto
        text_all = ""
        for p in pdf.pages: text_all += p.extract_text() or ""
        
        ano_match = re.search(r'(202\d)', text_all)
        ano = int(ano_match.group(1)) if ano_match else 2026
        
        all_eventos = []
        
        for p_idx, page in enumerate(pdf.pages):
            # No formato padrão, temos 3 páginas (4 meses cada ou as últimas com 2-4)
            # Vamos tentar inferir os meses pelo cabeçalho da página
            p_text = page.extract_text() or ""
            meses_pagina = [m for m in MESES if m.upper() in p_text.upper()]
            
            # Se não detectou, usa o padrão (P1: 0-4, P2: 4-8, P3: 8-12)
            if not meses_pagina:
                if p_idx == 0: meses_pagina = MESES[0:4]
                elif p_idx == 1: meses_pagina = MESES[4:8]
                else: meses_pagina = MESES[8:12]

            words = page.extract_words(x_tolerance=1.5, y_tolerance=3)
            if not words: continue
            
            # Agrupa por Y para processar linha a linha
            lines = defaultdict(list)
            for w in words:
                y_key = round(w['top'] / 4) * 4 # Grade de 4px
                lines[y_key].append(w)
            
            for y in sorted(lines.keys()):
                line = sorted(lines[y], key=lambda w: w['x0'])
                
                # Identifica mês pela posição horizontal (X)
                # O PDF tem 4 colunas verticais (uma para cada mês)
                for m_idx, mes_nome in enumerate(meses_pagina):
                    mes_num = MESES_NUM[mes_nome]
                    x_start = (page.width / 4) * m_idx
                    x_end = (page.width / 4) * (m_idx + 1)
                    
                    m_words = [w for w in line if x_start - 10 <= w['x0'] < x_end]
                    if not m_words: continue
                    
                    # Procura DIA no início da coluna do mês
                    dia_tokens = [w for w in m_words if re.match(r'^\d{1,2}$', w['text']) and w['x0'] < x_start + 45]
                    if not dia_tokens: continue
                    
                    dia = int(dia_tokens[0]['text'])
                    mares = []
                    
                    # Itera sobre os demais tokens para achar Hora e Altura
                    i = 0
                    while i < len(m_words):
                        t = m_words[i]['text'].strip()
                        
                        # Caso 1: Hora perfeita (HH:MM)
                        if re.match(r'^\d{2}:\d{2}$', t):
                            if i + 1 < len(m_words):
                                try:
                                    h = float(m_words[i+1]['text'].replace(',', '.'))
                                    if -2 <= h <= 10: 
                                        mares.append({'hora': t, 'altura_m': h})
                                        i += 1
                                except: pass
                        
                        # Caso 2: Hora colada (HHMM ou HHMMAltura)
                        elif re.match(r'^\d{4}$', t):
                            t_fmt = f"{t[:2]}:{t[2:]}"
                            if i + 1 < len(m_words):
                                try:
                                    h = float(m_words[i+1]['text'].replace(',', '.'))
                                    if -2 <= h <= 10:
                                        mares.append({'hora': t_fmt, 'altura_m': h})
                                        i += 1
                                except: pass
                        
                        # Caso 3: Fusão TOTAL (O bug de Santos)
                        else:
                            t_fmt, h_val = split_fused_token(t)
                            if t_fmt and -2 <= h_val <= 10:
                                mares.append({'hora': t_fmt, 'altura_m': h_val})
                        i += 1
                    
                    if mares:
                        try:
                            # Salva evento validando data
                            final_date = f"{ano}-{mes_num:02d}-{dia:02d}"
                            datetime.date.fromisoformat(final_date)
                            all_eventos.append({'data': final_date, 'mares': mares})
                        except: pass

        # Deduplicação e ordenação final
        cleaned = {}
        for ev in all_eventos:
            d = ev['data']
            if d not in cleaned: cleaned[d] = ev
            else: cleaned[d]['mares'] = sorted(list({m['hora']: m for m in (cleaned[d]['mares'] + ev['mares'])}.values()), key=lambda x: x['hora'])
            
        final_list = sorted(cleaned.values(), key=lambda x: x['data'])
        return {
            'porto': re.sub(r'\s+', ' ', text_all.split('\n')[0].strip()),
            'ano': ano,
            'eventos': final_list
        }

def run_fix():
    print("🚀 Iniciando correção sistêmica de marés...")
    if not os.path.exists('data'): os.makedirs('data')
    
    # Lista todos os portos ativos (1 a 56)
    port_ids = [str(i) for i in range(1, 57)]
    processed = 0
    
    for pid in port_ids:
        pdf = get_best_pdf_for_porto(pid)
        if not pdf: continue
        
        print(f"[{pid}] Lendo {os.path.basename(pdf)} ({os.path.getsize(pdf)//1024}KB)...")
        try:
            res = extract_content(pdf)
            count = len(res['eventos'])
            
            # Limpa o nome do arquivo para o padrão do app
            # Ex: 46_-_porto_de_santos_-_148_-_150.json (usando o nome do PDF original como base)
            out_name = f"{pid}_-_{os.path.basename(pdf).replace('.pdf', '').replace(' ', '_').lower()}.json"
            out_path = os.path.join('data', out_name)
            
            with open(out_path, 'w', encoding='utf-8') as f:
                json.dump(res, f, indent=2, ensure_ascii=False)
            
            status = "✅ " if count >= 350 else "⚠️ PARCIAL"
            print(f"      {status} Finalizado: {count} dias processados.")
            processed += 1
        except Exception as e:
            print(f"      ❌ Erro: {e}")
            
    print(f"\nFinalizado! {processed} portos reconstruídos.")

if __name__ == "__main__":
    run_fix()
