import requests
import numpy as np
import pandas as pd
from scipy.interpolate import PchipInterpolator
import utide
from datetime import datetime
import json

def extract_dna(port_id):
    print(f"Baixando dados do Render para o porto: {port_id}...")
    url = f"https://mareagora-api.onrender.com/api/mare/{port_id}"
    resp = requests.get(url)
    if not resp.ok:
        print("Erro ao baixar dados do Render.")
        return
        
    data = resp.json()
    
    # Extrair todos os pontos (Altas e Baixas marés) do ano
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
    df = df.sort_values("time").drop_duplicates(subset=["time"])
    
    if len(df) < 100:
        print("Dados insuficientes.")
        return
        
    print(f"Total de medidas lidas (Picos e Vales): {len(df)}")
    
    # O utide prefere dados de hora em hora. 
    # Usaremos interpolação PCHIP (Cúbica Monotônica) para simular as horas exatas 
    # curvas perfeitas de maré entre a preamar e a baixamar.
    print("Gerando curvatura horária (Interpolação)...")
    df['timestamp'] = df['time'].astype(np.int64) // 10**9
    
    interp = PchipInterpolator(df['timestamp'], df['height'])
    
    # Criar um array de hora em hora
    start_ts = df['timestamp'].min()
    end_ts = df['timestamp'].max()
    hourly_ts = np.arange(start_ts, end_ts, 3600)
    hourly_heights = interp(hourly_ts)
    hourly_dates = pd.to_datetime(hourly_ts, unit='s')
    
    # Rodar o motor de Fourier Científico
    print("Injetando no Motor Oceanográfico de Constants Harmônicas (UTide)...")
    # latitude é opcional para inferência da força nodal, Santos é aprox -23.95
    coef = utide.solve(
        hourly_dates, hourly_heights,
        lat=-23.95,
        method='ols',
        conf_int='linear'
    )
    
    # Resultados (DNA do oceano de Santos)
    print("\n--------------------------")
    print(f"🌊 DNA HARMÔNICO EXTRAÍDO: {data['name']}")
    print("--------------------------")
    
    # Ordenar pelos componentes mais fortes (Maior amplitude, que gera as maiores ondas gravitacionais)
    amplitudes = coef['A']
    names = coef['name']
    phases = coef['g']
    
    sorted_idx = np.argsort(amplitudes)[::-1]
    
    # Print top 10
    for idx in sorted_idx[:10]:
        print(f"Astro/Fricção: {names[idx]:<5} | Amplitude (Velocidade/Força): {amplitudes[idx]:.4f}m | Fase: {phases[idx]:.1f}°")
        
    print("\nCom apenas essas constantes salvas, podemos calcular a maré para qualquer ano.")

if __name__ == "__main__":
    extract_dna("santos")
