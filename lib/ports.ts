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
}

export const PORTS: Port[] = [
  // Região Norte
  { id: '1', name: 'Barra Norte - Arco Lamoso', slug: 'barra-norte-arco-lamoso', state: 'PA', region: 'norte', dataFile: '1_-barra_norte_-_arco_lamoso_-_2026_-_13_-_15.json' },
  { id: '2', name: 'Igarapé Grande do Curuá', slug: 'igarape-grande-do-curua', state: 'PA', region: 'norte', dataFile: '2_-igarapé_grande_do_curuá_-_2026_-_16_-_18.json' },
  { id: '3', name: 'Porto de Santana', slug: 'porto-de-santana', state: 'AP', region: 'norte', dataFile: '3_-_porto_de_santana_-_19_-_21.json' },
  { id: '4', name: 'Ilha dos Guarás', slug: 'ilha-dos-guaras', state: 'PA', region: 'norte', dataFile: '4_-_ilha_dos_guarás_(estado_do_pará)_-_2026__22_-_24.json' },
  { id: '5', name: 'Fundeadouro de Salinópolis', slug: 'fundeadouro-de-salinopolis', state: 'PA', region: 'norte', dataFile: '5_-fundeadouro_de_salinópolis____25_-_27.json' },
  { id: '6', name: 'Ilha do Mosqueiro', slug: 'ilha-do-mosqueiro', state: 'PA', region: 'norte', dataFile: '6_-_ilha_do_mosqueiro_28_-_30.json' },
  { id: '7', name: 'Porto de Belém', slug: 'porto-de-belem', state: 'PA', region: 'norte', dataFile: '7_-_porto_de_belém_(estado_do_pará)_-_2026_-_31_-_33.json' },
  { id: '8', name: 'Porto de Vila do Conde', slug: 'porto-de-vila-do-conde', state: 'PA', region: 'norte', dataFile: '8_-_porto_de_vila_do_conde__34_-_36.json' },
  { id: '9', name: 'Atracadouro de Breves', slug: 'atracadouro-de-breves', state: 'PA', region: 'norte', dataFile: '9_-_atracadouro_de_breves_37_-_39.json' },
  { id: '10', name: 'São Luís', slug: 'sao-luis', state: 'MA', region: 'nordeste', dataFile: '10_-_são_luís_40_-_42.json' },
  { id: '11', name: 'Terminal da Ponta da Madeira', slug: 'terminal-da-ponta-da-madeira', state: 'MA', region: 'nordeste', dataFile: '11_-_terminal_da_ponta_da_madeira_43_-_45.json' },
  { id: '12', name: 'Porto de Itaqui', slug: 'porto-de-itaqui', state: 'MA', region: 'nordeste', dataFile: '12_-_porto_de_itaqui_-_46_-_48.json' },
  { id: '13', name: 'Terminal da Alumar', slug: 'terminal-da-alumar', state: 'MA', region: 'nordeste', dataFile: '13_-_terminal_da_alumar_-_49_-_51.json' },
  { id: '14', name: 'Porto de Tutóia', slug: 'porto-de-tutoia', state: 'MA', region: 'nordeste', dataFile: '14_-_porto_de_tutóia_-_52_-_54.json' },
  { id: '15', name: 'Porto de Luís Correia', slug: 'porto-de-luis-correia', state: 'PI', region: 'nordeste', dataFile: '15_-_porto_de_luís_correia_55_-_57.json' },
  { id: '16', name: 'Terminal Portuário do Pecém', slug: 'terminal-portuario-do-pecem', state: 'CE', region: 'nordeste', dataFile: '16_-_terminal_portuário_do_pecém__58_-_60.json' },
  { id: '17', name: 'Porto de Mucuripe - Fortaleza', slug: 'porto-de-mucuripe-fortaleza', state: 'CE', region: 'nordeste', dataFile: '17_-_porto_de_mucuripe_-_fortaleza_61_-_63.json' },
  { id: '18', name: 'Arquipélago de Fernando de Noronha', slug: 'arquipelago-de-fernando-de-noronha', state: 'PE', region: 'nordeste', dataFile: '18_-_arquipélago_de_fernando_de_noronha_64_-_66.json' },
  { id: '20', name: 'Porto de Macau', slug: 'porto-de-macau', state: 'RN', region: 'nordeste', dataFile: '20_-_porto_de_macau_-_70_-_72.json' },
  { id: '22', name: 'Porto de Natal', slug: 'porto-de-natal', state: 'RN', region: 'nordeste', dataFile: '22_-_porto_de_natal_-_com3dn_-_76_-78.json' },
  { id: '23', name: 'Porto de Cabedelo', slug: 'porto-de-cabedelo', state: 'PB', region: 'nordeste', dataFile: '23_-_porto_de_cabedelo_-_79_-_81.json' },
  { id: '24', name: 'Porto do Recife', slug: 'porto-do-recife', state: 'PE', region: 'nordeste', dataFile: '24_-_porto_do_recife_-_82_-_84.json' },
  { id: '25', name: 'Porto de Suape', slug: 'porto-de-suape', state: 'PE', region: 'nordeste', dataFile: '25_-_porto_de_suape_-_85_-87.json' },
  { id: '26', name: 'Porto de Maceió', slug: 'porto-de-maceio', state: 'AL', region: 'nordeste', dataFile: '26_-_porto_de_maceió_-_88_-90.json' },
  { id: '29', name: 'Porto de Madre de Deus', slug: 'porto-de-madre-de-deus', state: 'BA', region: 'nordeste', dataFile: '29_-_porto_de_madre_de_deus_-_97_-_99.json' },
  { id: '30', name: 'Porto de Aratu - Base Naval', slug: 'porto-de-aratu', state: 'BA', region: 'nordeste', dataFile: '30_-_porto_de_aratu_-_base_naval_100_-_102.json' },
  { id: '31', name: 'Porto de Salvador', slug: 'porto-de-salvador', state: 'BA', region: 'nordeste', dataFile: '31_-_porto_de_salvador_-_103_-_105.json' },
  { id: '32', name: 'Porto de Ilhéus - Malhado', slug: 'porto-de-ilheus', state: 'BA', region: 'nordeste', dataFile: '32_-_porto_de_ilhéus_-_malhado_-_106_-_108.json' },
  { id: '33', name: 'Terminal de Barra do Riacho', slug: 'terminal-de-barra-do-riacho', state: 'ES', region: 'sudeste', dataFile: '33_-_terminal_de_barra_do_riacho_-_109_-_111.json' },
  { id: '34', name: 'Porto de Tubarão', slug: 'porto-de-tubarao', state: 'ES', region: 'sudeste', dataFile: '34_-_porto_de_tubarão_-_112_-_114.json' },
  { id: '35', name: 'Porto de Vitória', slug: 'porto-de-vitoria', state: 'ES', region: 'sudeste', dataFile: '35_-_porto_de_vitória_-_115_-_117.json' },
  { id: '36', name: 'Ilha da Trindade', slug: 'ilha-da-trindade', state: 'ES', region: 'sudeste', dataFile: '36_-_ilha_da_trindade_-_118_-_120.json' },
  { id: '38', name: 'Porto do Açu', slug: 'porto-do-acu', state: 'RJ', region: 'sudeste', dataFile: '38_-_porto_do_açu_-_rj_-_122-124.json' },
  { id: '39', name: 'Terminal Marítimo de Imbetiba', slug: 'terminal-maritimo-de-imbetiba', state: 'RJ', region: 'sudeste', dataFile: '39_-_terminal_marítimo_de_imbetiba_-_rj_-_125-127.json' },
  { id: '40', name: 'Porto do Rio de Janeiro - Ilha Fiscal', slug: 'porto-do-rio-de-janeiro', state: 'RJ', region: 'sudeste', dataFile: '40_-_porto_do_rio_de_janeiro_-_i_fiscal_-_130_-_132.json' },
  { id: '41', name: 'Porto de Itaguaí', slug: 'porto-de-itaguai', state: 'RJ', region: 'sudeste', dataFile: '41_-_porto_de_itaguaí_-_133_-_135.json' },
  { id: '42', name: 'Porto do Forno', slug: 'porto-do-forno', state: 'RJ', region: 'sudeste', dataFile: '42_-_porto_do_forno_-_136_-_138.json' },
  { id: '43', name: 'Terminal da Ilha Guaíba', slug: 'terminal-da-ilha-guaiba', state: 'RJ', region: 'sudeste', dataFile: '43_-_terminal_da_ilha_guaíba_-_139_-_141.json' },
  { id: '44', name: 'Porto de Angra dos Reis', slug: 'porto-de-angra-dos-reis', state: 'RJ', region: 'sudeste', dataFile: '44_-_porto_de_angra_dos_reis_-_142_-144.json' },
  { id: '45', name: 'Porto de São Sebastião', slug: 'porto-de-sao-sebastiao', state: 'SP', region: 'sudeste', dataFile: '45_-_porto_de_são_sebastião_-_145_-_147.json' },
  { id: '46', name: 'Porto de Santos', slug: 'porto-de-santos', state: 'SP', region: 'sudeste', dataFile: '46_-_porto_de_santos_-_148_-_150.json' },
  { id: '47', name: 'Terminal Portuário da Ponta do Félix', slug: 'terminal-portuario-da-ponta-do-felix', state: 'SP', region: 'sudeste', dataFile: '47_-_terminal_portuário_da_ponta_do_félix__151_-_153.json' },
  { id: '48', name: 'Porto de Paranaguá - Cais Oeste', slug: 'porto-de-paranagua', state: 'PR', region: 'sul', dataFile: '48_-_porto_de_paranaguá_-_cais_oeste_-_154_-_156.json' },
  { id: '49', name: 'Barra de Paranaguá - Canal Sueste', slug: 'barra-de-paranagua-sueste', state: 'PR', region: 'sul', dataFile: '49_-_barra_de_paranaguá_-_canal_sueste_157_-_159.json' },
  { id: '50', name: 'Barra de Paranaguá - Canal da Galheta', slug: 'barra-de-paranagua-galheta', state: 'PR', region: 'sul', dataFile: '50_-_barra_de_paranaguá_-_canal_da_galheta_160_-162.json' },
  { id: '51', name: 'Porto de São Francisco do Sul', slug: 'porto-de-sao-francisco-do-sul', state: 'SC', region: 'sul', dataFile: '51_-_porto_de_são_francisco_do_sul_-_163_-165.json' },
  { id: '52', name: 'Porto de Itajaí', slug: 'porto-de-itajai', state: 'SC', region: 'sul', dataFile: '52_-_porto_de_itajaí_-_166_-_168.json' },
  { id: '55', name: 'Porto do Rio Grande', slug: 'porto-do-rio-grande', state: 'RS', region: 'sul', dataFile: '55_-_porto_do_rio_grande_-_175_-177.json' },
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
  // Retorna portos do mesmo estado ou região, excluindo o atual
  const sameState = PORTS.filter(p => p.state === port.state && p.id !== port.id);
  if (sameState.length >= limit) {
    return sameState.slice(0, limit);
  }
  
  // Se não tiver suficientes no mesmo estado, pegar da mesma região
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
