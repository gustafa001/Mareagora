import os
import json
import sys

def validar_integridade(data_dir):
    files = [f for f in os.listdir(data_dir) if f.endswith('.json')]
    total = len(files)
    ok = 0
    warnings = []
    errors = []

    print(f"Auditando {total} arquivos em {data_dir}...\n")

    for filename in sorted(files):
        path = os.path.join(data_dir, filename)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            porto = data.get('porto', 'DESCONHECIDO')
            ano = data.get('ano', '????')
            eventos = data.get('eventos', [])
            dias_unicos = set(e['data'] for e in eventos)
            num_dias = len(dias_unicos)

            if num_dias >= 350:
                ok += 1
            else:
                warnings.append(f"{filename}: {num_dias} dias ({porto} - {ano})")

        except Exception as e:
            errors.append(f"{filename}: Erro ao ler - {str(e)}")

    print(f"--- RESUMO DA AUDITORIA ---")
    print(f"Total de Portos: {total}")
    print(f"Portos OK (>=350 dias): {ok}")
    print(f"Avisos (<350 dias): {len(warnings)}")
    print(f"Erros de Processamento: {len(errors)}")

    if warnings:
        print("\n--- DETALHES DOS AVISOS ---")
        for w in warnings:
            print(f"  [!] {w}")

    if errors:
        print("\n--- DETALHES DOS ERROS ---")
        for e in errors:
            print(f"  [X] {e}")

if __name__ == "__main__":
    validar_integridade('data')
