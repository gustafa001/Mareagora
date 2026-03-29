import json
import pandas as pd
import utide
import numpy as np
import glob

files = glob.glob('data/46_*.json')
if not files:
    print("Files not found")
    import sys; sys.exit(1)
fpath = files[0]
data = json.load(open(fpath, 'r', encoding='utf-8'))

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
print('Max raw A:', max(coef['A']))
print('Raw Mean:', coef.get('mean', 0))

t_rec = pd.date_range('2026-03-20', periods=400, freq='10min')
recon = utide.reconstruct(t_rec, coef, verbose=False)
h_rec = recon.h + coef.get('mean', 0)
print('Recon raw min/max:', min(h_rec), max(h_rec))
