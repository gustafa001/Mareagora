import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ajuda e FAQs | MaréAgora',
  description: 'As respostas para todas as tuas dúvidas frequentes de navegabilidade e métricas',
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
            Dúvidas frequentes de navegadores explicadas!
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 container py-16">
        <div className="max-w-4xl mx-auto classic-card p-8 md:p-12 prose prose-slate prose-blue max-w-none">

          <h2 className="font-syne font-bold text-2xl mb-6 text-[#0a1628]">1. O que quer dizer a altura em metros das marés?</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Os valores apresentados nas tabelas de maré indicam a <strong>elevação (ou descida) da superfície da água</strong> em relação ao <em>Zero Hidrográfico</em> (uma média histórica de níveis baixos num plano teórico) adotado como referência pelo porto avaliado na região costeira respetiva do Brasil. Resumindo: Quando o valor for 1.80m, significa que o espelho d'água tem altura garantida com profundidades descritas nas cartas, com acréscimo vertical desse metro extra fornecendo margens para embarcações ao adentrar.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-6 text-[#0a1628]">2. Porque algumas previsões podem divergir minimamente da prancha oficial?</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            Porque os astros interligam ciclos independentes ao fluxo gravitacional oceânico. Na realidade, o MaréAgora utiliza um avançado *Motor de Interpolação Harmónica* para gerar os gráficos fluídos entre a Baja e a Alta, baseados nos instantes horários publicados pelos institutos competentes e corrigidos localmente por fatores climáticos em tempo-real (como marés de tempestade ou rajada em superfície oceânica combinada com dados geográficos Open-Meteo).
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            Desta forma a previsão dos picos matemáticos de hora em hora é a mais correta nos minutos em intermédios em tempo digital exato (por exemplo como às 16:47), embora os PDFs anuais forneçam amostras únicas por dia, causando margens mínimas de convergência.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-6 text-[#0a1628]">3. Qual o nível do meio (Nível Médio) que vejo exibido?</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            É o traço referencial a que o mar se propõe sem o peso gravitacional da energia da lua. Quando ler que o Mar está "em subida da Alta", significa que a coluna de água aproxima-se de passar este Limiar e bater nos recordes mensais máximos. 
          </p>

          <h2 className="font-syne font-bold text-2xl mb-6 text-[#0a1628]">4. É a plataforma 100% vital e substituível aos barcos oficiais no alto mar?</h2>
          <p className="text-gray-600 leading-relaxed font-bold mb-8">
            Não! Devido a correntes em canais apertados, ventos inesperados severos de fora a fora, assoreamentos naturais sob as margens e a mecânica das correntes rotativas dos portos, aconselhamos vivamente a apenas usarem a plataforma para apoio em decisões lúdicas antes e depois das práticas marinhas em território costeiro visual por marinheiros civis (praias de surf, caiaque, margens litorâneas).
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
