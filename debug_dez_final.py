import pdfplumber
import os

pdf_path = r'c:\Users\gusta\Desktop\marinha\55 - PORTO DO RIO GRANDE - 175 -177.pdf'
with pdfplumber.open(pdf_path) as pdf:
    p = pdf.pages[2] # Página 3
    words = p.extract_words()
    
    # Busca a 7ª coluna HORA (dezembro 17-31)
    horas = sorted([w for w in words if w['text'] == 'HORA'], key=lambda x: x['x0'])
    if len(horas) < 8:
        print(f"ERRO: Apenas {len(horas)} colunas HORA encontradas.")
    else:
        hx = horas[7]['x0']
        hy = horas[7]['top']
        col_words = sorted([w for w in words if hx - 5 <= w['x0'] < hx + 80 and w['top'] > hy + 4], key=lambda x: x['top'])
        
        print(f"DEBUG COLUNA 7 (DEZ 17-31):")
        print(f"Header Y: {hy:.1f}")
        for w in col_words[:20]:
            print(f"  top={w['top']:.1f} text={repr(w['text'])}")
