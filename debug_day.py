import re

chunk = "98 1230 1.25"
day_match = re.search(r'^(\d{2})\s+', chunk)
print(day_match)

# Let's open the json and see what the data actually looked like
import json
with open("c:/Users/gusta/Desktop/mareagora/data/10_-_são_luís_40_-_42.json", "r", encoding="utf-8") as f:
    d = json.load(f)
for ev in d['eventos']:
    if int(ev['data'].split('-')[2]) > 31:
        print(ev['data'], ev['mares'])
        break
