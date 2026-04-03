import pdfplumber
import os

files = [
    r'c:\Users\gusta\Desktop\marinha\40 - PORTO DO RIO DE JANEIRO - I FISCAL - 130 - 132.pdf',
    r'c:\Users\gusta\Desktop\marinha\41 - PORTO DE ITAGUAÍ - 133 - 135.pdf',
    r'c:\Users\gusta\Desktop\marinha\43 - TERMINAL DA ILHA GUAÍBA - 139 - 141.pdf',
    r'c:\Users\gusta\Desktop\marinha\53 - PORTO DE FLORIANÓPOLIS - 169 - 171 (1).pdf',
    r'c:\Users\gusta\Desktop\marinha\55 - PORTO DO RIO GRANDE - 175 -177.pdf'
]

def debug_last_page(path):
    print(f"\n--- {os.path.basename(path)} ---")
    if not os.path.exists(path):
        print("FAIL: File not found")
        return
    with pdfplumber.open(path) as pdf:
        p = pdf.pages[2] # 3rd page
        words = p.extract_words()
        hora_words = sorted([w for w in words if w['text'] == 'HORA'], key=lambda x: x['x0'])
        print(f"HORA count: {len(hora_words)}")
        for i, w in enumerate(hora_words):
            print(f"  Col {i}: x0={w['x0']:.1f}")
        
        # Check if last HORA is significantly further than others
        if len(hora_words) >= 2:
            diffs = [hora_words[i+1]['x0'] - hora_words[i]['x0'] for i in range(len(hora_words)-1)]
            print(f"X Diffs: {diffs}")

debug_last_page(files[0])
debug_last_page(files[3])
debug_last_page(files[4])
