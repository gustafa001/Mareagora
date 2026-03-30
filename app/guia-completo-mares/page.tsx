import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guia Completo de Marés do Brasil: Tudo Que Você Precisa Saber em 2026 — MaréAgora',
  description: 'Aprenda sobre marés, como ler tábuas de marés, tipos de marés, influência da Lua, e como usar para pesca, surf e navegação. Guia completo com dados da Marinha do Brasil.',
  openGraph: {
    title: 'Guia Completo de Marés do Brasil 2026',
    description: 'Aprenda tudo sobre marés, leitura de tábuas e aplicações práticas',
    url: 'https://www.mareagora.com.br/guia-completo-mares',
    type: 'article',
  },
};

export default function GuiaPage() {
  return (
    <main className="min-h-screen pb-20">
      <NavBar />

      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="container relative z-10 text-white text-center pt-24 md:pt-16">
          <div className="flex flex-col gap-3 items-center px-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-syne leading-tight max-w-4xl">
              Guia Completo de Marés
            </h1>
            <p className="text-sm sm:text-lg md:text-xl opacity-90 font-medium font-syne">
              Tudo que você precisa saber sobre marés do Brasil em 2026
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <article className="prose prose-slate max-w-4xl mx-auto mt-16">
          <p className="lead text-lg text-gray-700 mb-8">
            Se você é pescador, surfista, mergulhador ou simplesmente alguém que ama o mar, entender marés é essencial para sua segurança e sucesso nas atividades marítimas. Este guia abrangente explica tudo o que você precisa saber sobre marés no Brasil, desde os conceitos básicos até aplicações práticas.
          </p>

          <h2>O Que é Maré? Entenda o Fenômeno</h2>
          
          <p>
            <strong>Maré</strong> é a mudança periódica do nível do mar causada pela atração gravitacional exercida pela Lua e, em menor escala, pelo Sol sobre os oceanos da Terra. Esse fenômeno é tão previsível que pode ser calculado com precisão para décadas à frente.
          </p>

          <h3>Como a Lua Causa as Marés</h3>
          
          <p>
            A Lua orbita a Terra a aproximadamente 384.400 km de distância. Sua gravidade puxa a água dos oceanos, criando uma "protuberância" no lado da Terra voltado para a Lua. Simultaneamente, há uma segunda protuberância no lado oposto da Terra, devido à força centrífuga.
          </p>

          <p>
            Conforme a Terra gira em suas 24 horas, cada localidade passa por essas duas protuberâncias, resultando em <strong>duas marés altas (preamares) e duas marés baixas (baixamares) por dia</strong> em muitos lugares do Brasil.
          </p>

          <h3>A Influência do Sol nas Marés</h3>
          
          <p>
            Embora a Lua seja o principal agente das marés (sua gravidade é cerca de 2,2 vezes mais forte que a do Sol em relação às marés), o Sol também contribui significativamente. Quando o Sol e a Lua se alinham (fases de Lua cheia e Lua nova), suas forças se somam, criando as <strong>marés de sizígia</strong>, com maior amplitude.
          </p>

          <p>
            Quando o Sol e a Lua estão em ângulo reto (quartos crescente e minguante), suas forças se opõem parcialmente, resultando em <strong>marés mortas</strong>, com menor amplitude.
          </p>

          <h2>Tipos de Marés no Brasil</h2>
          
          <p>
            As marés brasileiras apresentam características distintas conforme a região. Compreender essas diferenças é crucial para qualquer atividade marítima.
          </p>

          <h3>Marés Semidiurnas</h3>
          
          <p>
            A maioria do litoral brasileiro, especialmente nas regiões <strong>Sudeste e Nordeste</strong>, apresenta marés <strong>semidiurnas</strong>: duas preamares e duas baixamares por dia lunar (aproximadamente 24 horas e 50 minutos).
          </p>

          <p>
            A amplitude (diferença entre preamar e baixamar) nessas regiões varia de 0,5 m a 2,0 m, dependendo da fase lunar e da topografia costeira.
          </p>

          <h3>Marés Diurnas</h3>
          
          <p>
            Em algumas regiões como o <strong>litoral do Piauí e Maranhão</strong>, observam-se marés <strong>diurnas</strong>: apenas uma preamar e uma baixamar por dia lunar.
          </p>

          <h3>Marés Mixtas</h3>
          
          <p>
            Algumas localidades apresentam características intermediárias, com transições entre padrões semidiurnos e diurnos.
          </p>

          <h3>Marés Extremas: Região Norte</h3>
          
          <p>
            A região <strong>Norte do Brasil</strong>, especialmente em estuários amazônicos como em Belém e Macapá, apresenta algumas das <strong>maiores amplitudes de maré do mundo</strong>, alcançando até <strong>6 a 12 metros</strong>!
          </p>

          <p>
            Essas amplitudes extremas são resultado da morfologia do estuário do Rio Amazonas, que atua como um funil amplificador das marés.
          </p>

          <h2>Como Ler uma Tábua de Marés</h2>
          
          <p>
            Uma tábua de marés é uma tabela que mostra os horários de preamar e baixamar, assim como as alturas do nível do mar em cada momento. Aprender a ler corretamente é fundamental.
          </p>

          <h3>Componentes de Uma Tábua de Marés</h3>
          
          <h4>1. Horário (Hora Local)</h4>
          <p>
            O horário é sempre dado em horário local do fuso horário da região. No Brasil, a maioria das tabelas usa:
          </p>
          <ul>
            <li>UTC-3 (Brasília, Sudeste, Sul)</li>
            <li>UTC-4 (Amazônia)</li>
            <li>UTC-5 (Acre)</li>
          </ul>

          <h4>2. Tipo de Maré</h4>
          <ul>
            <li><strong>Preamar (↑)</strong>: Maré alta, nível máximo do mar</li>
            <li><strong>Baixamar (↓)</strong>: Maré baixa, nível mínimo do mar</li>
          </ul>

          <h4>3. Altura em Metros</h4>
          <p>
            A altura é medida em relação a um <strong>nível de redução</strong> (datum), que varia conforme o porto. Valores podem ser positivos ou negativos.
          </p>

          <h4>4. Nível Médio</h4>
          <p>
            O nível médio é a altura média da superfície do mar ao longo de um ciclo completo. Marés acima dele indicam maré subindo; abaixo, maré descendo.
          </p>

          <h3>Exemplo Prático</h3>
          
          <p>
            Para a cidade de <strong>Santos (SP)</strong>, uma entrada típica em uma tábua de marés seria:
          </p>

          <table>
            <thead>
              <tr>
                <th>Horário</th>
                <th>Tipo</th>
                <th>Altura</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>02:06</td>
                <td>Preamar</td>
                <td>1.38 m</td>
              </tr>
              <tr>
                <td>07:42</td>
                <td>Baixamar</td>
                <td>0.40 m</td>
              </tr>
              <tr>
                <td>13:31</td>
                <td>Preamar</td>
                <td>1.28 m</td>
              </tr>
              <tr>
                <td>19:47</td>
                <td>Baixamar</td>
                <td>0.11 m</td>
              </tr>
            </tbody>
          </table>

          <p>
            Isso significa:
          </p>
          <ul>
            <li>A maré sobe até 1.38 m às 02:06</li>
            <li>Desce para 0.40 m às 07:42</li>
            <li>Sobe novamente para 1.28 m às 13:31</li>
            <li>Desce para 0.11 m às 19:47</li>
          </ul>

          <h2>Fatores que Influenciam as Marés Locais</h2>
          
          <p>
            Além da Lua e do Sol, outros fatores afetam as marés em localidades específicas.
          </p>

          <h3>Topografia Costeira</h3>
          
          <p>
            A forma da costa, profundidade do mar e presença de baías e estuários podem amplificar ou amortecer as marés. A Baía de Fundy (Canadá) é famosa pelas maiores marés do mundo justamente por sua forma de funil.
          </p>

          <h3>Correntes Oceânicas</h3>
          
          <p>
            Correntes como a do Brasil (litoral sudeste) e a Equatorial podem afetar a propagação das ondas de maré.
          </p>

          <h3>Variações Sazonais</h3>
          
          <p>
            Embora a maré astronômica seja previsível, variações sazonais na pressão atmosférica e em sistemas de frentes frias podem causar <strong>marés meteorológicas</strong> que se sobrepõem à maré astronômica.
          </p>

          <h3>Período de Retardo</h3>
          
          <p>
            Não há sincronização perfeita entre a posição da Lua e a maré máxima. Esse atraso varia conforme a localidade, podendo ser de horas.
          </p>

          <h2>Aplicações Práticas das Marés</h2>

          <h3>🎣 Para Pescadores</h3>
          
          <p>
            A pesca é significativamente afetada pelas marés. Peixes tendem a se alimentar mais ativamente durante:
          </p>

          <ul>
            <li><strong>Períodos de virada de maré</strong>: Quando a maré muda de direção, o movimento da água atrai peixes</li>
            <li><strong>Marés de sizígia</strong>: Com maior movimento de água, mais alimento disponível</li>
            <li><strong>Maré baixa em baías fechadas</strong>: Peixes concentram-se em áreas mais profundas</li>
          </ul>

          <p>
            <strong>Dica profissional</strong>: Chegue ao local 30 minutos antes da virada de maré para posicionar adequadamente.
          </p>

          <h3>🏄 Para Surfistas</h3>
          
          <p>
            Nem todas as ondas dependem da maré, mas a altura do mar afeta onde as ondas quebram:
          </p>

          <ul>
            <li><strong>Maré baixa</strong>: Melhor para picos rasos e recifes</li>
            <li><strong>Maré média</strong>: Ideal na maioria das praias arenosas</li>
            <li><strong>Maré alta</strong>: Melhor em praias com bastante profundidade</li>
          </ul>

          <p>
            As melhores ondas no Sudeste costumam aparecer com <strong>mar de sudeste combinado com maré baixa a média</strong>.
          </p>

          <h3>🤿 Para Mergulhadores</h3>
          
          <p>
            Mergulhadores aproveitam marés para:
          </p>

          <ul>
            <li><strong>Correnteza controlada</strong>: Mergulhos em correnteza são mais seguros em maré morta (menor movimento)</li>
            <li><strong>Visibilidade</strong>: Maré alta em recifes garante maior profundidade e visibilidade</li>
            <li><strong>Segurança</strong>: Evite grandes correntezas; planeje mergulhos próximo a períodos de preamar ou baixamar</li>
          </ul>

          <h3>⛵ Para Navegadores</h3>
          
          <p>
            Navegadores profissionais devem:
          </p>

          <ul>
            <li><strong>Consultar tábuas de marés</strong> antes de cada viagem</li>
            <li><strong>Calcular profundidade disponível</strong>: Somar a profundidade do mapa (carta náutica) com a altura da maré atual</li>
            <li><strong>Evitar encalhes</strong>: Em rios e baías com pouca profundidade, só navegue em maré alta</li>
            <li><strong>Planejar saídas</strong>: Sincronize saídas com marés favoráveis</li>
          </ul>

          <h2>Recursos Oficiais: Dados da Marinha do Brasil</h2>
          
          <p>
            Todas as tábuas de marés brasileiras são baseadas em dados publicados pela <strong>Diretoria de Hidrografia e Navegação (DHN)</strong> da Marinha do Brasil. Essa é a fonte oficial e mais confiável de previsões de marés para fins profissionais.
          </p>

          <p>
            A MaréAgora utiliza esses dados oficiais para garantir a máxima precisão em suas previsões.
          </p>

          <h2>Período de Retardo e Variações Mensais</h2>
          
          <p>
            É importante entender que a maré não segue um padrão fixo dia após dia. Existem variações sistemáticas:
          </p>

          <h3>Ciclo Mensal das Marés</h3>
          
          <p>
            As marés seguem um ciclo mensal baseado nas fases da Lua:
          </p>

          <ul>
            <li><strong>Lua Nova e Lua Cheia</strong>: Marés de <strong>sizígia</strong> (amplitude máxima)</li>
            <li><strong>Quartos Crescente e Minguante</strong>: Marés <strong>mortas</strong> (amplitude mínima)</li>
            <li><strong>Período de retardo</strong>: A maré máxima não ocorre no dia da Lua cheia, mas alguns dias depois</li>
          </ul>

          <h3>Período de Retardo Prático</h3>
          
          <p>
            Em muitos portos brasileiros, o retardo é de 1-3 dias após a Lua cheia. Isso significa que as marés maiores não ocorrem exatamente na Lua cheia, mas alguns dias depois.
          </p>

          <h2>Tábuas de Marés por Região do Brasil</h2>

          <h3>Região Norte</h3>
          
          <p>
            A região com as maiores variações de maré do mundo. Locais como <Link href="/mare/macapa" className="text-blue-600 hover:underline">Macapá</Link> e <Link href="/mare/porto-de-belem" className="text-blue-600 hover:underline">Belém</Link> apresentam amplitudes acima de 6 metros.
          </p>

          <p><strong>Características:</strong></p>
          <ul>
            <li>Estuários amazônicos com efeito funil</li>
            <li>Marés diurnas em algumas localidades</li>
            <li>Amplitude extrema</li>
          </ul>

          <h3>Região Nordeste</h3>
          
          <p>
            Marés moderadas com padrão semidiurno. Localidades como <Link href="/mare/sao-luis" className="text-blue-600 hover:underline">São Luís</Link>, <Link href="/mare/porto-do-recife" className="text-blue-600 hover:underline">Recife</Link> e <Link href="/mare/maceio" className="text-blue-600 hover:underline">Maceió</Link> têm marés bem previsíveis.
          </p>

          <p><strong>Características:</strong></p>
          <ul>
            <li>Amplitude moderada (0,5 m a 2,5 m)</li>
            <li>Padrão semidiurno regular</li>
            <li>Clima tropical com variações sazonais</li>
          </ul>

          <h3>Região Sudeste</h3>
          
          <p>
            A região mais habitada e com melhor infraestrutura. <Link href="/mare/rio-de-janeiro-fiscal" className="text-blue-600 hover:underline">Rio de Janeiro</Link>, <Link href="/mare/santos" className="text-blue-600 hover:underline">Santos</Link> e <Link href="/mare/porto-de-vitoria" className="text-blue-600 hover:underline">Vitória</Link> são portos importantes.
          </p>

          <p><strong>Características:</strong></p>
          <ul>
            <li>Amplitude pequena a moderada (0,5 m a 1,5 m)</li>
            <li>Padrão semidiurno muito regular</li>
            <li>Influência de sistemas de frentes frias no inverno</li>
          </ul>

          <h3>Região Sul</h3>
          
          <p>
            Marés pequenas e padrão semidiurno. Sofrem influência de sistemas frontais que podem criar <strong>marés meteorológicas</strong> significativas.
          </p>

          <p><strong>Características:</strong></p>
          <ul>
            <li>Amplitude pequena (0,3 m a 1,0 m)</li>
            <li>Ressacas frequentes no inverno</li>
            <li>Variações meteorológicas importantes</li>
          </ul>

          <h2>Dicas Essenciais Para Usar Tábuas de Marés</h2>
          
          <ol>
            <li><strong>Sempre confirme a localização</strong>: Marés variam bastante entre cidades próximas</li>
            <li><strong>Considere o fuso horário</strong>: Algumas tábuas usam UTC; converta para a hora local</li>
            <li><strong>Observe o nível médio</strong>: Ajuda a entender se a maré está subindo ou descendo</li>
            <li><strong>Planeje com antecedência</strong>: Não deixe para consultar a tábua no último minuto</li>
            <li><strong>Combine com previsão de vento e ondas</strong>: Maré sozinha não conta toda a história</li>
            <li><strong>Consulte fontes oficiais</strong>: Para navegação profissional, use sempre dados da DHN</li>
          </ol>

          <h2>Conclusão</h2>
          
          <p>
            As marés são um fenômeno natural previsível que afeta profundamente a vida marítima no Brasil. Desde a Amazônia com suas marés gigantescas até o Sudeste com suas marés pequenas, cada região do país apresenta características únicas.
          </p>

          <p>
            Aprender a ler tábuas de marés e entender os fatores que as influenciam é essencial para qualquer pessoa que trabalhe ou pratique atividades no mar. Usando os dados oficiais da Marinha do Brasil e ferramentas como a MaréAgora, você pode planejar suas atividades com segurança e eficiência.
          </p>

          <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h3 className="text-xl font-bold mb-4">Explore as Tábuas de Marés Específicas da Sua Localidade</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/mare/macapa" className="text-blue-600 hover:underline">
                → Tábuas de Marés - Região Norte
              </Link>
              <Link href="/mare/sao-luis" className="text-blue-600 hover:underline">
                → Tábuas de Marés - Região Nordeste
              </Link>
              <Link href="/mare/santos" className="text-blue-600 hover:underline">
                → Tábuas de Marés - Região Sudeste
              </Link>
              <Link href="/mare/rio-de-janeiro-fiscal" className="text-blue-600 hover:underline">
                → Consulte Todas as Cidades
              </Link>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-8">
            <em>Todos os dados de marés do MaréAgora são baseados nas publicações oficiais da Diretoria de Hidrografia e Navegação (DHN) da Marinha do Brasil. Para navegação profissional, sempre consulte as publicações oficiais.</em>
          </p>
        </article>
      </div>

      <Footer />
    </main>
  );
}
