import json, os

path = r'data\46_-_46_-_porto_de_santos_-_146-148.json'
if not os.path.exists(path):
    print(f"ERRO: Arquivo {path} não encontrado.")
    exit(1)

with open(path, 'r', encoding='utf-8') as f:
    d = json.load(f)

porto = d.get('porto')
eventos = d.get('eventos', [])
days = sorted([e['data'] for e in eventos])

print(f"Porto: {porto}")
print(f"Total: {len(days)}")
if days:
    print(f"Início: {days[0]}")
    print(f"Fim:    {days[-1]}")
    
    # Verifica se 02/04/2026 esta presente (data do print)
    if '2026-04-02' in days:
        print("✅ 2026-04-02 PRESENTE no arquivo.")
        # Mostra as mares desse dia
        ev = next(e for e in eventos if e['data'] == '2026-04-02')
        print(f"Marés: {ev['mares']}")
    else:
        print("❌ 2026-04-02 AUSENTE no arquivo!")
