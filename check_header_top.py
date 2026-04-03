import pdfplumber
with pdfplumber.open("c:/Users/gusta/Desktop/marinha/10 - SÃO LUÍS 40 - 42.pdf") as pdf:
    for word in pdf.pages[0].extract_words():
        if word['text'] == 'HORA':
            print("HORA", word['top'])
        if word['text'] == '01' and 125 < word['top'] < 135:
            print("01", word['top'])
