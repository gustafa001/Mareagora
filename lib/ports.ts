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
  dataFile: string;
  lat: number;
  lon: number;
  searchNames?: string[];
}

export const PORTS: Port[] = [
  // Região Norte
  { id: '1',  name: 'Barra Norte - Arco Lamoso',            slug: 'barra-norte-arco-lamoso',             state: 'PA', region: 'norte',    lat: 0.75,   lon: -50.03,  dataFile: '1_-barra_norte_-_arco_lamoso_-_2026_-_13_-_15.json' },
  { id: '2',  name: 'Igarapé Grande do Curuá',              slug: 'igarape-grande-do-curua',             state: 'PA', region: 'norte',    lat: -0.73,  lon: -48.52,  dataFile: '2_-igarapé_grande_do_curuá_-_2026_-_16_-_18.json' },
  { id: '3',  name: 'Porto de Santana',                     slug: 'porto-de-santana',                    state: 'AP', region: 'norte',    lat: 0.05,   lon: -51.18,  dataFile: '3_-_porto_de_santana_-_19_-_21.json' },
  { id: '4',  name: 'Ilha dos Guarás',                      slug: 'ilha-dos-guaras',                     state: 'PA', region: 'norte',    lat: -0.93,  lon: -46.62,  dataFile: '4_-_ilha_dos_guarás__estado_do_pará__-_2026__22_-_24.json' },
  { id: '5',  name: 'Fundeadouro de Salinópolis',           slug: 'fundeadouro-de-salinopolis',          state: 'PA', region: 'norte',    lat: -0.61,  lon: -47.35,  dataFile: '5_-fundeadouro_de_salinópolis____25_-_27.json' },
  { id: '6',  name: 'Ilha do Mosqueiro',                    slug: 'ilha-do-mosqueiro',                   state: 'PA', region: 'norte',    lat: -1.17,  lon: -48.38,  dataFile: '6_-_ilha_do_mosqueiro_28_-_30.json' },
  { id: '7',  name: 'Porto de Belém',                       slug: 'porto-de-belem',                      state: 'PA', region: 'norte',    lat: -1.45,  lon: -48.50,  dataFile: '7_-_porto_de_belém__estado_do_pará__-_2026_-_31_-_33.json' },
  { id: '8',  name: 'Porto de Vila do Conde',               slug: 'porto-de-vila-do-conde',              state: 'PA', region: 'norte',    lat: -1.57,  lon: -48.87,  dataFile: '8_-_porto_de_vila_do_conde__34_-_36.json' },
  { id: '9',  name: 'Atracadouro de Breves',                slug: 'atracadouro-de-breves',               state: 'PA', region: 'norte',    lat: -1.68,  lon: -50.48,  dataFile: '9_-_atracadouro_de_breves_37_-_39.json' },

  // Região Nordeste
  { id: '10', name: 'São Luís',                             slug: 'sao-luis',                            state: 'MA', region: 'nordeste', lat: -2.53,  lon: -44.30,  dataFile: '10_-_são_luís_40_-_42.json' },
  { id: '11', name: 'Terminal da Ponta da Madeira',         slug: 'terminal-da-ponta-da-madeira',        state: 'MA', region: 'nordeste', lat: -2.57,  lon: -44.37,  dataFile: '11_-_terminal_da_ponta_da_madeira_43_-_45.json' },
  { id: '12', name: 'Porto de Itaqui',                      slug: 'porto-de-itaqui',                     state: 'MA', region: 'nordeste', lat: -2.58,  lon: -44.37,  dataFile: '12_-_porto_de_itaqui_-_46_-_48.json' },
  { id: '13', name: 'Terminal da Alumar',                   slug: 'terminal-da-alumar',                  state: 'MA', region: 'nordeste', lat: -2.55,  lon: -44.38,  dataFile: '13_-_terminal_da_alumar_-_49_-_51.json' },
  { id: '14', name: 'Porto de Tutóia',                      slug: 'porto-de-tutoia',                     state: 'MA', region: 'nordeste', lat: -2.76,  lon: -42.27,  dataFile: '14_-_porto_de_tutóia_-_52_-_54.json' },
  { id: '15', name: 'Porto de Luís Correia',                slug: 'porto-de-luis-correia',               state: 'PI', region: 'nordeste', lat: -2.88,  lon: -41.67,  dataFile: '15_-_porto_de_luís_correia_55_-_57.json' },
  { id: '16', name: 'Terminal Portuário do Pecém',          slug: 'terminal-portuario-do-pecem',         state: 'CE', region: 'nordeste', lat: -3.53,  lon: -38.80,  dataFile: '16_-_terminal_portuário_do_pecém__58_-_60.json' },
  { id: '17', name: 'Porto de Mucuripe - Fortaleza',        slug: 'porto-de-mucuripe-fortaleza',         state: 'CE', region: 'nordeste', lat: -3.72,  lon: -38.48,  dataFile: '17_-_porto_de_mucuripe_-_fortaleza_61_-_63.json' },
  { id: '18', name: 'Arquipélago de Fernando de Noronha',   slug: 'arquipelago-de-fernando-de-noronha',  state: 'PE', region: 'nordeste', lat: -3.85,  lon: -32.43,  dataFile: '18_-_arquipélago_de_fernando_de_noronha_64_-_66.json' },
  { id: '20', name: 'Porto de Macau',                       slug: 'porto-de-macau',                      state: 'RN', region: 'nordeste', lat: -5.12,  lon: -36.63,  dataFile: '20_-_porto_de_macau_-_70_-_72.json' },
  { id: '21', name: 'Porto de Guamaré',                     slug: 'porto-de-guamare',                    state: 'RN', region: 'nordeste', lat: -5.10,  lon: -36.32,  dataFile: '21_-_porto_de_guamaré-_73_-_75.json' },
  { id: '22', name: 'Porto de Natal',                       slug: 'porto-de-natal',                      state: 'RN', region: 'nordeste', lat: -5.77,  lon: -35.22,  dataFile: '22_-_porto_de_natal_-_com3dn_-_76_-78.json' },
  { id: '23', name: 'Porto de Cabedelo',                    slug: 'porto-de-cabedelo',                   state: 'PB', region: 'nordeste', lat: -6.97,  lon: -34.83,  dataFile: '23_-_porto_de_cabedelo_-_79_-_81.json' },
  { id: '24', name: 'Porto do Recife',                      slug: 'porto-do-recife',                     state: 'PE', region: 'nordeste', lat: -8.05,  lon: -34.87,  dataFile: '24_-_porto_do_recife_-_82_-_84.json' },
  { id: '25', name: 'Porto de Suape',                       slug: 'porto-de-suape',                      state: 'PE', region: 'nordeste', lat: -8.40,  lon: -35.00,  dataFile: '25_-_porto_de_suape_-_85_-87.json' },
  { id: '26', name: 'Porto de Maceió',                      slug: 'porto-de-maceio',                     state: 'AL', region: 'nordeste', lat: -9.67,  lon: -35.73,  dataFile: '26_-_porto_de_maceió_-_88_-90.json' },
  { id: '29', name: 'Porto de Madre de Deus',               slug: 'porto-de-madre-de-deus',              state: 'BA', region: 'nordeste', lat: -12.73, lon: -38.62,  dataFile: '29_-_porto_de_madre_de_deus_-_97_-_99.json' },
  { id: '30', name: 'Porto de Aratu - Base Naval',          slug: 'porto-de-aratu',                      state: 'BA', region: 'nordeste', lat: -12.78, lon: -38.50,  dataFile: '30_-_porto_de_aratu_-_base_naval_100_-_102.json' },
  { id: '31', name: 'Porto de Salvador',                    slug: 'porto-de-salvador',                   state: 'BA', region: 'nordeste', lat: -12.97, lon: -38.50,  dataFile: '31_-_porto_de_salvador_-_103_-_105.json' },
  { id: '32', name: 'Porto de Ilhéus - Malhado',            slug: 'porto-de-ilheus',                     state: 'BA', region: 'nordeste', lat: -14.80, lon: -39.03,  dataFile: '32_-_porto_de_ilhéus_-_malhado_-_106_-_108.json' },

  // Região Sudeste
  { id: '33', name: 'Terminal de Barra do Riacho',          slug: 'terminal-de-barra-do-riacho',         state: 'ES', region: 'sudeste',  lat: -19.83, lon: -40.07,  dataFile: '33_-_terminal_de_barra_do_riacho_-_109_-_111.json' },
  { id: '34', name: 'Porto de Tubarão',                     slug: 'porto-de-tubarao',                    state: 'ES', region: 'sudeste',  lat: -20.27, lon: -40.22,  dataFile: '34_-_porto_de_tubarão_-_112_-_114.json' },
  { id: '35', name: 'Porto de Vitória',                     slug: 'porto-de-vitoria',                    state: 'ES', region: 'sudeste',  lat: -20.32, lon: -40.33,  dataFile: '35_-_porto_de_vitória_-_115_-_117.json' },
  { id: '36', name: 'Ilha da Trindade',                     slug: 'ilha-da-trindade',                    state: 'ES', region: 'sudeste',  lat: -20.52, lon: -29.33,  dataFile: '36_-_ilha_da_trindade_-_118_-_120.json' },
  { id: '38', name: 'Porto do Açu',                         slug: 'porto-do-acu',                        state: 'RJ', region: 'sudeste',  lat: -21.83, lon: -41.00,  dataFile: '38_-_porto_do_açu_-_124_-_126.json' },
  { id: '39', name: 'Terminal Marítimo de Imbetiba',        slug: 'terminal-maritimo-de-imbetiba',       state: 'RJ', region: 'sudeste',  lat: -22.38, lon: -41.78,  dataFile: '39_-_terminal_marítimo_de_imbetiba_-_127_-_129.json' },
  { id: '40', name: 'Porto do Rio de Janeiro - Ilha Fiscal',slug: 'porto-do-rio-de-janeiro',             state: 'RJ', region: 'sudeste',  lat: -22.90, lon: -43.17,  dataFile: '40_-_porto_do_rio_de_janeiro_-_i_fiscal_-_130_-_132.json' },
  { id: '41', name: 'Porto de Itaguaí',                     slug: 'porto-de-itaguai',                    state: 'RJ', region: 'sudeste',  lat: -22.87, lon: -43.78,  dataFile: '41_-_porto_de_itaguaí_-_133_-_135.json' },
  { id: '42', name: 'Porto do Forno',                       slug: 'porto-do-forno',                      state: 'RJ', region: 'sudeste',  lat: -22.97, lon: -42.02,  dataFile: '42_-_porto_do_forno_-_136_-_138.json' },
  { id: '43', name: 'Terminal da Ilha Guaíba',              slug: 'terminal-da-ilha-guaiba',             state: 'RJ', region: 'sudeste',  lat: -23.05, lon: -44.03,  dataFile: '43_-_terminal_da_ilha_guaíba_-_139_-_141.json' },
  { id: '44', name: 'Porto de Angra dos Reis',              slug: 'porto-de-angra-dos-reis',             state: 'RJ', region: 'sudeste',  lat: -23.02, lon: -44.32,  dataFile: '44_-_porto_de_angra_dos_reis_-_142_-144.json' },
  { id: '45', name: 'Porto de São Sebastião',               slug: 'porto-de-sao-sebastiao',              state: 'SP', region: 'sudeste',  lat: -23.80, lon: -45.40,  dataFile: '45_-_porto_de_são_sebastião_-_145_-_147.json' },
  { id: '46', name: 'Porto de Santos',                      slug: 'porto-de-santos',                     state: 'SP', region: 'sudeste',  lat: -23.96, lon: -46.31,  dataFile: '46_-_porto_de_santos_-_148_-_150.json' },
  { id: '47', name: 'Terminal Portuário da Ponta do Félix', slug: 'terminal-portuario-da-ponta-do-felix',state: 'SP', region: 'sudeste',  lat: -25.02, lon: -48.52,  dataFile: '47_-_terminal_portuário_da_ponta_do_félix__151_-_153.json' },

  // Região Sul
  { id: '48', name: 'Porto de Paranaguá - Cais Oeste',      slug: 'porto-de-paranagua',                  state: 'PR', region: 'sul',      lat: -25.50, lon: -48.52,  dataFile: '48_-_porto_de_paranaguá_-_cais_oeste_-_154_-_156.json' },
  { id: '49', name: 'Barra de Paranaguá - Canal Sueste',    slug: 'barra-de-paranagua-sueste',           state: 'PR', region: 'sul',      lat: -25.57, lon: -48.35,  dataFile: '49_-_barra_de_paranaguá_-_canal_sueste_157_-_159.json' },
  { id: '50', name: 'Barra de Paranaguá - Canal da Galheta',slug: 'barra-de-paranagua-galheta',          state: 'PR', region: 'sul',      lat: -25.58, lon: -48.33,  dataFile: '50_-_barra_de_paranaguá_-_canal_da_galheta_160_-162.json' },
  { id: '51', name: 'Porto de São Francisco do Sul',        slug: 'porto-de-sao-francisco-do-sul',       state: 'SC', region: 'sul',      lat: -26.25, lon: -48.63,  dataFile: '51_-_porto_de_são_francisco_do_sul_-_163_-165.json' },
  { id: '52', name: 'Porto de Itajaí',                      slug: 'porto-de-itajai',                     state: 'SC', region: 'sul',      lat: -26.90, lon: -48.67,  dataFile: '52_-_porto_de_itajaí_-_166_-_168.json' },
  { id: '53', name: 'Porto de Florianópolis',               slug: 'porto-de-florianopolis',              state: 'SC', region: 'sul',      lat: -27.60, lon: -48.55,  dataFile: '53_-_porto_de_florianópolis_-_169_-_171.json' },
  { id: '54', name: 'Porto de Imbituba',                    slug: 'porto-de-imbituba',                   state: 'SC', region: 'sul',      lat: -28.23, lon: -48.67,  dataFile: '54_-_porto_de_imbituba_-_172_-_174.json' },
  { id: '55', name: 'Porto do Rio Grande',                  slug: 'porto-do-rio-grande',                 state: 'RS', region: 'sul',      lat: -32.03, lon: -52.10,  dataFile: '55_-_porto_do_rio_grande_-_175_-177.json' },
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

export function getNearbySlugs(port: Port, limit: number = 4): Port[] {
  const sameState = PORTS.filter(p => p.state === port.state && p.id !== port.id);
  if (sameState.length >= limit) return sameState.slice(0, limit);
  const sameRegion = PORTS.filter(p => p.region === port.region && p.id !== port.id);
  const combined = [...sameState, ...sameRegion.filter(p => p.state !== port.state)];
  return combined.slice(0, limit);
}

export function getAllRegions(): { id: Port['region']; name: string }[] {
  return [
    { id: 'norte', name: 'Região Norte' },
    { id: 'nordeste', name: 'Região Nordeste' },
    { id: 'sudeste', name: 'Região Sudeste' },
    { id: 'sul', name: 'Região Sul' },
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
