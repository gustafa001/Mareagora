import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ajuda e FAQs | MaréAgora',
  description: 'Tire suas dúvidas sobre tábua de marés, previsão de ondas e como usar o MaréAgora para planejar suas atividades no mar.',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-classic)]">
      <NavBar />
      
      {/* Mini Hero */}
      <section className="bg-gradient-to-br from-[var(--ocean)] to-[#0a1b32] pt-32 pb-16">
        <div className="container text-center">
          <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-white mb-4">Ajuda e FAQ</h1>
          <p className="text-[var(--foam)] text-lg max-w-2xl mx-auto">
            Tire suas dúvidas sobre marés, ondas e como usar o MaréAgora.
          </p>
        </div>
      </section>
 
      {/* Content */}
      <main className="flex-1 container py-16">
        <div className="max-w-4xl mx-auto classic-card p-8 md:p-12 prose prose-slate prose-blue max-w-none">

          <h2 className="font-syne font-bold text-2xl mb-6 text-[#0a1628]">1. O que significa a altura em metros exibida na tábua de marés?</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Os valores indicam a <strong>elevação da superfície da água</strong> em relação ao <em>Zero Hidrográfico</em> — um nível de referência adotado pela Marinha do Brasil para cada porto, baseado na média histórica das marés mais baixas registradas naquele local. Na prática: se a previsão mostra 1,80 m, significa que o nível da água está 1,80 metro acima desse ponto de referência, o que indica uma maré alta. Quanto mais alto o número, maior a maré.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-6 text-[#0a1628]">2. Por que a previsão pode ter pequenas diferenças em relação à tábua oficial impressa?</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            A tábua oficial publicada pela Marinha do Brasil fornece horários e alturas para os momentos exatos de preamar e baixamar — geralmente dois ou quatro pontos por dia. O MaréAgora usa esses dados como base e aplica um <strong>algoritmo de interpolação harmônica</strong> para calcular o nível da água em qualquer minuto do dia, gerando os gráficos contínuos que você vê na plataforma.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            Esse processo pode gerar diferenças mínimas de alguns centímetros nos horários intermediários, especialmente em portos com comportamento de maré mais irregular. Para navegação profissional, sempre consulte a publicação oficial da DHN.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-6 text-[#0a1628]">3. O que é o Nível Médio exibido no gráfico?</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            O Nível Médio é a linha de referência central do gráfico — representa a altura média da maré ao longo do tempo, desconsiderando as variações causadas pela atração gravitacional da Lua e do Sol. Ele serve como ponto de comparação: quando a linha da maré está acima do Nível Médio, a maré está subindo em direção à preamar; quando está abaixo, está descendo em direção à baixamar.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-6 text-[#0a1628]">4. O MaréAgora substitui instrumentos náuticos oficiais?</h2>
          <p className="text-gray-600 leading-relaxed font-bold mb-4">
            Não. O MaréAgora é uma ferramenta de apoio para atividades costeiras e recreativas — não substitui equipamentos de navegação profissional.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            Fatores como correntes locais, ventos inesperados, assoreamento de canais e variações meteorológicas extremas podem alterar as condições reais do mar de forma imprevisível. Recomendamos o uso da plataforma para planejamento de surf, pesca, caiaque, mergulho e passeios de barco em regiões costeiras, sempre combinado com bom senso e experiência marítima.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-6 text-[#0a1628]">5. Com que frequência os dados são atualizados?</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Os dados de tábua de marés seguem as publicações anuais da Marinha do Brasil para 2026 e são fixos para o ano. Já as previsões de vento e ondas são atualizadas em tempo real pela API da Open-Meteo, com ciclos de atualização a cada poucas horas conforme a disponibilidade do modelo meteorológico global.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-6 text-[#0a1628]">6. Como encontrar a previsão de maré para minha praia?</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Na página inicial, use a barra de busca para digitar o nome do porto ou praia desejado, ou navegue pelas regiões (Norte, Nordeste, Sudeste e Sul). O MaréAgora cobre <strong>122 localidades</strong> em todo o litoral brasileiro. Caso sua praia não apareça, escolha o porto mais próximo — as condições de maré costumam ser muito similares em locais da mesma região costeira.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-6 text-[#0a1628]">7. O site funciona no celular?</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Sim! O MaréAgora foi desenvolvido com foco em dispositivos móveis. Todos os gráficos, tabelas e informações são otimizados para telas de smartphone. Você pode acessar pelo navegador do celular sem precisar instalar nenhum aplicativo.
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
