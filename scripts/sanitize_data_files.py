import os, unicodedata, re

def sanitize(s):
    # Normalize to NFD to separate accents, then filter non-spacing marks (accents)
    nfd = unicodedata.normalize('NFD', s)
    ascii_only = ''.join(c for c in nfd if unicodedata.category(c) != 'Mn')
    # Lowercase and replace non-alphanumeric (except . and -) with underscores
    safe = re.sub(r'[^a-zA-Z0-9\.\-]', '_', ascii_only.lower())
    # Collapse multiple underscores
    return re.sub(r'_{2,}', '_', safe)

def finalize_sync():
    data_dir = 'data'
    ports_ts = 'lib/ports.ts'
    
    # 1. Rename files in data/
    mapping = {} # id -> new_filename
    for f in os.listdir(data_dir):
        if f.endswith('.json'):
            # Extract port ID (assumes {id}_-_ format)
            match = re.match(r'^(\d+)_-_', f)
            if match:
                pid = match.group(1)
                new_f = sanitize(f)
                os.rename(os.path.join(data_dir, f), os.path.join(data_dir, new_f))
                mapping[pid] = new_f
                print(f"Renamed: {f} -> {new_f}")

    # 2. Update lib/ports.ts
    if os.path.exists(ports_ts):
        with open(ports_ts, 'r', encoding='utf-8') as f:
            content = f.read()
        
        def replace_fn(match):
            pid = match.group(1)
            old_fn = match.group(2)
            if pid in mapping:
                return f"id: '{pid}'," + match.group(0).split(f"id: '{pid}',")[1].replace(f"dataFile: '{old_fn}'", f"dataFile: '{mapping[pid]}'")
            return match.group(0)

        # Regex to find port entries
        pattern = r"id: '(\d+)',.*?dataFile: '([^']+)'"
        new_content = re.sub(pattern, replace_fn, content, flags=re.DOTALL)
        
        with open(ports_ts, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Updated lib/ports.ts with safe filenames.")

if __name__ == "__main__":
    finalize_sync()
