import os, glob, json, re

# 1. Mapeamento de ports.ts {id: dataFile}
path_ts = 'lib/ports.ts'
if not os.path.exists(path_ts):
    print(f"ERRO: Arquivo {path_ts} não encontrado.")
    exit(1)

with open(path_ts, 'r', encoding='utf-8') as f:
    ports_ts = f.read()

# Regex para pegar id e dataFile
# Ex: { id: '46', ..., dataFile: '46_-_46_-_porto_de_santos_-_146-148.json' }
mappings = re.findall(r"id:\s*'(\d+)',.*?dataFile:\s*'(.+?)'", ports_ts, re.DOTALL)
id_to_datafile = {id_: df for id_, df in mappings}

# 2. Localização dos arquivos de 365 dias (backup)
backup_dir = r'c:\Users\gusta\Desktop\backup_mare'
jsons_365 = glob.glob(os.path.join(backup_dir, '*.json'))

print(f"Encontrados {len(mappings)} portos em ports.ts.")
print(f"Encontrados {len(jsons_365)} arquivos de 365 dias no backup.\n")

# 3. Limpeza e Sincronia
saida_dir = 'data'
os.makedirs(saida_dir, exist_ok=True)

# Limpar JSONs antigos na pasta data (para não dar confusão)
for f in glob.glob(os.path.join(saida_dir, '*.json')):
    os.remove(f)

count = 0
for f_path in jsons_365:
    fname = os.path.basename(f_path)
    # Pega o ID no início do nome do arquivo (ex: 46_-_...)
    match = re.match(r'^(\d+)', fname)
    if match:
        fid = match.group(1)
        if fid in id_to_datafile:
            expected_name = id_to_datafile[fid]
            
            with open(f_path, 'r', encoding='utf-8') as fh:
                data = json.load(fh)
            
            out_path = os.path.join(saida_dir, expected_name)
            with open(out_path, 'w', encoding='utf-8') as out:
                json.dump(data, out, ensure_ascii=False, indent=2)
            
            print(f"Sincronizado ID {fid:>2}: -> {expected_name}")
            count += 1
        else:
            print(f"AVISO: ID {fid} na pasta backup não encontrado no ports.ts.")

print(f"\nSucesso: {count} arquivos sincronizados com o padrão do site.")
