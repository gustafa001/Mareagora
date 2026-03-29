import pdfplumber, glob, os

# Listar PDFs problematicos baseado nos nomes dos JSONs com 0 dias
problemas = [
    '37', '38', '39', '40', '47', '53', '54', '55', '56'
]

pdfs_marinha = glob.glob(r'C:\Users\gusta\Desktop\marinha\*.pdf')

for num in problemas[:2]:  # Inspecionar os 2 primeiros
    candidatos = [p for p in pdfs_marinha if os.path.basename(p).startswith(num + ' ') or os.path.basename(p).startswith(num + '-') or os.path.basename(p).startswith(num + '_')]
    if not candidatos:
        # Tentar busca mais ampla
        candidatos = [p for p in pdfs_marinha if os.path.basename(p).startswith(num)]
    
    print('PDF num %s: %s' % (num, candidatos[:1]))
    
    if candidatos:
        with pdfplumber.open(candidatos[0]) as pdf:
            p = pdf.pages[0]
            words = p.extract_words(x_tolerance=2, y_tolerance=2)
            hora_words = [w for w in words if 'HORA' in w['text'].replace(' ','').upper()]
            text = p.extract_text() or ''
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            
            print('  Paginas: %d' % len(pdf.pages))
            print('  Primeiras linhas: %s' % str(lines[:4])[:150])
            print('  Palavras HORA: %d' % len(hora_words))
            for w in hora_words[:5]:
                print('    top=%.1f x0=%.1f texto="%s"' % (w['top'], w['x0'], w['text']))
        print()
