import json
import os
from datetime import date, timedelta

path = r'data\46_-_46_-_porto_de_santos_-_146-148.json'
if not os.path.exists(path):
    print(f"ERRO: Arquivo {path} não encontrado.")
    exit(1)

with open(path, encoding='utf-8') as f:
    d = json.load(f)

porto = d.get('porto', 'N/A')
eventos = d.get('eventos', [])
days = sorted([e['data'] for e in eventos])

start = date(2026, 1, 1)
missing = []
for i in range(365):
    curr = (start + timedelta(days=i)).isoformat()
    if curr not in days:
        missing.append(curr)

print(f"Porto: {porto}")
print(f"Total de dias no arquivo: {len(days)}")
print(f"Total de dias faltando: {len(missing)}")
if missing:
    print(f"Dias faltando: {missing}")
