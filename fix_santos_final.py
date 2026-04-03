import json, os

path = r'data\46_-_46_-_porto_de_santos_-_146-148.json'
if not os.path.exists(path):
    print(f"ERRO: Arquivo {path} não encontrado.")
    exit(1)

with open(path, 'r', encoding='utf-8') as f:
    d = json.load(f)

# Deduzir duplicatas mantendo apenas a primeira ocorrência de cada data
unique_evs = {}
for e in d['eventos']:
    dt = e['data']
    if dt not in unique_evs:
        unique_evs[dt] = e

sorted_days = sorted(unique_evs.keys())
d['eventos'] = [unique_evs[dt] for dt in sorted_days]

total = len(d['eventos'])
print(f"Porto: {d.get('porto')} | Total Limpo: {total}")

with open(path, 'w', encoding='utf-8') as out:
    json.dump(d, out, ensure_ascii=False, indent=2)

if total == 365:
    print("Sucesso: 365 dias únicos garantidos!")
else:
    print(f"Atenção: Ficou com {total} dias.")
