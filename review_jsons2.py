import glob, json, re, sys

jsons = sorted(glob.glob('c:\\Users\\gusta\\Desktop\\mareagora\\data\\*.json'))
problemas = []
for j in jsons:
    fname = j.split('\\')[-1]
    if re.match(r'^\d+_-_\d+_-_', fname):
        continue
    with open(j, 'r', encoding='utf-8') as f:
        d = json.load(f)
    total_dias = len(d.get('eventos', []))
    porto = d.get('porto', '?')
    ultimo = d['eventos'][-1]['data'] if d.get('eventos') else 'vazio'
    primeiro = d['eventos'][0]['data'] if d.get('eventos') else 'vazio'
    if total_dias < 350:
        problemas.append((fname, porto, total_dias, primeiro, ultimo))

lines = [f'Total com problemas: {len(problemas)}', '']
for nome, porto, dias, pri, ult in sorted(problemas, key=lambda x: x[2]):
    lines.append(f'{dias:>4} | {pri} -> {ult} | {porto[:35]} | {nome}')

with open('c:\\Users\\gusta\\Desktop\\mareagora\\temp_out\\review.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print('Done. review.txt written.')
