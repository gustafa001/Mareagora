import os
import glob
import numpy as np
import pandas as pd
from scipy.interpolate import PchipInterpolator
import utide
import json

def fetch_ports():
    # Agora buscamos nos arquivos locais restaurados
    files = glob.glob("../temp_data/*.json")
    ports = []
    for f in files:
        basename = os.path.basename(f)
        port_id = basename.replace(".json", "")
        ports.append({"id": port_id, "file_path": f})
    return ports

def extract_dna(file_path, lat=None):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Erro ao ler arquivo {file_path}: {e}")
        return None
        
    times = []
    heights = []
    
    for evento in data.get("eventos", []):
        date_str = evento["data"]
        for mare in evento.get("mares", []):
            time_str = mare["hora"]
            try:
                dt = pd.to_datetime(f"{date_str} {time_str}")
                times.append(dt)
                heights.append(mare["altura_m"])
            except:
                continue
            
    df = pd.DataFrame({"time": times, "height": heights})
    df = df.sort_values("time").drop_duplicates(subset=["time"])
    
    if len(df) < 50:
        return None
        
    try:
        # Resample para horário e interpola
        df = df.set_index("time")
        # Garante que temos um range contínuo
        full_range = pd.date_range(start=df.index.min(), end=df.index.max(), freq='h')
        df = df.reindex(full_range).interpolate(method='pchip')
        
        hourly_dates = df.index
        hourly_heights = df["height"].values

        if np.isnan(hourly_heights).any():
            print(f" [AVISO] NaNs remanescentes em {file_path}")
            return None

        # Resolve UTide
        port_lat = data.get("lat", lat or -15.0)
        coef = utide.solve(hourly_dates, hourly_heights, 
                           lat=port_lat, 
                           method='ols', 
                           conf_int='none', 
                           Rayleigh_min=0.5) # Aumentando sensibilidade
        
        const_dict = {
            "name": [str(x) for x in coef['name']],
            "A": [float(x) for x in coef['A']],
            "g": [float(x) for x in coef['g']],
            "mean": float(coef.get('mean', 0.0))
        }
        
        if 'aux' in coef:
            aux_dict = {}
            for k, v in coef['aux'].items():
                if isinstance(v, np.ndarray):
                    aux_dict[k] = v.tolist()
                elif isinstance(v, (np.float32, np.float64, float, int)):
                    aux_dict[k] = float(v)
                elif isinstance(v, dict):
                    aux_dict[k] = v
                else:
                    aux_dict[k] = str(v)
            const_dict["aux"] = aux_dict
            
        return const_dict
        
    except Exception as e:
        print(f"Erro no UTide para {file_path}: {e}")
        return None

if __name__ == "__main__":
    print("[INICIO] Iniciando Extração Offline de Constantes Harmônicas...")
    ports = fetch_ports()
    print(f"Encontrados {len(ports)} arquivos de dados em temp_data/.")
    
    all_dna = {}
    
    for p in ports:
        pid = p["id"]
        fpath = p["file_path"]
        print(f"[{pid}] Extraindo DNA...", end="", flush=True)
        dna = extract_dna(fpath)
        
        if dna:
            # Pegar nome real do porto de dentro do JSON se possível
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    meta = json.load(f)
                    p_name = meta.get("porto", pid)
                    p_state = meta.get("estado", "")
            except:
                p_name = pid
                p_state = ""

            all_dna[pid] = {
                "name": p_name,
                "state": p_state,
                "consts": dna
            }
            print(f" [OK] {len(dna['name'])} componentes.")
        else:
            print(f" [FALHOU]")
            
    with open("harmonics_db.json", "w", encoding="utf-8") as f:
        json.dump(all_dna, f, ensure_ascii=False, indent=2)
        
    print(f"\n[FIM] Sucesso! harmonics_db.json gerado com {len(all_dna)} portos.")

