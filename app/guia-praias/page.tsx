// app/guia-praias/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guia de Praias do Brasil — Marés, Ondas e Dicas | MaréAgora',
  description:
    'Descubra as melhores praias do Brasil com dados de marés em tempo real, condições de ondas e dicas de pesca. Guia completo do litoral brasileiro.',
  keywords: 'praias brasil, maré praia, ondas surf, pesca esportiva, guia praias',
}

// ─── tipos ───────────────────────────────────────────────────────────────────
interface PortoMeta {
  slug: string
  nome: string
  estado: string
  dataFile: string
}

interface Praia {
  slug: string
  nome: string
  estado: string
  uf: string
  regiao: 'norte' | 'nordeste' | 'sudeste' | 'sul'
  descricao: string
  tags: string[]
  porto: PortoMeta
  afiliado?: { label: string; url: string }
  unsplashQuery: string
}

// ─── dados ───────────────────────────────────────────────────────────────────
export const PRAIAS: Praia[] = [

  // ── Região Norte ──────────────────────────────────────────────────────────
  {
    slug: 'porto-de-belem',
    nome: 'Porto de Belém (Val de Cães)',
    estado: 'Pará',
    uf: 'PA',
    regiao: 'norte',
    descricao: 'Portal da Amazônia. Maré com amplitude excepcional, influenciada pelo Rio Amazonas e ideal para pesca esportiva.',
    tags: ['Pesca', 'Amazônia', 'Maré alta'],
    porto: { slug: 'porto-de-belem', nome: 'Porto de Belém', estado: 'PA', dataFile: '10519.json' },
    afiliado: { label: '🎣 Equipamentos de Pesca', url: 'https://www.amazon.com.br/s?k=equipamentos+pesca+amazonia&tag=mareagora-20' },
    unsplashQuery: 'belem para brazil waterfront',
  },
  {
    slug: 'ilha-do-mosqueiro',
    nome: 'Ilha do Mosqueiro',
    estado: 'Pará',
    uf: 'PA',
    regiao: 'norte',
    descricao: 'Ilha paradisíaca próxima a Belém com praias de água doce do Rio Amazonas, muito frequentada por famílias paraenses.',
    tags: ['Família', 'Água doce', 'Ilha'],
    porto: { slug: 'ilha-do-mosqueiro', nome: 'Ilha do Mosqueiro', estado: 'PA', dataFile: '10525.json' },
    afiliado: { label: '🏖️ Equipamentos de Praia', url: 'https://www.amazon.com.br/s?k=equipamentos+praia+familia&tag=mareagora-20' },
    unsplashQuery: 'amazon island river beach brazil',
  },
  {
    slug: 'porto-de-vila-do-conde',
    nome: 'Porto de Vila do Conde',
    estado: 'Pará',
    uf: 'PA',
    regiao: 'norte',
    descricao: 'Região portuária com forte influência das marés amazônicas. Referência para pescadores e navegadores locais.',
    tags: ['Pesca', 'Porto', 'Navegação'],
    porto: { slug: 'porto-de-vila-do-conde', nome: 'Porto de Vila do Conde', estado: 'PA', dataFile: '10566.json' },
    afiliado: { label: '🎣 Varas e Iscas de Pesca', url: 'https://www.amazon.com.br/s?k=vara+pesca+agua+doce&tag=mareagora-20' },
    unsplashQuery: 'amazon river port brazil',
  },
  {
    slug: 'atracadouro-de-breves',
    nome: 'Atracadouro de Breves',
    estado: 'Pará',
    uf: 'PA',
    regiao: 'norte',
    descricao: 'Localizado no coração do estuário amazônico, com marés influenciadas pelos grandes rios da região.',
    tags: ['Amazônia', 'Rio', 'Navegação'],
    porto: { slug: 'atracadouro-de-breves', nome: 'Atracadouro de Breves', estado: 'PA', dataFile: '10571.json' },
    afiliado: { label: '🚤 Acessórios Náuticos', url: 'https://www.amazon.com.br/s?k=acessorios+nauticos+barco&tag=mareagora-20' },
    unsplashQuery: 'amazon estuary river brazil jungle',
  },
  {
    slug: 'porto-de-santana',
    nome: 'Porto de Santana',
    estado: 'Amapá',
    uf: 'AP',
    regiao: 'norte',
    descricao: 'Porto do Amapá com marés expressivas. Ponto de referência para navegação no estuário do Amazonas.',
    tags: ['Porto', 'Pesca', 'Amazônia'],
    porto: { slug: 'porto-de-santana', nome: 'Porto de Santana', estado: 'AP', dataFile: '10615.json' },
    afiliado: { label: '🎣 Kits de Pesca Esportiva', url: 'https://www.amazon.com.br/s?k=kit+pesca+esportiva&tag=mareagora-20' },
    unsplashQuery: 'amapa brazil coastline amazon',
  },
  {
    slug: 'igarape-grande-do-curua',
    nome: 'Igarapé Grande do Curuá',
    estado: 'Pará',
    uf: 'PA',
    regiao: 'norte',
    descricao: 'Canal amazônico com marés influenciadas pela foz do Amazonas. Ambiente único para pesca e ecoturismo.',
    tags: ['Ecoturismo', 'Pesca', 'Igarapé'],
    porto: { slug: 'igarape-grande-do-curua', nome: 'Igarapé Grande do Curuá', estado: 'PA', dataFile: '10656.json' },
    afiliado: { label: '🎣 Equipamentos de Pesca', url: 'https://www.amazon.com.br/s?k=equipamentos+pesca+rio&tag=mareagora-20' },
    unsplashQuery: 'amazon igarape canal tropical brazil',
  },
  {
    slug: 'barra-norte-arco-lamoso',
    nome: 'Barra Norte do Rio Amazonas',
    estado: 'Pará',
    uf: 'PA',
    regiao: 'norte',
    descricao: 'Encontro do Rio Amazonas com o Atlântico. Marés com amplitudes gigantescas e pesca em abundância.',
    tags: ['Pesca', 'Amazônia', 'Maré alta'],
    porto: { slug: 'barra-norte-arco-lamoso', nome: 'Barra Norte do Rio Amazonas', estado: 'PA', dataFile: '10657.json' },
    afiliado: { label: '🎣 Varas de Pesca Pesada', url: 'https://www.amazon.com.br/s?k=vara+pesca+pesada+mar&tag=mareagora-20' },
    unsplashQuery: 'amazon river mouth atlantic ocean brazil',
  },
  {
    slug: 'fundeadouro-de-salinopolis',
    nome: 'Salinópolis',
    estado: 'Pará',
    uf: 'PA',
    regiao: 'norte',
    descricao: 'O "Caribe paraense". Praias de areia branca, dunas e piscinas naturais formadas nas marés baixas do Atalaia.',
    tags: ['Piscinas naturais', 'Dunas', 'Família'],
    porto: { slug: 'fundeadouro-de-salinopolis', nome: 'Fundeadouro de Salinópolis', estado: 'PA', dataFile: '20520.json' },
    afiliado: { label: '🤿 Kits de Snorkel', url: 'https://www.amazon.com.br/s?k=kit+snorkel+piscina+natural&tag=mareagora-20' },
    unsplashQuery: 'salinopolis para white sand beach brazil',
  },
  {
    slug: 'ilha-dos-guaras',
    nome: 'Ilha dos Guarás',
    estado: 'Pará',
    uf: 'PA',
    regiao: 'norte',
    descricao: 'Reserva natural com praias selvagens e rica biodiversidade. Destino de ecoturismo e observação de aves.',
    tags: ['Ecoturismo', 'Natureza', 'Aves'],
    porto: { slug: 'ilha-dos-guaras', nome: 'Ilha dos Guarás', estado: 'PA', dataFile: '20535.json' },
    afiliado: { label: '🦜 Binóculos para Observação', url: 'https://www.amazon.com.br/s?k=binoculo+observacao+aves&tag=mareagora-20' },
    unsplashQuery: 'tropical island wildlife birds brazil',
  },

  // ── Região Nordeste ───────────────────────────────────────────────────────
  {
    slug: 'porto-de-itaqui',
    nome: 'Porto de Itaqui',
    estado: 'Maranhão',
    uf: 'MA',
    regiao: 'nordeste',
    descricao: 'Próximo a São Luís, com marés típicas do Golfão Maranhense. Referência para praias como Araçagi e Calhau.',
    tags: ['Pesca', 'Porto', 'Maré alta'],
    porto: { slug: 'porto-de-itaqui', nome: 'Porto de Itaqui', estado: 'MA', dataFile: '30110.json' },
    afiliado: { label: '🎣 Equipamentos de Pesca', url: 'https://www.amazon.com.br/s?k=equipamentos+pesca+nordeste&tag=mareagora-20' },
    unsplashQuery: 'sao luis maranhao beach brazil',
  },
  {
    slug: 'sao-luis',
    nome: 'São Luís',
    estado: 'Maranhão',
    uf: 'MA',
    regiao: 'nordeste',
    descricao: 'Capital com praias urbanas como Calhau e Ponta d\'Areia. Marés com amplitudes entre as maiores do Brasil.',
    tags: ['Urbana', 'Cultura', 'Maré alta'],
    porto: { slug: 'sao-luis', nome: 'São Luís', estado: 'MA', dataFile: '30120.json' },
    afiliado: { label: '🏄 Pranchas e Acessórios Surf', url: 'https://www.amazon.com.br/s?k=acessorios+surf+prancha&tag=mareagora-20' },
    unsplashQuery: 'sao luis maranhao praia calhau nordeste',
  },
  {
    slug: 'porto-de-tutoia',
    nome: 'Porto de Tutóia',
    estado: 'Maranhão',
    uf: 'MA',
    regiao: 'nordeste',
    descricao: 'Porta de entrada para os Lençóis Maranhenses. Marés que moldam dunas e lagoas cristalinas únicas no mundo.',
    tags: ['Lençóis', 'Dunas', 'Lagoas'],
    porto: { slug: 'porto-de-tutoia', nome: 'Porto de Tutóia', estado: 'MA', dataFile: '30140.json' },
    afiliado: { label: '🎒 Mochilas e Equipamento Trekking', url: 'https://www.amazon.com.br/s?k=mochila+trekking+praia&tag=mareagora-20' },
    unsplashQuery: 'lencois maranhenses dunes lagoon brazil',
  },
  {
    slug: 'terminal-da-ponta-da-madeira',
    nome: 'Terminal da Ponta da Madeira',
    estado: 'Maranhão',
    uf: 'MA',
    regiao: 'nordeste',
    descricao: 'Região portuária de São Luís com marés expressivas do Golfão Maranhense. Ponto de referência náutico.',
    tags: ['Porto', 'Navegação', 'Maré alta'],
    porto: { slug: 'terminal-da-ponta-da-madeira', nome: 'Terminal da Ponta da Madeira', estado: 'MA', dataFile: '30149.json' },
    afiliado: { label: '🚤 Acessórios Náuticos', url: 'https://www.amazon.com.br/s?k=acessorios+nauticos&tag=mareagora-20' },
    unsplashQuery: 'maranhao port sea brazil',
  },
  {
    slug: 'terminal-da-alumar',
    nome: 'Terminal da Alumar',
    estado: 'Maranhão',
    uf: 'MA',
    regiao: 'nordeste',
    descricao: 'Terminal industrial na Baía de São Marcos. Marés elevadas características do litoral maranhense.',
    tags: ['Porto', 'Maré alta', 'Navegação'],
    porto: { slug: 'terminal-da-alumar', nome: 'Terminal da Alumar', estado: 'MA', dataFile: '30156.json' },
    afiliado: { label: '🎣 Kits de Pesca Esportiva', url: 'https://www.amazon.com.br/s?k=kit+pesca+esportiva+mar&tag=mareagora-20' },
    unsplashQuery: 'maranhao bay coast brazil',
  },
  {
    slug: 'porto-de-luis-correia',
    nome: 'Luís Correia',
    estado: 'Piauí',
    uf: 'PI',
    regiao: 'nordeste',
    descricao: 'Litoral do Piauí com praias de dunas, ventos fortes e pôr do sol espetacular. Ótimo para kitesurf.',
    tags: ['Kitesurf', 'Dunas', 'Vento'],
    porto: { slug: 'porto-de-luis-correia', nome: 'Porto de Luís Correia', estado: 'PI', dataFile: '30225.json' },
    afiliado: { label: '🪁 Kits de Kitesurf', url: 'https://www.amazon.com.br/s?k=kitesurf+kit+iniciante&tag=mareagora-20' },
    unsplashQuery: 'kitesurf beach dunes brazil nordeste',
  },
  {
    slug: 'terminal-portuario-do-pecem',
    nome: 'Terminal do Pecém',
    estado: 'Ceará',
    uf: 'CE',
    regiao: 'nordeste',
    descricao: 'Litoral cearense com ondas constantes e ventos favoráveis. Próximo às praias de kitesurf do Ceará.',
    tags: ['Kitesurf', 'Windsurf', 'Vento'],
    porto: { slug: 'terminal-portuario-do-pecem', nome: 'Terminal do Pecém', estado: 'CE', dataFile: '30337.json' },
    afiliado: { label: '🪁 Equipamentos de Windsurf', url: 'https://www.amazon.com.br/s?k=windsurf+equipamentos&tag=mareagora-20' },
    unsplashQuery: 'ceara beach kitesurf wind brazil',
  },
  {
    slug: 'porto-de-mucuripe-fortaleza',
    nome: 'Fortaleza',
    estado: 'Ceará',
    uf: 'CE',
    regiao: 'nordeste',
    descricao: 'Capital do Ceará com praias urbanas badaladas como Iracema e Meireles. Base para Jericoacoara e Cumbuco.',
    tags: ['Urbana', 'Kitesurf', 'Infraestrutura'],
    porto: { slug: 'porto-de-mucuripe-fortaleza', nome: 'Porto de Mucuripe', estado: 'CE', dataFile: '30340.json' },
    afiliado: { label: '🪁 Kits de Kitesurf', url: 'https://www.amazon.com.br/s?k=kitesurf+iniciante&tag=mareagora-20' },
    unsplashQuery: 'fortaleza ceara beach brazil iracema',
  },
  {
    slug: 'porto-de-areia-branca-termisa',
    nome: 'Areia Branca',
    estado: 'Rio Grande do Norte',
    uf: 'RN',
    regiao: 'nordeste',
    descricao: 'Litoral potiguar com dunas, salinas e praias tranquilas. Ótimo para mergulho e ecoturismo.',
    tags: ['Mergulho', 'Dunas', 'Ecoturismo'],
    porto: { slug: 'porto-de-areia-branca-termisa', nome: 'Porto de Areia Branca', estado: 'RN', dataFile: '30407.json' },
    afiliado: { label: '🤿 Equipamentos de Mergulho', url: 'https://www.amazon.com.br/s?k=equipamentos+mergulho+snorkel&tag=mareagora-20' },
    unsplashQuery: 'rio grande do norte dunes beach brazil',
  },
  {
    slug: 'porto-de-guamare',
    nome: 'Guamaré',
    estado: 'Rio Grande do Norte',
    uf: 'RN',
    regiao: 'nordeste',
    descricao: 'Litoral potiguar com praias remotas e manguezais preservados. Paraíso para pesca e birdwatching.',
    tags: ['Pesca', 'Natureza', 'Remoto'],
    porto: { slug: 'porto-de-guamare', nome: 'Porto de Guamaré', estado: 'RN', dataFile: '30443.json' },
    afiliado: { label: '🎣 Varas de Pesca', url: 'https://www.amazon.com.br/s?k=vara+pesca+mar&tag=mareagora-20' },
    unsplashQuery: 'mangrove beach fishing brazil nordeste',
  },
  {
    slug: 'porto-de-macau',
    nome: 'Macau',
    estado: 'Rio Grande do Norte',
    uf: 'RN',
    regiao: 'nordeste',
    descricao: 'Cidade litorânea com praias de água morna e rica pesca artesanal. Acesso a ilhas e manguezais.',
    tags: ['Pesca', 'Ilha', 'Água morna'],
    porto: { slug: 'porto-de-macau', nome: 'Porto de Macau', estado: 'RN', dataFile: '30445.json' },
    afiliado: { label: '🎣 Kits de Pesca Artesanal', url: 'https://www.amazon.com.br/s?k=kit+pesca+artesanal&tag=mareagora-20' },
    unsplashQuery: 'tropical beach warm water fishing brazil',
  },
  {
    slug: 'porto-de-natal',
    nome: 'Natal',
    estado: 'Rio Grande do Norte',
    uf: 'RN',
    regiao: 'nordeste',
    descricao: 'Cidade do Sol com praias famosas como Ponta Negra e Via Costeira. Dunas, buggy e água quentinha.',
    tags: ['Buggy', 'Dunas', 'Infraestrutura'],
    porto: { slug: 'porto-de-natal', nome: 'Porto de Natal', estado: 'RN', dataFile: '30462.json' },
    afiliado: { label: '🏄 Pranchas e Acessórios Surf', url: 'https://www.amazon.com.br/s?k=prancha+surf+acessorios&tag=mareagora-20' },
    unsplashQuery: 'natal ponta negra beach dunes brazil',
  },
  {
    slug: 'porto-de-cabedelo',
    nome: 'Cabedelo',
    estado: 'Paraíba',
    uf: 'PB',
    regiao: 'nordeste',
    descricao: 'Litoral paraibano próximo a João Pessoa. Praias tranquilas, recifes e acesso ao Polo de Ecoturismo.',
    tags: ['Recife', 'Snorkel', 'Ecoturismo'],
    porto: { slug: 'porto-de-cabedelo', nome: 'Porto de Cabedelo', estado: 'PB', dataFile: '30540.json' },
    afiliado: { label: '🤿 Máscaras de Snorkel', url: 'https://www.amazon.com.br/s?k=mascara+snorkel+recife&tag=mareagora-20' },
    unsplashQuery: 'paraiba beach reef snorkel brazil',
  },
  {
    slug: 'porto-do-recife',
    nome: 'Recife',
    estado: 'Pernambuco',
    uf: 'PE',
    regiao: 'nordeste',
    descricao: 'Veneza Brasileira com praias urbanas e recifes de corais únicos. Porto Digital e cultura vibrante.',
    tags: ['Recife', 'Urbana', 'Cultura'],
    porto: { slug: 'porto-do-recife', nome: 'Porto do Recife', estado: 'PE', dataFile: '30645.json' },
    afiliado: { label: '🤿 Equipamentos de Mergulho', url: 'https://www.amazon.com.br/s?k=equipamentos+mergulho+recife&tag=mareagora-20' },
    unsplashQuery: 'recife pernambuco beach coral reef brazil',
  },
  {
    slug: 'porto-de-suape',
    nome: 'Porto de Suape',
    estado: 'Pernambuco',
    uf: 'PE',
    regiao: 'nordeste',
    descricao: 'Litoral sul pernambucano com praias de piscinas naturais e recifes. Acesso a Porto de Galinhas.',
    tags: ['Piscinas naturais', 'Recife', 'Família'],
    porto: { slug: 'porto-de-suape', nome: 'Porto de Suape', estado: 'PE', dataFile: '30686.json' },
    afiliado: { label: '🤿 Kits de Snorkel', url: 'https://www.amazon.com.br/s?k=kit+snorkel+piscina+natural&tag=mareagora-20' },
    unsplashQuery: 'porto de galinhas natural pools reef brazil',
  },
  {
    slug: 'porto-de-maceio',
    nome: 'Maceió',
    estado: 'Alagoas',
    uf: 'AL',
    regiao: 'nordeste',
    descricao: 'Paraíso das águas esmeralda. Piscinas naturais de Pajuçara e Ponta Verde com coral de segunda a segunda.',
    tags: ['Piscinas naturais', 'Água cristalina', 'Família'],
    porto: { slug: 'porto-de-maceio', nome: 'Porto de Maceió', estado: 'AL', dataFile: '30725.json' },
    afiliado: { label: '🤿 Máscaras de Snorkel Full Face', url: 'https://www.amazon.com.br/s?k=mascara+snorkel+full+face&tag=mareagora-20' },
    unsplashQuery: 'maceio alagoas emerald water natural pools brazil',
  },
  {
    slug: 'terminal-maritimo-inacio-barbosa',
    nome: 'Terminal Inácio Barbosa',
    estado: 'Sergipe',
    uf: 'SE',
    regiao: 'nordeste',
    descricao: 'Litoral sergipano com praias pouco exploradas e rica vida marinha. Ótimo para pesca e mergulho.',
    tags: ['Pesca', 'Mergulho', 'Tranquilo'],
    porto: { slug: 'terminal-maritimo-inacio-barbosa', nome: 'Terminal Inácio Barbosa', estado: 'SE', dataFile: '30810.json' },
    afiliado: { label: '🎣 Varas de Surf Fishing', url: 'https://www.amazon.com.br/s?k=vara+surf+fishing&tag=mareagora-20' },
    unsplashQuery: 'sergipe beach fishing brazil atlantic',
  },
  {
    slug: 'capitania-dos-portos-de-sergipe',
    nome: 'Aracaju',
    estado: 'Sergipe',
    uf: 'SE',
    regiao: 'nordeste',
    descricao: 'Capital sergipana com praias urbanas e o belo litoral de Atalaia. Clima quente o ano todo.',
    tags: ['Urbana', 'Família', 'Cultura'],
    porto: { slug: 'capitania-dos-portos-de-sergipe', nome: 'Capitania dos Portos de Sergipe', estado: 'SE', dataFile: '30825.json' },
    afiliado: { label: '🏖️ Equipamentos de Praia', url: 'https://www.amazon.com.br/s?k=equipamentos+praia+verao&tag=mareagora-20' },
    unsplashQuery: 'aracaju atalaia beach sergipe brazil',
  },
  {
    slug: 'arquipelago-de-fernando-de-noronha',
    nome: 'Fernando de Noronha',
    estado: 'Pernambuco',
    uf: 'PE',
    regiao: 'nordeste',
    descricao: 'O arquipélago mais bonito do Brasil. Golfinhos, tubarões e as águas mais transparentes do Atlântico Sul.',
    tags: ['Mergulho', 'Golfinhos', 'Patrimônio UNESCO'],
    porto: { slug: 'arquipelago-de-fernando-de-noronha', nome: 'Fernando de Noronha', estado: 'PE', dataFile: '30955.json' },
    afiliado: { label: '🤿 Equipamentos de Mergulho Pro', url: 'https://www.amazon.com.br/s?k=equipamento+mergulho+profissional&tag=mareagora-20' },
    unsplashQuery: 'fernando de noronha ocean dolphins diving brazil',
  },

  // ── Região Sudeste ────────────────────────────────────────────────────────
  {
    slug: 'porto-de-madre-de-deus',
    nome: 'Madre de Deus',
    estado: 'Bahia',
    uf: 'BA',
    regiao: 'sudeste',
    descricao: 'Ilha na Baía de Todos os Santos com praias tranquilas e boa pesca. Acesso de ferry de Salvador.',
    tags: ['Ilha', 'Pesca', 'Tranquilo'],
    porto: { slug: 'porto-de-madre-de-deus', nome: 'Porto Madre de Deus', estado: 'BA', dataFile: '40118.json' },
    afiliado: { label: '🎣 Kits de Pesca Esportiva', url: 'https://www.amazon.com.br/s?k=kit+pesca+esportiva&tag=mareagora-20' },
    unsplashQuery: 'bahia island bay beach brazil tranquil',
  },
  {
    slug: 'porto-de-aratu',
    nome: 'Base de Aratu',
    estado: 'Bahia',
    uf: 'BA',
    regiao: 'sudeste',
    descricao: 'Baía de Todos os Santos com águas calmas e pesca abundante. Próximo a Salvador e praias da ilha.',
    tags: ['Pesca', 'Baía', 'Navegação'],
    porto: { slug: 'porto-de-aratu', nome: 'Base de Aratu', estado: 'BA', dataFile: '40135.json' },
    afiliado: { label: '🚤 Acessórios Náuticos', url: 'https://www.amazon.com.br/s?k=acessorios+nauticos+barco&tag=mareagora-20' },
    unsplashQuery: 'todos os santos bay bahia calm water brazil',
  },
  {
    slug: 'porto-de-salvador',
    nome: 'Salvador',
    estado: 'Bahia',
    uf: 'BA',
    regiao: 'sudeste',
    descricao: 'Capital baiana com praias vibrantes como Porto da Barra e Ondina. Cultura rica, axé e mar azul-turquesa.',
    tags: ['Cultura', 'Urbana', 'Mergulho'],
    porto: { slug: 'porto-de-salvador', nome: 'Porto de Salvador', estado: 'BA', dataFile: '40141.json' },
    afiliado: { label: '🤿 Equipamentos de Mergulho', url: 'https://www.amazon.com.br/s?k=equipamentos+mergulho+snorkel&tag=mareagora-20' },
    unsplashQuery: 'salvador bahia porto da barra turquoise beach',
  },
  {
    slug: 'porto-de-ilheus',
    nome: 'Ilhéus',
    estado: 'Bahia',
    uf: 'BA',
    regiao: 'sudeste',
    descricao: 'Terra do cacau e de Jorge Amado. Praias selvagens como Olivença e Cururupe com ondas para surf.',
    tags: ['Surf', 'Natureza', 'Cultura'],
    porto: { slug: 'porto-de-ilheus', nome: 'Porto de Ilhéus', estado: 'BA', dataFile: '40145.json' },
    afiliado: { label: '🏄 Pranchas e Acessórios Surf', url: 'https://www.amazon.com.br/s?k=prancha+surf+acessorios&tag=mareagora-20' },
    unsplashQuery: 'ilheus bahia surf beach brazil coast',
  },
  {
    slug: 'terminal-de-barra-do-riacho',
    nome: 'Barra do Riacho',
    estado: 'Espírito Santo',
    uf: 'ES',
    regiao: 'sudeste',
    descricao: 'Litoral capixaba com praias de ondas fortes e boa pesca. Região de natureza preservada no norte do ES.',
    tags: ['Surf', 'Pesca', 'Natureza'],
    porto: { slug: 'terminal-de-barra-do-riacho', nome: 'Terminal de Barra do Riacho', estado: 'ES', dataFile: '40240.json' },
    afiliado: { label: '🏄 Pranchas de Surf', url: 'https://www.amazon.com.br/s?k=prancha+surf+iniciante&tag=mareagora-20' },
    unsplashQuery: 'espirito santo coast surf beach brazil',
  },
  {
    slug: 'porto-de-tubarao',
    nome: 'Porto de Tubarão',
    estado: 'Espírito Santo',
    uf: 'ES',
    regiao: 'sudeste',
    descricao: 'Vitória e litoral capixaba com praias urbanas e de natureza. Base para explorar as belas praias do ES.',
    tags: ['Surf', 'Pesca', 'Urbana'],
    porto: { slug: 'porto-de-tubarao', nome: 'Porto de Tubarão', estado: 'ES', dataFile: '40255.json' },
    afiliado: { label: '🎣 Varas de Surf Fishing', url: 'https://www.amazon.com.br/s?k=vara+surf+fishing+mar&tag=mareagora-20' },
    unsplashQuery: 'vitoria espirito santo urban beach brazil',
  },
  {
    slug: 'porto-de-vitoria',
    nome: 'Vitória',
    estado: 'Espírito Santo',
    uf: 'ES',
    regiao: 'sudeste',
    descricao: 'Capital do ES com praias urbanas e acesso a Guarapari, Anchieta e as famosas praias de areia monazítica.',
    tags: ['Urbana', 'Família', 'Infraestrutura'],
    porto: { slug: 'porto-de-vitoria', nome: 'Porto de Vitória', estado: 'ES', dataFile: '40256.json' },
    afiliado: { label: '🏖️ Equipamentos de Praia', url: 'https://www.amazon.com.br/s?k=equipamentos+praia+familia&tag=mareagora-20' },
    unsplashQuery: 'guarapari espirito santo beach brazil',
  },
  {
    slug: 'ilha-da-trindade',
    nome: 'Ilha da Trindade',
    estado: 'Espírito Santo',
    uf: 'ES',
    regiao: 'sudeste',
    descricao: 'Ilha oceânica remota a 1.200 km do ES. Tartarugas marinhas, mergulho selvagem e paisagem vulcânica única.',
    tags: ['Mergulho', 'Tartarugas', 'Remoto'],
    porto: { slug: 'ilha-da-trindade', nome: 'Ilha da Trindade', estado: 'ES', dataFile: '40263.json' },
    afiliado: { label: '🤿 Equipamentos de Mergulho Pro', url: 'https://www.amazon.com.br/s?k=equipamento+mergulho+profissional&tag=mareagora-20' },
    unsplashQuery: 'remote ocean island volcanic diving sea turtle',
  },
  {
    slug: 'terminal-da-ponta-do-ubu-i',
    nome: 'Ponta do Ubu',
    estado: 'Espírito Santo',
    uf: 'ES',
    regiao: 'sudeste',
    descricao: 'Litoral sul do ES com praias tranquilas de pesca e surf. Acesso a Anchieta e suas históricas praias.',
    tags: ['Pesca', 'Surf', 'Tranquilo'],
    porto: { slug: 'terminal-da-ponta-do-ubu-i', nome: 'Terminal da Ponta do Ubu', estado: 'ES', dataFile: '40292.json' },
    afiliado: { label: '🎣 Equipamentos de Pesca', url: 'https://www.amazon.com.br/s?k=equipamentos+pesca+surf+fishing&tag=mareagora-20' },
    unsplashQuery: 'anchieta espirito santo beach fishing tranquil',
  },
  {
    slug: 'terminal-maritimo-de-imbetiba',
    nome: 'Macaé',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    regiao: 'sudeste',
    descricao: 'Litoral norte fluminense com praias como Imbetiba e Barra de Macaé. Pesca esportiva e surf.',
    tags: ['Pesca', 'Surf', 'Norte RJ'],
    porto: { slug: 'terminal-maritimo-de-imbetiba', nome: 'Terminal de Imbetiba', estado: 'RJ', dataFile: '50116.json' },
    afiliado: { label: '🎣 Varas de Surf Fishing', url: 'https://www.amazon.com.br/s?k=vara+pesca+surf+fishing&tag=mareagora-20' },
    unsplashQuery: 'rio de janeiro coast surf fishing beach',
  },
  {
    slug: 'rio-de-janeiro-fiscal',
    nome: 'Rio de Janeiro',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    regiao: 'sudeste',
    descricao: 'Cidade Maravilhosa com Ipanema, Copacabana e Barra da Tijuca. Cristo Redentor, surf e vida urbana.',
    tags: ['Surf', 'Urbana', 'Lifestyle'],
    porto: { slug: 'rio-de-janeiro-fiscal', nome: 'Rio de Janeiro - Ilha Fiscal', estado: 'RJ', dataFile: '50140.json' },
    afiliado: { label: '🏄 Pranchas e Acessórios Surf', url: 'https://www.amazon.com.br/s?k=prancha+surf+acessorios&tag=mareagora-20' },
    unsplashQuery: 'rio de janeiro ipanema copacabana beach',
  },
  {
    slug: 'porto-de-itaguai',
    nome: 'Porto de Itaguaí',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    regiao: 'sudeste',
    descricao: 'Costa Verde fluminense com praias de Muriqui e Mangaratiba. Acesso à Ilha Grande e baías preservadas.',
    tags: ['Ilha Grande', 'Mergulho', 'Natureza'],
    porto: { slug: 'porto-de-itaguai', nome: 'Porto de Itaguaí', estado: 'RJ', dataFile: '50145.json' },
    afiliado: { label: '🤿 Kits de Snorkel', url: 'https://www.amazon.com.br/s?k=kit+snorkel+mergulho&tag=mareagora-20' },
    unsplashQuery: 'ilha grande costa verde rio de janeiro bay',
  },
  {
    slug: 'porto-do-forno',
    nome: 'Arraial do Cabo',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    regiao: 'sudeste',
    descricao: 'O Caribe Brasileiro. Praia dos Anjos e Praia Grande com água turquesa e mergulho de classe mundial.',
    tags: ['Mergulho', 'Água cristalina', 'Surf'],
    porto: { slug: 'porto-do-forno', nome: 'Porto do Forno', estado: 'RJ', dataFile: '50156.json' },
    afiliado: { label: '🤿 Equipamentos de Mergulho', url: 'https://www.amazon.com.br/s?k=equipamentos+mergulho+profissional&tag=mareagora-20' },
    unsplashQuery: 'arraial do cabo turquoise water crystal clear beach brazil',
  },
  {
    slug: 'terminal-da-ilha-guaiba',
    nome: 'Terminal Ilha Guaíba',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    regiao: 'sudeste',
    descricao: 'Litoral sul fluminense com acesso a Angra dos Reis e Ilha Grande. Mergulho e paisagens de tirar o fôlego.',
    tags: ['Mergulho', 'Ilha', 'Natureza'],
    porto: { slug: 'terminal-da-ilha-guaiba', nome: 'Terminal da Ilha Guaíba', estado: 'RJ', dataFile: '50165.json' },
    afiliado: { label: '🤿 Kits de Snorkel', url: 'https://www.amazon.com.br/s?k=kit+snorkel+profissional&tag=mareagora-20' },
    unsplashQuery: 'angra dos reis island tropical green water',
  },
  {
    slug: 'porto-do-acu',
    nome: 'Porto do Açu',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    regiao: 'sudeste',
    descricao: 'Litoral norte fluminense com praias preservadas e pesca artesanal. Região de Campos dos Goytacazes.',
    tags: ['Pesca', 'Natureza', 'Tranquilo'],
    porto: { slug: 'porto-do-acu', nome: 'Porto do Açu', estado: 'RJ', dataFile: '50169.json' },
    afiliado: { label: '🎣 Kits de Pesca Artesanal', url: 'https://www.amazon.com.br/s?k=kit+pesca+artesanal+mar&tag=mareagora-20' },
    unsplashQuery: 'north rio de janeiro coast fishing beach preserved',
  },
  {
    slug: 'porto-de-angra-dos-reis',
    nome: 'Angra dos Reis',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    regiao: 'sudeste',
    descricao: 'Baía com 365 ilhas e praias paradisíacas. Mergulho, vela e natureza exuberante da Costa Verde.',
    tags: ['Mergulho', 'Vela', 'Ilha'],
    porto: { slug: 'porto-de-angra-dos-reis', nome: 'Porto de Angra dos Reis', estado: 'RJ', dataFile: '50170.json' },
    afiliado: { label: '🤿 Equipamentos de Mergulho', url: 'https://www.amazon.com.br/s?k=equipamentos+mergulho+snorkel&tag=mareagora-20' },
    unsplashQuery: 'angra dos reis islands sailing paradise brazil',
  },
  {
    slug: 'porto-de-sao-sebastiao',
    nome: 'São Sebastião',
    estado: 'São Paulo',
    uf: 'SP',
    regiao: 'sudeste',
    descricao: 'Litoral norte paulista com acesso a Ilhabela. Praias de Maresias, Boiçucanga e mergulho fantástico.',
    tags: ['Mergulho', 'Surf', 'Ilhabela'],
    porto: { slug: 'porto-de-sao-sebastiao', nome: 'Porto de São Sebastião', estado: 'SP', dataFile: '50210.json' },
    afiliado: { label: '🤿 Kits de Mergulho', url: 'https://www.amazon.com.br/s?k=kit+mergulho+snorkel+profissional&tag=mareagora-20' },
    unsplashQuery: 'ilhabela sao paulo beach diving brazil',
  },
  {
    slug: 'porto-de-santos',
    nome: 'Santos',
    estado: 'São Paulo',
    uf: 'SP',
    regiao: 'sudeste',
    descricao: 'Maior porto da América Latina com o famoso calçadão de Santos e praias urbanizadas da Baixada Santista.',
    tags: ['Urbana', 'Família', 'Infraestrutura'],
    porto: { slug: 'porto-de-santos', nome: 'Porto de Santos', estado: 'SP', dataFile: '50228.json' },
    afiliado: { label: '🏖️ Equipamentos de Praia', url: 'https://www.amazon.com.br/s?k=equipamentos+praia+verao+familia&tag=mareagora-20' },
    unsplashQuery: 'santos sao paulo urban beach boardwalk brazil',
  },
  {
    slug: 'guaruja',
    nome: 'Guarujá',
    estado: 'São Paulo',
    uf: 'SP',
    regiao: 'sudeste',
    descricao: 'Balneário mais popular do litoral paulista. Enseada, Pitangueiras e Tombo com ondas para surf.',
    tags: ['Surf', 'Família', 'Infraestrutura'],
    porto: { slug: 'guaruja', nome: 'Guarujá', estado: 'SP', dataFile: '50228.json' },
    afiliado: { label: '🏄 Pranchas de Surf', url: 'https://www.amazon.com.br/s?k=prancha+surf+iniciante&tag=mareagora-20' },
    unsplashQuery: 'guaruja sao paulo surf beach waves brazil',
  },
  {
    slug: 'sao-vicente',
    nome: 'São Vicente',
    estado: 'São Paulo',
    uf: 'SP',
    regiao: 'sudeste',
    descricao: 'Primeira cidade do Brasil com praias tranquilas e família. Ilha Porchat e belas vistas da Baixada Santista.',
    tags: ['Família', 'Histórica', 'Tranquilo'],
    porto: { slug: 'sao-vicente', nome: 'São Vicente', estado: 'SP', dataFile: '50228.json' },
    afiliado: { label: '🏖️ Equipamentos de Praia', url: 'https://www.amazon.com.br/s?k=equipamentos+praia+familia&tag=mareagora-20' },
    unsplashQuery: 'sao paulo coast family beach calm sea brazil',
  },
  {
    slug: 'praia-grande',
    nome: 'Praia Grande',
    estado: 'São Paulo',
    uf: 'SP',
    regiao: 'sudeste',
    descricao: 'A maior orla do litoral paulista com 22 km de extensão. Surf, vôlei e muita infraestrutura para famílias.',
    tags: ['Surf', 'Família', 'Longa orla'],
    porto: { slug: 'praia-grande', nome: 'Praia Grande', estado: 'SP', dataFile: '50228.json' },
    afiliado: { label: '🏄 Pranchas e Acessórios Surf', url: 'https://www.amazon.com.br/s?k=prancha+surf+profissional&tag=mareagora-20' },
    unsplashQuery: 'long beach sand surf volleyball sao paulo brazil',
  },
  {
    slug: 'bertioga',
    nome: 'Bertioga',
    estado: 'São Paulo',
    uf: 'SP',
    regiao: 'sudeste',
    descricao: 'Cidade histórica com praias desertas e natureza preservada. Forte São João e o canal de Bertioga.',
    tags: ['Histórica', 'Natureza', 'Tranquilo'],
    porto: { slug: 'bertioga', nome: 'Bertioga', estado: 'SP', dataFile: '50228.json' },
    afiliado: { label: '🎣 Varas de Pesca Esportiva', url: 'https://www.amazon.com.br/s?k=vara+pesca+esportiva&tag=mareagora-20' },
    unsplashQuery: 'bertioga sao paulo deserted beach nature preserved',
  },
  {
    slug: 'riviera-de-sao-lourenco',
    nome: 'Riviera de São Lourenço',
    estado: 'São Paulo',
    uf: 'SP',
    regiao: 'sudeste',
    descricao: 'Resort planejado com praias limpas e infraestrutura de alto padrão. Surf e vida ao ar livre.',
    tags: ['Surf', 'Infraestrutura', 'Família'],
    porto: { slug: 'riviera-de-sao-lourenco', nome: 'Riviera de São Lourenço', estado: 'SP', dataFile: '50228.json' },
    afiliado: { label: '🏄 Pranchas de Surf', url: 'https://www.amazon.com.br/s?k=prancha+surf+acessorios&tag=mareagora-20' },
    unsplashQuery: 'clean beach resort surf sao paulo brazil',
  },
  {
    slug: 'mongagua',
    nome: 'Mongaguá',
    estado: 'São Paulo',
    uf: 'SP',
    regiao: 'sudeste',
    descricao: 'Balneário tranquilo da Baixada Santista com boas ondas para surf e ambiente familiar.',
    tags: ['Surf', 'Família', 'Tranquilo'],
    porto: { slug: 'mongagua', nome: 'Mongaguá', estado: 'SP', dataFile: '50228.json' },
    afiliado: { label: '🏄 Acessórios de Surf', url: 'https://www.amazon.com.br/s?k=acessorios+surf+wetsuit&tag=mareagora-20' },
    unsplashQuery: 'sao paulo lowada coast family surf waves beach',
  },
  {
    slug: 'itanhaem',
    nome: 'Itanhaém',
    estado: 'São Paulo',
    uf: 'SP',
    regiao: 'sudeste',
    descricao: 'Uma das cidades mais antigas do Brasil com praias selvagens e rios cristalinos. Ótima para pesca.',
    tags: ['Histórica', 'Pesca', 'Natureza'],
    porto: { slug: 'itanhaem', nome: 'Itanhaém', estado: 'SP', dataFile: '50228.json' },
    afiliado: { label: '🎣 Kits de Pesca', url: 'https://www.amazon.com.br/s?k=kit+pesca+mar+completo&tag=mareagora-20' },
    unsplashQuery: 'historic sao paulo coast river beach nature',
  },
  {
    slug: 'peruibe',
    nome: 'Peruíbe',
    estado: 'São Paulo',
    uf: 'SP',
    regiao: 'sudeste',
    descricao: 'Cidade do clima especial com praias preservadas e a ESEC Juréia-Itatins. Ecoturismo e pesca.',
    tags: ['Ecoturismo', 'Pesca', 'Preservada'],
    porto: { slug: 'peruibe', nome: 'Peruíbe', estado: 'SP', dataFile: '50228.json' },
    afiliado: { label: '🎣 Varas de Pesca', url: 'https://www.amazon.com.br/s?k=vara+pesca+praia+completo&tag=mareagora-20' },
    unsplashQuery: 'preserved beach ecotourism atlantic forest sao paulo',
  },

  // ── Região Sul ────────────────────────────────────────────────────────────
  {
    slug: 'barra-de-paranagua-sueste',
    nome: 'Barra de Paranaguá',
    estado: 'Paraná',
    uf: 'PR',
    regiao: 'sul',
    descricao: 'Entrada da Baía de Paranaguá com praias selvagens e manguezais preservados. Pesca esportiva abundante.',
    tags: ['Pesca', 'Natureza', 'Selvagem'],
    porto: { slug: 'barra-de-paranagua-sueste', nome: 'Barra de Paranaguá', estado: 'PR', dataFile: '60130.json' },
    afiliado: { label: '🎣 Varas de Pesca Esportiva', url: 'https://www.amazon.com.br/s?k=vara+pesca+esportiva+mar&tag=mareagora-20' },
    unsplashQuery: 'paranagua bay mangrove wild beach fishing parana',
  },
  {
    slug: 'porto-de-paranagua',
    nome: 'Paranaguá',
    estado: 'Paraná',
    uf: 'PR',
    regiao: 'sul',
    descricao: 'Porto histórico com acesso à Ilha do Mel. Praias preservadas, farol e trilhas em área protegida.',
    tags: ['Ilha do Mel', 'Histórica', 'Natureza'],
    porto: { slug: 'porto-de-paranagua', nome: 'Porto de Paranaguá', estado: 'PR', dataFile: '60132.json' },
    afiliado: { label: '🏕️ Equipamentos de Camping', url: 'https://www.amazon.com.br/s?k=equipamentos+camping+praia&tag=mareagora-20' },
    unsplashQuery: 'ilha do mel parana beach lighthouse nature brazil',
  },
  {
    slug: 'barra-de-paranagua-galheta',
    nome: 'Canal da Galheta',
    estado: 'Paraná',
    uf: 'PR',
    regiao: 'sul',
    descricao: 'Canal de acesso à Baía de Paranaguá com praias e natureza preservada do litoral paranaense.',
    tags: ['Natureza', 'Pesca', 'Navegação'],
    porto: { slug: 'barra-de-paranagua-galheta', nome: 'Canal da Galheta', estado: 'PR', dataFile: '60135.json' },
    afiliado: { label: '🎣 Kits de Pesca', url: 'https://www.amazon.com.br/s?k=kit+pesca+completo+mar&tag=mareagora-20' },
    unsplashQuery: 'parana coast channel nature fishing brazil south',
  },
  {
    slug: 'terminal-portuario-da-ponta-do-felix',
    nome: 'Antonina',
    estado: 'Paraná',
    uf: 'PR',
    regiao: 'sul',
    descricao: 'Cidade histórica na Baía de Paranaguá com acesso a praias preservadas e Morretes pela Serra do Mar.',
    tags: ['Histórica', 'Natureza', 'Baía'],
    porto: { slug: 'terminal-portuario-da-ponta-do-felix', nome: 'Terminal Ponta do Félix', estado: 'PR', dataFile: '60139.json' },
    afiliado: { label: '🚤 Acessórios Náuticos', url: 'https://www.amazon.com.br/s?k=acessorios+nauticos+pesca&tag=mareagora-20' },
    unsplashQuery: 'antonina paranagua bay historic port brazil',
  },
  {
    slug: 'porto-de-sao-francisco-do-sul',
    nome: 'São Francisco do Sul',
    estado: 'Santa Catarina',
    uf: 'SC',
    regiao: 'sul',
    descricao: 'Ilha com 40 praias e centro histórico tombado. Praias de Ubatuba e Enseada para surf e mergulho.',
    tags: ['Surf', 'Histórica', 'Ilha'],
    porto: { slug: 'porto-de-sao-francisco-do-sul', nome: 'Porto de São Francisco do Sul', estado: 'SC', dataFile: '60225.json' },
    afiliado: { label: '🏄 Acessórios de Surf', url: 'https://www.amazon.com.br/s?k=acessorios+surf+prancha&tag=mareagora-20' },
    unsplashQuery: 'santa catarina island surf beach historic brazil',
  },
  {
    slug: 'porto-de-itajai',
    nome: 'Itajaí',
    estado: 'Santa Catarina',
    uf: 'SC',
    regiao: 'sul',
    descricao: 'Porto catarinense próximo a Balneário Camboriú. Acesso às melhores praias e infraestrutura do SC.',
    tags: ['Surf', 'Infraestrutura', 'Família'],
    porto: { slug: 'porto-de-itajai', nome: 'Porto de Itajaí', estado: 'SC', dataFile: '60235.json' },
    afiliado: { label: '🏄 Pranchas de Surf', url: 'https://www.amazon.com.br/s?k=prancha+surf+profissional&tag=mareagora-20' },
    unsplashQuery: 'balneario camboriu santa catarina beach brazil',
  },
  {
    slug: 'porto-de-florianopolis',
    nome: 'Florianópolis',
    estado: 'Santa Catarina',
    uf: 'SC',
    regiao: 'sul',
    descricao: 'Ilha da Magia com 42 praias para todos os gostos. Jurerê, Joaquina, Campeche e surf de classe mundial.',
    tags: ['Surf', 'Família', 'Ilha'],
    porto: { slug: 'porto-de-florianopolis', nome: 'Porto de Florianópolis', estado: 'SC', dataFile: '60245.json' },
    afiliado: { label: '🏄 Pranchas e Acessórios Surf', url: 'https://www.amazon.com.br/s?k=prancha+surf+acessorios&tag=mareagora-20' },
    unsplashQuery: 'florianopolis ilha magica beach surf joaquina brazil',
  },
  {
    slug: 'porto-de-imbituba',
    nome: 'Imbituba',
    estado: 'Santa Catarina',
    uf: 'SC',
    regiao: 'sul',
    descricao: 'Capital da Baleia Franca. Praias selvagens como Rosa e Luz com as melhores ondas de SC.',
    tags: ['Surf', 'Baleias', 'Natureza'],
    porto: { slug: 'porto-de-imbituba', nome: 'Porto de Imbituba', estado: 'SC', dataFile: '60250.json' },
    afiliado: { label: '🏄 Pranchas de Surf Pro', url: 'https://www.amazon.com.br/s?k=prancha+surf+profissional&tag=mareagora-20' },
    unsplashQuery: 'imbituba whale watching surf beach santa catarina',
  },
  {
    slug: 'porto-do-rio-grande',
    nome: 'Rio Grande',
    estado: 'Rio Grande do Sul',
    uf: 'RS',
    regiao: 'sul',
    descricao: 'Cidade portuária gaúcha com praias na Lagoa dos Patos e Oceano Atlântico. Pesca e kitesurf.',
    tags: ['Kitesurf', 'Pesca', 'Lagoa'],
    porto: { slug: 'porto-do-rio-grande', nome: 'Porto do Rio Grande', estado: 'RS', dataFile: '60380.json' },
    afiliado: { label: '🪁 Kits de Kitesurf', url: 'https://www.amazon.com.br/s?k=kitesurf+kit+completo&tag=mareagora-20' },
    unsplashQuery: 'rio grande do sul beach kitesurf lagoon south brazil',
  },
]

const UF_COLORS: Record<string, string> = {
  PA: '#2e7d32', AP: '#388e3c',
  MA: '#e65100', PI: '#ef6c00', CE: '#e05c3a', RN: '#f57f17',
  PB: '#7b1fa2', PE: '#c62828', AL: '#00838f', SE: '#1565c0',
  BA: '#4caf80', ES: '#0277bd', RJ: '#9c6dca', SP: '#f0a500',
  PR: '#2196c4', SC: '#1976d2', RS: '#5c6bc0',
}

const REGIAO_LABELS: Record<string, string> = {
  norte: '🌿 Região Norte',
  nordeste: '☀️ Região Nordeste',
  sudeste: '🌆 Região Sudeste',
  sul: '❄️ Região Sul',
}

// ─── componente ──────────────────────────────────────────────────────────────
export default function GuiaPraias() {
  const regioes = ['norte', 'nordeste', 'sudeste', 'sul'] as const

  return (
    <main className="guia-praias">
      {/* ── Hero ── */}
      <section className="gp-hero">
        <div className="gp-hero-bg" />
        <div className="gp-hero-content">
          <span className="gp-eyebrow">🌊 MaréAgora · Guia de Praias</span>
          <h1>
            Descubra as melhores<br />
            <em>praias do Brasil</em>
          </h1>
          <p>
            Dados de marés em tempo real, condições de ondas e dicas de pesca
            para cada praia — tudo integrado ao MaréAgora.
          </p>
        </div>
        <div className="gp-waves">
          <div className="gp-wave" />
          <div className="gp-wave" />
        </div>
      </section>

      {/* ── AdSense topo ── */}
      <div className="gp-ad-slot">
        <span>Publicidade</span>
      </div>

      {/* ── Grid por região ── */}
      <section className="gp-grid-section">
        <div className="gp-container">
          {regioes.map((regiao) => {
            const praiasDaRegiao = PRAIAS.filter((p) => p.regiao === regiao)
            return (
              <div key={regiao} className="gp-regiao-block">
                <div className="gp-section-header">
                  <p className="gp-label">{REGIAO_LABELS[regiao]}</p>
                  <h2>Praias com dados de maré ao vivo</h2>
                </div>
                <div className="gp-grid">
                  {praiasDaRegiao.map((praia) => (
                    <div key={praia.slug} className="gp-card-wrapper">
                      <Link href={`/guia-praias/${praia.slug}`} className="gp-card">
                        <div className="gp-card-img">
                          <img
                            src={`https://source.unsplash.com/600x340/?${encodeURIComponent(praia.unsplashQuery)}`}
                            alt={`Foto de ${praia.nome}`}
                            loading="lazy"
                            onError={(e) => {
                              const t = e.target as HTMLImageElement
                              t.src = 'https://source.unsplash.com/600x340/?beach,brazil,ocean'
                            }}
                          />
                        </div>
                        <div className="gp-card-body">
                        <div className="gp-card-header">
                          <span
                            className="gp-uf-badge"
                            style={{ background: UF_COLORS[praia.uf] ?? '#2196c4' }}
                          >
                            {praia.uf}
                          </span>
                          <span className="gp-card-estado">{praia.estado}</span>
                        </div>
                        <h3 className="gp-card-nome">{praia.nome}</h3>
                        <p className="gp-card-desc">{praia.descricao}</p>
                        <div className="gp-tags">
                          {praia.tags.map((tag) => (
                            <span key={tag} className="gp-tag">{tag}</span>
                          ))}
                        </div>
                        <div className="gp-card-footer">
                          <span className="gp-live-dot" /> Maré ao vivo
                          <span className="gp-arrow">→</span>
                        </div>
                        </div>
                      </Link>
                      {praia.afiliado && (
                        <a
                          href={praia.afiliado.url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="gp-amazon-btn"
                        >
                          <span>{praia.afiliado.label}</span>
                          <span className="gp-amazon-logo">amazon</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── AdSense meio ── */}
      <div className="gp-ad-slot gp-ad-wide">
        <span>Publicidade</span>
      </div>

      {/* ── SEO text block ── */}
      <section className="gp-seo-section">
        <div className="gp-container gp-seo-grid">
          <div>
            <h2>Por que usar o MaréAgora para planejar sua viagem à praia?</h2>
            <p>
              O MaréAgora usa dados oficiais da <strong>Marinha do Brasil</strong> para calcular
              as marés com precisão em mais de 40 portos ao longo do litoral brasileiro.
              Combinamos esses dados com previsões de ondas e vento da <strong>Open-Meteo Marine API</strong>
              para você saber exatamente o que esperar antes de chegar na praia.
            </p>
            <p>
              Seja para surfe, pesca esportiva, mergulho ou simplesmente relaxar na areia,
              conhecer o horário das marés faz toda a diferença para aproveitar o melhor que o
              litoral tem a oferecer.
            </p>
          </div>
          <div>
            <h3>Regiões cobertas</h3>
            <ul className="gp-estados-list">
              <li><span className="gp-check">✓</span> Região Norte — PA, AP</li>
              <li><span className="gp-check">✓</span> Região Nordeste — MA, PI, CE, RN, PB, PE, AL, SE</li>
              <li><span className="gp-check">✓</span> Região Sudeste — BA, ES, RJ, SP</li>
              <li><span className="gp-check">✓</span> Região Sul — PR, SC, RS</li>
            </ul>
            <p className="gp-coming-soon">Em breve: mais localidades em cada estado</p>
          </div>
        </div>
      </section>

      <style>{styles}</style>
    </main>
  )
}

// ─── estilos ─────────────────────────────────────────────────────────────────
const styles = `
  .guia-praias { background: #04111f; min-height: 100vh; }

  /* Hero */
  .gp-hero {
    position: relative; min-height: 50vh; display: flex;
    align-items: center; justify-content: center;
    text-align: center; padding: 6rem 2rem 8rem; overflow: hidden;
  }
  .gp-hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, #04111f 0%, #0a2340 60%, #0e3a6e 100%);
  }
  .gp-hero-content { position: relative; z-index: 2; max-width: 680px; }
  .gp-eyebrow {
    display: inline-block; font-size: 0.75rem; letter-spacing: 0.18em;
    text-transform: uppercase; color: #2196c4;
    border: 1px solid #2196c4; padding: 0.3rem 1rem;
    border-radius: 100px; margin-bottom: 1.5rem;
  }
  .gp-hero h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 900;
    color: #f0e6c8; line-height: 1.1; margin-bottom: 1rem;
  }
  .gp-hero h1 em { font-style: italic; color: #2196c4; }
  .gp-hero p { color: #d4c49a; font-size: 1.05rem; line-height: 1.7; }

  /* Waves */
  .gp-waves { position: absolute; bottom: 0; left: 0; right: 0; height: 80px; overflow: hidden; }
  .gp-wave {
    position: absolute; bottom: 0; width: 200%; height: 100%;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 80'%3E%3Cpath fill='%230a2340' d='M0,40 C360,70 720,10 1080,40 C1260,55 1380,30 1440,40 L1440,80 L0,80 Z'/%3E%3C/svg%3E") repeat-x bottom;
    background-size: 50% 100%; animation: gpWave 8s linear infinite;
  }
  .gp-wave:nth-child(2) {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 80'%3E%3Cpath fill='%2304111f' fill-opacity='0.8' d='M0,55 C300,20 600,70 900,45 C1100,28 1300,60 1440,50 L1440,80 L0,80 Z'/%3E%3C/svg%3E") repeat-x bottom;
    background-size: 60% 100%; animation: gpWave 12s linear infinite reverse;
  }
  @keyframes gpWave { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* Ad slot */
  .gp-ad-slot {
    background: rgba(14,58,110,0.15);
    border-top: 1px dashed rgba(33,150,196,0.15);
    border-bottom: 1px dashed rgba(33,150,196,0.15);
    padding: 1.2rem; text-align: center;
    color: rgba(212,196,154,0.25); font-size: 0.7rem;
    letter-spacing: 0.15em; text-transform: uppercase;
  }
  .gp-ad-wide { min-height: 100px; display: flex; align-items: center; justify-content: center; }

  /* Grid section */
  .gp-grid-section { padding: 4rem 2rem; }
  .gp-container { max-width: 1100px; margin: 0 auto; }
  .gp-regiao-block { margin-bottom: 5rem; }
  .gp-section-header { margin-bottom: 2.5rem; }
  .gp-label {
    font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #2196c4; margin-bottom: 0.5rem; font-weight: 700;
  }
  .gp-section-header h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.5rem, 3vw, 2.2rem); color: #f0e6c8; font-weight: 700;
  }

  /* Card wrapper */
  .gp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.25rem;
  }
  .gp-card-wrapper { display: flex; flex-direction: column; }

  /* Cards */
  .gp-card {
    background: rgba(14,58,110,0.25);
    border: 1px solid rgba(33,150,196,0.15);
    border-radius: 16px 16px 0 0;
    padding: 0;
    text-decoration: none; display: flex; flex-direction: column; gap: 0;
    transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
    position: relative; overflow: hidden; flex: 1;
  }

  /* Imagem do card */
  .gp-card-img {
    width: 100%; height: 180px; overflow: hidden; flex-shrink: 0;
  }
  .gp-card-img img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.4s ease;
    display: block;
  }
  .gp-card:hover .gp-card-img img { transform: scale(1.06); }

  /* Conteúdo interno do card (abaixo da imagem) */
  .gp-card-body {
    padding: 1.25rem 1.5rem 1.5rem;
    display: flex; flex-direction: column; gap: 0.75rem; flex: 1;
  }
  .gp-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #2196c4, transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  .gp-card:hover { transform: translateY(-4px); border-color: rgba(33,150,196,0.4); box-shadow: 0 12px 40px rgba(0,0,0,0.35); }
  .gp-card:hover::before { opacity: 1; }

  .gp-card-header { display: flex; align-items: center; gap: 0.75rem; }
  .gp-uf-badge {
    font-size: 0.65rem; font-weight: 900; color: white;
    padding: 0.15rem 0.5rem; border-radius: 4px;
  }
  .gp-card-estado { font-size: 0.75rem; color: #7ab8d0; text-transform: uppercase; letter-spacing: 0.05em; }
  .gp-card-nome { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #f0e6c8; margin: 0; }
  .gp-card-desc { font-size: 0.85rem; color: #8a9aaa; line-height: 1.5; margin: 0; }
  .gp-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .gp-tag {
    font-size: 0.65rem; padding: 0.15rem 0.5rem; border-radius: 100px;
    background: rgba(33,150,196,0.1); color: #7ab8d0; border: 1px solid rgba(33,150,196,0.2);
  }
  .gp-card-footer {
    margin-top: auto; padding-top: 1rem; border-top: 1px solid rgba(33,150,196,0.1);
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.7rem; font-weight: 700; color: #2196c4; text-transform: uppercase; letter-spacing: 0.1em;
  }
  .gp-live-dot { width: 6px; height: 6px; background: #2196c4; border-radius: 50%; animation: gpPulse 1.5s infinite; }
  .gp-arrow { margin-left: auto; font-size: 1rem; transition: transform 0.2s; }
  .gp-card:hover .gp-arrow { transform: translateX(4px); }

  @keyframes gpPulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

  /* Amazon affiliate button */
  .gp-amazon-btn {
    display: flex; align-items: center; justify-content: space-between;
    gap: 0.5rem; padding: 0.6rem 1rem;
    background: rgba(255,153,0,0.07);
    border: 1px solid rgba(255,153,0,0.22);
    border-top: none; border-radius: 0 0 16px 16px;
    text-decoration: none; font-size: 0.75rem;
    color: #ffaa33; font-weight: 600;
    transition: background 0.2s, border-color 0.2s;
  }
  .gp-amazon-btn:hover {
    background: rgba(255,153,0,0.15);
    border-color: rgba(255,153,0,0.45);
    color: #ffbb55;
  }
  .gp-amazon-logo {
    font-size: 0.6rem; font-weight: 900; letter-spacing: 0.05em;
    color: #ff9900; text-transform: lowercase;
    border: 1px solid rgba(255,153,0,0.5);
    padding: 0.1rem 0.4rem; border-radius: 3px; white-space: nowrap;
  }

  /* SEO Section */
  .gp-seo-section { padding: 5rem 2rem; background: #04111f; border-top: 1px solid rgba(33,150,196,0.1); }
  .gp-seo-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 4rem; }
  .gp-seo-section h2 { font-family: 'Playfair Display', serif; font-size: 2rem; color: #f0e6c8; margin-bottom: 1.5rem; }
  .gp-seo-section h3 { font-size: 1.1rem; color: #2196c4; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem; }
  .gp-seo-section p { color: #8a9aaa; line-height: 1.8; margin-bottom: 1.2rem; }
  .gp-seo-section strong { color: #d4c49a; }

  .gp-estados-list { list-style: none; padding: 0; display: grid; gap: 0.75rem; margin-bottom: 2rem; }
  .gp-estados-list li { color: #f0e6c8; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; }
  .gp-check { color: #4caf80; font-weight: bold; }
  .gp-coming-soon { font-size: 0.75rem; color: #5a6a7a; font-style: italic; }

  @media (max-width: 768px) {
    .gp-seo-grid { grid-template-columns: 1fr; gap: 3rem; }
    .gp-hero { padding: 4rem 1.5rem 6rem; }
    .gp-grid { grid-template-columns: 1fr; }
  }
`
