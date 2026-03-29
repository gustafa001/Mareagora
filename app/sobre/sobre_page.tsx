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

          <h2 className="font-syne font-bold text-2xl mb-6">Nossa Missão</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            O <strong>MaréAgora</strong> nasceu com um objetivo claro: tornar as previsões de marés, ventos e ondas do vasto litoral brasileiro acessíveis, instantâneas e fáceis de entender para todos que dependem do mar.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            Seja um pescador buscando a próxima virada de maré, um surfista em busca do melhor swell, ou um navegador amador planejando uma saída segura, nossa plataforma combina credibilidade institucional com uma experiência moderna e intuitiva — direto no celular, sem complicação.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-6">De Onde Vêm os Nossos Dados</h2>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
            <p className="text-gray-700 leading-relaxed mb-3">
              1. <strong>Tábua de Marés:</strong> Todos os cálculos de preamar, baixamar e horários são extraídos rigorosamente das publicações anuais (2026) da <strong>Diretoria de Hidrografia e Navegação (DHN)</strong> da Marinha do Brasil — a fonte oficial de referência para navegação no país.
            </p>
            <p className="text-gray-700 leading-relaxed">
              2. <strong>Meteorologia:</strong> As previsões de vento, ondas e precipitação são integradas em tempo real com a API da <strong>Open-Meteo</strong>, referência global em dados meteorológicos abertos e de alta precisão.
            </p>
          </div>

          <h2 className="font-syne font-bold text-2xl mb-6">Tecnologia</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            O MaréAgora utiliza algoritmos de interpolação harmônica para calcular o nível da água a qualquer minuto do dia, transformando os dados estáticos publicados em tabelas pela Marinha em gráficos dinâmicos e interativos. O resultado é uma visualização fluida e precisa, otimizada para funcionar perfeitamente em qualquer dispositivo móvel.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-6">Para Quem É o MaréAgora</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Desenvolvemos a plataforma pensando em todos que têm o mar como parte do dia a dia:
          </p>
          <ul className="text-gray-600 leading-relaxed mb-8 list-disc list-inside space-y-2">
            <li><strong>Pescadores</strong> que precisam saber a hora exata da virada da maré para planejar a saída.</li>
            <li><strong>Surfistas</strong> que acompanham ondas, vento e maré antes de entrar na água.</li>
            <li><strong>Caiaqueiros e mergulhadores</strong> que dependem de condições seguras na costa.</li>
            <li><strong>Turistas e veranistas</strong> que querem aproveitar a praia no melhor momento do dia.</li>
            <li><strong>Engenheiros e profissionais náuticos</strong> que precisam de dados confiáveis para apoio em projetos costeiros.</li>
          </ul>

          <h2 className="font-syne font-bold text-2xl mb-6">Contato</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            Tem sugestões, encontrou algum erro nos dados ou quer entrar em contato com nossa equipe? Ficamos felizes em ouvir você.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Envie um e-mail para: <a href="mailto:contato@mareagora.com.br" className="text-blue-600 hover:underline">contato@mareagora.com.br</a>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
