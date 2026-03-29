import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nós | MaréAgora',
  description: 'Conheça o projeto MaréAgora, focado em trazer precisão e acessibilidade aos dados oceanográficos do litoral brasileiro.',
};

export default function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-classic)]">
      <NavBar />
      
      {/* Mini Hero */}
      <section className="bg-gradient-to-br from-[var(--ocean)] to-[#0a1b32] pt-32 pb-16">
        <div className="container text-center">
          <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-white mb-4">Sobre Nós</h1>
          <p className="text-[var(--foam)] text-lg max-w-2xl mx-auto">
            Democratizando o acesso a dados oceanográficos do Brasil.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 container py-16">
        <div className="max-w-3xl mx-auto classic-card p-8 md:p-12 prose prose-slate prose-blue max-w-none">
          <h2 className="font-syne font-bold text-2xl mb-6">A Nossa Missão</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            O <strong>MaréAgora</strong> nasceu com um objetivo claro: tornar as previsões de marés, ventos e ondas do vasto litoral brasileiro acessíveis, instantâneas e fáceis de interpretar para todos os que dependem do mar.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            Seja um pescador que procura a próxima virada de maré, um surfista atrás do melhor swell, ou um engenheiro naval ao leme de embarcações críticas, a nossa plataforma combina a fiabilidade institucional com uma experiência de utilizador fluida e moderna.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-6">A Fonte dos Nossos Dados</h2>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
            <p className="text-gray-700 leading-relaxed mb-3">
              1. <strong>Tábua de Marés:</strong> Todos os cálculos de preia-mar, baixa-mar e horários derivam rigorosamente das publicações anuais (2026) da <strong>Diretoria de Hidrografia e Navegação (DHN)</strong> da Marinha do Brasil.
            </p>
            <p className="text-gray-700 leading-relaxed">
              2. <strong>Meteorologia:</strong> As sondagens de precipitação, ventos (rajadas) e altura/direção de ondas são cruzadas em tempo real com a API da mundialmente respeitada <strong>Open-Meteo</strong>.
            </p>
          </div>

          <h2 className="font-syne font-bold text-2xl mb-6">Tecnologia</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            A infraestrutura do MaréAgora utiliza motores harmónicos independentes e interpolações computacionais avançadas para prever o nível exato da água a qualquer minuto do dia, extrapolando os dados estáticos publicados em PDF para visualizações vivas e dinâmicas nos ecrãs de telemóveis de todo o país.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
