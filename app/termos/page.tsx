import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso e Isenção | MaréAgora',
  description: 'Termos e Condições para a utilização das previsões do portal MaréAgora.',
};

export default function TermosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-classic)]">
      <NavBar />
      
      {/* Mini Hero */}
      <section className="bg-gradient-to-br from-[var(--ocean)] to-[#0a1b32] pt-32 pb-16">
        <div className="container text-center">
          <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-white mb-4">Termos de Uso</h1>
          <p className="text-[var(--foam)] text-lg max-w-2xl mx-auto">
            Condições legais vitais para a navegação e a partilha dos nossos dados.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 container py-16">
        <div className="max-w-4xl mx-auto classic-card p-8 md:p-12 prose prose-slate prose-blue max-w-none">
          <p className="text-gray-500 text-sm mb-8 font-mono">Última atualização: Março de 2026</p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">1. Finalidade do Portal</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            O <strong>MaréAgora</strong> é uma plataforma independente dedicada a facilitar o acesso a previsões de marés, ventos e ondas do Brasil, processando matrizes de dados abertos para uso lúdico, desportivo ou informativo por pescadores, surfistas e curiosos.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#e05252]">2. Isenção de Responsabilidade Náutica (Disclaimer Crítico)</h2>
          <div className="text-gray-600 leading-relaxed mb-6 p-6 bg-red-50 border-l-4 border-[#e05252] rounded-r-lg">
            <p className="mb-4">
              <strong>ATENÇÃO:</strong> As informações apresentadas nesta aplicação de software refletem interpolações e previsões numéricas para um uso meramente consultivo. Apesar da nossa forte dedicação técnica e aproximação metodológica (recorrendo a origens de referência técnica), a natureza caótica e imprevisível das massas marítimas obriga-nos a reforçar o seguinte:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#b02a2a] mb-0">
              <li>Estes dados <strong>não subscrevem nem substituem</strong> de qualquer forma as publicações marítimas em vigor emanadas das Autoridades Competentes ou o Diário Eletrônico da Diretoria de Hidrografia e Navegação (DHN).</li>
              <li>O MaréAgora e os seus criadores e servidores afiliados declaram expressamente que <strong>não se responsabilizam</strong>, direta ou indiretamente, por quaisquer incidentes, desvios ou acidentes pessoais e de equipamento derivados de decisões operacionais assumidas baseadas unicamente na observação dos gráficos exibidos, especialmente no que tange a navegação de calados consideráveis, aviação e mergulho sem instrumentos.</li>
            </ul>
          </div>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">3. Condições e Licença</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            É concedida a todos os visitantes uma permissão para visualizar este website temporalmente. Não está, porém, em qualquer momento, permitida a:
          </p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-6 space-y-2">
            <li>Reversão, modificação, manipulação direta de backends não-autorizada, ou raspagem robótica automatizada (scrapping/crawling agressivo que limite e ataque os nossos servidores);</li>
            <li>A utilização, sem anuência ou acordo de referenciamento, do nome de marca, logotipo ou gráficos nativos em formato comercial direto;</li>
            <li>Transferir as informações como "estritamente vitais" para o desempenho de operações empresariais onde se prometa invulnerabilidade algorítmica.</li>
          </ul>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">4. Modificações aos Termos</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Ao usar o MaréAgora, compromete-se com a leitura atenta das condições explicitadas nesta morada web que possam transitar futuramente, conforme a adesão continuada assuma os novos padrões de uso do serviço.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">5. Contato</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            Dúvidas, sugestões ou solicitações relacionadas a estes Termos de Uso podem ser enviadas diretamente para a nossa equipe:
          </p>
          <a
            href="mailto:mareagora.br@gmail.com"
            className="inline-flex items-center gap-2 text-[var(--ocean)] font-semibold hover:underline break-all"
          >
            ✉️ contatos@mareagora.com.br
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
