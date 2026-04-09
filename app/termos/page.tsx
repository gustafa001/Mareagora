import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso | MaréAgora',
  description: 'Termos de Uso do MaréAgora: condições de acesso, isenção de responsabilidade náutica, propriedade intelectual e direitos do usuário.',
};

const ULTIMA_ATUALIZACAO = '09 de abril de 2026';

export default function TermosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-classic)]">
      <NavBar />

      {/* Mini Hero */}
      <section className="bg-gradient-to-br from-[var(--ocean)] to-[#0a1b32] pt-32 pb-16">
        <div className="container text-center">
          <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-white mb-4">Termos de Uso</h1>
          <p className="text-[var(--foam)] text-lg max-w-2xl mx-auto">
            Condições de acesso e uso do MaréAgora.
          </p>
          <p className="text-sm text-white/60 mt-3">Última atualização: {ULTIMA_ATUALIZACAO}</p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 container py-16">
        <div className="max-w-4xl mx-auto classic-card p-8 md:p-12 prose prose-slate prose-blue max-w-none">

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">1. Aceitação dos Termos</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Ao acessar <strong>mareagora.com.br</strong>, você concorda com estes Termos de Uso.
            Se não concordar, não utilize o serviço.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">2. Sobre o serviço</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            O <strong>MaréAgora</strong> é uma plataforma de consulta de tábuas de marés, ondas e
            ventos para o litoral brasileiro, baseada em dados da Marinha do Brasil
            (Centro de Hidrografia — CHM) e fontes meteorológicas abertas.
            O serviço é gratuito para uso pessoal e não-comercial.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#e05252]">3. Isenção de responsabilidade — USO NÁUTICO (CRÍTICO)</h2>
          <div className="text-gray-600 leading-relaxed mb-6 p-6 bg-red-50 border-l-4 border-[#e05252] rounded-r-lg">
            <p className="font-bold text-[#b02a2a] mb-3">
              ⚠️ AS INFORMAÇÕES DESTE SITE NÃO SÃO VÁLIDAS PARA NAVEGAÇÃO.
            </p>
            <p className="mb-3">
              Os dados apresentados são previsões com finalidade recreativa e informativa.
              O MaréAgora e seus operadores <strong>NÃO</strong> se responsabilizam por:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#b02a2a] mb-4">
              <li>Acidentes, incidentes ou prejuízos decorrentes de decisões tomadas com base exclusiva nos dados exibidos.</li>
              <li>Divergências entre as previsões e as condições reais do mar.</li>
              <li>Uso dos dados para fins náuticos profissionais ou de salvaguarda.</li>
            </ul>
            <p className="text-gray-700">
              Para navegação, use SEMPRE as tábuas oficiais publicadas pela Marinha do Brasil em{' '}
              <a
                href="https://www.marinha.mil.br/chm/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e05252] underline"
              >
                marinha.mil.br/chm
              </a>
            </p>
          </div>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">4. Uso permitido</h2>
          <p className="text-gray-600 leading-relaxed mb-3">É permitido:</p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-6 space-y-2">
            <li>Consultar dados de maré para uso pessoal, recreativo ou esportivo.</li>
            <li>Compartilhar links para páginas do MaréAgora.</li>
            <li>Citar os dados com atribuição ao MaréAgora e à Marinha do Brasil.</li>
          </ul>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">5. Uso proibido</h2>
          <p className="text-gray-600 leading-relaxed mb-3">É proibido:</p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-6 space-y-2">
            <li>Raspagem automatizada (scraping/crawling) que sobrecarregue os servidores.</li>
            <li>Reprodução dos dados em plataformas comerciais sem autorização prévia.</li>
            <li>Uso do nome, logo ou identidade visual do MaréAgora sem autorização.</li>
            <li>Uso dos dados como fonte exclusiva para operações com risco de vida.</li>
          </ul>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">6. Propriedade intelectual</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            O código-fonte, design, marca e textos originais do MaréAgora são
            protegidos por direito autoral. Os dados de marés são de domínio
            público, provenientes da Marinha do Brasil (CHM).
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">7. Disponibilidade do serviço</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            O MaréAgora é disponibilizado &ldquo;como está&rdquo;. Não garantimos
            disponibilidade ininterrupta. Podemos suspender ou modificar o serviço
            a qualquer momento sem aviso prévio.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">8. Modificações dos termos</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Podemos atualizar estes Termos periodicamente. O uso contínuo após
            a publicação de alterações constitui aceite das mudanças.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">9. Lei aplicável</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Estes Termos são regidos pelas leis do Brasil. Fica eleito o foro da
            comarca de São Paulo/SP para resolução de conflitos.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">10. Contato</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            Dúvidas, sugestões ou solicitações relacionadas a estes Termos de Uso:
          </p>
          <a
            href="mailto:cantatos@mareagora.com.br"
            className="inline-flex items-center gap-2 text-[var(--ocean)] font-semibold hover:underline break-all"
          >
            ✉️ cantatos@mareagora.com.br
          </a>

        </div>
      </main>

      <Footer />
    </div>
  );
}
