import json
with open("c:/Users/gusta/Desktop/mareagora/data/10_-_são_luís_40_-_42.json", "r", encoding="utf-8") as f:
    d = json.load(f)
days = [int(e['data'].split('-')[2]) for e in d['eventos'] if e['data'].startswith('2026-01')]
expected = set(range(1, 32))
missing = expected - set(days)
print("Missing in Jan:", missing)

days_dec = [int(e['data'].split('-')[2]) for e in d['eventos'] if e['data'].startswith('2026-12')]
missing_dec = set(range(1, 32)) - set(days_dec)
print("Missing in Dec:", missing_dec)
