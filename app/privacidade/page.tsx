import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade — MaréAgora',
  description: 'Saiba como o MaréAgora coleta, usa e protege seus dados pessoais.',
  alternates: { canonical: 'https://www.mareagora.com.br/privacidade' },
};

export default function PrivacyPage() {
  const updated = '03 de abril de 2026';

  return (
    <main className="min-h-screen pb-20">
      <NavBar />

      <section className="hero-section" style={{ minHeight: '220px' }}>
        <div className="hero-overlay" />
        <div className="container relative z-30 text-white text-center pt-24 pb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-syne">
            Política de Privacidade
          </h1>
          <p className="mt-3 text-sm opacity-70">Última atualização: {updated}</p>
        </div>
      </section>

      <div className="container max-w-3xl py-12">
        <div className="classic-card prose prose-slate max-w-none text-sm leading-relaxed">

          <p>
            O <strong>MaréAgora</strong> (<a href="https://www.mareagora.com.br">www.mareagora.com.br</a>) é um
            serviço gratuito de consulta de tábuas de maré e condições costeiras. Esta Política de Privacidade
            descreve como coletamos, usamos e protegemos as informações dos usuários, em conformidade com a{' '}
            <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
          </p>

          <h2>1. Dados Coletados</h2>
          <p>O MaréAgora pode coletar os seguintes tipos de dados:</p>
          <ul>
            <li>
              <strong>Dados de uso e navegação:</strong> páginas visitadas, tempo de permanência, tipo de
              dispositivo, sistema operacional e navegador — coletados automaticamente pelo Google Analytics 4 (GA4).
            </li>
            <li>
              <strong>Dados de localização aproximada:</strong> com sua permissão explícita, usamos sua
              geolocalização apenas para exibir o porto mais próximo. Esses dados não são armazenados em
              nossos servidores.
            </li>
            <li>
              <strong>Dados de contato:</strong> caso você nos envie uma mensagem pelo formulário de contato,
              coletamos nome e e-mail exclusivamente para responder à sua solicitação.
            </li>
            <li>
              <strong>Cookies e tecnologias similares:</strong> utilizados pelo Google AdSense e Google Analytics
              para personalização de anúncios e análise de tráfego.
            </li>
          </ul>

          <h2>2. Finalidade do Uso dos Dados</h2>
          <p>Os dados coletados são utilizados para:</p>
          <ul>
            <li>Melhorar a experiência de navegação e os recursos da plataforma;</li>
            <li>Analisar o desempenho e o tráfego do site (Google Analytics 4);</li>
            <li>Exibir anúncios relevantes (Google AdSense);</li>
            <li>Responder mensagens e solicitações de contato;</li>
            <li>Cumprir obrigações legais.</li>
          </ul>

          <h2>3. Google Analytics e Google AdSense</h2>
          <p>
            Utilizamos o <strong>Google Analytics 4</strong> para análise de audiência e o{' '}
            <strong>Google AdSense</strong> para exibição de anúncios. Ambos os serviços são operados pelo
            Google LLC e podem coletar dados por meio de cookies para personalizar anúncios e medir o
            desempenho do site.
          </p>
          <p>
            Você pode gerenciar suas preferências de anúncios ou optar por não participar da personalização
            acessando:{' '}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              adssettings.google.com
            </a>
            . Para mais informações sobre como o Google usa os dados, consulte:{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
            >
              policies.google.com/technologies/partner-sites
            </a>
            .
          </p>

          <h2>4. Cookies</h2>
          <p>
            Utilizamos cookies essenciais para o funcionamento do site e cookies de terceiros (Google) para
            análise e publicidade. Ao continuar navegando no MaréAgora, você concorda com o uso de cookies
            conforme descrito nesta política.
          </p>
          <p>
            Você pode desativar cookies nas configurações do seu navegador, mas isso pode afetar a
            funcionalidade de algumas partes do site.
          </p>

          <h2>5. Compartilhamento de Dados</h2>
          <p>
            O MaréAgora <strong>não vende</strong> dados pessoais a terceiros. Os dados são compartilhados
            apenas com:
          </p>
          <ul>
            <li>
              <strong>Google LLC</strong> — para análise de tráfego (GA4) e exibição de anúncios (AdSense),
              conforme as políticas da própria empresa;
            </li>
            <li>
              <strong>Autoridades competentes</strong> — quando exigido por lei ou ordem judicial.
            </li>
          </ul>

          <h2>6. Seus Direitos (LGPD)</h2>
          <p>De acordo com a LGPD, você tem direito a:</p>
          <ul>
            <li>Confirmar a existência de tratamento de seus dados;</li>
            <li>Acessar seus dados;</li>
            <li>Corrigir dados incompletos ou desatualizados;</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
            <li>Revogar o consentimento a qualquer momento;</li>
            <li>Solicitar a portabilidade dos dados.</li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, entre em contato pelo e-mail:{' '}
            <a href="mailto:contato@mareagora.com.br">contato@mareagora.com.br</a>.
          </p>

          <h2>7. Segurança dos Dados</h2>
          <p>
            Adotamos medidas técnicas e organizacionais adequadas para proteger os dados contra acesso não
            autorizado, perda ou divulgação indevida. O site utiliza conexão segura (HTTPS) em todas as
            páginas.
          </p>

          <h2>8. Retenção de Dados</h2>
          <p>
            Dados de contato são mantidos pelo período necessário para responder à solicitação e, em seguida,
            excluídos. Dados de análise (GA4) seguem as políticas de retenção do Google, configuradas para o
            período mínimo necessário.
          </p>

          <h2>9. Alterações nesta Política</h2>
          <p>
            Esta política pode ser atualizada periodicamente. Alterações significativas serão comunicadas
            nesta página com a data de atualização revisada. Recomendamos que você a consulte regularmente.
          </p>

          <h2>10. Contato</h2>
          <p>
            Dúvidas, solicitações ou reclamações relacionadas à privacidade podem ser enviadas para:
          </p>
          <ul>
            <li>
              <strong>E-mail:</strong>{' '}
              <a href="mailto:contato@mareagora.com.br">contato@mareagora.com.br</a>
            </li>
            <li>
              <strong>Formulário:</strong>{' '}
              <a href="https://contatos.mareagora.com.br">contatos.mareagora.com.br</a>
            </li>
          </ul>

        </div>
      </div>

      <Footer />
    </main>
  );
}

