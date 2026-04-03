import json, os
from datetime import date, timedelta

path = r'public\data\46_-_46_-_porto_de_santos_-_146-148.json'
if not os.path.exists(path):
    print(f"ERRO: Arquivo {path} não encontrado.")
    exit(1)

with open(path, encoding='utf-8') as f:
    d = json.load(f)

eventos = {e['data']: e['mares'] for e in d.get('eventos', [])}

start = date(2026, 1, 1)
vazios = []
incompletos = [] # Dias com menos de 3 mares (geralmente sao 4)

for i in range(365):
    curr = (start + timedelta(days=i)).isoformat()
    mares = eventos.get(curr, [])
    
    if not mares:
        vazios.append(curr)
    elif len(mares) < 3:
        incompletos.append(f"{curr} ({len(mares)} mares)")

print(f"--- Diagnóstico: {d.get('porto')} ---")
print(f"Total de dias vazios (buracos): {len(vazios)}")
if vazios:
    print(f"Exemplos de dias vazios: {vazios[:20]}")

print(f"\nTotal de dias incompletos (<3 marés): {len(incompletos)}")
if incompletos:
    print(f"Exemplos incompletos: {incompletos[:20]}")

# Verificar meses especificos
meses_vazios = {}
for v in vazios:
    mes = v[:7]
    meses_vazios[mes] = meses_vazios.get(mes, 0) + 1

if meses_vazios:
    print(f"\nBuracos por mês: {meses_vazios}")
