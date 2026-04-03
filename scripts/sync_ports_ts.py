import os, re

def update_ports_ts():
    ports_ts_path = r'c:\Users\gusta\Desktop\mareagora\lib\ports.ts'
    data_dir = r'c:\Users\gusta\Desktop\mareagora\data'
    
    # Map ID -> Filename
    # New names are like "46_-_46_-_porto_de_santos_-_148_-_150.json"
    data_files = {}
    for f in os.listdir(data_dir):
        if f.endswith('.json'):
            match = re.match(r'^(\d+)_-_', f)
            if match:
                data_files[match.group(1)] = f

    with open(ports_ts_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find lines like: { id: '46', ..., dataFile: 'old_name.json' }
    def replace_data_file(match):
        port_id = match.group(1)
        old_file = match.group(2)
        if port_id in data_files:
            new_file = data_files[port_id]
            # Replacing only the dataFile value
            return match.group(0).replace(f"dataFile: '{old_file}'", f"dataFile: '{new_file}'")
        return match.group(0)

    # pattern: id: '(\d+)', .* dataFile: '([^']+)'
    pattern = r"id: '(\d+)',.*?dataFile: '([^']+)'"
    new_content = re.sub(pattern, replace_data_file, content, flags=re.DOTALL)

    with open(ports_ts_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"Updated {len(data_files)} port entries in lib/ports.ts")

if __name__ == "__main__":
    update_ports_ts()
