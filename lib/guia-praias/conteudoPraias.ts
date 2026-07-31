// lib/guia-praias/conteudoPraias.ts
// Conteúdo SEO (sobre/pesca/melhor época) por praia — extraído de app/guia-praias/[slug]/page.tsx
// para fora da pasta de rota, já que arquivos page.tsx só podem exportar campos reconhecidos
// pelo Next.js (default, metadata, generateMetadata, generateStaticParams etc.).

export const CONTEUDO: Record<string, { sobre: string; pesca: string; melhorEpoca: string }> = {
  'jurere-sc': {
    sobre: 'Jurerê Internacional é a praia mais famosa de Florianópolis, conhecida pelos beach clubs sofisticados, casas de alto padrão e infraestrutura completa. O mar calmo e raso é ideal para famílias com crianças.',
    pesca: 'A pesca é boa nas pedras do costão leste, especialmente para robalo e tainha na maré enchendo. Os melhores horários são nas primeiras horas da manhã, quando o fluxo de maré está forte.',
    melhorEpoca: 'Dezembro a março para o verão agitado. Abril a junho para mar mais calmo e menos movimento.',
  },
  'jericoacoara-ce': {
    sobre: 'Jericoacoara, ou "Jeri", é um dos destinos mais desejados do Brasil. A vila sem ruas asfaltadas fica dentro de um Parque Nacional e oferece dunas, lagoas e o famoso pôr do sol na Pedra Furada.',
    pesca: 'A pesca artesanal é forte na região. Na maré baixa, os pescadores locais indicam os melhores pontos ao longo da praia principal. Atum e dourado são abundantes na costa.',
    melhorEpoca: 'Julho a dezembro para os ventos ideais de kitesurf. Janeiro a junho para mar mais calmo.',
  },
  'praia-do-espelho-ba': {
    sobre: 'A Praia do Espelho fica entre Trancoso e Caraíva, no extremo sul da Bahia. As piscinas naturais formadas na maré baixa são o principal atrativo, junto com as falésias coloridas.',
    pesca: 'Na maré baixa as piscinas naturais ficam expostas e a pesca com anzol de mão é popular entre os locais. Robalos e peixes de recife são comuns.',
    melhorEpoca: 'Setembro a março. Evite julho e agosto pela maré muito alta que cobre as piscinas.',
  },
  'grumari-rj': {
    sobre: 'Grumari é a praia mais isolada do Rio de Janeiro, dentro de uma Área de Proteção Ambiental. Sem quiosques permanentes, é frequentada por surfistas e quem busca natureza preservada.',
    pesca: 'Uma das melhores praias do Rio para pesca de arremesso. Anchova e corvina são abundantes, especialmente no inverno. A maré baixa é essencial para acessar os melhores pontos.',
    melhorEpoca: 'Maio a setembro para surf e pesca. Verão para banho de mar com ondas menores.',
  },
  'morro-de-sao-paulo-ba': {
    sobre: 'Morro de São Paulo fica na Ilha de Tinharé, sem carros. As praias são numeradas (Primeira, Segunda, Terceira e Quarta Praia) com características distintas - da mais agitada à mais selvagem.',
    pesca: 'A Quarta Praia, mais isolada, oferece ótima pesca de arremesso. Os recifes de corais ao redor da ilha são paraíso para pesca subaquática e snorkel.',
    melhorEpoca: 'Setembro a março para clima seco. Julho é alta temporada apesar da chuva.',
  },
  'bombinhas-sc': {
    sobre: 'Bombinhas é considerada a cidade com as águas mais transparentes do Sul do Brasil. A Praia de Bombas e Bombinhas formam um balneário completo com rica vida marinha nos costões.',
    pesca: 'Os costões rochosos são ideais para pesca de garoupa e badejo. O mergulho é excelente, especialmente na Reserva Biológica Marinha do Arvoredo.',
    melhorEpoca: 'Dezembro a fevereiro para verão. Março a maio para turismo sem aglomeração.',
  },
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
}
