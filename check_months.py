import json, sys
with open("c:/Users/gusta/Desktop/mareagora/data/10_-_são_luís_40_-_42.json", "r", encoding="utf-8") as f:
    d = json.load(f)
from collections import Counter
c = Counter(e['data'][:7] for e in d['eventos'])
print("SÃO LUÍS counts by month:")
for k in sorted(c.keys()):
    print(k, c[k])
