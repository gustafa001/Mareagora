export type Port = {
  slug: string;        // usado na URL: /mare/{slug}
  name: string;        // nome display
  state: string;       // UF (ex: "BA")
  lat: number;
  lon: number;
  dataFile: string;    // nome do arquivo JSON em /data/
  region: string;      // "Norte" | "Nordeste" | "Sudeste" | "Sul"
};

export const PORTS: Port[] = [
  // ── NORTE ──
  { slug: "barra-norte-arco-lamoso",      name: "Barra Norte / Arco Lamoso",   state: "PA", lat: 0.800,  lon: -50.00, dataFile: "1_-barra_norte_-_arco_lamoso_-_2026_-_13_-_15.json",               region: "Norte" },
  { slug: "igarape-grande-do-curua",      name: "Igarapé Grande do Curuá",     state: "PA", lat: 0.700,  lon: -50.10, dataFile: "2_-igarapé_grande_do_curuá_-_2026_-_16_-_18.json",               region: "Norte" },
  { slug: "porto-de-santana",             name: "Porto de Santana",             state: "AP", lat: 0.057,  lon: -51.17, dataFile: "3_-_porto_de_santana_-_19_-_21.json",                             region: "Norte" },
  { slug: "ilha-dos-guaras",              name: "Ilha dos Guarás",              state: "PA", lat: -0.900, lon: -48.50, dataFile: "4_-_ilha_dos_guarás_(estado_do_pará)_-_2026__22_-_24.json",        region: "Norte" },
  { slug: "fundeadouro-de-salinopolis",   name: "Fundeadouro de Salinópolis",  state: "PA", lat: -0.614, lon: -47.35, dataFile: "5_-fundeadouro_de_salinópolis____25_-_27.json",                   region: "Norte" },
  { slug: "ilha-do-mosqueiro",            name: "Ilha do Mosqueiro",            state: "PA", lat: -1.150, lon: -48.46, dataFile: "6_-_ilha_do_mosqueiro_28_-_30.json",                              region: "Norte" },
  { slug: "porto-de-belem",              name: "Porto de Belém",               state: "PA", lat: -1.452, lon: -48.50, dataFile: "7_-_porto_de_belém_(estado_do_pará)_-_2026_-_31_-_33.json",       region: "Norte" },
  { slug: "porto-de-vila-do-conde",       name: "Porto de Vila do Conde",       state: "PA", lat: -1.550, lon: -48.86, dataFile: "8_-_porto_de_vila_do_conde__34_-_36.json",                        region: "Norte" },
  { slug: "atracadouro-de-breves",        name: "Atracadouro de Breves",        state: "PA", lat: -1.680, lon: -50.48, dataFile: "9_-_atracadouro_de_breves_37_-_39.json",                          region: "Norte" },

  // ── NORDESTE ──
  { slug: "sao-luis",                     name: "São Luís",                     state: "MA", lat: -2.530, lon: -44.30, dataFile: "10_-_são_luís_40_-_42.json",                                      region: "Nordeste" },
  { slug: "terminal-ponta-da-madeira",    name: "Terminal da Ponta da Madeira", state: "MA", lat: -2.590, lon: -44.37, dataFile: "11_-_terminal_da_ponta_da_madeira_43_-_45.json",                  region: "Nordeste" },
  { slug: "porto-de-itaqui",              name: "Porto de Itaqui",              state: "MA", lat: -2.600, lon: -44.37, dataFile: "12_-_porto_de_itaqui_-_46_-_48.json",                             region: "Nordeste" },
  { slug: "terminal-da-alumar",           name: "Terminal da Alumar",           state: "MA", lat: -2.570, lon: -44.38, dataFile: "13_-_terminal_da_alumar_-_49_-_51.json",                          region: "Nordeste" },
  { slug: "porto-de-tutoia",              name: "Porto de Tutóia",              state: "MA", lat: -2.760, lon: -42.27, dataFile: "14_-_porto_de_tutóia_-_52_-_54.json",                             region: "Nordeste" },
  { slug: "porto-de-luis-correia",        name: "Porto de Luís Correia",        state: "PI", lat: -2.877, lon: -41.66, dataFile: "15_-_porto_de_luís_correia_55_-_57.json",                         region: "Nordeste" },
  { slug: "terminal-portuario-do-pecem",  name: "Terminal Portuário do Pecém",  state: "CE", lat: -3.540, lon: -38.80, dataFile: "16_-_terminal_portuário_do_pecém__58_-_60.json",                  region: "Nordeste" },
  { slug: "porto-de-mucuripe-fortaleza",  name: "Porto de Mucuripe (Fortaleza)",state: "CE", lat: -3.720, lon: -38.47, dataFile: "17_-_porto_de_mucuripe_-_fortaleza_61_-_63.json",                 region: "Nordeste" },
  { slug: "arquipelago-de-fernando-de-noronha", name: "Arquipélago de Fernando de Noronha", state: "PE", lat: -3.854, lon: -32.42, dataFile: "18_-_arquipélago_de_fernando_de_noronha_64_-_66.json", region: "Nordeste" },
  { slug: "porto-de-macau",               name: "Porto de Macau",               state: "RN", lat: -5.107, lon: -36.63, dataFile: "20_-_porto_de_macau_-_70_-_72.json",                             region: "Nordeste" },
  { slug: "porto-de-natal",               name: "Porto de Natal",               state: "RN", lat: -5.780, lon: -35.21, dataFile: "22_-_porto_de_natal_-_com3dn_-_76_-78.json",                     region: "Nordeste" },
  { slug: "porto-de-cabedelo",            name: "Porto de Cabedelo",            state: "PB", lat: -6.975, lon: -34.83, dataFile: "23_-_porto_de_cabedelo_-_79_-_81.json",                           region: "Nordeste" },
  { slug: "porto-do-recife",              name: "Porto do Recife",              state: "PE", lat: -8.057, lon: -34.87, dataFile: "24_-_porto_do_recife_-_82_-_84.json",                             region: "Nordeste" },
  { slug: "porto-de-suape",               name: "Porto de Suape",               state: "PE", lat: -8.393, lon: -35.00, dataFile: "25_-_porto_de_suape_-_85_-87.json",                              region: "Nordeste" },
  { slug: "porto-de-maceio",              name: "Porto de Maceió",              state: "AL", lat: -9.665, lon: -35.73, dataFile: "26_-_porto_de_maceió_-_88_-90.json",                             region: "Nordeste" },
  { slug: "porto-de-madre-de-deus",       name: "Porto de Madre de Deus",       state: "BA", lat: -12.74, lon: -38.62, dataFile: "29_-_porto_de_madre_de_deus_-_97_-_99.json",                     region: "Nordeste" },
  { slug: "porto-de-aratu",               name: "Porto de Aratu / Base Naval",  state: "BA", lat: -12.78, lon: -38.48, dataFile: "30_-_porto_de_aratu_-_base_naval_100_-_102.json",                 region: "Nordeste" },
  { slug: "porto-de-salvador",            name: "Porto de Salvador",            state: "BA", lat: -12.967,lon: -38.52, dataFile: "31_-_porto_de_salvador_-_103_-_105.json",                         region: "Nordeste" },
  { slug: "porto-de-ilheus",              name: "Porto de Ilhéus (Malhado)",    state: "BA", lat: -14.80, lon: -39.03, dataFile: "32_-_porto_de_ilhéus_-_malhado_-_106_-_108.json",                 region: "Nordeste" },

  // ── SUDESTE ──
  { slug: "terminal-de-barra-do-riacho",  name: "Terminal de Barra do Riacho", state: "ES", lat: -19.83, lon: -40.06, dataFile: "33_-_terminal_de_barra_do_riacho_-_109_-_111.json",               region: "Sudeste" },
  { slug: "porto-de-tubarao",             name: "Porto de Tubarão",            state: "ES", lat: -20.29, lon: -40.22, dataFile: "34_-_porto_de_tubarão_-_112_-_114.json",                          region: "Sudeste" },
  { slug: "porto-de-vitoria",             name: "Porto de Vitória",            state: "ES", lat: -20.32, lon: -40.34, dataFile: "35_-_porto_de_vitória_-_115_-_117.json",                          region: "Sudeste" },
  { slug: "ilha-da-trindade",             name: "Ilha da Trindade",            state: "ES", lat: -20.51, lon: -29.32, dataFile: "36_-_ilha_da_trindade_-_118_-_120.json",                          region: "Sudeste" },
  { slug: "porto-do-acu",                 name: "Porto do Açu",                state: "RJ", lat: -21.84, lon: -41.00, dataFile: "38_-_porto_do_açu_-_rj_-_122-124.json",                          region: "Sudeste" },
  { slug: "terminal-maritimo-de-imbetiba",name: "Terminal Marítimo de Imbetiba",state: "RJ", lat: -22.38, lon: -41.79, dataFile: "39_-_terminal_marítimo_de_imbetiba_-_rj_-_125-127.json",         region: "Sudeste" },
  { slug: "porto-do-rio-de-janeiro",      name: "Porto do Rio de Janeiro",     state: "RJ", lat: -22.89, lon: -43.17, dataFile: "40_-_porto_do_rio_de_janeiro_-_i_fiscal_-_130_-_132.json",       region: "Sudeste" },
  { slug: "porto-de-itaguai",             name: "Porto de Itaguaí",            state: "RJ", lat: -22.95, lon: -43.82, dataFile: "41_-_porto_de_itaguaí_-_133_-_135.json",                         region: "Sudeste" },
  { slug: "porto-do-forno",               name: "Porto do Forno",              state: "RJ", lat: -22.97, lon: -42.03, dataFile: "42_-_porto_do_forno_-_136_-_138.json",                            region: "Sudeste" },
  { slug: "terminal-ilha-guaiba",         name: "Terminal da Ilha Guaíba",     state: "RJ", lat: -22.99, lon: -43.89, dataFile: "43_-_terminal_da_ilha_guaíba_-_139_-_141.json",                   region: "Sudeste" },
  { slug: "porto-de-angra-dos-reis",      name: "Porto de Angra dos Reis",     state: "RJ", lat: -23.01, lon: -44.31, dataFile: "44_-_porto_de_angra_dos_reis_-_142_-144.json",                   region: "Sudeste" },
  { slug: "porto-de-sao-sebastiao",       name: "Porto de São Sebastião",      state: "SP", lat: -23.81, lon: -45.40, dataFile: "45_-_porto_de_são_sebastião_-_145_-_147.json",                   region: "Sudeste" },
  { slug: "porto-de-santos",              name: "Porto de Santos",             state: "SP", lat: -23.94, lon: -46.30, dataFile: "46_-_porto_de_santos_-_148_-_150.json",                          region: "Sudeste" },
  { slug: "terminal-ponta-do-felix",      name: "Terminal Portuário Ponta do Félix", state: "SP", lat: -23.85, lon: -45.42, dataFile: "47_-_terminal_portuário_da_ponta_do_félix__151_-_153.json", region: "Sudeste" },

  // ── SUL ──
  { slug: "porto-de-paranagua",           name: "Porto de Paranaguá (Cais Oeste)", state: "PR", lat: -25.50, lon: -48.53, dataFile: "48_-_porto_de_paranaguá_-_cais_oeste_-_154_-_156.json",      region: "Sul" },
  { slug: "barra-de-paranagua-canal-sueste", name: "Barra de Paranaguá — Canal Sueste", state: "PR", lat: -25.56, lon: -48.34, dataFile: "49_-_barra_de_paranaguá_-_canal_sueste_157_-_159.json", region: "Sul" },
  { slug: "barra-de-paranagua-canal-galheta", name: "Barra de Paranaguá — Canal da Galheta", state: "PR", lat: -25.58, lon: -48.32, dataFile: "50_-_barra_de_paranaguá_-_canal_da_galheta_160_-162.json", region: "Sul" },
  { slug: "porto-de-sao-francisco-do-sul",name: "Porto de São Francisco do Sul",state: "SC", lat: -26.24, lon: -48.64, dataFile: "51_-_porto_de_são_francisco_do_sul_-_163_-165.json",           region: "Sul" },
  { slug: "porto-de-itajai",              name: "Porto de Itajaí",             state: "SC", lat: -26.91, lon: -48.67, dataFile: "52_-_porto_de_itajaí_-_166_-_168.json",                         region: "Sul" },
  { slug: "porto-do-rio-grande",          name: "Porto do Rio Grande",         state: "RS", lat: -32.03, lon: -52.10, dataFile: "55_-_porto_do_rio_grande_-_175_-177.json",                       region: "Sul" },
];

export function getPortBySlug(slug: string): Port | undefined {
  return PORTS.find(p => p.slug === slug);
}

export function getNearbySlugs(port: Port, count = 6): Port[] {
  return PORTS
    .filter(p => p.slug !== port.slug)
    .sort((a, b) => {
      const da = Math.hypot(a.lat - port.lat, a.lon - port.lon);
      const db = Math.hypot(b.lat - port.lat, b.lon - port.lon);
      return da - db;
    })
    .slice(0, count);
}
