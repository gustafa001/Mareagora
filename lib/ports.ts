export type Port = {
  slug: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  dataFile: string;
  region: string;
  searchNames?: string[];
};

export const PORTS: Port[] = [

  // ══════════════════════════════════════════════════════════════════════════════
  // NORTE (PA, AP)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    slug: "barra-norte-arco-lamoso",
    name: "Barra Norte / Arco Lamoso",
    state: "PA", lat: 1.43336, lon: -49.21675,
    dataFile: "1_-barra_norte_-_arco_lamoso_-_2026_-_13_-_15.json", region: "Norte",
    searchNames: ["Macapá", "Afuá", "Chaves"]
  },
  {
    slug: "afua",
    name: "Afuá",
    state: "PA", lat: -0.15, lon: -50.38,
    dataFile: "1_-barra_norte_-_arco_lamoso_-_2026_-_13_-_15.json", region: "Norte",
    searchNames: ["Afuá", "Ilha do Marajó (Norte)"]
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
    slug: "macapa",
    name: "Macapá",
    state: "AP", lat: 0.034, lon: -51.066,
    dataFile: "3_-_porto_de_santana_-_19_-_21.json", region: "Norte",
    searchNames: ["Macapá", "Fazendinha", "Curiaú"]
  },
  {
    slug: "ilha-dos-guaras",
    name: "Ilha dos Guarás",
    state: "PA", lat: -0.58358, lon: -47.90025,
    dataFile: "4_-_ilha_dos_guarás__estado_do_pará__-_2026__22_-_24.json", region: "Norte",
    searchNames: ["Salvaterra", "Soure", "Ilha de Marajó"]
  },
  {
    slug: "salvaterra",
    name: "Salvaterra",
    state: "PA", lat: -0.76, lon: -48.52,
    dataFile: "4_-_ilha_dos_guarás__estado_do_pará__-_2026__22_-_24.json", region: "Norte",
    searchNames: ["Salvaterra", "Praia do Pesqueiro", "Ilha do Marajó"]
  },
  {
    slug: "soure",
    name: "Soure",
    state: "PA", lat: -0.72, lon: -48.52,
    dataFile: "4_-_ilha_dos_guarás__estado_do_pará__-_2026__22_-_24.json", region: "Norte",
    searchNames: ["Soure", "Praia de Araruna", "Ilha do Marajó"]
  },
  {
    slug: "fundeadouro-de-salinopolis",
    name: "Fundeadouro de Salinópolis",
    state: "PA", lat: -0.61667, lon: -47.35,
    dataFile: "5_-fundeadouro_de_salinópolis____25_-_27.json", region: "Norte",
    searchNames: ["Salinas", "Salinópolis", "Atalaia", "Cuiarana"]
  },
  {
    slug: "salinopolis",
    name: "Salinópolis",
    state: "PA", lat: -0.617, lon: -47.356,
    dataFile: "5_-fundeadouro_de_salinópolis____25_-_27.json", region: "Norte",
    searchNames: ["Salinópolis", "Salinas", "Atalaia", "Cuiarana"]
  },
  {
    slug: "ilha-do-mosqueiro",
    name: "Ilha do Mosqueiro",
    state: "PA", lat: -1.15025, lon: -48.46678,
    dataFile: "6_-_ilha_do_mosqueiro_28_-_30.json", region: "Norte",
    searchNames: ["Mosqueiro", "Santa Bárbara", "Baía do Sol", "Chapéu Virado"]
  },
  {
    slug: "porto-de-belem",
    name: "Porto de Belém",
    state: "PA", lat: -1.38356, lon: -48.4835,
    dataFile: "7_-_porto_de_belém__estado_do_pará__-_2026_-_31_-_33.json", region: "Norte",
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
    slug: "barcarena",
    name: "Barcarena",
    state: "PA", lat: -1.510, lon: -48.623,
    dataFile: "8_-_porto_de_vila_do_conde__34_-_36.json", region: "Norte",
    searchNames: ["Barcarena", "Vila do Conde", "Murucupi"]
  },
  {
    slug: "atracadouro-de-breves",
    name: "Atracadouro de Breves",
    state: "PA", lat: -1.68347, lon: -50.48333,
    dataFile: "9_-_atracadouro_de_breves_37_-_39.json", region: "Norte",
    searchNames: ["Breves", "Bagre", "Melgaço"]
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // NORDESTE
  // ══════════════════════════════════════════════════════════════════════════════
  {
    slug: "sao-luis",
    name: "São Luís",
    state: "MA", lat: -2.51683, lon: -44.30019,
    dataFile: "10_-_são_luís_40_-_42.json", region: "Nordeste",
    searchNames: ["São Luís", "São José de Ribamar", "Paço do Lumiar", "Raposa"]
  },
  {
    slug: "sao-jose-de-ribamar",
    name: "São José de Ribamar",
    state: "MA", lat: -2.557, lon: -44.056,
    dataFile: "10_-_são_luís_40_-_42.json", region: "Nordeste",
    searchNames: ["Ribamar", "Praia de Panaquatira", "Araçagy"]
  },
  {
    slug: "raposa",
    name: "Raposa",
    state: "MA", lat: -2.426, lon: -44.096,
    dataFile: "10_-_são_luís_40_-_42.json", region: "Nordeste",
    searchNames: ["Raposa", "Praia da Raposa"]
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
    slug: "parnaiba",
    name: "Parnaíba",
    state: "PI", lat: -2.905, lon: -41.776,
    dataFile: "15_-_porto_de_luís_correia_55_-_57.json", region: "Nordeste",
    searchNames: ["Parnaíba", "Delta do Parnaíba", "Porto dos Tatus"]
  },
  {
    slug: "cajueiro-da-praia",
    name: "Cajueiro da Praia",
    state: "PI", lat: -2.978, lon: -41.323,
    dataFile: "15_-_porto_de_luís_correia_55_-_57.json", region: "Nordeste",
    searchNames: ["Cajueiro da Praia", "Pedra do Sal"]
  },
  {
    slug: "barra-grande-pi",
    name: "Barra Grande",
    state: "PI", lat: -2.808, lon: -41.955,
    dataFile: "15_-_porto_de_luís_correia_55_-_57.json", region: "Nordeste",
    searchNames: ["Barra Grande", "Coqueiro", "Morro Branco (PI)"]
  },
  {
    slug: "terminal-portuario-do-pecem",
    name: "Terminal Portuário do Pecém",
    state: "CE", lat: -3.53336, lon: -38.78358,
    dataFile: "16_-_terminal_portuário_do_pecém__58_-_60.json", region: "Nordeste",
    searchNames: ["Cumbuco", "Taíba", "Caucaia", "São Gonçalo do Amarante", "Paracuru"]
  },
  {
    slug: "cumbuco",
    name: "Cumbuco",
    state: "CE", lat: -3.635, lon: -38.727,
    dataFile: "16_-_terminal_portuário_do_pecém__58_-_60.json", region: "Nordeste",
    searchNames: ["Cumbuco", "Taíba", "Pecém", "Icaraí de Amontada"]
  },
  {
    slug: "caucaia",
    name: "Caucaia",
    state: "CE", lat: -3.738, lon: -38.656,
    dataFile: "16_-_terminal_portuário_do_pecém__58_-_60.json", region: "Nordeste",
    searchNames: ["Caucaia", "Iparana", "Pacheco", "Paracuru"]
  },
  {
    slug: "porto-de-mucuripe-fortaleza",
    name: "Porto de Mucuripe (Fortaleza)",
    state: "CE", lat: -3.70025, lon: -38.46683,
    dataFile: "17_-_porto_de_mucuripe_-_fortaleza_61_-_63.json", region: "Nordeste",
    searchNames: ["Fortaleza", "Aquiraz", "Porto das Dunas", "Iracema", "Meireles", "Beira Mar"]
  },
  {
    slug: "aquiraz",
    name: "Aquiraz",
    state: "CE", lat: -3.896, lon: -38.392,
    dataFile: "17_-_porto_de_mucuripe_-_fortaleza_61_-_63.json", region: "Nordeste",
    searchNames: ["Aquiraz", "Porto das Dunas", "Beach Park", "Prainha (CE)", "Iguape"]
  },
  {
    slug: "fernando-de-noronha",
    name: "Fernando de Noronha",
    state: "PE", lat: -3.83333, lon: -32.40006,
    dataFile: "18_-_arquipélago_de_fernando_de_noronha_64_-_66.json", region: "Nordeste",
    searchNames: ["Noronha", "Vila dos Remédios", "Praia do Sancho", "Baía dos Porcos"]
  },
  {
    slug: "porto-de-areia-branca",
    name: "Porto de Areia Branca (Termisa)",
    state: "RN", lat: -4.81667, lon: -37.13333,
    dataFile: "19_-_porto_de_areia_branca_-_termisa_-_67_-_69.json", region: "Nordeste",
    searchNames: ["Areia Branca", "Tibau", "Mossoró", "Ponta do Mel"]
  },
  {
    slug: "porto-de-macau",
    name: "Porto de Macau",
    state: "RN", lat: -5.1, lon: -36.66678,
    dataFile: "20_-_porto_de_macau_-_70_-_72.json", region: "Nordeste",
    searchNames: ["Macau", "Guamaré", "Galinhos"]
  },
  {
    slug: "guamare",
    name: "Guamaré",
    state: "RN", lat: -5.116, lon: -36.320,
    dataFile: "20_-_porto_de_macau_-_70_-_72.json", region: "Nordeste",
    searchNames: ["Guamaré", "Galinhos", "Macau"]
  },
  {
    slug: "porto-de-natal",
    name: "Porto de Natal",
    state: "RN", lat: -5.76667, lon: -35.20003,
    dataFile: "22_-_porto_de_natal_-_com3dn_-_76_-78.json", region: "Nordeste",
    searchNames: ["Natal", "Ponta Negra", "Genipabu", "Parnamirim", "Pirangi", "Extremoz"]
  },
  {
    slug: "ponta-negra-natal",
    name: "Ponta Negra (Natal)",
    state: "RN", lat: -5.877, lon: -35.176,
    dataFile: "22_-_porto_de_natal_-_com3dn_-_76_-78.json", region: "Nordeste",
    searchNames: ["Ponta Negra", "Morro do Careca", "Via Costeira"]
  },
  {
    slug: "genipabu",
    name: "Genipabu",
    state: "RN", lat: -5.663, lon: -35.187,
    dataFile: "22_-_porto_de_natal_-_com3dn_-_76_-78.json", region: "Nordeste",
    searchNames: ["Genipabu", "Extremoz", "Pitangui", "Jacumã (RN)"]
  },
  {
    slug: "pirangi",
    name: "Pirangi do Norte",
    state: "RN", lat: -5.996, lon: -35.134,
    dataFile: "22_-_porto_de_natal_-_com3dn_-_76_-78.json", region: "Nordeste",
    searchNames: ["Pirangi", "Parnamirim", "Búzios (RN)", "Nísia Floresta"]
  },
  {
    slug: "porto-de-cabedelo",
    name: "Porto de Cabedelo",
    state: "PB", lat: -6.96672, lon: -34.83344,
    dataFile: "23_-_porto_de_cabedelo_-_79_-_81.json", region: "Nordeste",
    searchNames: ["João Pessoa", "Cabedelo", "Intermares", "Bessa", "Manaíra", "Tambaú", "Lucena"]
  },
  {
    slug: "joao-pessoa",
    name: "João Pessoa",
    state: "PB", lat: -7.119, lon: -34.845,
    dataFile: "23_-_porto_de_cabedelo_-_79_-_81.json", region: "Nordeste",
    searchNames: ["João Pessoa", "Tambaú", "Manaíra", "Bessa", "Intermares", "Lucena", "Penha (PB)"]
  },
  {
    slug: "porto-do-recife",
    name: "Porto do Recife",
    state: "PE", lat: -8.05011, lon: -34.86667,
    dataFile: "24_-_porto_do_recife_-_82_-_84.json", region: "Nordeste",
    searchNames: ["Recife", "Boa Viagem", "Olinda", "Jaboatão", "Piedade", "Maria Farinha"]
  },
  {
    slug: "olinda",
    name: "Olinda",
    state: "PE", lat: -8.009, lon: -34.855,
    dataFile: "24_-_porto_do_recife_-_82_-_84.json", region: "Nordeste",
    searchNames: ["Olinda", "Maria Farinha", "Pau Amarelo", "Janga"]
  },
  {
    slug: "boa-viagem",
    name: "Boa Viagem (Recife)",
    state: "PE", lat: -8.120, lon: -34.902,
    dataFile: "24_-_porto_do_recife_-_82_-_84.json", region: "Nordeste",
    searchNames: ["Boa Viagem", "Piedade", "Candeias (PE)", "Jaboatão dos Guararapes"]
  },
  {
    slug: "porto-de-suape",
    name: "Porto de Suape / P. Galinhas",
    state: "PE", lat: -8.3835, lon: -34.95017,
    dataFile: "25_-_porto_de_suape_-_85_-87.json", region: "Nordeste",
    searchNames: ["Porto de Galinhas", "Ipojuca", "Cabo de Santo Agostinho", "Gaibu", "Calhetas", "Serrambi", "Maracaípe"]
  },
  {
    slug: "porto-de-galinhas",
    name: "Porto de Galinhas",
    state: "PE", lat: -8.504, lon: -35.005,
    dataFile: "25_-_porto_de_suape_-_85_-87.json", region: "Nordeste",
    searchNames: ["Porto de Galinhas", "Maracaípe", "Serrambi", "Calhetas", "Gaibu", "Muro Alto"]
  },
  {
    slug: "ipojuca",
    name: "Ipojuca",
    state: "PE", lat: -8.396, lon: -35.061,
    dataFile: "25_-_porto_de_suape_-_85_-87.json", region: "Nordeste",
    searchNames: ["Ipojuca", "Suape", "Cabo de Santo Agostinho"]
  },
  {
    slug: "maceio",
    name: "Maceió",
    state: "AL", lat: -9.68333, lon: -35.71681,
    dataFile: "26_-_porto_de_maceió_-_88_-90.json", region: "Nordeste",
    searchNames: ["Maceió", "Pajuçara", "Ponta Verde", "Jatiúca", "Francês", "Marechal Deodoro", "Barra de São Miguel", "Paripueira"]
  },
  {
    slug: "pajucara",
    name: "Pajuçara (Maceió)",
    state: "AL", lat: -9.668, lon: -35.710,
    dataFile: "26_-_porto_de_maceió_-_88_-90.json", region: "Nordeste",
    searchNames: ["Pajuçara", "Ponta Verde", "Jatiúca", "Cruz das Almas (AL)"]
  },
  {
    slug: "frances",
    name: "Praia do Francês",
    state: "AL", lat: -9.831, lon: -35.851,
    dataFile: "26_-_porto_de_maceió_-_88_-90.json", region: "Nordeste",
    searchNames: ["Francês", "Marechal Deodoro", "Barra de São Miguel", "Paripueira"]
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
    slug: "lauro-de-freitas",
    name: "Lauro de Freitas",
    state: "BA", lat: -12.897, lon: -38.326,
    dataFile: "31_-_porto_de_salvador_-_103_-_105.json", region: "Nordeste",
    searchNames: ["Lauro de Freitas", "Buraquinho", "Ipitanga", "Stella Maris", "Itapuã"]
  },
  {
    slug: "itaparica",
    name: "Ilha de Itaparica",
    state: "BA", lat: -12.887, lon: -38.680,
    dataFile: "31_-_porto_de_salvador_-_103_-_105.json", region: "Nordeste",
    searchNames: ["Itaparica", "Vera Cruz", "Mar Grande", "Bom Despacho"]
  },
  {
    slug: "ilheus-malhado",
    name: "Ilhéus (Malhado)",
    state: "BA", lat: -14.76689, lon: -39.01683,
    dataFile: "32_-_porto_de_ilhéus_-_malhado_-_106_-_108.json", region: "Nordeste",
    searchNames: ["Ilhéus", "Itacaré", "Olivença", "Una"]
  },
  {
    slug: "itacare",
    name: "Itacaré",
    state: "BA", lat: -14.280, lon: -38.997,
    dataFile: "32_-_porto_de_ilhéus_-_malhado_-_106_-_108.json", region: "Nordeste",
    searchNames: ["Itacaré", "Engenhoca", "Tiririca", "Resende", "Jeribucaçu"]
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // SUDESTE
  // ══════════════════════════════════════════════════════════════════════════════
  {
    slug: "barra-do-riacho",
    name: "Barra do Riacho",
    state: "ES", lat: -19.83342, lon: -40.05017,
    dataFile: "33_-_terminal_de_barra_do_riacho_-_109_-_111.json", region: "Sudeste",
    searchNames: ["Aracruz", "Regência", "Linhares"]
  },
  {
    slug: "aracruz",
    name: "Aracruz",
    state: "ES", lat: -19.819, lon: -40.271,
    dataFile: "33_-_terminal_de_barra_do_riacho_-_109_-_111.json", region: "Sudeste",
    searchNames: ["Aracruz", "Regência", "Barra do Riacho", "Castelhanos (ES)"]
  },
  {
    slug: "porto-de-tubarao",
    name: "Porto de Tubarão",
    state: "ES", lat: -20.28342, lon: -40.2335,
    dataFile: "34_-_porto_de_tubarão_-_112_-_114.json", region: "Sudeste",
    searchNames: ["Vitória (Camburi)", "Serra", "Manguinhos", "Jacaraípe"]
  },
  {
    slug: "manguinhos-es",
    name: "Manguinhos / Serra",
    state: "ES", lat: -20.128, lon: -40.213,
    dataFile: "34_-_porto_de_tubarão_-_112_-_114.json", region: "Sudeste",
    searchNames: ["Manguinhos", "Serra", "Jacaraípe", "Nova Almeida", "Fundão"]
  },
  {
    slug: "porto-de-vitoria",
    name: "Porto de Vitória",
    state: "ES", lat: -20.31675, lon: -40.33339,
    dataFile: "35_-_porto_de_vitória_-_115_-_117.json", region: "Sudeste",
    searchNames: ["Vitória", "Vila Velha", "Guarapari", "Itaparica (ES)", "Itapoã", "Praia da Costa"]
  },
  {
    slug: "vila-velha",
    name: "Vila Velha",
    state: "ES", lat: -20.329, lon: -40.292,
    dataFile: "35_-_porto_de_vitória_-_115_-_117.json", region: "Sudeste",
    searchNames: ["Vila Velha", "Itapoã", "Praia da Costa", "Coqueiral", "Itaparica (ES)"]
  },
  {
    slug: "guarapari",
    name: "Guarapari",
    state: "ES", lat: -20.672, lon: -40.499,
    dataFile: "35_-_porto_de_vitória_-_115_-_117.json", region: "Sudeste",
    searchNames: ["Guarapari", "Meaípe", "Iriri", "Setiba", "Peracanga", "Praia do Morro"]
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
    dataFile: "38_-_porto_do_açu_-_124_-_126.json", region: "Sudeste",
    searchNames: ["São João da Barra", "São Francisco de Itabapoana", "Atafona", "Grussaí"]
  },
  {
    slug: "sao-joao-da-barra",
    name: "São João da Barra",
    state: "RJ", lat: -21.638, lon: -41.051,
    dataFile: "38_-_porto_do_açu_-_124_-_126.json", region: "Sudeste",
    searchNames: ["São João da Barra", "Atafona", "Grussaí", "São Francisco de Itabapoana"]
  },
  {
    slug: "terminal-imbetiba",
    name: "Terminal de Imbetiba / Macaé",
    state: "RJ", lat: -22.41678, lon: -41.43336,
    dataFile: "39_-_terminal_marítimo_de_imbetiba_-_127_-_129.json", region: "Sudeste",
    searchNames: ["Macaé", "Rio das Ostras", "Cavaleiros", "Barra de São João"]
  },
  {
    slug: "macae",
    name: "Macaé",
    state: "RJ", lat: -22.371, lon: -41.787,
    dataFile: "39_-_terminal_marítimo_de_imbetiba_-_127_-_129.json", region: "Sudeste",
    searchNames: ["Macaé", "Cavaleiros", "Lagoa de Imboassica", "Barra de Macaé"]
  },
  {
    slug: "rio-das-ostras",
    name: "Rio das Ostras",
    state: "RJ", lat: -22.527, lon: -41.944,
    dataFile: "39_-_terminal_marítimo_de_imbetiba_-_127_-_129.json", region: "Sudeste",
    searchNames: ["Rio das Ostras", "Barra de São João", "Costa Azul (RJ)"]
  },
  {
    slug: "rio-de-janeiro-fiscal",
    name: "Rio de Janeiro (Ilha Fiscal)",
    state: "RJ", lat: -22.88356, lon: -43.16667,
    dataFile: "40_-_porto_do_rio_de_janeiro_-_i_fiscal_-_130_-_132.json", region: "Sudeste",
    searchNames: ["Rio de Janeiro", "Niterói", "Maricá", "Copacabana", "Ipanema", "Barra da Tijuca", "Recreio"]
  },
  {
    slug: "copacabana",
    name: "Copacabana (Rio)",
    state: "RJ", lat: -22.969, lon: -43.186,
    dataFile: "40_-_porto_do_rio_de_janeiro_-_i_fiscal_-_130_-_132.json", region: "Sudeste",
    searchNames: ["Copacabana", "Ipanema", "Leblon", "Leme", "Arpoador"]
  },
  {
    slug: "barra-da-tijuca",
    name: "Barra da Tijuca",
    state: "RJ", lat: -23.001, lon: -43.366,
    dataFile: "40_-_porto_do_rio_de_janeiro_-_i_fiscal_-_130_-_132.json", region: "Sudeste",
    searchNames: ["Bar
