import pdfplumber
pdf = pdfplumber.open('c:\\Users\\gusta\\Desktop\\marinha\\37 - TERMINAL DA PONTA DO UBU - 121 - 123 (1).pdf')
words = pdf.pages[0].extract_words()
for w in sorted(words, key=lambda w: (w['top'], w['x0']))[:30]:
    print(f"top={round(w['top'],1):<7} x0={round(w['x0'],1):<7} text={repr(w['text'])}")
