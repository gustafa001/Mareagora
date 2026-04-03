import json, glob, os

def review():
    jsons = glob.glob('data/*.json')
    problems = []
    print(f"Revisando {len(jsons)} arquivos...")
    
    for f in jsons:
        with open(f, 'r', encoding='utf-8') as jf:
            try:
                data = json.load(jf)
                eventos = data.get('eventos', [])
                total = len(eventos)
                
                # Meta agora é 365 dias
                if total < 365:
                    start = eventos[0]['data'] if eventos else 'vazio'
                    end = eventos[-1]['data'] if eventos else 'vazio'
                    problems.append(f"{total:4d} | {start} -> {end} | {data['porto'][:35]} | {os.path.basename(f)}")
            except Exception as e:
                problems.append(f"ERRO | {f}: {e}")

    with open('temp_out/review_365.txt', 'w', encoding='utf-8') as out:
        out.write(f"Total com menos de 365 dias: {len(problems)}\n\n")
        for p in sorted(problems, reverse=True):
            out.write(p + "\n")
    
    print(f"Feito. review_365.txt gerado com {len(problems)} alertas.")

if __name__ == "__main__":
    review()
