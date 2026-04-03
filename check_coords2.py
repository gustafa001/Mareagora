import pdfplumber
with pdfplumber.open("c:/Users/gusta/Desktop/marinha/10 - SÃO LUÍS 40 - 42.pdf") as pdf:
    for word in pdf.pages[0].extract_words():
        if 130 < word['top'] < 140:
            print(f"'{word['text']}' at x0={word['x0']:.2f}")
