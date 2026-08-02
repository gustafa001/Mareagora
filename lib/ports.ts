/**
 * MareAgora Ports Database
 * Mapeamento de portos brasileiros para arquivos de dados JSON
 */

export interface PortCamera {
  title: string;
  sourceName: string;
  sourceUrl: string;
  // Use videoId para uma live com ID fixo (raramente muda).
  // Use channelId (formato UC...) para canais que reiniciam a
  // transmissão com frequência — o embed sempre pega a live atual
  // do canal, então não quebra quando o videoId muda.
  videoId?: string;
  channelId?: string;
}

export interface Port {
  id: string;
  name: string;
  cityName: string; // Nome amigável para <title>, <h1> e SEO
  slug: string;
  state: string;
  region: 'norte' | 'nordeste' | 'sudeste' | 'sul' | 'especial';
  dhnId: string;
  lat: number;
  lon: number;
  offsetMinutes?: number;
  searchNames?: string[];
  referencePortSlug?: string;
  cameras?: PortCamera[];
}

export const PORTS: Port[] = [

  // ── Região Norte ──────────────────────────────────────────────────────────
  { id: '1',  name: 'Porto de Belém (Val de Cães)',              cityName: 'Belém',                    slug: 'porto-de-belem',                       state: 'PA',  region: 'norte',    lat: -1.395917,  lon: -48.492583, dhnId: '10519' },
  { id: '2',  name: 'Ilha do Mosqueiro',                         cityName: 'Ilha do Mosqueiro',        slug: 'ilha-do-mosqueiro',                    state: 'PA',  region: 'norte',    lat: -1.165389,  lon: -48.474111, dhnId: '10525' },
  { id: '3',  name: 'Porto de Vila do Conde',                    cityName: 'Vila do Conde',            slug: 'porto-de-vila-do-conde',               state: 'PA',  region: 'norte',    lat: -1.539139,  lon: -48.753278, dhnId: '10566' },
  { id: '4',  name: 'Atracadouro de Breves',                     cityName: 'Breves',                   slug: 'atracadouro-de-breves',                state: 'PA',  region: 'norte',    lat: -1.691667,  lon: -50.483333, dhnId: '10571' },
  { id: '5',  name: 'Porto de Santana',                          cityName: 'Santana',                  slug: 'porto-de-santana',                     state: 'AP',  region: 'norte',    lat: -0.061361,  lon: -51.167750, dhnId: '10615' },
  { id: '6',  name: 'Igarapé Grande do Curuá',                   cityName: 'Igarapé do Curuá',         slug: 'igarape-grande-do-curua',              state: 'PA',  region: 'norte',    lat:  0.763333,  lon: -50.118694, dhnId: '10656' },
  { id: '7',  name: 'Barra Norte do Rio Amazonas - Arco Lamoso', cityName: 'Barra Norte do Amazonas',  slug: 'barra-norte-arco-lamoso',              state: 'PA',  region: 'norte',    lat:  1.435000,  lon: -49.221667, dhnId: '10657' },
  { id: '8',  name: 'Fundeadouro de Salinópolis',                cityName: 'Salinópolis',              slug: 'fundeadouro-de-salinopolis',           state: 'PA',  region: 'norte',    lat: -0.616667,  lon: -47.350000, dhnId: '20520' },
  { id: '9',  name: 'Ilha dos Guarás',                           cityName: 'Ilha dos Guarás',          slug: 'ilha-dos-guaras',                      state: 'PA',  region: 'norte',    lat: -0.598333,  lon: -47.915000, dhnId: '20535' },

  // ── Região Nordeste ───────────────────────────────────────────────────────
  { id: '10', name: 'Porto de Itaqui',                           cityName: 'São Luís (Itaqui)',        slug: 'porto-de-itaqui',                      state: 'MA',  region: 'nordeste', lat: -2.575472,  lon: -44.369806, dhnId: '30110' },
  { id: '11', name: 'São Luís',                                  cityName: 'São Luís',                 slug: 'sao-luis',                             state: 'MA',  region: 'nordeste', lat: -2.526667,  lon: -44.311667, dhnId: '30120' },
  { id: '12', name: 'Porto de Tutóia',                           cityName: 'Tutóia',                   slug: 'porto-de-tutoia',                      state: 'MA',  region: 'nordeste', lat: -2.765000,  lon: -42.275000, dhnId: '30140' },
  { id: '13', name: 'Terminal da Ponta da Madeira',              cityName: 'São Luís (Ponta da Madeira)', slug: 'terminal-da-ponta-da-madeira',      state: 'MA',  region: 'nordeste', lat: -2.565278,  lon: -44.378028, dhnId: '30149' },
  { id: '14', name: 'Terminal da Alumar',                        cityName: 'São Luís (Alumar)',        slug: 'terminal-da-alumar',                   state: 'MA',  region: 'nordeste', lat: -2.678278,  lon: -44.358389, dhnId: '30156' },
  { id: '15', name: 'Porto de Luís Correia',                     cityName: 'Luís Correia',             slug: 'porto-de-luis-correia',                state: 'PI',  region: 'nordeste', lat: -2.851667,  lon: -41.645000, dhnId: '30225' },
  { id: '16', name: 'Terminal Portuário de Pecém',               cityName: 'Pecém',                    slug: 'terminal-portuario-do-pecem',          state: 'CE',  region: 'nordeste', lat: -3.535694,  lon: -38.797833, dhnId: '30337' },
  { id: '17', name: 'Porto de Mucuripe - Fortaleza',             cityName: 'Fortaleza',                slug: 'porto-de-mucuripe-fortaleza',          state: 'CE',  region: 'nordeste', lat: -3.715250,  lon: -38.477389, dhnId: '30340' },
  { id: '18', name: 'Porto de Areia Branca - Termisa',           cityName: 'Areia Branca',             slug: 'porto-de-areia-branca-termisa',        state: 'RN',  region: 'nordeste', lat: -4.825000,  lon: -37.040000, dhnId: '30407' },
  { id: '19', name: 'Porto de Guamaré',                          cityName: 'Guamaré',                  slug: 'porto-de-guamare',                     state: 'RN',  region: 'nordeste', lat: -5.106250,  lon: -36.317222, dhnId: '30443' },
  { id: '20', name: 'Porto de Macau',                            cityName: 'Macau',                    slug: 'porto-de-macau',                       state: 'RN',  region: 'nordeste', lat: -5.100528,  lon: -36.673833, dhnId: '30445' },
  { id: '21', name: 'Porto de Natal',                            cityName: 'Natal',                    slug: 'porto-de-natal',                       state: 'RN',  region: 'nordeste', lat: -5.766667,  lon: -35.201667, dhnId: '30462' },
  { id: '22', name: 'Porto de Cabedelo',                         cityName: 'Cabedelo',                 slug: 'porto-de-cabedelo',                    state: 'PB',  region: 'nordeste', lat: -6.970278,  lon: -34.840667, dhnId: '30540' },
  { id: '23', name: 'Porto do Recife',                           cityName: 'Recife',                   slug: 'porto-do-recife',                      state: 'PE',  region: 'nordeste', lat: -8.056778,  lon: -34.866472, dhnId: '30645' },
  { id: '24', name: 'Porto de Suape',                            cityName: 'Suape',                    slug: 'porto-de-suape',                       state: 'PE',  region: 'nordeste', lat: -8.393333,  lon: -34.960000, dhnId: '30686' },
  { id: '25', name: 'Porto de Maceió',                           cityName: 'Maceió',                   slug: 'porto-de-maceio',                      state: 'AL',  region: 'nordeste', lat: -9.683167,  lon: -35.725111, dhnId: '30725' },
  { id: '26', name: 'Terminal Marítimo Inácio Barbosa',          cityName: 'Barra dos Coqueiros',      slug: 'terminal-maritimo-inacio-barbosa',     state: 'SE',  region: 'nordeste', lat: -10.842778, lon: -36.917944, dhnId: '30810' },
  { id: '27', name: 'Capitania dos Portos de Sergipe',           cityName: 'Aracaju',                  slug: 'capitania-dos-portos-de-sergipe',      state: 'SE',  region: 'nordeste', lat: -10.920000, lon: -37.045889, dhnId: '30825' },
  { id: '29', name: 'Porto Madre de Deus',                       cityName: 'Madre de Deus',            slug: 'porto-de-madre-de-deus',               state: 'BA',  region: 'nordeste', lat: -12.749778, lon: -38.623694, dhnId: '40118' },
  { id: '30', name: 'Base de Aratu',                             cityName: 'Aratu',                    slug: 'porto-de-aratu',                       state: 'BA',  region: 'nordeste', lat: -12.794611, lon: -38.494194, dhnId: '40135' },
  { id: '31', name: 'Porto de Salvador',                         cityName: 'Salvador',                 slug: 'porto-de-salvador',                    state: 'BA',  region: 'nordeste', lat: -12.973750, lon: -38.517222, dhnId: '40141' },
  { id: '32', name: 'Porto de Ilhéus',                           cityName: 'Ilhéus',                   slug: 'porto-de-ilheus',                      state: 'BA',  region: 'nordeste', lat: -14.780361, lon: -39.026833, dhnId: '40145' },

  // ── Região Sudeste ────────────────────────────────────────────────────────
  { id: '28', name: 'Fernando de Noronha',                       cityName: 'Fernando de Noronha',      slug: 'arquipelago-de-fernando-de-noronha',   state: 'PE',  region: 'especial', lat: -3.833333,  lon: -32.403333, dhnId: '30955' },
  { id: '33', name: 'Terminal da Barra do Riacho',               cityName: 'Aracruz',                  slug: 'terminal-de-barra-do-riacho',          state: 'ES',  region: 'sudeste',  lat: -19.838639, lon: -40.059722, dhnId: '40240' },
  { id: '34', name: 'Porto de Tubarão',                          cityName: 'Vitória (Tubarão)',        slug: 'porto-de-tubarao',                     state: 'ES',  region: 'sudeste',  lat: -20.288778, lon: -40.243694, dhnId: '40255' },
  { id: '35', name: 'Porto de Vitória',                          cityName: 'Vitória',                  slug: 'porto-de-vitoria',                     state: 'ES',  region: 'sudeste',  lat: -20.321667, lon: -40.335944, dhnId: '40256' },
  { id: '37', name: 'Terminal da Ponta do Ubu',                  cityName: 'Anchieta',                 slug: 'terminal-da-ponta-do-ubu-i',           state: 'ES',  region: 'sudeste',  lat: -20.787833, lon: -40.570389, dhnId: '40292' },
  { id: '38', name: 'Terminal de Imbetiba',                      cityName: 'Macaé',                    slug: 'terminal-maritimo-de-imbetiba',        state: 'RJ',  region: 'sudeste',  lat: -22.385000, lon: -41.770000, dhnId: '50116' },
  { 
    id: '39', name: 'Rio de Janeiro - Ilha Fiscal', cityName: 'Rio de Janeiro', slug: 'rio-de-janeiro-fiscal', state: 'RJ', region: 'sudeste', lat: -22.896694, lon: -43.166000, dhnId: '50140',
    cameras: [
      { title: 'Rio de Janeiro - São Conrado Beach ao Vivo', sourceName: 'YouTube', sourceUrl: 'https://www.youtube.com/live/qM5J5aPdmMY', videoId: 'qM5J5aPdmMY' }
    ]
  },
  { id: '40', name: 'Porto de Itaguaí',                          cityName: 'Itaguaí',                  slug: 'porto-de-itaguai',                     state: 'RJ',  region: 'sudeste',  lat: -22.932083, lon: -43.842278, dhnId: '50145' },
  { id: '41', name: 'Porto do Forno',                            cityName: 'Arraial do Cabo',          slug: 'porto-do-forno',                       state: 'RJ',  region: 'sudeste',  lat: -22.972667, lon: -42.013861, dhnId: '50156' },
  { id: '42', name: 'Terminal da Ilha Guaíba',                   cityName: 'Mangaratiba',              slug: 'terminal-da-ilha-guaiba',              state: 'RJ',  region: 'sudeste',  lat: -22.999778, lon: -44.031639, dhnId: '50165' },
  { id: '43', name: 'Porto do Açu',                              cityName: 'São João da Barra',        slug: 'porto-do-acu',                         state: 'RJ',  region: 'sudeste',  lat: -21.813333, lon: -40.998333, dhnId: '50169' },
  { id: '44', name: 'Porto de Angra dos Reis',                   cityName: 'Angra dos Reis',           slug: 'porto-de-angra-dos-reis',              state: 'RJ',  region: 'sudeste',  lat: -23.012889, lon: -44.314722, dhnId: '50170' },
  { id: '45', name: 'Porto de São Sebastião',                    cityName: 'São Sebastião',            slug: 'porto-de-sao-sebastiao',               state: 'SP',  region: 'sudeste',  lat: -23.810000, lon: -45.398333, dhnId: '50210' },
  { 
    id: '46', name: 'Porto de Santos', cityName: 'Santos', slug: 'porto-de-santos', state: 'SP', region: 'sudeste', lat: -23.956778, lon: -46.308111, dhnId: '50228',
    cameras: [
      { title: 'Santos - Praia do Gonzaga ao Vivo', sourceName: 'Olhar 013', sourceUrl: 'https://www.youtube.com/@olhar013', videoId: 'gmc9ryoJ-vs' },
      { title: 'Entrada do Canal - Porto de Santos ao Vivo', sourceName: 'YouTube', sourceUrl: 'https://www.youtube.com/live/5BxqzvR6TgM', videoId: '5BxqzvR6TgM' },
      { title: 'Canal 1 - Santos ao Vivo', sourceName: 'YouTube', sourceUrl: 'https://www.youtube.com/live/CkHrJQGVukI', videoId: 'CkHrJQGVukI' }
    ]
  },

  // Litoral Norte de SP — referência São Sebastião (dhnId 50210)
  // ATENÇÃO: offsetMinutes abaixo é um placeholder (0) — não verificado contra tábua oficial da Marinha.
  { 
    id: '65', name: 'Ubatuba', cityName: 'Ubatuba', slug: 'ubatuba', state: 'SP', region: 'sudeste', lat: -23.433611, lon: -45.083889, dhnId: '50210', offsetMinutes: 0, searchNames: ['ubatuba', 'itamambuca', 'prumirim', 'vermelha do norte'], referencePortSlug: 'porto-de-sao-sebastiao',
    cameras: [
      { title: 'Ubatuba - Praia Grande (Baguari) ao Vivo', sourceName: 'UBACAM', sourceUrl: 'https://www.youtube.com/watch?v=yPSJYJk-Szc', videoId: 'yPSJYJk-Szc' }
    ]
  },

  // Litoral de SP — referência Porto de Santos (dhnId 50228)
  { 
    id: '57', name: 'Guarujá', cityName: 'Guarujá', slug: 'guaruja', state: 'SP', region: 'sudeste', lat: -23.993056, lon: -46.257778, dhnId: '50228', offsetMinutes:  0, searchNames: ['guaruja', 'guarujá', 'enseada', 'pitangueiras'], referencePortSlug: 'porto-de-santos',
    cameras: [
      { title: 'Guarujá - Praia das Pitangueiras ao Vivo', sourceName: 'Marcelo Praia Grande e Região', sourceUrl: 'https://www.youtube.com/live/9gv3pHK5VpQ', videoId: '9gv3pHK5VpQ' }
    ]
  },
  { id: '58', name: 'São Vicente',             cityName: 'São Vicente',             slug: 'sao-vicente',               state: 'SP', region: 'sudeste', lat: -23.964444, lon: -46.391944, dhnId: '50228', offsetMinutes:  0, searchNames: ['sao vicente', 'são vicente'], referencePortSlug: 'porto-de-santos',
    cameras: [
      { title: 'Morro do Itararé (São Vicente) ao Vivo', sourceName: 'YouTube', sourceUrl: 'https://www.youtube.com/live/ukoSyGLdoTQ', videoId: 'ukoSyGLdoTQ' },
      { title: 'Praia dos Milionários (São Vicente) ao Vivo', sourceName: 'YouTube', sourceUrl: 'https://www.youtube.com/live/yf7EqBAnFek', videoId: 'yf7EqBAnFek' }
    ]
  },
  { 
    id: '59', name: 'Praia Grande', cityName: 'Praia Grande', slug: 'praia-grande', state: 'SP', region: 'sudeste', lat: -24.005833, lon: -46.412222, dhnId: '50228', offsetMinutes:  5, searchNames: ['praia grande', 'aviação', 'real'], referencePortSlug: 'porto-de-santos',
    cameras: [
      { title: 'Praia Grande - Orla ao Vivo', sourceName: 'Intelbras', sourceUrl: 'https://www.youtube.com/live/WJ6LLt6xxkY', videoId: 'WJ6LLt6xxkY' }
    ]
  },
  { id: '60', name: 'Bertioga',                cityName: 'Bertioga',                slug: 'bertioga',                  state: 'SP', region: 'sudeste', lat: -23.854444, lon: -46.138611, dhnId: '50228', offsetMinutes: 15, searchNames: ['bertioga'], referencePortSlug: 'porto-de-santos' },
  { id: '61', name: 'Riviera de São Lourenço', cityName: 'Riviera de São Lourenço', slug: 'riviera-de-sao-lourenco',   state: 'SP', region: 'sudeste', lat: -23.833333, lon: -46.033333, dhnId: '50228', offsetMinutes: 15, searchNames: ['riviera', 'riviera de sao lourenco', 'são lourenço'], referencePortSlug: 'porto-de-santos' },
  { id: '62', name: 'Mongaguá',                cityName: 'Mongaguá',                slug: 'mongagua',                  state: 'SP', region: 'sudeste', lat: -24.085278, lon: -46.622500, dhnId: '50228', offsetMinutes: 10, searchNames: ['mongagua', 'mongaguá'], referencePortSlug: 'porto-de-santos' },
  { id: '63', name: 'Itanhaém',                cityName: 'Itanhaém',                slug: 'itanhaem',                  state: 'SP', region: 'sudeste', lat: -24.183333, lon: -46.783333, dhnId: '50228', offsetMinutes: 15, searchNames: ['itanhaem', 'itanhaém'], referencePortSlug: 'porto-de-santos',
    cameras: [
      { title: 'Praia dos Sonhos (Itanhaém) ao Vivo', sourceName: 'YouTube', sourceUrl: 'https://www.youtube.com/live/OlEJOalq4oQ', videoId: 'OlEJOalq4oQ' }
    ]
  },
  { id: '64', name: 'Peruíbe',                 cityName: 'Peruíbe',                 slug: 'peruibe',                   state: 'SP', region: 'sudeste', lat: -24.316667, lon: -47.000000, dhnId: '50228', offsetMinutes: 20, searchNames: ['peruibe', 'peruíbe'], referencePortSlug: 'porto-de-santos' },

  // ── Praias Turísticas ────────────────────────────────────────────────────
  { 
    id: '66', name: 'Copacabana', cityName: 'Copacabana', slug: 'copacabana', state: 'RJ', region: 'sudeste', lat: -22.971177, lon: -43.182543, dhnId: '50140', offsetMinutes: 0, searchNames: ['copacabana'], referencePortSlug: 'rio-de-janeiro-fiscal'
  },
  { id: '67', name: 'Ipanema',              cityName: 'Ipanema',              slug: 'ipanema',              state: 'RJ', region: 'sudeste',  lat: -22.986889, lon: -43.202944, dhnId: '50140', offsetMinutes: 0, searchNames: ['ipanema'],                        referencePortSlug: 'rio-de-janeiro-fiscal' },
  { id: '68', name: 'Búzios',               cityName: 'Búzios',               slug: 'buzios',               state: 'RJ', region: 'sudeste',  lat: -22.746944, lon: -41.881667, dhnId: '50156', offsetMinutes: 0, searchNames: ['buzios', 'búzios', 'armacao dos buzios'], referencePortSlug: 'porto-do-forno' },
  {
    id: '85', name: 'Cabo Frio', cityName: 'Cabo Frio', slug: 'cabo-frio', state: 'RJ', region: 'sudeste', lat: -22.878611, lon: -42.018889, dhnId: '50156', offsetMinutes: 0, searchNames: ['cabo frio', 'praia do forte'], referencePortSlug: 'porto-do-forno',
    cameras: [
      { title: 'Cabo Frio - Praia do Forte ao Vivo', sourceName: 'Point do Forte', sourceUrl: 'https://www.youtube.com/@cabofrio-rj', channelId: 'UCBLHvdpCPy8J1acuXWu82tA' }
    ]
  },
  { id: '69', name: 'Maresias',             cityName: 'Maresias',             slug: 'maresias',             state: 'SP', region: 'sudeste',  lat: -23.790833, lon: -45.566111, dhnId: '50210', offsetMinutes: 0, searchNames: ['maresias'],                       referencePortSlug: 'porto-de-sao-sebastiao' },
  { id: '70', name: 'Porto de Galinhas',    cityName: 'Porto de Galinhas',    slug: 'porto-de-galinhas',    state: 'PE', region: 'nordeste', lat: -8.510556,  lon: -35.003333, dhnId: '30686', offsetMinutes: 0, searchNames: ['porto de galinhas'],              referencePortSlug: 'porto-de-suape' },
  { id: '84', name: 'Muro Alto',            cityName: 'Muro Alto',            slug: 'muro-alto',            state: 'PE', region: 'nordeste', lat: -8.470000,  lon: -35.008000, dhnId: '30686', offsetMinutes: 0, searchNames: ['muro alto', 'praia de muro alto'], referencePortSlug: 'porto-de-suape' },
  { id: '85', name: 'Cupe',                 cityName: 'Cupe',                 slug: 'cupe',                 state: 'PE', region: 'nordeste', lat: -8.489000,  lon: -35.007000, dhnId: '30686', offsetMinutes: 0, searchNames: ['cupe', 'praia do cupe', 'pontal do cupe'], referencePortSlug: 'porto-de-suape' },
  { id: '86', name: 'Maracaípe',            cityName: 'Maracaípe',            slug: 'maracaipe',            state: 'PE', region: 'nordeste', lat: -8.526000,  lon: -35.013000, dhnId: '30686', offsetMinutes: 0, searchNames: ['maracaipe', 'maracaípe', 'praia de maracaipe', 'pontal de maracaipe'], referencePortSlug: 'porto-de-suape' },
  { id: '87', name: 'Serrambi',             cityName: 'Serrambi',             slug: 'serrambi',             state: 'PE', region: 'nordeste', lat: -8.576000,  lon: -35.033000, dhnId: '30686', offsetMinutes: 0, searchNames: ['serrambi', 'ponta de serrambi', 'praia de serrambi'], referencePortSlug: 'porto-de-suape' },
  { id: '88', name: 'Gaibu',                cityName: 'Gaibu',                slug: 'gaibu',                state: 'PE', region: 'nordeste', lat: -8.310000,  lon: -34.957000, dhnId: '30686', offsetMinutes: 0, searchNames: ['gaibu', 'praia de gaibu'],        referencePortSlug: 'porto-de-suape' },
  { id: '89', name: 'Calhetas',             cityName: 'Calhetas',             slug: 'calhetas',             state: 'PE', region: 'nordeste', lat: -8
