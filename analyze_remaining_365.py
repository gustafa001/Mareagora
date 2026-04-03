import json
import os
from collections import Counter

def analyze(filename):
    path = os.path.join(r'c:\Users\gusta\Desktop\mareagora\data', filename)
    if not os.path.exists(path):
        print(f"File not found: {filename}")
        return
    with open(path, encoding='utf-8') as f:
        d = json.load(f)
    counts = Counter(e['data'][:7] for e in d['eventos'])
    print(f"Porto: {d['porto']} | Total days: {len(d['eventos'])}")
    for k in sorted(counts):
        print(f"  {k}: {counts[k]}")

print("FLORIANOPOLIS:")
analyze('53_-_porto_de_florianópolis_-_169_-_171__1_.json')
print("-" * 20)
print("RIO GRANDE:")
analyze('55_-_porto_do_rio_grande_-_175_-177.json')
print("-" * 20)
print("ITAGUAI:")
analyze('41_-_porto_de_itaguaí_-_133_-_135.json')
