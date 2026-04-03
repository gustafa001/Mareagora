import json
with open("c:/Users/gusta/Desktop/mareagora/data/10_-_são_luís_40_-_42.json", "r", encoding="utf-8") as f:
    d = json.load(f)
feb_days = sorted(set(e['data'] for e in d['eventos'] if e['data'].startswith('2026-02')))
print(f"Feb days ({len(feb_days)}):", feb_days)
