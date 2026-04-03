import pdfplumber
import re

pdf_path = r'c:\Users\gusta\Desktop\marinha\55 - PORTO DO RIO GRANDE - 175-177.pdf'
with pdfplumber.open(pdf_path) as pdf:
    # Page 3 is index 2
    p = pdf.pages[2]
    words = p.extract_words()
    
    # Check HORA words
    hora_words = sorted([w for w in words if w['text'] == 'HORA'], key=lambda x: x['x0'])
    print(f"Total HORA found: {len(hora_words)}")
    for i, w in enumerate(hora_words):
        print(f"  {i}: x0={w['x0']:.1f}, top={w['top']:.1f}")
        
    # Check Months found near header
    header_y = min([w['top'] for w in hora_words]) if hora_words else 0
    months_words = [w for w in words if header_y - 65 < w['top'] < header_y - 2]
    print(f"\nMonth words near header y={header_y:.1f}:")
    for w in sorted(months_words, key=lambda x: x['x0']):
        print(f"  text={repr(w['text'])}, x0={w['x0']:.1f}")
