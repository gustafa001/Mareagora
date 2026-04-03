import json, os, glob
from datetime import date, timedelta

def check_file(path):
    try:
        with open(path, encoding='utf-8') as f:
            d = json.load(f)
        evs = {e.get('data'): e.get('mares') for e in d.get('eventos', []) if e.get('data')}
        st = date(2026, 1, 1)
        # Check all 365 days
        bz = []
        for i in range(365):
            curr = (st + timedelta(days=i)).isoformat()
            if curr not in evs or not evs[curr]:
                bz.append(curr)
        return len(bz), bz
    except Exception as e:
        return 999, [str(e)]

def main():
    print("--- AUDITORIA FINAL DE COBERTURA (META 365 DIAS) ---")
    files = sorted(glob.glob(os.path.join("data", "*.json")))
    if not files:
        print("ERRO: Nao foram encontrados arquivos .json na pasta 'data'")
        return

    res = []
    for f in files:
        count, examples = check_file(f)
        if count > 0:
            res.append(f"{os.path.basename(f)}: {count} buracos {examples[:3]}")

    if not res:
        print("\n--- COBERTURA TOTAL CONFIRMADA: 365 DIAS EM TODOS OS PORTOS! ---")
        print(f"Total de portos validados: {len(files)}")
    else:
        print("\nBURACOS RESTANTES ENCONTRADOS:")
        for r in res:
            print(r)

if __name__ == "__main__":
    main()
