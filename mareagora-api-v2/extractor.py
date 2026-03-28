import requests
import numpy as np
import pandas as pd
from scipy.interpolate import PchipInterpolator
import utide
import json
import os

def fetch_ports():
    resp = requests.get("https://mareagora-api.onrender.com/api/portos")
    data = resp.json()
    if isinstance(data, list):
        return data
    return data.get("portos", [])

def extract_dna(port_id, lat=None):
    url = f"https://mareagora-api.onrender.com/api/mare/{port_id}"
    try:
        resp = requests.get(url, timeout=10)
        if not resp.ok: return None
        data = resp.json()
    except:
        return None
        
    times = []
    heights = []
    
    for evento in data.get("eventos", []):
        date_str = evento["data"]
        for mare in evento.get("mares", []):
            time_str = mare["hora"]
            dt = pd.to_datetime(f"{date_str} {time_str}")
            times.append(dt)
            heights.append(mare["altura_m"])
            
    df = pd.DataFrame({"time": times, "height": heights})
    # Remove duplicates and MUST BE STRICTLY INCREASING
    df = df.sort_values("time").drop_duplicates(subset=["time"])
    
    if len(df) < 100: return None
    
    df['timestamp'] = df['time'].astype(np.int64) // 10**9
    
    # Resolve strictly increasing for PCHIP
    # Se houver timestamps idênticos, a interpolação PCHIP quebra
    df = df.groupby('timestamp', as_index=False).mean()
    
    # Interpolação para hourly
    interp = PchipInterpolator(df['timestamp'], df['height'])
    hourly_ts = np.arange(df['timestamp'].min(), df['timestamp'].max(), 3600)
    hourly_heights = interp(hourly_ts)
    hourly_dates = pd.to_datetime(hourly_ts, unit='s')
    
    try:
        # ResolveUTide
        coef = utide.solve(hourly_dates, hourly_heights, lat=lat or 0, method='ols')
        
        # Transforma os numpy arrays em listas para o JSON
        const_dict = {
            "name": [str(x) for x in coef['name']],
            "A": [float(x) for x in coef['A']],
            "g": [float(x) for x in coef['g']],
            "mean": float(coef.get('mean', 0.0))
        }
        
        # aux contém as configs do fourier e frq, precisamos salvar tbm
        if 'aux' in coef:
            aux_dict = {}
            for k, v in coef['aux'].items():
                if isinstance(v, np.ndarray):
                    aux_dict[k] = v.tolist()
                elif isinstance(v, (np.float32, np.float64, float, int)):
                    aux_dict[k] = float(v)
                elif isinstance(v, dict):
                    aux_dict[k] = v # Assumindo simples
                else:
                    aux_dict[k] = str(v)
            const_dict["aux"] = aux_dict
            
        return const_dict
        
    except Exception as e:
        print(f"Erro no UTide para {port_id}: {e}")
        return None

if __name__ == "__main__":
    print("Mapeando Portos do Brasil...")
    ports = fetch_ports()
    
    all_dna = {}
    
    for p in ports:
        pid = p["id"]
        # Fake lat for nodal correction if missing
        print(f"[{pid}] Minerando e Treinando Modelo...")
        dna = extract_dna(pid, lat=-15.0)
        
        if dna:
            all_dna[pid] = {
                "name": p.get("porto", pid),
                "state": p.get("estado", ""),
                "consts": dna
            }
            print(f" -> Sucesso: {len(dna)} constantes extraídas.")
        else:
            print(f" -> Falhou/Sem Dados: {pid}")
            
    with open("harmonics_db.json", "w", encoding="utf-8") as f:
        json.dump(all_dna, f, ensure_ascii=False, indent=2)
        
    print(f"\nTreinamento concluído. {len(all_dna)} portos matematicamente mapeados em harmonics_db.json!")
