import json, sys, os, subprocess

# Portos e PDFs específicos
TARGETS = [
    # (Porto ID, PDF Path, JSON Dest, Mode: "DIGITAL"|"OCR")
    (40, "pdfs/4 - PORTO DO RIO DE JANEIRO - ILHA FISCAL (ESTADO DO RIO DE JANEIRO) - 2025 - Páginas 129 a 131.pdf", "40_-_porto_do_rio_de_janeiro_-_i_fiscal_-_130_-_132.json", "OCR"),
    (55, "pdfs/6 - PORTO DO RIO GRANDE (ESTADO DO RIO GRANDE DO SUL) - 2025 - Páginas 173 a 175.pdf", "55_-_porto_do_rio_grande_-_175_-177.json", "OCR"),
    (43, "pdfs/5 - TERMINAL DA ILHA GUAÍBA (ESTADO DO RIO DE JANEIRO) - 2025 - Páginas 137 a 139.pdf", "43_-_terminal_da_ilha_guaíba_-_139_-_141.json", "OCR"),
    (47, "pdfs/47 - TERMINAL PORTUÁRIO DA PONTA DO FÉLIX  151 - 153.pdf", "47_-_terminal_portuário_da_ponta_do_félix__151_-_153.json", "DIGITAL"),
    (52, "pdfs/51 - PORTO DE SÃO FRANCISCO DO SUL - 163 -165.pdf", "51_-_porto_de_são_francisco_do_sul_-_163_-165.json", "DIGITAL"), # SFS
    (52, "pdfs/52 - PORTO DE ITAJAÍ - 166 - 168.pdf", "52_-_porto_de_itajaí_-_166_-_168.json", "DIGITAL"),
]

SCRIPTS_DIR = os.path.dirname(__file__)
EXTRATOR_DIGITAL = os.path.join(SCRIPTS_DIR, "extrator_pdf_marinha.py")
EXTRATOR_OCR = os.path.join(SCRIPTS_DIR, "ocr_tide_extractor_v2.py")
PDFS_DIR = os.path.join(SCRIPTS_DIR, "..", "pdfs")
DATA_DIR = os.path.join(SCRIPTS_DIR, "..", "data")

def main():
    print(f"Iniciando Extração Direcionada para {len(TARGETS)} Portos...\n{'='*60}")
    
    for pid, pdf_rel_path, json_dest, mode in TARGETS:
        pdf_path = os.path.join(os.path.dirname(SCRIPTS_DIR), pdf_rel_path)
        json_path = os.path.join(DATA_DIR, json_dest)
        
        if not os.path.exists(pdf_path):
            print(f"  [AVISO] PDF não encontrado: {pdf_rel_path}")
            continue
            
        print(f"  [{mode}] Porto {pid}: {pdf_rel_path}")
        
        if mode == "OCR":
            cmd = [sys.executable, EXTRATOR_OCR, pdf_path, json_path]
        else:
            # Digital extrator can process a single PDF if provided as arg
            cmd = [sys.executable, EXTRATOR_DIGITAL, pdf_path, DATA_DIR]
            
        try:
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode == 0:
                print(f"        Sucesso! {json_dest}")
                # Audit
                with open(json_path, 'r', encoding='utf-8') as f:
                    d = json.load(f)
                    print(f"        Dias extraídos: {len(d.get('eventos', []))}")
            else:
                print(f"        Erro: {res.stderr}")
        except Exception as e:
            print(f"        Falha crítica: {e}")

if __name__ == "__main__":
    main()
