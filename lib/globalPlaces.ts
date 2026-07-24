export interface GlobalPlace {
  slug: string;
  name: string;
  countryCode: string; // ISO 3166-1 alpha-2, minúsculo — ex: 'pt', 'us', 'au'
  countryName: string;
  lat: number;
  lon: number;
  utcOffsetMin: number; // offset UTC padrão em minutos (sem DST)
}

export const GLOBAL_PLACES: GlobalPlace[] = [

  // ── PORTUGAL ─────────────────────────────────────────────────────────────
  { slug: 'lisboa',         name: 'Lisboa',          countryCode: 'pt', countryName: 'Portugal',         lat: 38.7223,  lon: -9.1393,    utcOffsetMin: 60  },
  { slug: 'porto',          name: 'Porto',            countryCode: 'pt', countryName: 'Portugal',         lat: 41.1579,  lon: -8.6291,    utcOffsetMin: 60  },
  { slug: 'faro',           name: 'Faro',             countryCode: 'pt', countryName: 'Portugal',         lat: 37.0194,  lon: -7.9322,    utcOffsetMin: 60  },
  { slug: 'setubal',        name: 'Setúbal',          countryCode: 'pt', countryName: 'Portugal',         lat: 38.5244,  lon: -8.8882,    utcOffsetMin: 60  },
  { slug: 'viana-do-castelo', name: 'Viana do Castelo', countryCode: 'pt', countryName: 'Portugal',      lat: 41.6931,  lon: -8.8345,    utcOffsetMin: 60  },
  { slug: 'funchal',        name: 'Funchal (Madeira)', countryCode: 'pt', countryName: 'Portugal',        lat: 32.6502,  lon: -16.9200,   utcOffsetMin: 0   },
  { slug: 'ponta-delgada',  name: 'Ponta Delgada (Açores)', countryCode: 'pt', countryName: 'Portugal',  lat: 37.7412,  lon: -25.6756,   utcOffsetMin: -60 },

  // ── ESPANHA ───────────────────────────────────────────────────────────────
  { slug: 'barcelona',      name: 'Barcelona',        countryCode: 'es', countryName: 'Espanha',          lat: 41.3851,  lon: 2.1734,     utcOffsetMin: 60  },
  { slug: 'valencia',       name: 'Valência',         countryCode: 'es', countryName: 'Espanha',          lat: 39.4699,  lon: -0.3763,    utcOffsetMin: 60  },
  { slug: 'malaga',         name: 'Málaga',           countryCode: 'es', countryName: 'Espanha',          lat: 36.7213,  lon: -4.4214,    utcOffsetMin: 60  },
  { slug: 'cadiz',          name: 'Cádiz',            countryCode: 'es', countryName: 'Espanha',          lat: 36.5271,  lon: -6.2886,    utcOffsetMin: 60  },
  { slug: 'vigo',           name: 'Vigo',             countryCode: 'es', countryName: 'Espanha',          lat: 42.2328,  lon: -8.7226,    utcOffsetMin: 60  },
  { slug: 'bilbao',         name: 'Bilbao',           countryCode: 'es', countryName: 'Espanha',          lat: 43.2630,  lon: -2.9350,    utcOffsetMin: 60  },
  { slug: 'palma-de-mallorca', name: 'Palma de Mallorca', countryCode: 'es', countryName: 'Espanha',     lat: 39.5696,  lon: 2.6502,     utcOffsetMin: 60  },
  { slug: 'las-palmas',     name: 'Las Palmas',       countryCode: 'es', countryName: 'Espanha',          lat: 28.1235,  lon: -15.4363,   utcOffsetMin: 0   },

  // ── FRANÇA ───────────────────────────────────────────────────────────────
  { slug: 'marseille',      name: 'Marselha',         countryCode: 'fr', countryName: 'França',           lat: 43.2965,  lon: 5.3698,     utcOffsetMin: 60  },
  { slug: 'nice',           name: 'Nice',             countryCode: 'fr', countryName: 'França',           lat: 43.7102,  lon: 7.2620,     utcOffsetMin: 60  },
  { slug: 'bordeaux',       name: 'Bordeaux',         countryCode: 'fr', countryName: 'França',           lat: 44.8378,  lon: -0.5792,    utcOffsetMin: 60  },
  { slug: 'brest',          name: 'Brest',            countryCode: 'fr', countryName: 'França',           lat: 48.3905,  lon: -4.4860,    utcOffsetMin: 60  },
  { slug: 'la-rochelle',    name: 'La Rochelle',      countryCode: 'fr', countryName: 'França',           lat: 46.1591,  lon: -1.1520,    utcOffsetMin: 60  },

  // ── ITÁLIA ────────────────────────────────────────────────────────────────
  { slug: 'genova',         name: 'Gênova',           countryCode: 'it', countryName: 'Itália',           lat: 44.4056,  lon: 8.9463,     utcOffsetMin: 60  },
  { slug: 'napoli',         name: 'Nápoles',          countryCode: 'it', countryName: 'Itália',           lat: 40.8518,  lon: 14.2681,    utcOffsetMin: 60  },
  { slug: 'venezia',        name: 'Veneza',           countryCode: 'it', countryName: 'Itália',           lat: 45.4408,  lon: 12.3155,    utcOffsetMin: 60  },
  { slug: 'palermo',        name: 'Palermo',          countryCode: 'it', countryName: 'Itália',           lat: 38.1157,  lon: 13.3615,    utcOffsetMin: 60  },
  { slug: 'bari',           name: 'Bari',             countryCode: 'it', countryName: 'Itália',           lat: 41.1171,  lon: 16.8719,    utcOffsetMin: 60  },

  // ── REINO UNIDO ──────────────────────────────────────────────────────────
  { slug: 'london',         name: 'Londres',          countryCode: 'gb', countryName: 'Reino Unido',      lat: 51.5074,  lon: -0.1278,    utcOffsetMin: 0   },
  { slug: 'dover',          name: 'Dover',            countryCode: 'gb', countryName: 'Reino Unido',      lat: 51.1279,  lon: 1.3134,     utcOffsetMin: 0   },
  { slug: 'liverpool',      name: 'Liverpool',        countryCode: 'gb', countryName: 'Reino Unido',      lat: 53.4084,  lon: -2.9916,    utcOffsetMin: 0   },
  { slug: 'portsmouth',     name: 'Portsmouth',       countryCode: 'gb', countryName: 'Reino Unido',      lat: 50.8198,  lon: -1.0880,    utcOffsetMin: 0   },
  { slug: 'southampton',    name: 'Southampton',      countryCode: 'gb', countryName: 'Reino Unido',      lat: 50.9097,  lon: -1.4044,    utcOffsetMin: 0   },
  { slug: 'glasgow',        name: 'Glasgow',          countryCode: 'gb', countryName: 'Reino Unido',      lat: 55.8642,  lon: -4.2518,    utcOffsetMin: 0   },
  { slug: 'aberdeen',       name: 'Aberdeen',         countryCode: 'gb', countryName: 'Reino Unido',      lat: 57.1497,  lon: -2.0943,    utcOffsetMin: 0   },

  // ── IRLANDA ───────────────────────────────────────────────────────────────
  { slug: 'dublin',         name: 'Dublin',           countryCode: 'ie', countryName: 'Irlanda',          lat: 53.3498,  lon: -6.2603,    utcOffsetMin: 0   },
  { slug: 'cork',           name: 'Cork',             countryCode: 'ie', countryName: 'Irlanda',          lat: 51.8985,  lon: -8.4756,    utcOffsetMin: 0   },

  // ── PAÍSES BAIXOS ────────────────────────────────────────────────────────
  { slug: 'amsterdam',      name: 'Amsterdam',        countryCode: 'nl', countryName: 'Países Baixos',    lat: 52.3676,  lon: 4.9041,     utcOffsetMin: 60  },
  { slug: 'rotterdam',      name: 'Rotterdam',        countryCode: 'nl', countryName: 'Países Baixos',    lat: 51.9244,  lon: 4.4777,     utcOffsetMin: 60  },

  // ── ALEMANHA ─────────────────────────────────────────────────────────────
  { slug: 'hamburg',        name: 'Hamburgo',         countryCode: 'de', countryName: 'Alemanha',         lat: 53.5753,  lon: 10.0153,    utcOffsetMin: 60  },
  { slug: 'bremerhaven',    name: 'Bremerhaven',      countryCode: 'de', countryName: 'Alemanha',         lat: 53.5396,  lon: 8.5809,     utcOffsetMin: 60  },

  // ── NORUEGA ───────────────────────────────────────────────────────────────
  { slug: 'bergen',         name: 'Bergen',           countryCode: 'no', countryName: 'Noruega',          lat: 60.3913,  lon: 5.3221,     utcOffsetMin: 60  },
  { slug: 'oslo',           name: 'Oslo',             countryCode: 'no', countryName: 'Noruega',          lat: 59.9139,  lon: 10.7522,    utcOffsetMin: 60  },

  // ── DINAMARCA ────────────────────────────────────────────────────────────
  { slug: 'copenhague',     name: 'Copenhague',       countryCode: 'dk', countryName: 'Dinamarca',        lat: 55.6761,  lon: 12.5683,    utcOffsetMin: 60  },

  // ── BÉLGICA ──────────────────────────────────────────────────────────────
  { slug: 'antuérpia',      name: 'Antuérpia',        countryCode: 'be', countryName: 'Bélgica',          lat: 51.2194,  lon: 4.4025,     utcOffsetMin: 60  },

  // ── GRÉCIA ────────────────────────────────────────────────────────────────
  { slug: 'atenas',         name: 'Atenas (Piraeus)', countryCode: 'gr', countryName: 'Grécia',           lat: 37.9755,  lon: 23.7348,    utcOffsetMin: 120 },
  { slug: 'thessaloniki',   name: 'Tessalônica',      countryCode: 'gr', countryName: 'Grécia',           lat: 40.6401,  lon: 22.9444,    utcOffsetMin: 120 },
  { slug: 'heraklion',      name: 'Heraklion (Creta)',countryCode: 'gr', countryName: 'Grécia',           lat: 35.3387,  lon: 25.1442,    utcOffsetMin: 120 },

  // ── TURQUIA ───────────────────────────────────────────────────────────────
  { slug: 'istanbul',       name: 'Istambul',         countryCode: 'tr', countryName: 'Turquia',          lat: 41.0082,  lon: 28.9784,    utcOffsetMin: 180 },
  { slug: 'izmir',          name: 'Izmir',            countryCode: 'tr', countryName: 'Turquia',          lat: 38.4192,  lon: 27.1287,    utcOffsetMin: 180 },
  { slug: 'antalya',        name: 'Antalya',          countryCode: 'tr', countryName: 'Turquia',          lat: 36.8969,  lon: 30.7133,    utcOffsetMin: 180 },

  // ── CROÁCIA ───────────────────────────────────────────────────────────────
  { slug: 'dubrovnik',      name: 'Dubrovnik',        countryCode: 'hr', countryName: 'Croácia',          lat: 42.6507,  lon: 18.0944,    utcOffsetMin: 60  },
  { slug: 'split',          name: 'Split',            countryCode: 'hr', countryName: 'Croácia',          lat: 43.5081,  lon: 16.4402,    utcOffsetMin: 60  },

  // ── MARROCOS ─────────────────────────────────────────────────────────────
  { slug: 'casablanca',     name: 'Casablanca',       countryCode: 'ma', countryName: 'Marrocos',         lat: 33.5731,  lon: -7.5898,    utcOffsetMin: 0   },
  { slug: 'tanger',         name: 'Tânger',           countryCode: 'ma', countryName: 'Marrocos',         lat: 35.7595,  lon: -5.8340,    utcOffsetMin: 0   },
  { slug: 'agadir',         name: 'Agadir',           countryCode: 'ma', countryName: 'Marrocos',         lat: 30.4278,  lon: -9.5981,    utcOffsetMin: 0   },

  // ── SENEGAL ───────────────────────────────────────────────────────────────
  { slug: 'dakar',          name: 'Dakar',            countryCode: 'sn', countryName: 'Senegal',          lat: 14.7167,  lon: -17.4677,   utcOffsetMin: 0   },

  // ── NIGÉRIA ───────────────────────────────────────────────────────────────
  { slug: 'lagos',          name: 'Lagos',            countryCode: 'ng', countryName: 'Nigéria',          lat: 6.5244,   lon: 3.3792,     utcOffsetMin: 60  },

  // ── ANGOLA ────────────────────────────────────────────────────────────────
  { slug: 'luanda',         name: 'Luanda',           countryCode: 'ao', countryName: 'Angola',           lat: -8.8368,  lon: 13.2343,    utcOffsetMin: 60  },

  // ── MOÇAMBIQUE ───────────────────────────────────────────────────────────
  { slug: 'maputo',         name: 'Maputo',           countryCode: 'mz', countryName: 'Moçambique',       lat: -25.9692, lon: 32.5732,    utcOffsetMin: 120 },

  // ── QUÊNIA ────────────────────────────────────────────────────────────────
  { slug: 'mombasa',        name: 'Mombasa',          countryCode: 'ke', countryName: 'Quênia',           lat: -4.0435,  lon: 39.6682,    utcOffsetMin: 180 },

  // ── TANZÂNIA ─────────────────────────────────────────────────────────────
  { slug: 'dar-es-salaam',  name: 'Dar es Salaam',    countryCode: 'tz', countryName: 'Tanzânia',         lat: -6.7924,  lon: 39.2083,    utcOffsetMin: 180 },

  // ── ÁFRICA DO SUL ────────────────────────────────────────────────────────
  { slug: 'cape-town',      name: 'Cidade do Cabo',   countryCode: 'za', countryName: 'África do Sul',    lat: -33.9249, lon: 18.4241,    utcOffsetMin: 120 },
  { slug: 'durban',         name: 'Durban',           countryCode: 'za', countryName: 'África do Sul',    lat: -29.8587, lon: 31.0218,    utcOffsetMin: 120 },

  // ── EGITO ─────────────────────────────────────────────────────────────────
  { slug: 'alexandria',     name: 'Alexandria',       countryCode: 'eg', countryName: 'Egito',            lat: 31.2001,  lon: 29.9187,    utcOffsetMin: 120 },

  // ── EMIRADOS ÁRABES ──────────────────────────────────────────────────────
  { slug: 'dubai',          name: 'Dubai',            countryCode: 'ae', countryName: 'Emirados Árabes',  lat: 25.2048,  lon: 55.2708,    utcOffsetMin: 240 },
  { slug: 'abu-dhabi',      name: 'Abu Dhabi',        countryCode: 'ae', countryName: 'Emirados Árabes',  lat: 24.4539,  lon: 54.3773,    utcOffsetMin: 240 },

  // ── ARÁBIA SAUDITA ───────────────────────────────────────────────────────
  { slug: 'jeddah',         name: 'Jeddah',           countryCode: 'sa', countryName: 'Arábia Saudita',   lat: 21.4858,  lon: 39.1925,    utcOffsetMin: 180 },

  // ── CATAR ─────────────────────────────────────────────────────────────────
  { slug: 'doha',           name: 'Doha',             countryCode: 'qa', countryName: 'Catar',            lat: 25.2854,  lon: 51.5310,    utcOffsetMin: 180 },

  // ── OMÃ ──────────────────────────────────────────────────────────────────
  { slug: 'muscat',         name: 'Mascate',          countryCode: 'om', countryName: 'Omã',              lat: 23.5880,  lon: 58.3829,    utcOffsetMin: 240 },

  // ── ÍNDIA ─────────────────────────────────────────────────────────────────
  { slug: 'mumbai',         name: 'Mumbai',           countryCode: 'in', countryName: 'Índia',            lat: 18.9750,  lon: 72.8258,    utcOffsetMin: 330 },
  { slug: 'chennai',        name: 'Chennai',          countryCode: 'in', countryName: 'Índia',            lat: 13.0827,  lon: 80.2707,    utcOffsetMin: 330 },
  { slug: 'kochi',          name: 'Kochi',            countryCode: 'in', countryName: 'Índia',            lat: 9.9312,   lon: 76.2673,    utcOffsetMin: 330 },
  { slug: 'kolkata',        name: 'Calcutá',          countryCode: 'in', countryName: 'Índia',            lat: 22.5726,  lon: 88.3639,    utcOffsetMin: 330 },
  { slug: 'goa',            name: 'Goa',              countryCode: 'in', countryName: 'Índia',            lat: 15.2993,  lon: 74.1240,    utcOffsetMin: 330 },

  // ── SRI LANKA ─────────────────────────────────────────────────────────────
  { slug: 'colombo',        name: 'Colombo',          countryCode: 'lk', countryName: 'Sri Lanka',        lat: 6.9271,   lon: 79.8612,    utcOffsetMin: 330 },

  // ── TAILÂNDIA ────────────────────────────────────────────────────────────
  { slug: 'bangkok',        name: 'Bangkok',          countryCode: 'th', countryName: 'Tailândia',        lat: 13.7563,  lon: 100.5018,   utcOffsetMin: 420 },
  { slug: 'phuket',         name: 'Phuket',           countryCode: 'th', countryName: 'Tailândia',        lat: 7.8804,   lon: 98.3923,    utcOffsetMin: 420 },

  // ── VIETNÃ ────────────────────────────────────────────────────────────────
  { slug: 'ho-chi-minh',    name: 'Ho Chi Minh',      countryCode: 'vn', countryName: 'Vietnã',           lat: 10.8231,  lon: 106.6297,   utcOffsetMin: 420 },
  { slug: 'da-nang',        name: 'Da Nang',          countryCode: 'vn', countryName: 'Vietnã',           lat: 16.0544,  lon: 108.2022,   utcOffsetMin: 420 },

  // ── MALÁSIA ───────────────────────────────────────────────────────────────
  { slug: 'kuala-lumpur',   name: 'Kuala Lumpur (Port Klang)', countryCode: 'my', countryName: 'Malásia', lat: 3.0000,   lon: 101.4000,   utcOffsetMin: 480 },
  { slug: 'penang',         name: 'Penang',           countryCode: 'my', countryName: 'Malásia',          lat: 5.4164,   lon: 100.3327,   utcOffsetMin: 480 },

  // ── SINGAPURA ────────────────────────────────────────────────────────────
  { slug: 'singapore',      name: 'Singapura',        countryCode: 'sg', countryName: 'Singapura',        lat: 1.3521,   lon: 103.8198,   utcOffsetMin: 480 },

  // ── INDONÉSIA ────────────────────────────────────────────────────────────
  { slug: 'jakarta',        name: 'Jacarta',          countryCode: 'id', countryName: 'Indonésia',        lat: -6.2088,  lon: 106.8456,   utcOffsetMin: 420 },
  { slug: 'bali',           name: 'Bali (Denpasar)',   countryCode: 'id', countryName: 'Indonésia',        lat: -8.6705,  lon: 115.2126,   utcOffsetMin: 480 },
  { slug: 'surabaya',       name: 'Surabaya',         countryCode: 'id', countryName: 'Indonésia',        lat: -7.2575,  lon: 112.7521,   utcOffsetMin: 480 },

  // ── FILIPINAS ────────────────────────────────────────────────────────────
  { slug: 'manila',         name: 'Manila',           countryCode: 'ph', countryName: 'Filipinas',        lat: 14.5995,  lon: 120.9842,   utcOffsetMin: 480 },
  { slug: 'cebu',           name: 'Cebu',             countryCode: 'ph', countryName: 'Filipinas',        lat: 10.3157,  lon: 123.8854,   utcOffsetMin: 480 },

  // ── CHINA ─────────────────────────────────────────────────────────────────
  { slug: 'shanghai',       name: 'Shanghai',         countryCode: 'cn', countryName: 'China',            lat: 31.2304,  lon: 121.4737,   utcOffsetMin: 480 },
  { slug: 'guangzhou',      name: 'Guangzhou',        countryCode: 'cn', countryName: 'China',            lat: 23.1291,  lon: 113.2644,   utcOffsetMin: 480 },
  { slug: 'hong-kong',      name: 'Hong Kong',        countryCode: 'cn', countryName: 'China',            lat: 22.3193,  lon: 114.1694,   utcOffsetMin: 480 },
  { slug: 'tianjin',        name: 'Tianjin',          countryCode: 'cn', countryName: 'China',            lat: 39.3434,  lon: 117.3616,   utcOffsetMin: 480 },
  { slug: 'qingdao',        name: 'Qingdao',          countryCode: 'cn', countryName: 'China',            lat: 36.0671,  lon: 120.3826,   utcOffsetMin: 480 },

  // ── TAIWAN ────────────────────────────────────────────────────────────────
  { slug: 'kaohsiung',      name: 'Kaohsiung',        countryCode: 'tw', countryName: 'Taiwan',           lat: 22.6273,  lon: 120.3014,   utcOffsetMin: 480 },

  // ── JAPÃO ─────────────────────────────────────────────────────────────────
  { slug: 'tokyo',          name: 'Tóquio',           countryCode: 'jp', countryName: 'Japão',            lat: 35.6762,  lon: 139.6503,   utcOffsetMin: 540 },
  { slug: 'osaka',          name: 'Osaka',            countryCode: 'jp', countryName: 'Japão',            lat: 34.6937,  lon: 135.5023,   utcOffsetMin: 540 },
  { slug: 'yokohama',       name: 'Yokohama',         countryCode: 'jp', countryName: 'Japão',            lat: 35.4437,  lon: 139.6380,   utcOffsetMin: 540 },
  { slug: 'nagasaki',       name: 'Nagasaki',         countryCode: 'jp', countryName: 'Japão',            lat: 32.7503,  lon: 129.8777,   utcOffsetMin: 540 },
  { slug: 'kobe',           name: 'Kobe',             countryCode: 'jp', countryName: 'Japão',            lat: 34.6901,  lon: 135.1956,   utcOffsetMin: 540 },

  // ── COREIA DO SUL ────────────────────────────────────────────────────────
  { slug: 'busan',          name: 'Busan',            countryCode: 'kr', countryName: 'Coreia do Sul',    lat: 35.1796,  lon: 129.0756,   utcOffsetMin: 540 },
  { slug: 'incheon',        name: 'Incheon',          countryCode: 'kr', countryName: 'Coreia do Sul',    lat: 37.4563,  lon: 126.7052,   utcOffsetMin: 540 },

  // ── AUSTRÁLIA ────────────────────────────────────────────────────────────
  { slug: 'bondi-beach',    name: 'Bondi Beach',      countryCode: 'au', countryName: 'Austrália',        lat: -33.8908, lon: 151.2743,   utcOffsetMin: 600 },
  { slug: 'sydney',         name: 'Sydney',           countryCode: 'au', countryName: 'Austrália',        lat: -33.8688, lon: 151.2093,   utcOffsetMin: 600 },
  { slug: 'melbourne',      name: 'Melbourne',        countryCode: 'au', countryName: 'Austrália',        lat: -37.8136, lon: 144.9631,   utcOffsetMin: 600 },
  { slug: 'brisbane',       name: 'Brisbane',         countryCode: 'au', countryName: 'Austrália',        lat: -27.4698, lon: 153.0251,   utcOffsetMin: 600 },
  { slug: 'perth',          name: 'Perth',            countryCode: 'au', countryName: 'Austrália',        lat: -31.9505, lon: 115.8605,   utcOffsetMin: 480 },
  { slug: 'adelaide',       name: 'Adelaide',         countryCode: 'au', countryName: 'Austrália',        lat: -34.9285, lon: 138.6007,   utcOffsetMin: 570 },
  { slug: 'darwin',         name: 'Darwin',           countryCode: 'au', countryName: 'Austrália',        lat: -12.4634, lon: 130.8456,   utcOffsetMin: 570 },
  { slug: 'cairns',         name: 'Cairns',           countryCode: 'au', countryName: 'Austrália',        lat: -16.9186, lon: 145.7781,   utcOffsetMin: 600 },
  { slug: 'hobart',         name: 'Hobart',           countryCode: 'au', countryName: 'Austrália',        lat: -42.8821, lon: 147.3272,   utcOffsetMin: 600 },

  // ── NOVA ZELÂNDIA ────────────────────────────────────────────────────────
  { slug: 'auckland',       name: 'Auckland',         countryCode: 'nz', countryName: 'Nova Zelândia',    lat: -36.8509, lon: 174.7645,   utcOffsetMin: 720 },
  { slug: 'wellington',     name: 'Wellington',       countryCode: 'nz', countryName: 'Nova Zelândia',    lat: -41.2924, lon: 174.7787,   utcOffsetMin: 720 },
  { slug: 'christchurch',   name: 'Christchurch',     countryCode: 'nz', countryName: 'Nova Zelândia',    lat: -43.5321, lon: 172.6362,   utcOffsetMin: 720 },

  // ── ESTADOS UNIDOS ───────────────────────────────────────────────────────
  { slug: 'miami',          name: 'Miami',            countryCode: 'us', countryName: 'Estados Unidos',   lat: 25.7617,  lon: -80.1918,   utcOffsetMin: -300 },
  { slug: 'nova-york',      name: 'Nova York',        countryCode: 'us', countryName: 'Estados Unidos',   lat: 40.7128,  lon: -74.0060,   utcOffsetMin: -300 },
  { slug: 'los-angeles',    name: 'Los Angeles',      countryCode: 'us', countryName: 'Estados Unidos',   lat: 34.0522,  lon: -118.2437,  utcOffsetMin: -480 },
  { slug: 'san-francisco',  name: 'San Francisco',    countryCode: 'us', countryName: 'Estados Unidos',   lat: 37.7749,  lon: -122.4194,  utcOffsetMin: -480 },
  { slug: 'seattle',        name: 'Seattle',          countryCode: 'us', countryName: 'Estados Unidos',   lat: 47.6062,  lon: -122.3321,  utcOffsetMin: -480 },
  { slug: 'boston',         name: 'Boston',           countryCode: 'us', countryName: 'Estados Unidos',   lat: 42.3601,  lon: -71.0589,   utcOffsetMin: -300 },
  { slug: 'new-orleans',    name: 'New Orleans',      countryCode: 'us', countryName: 'Estados Unidos',   lat: 29.9511,  lon: -90.0715,   utcOffsetMin: -360 },
  { slug: 'honolulu',       name: 'Honolulu',         countryCode: 'us', countryName: 'Estados Unidos',   lat: 21.3069,  lon: -157.8583,  utcOffsetMin: -600 },
  { slug: 'san-diego',      name: 'San Diego',        countryCode: 'us', countryName: 'Estados Unidos',   lat: 32.7157,  lon: -117.1611,  utcOffsetMin: -480 },
  { slug: 'charleston',     name: 'Charleston',       countryCode: 'us', countryName: 'Estados Unidos',   lat: 32.7765,  lon: -79.9311,   utcOffsetMin: -300 },
  { slug: 'anchorage',      name: 'Anchorage',        countryCode: 'us', countryName: 'Estados Unidos',   lat: 61.2181,  lon: -149.9003,  utcOffsetMin: -540 },

  // ── CANADÁ ────────────────────────────────────────────────────────────────
  { slug: 'vancouver',      name: 'Vancouver',        countryCode: 'ca', countryName: 'Canadá',           lat: 49.2827,  lon: -123.1207,  utcOffsetMin: -480 },
  { slug: 'victoria',       name: 'Victoria',         countryCode: 'ca', countryName: 'Canadá',           lat: 48.4284,  lon: -123.3656,  utcOffsetMin: -480 },
  { slug: 'halifax',        name: 'Halifax',          countryCode: 'ca', countryName: 'Canadá',           lat: 44.6488,  lon: -63.5752,   utcOffsetMin: -240 },
  { slug: 'st-johns',       name: "St. John's",       countryCode: 'ca', countryName: 'Canadá',           lat: 47.5605,  lon: -52.7126,   utcOffsetMin: -210 },

  // ── MÉXICO ────────────────────────────────────────────────────────────────
  { slug: 'cancun',         name: 'Cancún',           countryCode: 'mx', countryName: 'México',           lat: 21.1619,  lon: -86.8515,   utcOffsetMin: -360 },
  { slug: 'acapulco',       name: 'Acapulco',         countryCode: 'mx', countryName: 'México',           lat: 16.8531,  lon: -99.8237,   utcOffsetMin: -360 },
  { slug: 'veracruz',       name: 'Veracruz',         countryCode: 'mx', countryName: 'México',           lat: 19.1738,  lon: -96.1342,   utcOffsetMin: -360 },
  { slug: 'mazatlan',       name: 'Mazatlán',         countryCode: 'mx', countryName: 'México',           lat: 23.2494,  lon: -106.4111,  utcOffsetMin: -420 },

  // ── CUBA ──────────────────────────────────────────────────────────────────
  { slug: 'havana',         name: 'Havana',           countryCode: 'cu', countryName: 'Cuba',             lat: 23.1136,  lon: -82.3666,   utcOffsetMin: -300 },

  // ── REPÚBLICA DOMINICANA ─────────────────────────────────────────────────
  { slug: 'santo-domingo',  name: 'Santo Domingo',    countryCode: 'do', countryName: 'República Dominicana', lat: 18.4861, lon: -69.9312, utcOffsetMin: -240 },

  // ── JAMAICA ───────────────────────────────────────────────────────────────
  { slug: 'kingston',       name: 'Kingston',         countryCode: 'jm', countryName: 'Jamaica',          lat: 17.9970,  lon: -76.7936,   utcOffsetMin: -300 },

  // ── COLOMBIA ──────────────────────────────────────────────────────────────
  { slug: 'cartagena',      name: 'Cartagena',        countryCode: 'co', countryName: 'Colômbia',         lat: 10.3910,  lon: -75.4794,   utcOffsetMin: -300 },
  { slug: 'barranquilla',   name: 'Barranquilla',     countryCode: 'co', countryName: 'Colômbia',         lat: 10.9685,  lon: -74.7813,   utcOffsetMin: -300 },

  // ── VENEZUELA ────────────────────────────────────────────────────────────
  { slug: 'la-guaira',      name: 'La Guaira (Caracas)', countryCode: 've', countryName: 'Venezuela',     lat: 10.6000,  lon: -66.9333,   utcOffsetMin: -240 },

  // ── EQUADOR ───────────────────────────────────────────────────────────────
  { slug: 'guayaquil',      name: 'Guayaquil',        countryCode: 'ec', countryName: 'Equador',          lat: -2.1710,  lon: -79.9224,   utcOffsetMin: -300 },

  // ── PERU ──────────────────────────────────────────────────────────────────
  { slug: 'callao',         name: 'Callao (Lima)',     countryCode: 'pe', countryName: 'Peru',             lat: -12.0432, lon: -77.1282,   utcOffsetMin: -300 },

  // ── CHILE ─────────────────────────────────────────────────────────────────
  { slug: 'valparaiso',     name: 'Valparaíso',       countryCode: 'cl', countryName: 'Chile',            lat: -33.0472, lon: -71.6127,   utcOffsetMin: -240 },
  { slug: 'antofagasta',    name: 'Antofagasta',      countryCode: 'cl', countryName: 'Chile',            lat: -23.6509, lon: -70.3975,   utcOffsetMin: -240 },
  { slug: 'punta-arenas',   name: 'Punta Arenas',     countryCode: 'cl', countryName: 'Chile',            lat: -53.1638, lon: -70.9171,   utcOffsetMin: -180 },

  // ── ARGENTINA ────────────────────────────────────────────────────────────
  { slug: 'buenos-aires',   name: 'Buenos Aires',     countryCode: 'ar', countryName: 'Argentina',        lat: -34.6037, lon: -58.3816,   utcOffsetMin: -180 },
  { slug: 'mar-del-plata',  name: 'Mar del Plata',    countryCode: 'ar', countryName: 'Argentina',        lat: -38.0023, lon: -57.5575,   utcOffsetMin: -180 },
  { slug: 'ushuaia',        name: 'Ushuaia',          countryCode: 'ar', countryName: 'Argentina',        lat: -54.8019, lon: -68.3030,   utcOffsetMin: -180 },

  // ── URUGUAI ───────────────────────────────────────────────────────────────
  { slug: 'montevideo',     name: 'Montevidéu',       countryCode: 'uy', countryName: 'Uruguai',          lat: -34.9011, lon: -56.1645,   utcOffsetMin: -180 },
];

export function getGlobalPlace(countryCode: string, slug: string): GlobalPlace | undefined {
  return GLOBAL_PLACES.find(p => p.countryCode === countryCode && p.slug === slug);
}

export function searchGlobalPlaces(query: string): GlobalPlace[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return GLOBAL_PLACES.filter(
    p => p.name.toLowerCase().includes(q) || p.countryName.toLowerCase().includes(q)
  ).slice(0, 10);
}

export function getPlacesByCountry(countryCode: string): GlobalPlace[] {
  return GLOBAL_PLACES.filter(p => p.countryCode === countryCode);
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Locais próximos, cruzando países */
export function getNearbyGlobalPlaces(place: GlobalPlace, limit: number = 6) {
  return GLOBAL_PLACES
    .filter(p => p.slug !== place.slug)
    .map(p => ({ place: p, distanciaKm: Math.round(haversineKm(place.lat, place.lon, p.lat, p.lon)) }))
    .sort((a, b) => a.distanciaKm - b.distanciaKm)
    .slice(0, limit);
}
