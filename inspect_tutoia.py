import pdfplumber, glob, sys

pdfs = (
    glob.glob(r'C:\Users\gusta\Desktop\marinha\*ut*ia*') +
    glob.glob(r'C:\Users\gusta\Desktop\marinha\*Tut*ia*')
)
pdfs = list(set(pdfs))
print('PDF:', pdfs[0])

with pdfplumber.open(pdfs[0]) as pdf:
    print('Paginas totais:', len(pdf.pages))
    for i, page in enumerate(pdf.pages):
        words = page.extract_words(x_tolerance=2, y_tolerance=2)
        text = page.extract_text() or ''
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        
        hora_words = [w for w in words if 'HORA' in w['text'].replace(' ','').upper()]
        print('\n=== PAGINA %d ===' % (i+1))
        print('  Primeiras linhas:', lines[:5])
        print('  Total words:', len(words))
        print('  Palavras HORA encontradas: %d' % len(hora_words))
        for w in hora_words:
            print('    top=%.1f x0=%.1f texto="%s"' % (w['top'], w['x0'], w['text']))
        
        # Verificar estrutura de colunas
        all_tops = sorted(set(round(w['top']) for w in words))
        print('  Linhas Y distintas (primeiras 5):', all_tops[:5])
