// lib/guia-praias/conteudoPraias.ts
// Conteúdo SEO (sobre/pesca/melhor época) por praia — extraído de app/guia-praias/[slug]/page.tsx
// para fora da pasta de rota, já que arquivos page.tsx só podem exportar campos reconhecidos
// pelo Next.js (default, metadata, generateMetadata, generateStaticParams etc.).

export const CONTEUDO: Record<string, { sobre: string; pesca: string; melhorEpoca: string }> = {
  'praia-grande': {
    sobre: 'A Praia Grande possui uma das orlas mais extensas e urbanizadas de São Paulo. Com 22 km de extensão ininterrupta, é famosa por seus quiosques modernos, ciclovia de ponta a ponta e calçadão movimentado. É um destino extremamente popular para famílias da capital.',
    pesca: 'A pesca de arremesso é excelente nas primeiras horas da manhã. O fluxo da maré traz cardumes de pequenos peixes para a zona de arrebentação, tornando-se um local ideal para pesca de corvina e pescada.',
    melhorEpoca: 'O verão atrai multidões, mas a primavera e o outono oferecem clima agradável e praias mais tranquilas para aproveitar a orla.',
  },
  'sao-luis': {
    sobre: 'A capital maranhense é famosa não apenas por sua rica herança histórica e arquitetura colonial, mas também por abrigar algumas das maiores variações de maré do Brasil. As praias urbanas mudam completamente de paisagem em poucas horas.',
    pesca: 'A pesca costeira é influenciada diretamente pela grande amplitude de maré. Pescadores locais aproveitam o estuário para pescar durante a maré vazante, capturando peixes adaptados às correntes fortes.',
    melhorEpoca: 'Entre julho e dezembro o clima é mais firme, ideal para visitar as praias e passear pelo centro histórico sem chuvas repentinas.',
  },
  'porto-de-natal': {
    sobre: 'Natal, a Cidade do Sol, é famosa por suas praias de águas quentes e dunas exuberantes. A região oferece desde lagoas tranquilas até mar aberto propício para esportes aquáticos, sempre sob o sol nordestino.',
    pesca: 'Com o mar calmo na maior parte do ano, a pesca embarcada e de costão são bastante praticadas. A variação da maré é crucial para acessar recifes e canais de pesca.',
    melhorEpoca: 'O ano todo é propício para visitas. O verão é vibrante, mas os meses de setembro a novembro oferecem ventos perfeitos para kitesurf e praias menos cheias.',
  },
  'porto-de-maceio': {
    sobre: 'Maceió abriga algumas das águas mais belas e cristalinas do litoral brasileiro, comparadas frequentemente ao Caribe. Suas piscinas naturais formadas em meio aos arrecifes são o cartão-postal do estado.',
    pesca: 'Nas áreas onde a pesca é permitida, pescadores locais aproveitam a rica biodiversidade dos recifes de coral, especialmente nas marés de sizígia, quando mais recifes ficam expostos.',
    melhorEpoca: 'De outubro a março as águas ficam mais cristalinas e quentes. É imprescindível visitar nas luas nova ou cheia para pegar a maré mais baixa e ver as piscinas naturais.',
  },
  'porto-de-santos': {
    sobre: 'Santos mistura sua importância histórica portuária com belíssimas praias urbanas contornadas pelo maior jardim de orla do mundo. O mar costuma ser tranquilo, excelente para esportes como stand-up paddle e canoa havaiana.',
    pesca: 'Os molhes e canais são locais tradicionais de pesca. A troca de marés movimenta os cardumes e a pesca noturna costuma trazer ótimos resultados para robalos.',
    melhorEpoca: 'Qualquer época do ano é boa. No inverno, o clima convida a visitar o centro histórico e museus além da praia.',
  },
  'guaruja': {
    sobre: 'O Guarujá, conhecido como a Pérola do Atlântico, oferece desde praias altamente badaladas como Enseada e Pitangueiras, até joias escondidas e preservadas, acessíveis apenas por trilha ou mar.',
    pesca: 'Com diversos costões rochosos e praias de tombo, a pesca costeira é um grande atrativo. A pesca de costão rende peixes maiores em dias de mar agitado e maré subindo.',
    melhorEpoca: 'Dezembro a março para aproveitar o verão e a vida noturna. Abril a junho para curtir surf e praias tranquilas com ótimo clima.',
  },
  'sao-vicente': {
    sobre: 'São Vicente é a cidade mais antiga do Brasil, fundada em 1532, e combina esse peso histórico com praias tranquilas voltadas para famílias. A Ilha Porchat, ligada ao continente por uma ponte, oferece mirantes com vista para toda a Baixada Santista.',
    pesca: 'Os costões da Ilha Porchat e o canal de Bertioga-Piaçabuçu são bons pontos de pesca de arremesso. A maré enchente costuma trazer melhores resultados para tainha e corvina junto à arrebentação.',
    melhorEpoca: 'Verão para aproveitar a orla e o comércio da praia do Itararé. Nos fins de semana de baixa temporada o mar costuma ficar mais calmo e a cidade menos movimentada.',
  },
  'bertioga': {
    sobre: 'Bertioga preserva boa parte da Mata Atlântica original e tem praias mais desertas que o restante do litoral paulista, além do histórico Forte São João, erguido no século XVI para defender o canal que dá nome à cidade.',
    pesca: 'O Canal de Bertioga é um dos pontos mais procurados da região para pesca de robalo e caratinga, principalmente na virada da maré, quando a correnteza concentra o cardume próximo às margens.',
    melhorEpoca: 'Abril a agosto oferece mar mais calmo e praias vazias, ideais para quem busca sossego. O verão atrai visitantes para a orla de Riviera e a Praia da Enseada.',
  },
  'riviera-de-sao-lourenco': {
    sobre: 'A Riviera de São Lourenço é um bairro planejado em Bertioga, com praias limpas, marina própria e infraestrutura de alto padrão. É procurada por quem busca conforto sem abrir mão do acesso fácil ao mar aberto.',
    pesca: 'A região da marina e dos costões próximos favorece a pesca embarcada. Nas praias abertas, a pesca de arremesso funciona melhor nas primeiras horas da manhã, com a maré ainda baixa.',
    melhorEpoca: 'Dezembro a março concentra a alta temporada, com toda a infraestrutura de lazer em funcionamento. Fora desse período o local fica mais tranquilo e os preços caem.',
  },
  'mongagua': {
    sobre: 'Mongaguá é um balneário mais discreto da Baixada Santista, com ondas consistentes que atraem surfistas e uma orla menos disputada que a de cidades vizinhas como Praia Grande.',
    pesca: 'A pesca de arremesso na arrebentação rende bons resultados, especialmente em dias de mar com ondulação moderada. A região também é procurada por pescadores de caranguejo nos manguezais próximos.',
    melhorEpoca: 'Outono e inverno trazem ondas mais organizadas para o surf. O verão é a época de maior movimento na orla e no comércio local.',
  },
  'itanhaem': {
    sobre: 'Uma das primeiras vilas fundadas no Brasil, Itanhaém tem praias mais preservadas e é cortada por rios de água limpa, como o Rio Branco, que desce das encostas da Serra do Mar até o mar.',
    pesca: 'Os rios e a foz junto à praia são bons pontos de pesca de robalo e tainha, principalmente na maré vazante, quando os peixes se concentram nos canais mais estreitos.',
    melhorEpoca: 'Primavera e outono oferecem clima ameno para explorar tanto a praia quanto os passeios pelos rios. O verão é mais quente e movimentado.',
  },
  'peruibe': {
    sobre: 'Peruíbe é conhecida como a "Cidade do Clima Especial" e abriga parte da Estação Ecológica Juréia-Itatins, uma das últimas grandes áreas de Mata Atlântica preservada no litoral paulista.',
    pesca: 'A pesca de arremesso é praticada ao longo de toda a orla, com destaque para a foz do Rio Preto. A proximidade da Juréia também atrai pescadores para pontos mais isolados e preservados.',
    melhorEpoca: 'Abril a setembro é indicado para quem busca ecoturismo e trilhas na Juréia com clima mais ameno. O verão concentra o maior movimento na praia central.',
  },

  // ── Região Norte ─────────────────────────────────────────────────────────
  'porto-de-belem': {
    sobre: 'Belém é uma das cidades com maior amplitude de maré do mundo, banhada pela Baía do Guajará na foz do Rio Pará. Na maré vazante, extensas faixas de lama e bancos de areia surgem no estuário, enquanto a preamar reconfigura a paisagem ribeirinha em poucas horas.',
    pesca: 'A pesca na região amazônica segue o ciclo das marés: a vazante concentra os peixes nos canais mais estreitos, momento ideal para a pesca esportiva nos rios Guamá e Guajará. Embarcações aproveitam a preamar para subir os rios com segurança e economizar combustível.',
    melhorEpoca: 'De junho a dezembro o clima é mais seco, com marés menos extremas. Evite os meses de pico da cheia amazônica, entre março e maio, para atividades na beira do rio.',
  },
  'ilha-do-mosqueiro': {
    sobre: 'A Ilha do Mosqueiro, a cerca de 70 km de Belém, é o destino de praia preferido dos paraenses. Suas praias de água doce, como o Paraíso e o Chapéu Virado, são tomadas por famílias nos fins de semana, quando a preamar garante os melhores banhos.',
    pesca: 'As praias de água doce do rio Pará sofrem transformações drásticas com a maré. A pesca concentra-se na virada da maré, quando cardumes entram pelos canais entre as ilhas; na vazante, a lama exposta dificulta o acesso aos melhores pontos.',
    melhorEpoca: 'Setembro a dezembro para dias mais ensolarados. Os fins de semana de verão são os mais movimentados; dias úteis garantem praias mais vazias.',
  },
  'porto-de-vila-do-conde': {
    sobre: 'Vila do Conde, em Barcarena (PA), fica no estuário do Rio Pará, entre a Baía do Guajará e a Baía de Marajó. A região é fortemente marcada por marés que ultrapassam 3,5 metros nas sizígias, transformando igarapés e canais a cada ciclo.',
    pesca: 'A pesca artesanal barcarenense depende das correntes de vazante para posicionar redes e currais nas margens do estuário. Peixes de água salobra são capturados com mais facilidade quando a enchente traz o cardume para os canais internos.',
    melhorEpoca: 'A época seca, de junho a dezembro, é a melhor para pescar e navegar. Nas chuvas de janeiro a maio, as correntes ficam mais fortes e o acesso aos igarapés é mais difícil.',
  },
  'atracadouro-de-breves': {
    sobre: 'Breves, no arquipélago do Marajó, é ponto de passagem obrigatório para quem navega pelos furos e igarapés da Amazônia. A enorme massa d\'água dos rios Amazonas e Pará impõe variações de maré que afetam o nível dos canais por quilômetros adentro.',
    pesca: 'A navegação e a pesca pelos labirínticos furos do Marajó dependem essencialmente da enchente, quando canais rasos se tornam transitáveis. As capturas de peixes migratórios são mais produtivas no estofo da maré, quando a corrente perde força.',
    melhorEpoca: 'De junho a novembro, com menos chuva e marés mais regulares, as atividades nos furos são mais seguras. A vazante extrema nas luas nova e cheia exige experiência dos navegadores.',
  },
  'porto-de-santana': {
    sobre: 'Santana, no Amapá, fica às margens do Rio Amazonas próximo à foz norte. A amplitude das marés chega a 3 metros, e a descarga fluvial amortece parte da influência oceânica, criando correntes de vazante velozes que modelam os bancos de areia do canal.',
    pesca: 'A mistura de água doce amazônica com a água salgada da maré cria um ambiente rico para a pesca na foz. As vazantes mais fortes e duradouras favorecem a captura de espécies que se deslocam com a correnteza, principalmente nas barras e canais mais profundos.',
    melhorEpoca: 'O período de agosto a dezembro oferece as melhores condições de pesca e navegação, com marés mais previsíveis e menos chuvas. Evite o auge da chuva, entre março e maio.',
  },
  'igarape-grande-do-curua': {
    sobre: 'O Igarapé Grande do Curuá, no litoral norte do Pará, é um canal do estuário amazônico onde a maré sobe e desce de forma brusca duas vezes ao dia. A região, cortada por igarapés e manguezais, é base da vida ribeirinha e da pesca artesanal local.',
    pesca: 'Pescadores locais usam o conhecimento das marés para lançar redes e armadilhas na vazante, quando os peixes se concentram nas áreas mais rasas. O estofo da maré, quando a corrente perde força, é o momento de maior fartura nos canais.',
    melhorEpoca: 'Entre julho e novembro as marés são mais regulares e o acesso aos igarapés mais fácil. Nas luas de sizígia, a amplitude máxima demanda cautela com os rebojos dos canais estreitos.',
  },
  'barra-norte-arco-lamoso': {
    sobre: 'A Barra Norte do Rio Amazonas, no Arco Lamoso, é o encontro do maior rio do mundo com o Atlântico equatorial. A batimetria instável de lama fluviomarinha muda com as correntes de maré, criando uma área de navegação complexa e fascinante.',
    pesca: 'A transição entre água doce e salgada atrai grandes cardumes para a plataforma de lama da foz. Pescadores oceânicos aproveitam a enchente para acessar os pontos mais rasos, onde peixes como pescadas e bagres se alimentam próximos à superfície.',
    melhorEpoca: 'A navegação e a pesca oceânica na foz são mais seguras entre agosto e dezembro, com marés e ventos mais regulares. Nas sizígias, a enchente maximiza a profundidade dos canais.',
  },
  'fundeadouro-de-salinopolis': {
    sobre: 'Salinópolis, o "Caribe paraense", é o principal destino de praia do nordeste do Pará. A Praia do Atalaia tem um amplo declive que permite até o trânsito de carros na areia, mas as marés de sizígia avançam rapidamente e surpreendem motoristas desavisados.',
    pesca: 'A maré enchente cria ondas apreciadas pelos surfistas, enquanto a baixamar expõe lagoas temporárias e piscinas naturais. Para a pesca, a vazante é o melhor horário, quando os peixes se concentram nos canais que cortam a areia.',
    melhorEpoca: 'De julho a dezembro, com sol firme e maré oceânica mais controlável. Nas luas nova e cheia, a amplitude aumenta e a faixa de areia muda drasticamente.',
  },
  'ilha-dos-guaras': {
    sobre: 'A Ilha dos Guarás, no litoral paraense, é uma área de preservação com manguezais densos e rica biodiversidade. A revoada dos guarás-vermelhos ao pôr do sol é o grande espetáculo, melhor visto na maré alta, quando as embarcações adentram os furos protegidos.',
    pesca: 'A pesca artesanal e a catação de caranguejos seguem o ritmo da maré: os caranguejos só são coletados na baixamar extrema, quando a lama dos manguezais fica exposta. Peixes e camarões aproveitam a enchente para se alimentar nas raízes dos mangues.',
    melhorEpoca: 'A época seca, de julho a dezembro, é ideal para o ecoturismo. A revoada dos guarás é mais impressionante entre maio e julho.',
  },

  // ── Região Nordeste ──────────────────────────────────────────────────────
  'porto-de-itaqui': {
    sobre: 'O Porto do Itaqui fica no Golfão Maranhense, uma das regiões de maior amplitude de maré do mundo, com variações que podem superar 6 metros nas sizígias. Essa dinâmica extrema transforma o cenário costeiro de São Luís a cada seis horas e molda as praias da capital maranhense.',
    pesca: 'A pesca no Golfão Maranhense é condicionada pelas marés gigantes. Na vazante, a água escoa com força pelos canais e concentra os peixes; na enchente, cardumes inteiros entram nas baías rasas atrás de alimento, e os pescadores planejam a saída das embarcações pelo estofo.',
    melhorEpoca: 'De julho a dezembro, com menos chuva e marés mais previsíveis. As luas nova e cheia exigem atenção redobrada pela amplitude máxima.',
  },
  'porto-de-tutoia': {
    sobre: 'Tutóia fica na foz do Rio Parnaíba, porta de entrada leste para os Lençóis Maranhenses. A região é marcada pelo Delta do Parnaíba, um dos maiores deltas em mar aberto do mundo, onde rios, dunas e maré se encontram.',
    pesca: 'Os barcos que navegam pelos canais do delta dependem da enchente para atravessar os igarapés rasos. A pesca de peixes de água mista é mais produtiva nas barras, onde a maré vazante arrasta nutrientes e atrai o cardume.',
    melhorEpoca: 'Junho a setembro concentra as lagoas cheias dos Lençóis e ventos moderados. É a época perfeita para o passeio pelo delta, com marés e correntes mais tranquilas.',
  },
  'terminal-da-ponta-da-madeira': {
    sobre: 'A Ponta da Madeira, em São Luís, é o maior terminal de exportação de minério de ferro do mundo. A paisagem é dominada por amplitudes de maré de até 7 metros, um dos maiores fenômenos macrotidais do planeta, que também desenha as praias da ilha de São Luís.',
    pesca: 'A forte correnteza das marés no Golfão Maranhense concentra peixes nos canais profundos. A pesca de beira nas praias da ilha rende mais na virada da maré, quando o fluxo intenso traz nutrientes e cardumes para perto da costa.',
    melhorEpoca: 'Agosto a dezembro é a melhor janela para pesca e passeios, com marés mais regulares. Nas sizígias, a amplitude extrema redefine toda a linha da água.',
  },
  'terminal-da-alumar': {
    sobre: 'O Terminal da Alumar integra o complexo industrial do alumínio em São Luís, no coração do Golfão Maranhense. A região vive uma das maiores amplitudes de maré do litoral brasileiro, com bancos de areia móveis redesenbocados a cada ciclo.',
    pesca: 'Nos canais do complexo estuarino de São Luís, a pesca acompanha o fluxo da enchente e da vazante. A maré vazante expõe bancos de lama onde marisqueiras coletam ostras e caranguejos, tradição que sustenta famílias da região.',
    melhorEpoca: 'A estação seca, de julho a novembro, oferece as melhores condições. Os períodos de sizígia trazem as maiores variações de maré e exigem planejamento.',
  },
  'porto-de-luis-correia': {
    sobre: 'Luís Correia concentra o único litoral do Piauí, com praias como Atalaia, Coqueiro e Macapá. O mar nordestino tem variações moderadas e duas preamares e baixamares por dia, garantindo bons banhos na preamar e extensos bancos de areia na vazante.',
    pesca: 'A foz do rio Igaraçu forma estuários que, na baixamar, viram piscinas rasas e bancos de areia. A pesca embarcada prefere a preamar, quando as águas mais profundas facilitam o acesso aos pontos de pesca na costa piauiense.',
    melhorEpoca: 'Setembro a dezembro combina ventos alísios constantes, ideais para kitesurf, e maré estável. O verão de janeiro e fevereiro é a alta temporada das praias.',
  },
  'terminal-portuario-do-pecem': {
    sobre: 'O Porto do Pecém, no Ceará, é um porto de águas profundas em mar aberto, exposto às correntes e ventos alísios. A costa cearense ao redor abriga praias de surf e kitesurf que reagem fortemente à transição da maré.',
    pesca: 'A pesca na região do Pecém se concentra nas pedras e recifes próximos à costa. A virada da maré é o horário mais produtivo, quando a corrente traz peixes para perto dos pontos de arremesso das praias vizinhas.',
    melhorEpoca: 'O vento forte e constante entre julho e janeiro faz a fama dos esportes náuticos. Para banho e pesca, os meses de maré mais calma são maio e junho.',
  },
  'porto-de-mucuripe-fortaleza': {
    sobre: 'Fortaleza é a capital do Ceará e referência de maré para todo o litoral cearense. As praias urbanas de Iracema, Meireles e a Praia do Futuro mudam de cenário com o ciclo: a maré baixa revela piscinas naturais e recifes, enquanto a preamar traz o mar até a orla.',
    pesca: 'A tradicional pesca de lagosta e os passeios de jangada em Fortaleza seguem o cronograma das marés. Na baixamar, as jangadas encontram águas calmas para navegar até as formações rochosas; na enchente, a pesca embarcada rende mais na enseada do Mucuripe.',
    melhorEpoca: 'Agosto a dezembro, com sol constante e mar mais calmo. O verão é a alta temporada, com praias cheias e ventos fortes à tarde.',
  },
  'porto-de-areia-branca-termisa': {
    sobre: 'Areia Branca, no Rio Grande do Norte, é a "capital do sal" do Brasil. O litoral potiguar tem marés semidiurnas regulares, e a costa de dunas e praias tranquilas convive com as salinas que dependem do ciclo de maré para a produção.',
    pesca: 'A pesca artesanal na Costa Branca é ditada pela maré: a vazante expõe coroas de lama ricas em mariscos e ostras, enquanto a enchente renova a água dos canais e atrai peixes. Pescadores embarcam nos horários de estofo para maior segurança.',
    melhorEpoca: 'Setembro a dezembro é a janela de clima firme e mar calmo. As praias são mais vazias e a pesca mais produtiva entre abril e junho.',
  },
  'porto-de-guamare': {
    sobre: 'Guamaré, no litoral potiguar, combina a indústria de petróleo e gás com praias remotas e manguezais preservados. Os recifes de arenito paralelos à costa formam piscinas naturais na vazante e criam um ambiente rico para a vida marinha.',
    pesca: 'Os canais de mangue e a foz do estuário são pontos de pesca de crustáceos e peixes. A maré vazante retém nutrientes nos recifes, tornando a baixamar o momento de maior fartura para os pescadores locais.',
    melhorEpoca: 'Junho a dezembro, com maré moderada e clima seco, é ideal para pesca e ecoturismo. Nas luas de sizígia, a vazante extrema expõe os recifes por mais tempo.',
  },
  'porto-de-macau': {
    sobre: 'Macau, no Rio Grande do Norte, vive entre salinas, pesca artesanal e viveiros de camarão. A Costa Branca potiguar tem um sistema de manguezais que se abre e fecha com o ciclo das marés, moldando a rotina das comunidades locais.',
    pesca: 'A maré alta é essencial para a renovação da água dos viveiros e para a entrada das embarcações pesqueiras pelos canais. Na vazante, as marisqueiras coletam ostras e siriris nas coroas de lama expostas, uma tradição que segue o ritmo hidrológico diário.',
    melhorEpoca: 'Agosto a dezembro é o período mais seco e com marés regulares. Para a pesca da lagosta, o outono é a temporada clássica no litoral potiguar.',
  },
  'porto-de-cabedelo': {
    sobre: 'Cabedelo, no litoral da Paraíba, fica na foz do Rio Paraíba e é ponto de partida para os passeios de catamarã à Tambaba e ao Cabo Branco, o ponto mais oriental das Américas. As correntes de vazante na foz podem ser intensas nas sizígias.',
    pesca: 'A pesca artesanal no estuário do rio Paraíba segue as fortes correntes de vazante, que retêm peixes nos canais do manguezal. A navegação recreativa até a Ilha da Restinga prefere a maré de enchente, mais segura para embarcações leves.',
    melhorEpoca: 'Setembro a fevereiro é a melhor janela, com maré moderada e sol constante. As praias do norte da Paraíba são ótimas em qualquer época, mas a vazante de sizígia pede cautela na foz.',
  },
  'porto-do-recife': {
    sobre: 'Recife, a Veneza Brasileira, tem praias urbanas protegidas pela barreira de recifes que dá nome à cidade. Em Boa Viagem, a maré baixa expõe as piscinas naturais entre as formações de arenito; na preamar, as ondas ultrapassam a barreira e a agitação da orla aumenta.',
    pesca: 'A pesca de arremesso em Boa Viagem rende mais na virada da maré, quando peixes costeiros se aproximam da arrebentação. Nos recifes expostos na vazante, a coleta de crustáceos e a pesca de linha são tradicionais entre os locais.',
    melhorEpoca: 'A costa pernambucana tem clima estável o ano todo. As melhores condições de banho e piscinas naturais acontecem nas baixamares de setembro a novembro.',
  },
  'porto-de-suape': {
    sobre: 'O Porto de Suape fica no litoral sul pernambucano, protegido pela mesma barreira de recifes que forma as piscinas naturais de Porto de Galinhas e Muro Alto. A maré baixa expõe longos passeios sobre os bancos de coral, enquanto a preamar submerge os recifes.',
    pesca: 'Nas praias de Ipojuca, a pesca de arremesso e a de jangada são mais produtivas na maré baixa, quando os recifes expostos concentram peixes nas poças. A comunidade pesqueira da Vila de Nazaré usa a vazante para sair pelos canais rasos.',
    melhorEpoca: 'As piscinas naturais de Porto de Galinhas e arredores são perfeitas nas baixamares de setembro a dezembro. O verão é a alta temporada, com praias mais movimentadas.',
  },
  'terminal-maritimo-inacio-barbosa': {
    sobre: 'O Terminal Inácio Barbosa fica na margem norte da foz do Rio Sergipe, em Barra dos Coqueiros, vizinho à capital Aracaju. As marés moderadas do litoral sergipano influenciam a navegação da barra e as praias que vêm se desenvolvendo como destino turístico.',
    pesca: 'A navegação de apoio e a pesca na foz do Rio Sergipe se harmonizam com a maré enchente, que evita as ondas quebrando nos bancos de areia na vazante. Pescadores locais aproveitam a virada da maré para lançar redes perto dos coqueirais.',
    melhorEpoca: 'Setembro a fevereiro é a época de clima seco e mar calmo. As praias de Barra dos Coqueiros são mais tranquilas entre abril e junho.',
  },
  'capitania-dos-portos-de-sergipe': {
    sobre: 'Aracaju, capital de Sergipe, tem praias extensas como a Atalaia, de águas mornas e turvas pela influência dos rios Sergipe e Vaza-Barris. A maré baixa amplia a faixa de areia endurecida, perfeita para esportes, e forma lagoas rasas no litoral.',
    pesca: 'A pesca no rio Sergipe e nas praias de Aracaju é regulada pela tábua da capitania. A vazante é o momento clássico para lançar redes, quando os peixes descem em direção ao mar e passam pelos canais mais rasos.',
    melhorEpoca: 'A costa sergipana é boa o ano todo; de setembro a março o sol predomina. A baixamar é a melhor fase para caminhadas e esportes na areia dura da Atalaia.',
  },
  'arquipelago-de-fernando-de-noronha': {
    sobre: 'Fernando de Noronha é um arquipélago vulcânico a 545 km do continente, Patrimônio Natural da Humanidade. A maré oceânica, com variação de cerca de 2 metros, define os melhores momentos do mergulho e do snorkeling nas baías do Sancho e dos Porcos.',
    pesca: 'A pesca é regulamentada no parque, mas o mergulho livre e a observação da vida marinha rendem o máximo no estofo da baixamar, quando a visibilidade é cristalina. Nas piscinas naturais do Atalaia, os horários de maré baixa garantem águas calmas e seguras.',
    melhorEpoca: 'Agosto a novembro é a janela de maré e visibilidade ideais para mergulho. A alta temporada de dezembro a fevereiro tem mais turistas e mar mais agitado.',
  },
  'porto-de-madre-de-deus': {
    sobre: 'Madre de Deus, na Baía de Todos os Santos, é cercada por ilhas, manguezais e praias tranquilas, além de abrigar o maior terminal de petróleo do Brasil. As correntes da baía se intensificam nos canais entre as ilhas durante as trocas de maré.',
    pesca: 'A pesca artesanal na baía utiliza o fluxo contínuo das marés para posicionar armadilhas nos canais estreitos, onde os cardumes se deslocam. A vazante de sizígia é o momento mais produtivo, mas também o mais exigente para pequenas embarcações.',
    melhorEpoca: 'A primavera e o outono oferecem maré moderada e clima agradável. O verão é a alta temporada das ilhas e praias da baía.',
  },
  'porto-de-aratu': {
    sobre: 'A Base de Aratu fica na Baía de Todos os Santos, um dos maiores estuários do Brasil, com dezenas de ilhas e comunidades pesqueiras tradicionais. As marés de 2 a 3 metros geram correntes intensas nos canais entre as ilhas, que exigem respeito de quem navega.',
    pesca: 'O manguezal da baía só se torna transitável para a catação de mariscos e caranguejos na baixamar, quando o leito lodoso e os igarapés ficam expostos. A pesca em barco é mais segura no estofo, quando as correntes perdem força.',
    melhorEpoca: 'A baía é navegável o ano todo. Entre setembro e fevereiro, o mar mais calmo e o clima seco favorecem a pesca e os passeios.',
  },
  'porto-de-salvador': {
    sobre: 'Salvador, primeira capital do Brasil, fica na entrada da Baía de Todos os Santos. Na maré baixa, praias de pedras como a Barra e a Ondina formam poços naturais que encantam banhistas; na preamar, o mar ganha corpo e convida ao mergulho no Porto da Barra.',
    pesca: 'A pesca de arremesso nas praias de Salvador rende mais na virada da maré, quando os peixes se aproximam dos costões. Os velejadores da baía aproveitam a enchente para entrar no estuário com corrente a favor.',
    melhorEpoca: 'Setembro a março concentra sol e mar quente. A baixamar é a melhor fase para as piscinas naturais da Barra e da Ondina.',
  },
  'porto-de-ilheus': {
    sobre: 'Ilhéus, terra do cacau e cenário de Jorge Amado, tem praias selvagens como Olivença e Cururupe. A maré baixa revela piscinas naturais entre as pedras e amplia as faixas de areia, período favorito para caminhadas e snorkel.',
    pesca: 'A pesca na costa de Ilhéus acompanha a variação da maré: a preamar facilita a atracação na foz do Rio Cachoeira e a vazante concentra peixes nas barras. Surfistas buscam o fundo mais propício em Olivença conforme a fase da maré.',
    melhorEpoca: 'De setembro a fevereiro, com clima quente e maré estável. O outono traz praias vazias e boas condições de pesca.',
  },

  // ── Região Sudeste ───────────────────────────────────────────────────────
  'terminal-de-barra-do-riacho': {
    sobre: 'Barra do Riacho, em Aracruz (ES), tem praias de mar aberto cercadas pela Mata Atlântica. As marés semidiurnas de amplitude moderada interagem com ressacas sazonais, e as piscinas naturais e recifes despontam na vazante.',
    pesca: 'A pesca embarcada e de beira em Aracruz rende mais na maré vazante, quando os recifes expostos concentram a vida marinha. A segurança na barra do rio Riacho depende do ciclo: a enchente facilita a entrada das embarcações.',
    melhorEpoca: 'Abril a setembro é a época de mar mais calmo e boas condições de pesca. O verão concentra o turismo nas praias capixabas.',
  },
  'porto-de-tubarao': {
    sobre: 'O Porto de Tubarão, em Vitória, é um dos maiores exportadores de minério do mundo, na Baía de Vitória. As marés capixabas, de 1 a 1,5 metros, influenciam as praias urbanas de Camburi e a navegação da baía.',
    pesca: 'Os pescadores do litoral capixaba e os velejadores da orla de Camburi orientam a pescaria embarcada pelo pulso da maré. A virada da maré no canal da baía é o horário mais produtivo para a pesca de beira.',
    melhorEpoca: 'O ES é bom o ano todo; de abril a setembro o mar fica mais calmo e a pesca mais farta. O verão é a alta temporada das praias urbanas.',
  },
  'porto-de-vitoria': {
    sobre: 'Vitória é uma das poucas capitais do Brasil em uma ilha, na Baía de Vitória. A baía estreita acelera as correntes pelo canal de acesso, e as praias de Camburi e da Curva da Jurema mudam de perfil conforme a maré.',
    pesca: 'A pesca de costão nas pedras da orla é tradicional e rende mais na maré baixa. Os manguezais da baía sustentam a coleta do lodo pelas paneleiras e a pesca artesanal, que acompanha a enchente e a vazante.',
    melhorEpoca: 'Abril a setembro é a melhor janela para pesca e mar calmo. O verão é a alta temporada na orla de Camburi.',
  },
  'ilha-da-trindade': {
    sobre: 'A Ilha da Trindade, a mais de 1.100 km da costa capixaba, é um território oceânico administrado pela Marinha. As marés são de caráter oceânico puro, com variações menores que no continente, e a ilha é um importante sítio de desova de tartarugas.',
    pesca: 'A pesca é restrita em torno da ilha, mas a observação da biodiversidade e o mergulho científico rendem mais na vazante, quando a corrente ameniza. O desembarque nas enseadas rochosas só é seguro em condições específicas de maré e mar.',
    melhorEpoca: 'O acesso depende da logística naval; o verão austral, de dezembro a fevereiro, oferece as melhores condições de mar. A desova de tartarugas se concentra entre setembro e março.',
  },
  'terminal-da-ponta-do-ubu-i': {
    sobre: 'Anchieta, no sul do Espírito Santo, é cidade histórica com praias preservadas e o Terminal da Ponta do Ubu, exportador de minérios. O mar aberto capixaba tem marés de pequena amplitude, mas as ressacas invernais exigem atenção.',
    pesca: 'Os pescadores de Anchieta organizam a rotina pela baixamar, quando o espelho d\'água permite explorar os rochedos e coletar mariscos. A pesca de beira nas praias de areia rende mais na virada da maré.',
    melhorEpoca: 'Maio a setembro é a época de mar mais calmo e pesca mais produtiva. O verão é a alta temporada turística.',
  },
  'terminal-maritimo-de-imbetiba': {
    sobre: 'Macaé, a capital do petróleo, tem praias como Imbetiba, Cavaleiros e a Praia Rasa. A ressurgência da Bacia de Campos traz águas frias e ricas em nutrientes, interagindo com a maré e definindo o banho gelado nas vazantes.',
    pesca: 'A ressurgência cria ciclos curtos de excelente fartura para a pesca comercial nas vazantes. Os pescadores de Macaé aproveitam a preamar para entrar no canal sem restrição de calado e a enchente para as capturas junto aos costões.',
    melhorEpoca: 'O inverno fluminense traz as melhores condições de pesca pela ressurgência intensa. O verão é a alta temporada de praia.',
  },
  'rio-de-janeiro-fiscal': {
    sobre: 'O Rio de Janeiro tem praias icônicas como Copacabana, Ipanema e Barra da Tijuca. Com marés semidiurnas de 1 a 1,3 metros, a maré baixa revela bancos de areia e facilita a pesca de costão, enquanto a alta aproxima as ondas da orla.',
    pesca: 'A pesca de arremesso nas lajes expostas perto do Forte de Copacabana e no Arpoador rende mais na virada da maré. A correnteza formada nesse horário é respeitada pelos surfistas do pico local.',
    melhorEpoca: 'Maio a setembro é a época clássica de swells do sul para o surf. O verão é a alta temporada das praias cariocas.',
  },
  'porto-de-itaguai': {
    sobre: 'Itaguaí, na Baía de Sepetiba, é uma das bases de acesso à Costa Verde e à Ilha Grande. O litoral raso e os manguezais da baía sustentam uma rica vida marinha e o turismo náutico que parte de Itacuruçá.',
    pesca: 'A pesca nos manguezais da Baía de Sepetiba é mais produtiva na vazante, quando os peixes deixam as raízes expostas e se concentram nos canais. A navegação para a Ilha Grande prefere a enchente, com corrente a favor.',
    melhorEpoca: 'Abril a setembro oferece mar calmo e menos turistas. O verão é a alta temporada náutica da região.',
  },
  'porto-do-forno': {
    sobre: 'Arraial do Cabo, o Caribe Brasileiro, é famoso pelas águas cristalinas alimentadas pela ressurgência. A visibilidade subaquática varia com a maré, e a baixamar expõe costões rochosos que viram paraíso para mergulhadores de apneia.',
    pesca: 'As embarcações de pesca costeira e os passeios de barco dependem da maré para driblar as correntes que esfriam o fundo do mar. A pesca de arremesso rende mais na virada da maré, quando peixes se aproximam das pedras.',
    melhorEpoca: 'A primavera e o verão, com ressurgência ativa, oferecem a melhor visibilidade para mergulho. O inverno é a época dos grandes swells para o surf na região.',
  },
  'terminal-da-ilha-guaiba': {
    sobre: 'Mangaratiba, na Baía de Sepetiba, é porta de entrada para as ilhas da Baía da Ilha Grande. As escunas de passeio dependem da maré para acessar as enseadas, que revelam faixas de areia dourada na vazante.',
    pesca: 'A pesca nas ilhas de Mangaratiba e na Baía da Ilha Grande rende mais na enchente, quando o cardume acompanha a corrente para dentro das baías. A vazante de quadratura expõe bancos de areia e facilita a coleta de mariscos.',
    melhorEpoca: 'Abril a setembro é a época de mar calmo e bom mergulho. O verão é a alta temporada das escunas e das praias.',
  },
  'porto-do-acu': {
    sobre: 'O Porto do Açu, no norte fluminense, é um superporto em mar aberto. A costa de São João da Barra e Atafona sofre forte erosão pela maré, e as praias mudam de cenário a cada ciclo.',
    pesca: 'Na foz do Paraíba do Sul, em Atafona, a maré enchente empurra a cunha salina estuário acima, modificando as espécies capturadas. A pesca de arrasto e de corrico é praticada na barra respeitando os horários da tábua.',
    melhorEpoca: 'O outono e a primavera oferecem as melhores condições de pesca no norte fluminense. O verão é a alta temporada das praias da região.',
  },
  'porto-de-angra-dos-reis': {
    sobre: 'Angra dos Reis, com suas 365 ilhas e a Ilha Grande, é um dos destinos náuticos mais sofisticados do Brasil. As marés semidiurnas de 1 a 1,2 metros influenciam a ancoragem e o acesso às praias de difícil chegada.',
    pesca: 'O mergulho nas lajes da baía rende mais no estofo da baixamar, com águas tranquilas e visibilidade excepcional. Iates e veleiros dependem da preamar para trafegar pelos canais rasos entre as ilhas.',
    melhorEpoca: 'Maio a setembro é a época de mar mais calmo e melhor visibilidade. O verão é a alta temporada náutica.',
  },
  'porto-de-sao-sebastiao': {
    sobre: 'São Sebastião, no litoral norte paulista, tem praias como Maresias, Boiçucanga e Camburi, além da travessia de balsa para Ilhabela. O canal de São Sebastião acelera as correntes nas trocas de maré, exigindo atenção na navegação.',
    pesca: 'A pesca nas praias de São Sebastião rende mais na enchente, quando o cardume se aproxima da costa. Nos costões de Camburi, a virada da maré é o horário mais produtivo para a pesca de arremesso.',
    melhorEpoca: 'Abril a setembro traz as melhores ondas do litoral norte. O verão é a alta temporada, com praias cheias.',
  },

  // ── Região Sul ───────────────────────────────────────────────────────────
  'barra-de-paranagua-sueste': {
    sobre: 'A Barra de Paranaguá é uma das entradas marítimas mais movimentadas do sul do Brasil. As correntes intensas nas trocas de maré, especialmente nas sizígias, criam zonas de turbulência que definem o comportamento da navegação e da pesca na região.',
    pesca: 'Pescadores oceânicos aproveitam as correntes da barra para a pesca de arrasto e corrico, respeitando os horários da tábua. A enchente facilita a entrada segura dos barcos pelos canais estuarinos.',
    melhorEpoca: 'Maio a setembro é a época de mar mais calmo e pesca mais farta. O verão é a alta temporada das praias do Paraná.',
  },
  'porto-de-paranagua': {
    sobre: 'Paranaguá abriga o maior porto exportador de grãos da América Latina e é porta de entrada para a Ilha do Mel. A baía preservada, com manguezais que dependem do ciclo das marés, é um dos maiores estuários do sul do Brasil.',
    pesca: 'A frota pesqueira regional lança suas redes ao sabor das marés enchentes, e a extração do caranguejo-uçá nos manguezais segue a baixamar. As praias da Ilha do Mel têm acesso facilitado na preamar.',
    melhorEpoca: 'Abril a setembro é ideal para pesca e trilhas. O verão é a alta temporada da Ilha do Mel.',
  },
  'barra-de-paranagua-galheta': {
    sobre: 'O Canal da Galheta é o principal acesso marítimo ao Porto de Paranaguá. A morfologia escavada do canal eleva a força das correntes de maré, que interagem com os swells de leste nas praias da Ilha do Mel.',
    pesca: 'As correntes da foz estuarina concentram cardumes nas praias do istmo e de Fora, na Ilha do Mel. Surfistas e pescadores acompanham a tábua semidiurna para encontrar as melhores condições nas ondas e nas pedras.',
    melhorEpoca: 'A primavera e o outono combinam maré moderada e boas ondas. O verão é a alta temporada da Ilha do Mel.',
  },
  'terminal-portuario-da-ponta-do-felix': {
    sobre: 'Antonina, no fundo da Baía de Paranaguá, é uma das cidades mais antigas do Paraná. As marés chegam com quase 1 hora de atraso em relação à barra, e a amplitude reduzida define o ritmo dos canais sinuosos cercados de mata atlântica.',
    pesca: 'A pesca estuarina e os passeios de barco com barreado dependem das preamares para navegar os canais rasos. Na baixamar, as coroas de lama ficam expostas e concentram a coleta de mariscos e caranguejos.',
    melhorEpoca: 'Abril a setembro é a melhor janela para navegação e pesca na baía. O verão é a alta temporada do litoral paranaense.',
  },
  'porto-de-sao-francisco-do-sul': {
    sobre: 'São Francisco do Sul, o terceiro porto mais antigo do Brasil, fica em uma ilha com centro histórico tombado e praias como Ubatuba, Prainha e Enseada. O Canal do Linguado tem marés semidiurnas de 0,8 a 1,2 metros.',
    pesca: 'A pesca nas praias da ilha é influenciada pelas marés da baía da Babitonga. A vazante alarga a areia e revela a restinga nativa, enquanto a enchente favorece a navegação das escunas e a pesca embarcada.',
    melhorEpoca: 'Abril a setembro oferece mar calmo e menos turistas. O verão é a alta temporada das praias do norte catarinense.',
  },
  'porto-de-itajai': {
    sobre: 'Itajaí, na foz do Rio Itajaí-Açu, é o principal porto de contêineres de Santa Catarina. As marés de 0,8 a 1,2 metros convivem com a forte descarga do rio, e as praias de Balneário Camboriú e Navegantes mudam de perfil conforme a maré.',
    pesca: 'Na foz do rio, a pesca de camarão e de peixes de água mista acompanha a enchente. A Praia Brava, vizinha a Camboriú, gera picos tubulares na maré baixa, quando os bancos de areia estabilizam.',
    melhorEpoca: 'O inverno traz as melhores ondas para o surf. O verão é a alta temporada de Balneário Camboriú.',
  },
  'porto-de-florianopolis': {
    sobre: 'Florianópolis, a Ilha da Magia, tem mais de 100 praias para todos os gostos. As marés suaves de 0,5 a 1 metro ainda definem as condições de praias como Joaquina, Mole e Campeche, além de mover a Lagoa da Conceição pelo canal da Barra.',
    pesca: 'A pesca de costão e de arremesso rende mais na virada da maré, quando peixes se aproximam da arrebentação. Na Lagoa da Conceição, a corrente do canal é usada por praticantes de windsurf e kitesurf.',
    melhorEpoca: 'Abril a setembro é a época das melhores ondas de Florianópolis. O verão é a alta temporada da ilha.',
  },
  'porto-de-imbituba': {
    sobre: 'Imbituba é a capital da Baleia Franca, com praias selvagens como Rosa e Ibiraquera. As baleias usam as enseadas protegidas em períodos de maré calma, e o mar aberto da enseada em ferradura enfrenta as ressacas do Atlântico sul.',
    pesca: 'O surf nos picos de Ibiraquera e Rosa reage à virada das marés catarinenses. A pesca embarcada e a observação das baleias são melhores na enchente, quando a visibilidade e a navegação se estabilizam.',
    melhorEpoca: 'Junho a novembro é a temporada de observação das baleias-francas. O verão é a alta temporada das praias.',
  },
  'porto-do-rio-grande': {
    sobre: 'Rio Grande, no extremo sul do Brasil, fica na entrada da Lagoa dos Patos, a maior laguna da América do Sul. A barra combina marés astronômicas, ventos do quadrante sul e a descarga da laguna, gerando marés meteorológicas imprevisíveis.',
    pesca: 'Os molhes da barra abrigam pescadores de fim de semana que acompanham a preamar para posicionar a linha. Nos estuários adjacentes, famílias extraem mariscos nas vazantes, tradição que segue o ritmo das águas.',
    melhorEpoca: 'O verão gaúcho, de dezembro a março, é a época de mar mais ameno e pesca agradável. O inverno traz ressacas e ventos fortes do sul.',
  },
}
