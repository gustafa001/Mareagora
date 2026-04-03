import pdfplumber
pdf = pdfplumber.open(r'c:\Users\gusta\Desktop\marinha\52 - PORTO DE ITAJAÍ - 166 - 168.pdf')
p = pdf.pages[0]
words = p.extract_words()
# Filter words in the "messy" area (top between 210 and 240)
target_words = [w for w in words if 210 < w['top'] < 250]
with open(r'c:\Users\gusta\Desktop\mareagora\temp_out\52_words_debug.txt', 'w', encoding='utf-8') as f:
    for w in sorted(target_words, key=lambda x: (x['top'], x['x0'])):
        f.write(f"top={w['top']:.1f} x0={w['x0']:.1f} text={repr(w['text'])}\n")
