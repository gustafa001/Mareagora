import json
import pandas as pd
import utide
import numpy as np
import urllib.request
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

url = 'https://raw.githubusercontent.com/Vulnexusai-app/Mareagora/main/data/46_-_porto_de_santos_-_148_-_150.json'
try:
    data = json.loads(urllib.request.urlopen(url).read())
except Exception as e:
    print('Failed to get raw json', e)
    import sys; sys.exit(1)

times = []
heights = []
for ev in data.get('eventos', []):
    for m in ev.get('mares', []):
        try:
            times.append(pd.to_datetime(f"{ev['data']} {m['hora']}"))
            heights.append(float(m['altura_m']))
        except: pass

t = pd.Series(times).values
h = np.array(heights)

print('Solving direct raw peaks...')
coef = utide.solve(t, h, lat=-24.0, method='ols', conf_int='none', Rayleigh_min=0.5)
print('Max A:', max(coef['A']))
print('Mean:', coef.get('mean', 0))

# Reconstruct
t_rec = pd.date_range('2026-03-20', periods=400, freq='10min')
recon = utide.reconstruct(t_rec, coef, verbose=False)
h_rec = recon.h + coef.get('mean', 0)
print('Recon min/max:', min(h_rec), max(h_rec))
