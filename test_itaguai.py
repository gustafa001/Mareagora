import pdfplumber
pdf = pdfplumber.open('c:\\Users\\gusta\\Desktop\\marinha\\41 - PORTO DE ITAGUAÍ - 133 - 135.pdf')
words = pdf.pages[0].extract_words()
with open('c:\\Users\\gusta\\Desktop\\mareagora\\test_itaguai_utf8.txt', 'w', encoding='utf-8') as f:
    data_words = [w for w in words if 104.0 < w['top'] < 130.0]
    for w in sorted(data_words, key=lambda w: (w['top'], w['x0'])):
        f.write(f"top={round(w['top'],1):<7} x0={round(w['x0'],1):<7} text={repr(w['text'])}\n")
