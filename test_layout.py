import pdfplumber
import sys

def test():
    with pdfplumber.open(sys.argv[1]) as pdf:
        text = pdf.pages[0].extract_text(layout=True)
        with open("c:/Users/gusta/Desktop/mareagora/temp_out/layout.txt", "w", encoding="utf-8") as f:
            f.write(text)

if __name__ == '__main__':
    test()
