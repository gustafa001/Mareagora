import pdfplumber
import sys

def analyze():
    with pdfplumber.open(sys.argv[1]) as pdf:
        page = pdf.pages[0]
        words = page.extract_words()
        
        # print words between y=120 and y=160 (which covers first row of dates)
        row_words = [w for w in words if 115 < w['top'] < 165]
        for w in sorted(row_words, key=lambda x: (x['top'], x['x0'])):
            print(f"{w['text']:<10} x0: {w['x0']:<6.2f} top: {w['top']:<6.2f}")

if __name__ == '__main__':
    analyze()
