import os, json, re, subprocess

# Mapeamento de PDFs "GIGANTES" ou CORRETOS para os JSONs que estão falhando
# (Extraído de uma análise manual dos tamanhos de arquivo e nomes)
MAPA_FIX = [
    # PORTO DO AÇU (38) - O PDF de 1.3MB é o correto
    ("38 - PORTO DO AÇU - RJ - 122-124.pdf", "38_-_porto_do_açu_-_124_-_126.json"),
    # IMBETIBA / MACAÉ (39)
    ("39 - TERMINAL MARÍTIMO DE IMBETIBA - RJ - 125-127.pdf", "39_-_terminal_marítimo_de_imbetiba_-_127_-_129.json"),
    # RIO DE JANEIRO (40)
    # Tem um PDF de 8MB de 2025 que contém 2026? Ou o de 58KB? 
    # O de 58KB ("40 - PORTO DO RIO DE JANEIRO - I FISCAL - 130 - 132.pdf") falhou antes.
    ("40 - PORTO DO RIO DE JANEIRO - I FISCAL - 130 - 132.pdf", "40_-_porto_do_rio_de_janeiro_-_i_fiscal_-_130_-_132.json"),
    # ITAGUAÍ (41)
    ("41 - PORTO DE ITAGUAÍ - RJ - 131-133.pdf", "41_-_porto_de_itaguaí_-_133_-_135.json"),
    # PORTO DO FORNO (42)
    ("42 - PORTO DO FORNO - RJ - 134-136.pdf", "42_-_porto_do_forno_-_136_-_138.json"),
    # ANGRA DOS REIS (44)
    ("44 - PORTO DE ANGRA DOS REIS - RJ - 140-142.pdf", "44_-_porto_de_angra_dos_reis_-_142_-144.json"),
    # ILHA GUAÍBA (43)
    ("43 - TERMINAL DA ILHA GUAÍBA - 139 - 141.pdf", "43_-_terminal_da_ilha_guaíba_-_139_-_141.json"),
    # SANTOS (46) - O de 1.4MB é o correto
    ("46 - PORTO DE SANTOS -  146-148.pdf", "46_-_porto_de_santos_-_148_-_150.json"),
    # SÃO SEBASTIÃO (45)
    ("45 - PORTO DE SÃO SEBASTIÃO - 145 - 147.pdf", "45_-_porto_de_são_sebastião_-_145_-_147.json"),
    # ITAJAÍ (52)
    ("52 - PORTO DE ITAJAÍ - 166 - 168.pdf", "52_-_porto_de_itajaí_-_166_-_168.json"),
    # RIO GRANDE (55)
    ("6 - PORTO DO RIO GRANDE (ESTADO DO RIO GRANDE DO SUL) - 2025 - Páginas 173 a 175.pdf", "55_-_porto_do_rio_grande_-_175_-177.json")
]

def run_fix():
    print("Iniciando RE-EXTRAÇÃO de portos com falhas...")
    os.makedirs("data", exist_ok=True)
    
    for pdf_file, json_file in MAPA_FIX:
        pdf_path = os.path.join("pdfs", pdf_file)
        if not os.path.exists(pdf_path):
            print(f"[ERRO] PDF não encontrado: {pdf_path}")
            continue
            
        print(f"Processando {pdf_file} -> {json_file}...")
        # Usa o script extrator_pdf_marinha.py modificado
        try:
            # Chama o script passando o PDF específico e uma pasta temporária de saída
            temp_out = "temp_out"
            os.makedirs(temp_out, exist_ok=True)
            subprocess.run(["python", "scripts/extrator_pdf_marinha.py", pdf_path, temp_out], check=True)
            
            # O script salva o arquivo com o nome do PDF limpo. Precisamos renomear para o json_file alvo.
            # Localiza o arquivo gerado em temp_out
            generated = os.listdir(temp_out)
            if generated:
                source = os.path.join(temp_out, generated[0])
                dest = os.path.join("data", json_file)
                
                # Lê o conteúdo para verificar se extraiu dados
                with open(source, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    dias = len(data.get("eventos", []))
                    if dias > 0:
                        import shutil
                        shutil.move(source, dest)
                        print(f"  [OK] Sucesso! {dias} dias extraídos e salvos em {json_file}")
                    else:
                        print(f"  [AVISO] Nenhuma maré extraída do PDF: {pdf_file}")
            
            # Limpa temp_out
            for f in os.listdir(temp_out):
                os.remove(os.path.join(temp_out, f))
            os.rmdir(temp_out)
            
        except Exception as e:
            print(f"  [ERRO] Falha ao processar {pdf_file}: {e}")

if __name__ == "__main__":
    run_fix()
