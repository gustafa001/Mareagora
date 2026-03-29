import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade | MaréAgora',
  description: 'Política de Privacidade do MaréAgora, utilização de Cookies e Google AdSense.',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-classic)]">
      <NavBar />
      
      {/* Mini Hero */}
      <section className="bg-gradient-to-br from-[var(--ocean)] to-[#0a1b32] pt-32 pb-16">
        <div className="container text-center">
          <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-white mb-4">Privacidade</h1>
          <p className="text-[var(--foam)] text-lg max-w-2xl mx-auto">
            O nosso compromisso com a proteção dos seus dados.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 container py-16">
        <div className="max-w-4xl mx-auto classic-card p-8 md:p-12 prose prose-slate prose-blue max-w-none">
          <p className="text-gray-500 text-sm mb-8 font-mono">Última atualização: Março de 2026</p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">1. Aceitação</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            A sua privacidade é importante para nós. É política do <strong>MaréAgora</strong> respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site e noutros sites que operamos. Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço, fazendo-o por meios justos e legais, com o seu conhecimento e consentimento.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">2. Retenção de Informação</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, os mesmos são protegidos dentro de meios comercialmente aceitáveis para evitar perdas ou furtos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados. No entanto, não partilhamos informações de identificação pessoal publicamente ou com terceiros, exceto nos casos em que a lei o exija.
          </p>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">3. Uso de Cookies (Google AdSense)</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Utilizamos o <strong>Google AdSense</strong> e subredecularidades associadas para rentabilizar a nossa plataforma através da exibição de publicidade que mantém o MaréAgora 100% gratuito.
          </p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-6 space-y-2">
            <li>Fornecedores de terceiros, incluindo o Google, usam cookies para veicular anúncios com base em visitas anteriores de um usuário ao nosso site ou a outros sites na Internet.</li>
            <li>O uso de cookies de publicidade pelo Google permite que o mesmo e seus parceiros veiculem anúncios aos nossos usuários com base em suas visitas a nossos sites e/ou a outros sites na Internet.</li>
            <li>Os utilizadores podem desativar a personalização de anúncios visitando as <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#2a68f6] hover:underline">Configurações de anúncios do Google</a>. Alternativamente, pode ainda ser direcionado para aceder ao <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#2a68f6] hover:underline">www.aboutads.info</a> para desativar o uso de cookies de publicidade personalizada de fornecedores independentes.</li>
          </ul>

          <h2 className="font-syne font-bold text-2xl mb-4 text-[#0a1628]">4. Links Externos</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            O nosso site pode ter links para sites externos que não são operados por nós (como as previsões da Open-Meteo para a Meteorologia ou da Marinha do Brasil). Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respetivas políticas de privacidade.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Você é livre para recusar a nossa solicitação de informações pessoais, ciente de que a ausência de determinados scripts ou cookies poderá impossibilitar a capacidade de lhe fornecer as previsões em tempo real ou algumas das funções otimizadas do website. O uso continuado do nosso site será considerado como aceitação das nossas práticas em torno da privacidade e dados descritos.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
