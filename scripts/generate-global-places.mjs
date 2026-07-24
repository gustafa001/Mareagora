import * as db from '@neaps/tide-database';
import { readFileSync, writeFileSync } from 'fs';

const stList = typeof db.stations === 'function' ? db.stations() : db.stations;
const arr = Array.isArray(stList) ? stList : Object.values(stList);

const COUNTRY_CODE_MAP = {
  'United States': 'us', 'Canada': 'ca', 'Mexico': 'mx', 'Brazil': 'br',
  'Argentina': 'ar', 'Chile': 'cl', 'Colombia': 'co', 'Venezuela': 've',
  'Peru': 'pe', 'Ecuador': 'ec', 'Uruguay': 'uy', 'Panama': 'pa',
  'Costa Rica': 'cr', 'Honduras': 'hn', 'Guatemala': 'gt', 'Cuba': 'cu',
  'Jamaica': 'jm', 'Puerto Rico': 'pr', 'Dominican Republic': 'do',
  'Trinidad and Tobago': 'tt', 'Barbados': 'bb', 'Belize': 'bz',
  'El Salvador': 'sv', 'Nicaragua': 'ni', 'Haiti': 'ht', 'Bahamas': 'bs',
  'United Kingdom': 'gb', 'Ireland': 'ie', 'France': 'fr', 'Spain': 'es',
  'Portugal': 'pt', 'Italy': 'it', 'Germany': 'de', 'Netherlands': 'nl',
  'Belgium': 'be', 'Denmark': 'dk', 'Norway': 'no', 'Sweden': 'se',
  'Finland': 'fi', 'Iceland': 'is', 'Greece': 'gr', 'Turkey': 'tr',
  'Croatia': 'hr', 'Slovenia': 'si', 'Montenegro': 'me', 'Albania': 'al',
  'Bulgaria': 'bg', 'Romania': 'ro', 'Ukraine': 'ua', 'Russia': 'ru',
  'Poland': 'pl', 'Estonia': 'ee', 'Latvia': 'lv', 'Lithuania': 'lt',
  'Malta': 'mt', 'Cyprus': 'cy', 'Luxembourg': 'lu', 'Austria': 'at',
  'Switzerland': 'ch', 'Morocco': 'ma', 'Algeria': 'dz', 'Tunisia': 'tn',
  'Libya': 'ly', 'Egypt': 'eg', 'Nigeria': 'ng', 'Ghana': 'gh',
  'Senegal': 'sn', 'South Africa': 'za', 'Kenya': 'ke', 'Tanzania': 'tz',
  'Mozambique': 'mz', 'Madagascar': 'mg', 'Angola': 'ao', 'Cameroon': 'cm',
  'Ivory Coast': 'ci', 'Namibia': 'na', 'Mauritius': 'mu', 'Guinea': 'gn',
  'Togo': 'tg', 'Benin': 'bj', 'Gabon': 'ga', 'Congo': 'cg',
  'Democratic Republic of the Congo': 'cd', 'Somalia': 'so', 'Eritrea': 'er',
  'Djibouti': 'dj', 'Sudan': 'sd', 'Liberia': 'lr', 'Sierra Leone': 'sl',
  'Gambia': 'gm', 'Guinea-Bissau': 'gw', 'Cape Verde': 'cv',
  'Sao Tome and Principe': 'st', 'Comoros': 'km', 'Seychelles': 'sc',
  'Israel': 'il', 'Lebanon': 'lb', 'Saudi Arabia': 'sa', 'UAE': 'ae',
  'United Arab Emirates': 'ae', 'Oman': 'om', 'Kuwait': 'kw',
  'Bahrain': 'bh', 'Qatar': 'qa', 'Yemen': 'ye', 'Iran': 'ir',
  'Iraq': 'iq', 'Jordan': 'jo', 'Pakistan': 'pk', 'India': 'in',
  'Sri Lanka': 'lk', 'Bangladesh': 'bd', 'Myanmar': 'mm', 'Thailand': 'th',
  'Vietnam': 'vn', 'Cambodia': 'kh', 'Malaysia': 'my', 'Singapore': 'sg',
  'Indonesia': 'id', 'Philippines': 'ph', 'China': 'cn', 'Hong Kong': 'hk',
  'Taiwan': 'tw', 'Japan': 'jp', 'South Korea': 'kr', 'North Korea': 'kp',
  'Mongolia': 'mn', 'Australia': 'au', 'New Zealand': 'nz',
  'Papua New Guinea': 'pg', 'Fiji': 'fj', 'Vanuatu': 'vu',
  'Solomon Islands': 'sb', 'Samoa': 'ws', 'Tonga': 'to', 'Kiribati': 'ki',
  'Marshall Islands': 'mh', 'Micronesia': 'fm', 'Palau': 'pw',
  'Tuvalu': 'tv', 'Nauru': 'nr', 'Guam': 'gu', 'French Polynesia': 'pf',
  'New Caledonia': 'nc', 'Cook Islands': 'ck', 'Niue': 'nu',
  'Wallis and Futuna': 'wf', 'American Samoa': 'as',
  'Northern Mariana Islands': 'mp',
};

function timezoneToOffsetMin(tz) {
  if (!tz) return 0;
  const map = {
    'Pacific/Honolulu': -600, 'Pacific/Midway': -660, 'Pacific/Samoa': -660,
    'Pacific/Pago_Pago': -660, 'Pacific/Tahiti': -600, 'Pacific/Marquesas': -570,
    'Pacific/Gambier': -540, 'Pacific/Pitcairn': -480, 'Pacific/Easter': -360,
    'Pacific/Galapagos': -360, 'Pacific/Auckland': 720, 'Pacific/Fiji': 720,
    'Pacific/Tongatapu': 780, 'Pacific/Apia': 780, 'Pacific/Noumea': 660,
    'Pacific/Norfolk': 660, 'Pacific/Guadalcanal': 660, 'Pacific/Efate': 660,
    'Pacific/Port_Moresby': 600, 'Pacific/Guam': 600, 'Pacific/Saipan': 600,
    'Pacific/Truk': 600, 'Pacific/Ponape': 660, 'Pacific/Kosrae': 660,
    'Pacific/Majuro': 720, 'Pacific/Kwajalein': 720, 'Pacific/Nauru': 720,
    'Pacific/Tarawa': 720, 'Pacific/Funafuti': 720, 'Pacific/Wake': 720,
    'Pacific/Wallis': 720, 'Pacific/Fakaofo': 780,
    'America/Anchorage': -540, 'America/Juneau': -540, 'America/Sitka': -540,
    'America/Yakutat': -540, 'America/Nome': -540, 'America/Adak': -600,
    'America/Los_Angeles': -480, 'America/Vancouver': -480, 'America/Seattle': -480,
    'America/Tijuana': -480, 'America/Ensenada': -480,
    'America/Phoenix': -420, 'America/Denver': -420, 'America/Boise': -420,
    'America/Edmonton': -420, 'America/Calgary': -420, 'America/Mazatlan': -420,
    'America/Chihuahua': -420, 'America/Hermosillo': -420,
    'America/Chicago': -360, 'America/Mexico_City': -360, 'America/Monterrey': -360,
    'America/Winnipeg': -360, 'America/Regina': -360, 'America/Merida': -360,
    'America/Belize': -360, 'America/Guatemala': -360, 'America/El_Salvador': -360,
    'America/Tegucigalpa': -360, 'America/Managua': -360, 'America/Costa_Rica': -360,
    'America/New_York': -300, 'America/Toronto': -300, 'America/Detroit': -300,
    'America/Indiana/Indianapolis': -300, 'America/Kentucky/Louisville': -300,
    'America/Nassau': -300, 'America/Panama': -300, 'America/Bogota': -300,
    'America/Lima': -300, 'America/Guayaquil': -300, 'America/Eirunepe': -300,
    'America/Porto_Acre': -300, 'America/Rio_Branco': -300,
    'America/Halifax': -240, 'America/Glace_Bay': -240, 'America/Moncton': -240,
    'America/Barbados': -240, 'America/Martinique': -240, 'America/Puerto_Rico': -240,
    'America/Santo_Domingo': -240, 'America/Guyana': -240, 'America/Curacao': -240,
    'America/Aruba': -240, 'America/Anguilla': -240, 'America/Antigua': -240,
    'America/Caracas': -240, 'America/La_Paz': -240, 'America/Manaus': -240,
    'America/Boa_Vista': -240, 'America/Campo_Grande': -240, 'America/Cuiaba': -240,
    'America/St_Johns': -210,
    'America/Sao_Paulo': -180, 'America/Fortaleza': -180, 'America/Recife': -180,
    'America/Maceio': -180, 'America/Belem': -180, 'America/Santarem': -180,
    'America/Argentina/Buenos_Aires': -180, 'America/Argentina/Cordoba': -180,
    'America/Montevideo': -180, 'America/Santiago': -240, 'America/Punta_Arenas': -180,
    'America/Cayenne': -180, 'America/Paramaribo': -180, 'America/Asuncion': -240,
    'Atlantic/South_Georgia': -120, 'Atlantic/Stanley': -180,
    'Atlantic/Cape_Verde': -60, 'Atlantic/Azores': -60, 'Atlantic/Reykjavik': 0,
    'Atlantic/Faroe': 0, 'Atlantic/Canary': 0, 'Atlantic/Madeira': 0,
    'Atlantic/St_Helena': 0,
    'Europe/London': 0, 'Europe/Lisbon': 0, 'Europe/Dublin': 0,
    'Europe/Paris': 60, 'Europe/Madrid': 60, 'Europe/Berlin': 60,
    'Europe/Rome': 60, 'Europe/Amsterdam': 60, 'Europe/Brussels': 60,
    'Europe/Copenhagen': 60, 'Europe/Stockholm': 60, 'Europe/Oslo': 60,
    'Europe/Warsaw': 60, 'Europe/Prague': 60, 'Europe/Vienna': 60,
    'Europe/Budapest': 60, 'Europe/Zurich': 60, 'Europe/Luxembourg': 60,
    'Europe/Malta': 60, 'Europe/Monaco': 60, 'Europe/Andorra': 60,
    'Europe/Ljubljana': 60, 'Europe/Sarajevo': 60, 'Europe/Skopje': 60,
    'Europe/Zagreb': 60, 'Europe/Tirane': 60, 'Europe/Belgrade': 60,
    'Europe/Podgorica': 60, 'Europe/Busingen': 60,
    'Europe/Helsinki': 120, 'Europe/Athens': 120, 'Europe/Bucharest': 120,
    'Europe/Sofia': 120, 'Europe/Vilnius': 120, 'Europe/Riga': 120,
    'Europe/Tallinn': 120, 'Europe/Chisinau': 120, 'Europe/Kiev': 120,
    'Europe/Nicosia': 120, 'Asia/Nicosia': 120,
    'Europe/Istanbul': 180, 'Europe/Kaliningrad': 120, 'Europe/Minsk': 180,
    'Europe/Moscow': 180, 'Europe/Simferopol': 180, 'Europe/Volgograd': 180,
    'Africa/Abidjan': 0, 'Africa/Dakar': 0, 'Africa/Bissau': 0, 'Africa/Monrovia': 0,
    'Africa/Freetown': 0, 'Africa/Conakry': 0, 'Africa/Bamako': 0,
    'Africa/Accra': 0, 'Africa/Lome': 0, 'Africa/Banjul': 0,
    'Africa/Casablanca': 0, 'Africa/El_Aaiun': 0, 'Africa/Lagos': 60,
    'Africa/Porto-Novo': 60, 'Africa/Libreville': 60, 'Africa/Malabo': 60,
    'Africa/Brazzaville': 60, 'Africa/Kinshasa': 60, 'Africa/Luanda': 60,
    'Africa/Douala': 60, 'Africa/Bangui': 60, 'Africa/Ndjamena': 60,
    'Africa/Algiers': 60, 'Africa/Tunis': 60, 'Africa/Tripoli': 120,
    'Africa/Cairo': 120, 'Africa/Johannesburg': 120, 'Africa/Maputo': 120,
    'Africa/Harare': 120, 'Africa/Lusaka': 120, 'Africa/Blantyre': 120,
    'Africa/Gaborone': 120, 'Africa/Mbabane': 120, 'Africa/Maseru': 120,
    'Africa/Windhoek': 120, 'Africa/Khartoum': 180, 'Africa/Nairobi': 180,
    'Africa/Kampala': 180, 'Africa/Dar_es_Salaam': 180, 'Africa/Addis_Ababa': 180,
    'Africa/Mogadishu': 180, 'Africa/Asmara': 180, 'Africa/Djibouti': 180,
    'Africa/Antananarivo': 180, 'Africa/Comoro': 180, 'Africa/Mayotte': 180,
    'Indian/Mauritius': 240, 'Indian/Reunion': 240, 'Indian/Kerguelen': 300,
    'Indian/Maldives': 300, 'Indian/Chagos': 360,
    'Asia/Jerusalem': 120, 'Asia/Beirut': 120, 'Asia/Damascus': 120,
    'Asia/Amman': 120, 'Asia/Baghdad': 180, 'Asia/Riyadh': 180,
    'Asia/Kuwait': 180, 'Asia/Qatar': 180, 'Asia/Bahrain': 180,
    'Asia/Aden': 180, 'Asia/Tehran': 210, 'Asia/Dubai': 240,
    'Asia/Muscat': 240, 'Asia/Tbilisi': 240, 'Asia/Yerevan': 240,
    'Asia/Baku': 240, 'Asia/Kabul': 270, 'Asia/Karachi': 300,
    'Asia/Colombo': 330, 'Asia/Kolkata': 330, 'Asia/Kathmandu': 345,
    'Asia/Dhaka': 360, 'Asia/Almaty': 360, 'Asia/Bishkek': 360,
    'Asia/Rangoon': 390, 'Asia/Bangkok': 420, 'Asia/Vientiane': 420,
    'Asia/Phnom_Penh': 420, 'Asia/Ho_Chi_Minh': 420, 'Asia/Jakarta': 420,
    'Asia/Pontianak': 420, 'Asia/Kuala_Lumpur': 480, 'Asia/Singapore': 480,
    'Asia/Shanghai': 480, 'Asia/Hong_Kong': 480, 'Asia/Taipei': 480,
    'Asia/Makassar': 480, 'Asia/Manila': 480, 'Asia/Ulaanbaatar': 480,
    'Asia/Irkutsk': 480, 'Asia/Tokyo': 540, 'Asia/Seoul': 540,
    'Asia/Pyongyang': 510, 'Asia/Yakutsk': 540, 'Asia/Vladivostok': 600,
    'Asia/Magadan': 660, 'Asia/Kamchatka': 720, 'Asia/Anadyr': 720,
    'Asia/Jayapura': 540, 'Asia/Dili': 540,
    'Australia/Perth': 480, 'Australia/Eucla': 525, 'Australia/Darwin': 570,
    'Australia/Adelaide': 570, 'Australia/Brisbane': 600, 'Australia/Lindeman': 600,
    'Australia/Sydney': 600, 'Australia/Melbourne': 600, 'Australia/Hobart': 600,
    'Australia/Currie': 600, 'Australia/Lord_Howe': 630,
  };
  if (map[tz] !== undefined) return map[tz];
  // Rough fallback from longitude
  return 0;
}

function toSlug(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

// Read existing globalPlaces to extract current slugs
const existingFile = readFileSync('lib/globalPlaces.ts', 'utf-8');
const slugMatches = [...existingFile.matchAll(/slug:\s*'([^']+)'/g)];
const EXISTING_SLUGS = new Set(slugMatches.map(m => m[1]));
console.log('Existing slugs:', EXISTING_SLUGS.size);

// Max per country
const MAX_PER_COUNTRY = {
  us: 120, au: 100, gb: 80, ca: 80, jp: 80, fr: 70,
  de: 70, no: 60, se: 60, dk: 60, nl: 60, fi: 50,
  es: 60, it: 60, pt: 30, gr: 40, nz: 40, kr: 40,
  cn: 60, in: 40, id: 40, ph: 30, my: 30, mx: 40,
  br: 30, ar: 30, cl: 30, za: 30, ru: 40, tr: 30,
  default: 20,
};

const qualified = arr.filter(s => {
  if (!s.latitude || !s.longitude) return false;
  if (!s.name || s.name.length < 2) return false;
  if (!s.country || !COUNTRY_CODE_MAP[s.country]) return false;
  // Must have actual harmonic data
  return s.harmonic_constituents && s.harmonic_constituents.length >= 4;
});

console.log(`Qualified: ${qualified.length}`);

// Deduplicate by country
const byCountry = {};
for (const s of qualified) {
  const cc = COUNTRY_CODE_MAP[s.country];
  (byCountry[cc] ??= []).push(s);
}

const generated = [];
const usedSlugs = new Set(EXISTING_SLUGS);
const usedCoords = new Set();

function coordKey(lat, lon) {
  return `${Math.round(lat * 20)}_${Math.round(lon * 20)}`;
}

// Sort: reference/harmonic first, then name length
for (const [cc, stations] of Object.entries(byCountry)) {
  const max = MAX_PER_COUNTRY[cc] ?? MAX_PER_COUNTRY.default;
  const sorted = [...stations].sort((a, b) => {
    const aRef = a.type === 'reference' || a.type === 'harmonic' ? 0 : 1;
    const bRef = b.type === 'reference' || b.type === 'harmonic' ? 0 : 1;
    if (aRef !== bRef) return aRef - bRef;
    return (a.name?.length ?? 99) - (b.name?.length ?? 99);
  });

  let count = 0;
  for (const s of sorted) {
    if (count >= max) break;
    const lat = parseFloat(s.latitude.toFixed(4));
    const lon = parseFloat(s.longitude.toFixed(4));
    const ck = coordKey(lat, lon);
    if (usedCoords.has(ck)) continue;

    let slug = toSlug(s.name);
    if (!slug || slug.length < 2) continue;
    if (usedSlugs.has(slug)) {
      const s2 = `${slug}-${cc}`;
      if (usedSlugs.has(s2)) continue;
      slug = s2;
    }

    const countryName = s.country;
    const utcOffsetMin = timezoneToOffsetMin(s.timezone);

    generated.push({ slug, name: s.name, countryCode: cc, countryName, lat, lon, utcOffsetMin });
    usedSlugs.add(slug);
    usedCoords.add(ck);
    count++;
  }
}

console.log(`Generated ${generated.length} new places`);

// Append to globalPlaces.ts (before the closing `];`)
const lines = generated.map(p =>
  `  { slug: '${p.slug}', name: '${p.name.replace(/'/g, "\\'")}', countryCode: '${p.countryCode}', countryName: '${p.countryName.replace(/'/g, "\\'")}', lat: ${p.lat}, lon: ${p.lon}, utcOffsetMin: ${p.utcOffsetMin} },`
);

const newContent = existingFile.replace(
  /\n\];\s*\nexport function getGlobalPlace/,
  '\n\n  // ── GERADO AUTOMATICAMENTE DE @neaps/tide-database (' + generated.length + ' estações) ───────\n' +
  lines.join('\n') +
  '\n];\n\nexport function getGlobalPlace'
);

writeFileSync('lib/globalPlaces.ts', newContent, 'utf-8');
console.log('Done! globalPlaces.ts updated.');

// Count total
const total = EXISTING_SLUGS.size + generated.length;
console.log(`Total places now: ${total}`);
