import json, glob, os

jsons = glob.glob(r'data\*.json')
print(f"Limpando duplicatas em {len(jsons)} arquivos...")

for f_path in jsons:
    with open(f_path, encoding='utf-8') as f:
        d = json.load(f)
    
    eventos = d.get('eventos', [])
    # Usar dicionário para manter apenas o primeiro evento de cada data
    unique_eventos = {}
    for e in eventos:
        dt = e['data']
        if dt not in unique_eventos:
            unique_eventos[dt] = e
    
    sorted_days = sorted(unique_eventos.keys())
    d['eventos'] = [unique_eventos[dt] for dt in sorted_days]
    
    total = len(d['eventos'])
    with open(f_path, 'w', encoding='utf-8') as out:
        json.dump(d, out, ensure_ascii=False, indent=2)
    
    if total != 365:
        print(f"AVISO: {os.path.basename(f_path)} ficou com {total} dias.")
    else:
        # print(f"Sincronizado: {os.path.basename(f_path)}")
        pass

print("\nLimpeza de duplicatas concluída!")
