import pdfplumber, glob, sys, os

pdfs = glob.glob(r'C:\Users\gusta\Desktop\marinha\*')
tutoia = [p for p in pdfs if 'ut' in p.lower() and p.endswith('.pdf')]
print('Encontrado:', tutoia)

if tutoia:
    pdf_path = tutoia[0]
    import scripts.extrator_pdf_marinha as ext
    resultado = ext.extrair_pdf(pdf_path)
    print('Dias extraidos:', len(resultado['eventos']))
    print('Porto:', resultado['porto'])
    print('Ano:', resultado['ano'])
    
    import json
    nome = 'data/porto_de_tutoia_corrigido.json'
    with open(nome, 'w', encoding='utf-8') as f:
        json.dump(resultado, f, ensure_ascii=False, indent=2)
    print('Salvo em:', nome)
