import json
from collections import Counter

filename = r'c:\Users\gusta\Desktop\mareagora\data\56_-_fundeadouro_da_est_ant_com_ferraz_-_178_-_180.json'
with open(filename, encoding='utf-8') as f:
    d = json.load(f)

counts = Counter(e['data'][:7] for e in d['eventos'])
print(f"Porto: {d['porto']} | Total days: {len(d['eventos'])}")
for k in sorted(counts):
    print(f"  {k}: {counts[k]}")
