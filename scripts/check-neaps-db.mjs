import * as db from '@neaps/tide-database';

const stList = typeof db.stations === 'function' ? db.stations() : db.stations;
const arr = Array.isArray(stList) ? stList : Object.values(stList);

// Show first station structure (just metadata, not geometry)
const s = arr[0];
const { geometry, ...meta } = s;
console.log('Total stations:', arr.length);
console.log('Station metadata keys:', Object.keys(s));
console.log('First station (no geometry):', JSON.stringify(meta, null, 2));
