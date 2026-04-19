import { useRoute } from 'wouter';
import { Link } from 'wouter';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Streamdown } from 'streamdown';
import { useEffect, useState } from 'react';

const articleContent: Record<string, { title: string; date: string; category: string; content: string }> = {
  'como-ler-tabua-de-mares': {
    title: 'Como Ler a Tábua de Marés: Guia Completo',
    date: '2026-01-15',
    category: 'Educativo',
    content: `# Como Ler a Tábua de Marés: Guia Completo

A tábua de marés é uma das ferramentas mais importantes para quem vive ou frequenta o litoral brasileiro. Seja para pesca, surf, mergulho, passeios de barco ou simplesmente para aproveitar a praia com segurança, entender as marés faz toda a diferença. Neste guia completo, você vai aprender tudo o que precisa saber para interpretar a tábua de marés do MaréAgora.

## O Que É a Tábua de Marés?

A tábua de marés é um documento que prevê, com antecedência, os horários e as alturas das marés altas (preamar) e baixas (baixamar) em um determinado porto ou localidade. No Brasil, os dados oficiais são publicados anualmente pela Diretoria de Hidrografia e Navegação (DHN) da Marinha do Brasil.

Essas previsões são calculadas com base em modelos astronômicos que consideram a posição relativa da Lua, do Sol e da Terra. Por isso, a tábua é extremamente precisa em condições normais — mas pode variar alguns centímetros dependendo das condições meteorológicas do dia, como vento forte e pressão atmosférica.

## O Que Significa Cada Coluna da Tábua?

Ao consultar a tábua de marés do MaréAgora, você verá os seguintes dados:

### Horário
Indica a hora exata (no fuso de Brasília, UTC-3) em que a maré atinge seu ponto mais alto ou mais baixo. Por exemplo, se a tábua mostra "06:23", a maré alta ou baixa ocorrerá às 6h23 da manhã.

### Altura (em metros)
Indica a altura da lâmina d'água em relação ao nível de referência (chamado de datum). No Brasil, o datum utilizado é a Tábua de Redução, que representa o nível mais baixo possível da maré astronômica.

- **Valores altos** (ex: 1,8m, 2,3m): indicam maré alta — a praia fica mais estreita, o mar avança
- **Valores baixos** (ex: 0,1m, 0,3m): indicam maré baixa — a areia fica exposta, surgem piscinas naturais

### Tipo de Maré (Preamar ou Baixamar)
- **Preamar (PM)**: maré alta, ponto máximo do ciclo
- **Baixamar (BM)**: maré baixa, ponto mínimo do ciclo

## Quantas Marés Ocorrem por Dia?

Na maior parte do litoral brasileiro, ocorrem **duas marés altas e duas marés baixas por dia** — esse regime é chamado de semidiurno. Isso significa que, a cada aproximadamente 6 horas e 12 minutos, a maré muda de direção.

Existem, porém, algumas regiões onde o regime de marés é diferente, como no Pará e no Maranhão, onde as marés podem ser muito mais amplas e com comportamento distinto.

## Como Interpretar a Amplitude da Maré?

A amplitude é a diferença entre a maré alta e a maré baixa consecutivas. Quanto maior a amplitude, mais dramática é a variação do nível do mar naquele dia.

- **Amplitude pequena** (menos de 0,5m): maré de quadratura, ocorre nas fases de quarto crescente e quarto minguante da Lua
- **Amplitude grande** (acima de 1,5m): maré de sizígia, ocorre nas fases de lua nova e lua cheia

Nas marés de sizígia, as praias ficam muito mais expostas na maré baixa — ideal para visitar piscinas naturais, recifes de corais e bancos de areia. Por outro lado, a maré alta sobe bastante e pode surpreender quem está na beira da praia.

## A Relação Entre as Marés e a Lua

A Lua é a principal responsável pelas marés. Sua força gravitacional "puxa" a água dos oceanos, criando as ondas de maré que circulam pelo planeta.

- **Lua Nova e Lua Cheia**: o Sol, a Terra e a Lua estão alinhados, somando suas forças gravitacionais. Resultado: marés mais extremas (sizígia)
- **Quarto Crescente e Quarto Minguante**: o Sol e a Lua estão em ângulo reto em relação à Terra. Resultado: marés mais suaves (quadratura)

Por isso, se você quer encontrar piscinas naturais ou mergulhar em recifes com mais facilidade, planeje sua visita para os dias de lua nova ou lua cheia, quando a maré baixa fica mais seca.`,
  },
  'o-que-causa-as-mares': {
    title: 'O Que Causa as Marés? A Ciência Por Trás do Fenômeno',
    date: '2026-01-14',
    category: 'Ciência',
    content: `# O Que Causa as Marés? A Ciência Por Trás do Fenômeno

As marés são um dos fenômenos naturais mais fascinantes e importantes do nosso planeta. Elas influenciam desde a vida marinha até as atividades humanas no litoral. Mas o que realmente causa as marés? Neste artigo, vamos explorar a ciência por trás deste fenômeno extraordinário.

## A Força Gravitacional da Lua

A causa principal das marés é a **força gravitacional da Lua**. A Lua orbita a Terra a uma distância média de cerca de 384.400 km, e sua gravidade exerce uma atração sobre os oceanos do nosso planeta.

Quando a Lua está acima de um ponto específico do oceano, sua gravidade "puxa" a água em sua direção, criando uma protuberância (ou "onda de maré") no nível do mar. Essa é a razão pela qual temos maré alta quando a Lua está no zênite (diretamente acima).

## O Papel do Sol

Embora a Lua seja a principal responsável pelas marés, o **Sol também desempenha um papel importante**. Apesar de estar muito mais distante, o Sol tem uma massa enormemente maior, o que lhe permite exercer uma atração gravitacional significativa sobre os oceanos terrestres.

A atração gravitacional do Sol é aproximadamente 46% da atração da Lua. Isso significa que o Sol influencia as marés, mas em menor escala.

## Marés de Sizígia e Quadratura

A interação entre as forças gravitacionais da Lua e do Sol cria dois tipos principais de marés:

### Marés de Sizígia
Ocorrem quando o Sol, a Terra e a Lua estão alinhados (durante a lua nova e lua cheia). Nessas situações, as forças gravitacionais do Sol e da Lua se somam, criando as marés mais extremas — as maiores altas e as menores baixas do mês.

### Marés de Quadratura
Ocorrem quando o Sol e a Lua estão em ângulo reto em relação à Terra (durante os quartos crescente e minguante). Nessas situações, as forças se opõem parcialmente, resultando em marés com menor amplitude.

## Por Que Temos Duas Marés Altas por Dia?

Você pode estar se perguntando: se a Lua causa a maré alta, por que temos duas marés altas por dia e não apenas uma?

A resposta está na **rotação da Terra**. Enquanto a Lua orbita a Terra, a Terra também está girando. A protuberância de água causada pela Lua não fica estacionária — ela se move ao redor do planeta conforme a Terra gira.

Além disso, há uma segunda protuberância no lado oposto da Terra. Isso ocorre porque a gravidade da Lua puxa a água mais fortemente no lado mais próximo, enquanto no lado oposto, a força centrífuga da órbita Terra-Lua cria uma segunda protuberância.

Assim, conforme a Terra gira, cada ponto no oceano passa por duas protuberâncias de água em aproximadamente 24 horas e 50 minutos, resultando em duas marés altas e duas marés baixas por dia.

## O Atraso das Marés

Você deve ter notado que as marés "atrasam" cerca de 50 minutos a cada dia. Isso ocorre porque a Lua orbita a Terra na mesma direção que a Terra gira, mas em uma velocidade diferente.

A Lua completa uma órbita ao redor da Terra em aproximadamente 29,5 dias. Isso significa que a Lua "avança" em relação aos pontos fixos na Terra. Por isso, o ciclo das marés é de aproximadamente 24 horas e 50 minutos, e não exatamente 24 horas.

## Outros Fatores que Influenciam as Marés

Além da gravidade da Lua e do Sol, existem outros fatores que influenciam as marés:

### Batimetria
A profundidade e a forma do fundo do oceano afetam como as marés se comportam. Em águas rasas, as marés podem ser amplificadas, enquanto em águas profundas, elas podem ser menos pronunciadas.

### Continentes e Bacias Oceânicas
A presença de continentes e a forma das bacias oceânicas canalizam e modificam o movimento das águas de maré.

### Condições Meteorológicas
Ventos fortes, pressão atmosférica baixa e frentes frias podem alterar o nível do mar, criando o que é chamado de "maré meteorológica".

## Conclusão

As marés são um fenômeno complexo e fascinante causado principalmente pela gravidade da Lua, com contribuições significativas do Sol. Compreender as marés nos ajuda a aproveitar melhor o oceano e a respeitar o poder da natureza. Com a tábua de marés do MaréAgora, você pode planejar suas atividades no mar com base nesse conhecimento científico.`,
  },
  'piscinas-naturais-brasil': {
    title: 'Piscinas Naturais do Brasil: Onde Encontrar e Quando Visitar',
    date: '2026-01-13',
    category: 'Turismo',
    content: `# Piscinas Naturais do Brasil: Onde Encontrar e Quando Visitar

As piscinas naturais são uma das maravilhas do litoral brasileiro. Formadas por recifes de corais, rochas e bancos de areia durante a maré baixa, essas piscinas oferecem uma experiência única de contato com a natureza. Neste guia, vamos explorar as melhores piscinas naturais do Brasil e quando visitá-las.

## O Que São Piscinas Naturais?

Piscinas naturais são áreas rasas e protegidas do oceano, geralmente formadas por recifes de corais ou rochas que funcionam como barreiras naturais. Durante a maré baixa, essas áreas ficam expostas e criam pequenas "piscinas" de água cristalina, perfeitas para banho e observação da vida marinha.

## A Importância da Maré

A maré é o fator mais importante para visitar piscinas naturais. A melhor época para visitá-las é durante a **maré baixa**, especialmente quando a altura fica abaixo de 0,5 metros.

Nas marés de **lua nova e lua cheia**, a maré baixa costuma ficar ainda mais seca, revelando mais dos recifes e criando piscinas ainda mais impressionantes. Por isso, planeje sua visita para esses períodos.

## Principais Piscinas Naturais do Brasil

### Nordeste

O Nordeste é a região com mais piscinas naturais do Brasil. Destacam-se:

- **Maragogi (Alagoas)**: Piscinas naturais de corais com água cristalina
- **Praia de Galinhas (Pernambuco)**: Famosa por suas piscinas naturais e vida marinha
- **Jericoacoara (Ceará)**: Piscinas naturais e lagoas de água doce
- **Lençóis Maranhenses (Maranhão)**: Lagoas de água doce entre dunas

### Sudeste

- **Caraíva (Bahia)**: Piscinas naturais e recifes de corais
- **Praia do Rosa (Santa Catarina)**: Piscinas naturais e paisagem selvagem

### Sul

- **Bombinhas (Santa Catarina)**: Piscinas naturais e mergulho em recifes
- **Torres (Rio Grande do Sul)**: Piscinas naturais entre rochas

## Como Aproveitar ao Máximo

1. **Consulte a Tábua de Marés**: Use o MaréAgora para saber exatamente quando será a maré baixa
2. **Leve Equipamento de Proteção**: Leve chinelos de borracha, protetor solar e roupa de banho
3. **Respeite o Ambiente**: Não pise nos corais e não recolha animais marinhos
4. **Leve Água e Alimento**: Leve água potável e lanches, pois pode não haver vendedores no local
5. **Vá com Antecedência**: Chegue cedo para pegar os melhores horários e evitar multidões

## Melhor Época do Ano

A melhor época para visitar piscinas naturais é durante os meses de **março a outubro**, quando há menos chuvas e o mar está mais calmo. No entanto, você pode visitar durante todo o ano, desde que consulte a tábua de marés.

## Conclusão

As piscinas naturais do Brasil são destinos imprescindíveis para quem ama o mar e a natureza. Com a ajuda da tábua de marés do MaréAgora, você pode planejar a visita perfeita e aproveitar ao máximo essas maravilhas naturais.`,
  },
  'pesca-e-mares': {
    title: 'Pesca e Marés: Como as Fases da Maré Influenciam a Pescaria',
    date: '2026-01-12',
    category: 'Pesca',
    content: `# Pesca e Marés: Como as Fases da Maré Influenciam a Pescaria

Para pescadores experientes, a maré é tão importante quanto o equipamento. A compreensão de como as marés influenciam o comportamento dos peixes pode fazer a diferença entre uma pescaria bem-sucedida e uma decepcionante. Neste artigo, vamos explorar a relação entre marés e pesca.

## Como as Marés Afetam os Peixes

As marés influenciam os peixes de várias maneiras:

### Movimento da Água
Durante a maré enchendo e vazando, há movimento constante da água. Esse movimento traz alimento (plâncton, pequenos peixes) para os peixes maiores, tornando-os mais ativos e dispostos a atacar iscas.

### Mudanças de Profundidade
Conforme a maré muda, a profundidade da água em determinadas áreas também muda. Os peixes se movem para acompanhar essas mudanças, procurando profundidades confortáveis.

### Temperatura da Água
A maré pode trazer água mais quente ou mais fria, dependendo da região. Essas mudanças de temperatura afetam a atividade dos peixes.

## Melhores Momentos para Pescar

### Maré Enchendo
A maré enchendo é geralmente um excelente momento para pescar. Conforme a água sobe, os peixes se movem para áreas mais rasas em busca de alimento. A corrente traz comida, tornando os peixes mais ativos.

### Maré Vazando
A maré vazando também é um bom momento. Conforme a água desce, os peixes se movem para áreas mais profundas, mas antes disso, há um período de intensa atividade alimentar.

### Transições de Maré
Os momentos de transição entre maré alta e baixa (ou vice-versa) são frequentemente os melhores para pescar. Nessas transições, há movimento máximo de água e atividade máxima dos peixes.

## Piores Momentos para Pescar

### Maré Parada
O pior momento para pescar é quando a maré está "parada" — no pico da maré alta ou no pico da maré baixa. Nessas situações, há pouco movimento de água e os peixes tendem a ficar inativos.

## Dicas Práticas

1. **Consulte a Tábua de Marés**: Use o MaréAgora para planejar sua pescaria nos melhores horários
2. **Conheça Seu Local**: Cada praia e rio tem características diferentes. Aprenda qual é a melhor maré para seu local favorito
3. **Adapte Sua Técnica**: Mude sua técnica de pesca conforme a maré muda
4. **Leve Paciência**: Mesmo nos melhores horários, a pesca requer paciência e persistência

## Conclusão

Compreender a influência das marés na pesca é essencial para qualquer pescador. Com a tábua de marés do MaréAgora, você pode planejar suas pescarias para os melhores momentos e aumentar significativamente suas chances de sucesso.`,
  },
  'melhores-praias-surf-mares': {
    title: 'Melhores Praias para Surf e Como a Maré Influencia as Ondas',
    date: '2026-01-11',
    category: 'Surf',
    content: `# Melhores Praias para Surf e Como a Maré Influencia as Ondas

O surf é uma das atividades mais populares no litoral brasileiro, e a maré é um fator crucial para a qualidade das ondas. Neste artigo, vamos explorar como as marés influenciam o surf e quais são as melhores praias para surfar no Brasil.

## Como a Maré Influencia as Ondas

A maré afeta as ondas de várias maneiras:

### Profundidade da Água
A profundidade da água sobre o banco de areia ou recife onde a onda quebra muda com a maré. Em maré baixa, a água é mais rasa, o que pode fazer as ondas quebrarem mais rapidamente e com mais potência. Em maré alta, a água é mais profunda, o que pode fazer as ondas quebrarem mais lentamente e com menos potência.

### Formato da Onda
O formato da onda também muda com a maré. Em algumas praias, a maré baixa produz ondas mais tubulares e perfeitas, enquanto em outras, a maré alta é melhor.

### Correntes
A maré cria correntes que podem afetar o movimento da onda e a capacidade do surfista de remar.

## Melhores Praias para Surf no Brasil

### Nordeste
- **Praia de Atalaia (Pernambuco)**: Ondas consistentes e bom para iniciantes
- **Praia de Jericoacoara (Ceará)**: Ondas fortes e bom para avançados
- **Praia de Areia Branca (Rio Grande do Norte)**: Ondas tubulares

### Sudeste
- **Praia de Maresias (São Paulo)**: Ondas fortes e bom para avançados
- **Praia de Itamambuca (São Paulo)**: Ondas consistentes
- **Praia da Costa (Espírito Santo)**: Ondas boas o ano todo

### Sul
- **Praia de Garopaba (Santa Catarina)**: Ondas fortes e bom para avançados
- **Praia de Imbituba (Santa Catarina)**: Ondas consistentes
- **Praia de Torres (Rio Grande do Sul)**: Ondas boas o ano todo

## Descobrindo a Maré Ideal da Sua Praia

Cada praia tem uma "maré ideal" para surf. Para descobrir a sua:

1. **Observe Ao Longo do Tempo**: Visite sua praia favorita em diferentes marés e observe qual produz as melhores ondas
2. **Converse com Locais**: Pergunte aos surfistas locais qual é a melhor maré
3. **Use o MaréAgora**: Consulte a tábua de marés para planejar suas sessões de surf

## Conclusão

A maré é um fator crucial para o surf. Com a compreensão de como as marés influenciam as ondas e com a ajuda da tábua de marés do MaréAgora, você pode planejar suas sessões de surf para os melhores momentos e aproveitar ao máximo as ondas do Brasil.`,
  },
  'mergulho-e-mares': {
    title: 'Mergulho e Marés: Como Escolher o Melhor Momento',
    date: '2026-01-10',
    category: 'Mergulho',
    content: `# Mergulho e Marés: Como Escolher o Melhor Momento

O mergulho é uma experiência extraordinária, e a maré é um fator fundamental para garantir uma mergulha segura e produtiva. Neste artigo, vamos explorar como as marés influenciam o mergulho e como escolher o melhor momento para mergulhar.

## Como as Marés Afetam o Mergulho

### Visibilidade
A maré afeta a visibilidade subaquática. Em algumas regiões, a maré baixa traz água mais clara, enquanto em outras, a maré alta é melhor. Isso depende das características locais.

### Correntes
A maré cria correntes que podem afetar o mergulho. Correntes fortes podem ser perigosas para mergulhadores inexperientes, enquanto correntes fracas são ideais.

### Profundidade
A profundidade muda com a maré. Em maré baixa, algumas áreas podem ficar muito rasas, enquanto em maré alta, a profundidade aumenta.

## Melhores Momentos para Mergulhar

### Maré Parada
Contrariamente ao que muitos pensam, a maré parada (no pico da maré alta ou baixa) é frequentemente o melhor momento para mergulhar. Nessas situações, há pouca corrente, tornando o mergulho mais seguro e confortável.

### Maré Baixa
A maré baixa é excelente para explorar recifes de corais e vida marinha em águas rasas. A visibilidade é frequentemente melhor, e há mais vida marinha visível.

## Dicas de Segurança

1. **Sempre Mergulhe com um Parceiro**: Nunca mergulhe sozinho
2. **Verifique a Previsão de Maré**: Use o MaréAgora para verificar as condições de maré antes de mergulhar
3. **Respeite Seus Limites**: Mergulhe apenas em profundidades e condições apropriadas para seu nível de experiência
4. **Leve Equipamento Apropriado**: Certifique-se de ter todo o equipamento necessário e em bom estado

## Melhores Locais para Mergulho no Brasil

- **Recife de Coral de Maragogi (Alagoas)**: Excelente vida marinha
- **Parque Nacional Marinho de Fernando de Noronha (Pernambuco)**: Mergulho de classe mundial
- **Ilhas Cagarras (Rio de Janeiro)**: Mergulho em recifes
- **Costão do Santinho (Santa Catarina)**: Mergulho em rochas

## Conclusão

Compreender a influência das marés no mergulho é essencial para uma experiência segura e agradável. Com a tábua de marés do MaréAgora, você pode planejar seus mergulhos para os melhores momentos e aproveitar ao máximo as maravilhas subaquáticas do Brasil.`,
  },
};

export default function BlogArticle() {
  const [, params] = useRoute('/blog/:slug');
  const [content, setContent] = useState<typeof articleContent[string] | null>(null);

  useEffect(() => {
    if (params?.slug && articleContent[params.slug]) {
      setContent(articleContent[params.slug]);
    }
  }, [params?.slug]);

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container py-12">
          <p className="text-gray-600">Artigo não encontrado</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-r from-maritime to-blue-700 text-white py-12 md:py-16">
          <div className="container max-w-3xl">
            <Link href="/blog">
              <a className="flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Voltar para Blog
              </a>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.title}</h1>
            <div className="flex flex-wrap gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(content.date).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {content.category}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container max-w-3xl prose prose-lg max-w-none">
            <Streamdown>{content.content}</Streamdown>
          </div>
        </section>

        {/* Ad Space */}
        <section className="py-8 bg-gray-50 border-t border-gray-200">
          <div className="container text-center text-gray-500 text-sm">
            <p>Espaço para anúncios (AdSense)</p>
          </div>
        </section>

        {/* Related Articles */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-bold text-maritime mb-8">Leia Também</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/blog/como-ler-tabua-de-mares">
                <a className="card-maritime hover:no-underline">
                  <h3 className="text-lg font-bold text-maritime mb-2 hover:text-accent-maritime transition-colors">
                    Como Ler a Tábua de Marés
                  </h3>
                  <p className="text-gray-600 text-sm">Guia completo para interpretar a tábua de marés</p>
                </a>
              </Link>
              <Link href="/blog/o-que-causa-as-mares">
                <a className="card-maritime hover:no-underline">
                  <h3 className="text-lg font-bold text-maritime mb-2 hover:text-accent-maritime transition-colors">
                    O Que Causa as Marés?
                  </h3>
                  <p className="text-gray-600 text-sm">A ciência por trás do fenômeno</p>
                </a>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
