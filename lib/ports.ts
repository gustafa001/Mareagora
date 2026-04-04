/**
 * MareAgora Ports Database
 * Mapeamento de portos brasileiros para arquivos de dados JSON
 */

export interface Port {
  id: string;
  name: string;
  slug: string;
  state: string;
  region: 'norte' | 'nordeste' | 'sudeste' | 'sul';
  dhnId: string;
  lat: number;
  lon: number;
  offsetMinutes?: number;
  searchNames?: string[];
}

export const PORTS: Port[] = [

  // ── Região Norte ──────────────────────────────────────────────────────────
  { id: '1',  name: 'Porto de Belém (Val de Cães)',              slug: 'porto-de-belem',                       state: 'PA',  region: 'norte',    lat: -1.395917,  lon: -48.492583, dhnId: '10519' },
  { id: '2',  name: 'Ilha do Mosqueiro',                         slug: 'ilha-do-mosqueiro',                    state: 'PA',  region: 'norte',    lat: -1.165389,  lon: -48.474111, dhnId: '10525' },
  { id: '3',  name: 'Porto de Vila do Conde',                    slug: 'porto-de-vila-do-conde',               state: 'PA',  region: 'norte',    lat: -1.539139,  lon: -48.753278, dhnId: '10566' },
  { id: '4',  name: 'Atracadouro de Breves',                     slug: 'atracadouro-de-breves',                state: 'PA',  region: 'norte',    lat: -1.691667,  lon: -50.483333, dhnId: '10571' },
  { id: '5',  name: 'Porto de Santana',                          slug: 'porto-de-santana',                     state: 'AP',  region: 'norte',    lat: -0.061361,  lon: -51.167750, dhnId: '10615' },
  { id: '6',  name: 'Igarapé Grande do Curuá',                   slug: 'igarape-grande-do-curua',              state: 'PA',  region: 'norte',    lat:  0.763333,  lon: -50.118694, dhnId: '10656' },
  { id: '7',  name: 'Barra Norte do Rio Amazonas - Arco Lamoso', slug: 'barra-norte-arco-lamoso',              state: 'PA',  region: 'norte',    lat:  1.435000,  lon: -49.221667, dhnId: '10657' },
  { id: '8',  name: 'Fundeadouro de Salinópolis',                slug: 'fundeadouro-de-salinopolis',           state: 'PA',  region: 'norte',    lat: -0.616667,  lon: -47.350000, dhnId: '20520' },
  { id: '9',  name: 'Ilha dos Guarás',                           slug: 'ilha-dos-guaras',                      state: 'PA',  region: 'norte',    lat: -0.598333,  lon: -47.915000, dhnId: '20535' },

  // ── Região Nordeste ───────────────────────────────────────────────────────
  { id: '10', name: 'Porto de Itaqui',                           slug: 'porto-de-itaqui',                      state: 'MA',  region: 'nordeste', lat: -2.575472,  lon: -44.369806, dhnId: '30110' },
  { id: '11', name: 'São Luís',                                  slug: 'sao-luis',                             state: 'MA',  region: 'nordeste', lat: -2.526667,  lon: -44.311667, dhnId: '30120' },
  { id: '12', name: 'Porto de Tutóia',                           slug: 'porto-de-tutoia',                      state: 'MA',  region: 'nordeste', lat: -2.765000,  lon: -42.275000, dhnId: '30140' },
  { id: '13', name: 'Terminal da Ponta da Madeira',              slug: 'terminal-da-ponta-da-madeira',         state: 'MA',  region: 'nordeste', lat: -2.565278,  lon: -44.378028, dhnId: '30149' },
  { id: '14', name: 'Terminal da Alumar',                        slug: 'terminal-da-alumar',                   state: 'MA',  region: 'nordeste', lat: -2.678278,  lon: -44.358389, dhnId: '30156' },
  { id: '15', name: 'Porto de Luís Correia',                     slug: 'porto-de-luis-correia',                state: 'PI',  region: 'nordeste', lat: -2.851667,  lon: -41.645000, dhnId: '30225' },
  { id: '16', name: 'Terminal Portuário de Pecém',               slug: 'terminal-portuario-do-pecem',          state: 'CE',  region: 'nordeste', lat: -3.535694,  lon: -38.797833, dhnId: '30337' },
  { id: '17', name: 'Porto de Mucuripe - Fortaleza',             slug: 'porto-de-mucuripe-fortaleza',          state: 'CE',  region: 'nordeste', lat: -3.715250,  lon: -38.477389, dhnId: '30340' },
  { id: '18', name: 'Porto de Areia Branca - Termisa',           slug: 'porto-de-areia-branca-termisa',        state: 'RN',  region: 'nordeste', lat: -4.825000,  lon: -37.040000, dhnId: '30407' },
  { id: '19', name: 'Porto de Guamaré',                          slug: 'porto-de-guamare',                     state: 'RN',  region: 'nordeste', lat: -5.106250,  lon: -36.317222, dhnId: '30443' },
  { id: '20', name: 'Porto de Macau',                            slug: 'porto-de-macau',                       state: 'RN',  region: 'nordeste', lat: -5.100528,  lon: -36.673833, dhnId: '30445' },
  { id: '21', name: 'Porto de Natal',                            slug: 'porto-de-natal',                       state: 'RN',  region: 'nordeste', lat: -5.766667,  lon: -35.201667, dhnId: '30462' },
  { id: '22', name: 'Porto de Cabedelo',                         slug: 'porto-de-cabedelo',                    state: 'PB',  region: 'nordeste', lat: -6.970278,  lon: -34.840667, dhnId: '30540' },
  { id: '23', name: 'Porto do Recife',                           slug: 'porto-do-recife',                      state: 'PE',  region: 'nordeste', lat: -8.056778,  lon: -34.866472, dhnId: '30645' },
  { id: '24', name: 'Porto de Suape',                            slug: 'porto-de-suape',                       state: 'PE',  region: 'nordeste', lat: -8.393333,  lon: -34.960000, dhnId: '30686' },
  { id: '25', name: 'Porto de Maceió',                           slug: 'porto-de-maceio',                      state: 'AL',  region: 'nordeste', lat: -9.683167,  lon: -35.725111, dhnId: '30725' },
  { id: '26', name: 'Terminal Marítimo Inácio Barbosa',          slug: 'terminal-maritimo-inacio-barbosa',     state: 'SE',  region: 'nordeste', lat: -10.842778, lon: -36.917944, dhnId: '30810' },
  { id: '27', name: 'Capitania dos Portos de Sergipe',           slug: 'capitania-dos-portos-de-sergipe',      state: 'SE',  region: 'nordeste', lat: -10.920000, lon: -37.045889, dhnId: '30825' },
  { id: '28', name: 'Fernando de Noronha',                       slug: 'arquipelago-de-fernando-de-noronha',   state: 'PE',  region: 'nordeste', lat: -3.833333,  lon: -32.403333, dhnId: '30955' },

  // ── Região Sudeste ────────────────────────────────────────────────────────
  { id: '29', name: 'Porto Madre de Deus',                       slug: 'porto-de-madre-de-deus',               state: 'BA',  region: 'sudeste',  lat: -12.749778, lon: -38.623694, dhnId: '40118' },
  { id: '30', name: 'Base de Aratu',                             slug: 'porto-de-aratu',                       state: 'BA',  region: 'sudeste',  lat: -12.794611, lon: -38.494194, dhnId: '40135' },
  { id: '31', name: 'Porto de Salvador',                         slug: 'porto-de-salvador',                    state: 'BA',  region: 'sudeste',  lat: -12.973750, lon: -38.517222, dhnId: '40141' },
  { id: '32', name: 'Porto de Ilhéus',                           slug: 'porto-de-ilheus',                      state: 'BA',  region: 'sudeste',  lat: -14.780361, lon: -39.026833, dhnId: '40145' },
  { id: '33', name: 'Terminal da Barra do Riacho',               slug: 'terminal-de-barra-do-riacho',          state: 'ES',  region: 'sudeste',  lat: -19.838639, lon: -40.059722, dhnId: '40240' },
  { id: '34', name: 'Porto de Tubarão',                          slug: 'porto-de-tubarao',                     state: 'ES',  region: 'sudeste',  lat: -20.288778, lon: -40.243694, dhnId: '40255' },
  { id: '35', name: 'Porto de Vitória',                          slug: 'porto-de-vitoria',                     state: 'ES',  region: 'sudeste',  lat: -20.321667, lon: -40.335944, dhnId: '40256' },
  { id: '36', name: 'Ilha da Trindade',                          slug: 'ilha-da-trindade',                     state: 'ES',  region: 'sudeste',  lat: -20.508333, lon: -29.310000, dhnId: '40263' },
  { id: '37', name: 'Terminal da Ponta do Ubu',                  slug: 'terminal-da-ponta-do-ubu-i',           state: 'ES',  region: 'sudeste',  lat: -20.787833, lon: -40.570389, dhnId: '40292' },
  { id: '38', name: 'Terminal de Imbetiba',                      slug: 'terminal-maritimo-de-imbetiba',        state: 'RJ',  region: 'sudeste',  lat: -22.385000, lon: -41.770000, dhnId: '50116' },
  { id: '39', name: 'Rio de Janeiro - Ilha Fiscal',              slug: 'rio-de-janeiro-fiscal',                state: 'RJ',  region: 'sudeste',  lat: -22.896694, lon: -43.166000, dhnId: '50140' },
  { id: '40', name: 'Porto de Itaguaí',                          slug: 'porto-de-itaguai',                     state: 'RJ',  region: 'sudeste',  lat: -22.932083, lon: -43.842278, dhnId: '50145' },
  { id: '41', name: 'Porto do Forno',                            slug: 'porto-do-forno',                       state: 'RJ',  region: 'sudeste',  lat: -22.972667, lon: -42.013861, dhnId: '50156' },
  { id: '42', name: 'Terminal da Ilha Guaíba',                   slug: 'terminal-da-ilha-guaiba',              state: 'RJ',  region: 'sudeste',  lat: -22.999778, lon: -44.031639, dhnId: '50165' },
  { id: '43', name: 'Porto do Açu',                              slug: 'porto-do-acu',                         state: 'RJ',  region: 'sudeste',  lat: -21.813333, lon: -40.998333, dhnId: '50169' },
  { id: '44', name: 'Porto de Angra dos Reis',                   slug: 'porto-de-angra-dos-reis',              state: 'RJ',  region: 'sudeste',  lat: -23.012889, lon: -44.314722, dhnId: '50170' },
  { id: '45', name: 'Porto de São Sebastião',                    slug: 'porto-de-sao-sebastiao',               state: 'SP',  region: 'sudeste',  lat: -23.810000, lon: -45.398333, dhnId: '50210' },
  { id: '46', name: 'Porto de Santos',                           slug: 'porto-de-santos',                      state: 'SP',  region: 'sudeste',  lat: -23.956778, lon: -46.308111, dhnId: '50228' },

  // Litoral de SP — referência Porto de Santos (dhnId 50228)
  { id: '57', name: 'Guarujá',                  slug: 'guaruja',                   state: 'SP', region: 'sudeste', lat: -23.993056, lon: -46.257778, dhnId: '50228', offsetMinutes:  0, searchNames: ['guaruja', 'guarujá', 'enseada', 'pitangueiras'] },
  { id: '58', name: 'São Vicente',              slug: 'sao-vicente',               state: 'SP', region: 'sudeste', lat: -23.964444, lon: -46.391944, dhnId: '50228', offsetMinutes:  0, searchNames: ['sao vicente', 'são vicente'] },
  { id: '59', name: 'Praia Grande',             slug: 'praia-grande',              state: 'SP', region: 'sudeste', lat: -24.005833, lon: -46.412222, dhnId: '50228', offsetMinutes:  5, searchNames: ['praia grande', 'aviação', 'real'] },
  { id: '60', name: 'Bertioga',                 slug: 'bertioga',                  state: 'SP', region: 'sudeste', lat: -23.854444, lon: -46.138611, dhnId: '50228', offsetMinutes: 15, searchNames: ['bertioga'] },
  { id: '61', name: 'Riviera de São Lourenço',  slug: 'riviera-de-sao-lourenco',   state: 'SP', region: 'sudeste', lat: -23.833333, lon: -46.033333, dhnId: '50228', offsetMinutes: 15, searchNames: ['riviera', 'riviera de sao lourenco', 'são lourenço'] },
  { id: '62', name: 'Mongaguá',                 slug: 'mongagua',                  state: 'SP', region: 'sudeste', lat: -24.085278, lon: -46.622500, dhnId: '50228', offsetMinutes: 10, searchNames: ['mongagua', 'mongaguá'] },
  { id: '63', name: 'Itanhaém',                 slug: 'itanhaem',                  state: 'SP', region: 'sudeste', lat: -24.183333, lon: -46.783333, dhnId: '50228', offsetMinutes: 15, searchNames: ['itanhaem', 'itanhaém'] },
  { id: '64', name: 'Peruíbe',                  slug: 'peruibe',                   state: 'SP', region: 'sudeste', lat: -24.316667, lon: -47.000000, dhnId: '50228', offsetMinutes: 20, searchNames: ['peruibe', 'peruíbe'] },

  // ── Região Sul ────────────────────────────────────────────────────────────
  { id: '47', name: 'Barra de Paranaguá - Canal SE',            slug: 'barra-de-paranagua-sueste',            state: 'PR',  region: 'sul',      lat: -25.540000, lon: -48.295000, dhnId: '60130' },
  { id: '48', name: 'Porto de Paranaguá',                       slug: 'porto-de-paranagua',                   state: 'PR',  region: 'sul',      lat: -25.501667, lon: -48.531667, dhnId: '60132' },
  { id: '49', name: 'Barra de Paranaguá - Canal da Galheta',    slug: 'barra-de-paranagua-galheta',           state: 'PR',  region: 'sul',      lat: -25.567083, lon: -48.316083, dhnId: '60135' },
  { id: '50', name: 'Terminal Portuário da Ponta do Félix',     slug: 'terminal-portuario-da-ponta-do-felix', state: 'PR',  region: 'sul',      lat: -25.455000, lon: -48.678333, dhnId: '60139' },
  { id: '51', name: 'Porto de São Francisco do Sul',            slug: 'porto-de-sao-francisco-do-sul',        state: 'SC',  region: 'sul',      lat: -26.244528, lon: -48.640861, dhnId: '60225' },
  { id: '52', name: 'Porto de Itajaí',                          slug: 'porto-de-itajai',                      state: 'SC',  region: 'sul',      lat: -26.906667, lon: -48.649167, dhnId: '60235' },
  { id: '53', name: 'Porto de Florianópolis',                   slug: 'porto-de-florianopolis',               state: 'SC',  region: 'sul',      lat: -27.587778, lon: -48.556944, dhnId: '60245' },
  { id: '54', name: 'Porto de Imbituba',                        slug: 'porto-de-imbituba',                    state: 'SC',  region: 'sul',      lat: -28.233333, lon: -48.650000, dhnId: '60250' },
  { id: '55', name: 'Porto do Rio Grande',                      slug: 'porto-do-rio-grande',                  state: 'RS',  region: 'sul',      lat: -32.138611, lon: -52.103611, dhnId: '60380' },
  { id: '56', name: 'Base Comandante Ferraz (Antártida)',        slug: 'base-comandante-ferraz',               state: 'ANT', region: 'sul',      lat: -62.085000, lon: -58.395000, dhnId: '60900' },

];

export function getPortBySlug(slug: string): Port | undefined {
  return PORTS.find(port => port.slug === slug);
}

export function getAllSlugs(): string[] {
  return PORTS.map(port => port.slug);
}

export function getPortsByRegion(region: Port['region']): Port[] {
  return PORTS.filter(port => port.region === region);
}

// ✅ CORREÇÃO: prioriza praias (offsetMinutes definido) sobre portos industriais,
// ordenando por distância dentro de cada grupo
export function getNearbySlugs(port: Port, limit: number = 4): Port[] {
  const others = PORTS.filter(p => p.id !== port.id);

  const withDist = others.map(p => ({
    port: p,
    dist: Math.sqrt(Math.pow(p.lat - port.lat, 2) + Math.pow(p.lon - port.lon, 2)),
    isBeach: p.offsetMinutes !== undefined,
  }));

  withDist.sort((a, b) => {
    // Praias primeiro
    if (a.isBeach && !b.isBeach) return -1;
    if (!a.isBeach && b.isBeach) return 1;
    // Dentro do mesmo grupo, mais perto primeiro
    return a.dist - b.dist;
  });

  return withDist.slice(0, limit).map(x => x.port);
}

export function getAllRegions(): { id: Port['region']; name: string }[] {
  return [
    { id: 'norte',    name: 'Região Norte'    },
    { id: 'nordeste', name: 'Região Nordeste' },
    { id: 'sudeste',  name: 'Região Sudeste'  },
    { id: 'sul',      name: 'Região Sul'      },
  ];
}

export function getNearestPort(lat: number, lon: number): Port {
  let nearest = PORTS[0];
  let minDist = Infinity;
  for (const port of PORTS) {
    const d = Math.sqrt(Math.pow(port.lat - lat, 2) + Math.pow(port.lon - lon, 2));
    if (d < minDist) { minDist = d; nearest = port; }
  }
  return nearest;
}
