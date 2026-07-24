const d = require('./data/tide-regime-cache.json');
const entries = Object.entries(d);
const regimes = {};
entries.forEach(([k, v]) => { regimes[v.regime] = (regimes[v.regime] || 0) + 1; });
console.log('Regime distribution (all 1591):', JSON.stringify(regimes));

const amps = entries.map(([k, v]) => v.amplitudeMedia);
console.log('Amplitude range:', Math.min(...amps).toFixed(1), '-', Math.max(...amps).toFixed(1));

// Check unique combos: regime+amplitude to understand text diversity
const combos = new Set(entries.map(([k, v]) => `${v.regime}|${v.amplitudeMedia}|${v.amplitudeMax}`));
console.log('Unique (regime+amp) combos:', combos.size, 'out of', entries.length);
