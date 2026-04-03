import pdfplumber
fname = '37 - TERMINAL DA PONTA DO UBU - 121 - 123 (1).pdf'
pdf = pdfplumber.open(f'c:\\Users\\gusta\\Desktop\\marinha\\{fname}')
text = pdf.pages[0].extract_text(layout=True)
lines = text.split('\n')
with open('c:\\Users\\gusta\\Desktop\\mareagora\\temp_out\\37_layout.txt', 'w', encoding='utf-8') as f:
    for i, l in enumerate(lines):
        f.write(f'{i:3}: {l}\n')
print('done')
