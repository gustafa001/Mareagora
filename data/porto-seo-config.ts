// Arquivo puramente aditivo — não toca em nenhuma lógica de dados existente
// Tarefa 1: configuração SEO por porto

export type PortoCategory = 'surf' | 'pesca' | 'turismo' | 'industrial' | 'nautica';
export type HighlightType = 'piscinas-naturais' | 'amplitude';

export interface PortoSEOConfig {
  seoName?: string; // opcional — nome usado no <title>/H1 quando difere do nome oficial do porto (ex.: busca por "Maceió", não "Porto de Maceió")
  titleSuffix: string;
  description: string;
  keywords: string[];
  praias: string[];
  category: PortoCategory;
  portoVizinhos: string[]; // slugs de portos próximos
  faqs: { q: string; a: string }[];
  sobreTexto?: string; // opcional — se ausente, usa template da categoria
  highlight?: HighlightType; // destaque de maré exibido no topo da página
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
      { q: 'Qual o melhor horário para pescar em Guarujá?', a: 'Os melhores momentos são nas 2 horas ao redor da virada da maré (enchente ou vazante), especialmente com coeficiente acima de 60. O Canal de Bertioga, que passa pela Praia da Enseada, é o ponto mais tradicional da cidade.' },
      { q: 'Quais peixes dá para pescar em Guarujá?', a: 'No Canal de Bertioga predomina o robalo (flecha e peva). Nos costões rochosos, como o Costão das Tartarugas e o Costão do Mar Casado, são comuns corvina, garoupa, badejo e sargo.' },
      { q: 'O que é coeficiente de maré?', a: 'Número de 20 a 120 que indica a intensidade da maré. Acima de 70 são marés vivas com grande variação de nível; abaixo de 45 são marés mortas com pouca variação.' },
      { q: 'A maré alta em Guarujá pode inundar a orla de Pitangueiras?', a: 'Em marés vivas com coeficiente acima de 90, partes baixas da orla de Pitangueiras podem ser atingidas. A amplitude máxima em 2026 é de aproximadamente 1,64m.' },
      { q: 'Os dados servem para navegação?', a: 'Não. Os dados do MaréAgora são referência para atividades recreativas. Para navegação oficial, consulte sempre as tábuas publicadas pela Marinha do Brasil (CHM).' },
    ],
  },

  'porto-de-santos': {
    titleSuffix: 'Horários e Coeficientes Oficiais',
    description: 'Tábua de marés do Porto de Santos para hoje e 2026. Horários de maré alta e baixa, coeficientes oficiais da Marinha do Brasil para operações portuárias, pesca e navegação no estuário.',
    keywords: ['maré santos hoje', 'tabua maré santos 2026', 'maré alta santos', 'porto de santos maré', 'horário maré santos', 'maré gonzaga', 'maré porto santos'],
    praias: ['Gonzaga', 'José Menino', 'Embaré', 'Aparecida', 'Ponta da Praia'],
    category: 'industrial',
    portoVizinhos: ['guaruja', 'sao-vicente', 'praia-grande', 'bertioga'],
    faqs: [
      { q: 'Qual o melhor horário para pescar no estuário de Santos?', a: 'Os melhores momentos são nas 2 horas ao redor da maré alta e baixa, com coeficiente acima de 50. O estuário de Santos é muito produtivo na virada da maré.' },
      { q: 'O que é maré de sizígia em Santos?', a: 'Marés de sizígia ocorrem na lua nova e cheia, quando a amplitude é máxima. Em Santos, isso pode causar correntes mais fortes no canal e alagamentos na orla.' },
      { q: 'Qual o melhor horário de maré para visitar as praias de Santos?', a: 'Para banho e recreação, a maré baixa a moderada é ideal — a faixa de areia fica mais extensa e o mar mais calmo. Evite a maré alta em dias de ressaca, pois as ondas chegam próximo à orla histórica. O horário exato varia diariamente — consulte a tábua acima.' },
      { q: 'Como a maré afeta o Porto de Santos e as operações portuárias?', a: 'O Porto de Santos é o maior da América Latina e suas operações de atracação dependem diretamente das marés. Navios de grande calado aguardam a maré alta para navegar no Canal de Santos com segurança. A profundidade do canal varia com a maré, tornando a tábua de marés uma ferramenta essencial para pilotos e práticos de navegação.' },
      { q: 'As marés de Santos são iguais às do Guarujá?', a: 'Sim, muito próximas. O Guarujá está a aproximadamente 7 km de Santos e usa o Porto de Santos como estação de referência para o cálculo das marés; pode haver pequena diferença de horário e altura em relação ao ponto exato da praia.' },
      { q: 'Com que antecedência posso confiar nas previsões de maré?', a: 'As previsões de maré são calculadas astronomicamente e têm alta precisão para meses ou até anos à frente — ao contrário da previsão do tempo. Os dados do MaréAgora são baseados nas publicações anuais da Marinha do Brasil (DHN) e são confiáveis para planejamento de atividades náuticas, pesca e turismo.' },
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

  'arquipelago-de-fernando-de-noronha': {
    titleSuffix: 'Horários de Hoje',
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

  'porto-de-angra-dos-reis': {
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

  'porto-de-florianopolis': {
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

  'porto-de-itajai': {
    titleSuffix: 'Horários e Coeficientes Oficiais',
    description: 'Tábua de marés do Porto de Itajaí (SC) para hoje e 2026. Horários de maré alta e baixa, coeficientes oficiais da Marinha do Brasil para operações portuárias, pesca e surf na Praia Brava. Fonte: Marinha do Brasil.',
    keywords: ['maré itajaí hoje', 'tabua maré itajaí 2026', 'maré alta itajaí', 'porto de itajaí maré', 'maré praia brava itajaí', 'maré balneário camboriú', 'maré navegantes sc', 'horário maré itajaí amanhã'],
    praias: ['Praia Brava', 'Cabeçudas', 'Geremias', 'Atalaia'],
    category: 'industrial',
    portoVizinhos: ['porto-de-sao-francisco-do-sul', 'porto-de-florianopolis', 'porto-de-imbituba'],
    faqs: [
      { q: 'Por que o Porto de Itajaí é sensível às chuvas no Vale do Itajaí?', a: 'O porto fica na foz do Rio Itajaí-Açu, então o volume de chuva na bacia se soma à maré astronômica. Em períodos de cheia, a corrente de vazante pode ficar forte o suficiente para exigir paralisação de manobras na barra por segurança.' },
      { q: 'Qual o melhor horário para surfar na Praia Brava (Itajaí)?', a: 'A maré baixa a média costuma estabilizar os bancos de areia e favorecer picos mais tubulares. Prefira as 2 horas ao redor da baixamar, especialmente com swell de quadrante sul.' },
      { q: 'Como a maré afeta as operações de contêineres no porto?', a: 'Itajaí é um dos maiores portos de contêineres da América do Sul, e navios de grande calado dependem da maré alta para navegar com segurança no canal de acesso, formado pelo encontro do rio com o mar.' },
      { q: 'Os dados servem para navegação comercial no porto?', a: 'Não. Os dados do MaréAgora são referência para atividades recreativas. Para navegação de calado considerável, use sempre as tábuas oficiais publicadas pela Marinha do Brasil (CHM).' },
      { q: 'A maré de Itajaí é igual à de Balneário Camboriú e Navegantes?', a: 'É muito próxima — as três cidades ficam na mesma foz e usam Itajaí como referência. As diferenças de horário costumam ser de poucos minutos, mas a correnteza do rio afeta mais diretamente a região central de Itajaí.' },
    ],
  },

  'porto-de-salvador': {
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

  'porto-de-sao-sebastiao': {
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

  'porto-de-suape': {
    titleSuffix: 'Horários e Coeficientes Oficiais',
    description: 'Tábua de marés do Porto de Suape (PE) para hoje e 2026. Horários de maré alta e baixa, coeficientes oficiais da Marinha do Brasil para operações portuárias, pesca e as praias vizinhas de Porto de Galinhas e Muro Alto.',
    keywords: ['maré suape', 'maré suape hoje', 'maré porto de suape', 'tabua de marés suape', 'tabua maré suape 2026', 'horário maré suape hoje', 'maré suape pe', 'maré ipojuca', 'maré suape pesca', 'maré muro alto'],
    praias: ['Muro Alto', 'Nazaré', 'Porto de Galinhas', 'Maracaípe', 'Cupe'],
    category: 'industrial',
    portoVizinhos: ['porto-do-recife', 'porto-de-galinhas'],
    faqs: [
      { q: 'Como a maré afeta as operações no Porto de Suape?', a: 'O calado operacional do canal varia com a maré, sendo essencial para o planejamento de atracação de navios de grande porte. O canal interno foi ampliado para 16,2m, com praticagem obrigatória para as manobras na Zona 14.' },
      { q: 'Qual o melhor horário de maré para visitar Muro Alto e Porto de Galinhas, perto de Suape?', a: 'A maré baixa é ideal para acessar as piscinas naturais formadas pelos recifes de arenito. Chegue pelo menos 1 hora antes da baixamar para aproveitar o acesso e a água mais cristalina.' },
      { q: 'As marés de Suape servem para navegação comercial?', a: 'Os dados apresentados são referência baseada nas tábuas oficiais da Marinha do Brasil (DHN/CHM), mas para operações portuárias e navegação comercial, sempre consulte a Autoridade Portuária de Suape e a praticagem local.' },
    ],
  },

  'porto-de-galinhas': {
    titleSuffix: 'Horário das Piscinas Naturais Hoje',
    description: 'Tábua de maré de Porto de Galinhas (PE) para hoje e 2026. Horário da maré baixa para as piscinas naturais, passeio de jangada e mergulho. Fonte: Marinha do Brasil (estação de referência Suape).',
    keywords: ['maré porto de galinhas', 'maré porto de galinhas hoje', 'tábua de maré porto de galinhas', 'maré baixa porto de galinhas', 'horário piscinas naturais porto de galinhas', 'tabua de mare porto de galinhas 2026', 'maré cupe', 'maré maracaípe'],
    praias: ['Porto de Galinhas', 'Muro Alto', 'Cupe', 'Maracaípe', 'Serrambi'],
    category: 'turismo',
    portoVizinhos: ['porto-de-suape', 'porto-do-recife'],
    faqs: [
      { q: 'Qual o melhor horário para visitar as piscinas naturais de Porto de Galinhas?', a: 'O ideal é a maré baixa, de preferência abaixo de 0,5m. Chegue cerca de 1h30 antes do horário da baixamar para aproveitar mais tempo com os recifes expostos e a água calma.' },
      { q: 'A maré afeta o passeio de jangada em Porto de Galinhas?', a: 'Sim. As jangadas só conseguem levar os visitantes até as piscinas naturais quando a maré está baixa. Em maré alta, os recifes ficam cobertos e o passeio não é realizado.' },
      { q: 'Por que Porto de Galinhas usa a tábua de maré de Suape?', a: 'Porto de Galinhas fica a poucos quilômetros de Suape e não tem estação maregráfica própria da Marinha, então usa Suape como estação de referência, com os mesmos horários de maré.' },
    ],
  },

  'muro-alto': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Piscina Natural e Resorts',
    description: 'Tábua de maré de Muro Alto (Ipojuca, PE) para hoje e 2026. Horário da maré baixa para a piscina natural formada pelos recifes em frente aos resorts. Fonte: Marinha do Brasil (estação de Suape).',
    keywords: ['maré muro alto', 'maré muro alto hoje', 'tábua de maré muro alto', 'maré muro alto ipojuca', 'horário maré muro alto', 'piscina natural muro alto maré'],
    praias: ['Muro Alto', 'Cupe', 'Suape'],
    category: 'turismo',
    portoVizinhos: ['porto-de-suape', 'porto-de-galinhas', 'cupe'],
    faqs: [
      { q: 'Qual o melhor horário de maré para a piscina natural de Muro Alto?', a: 'A maré baixa é o momento ideal — os recifes em frente à praia formam uma piscina natural extensa e calma, protegida das ondas do mar aberto.' },
      { q: 'A praia de Muro Alto diminui muito na maré alta?', a: 'Sim, a faixa de areia fica bem mais estreita na preamar, e as ondas se aproximam mais dos bares e resorts à beira-mar.' },
    ],
  },

  'cupe': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Pontal e Piscinas Naturais',
    description: 'Tábua de maré do Cupe (Ipojuca, PE) para hoje e 2026. Horário da maré baixa para o Pontal do Cupe e suas piscinas naturais, entre Muro Alto e Porto de Galinhas. Fonte: Marinha do Brasil (estação de Suape).',
    keywords: ['maré cupe', 'maré cupe hoje', 'tábua de maré cupe', 'praia do cupe maré', 'pontal do cupe maré baixa', 'maré cupe ipojuca'],
    praias: ['Cupe', 'Muro Alto', 'Porto de Galinhas'],
    category: 'turismo',
    portoVizinhos: ['muro-alto', 'porto-de-galinhas'],
    faqs: [
      { q: 'Qual o melhor horário de maré para visitar o Pontal do Cupe?', a: 'Na maré baixa, os recifes ficam expostos e formam piscinas naturais tranquilas, ideais para banho e observação de peixes.' },
    ],
  },

  'maracaipe': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Surf e Piscinas Naturais',
    description: 'Tábua de maré de Maracaípe (Ipojuca, PE) para hoje e 2026. Horários para o surf na praia e as piscinas naturais do Pontal de Maracaípe na maré baixa. Fonte: Marinha do Brasil (estação de Suape).',
    keywords: ['maré maracaípe', 'maré maracaípe hoje', 'tábua de maré maracaípe', 'surf maracaípe maré', 'pontal de maracaípe maré', 'maré maracaipe porto de galinhas'],
    praias: ['Maracaípe', 'Porto de Galinhas', 'Serrambi'],
    category: 'surf',
    portoVizinhos: ['porto-de-galinhas', 'serrambi'],
    faqs: [
      { q: 'Qual a melhor maré para surfar em Maracaípe?', a: 'A maré alta a média costuma trazer as ondas mais consistentes para o surf. Em maré muito baixa, os bancos de areia expostos podem atrapalhar as séries.' },
      { q: 'Quando aparecem as piscinas naturais do Pontal de Maracaípe?', a: 'Somente na maré baixa, na foz do rio Maracaípe, onde se formam poças calmas entre recifes e manguezais.' },
    ],
  },

  'serrambi': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Piscinas Naturais e Recifes',
    description: 'Tábua de maré de Serrambi (Ipojuca, PE) para hoje e 2026. Horário da maré baixa para as piscinas naturais da Ponta de Serrambi. Fonte: Marinha do Brasil (estação de Suape).',
    keywords: ['maré serrambi', 'maré serrambi hoje', 'tábua de maré serrambi', 'ponta de serrambi maré', 'piscinas naturais serrambi maré baixa'],
    praias: ['Serrambi', 'Maracaípe'],
    category: 'turismo',
    portoVizinhos: ['maracaipe', 'porto-de-galinhas'],
    faqs: [
      { q: 'Qual o horário ideal para as piscinas naturais de Serrambi?', a: 'Assim como nas demais praias da região, a maré baixa é o momento em que os recifes ficam expostos e formam piscinas calmas e cristalinas.' },
    ],
  },

  'gaibu': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Surf e Praia',
    description: 'Tábua de maré de Gaibu (Cabo de Santo Agostinho, PE) para hoje e 2026. Horários de maré alta e baixa para surf, pesca e praia. Fonte: Marinha do Brasil (estação de Suape).',
    keywords: ['maré gaibu', 'maré gaibu hoje', 'tábua de maré gaibu', 'surf gaibu maré', 'maré gaibu cabo de santo agostinho'],
    praias: ['Gaibu', 'Calhetas'],
    category: 'surf',
    portoVizinhos: ['calhetas', 'porto-de-suape'],
    faqs: [
      { q: 'Gaibu é uma boa praia para surfar?', a: 'Sim, é um dos pontos de surf mais conhecidos do Cabo de Santo Agostinho. A maré média costuma formar as melhores ondas.' },
    ],
  },

  'calhetas': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Mergulho e Passeio de Barco',
    description: 'Tábua de maré de Calhetas (Cabo de Santo Agostinho, PE) para hoje e 2026. Horários de maré para mergulho, passeio de barco e banho na enseada calma. Fonte: Marinha do Brasil (estação de Suape).',
    keywords: ['maré calhetas', 'maré calhetas hoje', 'tábua de maré calhetas', 'praia de calhetas maré', 'maré calhetas cabo de santo agostinho'],
    praias: ['Calhetas', 'Gaibu'],
    category: 'turismo',
    portoVizinhos: ['gaibu', 'porto-de-suape'],
    faqs: [
      { q: 'A maré afeta o mergulho em Calhetas?', a: 'Sim. Águas mais calmas e claras costumam ocorrer na maré baixa a média, quando a enseada fica mais protegida.' },
    ],
  },

  'praia-do-paiva': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Praia e Reserva do Paiva',
    description: 'Tábua de maré da Praia do Paiva (Cabo de Santo Agostinho, PE) para hoje e 2026. Horários de maré para praia, caminhada na orla e a Reserva do Paiva. Fonte: Marinha do Brasil (estação de Suape).',
    keywords: ['maré praia do paiva', 'maré paiva hoje', 'tábua de maré paiva', 'maré paiva pernambuco', 'reserva do paiva maré'],
    praias: ['Praia do Paiva', 'Gaibu'],
    category: 'turismo',
    portoVizinhos: ['gaibu', 'calhetas'],
    faqs: [
      { q: 'Qual o melhor horário de maré para caminhar na orla do Paiva?', a: 'A maré baixa deixa uma faixa de areia mais larga e compactada, ideal para caminhadas e corrida na praia.' },
    ],
  },

  'farol-de-nazare': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Pesca e Vila de Nazaré',
    description: 'Tábua de maré do Farol de Nazaré, em Suape (PE), para hoje e 2026. Horários de maré para pesca artesanal na Vila de Nazaré e passeios na entrada do porto. Fonte: Marinha do Brasil.',
    keywords: ['maré farol de nazaré', 'farol de nazaré maré hoje', 'tábua de maré farol de nazaré', 'maré vila de nazaré suape', 'maré nazaré ipojuca'],
    praias: ['Farol de Nazaré', 'Suape'],
    category: 'pesca',
    portoVizinhos: ['porto-de-suape', 'muro-alto'],
    faqs: [
      { q: 'Por que o Farol de Nazaré usa os mesmos horários de maré de Suape?', a: 'Porque fica bem na entrada do complexo portuário de Suape, a poucos quilômetros da estação de referência da Marinha do Brasil.' },
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

  'terminal-de-barra-do-riacho': {
    seoName: 'Barra do Riacho',
    titleSuffix: 'Horários de Hoje',
    description: 'Tábua de marés de Barra do Riacho e Regência (ES) para hoje e 2026. Horários ideais para o point break de Regência, pesca e operações no terminal. Fonte: Marinha do Brasil.',
    keywords: ['maré barra do riacho hoje', 'maré regência es', 'tabua maré barra do riacho 2026', 'surf regência maré', 'maré aracruz es', 'point break regência', 'pesca barra do riacho maré'],
    praias: ['Barra do Riacho', 'Regência', 'Povoação'],
    category: 'surf',
    portoVizinhos: ['porto-de-vitoria', 'guarapari', 'linhares'],
    faqs: [
      { q: 'Qual o melhor horário de maré para surfar em Regência?', a: 'Regência tem um dos point breaks mais longos do Brasil, na foz do Rio Doce. A maré média a baixa costuma alinhar melhor a onda ao longo do banco; evite a maré cheia, que tende a fechar a formação da onda.' },
      { q: 'A maré de Barra do Riacho é a mesma de Regência?', a: 'Sim, praticamente idêntica — as duas praias ficam a poucos quilômetros uma da outra, na mesma foz, e usam a mesma referência de estação de maré.' },
      { q: 'Como a maré afeta o Terminal de Barra do Riacho?', a: 'O terminal opera embarques de celulose e depende da maré alta para navios de grande calado acessarem o canal com segurança, assim como outros portos da região Sudeste.' },
    ],
  },

  'porto-de-tutoia': {
    titleSuffix: 'Delta do Parnaíba Hoje',
    description: 'Tábua de marés de Tutóia (MA) para hoje e 2026. Horários essenciais para passeios de barco pelo Delta do Parnaíba, acesso aos Lençóis Maranhenses e pesca nos igarapés. Fonte: Marinha do Brasil.',
    keywords: ['maré tutóia hoje', 'tabua maré tutóia 2026', 'delta do parnaíba maré', 'lençóis maranhenses barco maré', 'passeio delta das américas maré', 'maré igarapés tutóia', 'pesca tutóia maré'],
    praias: ['Tutóia', 'Caburé', 'Delta do Parnaíba'],
    category: 'turismo',
    portoVizinhos: ['porto-de-luis-correia', 'barreirinhas', 'paulino-neves'],
    faqs: [
      { q: 'Qual o melhor horário de maré para o passeio de barco no Delta do Parnaíba?', a: 'Prefira sair próximo da maré alta ou logo depois dela. Na maré baixa, muitos igarapés e canais do delta secam rapidamente, o que pode encalhar embarcações ou impedir o acesso a certos trechos.' },
      { q: 'A maré afeta o acesso aos Lençóis Maranhenses saindo de Tutóia?', a: 'Sim. A travessia por Caburé e os canais que dão acesso às dunas dependem do nível da maré. Barqueiros locais costumam ajustar o horário de saída conforme a tábua do dia.' },
      { q: 'É seguro navegar pelos igarapés na maré vazante?', a: 'Requer atenção. A vazante pode expor bancos de areia e deixar canais estreitos demais para embarcações maiores. Piloteiros experientes usam a tábua de marés para planejar a rota de ida e volta com segurança.' },
    ],
  },

  'sao-luis': {
    highlight: 'amplitude',
    titleSuffix: 'Maré Alta e Baixa Hoje',
    description: 'Veja a previsão de maré de São Luís (MA) em 2026: horários de premar e baixa-mar, altura das águas e as próximas 48 horas, com dados oficiais da Marinha do Brasil. Confira os horários.',
    keywords: ['maré são luís hoje', 'tabua maré são luís 2026', 'maré alta são luís', 'maré baixa são luís', 'horário maré são luís', 'golfão maranhense maré', 'maré praia do calhau'],
    praias: ['Calhau', 'São Marcos', 'Ponta d’Areia', 'Olho d’Água', 'Praia do Meio'],
    category: 'turismo',
    portoVizinhos: ['porto-de-itaqui', 'porto-de-tutoia'],
    faqs: [
      { q: 'Qual o melhor horário de maré em São Luís?', a: 'As melhores janelas são nas 2 horas ao redor da maré alta e da maré baixa. No Golfão Maranhense, a amplitude é grande e o mar avança muito entre a vazante e a enchente.' },
      { q: 'Por que o mar recua tanto em São Luís?', a: 'São Luís está situada no Golfão Maranhense, uma baía com afunilamento geográfico que amplifica naturalmente a maré semidiurna. Nas marés de sizígia (luas cheia e nova), a amplitude vertical pode ultrapassar 7 metros, fazendo a água recuar centenas de metros e expondo uma vasta faixa de areia.' },
      { q: 'Por que a maré de São Luís muda tanto de um dia para o outro?', a: 'A maré em São Luís segue o ciclo lunar (~24h50min), o que faz os horários de preamar e baixamar avançarem cerca de 50 minutos a cada dia, variando a amplitude conforme a fase da lua.' },
      { q: 'Posso tomar banho de mar em São Marcos na maré alta?', a: 'As condições de correnteza, arrebentação e ressaca na Praia de São Marcos variam de acordo com a maré e o vento. Recomenda-se atenção redobrada aos canais de maré, respeitar a sinalização de bandeiras na orla e seguir sempre as orientações dos guarda-vidas locais.' },
      { q: 'A maré de São Luís é forte para pesca?', a: 'Sim. A grande movimentação de água na enchente e vazante gera correntes fortes no Golfão. A virada da maré costuma ser o período mais produtivo para a pesca costeira.' },
    ],
  },

  // Busca real no Search Console: 100% das consultas são "maceió" (tabua de mare maceio, mare maceio...),
  // nenhuma com "porto". O slug é do porto (estação da Marinha), mas o título deve casar com a busca.
  'porto-de-maceio': {
    seoName: 'Maceió',
    highlight: 'piscinas-naturais',
    titleSuffix: 'Horários de Hoje',
    description: 'Tábua de marés de Maceió (AL) hoje e 2026: maré alta e baixa, coeficiente e melhor horário para as piscinas naturais da Pajuçara. Dados da Marinha do Brasil.',
    keywords: ['tábua de maré maceió', 'tabua de mare maceio', 'maré maceió hoje', 'maré pajuçara', 'piscinas naturais pajuçara maré', 'maré ponta verde', 'maré jatiúca', 'tábua da maré maceió 2026'],
    praias: ['Pajuçara', 'Ponta Verde', 'Jatiúca', 'Cruz das Almas', 'Garça Torta', 'Riacho Doce'],
    category: 'turismo',
    portoVizinhos: ['maragogi', 'porto-de-suape', 'terminal-maritimo-inacio-barbosa'],
    faqs: [
      { q: 'Qual o melhor horário para ir às piscinas naturais da Pajuçara?', a: 'O melhor momento costuma ser perto da baixamar, quando o nível do mar recua e a bancada de recifes fica mais exposta e protegida. Acompanhe a tábua de marés do dia e confirme sempre as condições de embarque com os jangadeiros locais na praia da Pajuçara antes de sair.' },
      { q: 'A maré da Ponta Verde é igual à de Maragogi?', a: 'Ambas seguem a mesma estação de referência oficial do Porto de Maceió (DHN), compartilhando o padrão de maré de Alagoas. Contudo, devido à distância de cerca de 130 km pela costa, os horários exatos de preamar e baixamar podem variar alguns minutos entre as duas praias.' },
      { q: 'De onde vêm os horários de maré de Maceió?', a: 'Os horários seguem a estação do Porto de Maceió, publicada pela Marinha do Brasil (CHM), e valem como referência para as praias da cidade, como Pajuçara, Ponta Verde e Jatiúca.' },
      { q: 'O que é coeficiente de maré?', a: 'Número de 20 a 120 que indica a intensidade da maré. Acima de 70 são marés vivas, com grande variação de nível; abaixo de 45 são marés mortas, com pouca variação.' },
      { q: 'Os dados servem para navegação?', a: 'Não. Os dados do MaréAgora são referência para atividades recreativas. Para navegação oficial, consulte sempre as tábuas publicadas pela Marinha do Brasil (CHM).' },
    ],
  },

  // Consultas reais: "tabua de mare mosqueiro", "mare mosqueiro" (sem "Ilha do").
  'ilha-do-mosqueiro': {
    seoName: 'Mosqueiro',
    titleSuffix: 'Praias e Horários de Hoje',
    description: 'Tábua de marés de Mosqueiro (PA) hoje e 2026: horários de maré alta e baixa para planejar a ida às praias do Farol, Chapéu Virado e Murubira. Fonte: Marinha do Brasil.',
    keywords: ['maré mosqueiro', 'tábua de maré mosqueiro', 'maré mosqueiro hoje', 'maré em mosqueiro', 'maré praia do farol mosqueiro', 'maré chapéu virado', 'tabua de mare mosqueiro 2026'],
    praias: ['Farol', 'Chapéu Virado', 'Murubira', 'Paraíso'],
    category: 'turismo',
    portoVizinhos: ['porto-de-belem', 'porto-de-vila-do-conde'],
    faqs: [
      { q: 'A maré faz diferença nas praias de Mosqueiro?', a: 'Sim. Em Mosqueiro a faixa de areia aparece muito mais na maré baixa e diminui bastante na maré alta, então vale conferir o horário antes de ir à praia.' },
      { q: 'De onde vêm os horários de maré de Mosqueiro?', a: 'Os horários seguem os dados publicados pela Marinha do Brasil (CHM) para a região da Ilha do Mosqueiro.' },
      { q: 'O que é coeficiente de maré?', a: 'Número de 20 a 120 que indica a intensidade da maré. Acima de 70 são marés vivas, com grande variação de nível; abaixo de 45 são marés mortas, com pouca variação.' },
      { q: 'Os dados servem para navegação?', a: 'Não. Os dados do MaréAgora são referência para atividades recreativas. Para navegação oficial, consulte sempre as tábuas publicadas pela Marinha do Brasil (CHM).' },
    ],
  },

  // ── Novas Praias: Litoral de SP & Nordeste ────────────────────────────────

  'caraguatatuba': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Martim de Sá e Praias',
    description: 'Tábua de maré de Caraguatatuba (SP) para hoje e 2026. Horários de maré alta e baixa para Martim de Sá, Cocanha, pesca no Rio Juqueriquerê e navegação. Dados oficiais da Marinha do Brasil (estação São Sebastião).',
    keywords: ['maré caraguatatuba', 'maré caraguatatuba hoje', 'tábua de maré caraguatatuba', 'maré martim de sá', 'maré cocanha', 'maré caraguá'],
    praias: ['Martim de Sá', 'Cocanha', 'Mococa', 'Prainha', 'Indaiá', 'Tabatinga'],
    category: 'turismo',
    portoVizinhos: ['porto-de-sao-sebastiao', 'ubatuba', 'juquehy'],
    faqs: [
      { q: 'Qual o melhor horário de maré para caminhar no Indaiá e Prainha?', a: 'Na maré baixa, a faixa de areia do Indaiá e praias centrais alarga-se por dezenas de metros com piso firme para caminhadas e esportes.' },
      { q: 'A maré afeta as ondas na Praia Martim de Sá?', a: 'Sim. Por ser praia de tombo, a maré cheia aproxima as ondas da calçada com repuxo mais forte; na maré média a baixa as ondas quebram mais afastadas.' },
      { q: 'De onde vêm os dados de maré de Caraguatatuba?', a: 'Seguem a estação maregráfica oficial do Porto de São Sebastião (DHN), que regula a hidrodinâmica do canal e da enseada de Caraguatatuba.' },
    ],
  },

  'juquehy': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Surf e Família',
    description: 'Tábua de maré de Juquehy (São Sebastião, SP) para hoje e 2026. Horários de maré para o surf no canto direito e banho calmo no canto esquerdo. Dados oficiais da Marinha do Brasil.',
    keywords: ['maré juquehy', 'maré juquehy hoje', 'tábua de maré juquehy', 'surf juquehy maré', 'maré praia de juquehy', 'maré são sebastião juquehy'],
    praias: ['Juquehy', 'Praia da Baleia', 'Barra do Sahy'],
    category: 'surf',
    portoVizinhos: ['praia-da-baleia', 'camburi', 'porto-de-sao-sebastiao'],
    faqs: [
      { q: 'Qual a melhor maré para surfar em Juquehy?', a: 'O canto direito funciona melhor com maré seca a média e ondulação de sul/sudeste, quando as ondas ganham forma e quebram com melhor pressão.' },
      { q: 'Qual o melhor horário para banho com crianças em Juquehy?', a: 'No canto esquerdo, próximo ao rio, a maré baixa deixa o mar muito raso, límpido e sem ondas, perfeito para famílias com crianças pequenas.' },
      { q: 'A maré de Juquehy é a mesma de São Sebastião?', a: 'Sim, Juquehy utiliza a tábua de São Sebastião (DHN) como referência direta de mar aberto, sem defasagem perceptível.' },
    ],
  },

  'praia-da-baleia': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Caminhadas e Mar Calmo',
    description: 'Tábua de maré da Praia da Baleia (São Sebastião, SP) para hoje e 2026. Horários de maré baixa para caminhadas na areia dura e banho de mar calmo. Dados oficiais da Marinha do Brasil.',
    keywords: ['maré praia da baleia', 'maré baleia sp', 'tábua de maré praia da baleia', 'maré são sebastião baleia'],
    praias: ['Praia da Baleia', 'Juquehy', 'Barra do Sahy'],
    category: 'turismo',
    portoVizinhos: ['juquehy', 'camburi', 'porto-de-sao-sebastiao'],
    faqs: [
      { q: 'Por que a maré baixa é famosa na Praia da Baleia?', a: 'Porque o recuo da maré revela uma extensa e plana faixa de areia batida, excelente para corrida, caminhadas longas e pedaladas à beira-mar.' },
      { q: 'O mar da Baleia é calmo na maré cheia?', a: 'O canto sul abrigado mantém-se calmo na maior parte do tempo, enquanto o trecho central ganha pequenas ondas suaves ideais para iniciantes no surf.' },
    ],
  },

  'camburi': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Surf e Ondas',
    description: 'Tábua de maré de Camburi e Camburizinho (São Sebastião, SP) para hoje e 2026. Horários ideais de maré baixa a média para o surf nas bancadas tubulares. Fonte: Marinha do Brasil.',
    keywords: ['maré camburi', 'maré camburi hoje', 'tábua de maré camburi', 'surf camburi maré', 'maré camburizinho', 'ondas camburi'],
    praias: ['Camburi', 'Camburizinho', 'Baleia', 'Boiçucanga'],
    category: 'surf',
    portoVizinhos: ['praia-da-baleia', 'juquehy', 'maresias'],
    faqs: [
      { q: 'Qual a maré ideal para surfar em Camburi?', a: 'A maré baixa a média costuma produzir as melhores ondas tubulares no meio da praia e no canto esquerdo. Na maré cheia a quebra fica mais pesada na beira.' },
      { q: 'É perigoso nadar em Camburi na maré alta?', a: 'Sim, a arrebentação é forte (praia de tombo) e há correntes de retorno acentuadas. Banhistas que buscam calmaria devem preferir a foz do rio ou Camburizinho.' },
    ],
  },

  'praia-do-tombo': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Surf Bandeira Azul',
    description: 'Tábua de maré da Praia do Tombo (Guarujá, SP) para hoje e 2026. Horários de maré e condições para o surf de alta performance na única praia Bandeira Azul de SP. Dados oficiais da Marinha do Brasil.',
    keywords: ['maré praia do tombo', 'maré tombo guarujá', 'tábua de maré praia do tombo', 'surf praia do tombo', 'maré tombo hoje'],
    praias: ['Praia do Tombo', 'Astúrias', 'Pitangueiras'],
    category: 'surf',
    portoVizinhos: ['guaruja', 'porto-de-santos', 'sao-vicente'],
    faqs: [
      { q: 'Qual o comportamento da maré na Praia do Tombo?', a: 'Por ter fundo arenoso com declive acentuado, a maré baixa deixa os tubos rápidos e cavados; na maré cheia o shorebreak quebra com forte impacto na rampa de areia.' },
      { q: 'A Praia do Tombo tem correnteza forte?', a: 'Sim. Há presença constante de valas e repuxo severo. A praia é vigiada permanentemente pelo Corpo de Bombeiros e exige atenção constante de banhistas.' },
    ],
  },

  'itaguare': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Ecoturismo e Surf',
    description: 'Tábua de maré de Itaguaré (Bertioga, SP) para hoje e 2026. Horários para banho na foz do Rio Itaguaré e surf na praia selvagem. Fonte oficial: Marinha do Brasil (+15 min de Santos).',
    keywords: ['maré itaguaré', 'maré itaguare bertioga', 'tábua de maré itaguaré', 'rio itaguare maré', 'maré itaguare hoje'],
    praias: ['Itaguaré', 'Riviera de São Lourenço', 'Guaratuba'],
    category: 'pesca',
    portoVizinhos: ['riviera-de-sao-lourenco', 'bertioga', 'porto-de-santos'],
    faqs: [
      { q: 'Qual a melhor maré para tomar banho no Rio Itaguaré?', a: 'A maré baixa é perfeita: o encontro do rio com a areia forma piscinas rasas e límpidas de água morna, excelentes para relaxar e praticar stand-up paddle.' },
      { q: 'Por que Itaguaré tem +15 minutos de defasagem?', a: 'Itaguaré segue a hidrodinâmica da enseada de Bertioga, onde a propagação da onda de maré da Marinha do Brasil atinge o pico 15 minutos após o Porto de Santos.' },
    ],
  },

  'porto-seguro': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Recife de Fora e Praias',
    description: 'Tábua de maré de Porto Seguro (BA) para hoje e 2026. Horário da maré baixa para as piscinas do Recife de Fora, Taperapuã, Mutá e passeios de escuna. Fonte: Marinha do Brasil (estação Ilhéus).',
    keywords: ['maré porto seguro', 'maré porto seguro hoje', 'tábua de maré porto seguro', 'maré recife de fora', 'maré taperapuã', 'tábua da maré porto seguro 2026'],
    praias: ['Taperapuã', 'Praia do Mutá', 'Ponta Grande', 'Mundaim'],
    category: 'turismo',
    portoVizinhos: ['arraial-dajuda', 'trancoso', 'porto-de-ilheus'],
    faqs: [
      { q: 'Qual o melhor horário de maré para o Recife de Fora?', a: 'O passeio só acontece na maré baixa, idealmente abaixo de 0,4 metros durante as luas nova e cheia (sizígia), quando os recifes emergem formando piscinas transparentes.' },
      { q: 'Quais as melhores praias de Porto Seguro para banho calmo?', a: 'A Praia do Mutá e a Ponta Grande são protegidas por corais e oferecem piscinas mornas e sem ondas, especialmente na maré baixa.' },
    ],
  },

  'arraial-dajuda': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Piscinas Naturais e Falésias',
    description: 'Tábua de maré de Arraial d\'Ajuda (Porto Seguro, BA) para hoje e 2026. Horários da maré baixa para as piscinas do Mucugê, Parracho e caminhada pelas falésias de Pitinga e Taípe. Fonte: Marinha do Brasil.',
    keywords: ['maré arraial dajuda', 'maré arraial d\'ajuda hoje', 'tábua de maré arraial dajuda', 'maré mucugê arraial', 'maré pitinga'],
    praias: ['Mucugê', 'Parracho', 'Pitinga', 'Taípe', 'Araçaípe'],
    category: 'turismo',
    portoVizinhos: ['porto-seguro', 'trancoso', 'porto-de-ilheus'],
    faqs: [
      { q: 'Quando aparecem as piscinas naturais em Arraial d\'Ajuda?', a: 'Na maré baixa, principalmente na Praia do Mucugê e Parracho, quando os recifes retêm águas mornas e calmas repletas de peixes.' },
      { q: 'É seguro caminhar pela praia até Taípe e Trancoso?', a: 'A caminhada só deve ser feita durante a maré vazante e baixa. Na maré cheia, as ondas batem na base das falésias e bloqueiam a passagem.' },
    ],
  },

  'itacare': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Surf e Praias',
    description: 'Tábua de maré de Itacaré (BA) para hoje e 2026. Horários de maré para o surf na Tiririca, Resende e Engenhoca, e banho calmo na Praia da Concha. Dados da Marinha do Brasil.',
    keywords: ['maré itacaré', 'maré itacaré hoje', 'tábua de maré itacaré', 'surf itacaré maré', 'maré praia da concha', 'maré tiririca itacaré'],
    praias: ['Tiririca', 'Resende', 'Praia da Concha', 'Ribeira', 'Prainha', 'Itacarezinho'],
    category: 'surf',
    portoVizinhos: ['porto-de-ilheus', 'taipu-de-fora', 'morro-de-sao-paulo'],
    faqs: [
      { q: 'Qual a melhor maré para surfar na Praia da Tiririca?', a: 'A maré seca a média proporciona ondas cavadas e tubulares com maior velocidade e potência.' },
      { q: 'Qual praia de Itacaré é indicada para banho calmo?', a: 'A Praia da Concha, na foz do Rio de Contas, tem águas tranquilas e sem ondas, ideais para stand-up paddle e banho familiar.' },
    ],
  },

  'taipu-de-fora': {
    titleSuffix: 'Maré Baixa Hoje — Piscinas Naturais de Maraú',
    description: 'Tábua de maré de Taipu de Fora (Península de Maraú, BA) hoje e 2026. Horário exato da maré baixa para snorkel nas piscinas naturais de corais. Dados da Marinha do Brasil.',
    keywords: ['maré taipu de fora', 'maré taipu de fora hoje', 'tábua de maré taipu de fora', 'piscinas naturais taipu de fora maré', 'maré barra grande marau'],
    praias: ['Taipu de Fora', 'Barra Grande', 'Três Coqueiros', 'Saquaíra'],
    category: 'turismo',
    portoVizinhos: ['itacare', 'ilha-de-boipeba', 'porto-de-ilheus'],
    faqs: [
      { q: 'Qual o horário ideal para ver as piscinas naturais de Taipu de Fora?', a: 'Rigorosamente na maré baixa (abaixo de 0,3 metros), nas luas cheia ou nova. Chegue cerca de 1 hora antes do pico da baixamar para aproveitar a água límpida.' },
      { q: 'O que acontece na maré cheia em Taipu de Fora?', a: 'Na maré alta, as ondas ultrapassam a barreira de corais e o mar vira aberto com quebra forte, inviabilizando o snorkel.' },
    ],
  },

  'farol-da-barra': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Pôr do Sol e Piscinas',
    description: 'Tábua de maré do Farol da Barra (Salvador, BA) para hoje e 2026. Horários de maré baixa para as piscinas dos arrecifes e maré alta para surf no Cristo. Fonte oficial: Marinha do Brasil.',
    keywords: ['maré farol da barra', 'maré farol da barra hoje', 'tábua de maré farol da barra', 'maré porto da barra', 'maré barra salvador'],
    praias: ['Farol da Barra', 'Porto da Barra', 'Praia do Cristo'],
    category: 'turismo',
    portoVizinhos: ['porto-de-salvador', 'itapua', 'morro-de-sao-paulo'],
    faqs: [
      { q: 'Como a maré afeta o banho no Farol da Barra?', a: 'Na maré baixa, os arrecifes em frente ao farol formam piscinas naturais rasas e mornas; na maré alta, as ondas quebram sobre as pedras e o mar ganha força.' },
      { q: 'O Porto da Barra tem maré diferente do Farol da Barra?', a: 'Não, ambas compartilham a mesma estação maregráfica oficial do Porto de Salvador (DHN), situada a menos de 5 km.' },
    ],
  },

  'itapua': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Piscinas e Farol',
    description: 'Tábua de maré de Itapuã (Salvador, BA) para hoje e 2026. Horários de maré baixa para as piscinas naturais da Sereia e pesca artesanal na orla. Fonte: Marinha do Brasil.',
    keywords: ['maré itapuã', 'maré itapuã hoje', 'tábua de maré itapuã', 'maré farol de itapuã', 'maré praia da sereia salvador'],
    praias: ['Praia de Itapuã', 'Praia da Sereia', 'Farol de Itapuã', 'Placaford'],
    category: 'turismo',
    portoVizinhos: ['farol-da-barra', 'guarajuba', 'porto-de-salvador'],
    faqs: [
      { q: 'Onde se formam piscinas naturais em Itapuã?', a: 'Na maré baixa, as bancadas de arrecifes em frente à estátua da Sereia e ao Farol de Itapuã criam poças calmas de água transparente ideais para banho.' },
      { q: 'A pesca em Itapuã depende da maré?', a: 'Sim. Os pescadores e jangadeiros da colônia Z-6 aproveitam a maré enchente para retornar da pesca costeira com mais segurança.' },
    ],
  },

  'guarajuba': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Piscinas Naturais e Surf',
    description: 'Tábua de maré de Guarajuba (Camaçari, BA) para hoje e 2026. Horário da maré baixa para as piscinas de corais e maré cheia para surf no Canto das Caravelas. Dados da Marinha do Brasil.',
    keywords: ['maré guarajuba', 'maré guarajuba hoje', 'tábua de maré guarajuba', 'piscinas naturais guarajuba maré', 'maré praia de guarajuba'],
    praias: ['Guarajuba', 'Itacimirim', 'Praia do Forte'],
    category: 'turismo',
    portoVizinhos: ['praia-do-forte', 'itapua', 'porto-de-salvador'],
    faqs: [
      { q: 'Qual a melhor maré para famílias em Guarajuba?', a: 'A maré baixa é ideal: as barreiras de corais na parte central formam piscinas cristalinas, mornas e sem ondas.' },
      { q: 'Onde surfar em Guarajuba?', a: 'No Canto das Caravelas (norte), o mar é aberto e a maré média a cheia oferece ondas consistentes para surf e bodyboard.' },
    ],
  },

  'ilha-de-boipeba': {
    titleSuffix: 'Maré Baixa Hoje — Piscinas de Moreré e Trilhas',
    description: 'Tábua de maré da Ilha de Boipeba (Cairu, BA) para hoje e 2026. Horários da maré baixa para as piscinas naturais de Moreré, Ponta dos Castelhanos e travessia da Cueira. Fonte: Marinha do Brasil.',
    keywords: ['maré boipeba', 'maré boipeba hoje', 'tábua de maré boipeba', 'piscinas naturais moreré maré', 'maré moreré', 'maré ilha de boipeba'],
    praias: ['Moreré', 'Cueira', 'Boca da Barra', 'Ponta dos Castelhanos', 'Tassimirim'],
    category: 'turismo',
    portoVizinhos: ['morro-de-sao-paulo', 'taipu-de-fora', 'porto-de-salvador'],
    faqs: [
      { q: 'Qual o horário ideal para as piscinas naturais de Moreré?', a: 'Durante a baixamar das luas cheia e nova (maré abaixo de 0,4 metros). Os passeios de barco partem da praia para a barreira de corais.' },
      { q: 'Como a maré influencia as caminhadas em Boipeba?', a: 'A travessia a pé da foz do Rio Oritiguçu (entre a Cueira e Moreré) só é possível na maré baixa com água rasa; na maré alta, barqueiros fazem a travessia.' },
    ],
  },

  'praia-dos-carneiros': {
    titleSuffix: 'Maré Baixa Hoje — Piscinas Naturais e Bancos de Areia',
    description: 'Tábua de maré da Praia dos Carneiros (Tamandaré, PE) para hoje e 2026. Horário exato da maré baixa para as piscinas de recifes, bancos de areia e passeios de catamarã. Fonte: Marinha do Brasil (estação Suape).',
    keywords: ['maré praia dos carneiros', 'maré carneiros hoje', 'tábua de maré carneiros', 'maré baixa praia dos carneiros', 'horário maré carneiros 2026'],
    praias: ['Praia dos Carneiros', 'Tamandaré', 'Boca da Barra'],
    category: 'turismo',
    portoVizinhos: ['tamandare', 'porto-de-suape', 'porto-de-galinhas'],
    faqs: [
      { q: 'Qual a maré ideal para visitar a Praia dos Carneiros?', a: 'A maré mais baixa possível, preferencialmente abaixo de 0,3 metros. Nesse horário, emergem os bancos de areia no estuário do Rio Formoso e as piscinas de corais.' },
      { q: 'O que acontece em Carneiros na maré alta?', a: 'Na maré cheia, as piscinas naturais e bancos de areia ficam completamente submersos e o mar atinge a linha dos coqueiros.' },
    ],
  },

  'tamandare': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Piscinas e Forte',
    description: 'Tábua de maré de Tamandaré (PE) para hoje e 2026. Horários de maré para as piscinas naturais da orla central, Praia de Campas e visitas ao Forte de Santo Inácio. Fonte: Marinha do Brasil.',
    keywords: ['maré tamandaré', 'maré tamandaré hoje', 'tábua de maré tamandaré', 'maré praia de campas', 'piscinas naturais tamandaré'],
    praias: ['Praia de Tamandaré', 'Campas', 'Praia dos Carneiros', 'Boca da Barra'],
    category: 'turismo',
    portoVizinhos: ['praia-dos-carneiros', 'porto-de-suape', 'maragogi'],
    faqs: [
      { q: 'Como é o mar em Tamandaré na maré baixa?', a: 'Graças à barreira de recifes, o mar forma uma imensa piscina rasa de águas mornas e cristalinas, sem ondas, ideal para crianças.' },
      { q: 'Tamandaré usa a tábua de maré de qual porto?', a: 'Utiliza a estação de Suape (DHN), situada a 38 km ao norte, com horários rigorosamente síncronos na costa sul pernambucana.' },
    ],
  },

  'praia-do-frances': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Surf e Piscinas Naturais',
    description: 'Tábua de maré da Praia do Francês (Marechal Deodoro, AL) para hoje e 2026. Horários da maré baixa para as piscinas do lado esquerdo e maré alta para surf no lado direito. Fonte: Marinha do Brasil.',
    keywords: ['maré praia do francês', 'maré praia do frances hoje', 'tábua de maré praia do francês', 'surf praia do francês maré', 'maré marechal deodoro'],
    praias: ['Praia do Francês', 'Saco da Pedra', 'Barra de São Miguel'],
    category: 'surf',
    portoVizinhos: ['porto-de-maceio', 'barra-de-sao-miguel', 'praia-do-gunga'],
    faqs: [
      { q: 'Qual a diferença entre os dois lados da Praia do Francês?', a: 'O lado esquerdo é protegido por recifes e vira uma piscina calminha na maré baixa; o lado direito tem mar aberto com ondas fortes propícias para surf.' },
      { q: 'Qual o melhor horário para snorkel na Praia do Francês?', a: 'Na maré baixa, junto à bancada de recifes do lado esquerdo, quando a visibilidade subaquática atinge seu ponto mais cristalino.' },
    ],
  },

  'barra-de-sao-miguel': {
    titleSuffix: 'Maré Baixa Hoje — Piscinas Naturais e Marina',
    description: 'Tábua de maré da Barra de São Miguel (AL) para hoje e 2026. Horários da maré baixa para as piscinas formadas pela barreira de recifes e travessia para o Gunga. Dados da Marinha do Brasil.',
    keywords: ['maré barra de são miguel', 'maré barra de sao miguel hoje', 'tábua de maré barra de são miguel', 'piscinas naturais barra de são miguel'],
    praias: ['Barra de São Miguel', 'Praia do Gunga', 'Praia Bonita'],
    category: 'turismo',
    portoVizinhos: ['praia-do-frances', 'praia-do-gunga', 'porto-de-maceio'],
    faqs: [
      { q: 'Por que a Barra de São Miguel tem águas tão calmas?', a: 'Porque possui uma muralha natural de recifes de corais paralela à praia que bloqueia as ondas do mar aberto, criando uma lagoa calma na maré baixa.' },
      { q: 'Qual o horário ideal para atravessar para a Praia do Gunga?', a: 'As lanchas e catamarãs operam durante todo o dia, mas a maré baixa oferece o visual mais impressionante dos bancos de areia da lagoa.' },
    ],
  },

  'praia-do-gunga': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Falésias e Lagoa do Roteiro',
    description: 'Tábua de maré da Praia do Gunga (Roteiro, AL) para hoje e 2026. Horários de maré baixa para passeios de buggy até as falésias e banho no encontro da lagoa com o mar. Fonte: Marinha do Brasil.',
    keywords: ['maré praia do gunga', 'maré praia do gunga hoje', 'tábua de maré praia do gunga', 'maré gunga alagoas', 'maré lagoa do roteiro'],
    praias: ['Praia do Gunga', 'Lagoa do Roteiro', 'Barra de São Miguel'],
    category: 'turismo',
    portoVizinhos: ['barra-de-sao-miguel', 'praia-do-frances', 'porto-de-maceio'],
    faqs: [
      { q: 'Qual a vantagem da maré baixa na Praia do Gunga?', a: 'A maré baixa deixa a areia batida para o passeio de buggy até as falésias e forma bancos rasos de água morna onde a lagoa encontra o oceano.' },
      { q: 'A Praia do Gunga tem mar aberto?', a: 'Sim. A ponta da praia é banhada pela Lagoa do Roteiro (mar calmo), enquanto a orla oceânica possui ondas de mar aberto.' },
    ],
  },

  'sao-miguel-dos-milagres': {
    titleSuffix: 'Maré Baixa Hoje — Piscinas Naturais do Toque',
    description: 'Tábua de maré de São Miguel dos Milagres (AL) para hoje e 2026. Horário exato da maré baixa para passeio de jangada às piscinas naturais da Praia do Toque. Fonte oficial: Marinha do Brasil.',
    keywords: ['maré são miguel dos milagres', 'maré milagres hoje', 'tábua de maré são miguel dos milagres', 'maré praia do toque', 'piscinas naturais milagres maré'],
    praias: ['Praia do Toque', 'Porto da Rua', 'Praia do Riacho', 'São Miguel dos Milagres'],
    category: 'turismo',
    portoVizinhos: ['praia-do-patacho', 'maragogi', 'porto-de-maceio'],
    faqs: [
      { q: 'Qual a maré ideal para as piscinas do Toque em Milagres?', a: 'Maré baixa entre 0,1m e 0,4m nas luas cheia ou nova. As jangadas partem da praia e levam cerca de 15 minutos até as bancadas de corais.' },
      { q: 'Por que Milagres depende tanto da tábua de marés?', a: 'Porque os recifes e as piscinas transparentes só ficam visíveis e acessíveis para snorkel na janela de 2 horas ao redor da baixamar.' },
    ],
  },

  'praia-do-patacho': {
    titleSuffix: 'Maré Baixa Hoje — Piscinas Naturais Bandeira Azul',
    description: 'Tábua de maré da Praia do Patacho (Porto de Pedras, AL) para hoje e 2026. Horários da maré baixa quando o mar recua centenas de metros sobre os recifes. Dados oficiais da Marinha do Brasil.',
    keywords: ['maré praia do patacho', 'maré patacho hoje', 'tábua de maré praia do patacho', 'maré porto de pedras', 'piscinas naturais patacho'],
    praias: ['Praia do Patacho', 'Praia da Laje', 'Porto de Pedras'],
    category: 'turismo',
    portoVizinhos: ['sao-miguel-dos-milagres', 'maragogi', 'porto-de-maceio'],
    faqs: [
      { q: 'Como é o recuo da maré na Praia do Patacho?', a: 'Na maré baixa de sizígia, o mar recua centenas de metros, revelando uma imensa planície de areia branca e recifes rasos para caminhar a pé mar adentro.' },
      { q: 'A Praia do Patacho tem estrutura de quiosques?', a: 'Não, o Patacho preserva seu caráter selvagem e ecológico com selo Bandeira Azul. Recomenda-se levar água e recolher todo o resíduo.' },
    ],
  },

  'genipabu': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Dunas e Passeios de Buggy',
    description: 'Tábua de maré de Genipabu (Extremoz, RN) para hoje e 2026. Horários de maré baixa para circulação segura de buggies na orla e banho de mar. Fonte: Marinha do Brasil (estação Natal).',
    keywords: ['maré genipabu', 'maré genipabu hoje', 'tábua de maré genipabu', 'maré dunas de genipabu', 'passeio buggy genipabu maré'],
    praias: ['Genipabu', 'Santa Rita', 'Barra do Rio'],
    category: 'turismo',
    portoVizinhos: ['porto-de-natal', 'maracajau', 'ponta-negra'],
    faqs: [
      { q: 'Como a maré influencia o passeio de buggy em Genipabu?', a: 'Na maré baixa, a areia da praia fica larga e compactada, permitindo a passagem dos veículos à beira-mar entre Genipabu e as praias vizinhas.' },
      { q: 'O banho de mar em Genipabu é calmo?', a: 'A enseada é protegida por recifes baixos, oferecendo banho agradável com ondas moderadas, principalmente na maré baixa.' },
    ],
  },

  'maracajau': {
    titleSuffix: 'Maré Baixa Hoje — Parrachos de Maracajaú',
    description: 'Tábua de maré de Maracajaú (Maxaranguape, RN) para hoje e 2026. Horário da maré baixa para passeios de catamarã e mergulho snorkel nos Parrachos de Maracajaú. Fonte: Marinha do Brasil.',
    keywords: ['maré maracajaú', 'maré maracajau hoje', 'tábua de maré maracajaú', 'maré parrachos de maracajaú', 'mergulho maracajaú maré'],
    praias: ['Parrachos de Maracajaú', 'Praia de Maracajaú', 'Caraúbas'],
    category: 'turismo',
    portoVizinhos: ['genipabu', 'porto-de-natal', 'ponta-negra'],
    faqs: [
      { q: 'Qual a maré necessária para visitar os Parrachos de Maracajaú?', a: 'As lanchas e catamarãs só operam na maré baixa (abaixo de 0,5m nas luas nova e cheia), quando a lâmina d\'água sobre os recifes atinge cerca de 1,5m com transparência perfeita.' },
      { q: 'A que distância da costa ficam os parrachos?', a: 'Ficam a cerca de 7 km mar adentro, em plataformas flutuantes equipadas para mergulho livre e com cilindro.' },
    ],
  },

  'cumbuco': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Kitesurf e Dunas',
    description: 'Tábua de maré do Cumbuco (Caucaia, CE) para hoje e 2026. Horários de maré para velejo de kitesurf na praia e na Lagoa do Cauípe. Fonte: Marinha do Brasil (Terminal do Pecém).',
    keywords: ['maré cumbuco', 'maré cumbuco hoje', 'tábua de maré cumbuco', 'kitesurf cumbuco maré', 'maré praia do cumbuco', 'maré caucaia'],
    praias: ['Praia do Cumbuco', 'Lagoa do Cauípe', 'Pecém'],
    category: 'surf',
    portoVizinhos: ['terminal-portuario-do-pecem', 'porto-de-mucuripe-fortaleza', 'praia-do-futuro'],
    faqs: [
      { q: 'Qual a influência da maré no kitesurf em Cumbuco?', a: 'Na maré baixa, a praia forma lagoas rasas de água lisa (flat) ideais para freestyle e iniciantes; na maré cheia, as ondas de arrebentação servem de rampa para saltos.' },
      { q: 'Qual porto de referência o Cumbuco utiliza?', a: 'Utiliza os dados maregráficos oficiais do Terminal Portuário do Pecém (DHN 30337), situado a apenas 20 km na mesma faixa litorânea.' },
    ],
  },

  'praia-de-atalaia': {
    titleSuffix: 'Maré Alta e Baixa Hoje — Orla de Aracaju',
    description: 'Tábua de maré da Praia de Atalaia (Aracaju, SE) para hoje e 2026. Horários de maré baixa para caminhadas na ampla faixa de areia e banho de mar em família. Fonte: Marinha do Brasil.',
    keywords: ['maré praia de atalaia', 'maré atalaia aracaju hoje', 'tábua de maré atalaia aracaju', 'maré aracaju hoje', 'passarela do caranguejo maré'],
    praias: ['Praia de Atalaia', 'Praia de Aruana', 'Praia do Mosqueiro', 'Passarela do Caranguejo'],
    category: 'turismo',
    portoVizinhos: ['capitania-dos-portos-de-sergipe', 'terminal-maritimo-inacio-barbosa'],
    faqs: [
      { q: 'Por que a maré baixa afasta tanto o mar na Praia de Atalaia?', a: 'Porque o relevo submarino tem declive muito plano; na maré baixa, a água recua mais de 100 metros, criando um imenso pátio de areia firme para caminhadas.' },
      { q: 'O mar de Atalaia é seguro para crianças?', a: 'Sim, as ondas quebram suavemente e não há buracos profundos imediatos, sendo um dos banhos mais tranquilos de capitais nordestinas.' },
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
      { q: 'A tábua de marés tem influência no tamanho das ondas?', a: 'Indiretamente sim. A maré não cria ondas, mas afeta como elas quebram ao atingir as bancadas de areia ou recifes.' },
      { q: 'O que são marés semidiurnas?', a: 'São marés que apresentam duas preamares (alta) e duas baixamares (baixa) a cada 24 horas. É o padrão em quase todo o litoral brasileiro.' },
      { q: 'Os dados do MaréAgora são confiáveis?', a: 'Sim, baseamos nossas informações nas tábuas publicadas anualmente pela Marinha do Brasil.' },
      { q: 'Qual a diferença entre maré de sizígia e de quadratura?', a: 'Sizígia ocorre nas luas nova e cheia (maior variação). Quadratura ocorre nas luas minguante e crescente (menor variação).' },
    ],
  },
  pesca: {
    titleSuffix: 'Maré Alta e Baixa — Pesca e Náutica',
    descriptionTemplate: (nome, estado) =>
      `Tábua de marés de ${nome}, ${estado} para hoje e 2026. Horários ideais para pesca, navegação e atividades náuticas. Fonte: Marinha do Brasil.`,
    faqs: [
      { q: 'Qual a melhor maré para pescar?', a: 'Os melhores momentos são nas 2 horas ao redor da maré alta e da maré baixa, quando os peixes se movimentam. Coeficiente acima de 60 indica marés mais produtivas.' },
      { q: 'O que é maré de sizígia?', a: 'Maré de sizígia ocorre na lua nova e cheia, quando a amplitude é máxima. É geralmente o melhor período para a pesca por causa das correntes mais intensas.' },
      { q: 'Como o coeficiente afeta a pesca?', a: 'Coeficientes altos aumentam o volume de água que se move, levantando nutrientes e ativando a cadeia alimentar marinha.' },
      { q: 'O que é o estofo da maré?', a: 'É o momento em que a maré para de encher ou de vazar, pouco antes de inverter a direção. Neste período as correntes são mínimas.' },
      { q: 'Posso usar a tábua de marés para prever o clima?', a: 'Não. A tábua de marés é puramente astronômica e não prevê chuva, ventos ou ressacas provocadas por frentes frias.' },
      { q: 'A pressão atmosférica afeta a maré?', a: 'Sim. A tábua mostra a maré astronômica, mas ventos fortes e baixa pressão podem causar "marés meteorológicas", elevando o nível real do mar.' },
    ],
  },
  turismo: {
    titleSuffix: 'Maré Alta e Baixa — Praias e Passeios',
    descriptionTemplate: (nome, estado) =>
      `Tábua de marés de ${nome}, ${estado} para hoje e 2026. Horários de maré para aproveitar melhor as praias e passeios. Fonte: Marinha do Brasil.`,
    faqs: [
      { q: 'Como a maré afeta as praias turísticas?', a: 'Na maré baixa, a faixa de areia fica mais ampla e as piscinas naturais ficam acessíveis. Na maré alta, as ondas chegam mais perto da orla.' },
      { q: 'O que é tábua de marés?', a: 'É a previsão dos horários e alturas de maré alta (preamar) e maré baixa (baixamar) para um porto ou praia específicos.' },
      { q: 'Qual a melhor fase da lua para ver piscinas naturais?', a: 'As luas cheia e nova (marés de sizígia) oferecem as marés mais secas, excelentes para visualizar recifes e piscinas naturais.' },
      { q: 'O que significa preamar e baixamar?', a: 'Preamar é o nível máximo alcançado pela água na maré alta. Baixamar é o nível mínimo na maré baixa.' },
      { q: 'A maré alta é perigosa?', a: 'Pode ser, dependendo da praia. Praias de tombo ficam com o repuxo mais forte, exigindo cuidado extra de crianças e banhistas.' },
      { q: 'Por que a maré muda de horário todo dia?', a: 'A maré segue o dia lunar, que dura 24 horas e 50 minutos. Por isso, os horários atrasam cerca de 50 minutos a cada dia.' },
    ],
  },
  industrial: {
    titleSuffix: 'Tábua de Marés Oficial 2026',
    descriptionTemplate: (nome, estado) =>
      `Tábua de marés de ${nome}, ${estado} para 2026. Previsão de maré alta e baixa com dados da Marinha do Brasil (CHM).`,
    faqs: [
      { q: 'Os dados são válidos para navegação comercial?', a: 'Não. Os dados do MaréAgora são de referência para atividades recreativas. Para navegação de calado considerável, use as tábuas oficiais publicadas pela Marinha do Brasil.' },
      { q: 'O que é coeficiente de maré?', a: 'Número de 20 a 120 que indica a intensidade da maré. Acima de 70 são marés vivas com grande variação de nível.' },
      { q: 'Qual é o sistema de referência usado?', a: 'As alturas são dadas em metros em relação ao Nível de Redução (NR) do respectivo porto, estabelecido pela Marinha do Brasil.' },
      { q: 'Como o assoreamento afeta a leitura da tábua?', a: 'A tábua reflete o nível da água, mas não a profundidade do leito. Áreas assoreadas podem ficar mais rasas do que a carta náutica indica, mesmo em maré alta.' },
      { q: 'O que é maré meteorológica?', a: 'São elevações ou reduções atípicas causadas pelo vento e pressão atmosférica, somando-se à maré astronômica (prevista).' },
      { q: 'Os fusos horários já estão ajustados?', a: 'Sim. Os horários exibidos já consideram o fuso horário local e horário de verão, quando aplicável.' },
    ],
  },
  nautica: {
    titleSuffix: 'Tábua de Marés — Náutica e Pesca',
    descriptionTemplate: (nome, estado) =>
      `Tábua de marés de ${nome}, ${estado} para 2026. Horários de maré para pesca, navegação e atividades náuticas. Fonte: Marinha do Brasil.`,
    faqs: [
      { q: 'Como interpretar o coeficiente de maré?', a: 'Valores acima de 70 indicam marés vivas com grande variação. Abaixo de 45 são marés mortas com pouca variação de nível.' },
      { q: 'A tábua serve para navegação?', a: 'Não para navegação profissional. Para embarcações de calado considerável, use sempre as publicações oficiais da Marinha do Brasil.' },
      { q: 'Quando a correnteza é mais forte?', a: 'As correntes são mais intensas no meio do ciclo (meia maré), seja na enchente ou vazante, especialmente em luas nova/cheia.' },
      { q: 'Qual é o melhor momento para manobras de atracação?', a: 'Tradicionalmente, manobras são favorecidas no estofo da maré, momento breve onde não há variação vertical nem correntes horizontais.' },
      { q: 'As chuvas afetam o nível da maré no estuário?', a: 'Sim. Muita chuva no continente aumenta a vazão dos rios que chegam ao mar, podendo elevar o nível da água acima do previsto pela maré astronômica.' },
      { q: 'A hora exibida está em UTC?', a: 'Não, os horários já estão no tempo local (ex: UTC-3 para o horário oficial de Brasília).' },
    ],
  },
};
