// Arquivo puramente aditivo — não toca em nenhuma lógica de dados existente
// Tarefa 1: configuração SEO por porto

export type PortoCategory = 'surf' | 'pesca' | 'turismo' | 'industrial' | 'nautica';

export interface PortoSEOConfig {
  titleSuffix: string;
  description: string;
  keywords: string[];
  praias: string[];
  category: PortoCategory;
  portoVizinhos: string[]; // slugs de portos próximos
  faqs: { q: string; a: string }[];
  sobreTexto?: string; // opcional — se ausente, usa template da categoria
}

export const portosConfig: Record<string, PortoSEOConfig> = {

  'guaruja': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Surf, Pesca e Praia',
    description: 'Tábua de marés de Guarujá para hoje e 2026. Horários de maré alta e baixa, coeficiente, melhores momentos para surf na Praia do Tombo e pesca no Canal de Bertioga. Fonte: Marinha do Brasil.',
    keywords: ['maré guarujá hoje', 'maré alta guarujá', 'tabua maré guarujá 2026', 'surf guarujá maré', 'pesca guarujá maré', 'maré pitangueiras', 'maré enseada guarujá', 'coeficiente maré guarujá', 'horário maré guarujá amanhã'],
    praias: ['Pitangueiras', 'Enseada', 'Praia do Tombo', 'Perequê', 'Góis'],
    category: 'surf',
    portoVizinhos: ['santos', 'bertioga', 'sao-vicente'],
    faqs: [
      { q: 'Qual o melhor horário para surfar em Guarujá?', a: 'Na Praia do Tombo e Pitangueiras, a maré baixa a média (0,2m a 0,6m) favorece as ondas com mais forma. Prefira as 2 horas antes e depois da baixamar.' },
      { q: 'Qual o melhor horário para pescar em Guarujá?', a: 'Os melhores momentos são nas 2 horas ao redor da maré alta e da maré baixa, especialmente com coeficiente acima de 60. O Canal de Bertioga é especialmente produtivo.' },
      { q: 'O que é coeficiente de maré?', a: 'Número de 20 a 120 que indica a intensidade da maré. Acima de 70 são marés vivas com grande variação de nível; abaixo de 45 são marés mortas com pouca variação.' },
      { q: 'A maré alta em Guarujá pode inundar a orla de Pitangueiras?', a: 'Em marés vivas com coeficiente acima de 90, partes baixas da orla de Pitangueiras podem ser atingidas. A amplitude máxima em 2026 é de aproximadamente 1,64m.' },
      { q: 'Os dados servem para navegação?', a: 'Não. Os dados do MaréAgora são referência para atividades recreativas. Para navegação oficial, consulte sempre as tábuas publicadas pela Marinha do Brasil (CHM).' },
    ],
  },

  'santos': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Porto, Pesca e Praias',
    description: 'Tábua de marés de Santos para hoje e 2026. Horários de maré alta e baixa para pesca, passeios e navegação no estuário. Referência oficial da Marinha do Brasil.',
    keywords: ['maré santos hoje', 'tabua maré santos 2026', 'maré alta santos', 'pesca santos maré', 'horário maré santos', 'maré gonzaga', 'maré santos guarujá'],
    praias: ['Gonzaga', 'José Menino', 'Embaré', 'Aparecida', 'Ponta da Praia'],
    category: 'turismo',
    portoVizinhos: ['guaruja', 'sao-vicente', 'praia-grande', 'bertioga'],
    faqs: [
      { q: 'Santos e Guarujá têm a mesma tábua de marés?', a: 'Sim. O porto de Santos e Guarujá compartilham a mesma referência da Marinha do Brasil. Os horários são praticamente idênticos, com diferença de minutos.' },
      { q: 'Qual o melhor horário para pescar em Santos?', a: 'Os melhores momentos são nas 2 horas ao redor da maré alta e baixa, com coeficiente acima de 50. O estuário de Santos é muito produtivo na virada da maré.' },
      { q: 'O que é maré de sizígia em Santos?', a: 'Marés de sizígia ocorrem na lua nova e cheia, quando a amplitude é máxima. Em Santos, isso pode causar alagamentos na orla durante a preamar.' },
    ],
  },

  'ubatuba': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Surf e Ecoturismo',
    description: 'Tábua de marés de Ubatuba para hoje e 2026. Horários ideais para surf, mergulho e ecoturismo nas praias da Costa Verde paulista. Fonte: Marinha do Brasil.',
    keywords: ['maré ubatuba hoje', 'tabua maré ubatuba 2026', 'surf ubatuba maré', 'maré prumirim', 'maré itamambuca', 'mergulho ubatuba maré', 'maré baixa ubatuba praias'],
    praias: ['Itamambuca', 'Prumirim', 'Vermelha do Norte', 'Enseada', 'Toninhas'],
    category: 'surf',
    portoVizinhos: ['sao-sebastiao', 'ilhabela', 'caraguatatuba'],
    faqs: [
      { q: 'Qual a melhor praia de Ubatuba para surf na maré baixa?', a: 'Itamambuca e Prumirim são as praias de surf mais famosas de Ubatuba. A maré baixa a média cria as condições ideais de onda.' },
      { q: 'Qual a maré ideal para mergulho em Ubatuba?', a: 'A maré baixa favorece a visibilidade nas piscinas naturais e costões rochosos. Planejar a entrada 1 hora antes da baixamar é o ideal.' },
    ],
  },

  'bertioga': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Surf e Pesca',
    description: 'Tábua de marés de Bertioga para hoje e 2026. Horários de maré alta e baixa para surf, pesca e navegação no Canal de Bertioga. Fonte oficial: Marinha do Brasil.',
    keywords: ['maré bertioga hoje', 'tabua maré bertioga 2026', 'surf bertioga maré', 'pesca canal bertioga', 'maré maresias bertioga', 'horário maré bertioga'],
    praias: ['Itaguaré', 'Boracéia', 'Enseada', 'Vista Linda'],
    category: 'surf',
    portoVizinhos: ['guaruja', 'santos', 'maresias'],
    faqs: [
      { q: 'Qual o melhor horário para pescar no Canal de Bertioga?', a: 'O Canal de Bertioga é mais produtivo na virada da maré, especialmente com coeficiente acima de 55. A maré enchente concentra os peixes nas margens.' },
    ],
  },

  'fernando-de-noronha': {
    titleSuffix: 'Maré Alta e Baixa — Mergulho e Snorkel',
    description: 'Tábua de marés de Fernando de Noronha para hoje e 2026. Horários ideais para mergulho, snorkel e acesso às praias. Dados oficiais da Marinha do Brasil.',
    keywords: ['maré fernando de noronha', 'mergulho noronha maré', 'snorkel noronha horário', 'maré baixa noronha praias', 'tabua maré noronha 2026', 'maré baía do sancho', 'piscinas noronha maré'],
    praias: ['Baía do Sancho', 'Praia do Leão', 'Praia do Cachorro', 'Conceição', 'Boldró', 'Atalaia'],
    category: 'turismo',
    portoVizinhos: ['porto-do-recife', 'porto-de-natal'],
    faqs: [
      { q: 'Qual a maré ideal para mergulho em Fernando de Noronha?', a: 'A maré baixa favorece a visibilidade e o acesso às piscinas naturais. Planeje a entrada 1 hora antes da baixamar para aproveitar a água mais cristalina.' },
      { q: 'A maré afeta o acesso às praias de Noronha?', a: 'Sim. Algumas praias como Praia do Leão e Atalaia ficam inacessíveis na maré alta. Consulte o horário antes de sair para a trilha.' },
      { q: 'Qual é a amplitude de maré em Fernando de Noronha?', a: 'A amplitude em Noronha é menor que no litoral sul do Brasil, em torno de 1,2m. O regime é semidiurno, com dois ciclos completos por dia.' },
    ],
  },

  'angra-dos-reis': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Ilhas e Passeios de Barco',
    description: 'Tábua de marés de Angra dos Reis para hoje e 2026. Horários para passeios de barco, mergulho e pesca nas mais de 360 ilhas da baía. Fonte: Marinha do Brasil.',
    keywords: ['maré angra dos reis hoje', 'tabua maré angra 2026', 'passeio barco angra maré', 'mergulho angra maré', 'pesca angra dos reis maré', 'maré ilha grande angra'],
    praias: ['Ilha Grande', 'Abraão', 'Lopes Mendes', 'Dois Rios', 'Calhetas'],
    category: 'turismo',
    portoVizinhos: ['ilha-grande', 'paraty', 'mangaratiba'],
    faqs: [
      { q: 'Como a maré afeta os passeios de barco em Angra dos Reis?', a: 'A maré baixa pode dificultar a navegação em canais rasos entre as ilhas. Para passeios seguros, confira o horário da preamar e planeje os trechos mais rasos para antes da baixamar.' },
    ],
  },

  'florianopolis': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Surf e Turismo',
    description: 'Tábua de marés de Florianópolis para hoje e 2026. Horários de maré para surf em Joaquina e Campeche, pesca e passeios. Fonte: Marinha do Brasil.',
    keywords: ['maré florianópolis hoje', 'maré floripa', 'tabua maré florianópolis 2026', 'surf joaquina maré', 'maré campeche floripa', 'maré jurerê florianópolis', 'maré ingleses floripa'],
    praias: ['Joaquina', 'Campeche', 'Jurerê Internacional', 'Ingleses', 'Barra da Lagoa', 'Mole'],
    category: 'surf',
    portoVizinhos: ['itajai', 'imbituba', 'garopaba'],
    faqs: [
      { q: 'Qual praia de Florianópolis tem melhor surf?', a: 'Joaquina e Campeche são as praias de surf mais famosas de Floripa. Barra da Lagoa e Mole também têm boas ondas. A maré baixa a média favorece as condições de onda.' },
      { q: 'Como a maré afeta Jurerê Internacional?', a: 'Jurerê tem praia calma e as variações de maré são moderadas. A maré baixa expõe bancos de areia e cria piscinas naturais ideais para crianças.' },
    ],
  },

  'salvador': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Praias e Náutica',
    description: 'Tábua de marés de Salvador (BA) para hoje e 2026. Horários de maré para as praias da orla, pesca e navegação na Baía de Todos os Santos. Fonte: Marinha do Brasil.',
    keywords: ['maré salvador hoje', 'tabua maré salvador 2026', 'maré barra salvador', 'maré ondina salvador', 'pesca baía todos os santos maré', 'maré itapuã salvador'],
    praias: ['Barra', 'Ondina', 'Itapuã', 'Rio Vermelho', 'Flamengo'],
    category: 'turismo',
    portoVizinhos: ['lauro-de-freitas', 'itaparica', 'madre-de-deus'],
    faqs: [
      { q: 'Como a maré afeta as praias de Salvador?', a: 'Na Praia da Barra e Ondina, a maré baixa é ideal para banho, pois as pedras ficam mais expostas. Na maré alta, as ondas chegam mais perto da orla.' },
    ],
  },

  'rio-de-janeiro-fiscal': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Praias e Baía de Guanabara',
    description: 'Tábua de marés do Rio de Janeiro para hoje e 2026. Horários de maré para as praias da Zona Sul, Guanabara e Baía de Sepetiba. Fonte: Marinha do Brasil.',
    keywords: ['maré rio de janeiro hoje', 'maré copacabana', 'tabua maré rio 2026', 'maré ipanema', 'maré barra tijuca', 'maré guanabara', 'maré praias rio'],
    praias: ['Copacabana', 'Ipanema', 'Leblon', 'Barra da Tijuca', 'Recreio'],
    category: 'turismo',
    portoVizinhos: ['copacabana', 'barra-da-tijuca', 'niteroi', 'itaguai'],
    faqs: [
      { q: 'A tábua de marés da Ilha Fiscal vale para Copacabana?', a: 'Sim. A Ilha Fiscal é a referência da Marinha para o Rio de Janeiro. Copacabana, Ipanema e Barra têm horários praticamente idênticos, com diferença de minutos.' },
    ],
  },

  'sao-sebastiao': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Praias e Ilhabela',
    description: 'Tábua de marés de São Sebastião para hoje e 2026. Horários para surf, pesca e travessia para Ilhabela. Fonte oficial: Marinha do Brasil.',
    keywords: ['maré são sebastião hoje', 'tabua maré são sebastião 2026', 'maré ilhabela', 'travessia ilhabela maré', 'pesca são sebastião maré', 'surf são sebastião'],
    praias: ['Barra do Sahy', 'Maresias', 'Paúba', 'Juqueí', 'Boiçucanga'],
    category: 'turismo',
    portoVizinhos: ['ilhabela', 'ubatuba', 'caraguatatuba', 'maresias'],
    faqs: [
      { q: 'A maré afeta a travessia para Ilhabela?', a: 'Sim. Em marés vivas com coeficiente alto, as correntes no Canal de São Sebastião ficam mais intensas. A balsa opera normalmente, mas embarcações menores devem ter cuidado.' },
    ],
  },

  'porto-do-recife': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Piscinas Naturais e Pesca',
    description: 'Tábua de marés do Recife para hoje e 2026. Horários para as piscinas naturais de Porto de Galinhas, Boa Viagem e pesca no litoral pernambucano. Fonte: Marinha do Brasil.',
    keywords: ['maré recife hoje', 'tabua maré recife 2026', 'maré boa viagem recife', 'piscinas naturais porto galinhas maré', 'maré baixa porto galinhas', 'pesca recife maré'],
    praias: ['Boa Viagem', 'Porto de Galinhas', 'Olinda', 'Piedade', 'Candeias'],
    category: 'turismo',
    portoVizinhos: ['porto-de-suape', 'olinda', 'boa-viagem'],
    faqs: [
      { q: 'Qual horário visitar as piscinas naturais de Porto de Galinhas?', a: 'As piscinas naturais de Porto de Galinhas ficam acessíveis somente na maré baixa, quando as jangadas podem entrar. Chegue pelo menos 1 hora antes da baixamar.' },
      { q: 'A maré afeta a praia de Boa Viagem?', a: 'Sim. Na maré alta, as ondas chegam perto da calçada. Na maré baixa, a faixa de areia aumenta significativamente.' },
    ],
  },

  'porto-de-natal': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Piscinas Naturais e Turismo',
    description: 'Tábua de marés de Natal (RN) para hoje e 2026. Horários para as piscinas naturais de Maracajaú, Genipabu e praias da orla. Fonte: Marinha do Brasil.',
    keywords: ['maré natal rn hoje', 'tabua maré natal 2026', 'maré ponta negra natal', 'maré genipabu', 'maré maracajaú', 'piscinas naturais natal maré', 'maré via costeira natal'],
    praias: ['Ponta Negra', 'Via Costeira', 'Genipabu', 'Pirangi do Norte', 'Maracajaú'],
    category: 'turismo',
    portoVizinhos: ['ponta-negra-natal', 'genipabu', 'pirangi'],
    faqs: [
      { q: 'Qual o horário para visitar Maracajaú?', a: 'Maracajaú só pode ser visitado na maré baixa, quando os recifes ficam acessíveis. Consulte o horário da baixamar com pelo menos 1 dia de antecedência.' },
    ],
  },

};

// Templates de fallback por categoria (para portos sem config específica)
export const categoryDefaults: Record<PortoCategory, {
  titleSuffix: string;
  descriptionTemplate: (nome: string, estado: string) => string;
  faqs: { q: string; a: string }[];
}> = {
  surf: {
    titleSuffix: 'Maré Alta e Baixa — Surf e Pesca',
    descriptionTemplate: (nome, estado) =>
      `Tábua de marés de ${nome}, ${estado} para hoje e 2026. Horários de maré alta e baixa para surf, pesca e atividades na praia. Fonte: Marinha do Brasil.`,
    faqs: [
      { q: 'Como usar a tábua de marés para surf?', a: 'A maré baixa a média geralmente favorece as ondas com mais forma. Verifique o horário da baixamar e planeje a sessão nas 2 horas ao redor desse momento.' },
      { q: 'O que é coeficiente de maré?', a: 'Número de 20 a 120 que indica a intensidade da maré. Acima de 70 são marés vivas; abaixo de 45 são marés mortas.' },
    ],
  },
  pesca: {
    titleSuffix: 'Maré Alta e Baixa — Pesca e Náutica',
    descriptionTemplate: (nome, estado) =>
      `Tábua de marés de ${nome}, ${estado} para hoje e 2026. Horários ideais para pesca, navegação e atividades náuticas. Fonte: Marinha do Brasil.`,
    faqs: [
      { q: 'Qual a melhor maré para pescar?', a: 'Os melhores momentos são nas 2 horas ao redor da maré alta e da maré baixa, quando os peixes se movimentam. Coeficiente acima de 60 indica marés mais produtivas.' },
      { q: 'O que é maré de sizígia?', a: 'Maré de sizígia ocorre na lua nova e cheia, quando a amplitude é máxima. É geralmente o melhor período para a pesca por causa das correntes mais intensas.' },
    ],
  },
  turismo: {
    titleSuffix: 'Maré Alta e Baixa — Praias e Passeios',
    descriptionTemplate: (nome, estado) =>
      `Tábua de marés de ${nome}, ${estado} para hoje e 2026. Horários de maré para aproveitar melhor as praias e passeios. Fonte: Marinha do Brasil.`,
    faqs: [
      { q: 'Como a maré afeta as praias turísticas?', a: 'Na maré baixa, a faixa de areia fica mais ampla e as piscinas naturais ficam acessíveis. Na maré alta, as ondas chegam mais perto da orla.' },
      { q: 'O que é tábua de marés?', a: 'É a previsão dos horários e alturas de maré alta (preamar) e maré baixa (baixamar) para um porto ou praia específicos.' },
    ],
  },
  industrial: {
    titleSuffix: 'Tábua de Marés Oficial 2026',
    descriptionTemplate: (nome, estado) =>
      `Tábua de marés de ${nome}, ${estado} para 2026. Previsão de maré alta e baixa com dados da Marinha do Brasil (CHM).`,
    faqs: [
      { q: 'Os dados são válidos para navegação comercial?', a: 'Não. Os dados do MaréAgora são de referência para atividades recreativas. Para navegação de calado considerável, use as tábuas oficiais publicadas pela Marinha do Brasil.' },
      { q: 'O que é coeficiente de maré?', a: 'Número de 20 a 120 que indica a intensidade da maré. Acima de 70 são marés vivas com grande variação de nível.' },
    ],
  },
  nautica: {
    titleSuffix: 'Tábua de Marés — Náutica e Pesca',
    descriptionTemplate: (nome, estado) =>
      `Tábua de marés de ${nome}, ${estado} para 2026. Horários de maré para pesca, navegação e atividades náuticas. Fonte: Marinha do Brasil.`,
    faqs: [
      { q: 'Como interpretar o coeficiente de maré?', a: 'Valores acima de 70 indicam marés vivas com grande variação. Abaixo de 45 são marés mortas com pouca variação de nível.' },
      { q: 'A tábua serve para navegação?', a: 'Não para navegação profissional. Para embarcações de calado considerável, use sempre as publicações oficiais da Marinha do Brasil.' },
    ],
  },
};
