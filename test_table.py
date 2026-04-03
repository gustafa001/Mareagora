import pdfplumber
import sys
import json

def test():
    with pdfplumber.open(sys.argv[1]) as pdf:
        table = pdf.pages[0].extract_table()
        # write the table as json for easy reading
        import json
        with open("c:/Users/gusta/Desktop/mareagora/temp_out/table.json", "w", encoding="utf-8") as f:
            json.dump(table, f, indent=2)

if __name__ == '__main__':
    test()
