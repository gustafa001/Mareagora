from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import utide
import numpy as np
import pandas as pd
from scipy.signal import find_peaks
from typing import Optional
from datetime import datetime, timedelta
import os

app = FastAPI(title="MaréAgora API V2", description="Motor Harmônico de Marés para Portos Brasileiros")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.mareagora.com.br", "https://mareagora.com.br", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carrega o DNA Oceanográfico
db_file = "harmonics_db.json"
if os.path.exists(db_file):
    with open(db_file, "r", encoding="utf-8") as f:
        harmo_db = json.load(f)
else:
    harmo_db = {}


@app.get("/")
def health():
    return {"status": "ok", "engine": "harmonic", "portos": len(harmo_db)}


@app.get("/api/portos")
def listar_portos(include_tides: bool = False):
    portos = []
    for pid, data in harmo_db.items():
        portos.append({
            "id": pid,
            "dataFile": f"{pid}.json",
            "name": data["name"],
            "state": data["state"]
        })
    return {"portos": portos}


class Bunch(dict):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__dict__ = self

def reconstruct_tide_coef(raw_consts):
    c = Bunch()
    c['name'] = np.array(raw_consts["name"])
    c['A'] = np.array(raw_consts["A"])
    c['g'] = np.array(raw_consts["g"])
    c['mean'] = raw_consts["mean"]
    c['slope'] = raw_consts.get("slope", 0.0)
    
    n_len = len(c['A'])
    c['A_ci'] = np.zeros(n_len)
    c['g_ci'] = np.zeros(n_len)
    
    if "aux" in raw_consts:
        c['aux'] = Bunch()
        for k, v in raw_consts["aux"].items():
            if k == 'lind':
                c['aux'][k] = np.array(v, dtype=int)
            elif isinstance(v, list):
                c['aux'][k] = np.array(v)
            else:
                c['aux'][k] = v
                
                # Algumas vezes o utide precisa da chave opt solta em coef
        if 'opt' in raw_consts["aux"]:
            c['opt'] = Bunch()
            for k, v in raw_consts["aux"]['opt'].items():
                if k == 'lind':
                    c['opt'][k] = np.array(v, dtype=int)
                elif isinstance(v, list):
                    c['opt'][k] = np.array(v)
                else:
                    c['opt'][k] = v
            
    return c


@app.get("/api/mare/{port_id}")
def prever_mare(port_id: str, start_date: Optional[str] = None, days: int = 7):
    """
    Devolve a tabela de maré no EXACTO mesmo formato do JSON V1
    mas calculada ao vivo sob demanda!
    """
    if port_id not in harmo_db:
        raise HTTPException(status_code=404, detail="Porto não encontrado no motor harmônico.")
        
    porto = harmo_db[port_id]
    
    # Define a data inicial (default = hoje)
    if start_date:
        try:
            dt_start = datetime.strptime(start_date, "%Y-%m-%d")
        except:
            raise HTTPException(status_code=400, detail="Use o formato YYYY-MM-DD")
    else:
        dt_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        
    dt_end = dt_start + timedelta(days=days)
    
    # Criar um timeseries de 10 em 10 minutos (economiza 10x RAM vs 1min)
    times = pd.date_range(dt_start, dt_end, freq="10min")
    
    coef = reconstruct_tide_coef(porto["consts"])
    
    # Usa a mecânica celeste para prever
    recon = utide.reconstruct(times, coef)
    heights = recon.h
    
    # Encontrar as altas (peaks) e baixas (valleys)
    # distance=18 em 10min = 180 minutos (3 horas mínimo entre extremos)
    peaks, _ = find_peaks(heights, distance=18)
    valleys, _ = find_peaks(-heights, distance=18)
    
    events_raw = []
    
    for p in peaks:
        events_raw.append({
            "dt": times[p],
            "altura_m": round(float(heights[p]), 2),
            "tipo": "Alta"
        })
        
    for v in valleys:
        events_raw.append({
            "dt": times[v],
            "altura_m": round(float(heights[v]), 2),
            "tipo": "Baixa"
        })
        
    # Organiza em ordem cronológica
    events_raw.sort(key=lambda x: x["dt"])
    
    # Agrupa por DIA para simular estritamente o JSON antigo
    eventos_por_dia = {}
    for ev in events_raw:
        dia_str = ev["dt"].strftime("%Y-%m-%d")
        hora_str = ev["dt"].strftime("%H:%M")
        
        if dia_str not in eventos_por_dia:
            eventos_por_dia[dia_str] = []
            
        eventos_por_dia[dia_str].append({
            "hora": hora_str,
            "altura_m": ev["altura_m"],
            "tipo": ev["tipo"]
        })
        
    eventos_list = []
    for k, v in eventos_por_dia.items():
        eventos_list.append({
            "data": k,
            "mares": v
        })
        
    return {
        "id": port_id,
        "name": porto["name"],
        "eventos": eventos_list,
        "mode": "harmonic_prediction"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
