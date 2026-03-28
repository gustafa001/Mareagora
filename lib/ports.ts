export type Port = {
  slug: string;        // usado na URL: /mare/{slug}
  name: string;        // nome display
  state: string;       // UF (ex: "BA")
  lat: number;
  lon: number;
  dataFile: string;    // nome do arquivo JSON
  region: string;      // "Norte" | "Nordeste" | "Sudeste" | "Sul"
  searchNames?: string[]; // Nomes de cidades e praias proximas (ex: ["Guarujá", "Bertioga"])
};

export const PORTS: Port[] = [
  // ── NORTE (PA, AP) ──
  { 
    slug: "barra-norte-arco-lamoso", 
    name: "Barra Norte / Arco Lamoso", 
    state: "PA", lat: 1.43336, lon: -49.21675, 
    dataFile: "1_-barra_norte_-_arco_lamoso_-_2026_-_13_-_15.json", region: "Norte",
    searchNames: ["Macapá", "Afuá", "Chaves"]
  },
  { 
    slug: "igarape-grande-do-curua", 
    name: "Igarapé Grande do Curuá", 
    state: "PA", lat: 0.75022, lon: -50.11669, 
    dataFile: "2_-igarapé_grande_do_curuá_-_2026_-_16_-_18.json", region: "Norte",
    searchNames: ["Curuá", "Óbidos", "Alenquer"]
  },
  { 
    slug: "porto-de-santana", 
    name: "Porto de Santana", 
    state: "AP", lat: -0.05019, lon: -51.16669, 
    dataFile: "3_-_porto_de_santana_-_19_-_21.json", region: "Norte",
    searchNames: ["Santana", "Macapá"]
  },
  { 
    slug: "ilha-dos-guaras", 
    name: "Ilha dos Guarás", 
    state: "PA", lat: -0.58358, lon: -47.90025, 
    dataFile: "4_-_ilha_dos_guarás_(estado_do_pará)_-_2026__22_-_24.json", region: "Norte",
    searchNames: ["Salvaterra", "Soure", "Ilha de Marajó"]
  },
  { 
    slug: "fundeadouro-de-salinopolis", 
    name: "Fundeadouro de Salinópolis", 
    state: "PA", lat: -0.61667, lon: -47.35, 
    dataFile: "5_-fundeadouro_de_salinópolis____25_-_27.json", region: "Norte",
    searchNames: ["Salinas", "Salinópolis", "Atalaia", "Cuiarana"]
  },
  { 
    slug: "ilha-do-mosqueiro", 
    name: "Ilha do Mosqueiro", 
    state: "PA", lat: -1.15025, lon: -48.46678, 
    dataFile: "6_-_ilha_do_mosqueiro_28_-_30.json", region: "Norte",
    searchNames: ["Mosqueiro", "Santa Bárbara", "Baía do Sol"]
  },
  { 
    slug: "porto-de-belem", 
    name: "Porto de Belém", 
    state: "PA", lat: -1.38356, lon: -48.4835, 
    dataFile: "7_-_porto_de_belém_(estado_do_pará)_-_2026_-_31_-_33.json", region: "Norte",
    searchNames: ["Belém", "Ananindeua", "Icoaraci"]
  },
  { 
    slug: "porto-de-vila-do-conde", 
    name: "Porto de Vila do Conde", 
    state: "PA", lat: -1.53342, lon: -48.75006, 
    dataFile: "8_-_porto_de_vila_do_conde__34_-_36.json", region: "Norte",
    searchNames: ["Barcarena", "Vila do Conde", "Abaetetuba"]
  },
  { 
    slug: "atracadouro-de-breves", 
    name: "Atracadouro de Breves", 
    state: "PA", lat: -1.68347, lon: -50.48333, 
    dataFile: "9_-_atracadouro_de_breves_37_-_39.json", region: "Norte",
    searchNames: ["Breves", "Bagre", "Melgaço"]
  },

  // ── NORDESTE ──
  { 
    slug: "sao-luis", 
    name: "São Luís", 
    state: "MA", lat: -2.51683, lon: -44.30019, 
    dataFile: "10_-_são_luís_40_-_42.json", region: "Nordeste",
    searchNames: ["São Luís", "São José de Ribamar", "Paço do Lumiar", "Raposa"]
  },
  { 
    slug: "terminal-ponta-da-madeira", 
    name: "Terminal da Ponta da Madeira", 
    state: "MA", lat: -2.55025, lon: -44.36686, 
    dataFile: "11_-_terminal_da_ponta_da_madeira_43_-_45.json", region: "Nordeste",
    searchNames: ["Itaqui", "Bacanga", "Porto Ferrado"]
  },
  { 
    slug: "porto-de-itaqui", 
    name: "Porto de Itaqui", 
    state: "MA", lat: -2.56681, lon: -44.36672, 
    dataFile: "12_-_porto_de_itaqui_-_46_-_48.json", region: "Nordeste",
    searchNames: ["Itaqui", "São Luís (Sul)"]
  },
  { 
    slug: "terminal-da-alumar", 
    name: "Terminal da Alumar", 
    state: "MA", lat: -2.66686, lon: -44.35014, 
    dataFile: "13_-_terminal_da_alumar_-_49_-_51.json", region: "Nordeste",
    searchNames: ["Pedrinhas", "Estreito dos Coqueiros"]
  },
  { 
    slug: "porto-de-tutoia", 
    name: "Porto de Tutóia", 
    state: "MA", lat: -2.75025, lon: -42.26681, 
    dataFile: "14_-_porto_de_tutóia_-_52_-_54.json", region: "Nordeste",
    searchNames: ["Tutóia", "Paulino Neves", "Lençóis Maranhenses (Leste)"]
  },
  { 
    slug: "porto-de-luis-correia", 
    name: "Porto de Luís Correia", 
    state: "PI", lat: -2.85003, lon: -41.63353, 
    dataFile: "15_-_porto_de_luís_correia_55_-_57.json", region: "Nordeste",
    searchNames: ["Luís Correia", "Parnaíba", "Cajueiro da Praia", "Barra Grande", "Coqueiro"]
  },
  { 
    slug: "terminal-portuario-do-pecem", 
    name: "Terminal Portuário do Pecém", 
    state: "CE", lat: -3.53336, lon: -38.78358, 
    dataFile: "16_-_terminal_portuário_do_pecém__58_-_60.json", region: "Nordeste",
    searchNames: ["Cumbuco", "Taíba", "Caucaia", "São Gonçalo do Amarante", "Paracuru"]
  },
  { 
    slug: "porto-de-mucuripe-fortaleza", 
    name: "Porto de Mucuripe (Fortaleza)", 
    state: "CE", lat: -3.70025, lon: -38.46683, 
    dataFile: "17_-_porto_de_mucuripe_-_fortaleza_61_-_63.json", region: "Nordeste",
    searchNames: ["Fortaleza", "Aquiraz", "Porto das Dunas", "Iracema", "Meireles", "Beira Mar"]
  },
  { 
    slug: "fernando-de-noronha", 
    name: "Fernando de Noronha", 
    state: "PE", lat: -3.83333, lon: -32.40006, 
    dataFile: "18_-_arquipélago_de_fernando_de_noronha_64_-_66.json", region: "Nordeste",
    searchNames: ["Noronha", "Vila dos Remédios", "Praia do Sancho", "Baía dos Porcos"]
  },
  { 
    slug: "porto-de-macau", 
    name: "Porto de Macau", 
    state: "RN", lat: -5.1, lon: -36.66678, 
    dataFile: "20_-_porto_de_macau_-_70_-_72.json", region: "Nordeste",
    searchNames: ["Macau", "Guamaré", "Galinhos"]
  },
  { 
    slug: "porto-de-natal", 
    name: "Porto de Natal", 
    state: "RN", lat: -5.76667, lon: -35.20003, 
    dataFile: "22_-_porto_de_natal_-_com3dn_-_76_-78.json", region: "Nordeste",
    searchNames: ["Natal", "Ponta Negra", "Genipabu", "Parnamirim", "Pirangi", "Extremoz"]
  },
  { 
    slug: "porto-de-cabedelo", 
    name: "Porto de Cabedelo", 
    state: "PB", lat: -6.96672, lon: -34.83344, 
    dataFile: "23_-_porto_de_cabedelo_-_79_-_81.json", region: "Nordeste",
    searchNames: ["João Pessoa", "Cabedelo", "Intermares", "Bessa", "Manaíra", "Tambaú", "Lucena"]
  },
  { 
    slug: "porto-do-recife", 
    name: "Porto do Recife", 
    state: "PE", lat: -8.05011, lon: -34.86667, 
    dataFile: "24_-_porto_do_recife_-_82_-_84.json", region: "Nordeste",
    searchNames: ["Recife", "Boa Viagem", "Olinda", "Jaboatão", "Piedade", "Maria Farinha"]
  },
  { 
    slug: "porto-de-suape", 
    name: "Porto de Suape / P. Galinhas", 
    state: "PE", lat: -8.3835, lon: -34.95017, 
    dataFile: "25_-_porto_de_suape_-_85_-87.json", region: "Nordeste",
    searchNames: ["Porto de Galinhas", "Ipojuca", "Cabo de Santo Agostinho", "Gaibu", "Calhetas", "Serrambi", "Maracaípe"]
  },
  { 
    slug: "maceio", 
    name: "Maceió", 
    state: "AL", lat: -9.68333, lon: -35.71681, 
    dataFile: "26_-_porto_de_maceió_-_88_-90.json", region: "Nordeste",
    searchNames: ["Maceió", "Pajuçara", "Ponta Verde", "Jatiúca", "Francês", "Marechal Deodoro", "Barra de São Miguel", "Paripueira"]
  },
  { 
    slug: "madre-de-deus", 
    name: "Madre de Deus", 
    state: "BA", lat: -12.75, lon: -38.61678, 
    dataFile: "29_-_porto_de_madre_de_deus_-_97_-_99.json", region: "Nordeste",
    searchNames: ["Candeias", "Ilha dos Frades", "Bom Jesus dos Passos"]
  },
  { 
    slug: "aratu-base-naval", 
    name: "Aratu (Base Naval)", 
    state: "BA", lat: -12.78353, lon: -38.48353, 
    dataFile: "30_-_porto_de_aratu_-_base_naval_100_-_102.json", region: "Nordeste",
    searchNames: ["Candeias", "Simões Filho", "Ilha de Maré"]
  },
  { 
    slug: "salvador", 
    name: "Salvador (Porto)", 
    state: "BA", lat: -12.96678, lon: -38.51667, 
    dataFile: "31_-_porto_de_salvador_-_103_-_105.json", region: "Nordeste",
    searchNames: ["Salvador", "Lauro de Freitas", "Itaparica", "Vera Cruz", "Stella Maris", "Itapuã"]
  },
  { 
    slug: "ilheus-malhado", 
    name: "Ilhéus (Malhado)", 
    state: "BA", lat: -14.76689, lon: -39.01683, 
    dataFile: "32_-_porto_de_ilhéus_-_malhado_-_106_-_108.json", region: "Nordeste",
    searchNames: ["Ilhéus", "Itacaré", "Olivença", "Una"]
  },

  // ── SUDESTE ──
  { 
    slug: "barra-do-riacho", 
    name: "Barra do Riacho", 
    state: "ES", lat: -19.83342, lon: -40.05017, 
    dataFile: "33_-_terminal_de_barra_do_riacho_-_109_-_111.json", region: "Sudeste",
    searchNames: ["Aracruz", "Regência", "Linhares"]
  },
  { 
    slug: "porto-de-tubarao", 
    name: "Porto de Tubarão", 
    state: "ES", lat: -20.28342, lon: -40.2335, 
    dataFile: "34_-_porto_de_tubarão_-_112_-_114.json", region: "Sudeste",
    searchNames: ["Vitória (Camburi)", "Serra", "Manguinhos", "Jacaraípe"]
  },
  { 
    slug: "porto-de-vitoria", 
    name: "Porto de Vitória", 
    state: "ES", lat: -20.31675, lon: -40.33339, 
    dataFile: "35_-_porto_de_vitória_-_115_-_117.json", region: "Sudeste",
    searchNames: ["Vitória", "Vila Velha", "Guarapari", "Itaparica", "Itapoã", "Praia da Costa"]
  },
  { 
    slug: "ilha-da-trindade", 
    name: "Ilha da Trindade", 
    state: "ES", lat: -20.50014, lon: -29.30017, 
    dataFile: "36_-_ilha_da_trindade_-_118_-_120.json", region: "Sudeste",
    searchNames: ["Trindade"]
  },
  { 
    slug: "porto-do-acu", 
    name: "Porto do Açu", 
    state: "RJ", lat: -21.80014, lon: -40.96692, 
    dataFile: "38_-_porto_do_açu_-_rj_-_122-124.json", region: "Sudeste",
    searchNames: ["São João da Barra", "São Francisco de Itabapoana", "Atafona", "Grussaí"]
  },
  { 
    slug: "terminal-imbetiba", 
    name: "Terminal de Imbetiba / Macaé", 
    state: "RJ", lat: -22.41678, lon: -41.43336, 
    dataFile: "39_-_terminal_marítimo_de_imbetiba_-_rj_-_125-127.json", region: "Sudeste",
    searchNames: ["Macaé", "Rio das Ostras", "Cavaleiros", "Barra de São João"]
  },
  { 
    slug: "itaguai", 
    name: "Porto de Itaguaí", 
    state: "RJ", lat: -22.91692, lon: -43.83347, 
    dataFile: "41_-_porto_de_itaguaí_-_133_-_135.json", region: "Sudeste",
    searchNames: ["Itaguaí", "Sepetiba", "Coroa Grande"]
  },
  { 
    slug: "porto-do-forno", 
    name: "Porto do Forno (Arraial)", 
    state: "RJ", lat: -22.96678, lon: -42.00022, 
    dataFile: "42_-_porto_do_forno_-_136_-_138.json", region: "Sudeste",
    searchNames: ["Arraial do Cabo", "Cabo Frio", "Búzios", "São Pedro da Aldeia", "Saquarema"]
  },
  { 
    slug: "terminal-ilha-guaiba", 
    name: "Ilha Guaíba / Mangaratiba", 
    state: "RJ", lat: -23.0, lon: -44.01692, 
    dataFile: "43_-_terminal_da_ilha_guaíba_-_139_-_141.json", region: "Sudeste",
    searchNames: ["Mangaratiba", "Ilha Grande", "Conceição de Jacareí", "Costa Verde"]
  },
  { 
    slug: "angra-dos-reis", 
    name: "Angra dos Reis", 
    state: "RJ", lat: -23.00022, lon: -44.30025, 
    dataFile: "44_-_porto_de_angra_dos_reis_-_142_-144.json", region: "Sudeste",
    searchNames: ["Angra", "Ilha Grande (Abraão)", "Paraty", "Jabaquara", "Trindade (Paraty)"]
  },
  { 
    slug: "rio-de-janeiro-fiscal", 
    name: "Rio de Janeiro (Ilha Fiscal)", 
    state: "RJ", lat: -22.88356, lon: -43.16667, 
    dataFile: "4_-_porto_do_rio_de_janeiro_-_ilha_fiscal_(estado_do_rio_de_janeiro)_-_2025_-_páginas_129_a_131.json", region: "Sudeste",
    searchNames: ["Rio de Janeiro", "Niterói", "Maricá", "Sambaetiba", "Copacabana", "Ipanema", "Barra da Tijuca", "Recreio"]
  },
  { 
    slug: "sao-sebastiao", 
    name: "São Sebastião / Ilhabela", 
    state: "SP", lat: -23.80017, lon: -45.38358, 
    dataFile: "45_-_porto_de_são_sebastião_-_145_-_147.json", region: "Sudeste",
    searchNames: ["São Sebastião", "Ilhabela", "Ubatuba", "Caraguatatuba", "Maresias", "Camburi", "Juquehy"]
  },
  { 
    slug: "santos", 
    name: "Porto de Santos / Guarujá", 
    state: "SP", lat: -23.95011, lon: -46.30014, 
    dataFile: "46_-_porto_de_santos_-_148_-_150.json", region: "Sudeste",
    searchNames: ["Santos", "Guarujá", "Bertioga", "Praia Grande", "São Vicente", "Riviera", "Cubatão", "Itanhaém", "Peruíbe"]
  },
  { 
    slug: "ponta-do-felix", 
    name: "Antonina / Ponta do Félix", 
    state: "PR", lat: -25.45008, lon: -48.66686, 
    dataFile: "47_-_terminal_portuário_da_ponta_do_félix__151_-_153.json", region: "Sudeste",
    searchNames: ["Antonina", "Morretes"]
  },

  // ── SUL ──
  { 
    slug: "paranagua-cais-oeste", 
    name: "Paranaguá (Cais Oeste)", 
    state: "PR", lat: -25.50003, lon: -48.51692, 
    dataFile: "48_-_porto_de_paranaguá_-_cais_oeste_-_154_-_156.json", region: "Sul",
    searchNames: ["Paranaguá", "Ilha do Mel", "Pontal do Paraná", "Pontal do Sul"]
  },
  { 
    slug: "paranagua-canal-sueste", 
    name: "Paranaguá (Canal Sueste)", 
    state: "PR", lat: -25.53344, lon: -48.28353, 
    dataFile: "49_-_barra_de_paranaguá_-_canal_sueste_157_-_159.json", region: "Sul",
    searchNames: ["Matinhos", "Caiobá", "Guaratuba"]
  },
  { 
    slug: "paranagua-canal-galheta", 
    name: "Paranaguá (C. Galheta)", 
    state: "PR", lat: -25.56667, lon: -48.31667, 
    dataFile: "50_-_barra_de_paranaguá_-_canal_da_galheta_160_-162.json", region: "Sul",
    searchNames: ["Matinhos", "Praia de Leste"]
  },
  { 
    slug: "sao-francisco-do-sul", 
    name: "São Francisco do Sul", 
    state: "SC", lat: -26.23353, lon: -48.63347, 
    dataFile: "51_-_porto_de_são_francisco_do_sul_-_163_-165.json", region: "Sul",
    searchNames: ["SFS", "Enseada", "Joinville", "Itapoá", "Barra do Sul"]
  },
  { 
    slug: "itajai", 
    name: "Porto de Itajaí / BC", 
    state: "SC", lat: -26.90008, lon: -48.65006, 
    dataFile: "52_-_porto_de_itajaí_-_166_-_168.json", region: "Sul",
    searchNames: ["Itajaí", "Balneário Camboriú", "BC", "Itapema", "Meia Praia", "Bombinhas", "Porto Belo", "Penha", "Piçarras", "Barra Velha", "Navegantes"]
  },
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
