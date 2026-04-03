import pdfplumber
with pdfplumber.open("c:/Users/gusta/Desktop/marinha/10 - SÃO LUÍS 40 - 42.pdf") as pdf:
    for word in pdf.pages[0].extract_words():
        if word['text'] in ['01', '17'] and 100 < word['top'] < 160:
            print(f"Text '{word['text']}' at x0={word['x0']:.2f}")
