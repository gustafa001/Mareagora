import sys
import traceback
from main import prever_mare

try:
    print(prever_mare('46_-_porto_de_santos_-_148_-_150'))
except Exception as e:
    with open('teste.log', 'w') as f:
        traceback.print_exc(file=f)
    print("Log salvo em teste.log")
