import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso e Isencao | MareAgora',
  description: 'Termos e Condicoes para a utilizacao das previsoes do portal MareAgora.',
};

export default function TermosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-classic)]">
      <NavBar />

      {/* Mini Hero */}
      <section className="bg-gradient-to-br from-[var(--ocean)] to-[#0a1b32] pt-32 pb-16">
        <div className="container text-center">
          <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-white mb-4">
            Termos de Uso
          </h1>
          <p className="text-[var(--foam)] text-lg max-w-2xl mx-auto">
            Condicoes legais vitais para a navegacao e a partilha dos nossos dados.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 container py-16">
        <div className="max-w-4xl mx-auto classic-card p-8 md:p-12 prose prose-slate prose-blue max-w-none">
          <p className="text-gray-500 text-sm mb-8 font-mono">
            Ultima atualizacao: Marco de 2026
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">
            1. Finalidade do Portal
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            O <strong>MareAgora</strong> e uma plataforma independente dedicada a facilitar o acesso
            a previsoes de mares, ventos e ondas do Brasil, processando matrizes de dados abertos
            para uso ludico, desportivo ou informativo por pescadores, surfistas e curiosos.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#e05252]">
            2. Isencao de Responsabilidade Nautica (Disclaimer Critico)
          </h2>
          <div className="text-gray-600 leading-relaxed mb-6 p-6 bg-red-50 border-l-4 border-[#e05252] rounded-r-lg">
            <p className="mb-4">
              <strong>ATENCAO:</strong> As informacoes apresentadas nesta aplicacao de software
              refletem interpolacoes e previsoes numericas para um uso meramente consultivo. Apesar
              da nossa forte dedicacao tecnica e aproximacao metodologica (recorrendo a origens de
              referencia tecnica), a natureza caotica e imprevisivel das massas maritimas
              obriga-nos a reforcar o seguinte:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#b02a2a] mb-0">
              <li>
                Estes dados <strong>nao subscrevem nem substituem</strong> de qualquer forma as
                publicacoes maritimas em vigor emanadas das Autoridades Competentes ou o Diario
                Eletronico da Diretoria de Hidrografia e Navegacao (DHN).
              </li>
              <li>
                O MareAgora e os seus criadores e servidores afiliados declaram expressamente que{' '}
                <strong>nao se responsabilizam</strong>, direta ou indiretamente, por quaisquer
                incidentes, desvios ou acidentes pessoais e de equipamento derivados de decisoes
                operacionais assumidas baseadas unicamente na observacao dos graficos exibidos,
                especialmente no que tange a navegacao de calados consideraveis, aviacao e mergulho
                sem instrumentos.
              </li>
            </ul>
          </div>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">
            3. Condicoes e Licenca
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            E concedida a todos os visitantes uma permissao para visualizar este website
            temporalmente. Nao esta, porem, em qualquer momento, permitida a:
          </p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-6 space-y-2">
            <li>
              Reversao, modificacao, manipulacao direta de backends nao-autorizada, ou raspagem
              robotica automatizada (scrapping/crawling agressivo que limite e ataque os nossos
              servidores);
            </li>
            <li>
              A utilizacao, sem anuencia ou acordo de referenciamento, do nome de marca, logotipo
              ou graficos nativos em formato comercial direto;
            </li>
            <li>
              Transferir as informacoes como "estritamente vitais" para o desempenho de operacoes
              empresariais onde se prometa invulnerabilidade algorítmica.
            </li>
          </ul>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">
            4. Modificacoes aos Termos
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Ao usar o MareAgora, compromete-se com a leitura atenta das condicoes explicitadas
            nesta morada web que possam transitar futuramente, conforme a adesao continuada assuma
            os novos padroes de uso do servico.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">5. Contato</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            Duvidas, sugestoes ou solicitacoes relacionadas a estes Termos de Uso podem ser
            enviadas diretamente para a nossa equipe:
          </p>
          <a
            href="mailto:mareagora.br@gmail.com"
            className="inline-flex items-center gap-2 text-[var(--ocean)] font-semibold hover:underline break-all"
          >
            contatos@mareagora.com.br
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
