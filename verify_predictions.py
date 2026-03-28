import json
import pandas as pd
from datetime import datetime, timedelta
import utide
import numpy as np

class Bunch(dict):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__dict__ = self

# Mocking the prever_mare logic from main.py
def prever_mare(port_id, start_date_str, days=3):
    with open("mareagora-api-v2/harmonics_db.json", "r", encoding="utf-8") as f:
        db = json.load(f)
    
    if port_id not in db:
        return {"error": "Port not found"}
    
    port_data = db[port_id]["consts"]
    if not port_data.get("A"):
        return {"error": f"No constants for port {port_id}"}
    
    # Reconstruct coefficients
    coef = Bunch()
    coef.name = np.array([str(x) for x in port_data["name"]])
    coef.A = np.array([float(x) for x in port_data["A"]])
    coef.g = np.array([float(x) for x in port_data["g"]])
    # Adicionando aux para reconstrução (contém reftime, etc)
    coef.aux = Bunch(port_data.get("aux", {}))
    
    # Mean is handled separately in main.py, but utide.reconstruct likes it in coef too
    mean_val = float(port_data["mean"])
    coef.mean = mean_val
    
    t0 = datetime.strptime(start_date_str, "%Y-%m-%d")
    times = [t0 + timedelta(minutes=10*i) for i in range(days * 24 * 6)] # 10 min resolution
    
    # Utide reconstruct
    t = pd.to_datetime(times)
    res = utide.reconstruct(t, coef, verbose=False)
    
    heights = res.h
    
    return list(zip([dt.strftime("%Y-%m-%d %H:%M") for dt in times], heights))

# Test for Santos (46)
results = prever_mare("46_-_porto_de_santos_-_148_-_150", "2026-03-28")
if "error" in results:
    print("Error:", results["error"])
else:
    print(f"First 5 predictions for Santos:")
    for t, h in results[:5]:
        print(f"{t}: {h:.2f}m")
    
    # Check for variation
    hs = [h for t, h in results]
    print(f"Min: {min(hs):.2f}m, Max: {max(hs):.2f}m")
