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

analyze('52_-_porto_de_itajaí_-_166_-_168.json')
print("-" * 20)
analyze('51_-_porto_de_são_francisco_do_sul_-_163_-165.json')
print("-" * 20)
analyze('41_-_porto_de_itaguaí_-_133_-_135.json')
