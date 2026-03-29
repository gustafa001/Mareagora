import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade | MaréAgora',
  description: 'Política de Privacidade do MaréAgora — uso de cookies, Google AdSense e proteção de dados dos usuários.',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-classic)]">
      <NavBar />
      
      {/* Mini Hero */}
      <section className="bg-gradient-to-br from-[var(--ocean)] to-[#0a1b32] pt-32 pb-16">
        <div className="container text-center">
          <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-white mb-4">Política de Privacidade</h1>
          <p className="text-[var(--foam)] text-lg max-w-2xl mx-auto">
            Nosso compromisso com a proteção dos seus dados.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 container py-16">
        <div className="max-w-4xl mx-auto classic-card p-8 md:p-12 prose prose-slate prose-blue max-w-none">
          <p className="text-gray-500 text-sm mb-8 font-mono">Última atualização: Março de 2026</p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">1. Aceitação desta Política</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Sua privacidade é importante para nós. É política do <strong>MaréAgora</strong> respeitar sua privacidade em relação a qualquer informação que possamos coletar durante o uso do site. Solicitamos informações pessoais apenas quando realmente precisamos delas para fornecer um serviço, e sempre de forma transparente, com seu conhecimento e consentimento. Ao continuar utilizando o MaréAgora, você concorda com os termos desta política.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">2. Dados Coletados</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            O MaréAgora não exige cadastro nem coleta dados pessoais identificáveis para o uso das funcionalidades principais da plataforma. No entanto, como qualquer site na internet, alguns dados podem ser coletados automaticamente durante sua navegação, incluindo:
          </p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-6 space-y-2">
            <li>Endereço IP e dados de localização aproximada (para previsões meteorológicas locais)</li>
            <li>Tipo de dispositivo, navegador e sistema operacional</li>
            <li>Páginas visitadas e tempo de permanência no site</li>
            <li>Dados de interação com anúncios exibidos na plataforma</li>
          </ul>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">3. Uso de Cookies</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            O MaréAgora utiliza cookies — pequenos arquivos de texto armazenados no seu dispositivo — para melhorar a experiência de navegação e viabilizar a exibição de publicidade. Os cookies usados no site podem ser de dois tipos:
          </p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-6 space-y-2">
            <li><strong>Cookies funcionais:</strong> necessários para o funcionamento correto do site, como armazenar preferências de navegação e garantir o carregamento adequado dos dados de maré.</li>
            <li><strong>Cookies de publicidade:</strong> utilizados pelo Google AdSense e parceiros para exibir anúncios relevantes com base no seu histórico de navegação na internet.</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-6">
            Você pode desativar o uso de cookies diretamente nas configurações do seu navegador. Observe que desativar cookies pode afetar algumas funcionalidades do site, como a exibição de previsões em tempo real.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">4. Google AdSense e Publicidade</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            O MaréAgora exibe anúncios por meio do <strong>Google AdSense</strong> para manter a plataforma gratuita para todos os usuários. O Google, como fornecedor terceirizado, utiliza cookies para exibir anúncios personalizados com base em visitas anteriores ao nosso site e a outros sites na internet.
          </p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-6 space-y-2">
            <li>Os anúncios exibidos podem ser personalizados de acordo com seus interesses e histórico de navegação.</li>
            <li>O Google e seus parceiros podem usar cookies de publicidade para associar sua navegação a perfis de interesse.</li>
            <li>Você pode desativar a personalização de anúncios acessando as <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#2a68f6] hover:underline">Configurações de Anúncios do Google</a>.</li>
            <li>Também é possível desativar cookies de publicidade de fornecedores independentes acessando <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#2a68f6] hover:underline">www.aboutads.info</a>.</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-6">
            Para mais informações sobre como o Google utiliza os dados coletados, acesse a <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#2a68f6] hover:underline">Política de Privacidade do Google</a>.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">5. Retenção de Dados</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Retemos apenas as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, eles são protegidos por meios técnicos adequados para evitar perdas, acesso não autorizado, divulgação ou uso indevido. Não compartilhamos informações de identificação pessoal com terceiros, exceto nos casos exigidos por lei ou descritos nesta política.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">6. Links para Sites Externos</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            O MaréAgora pode conter links para sites externos, como a API da Open-Meteo (meteorologia) e a Marinha do Brasil (dados de maré). Não temos controle sobre o conteúdo ou as práticas de privacidade desses sites e não nos responsabilizamos por suas políticas. Recomendamos que você consulte a política de privacidade de cada site externo que visitar.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">7. Seus Direitos (LGPD)</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)</strong>, você tem o direito de:
          </p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-6 space-y-2">
            <li>Confirmar a existência de tratamento de dados pessoais</li>
            <li>Solicitar acesso, correção ou exclusão dos seus dados</li>
            <li>Revogar o consentimento para o tratamento de dados a qualquer momento</li>
            <li>Solicitar informações sobre o compartilhamento de dados com terceiros</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-6">
            Para exercer qualquer um desses direitos, entre em contato pelo e-mail:{' '}
            <a href="mailto:contato@mareagora.com.br" className="text-[#2a68f6] hover:underline">contato@mareagora.com.br</a>.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">8. Alterações nesta Política</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Esta política pode ser atualizada periodicamente para refletir mudanças em nossas práticas ou em requisitos legais. Recomendamos que você a revise regularmente. O uso continuado do MaréAgora após qualquer alteração implica aceitação dos termos atualizados.
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
