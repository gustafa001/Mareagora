import { useState } from 'react';
import { Mail, Shield, FileText } from 'lucide-react';

export default function SobrePrivacidade() {
  const [activeTab, setActiveTab] = useState<'sobre' | 'privacidade'>('sobre');

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-r from-maritime to-blue-700 text-white py-12 md:py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre e Privacidade</h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Conheça nossa missão e como protegemos seus dados
            </p>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="container">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('sobre')}
                className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                  activeTab === 'sobre'
                    ? 'border-maritime text-maritime'
                    : 'border-transparent text-gray-600 hover:text-maritime'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Sobre
                </div>
              </button>
              <button
                onClick={() => setActiveTab('privacidade')}
                className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                  activeTab === 'privacidade'
                    ? 'border-maritime text-maritime'
                    : 'border-transparent text-gray-600 hover:text-maritime'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacidade
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container max-w-3xl">
            {activeTab === 'sobre' && (
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-maritime mb-6">Nossa Missão</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  O MaréAgora nasceu de uma necessidade simples e real: ter a tábua de marés do litoral brasileiro disponível de forma rápida, clara e acessível em qualquer dispositivo.
                </p>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Pescadores, surfistas, mergulhadores, velejadores, turistas e moradores do litoral precisam de informação de qualidade para planejar suas atividades com segurança. Consultar as marés não deveria ser difícil — e com o MaréAgora, não é.
                </p>

                <h2 className="text-3xl font-bold text-maritime mb-6 mt-12">O Que Oferecemos</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  O MaréAgora disponibiliza previsões de marés para os principais portos do litoral brasileiro, cobrindo todas as regiões costeiras do país — do Amapá ao Rio Grande do Sul.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Os dados são baseados nas tábuas oficiais publicadas pela <strong>Diretoria de Hidrografia e Navegação (DHN) da Marinha do Brasil</strong>, a autoridade competente para previsão e publicação de marés no território nacional.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Para cada porto, você encontra:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
                  <li>Os horários e alturas das marés altas (preamar) e baixas (baixamar) do dia</li>
                  <li>Previsão para os próximos dias</li>
                  <li>Apresentação clara e visual, fácil de entender em qualquer dispositivo</li>
                </ul>

                <h2 className="text-3xl font-bold text-maritime mb-6 mt-12">Por Que Usar o MaréAgora?</h2>
                <div className="space-y-4 mb-8">
                  <div>
                    <h3 className="font-bold text-maritime mb-2">Dados oficiais</h3>
                    <p className="text-gray-700">Utilizamos as tábuas da Marinha do Brasil, a fonte mais confiável e precisa para previsão de marés no litoral brasileiro.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-maritime mb-2">Acesso simples</h3>
                    <p className="text-gray-700">Sem necessidade de cadastro ou login. Acesse, consulte e vá aproveitar o mar.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-maritime mb-2">Para todas as atividades</h3>
                    <p className="text-gray-700">Seja para pescar, surfar, mergulhar, navegar, visitar piscinas naturais ou simplesmente ir à praia, o MaréAgora tem a informação que você precisa.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-maritime mb-2">Conteúdo educativo</h3>
                    <p className="text-gray-700">Além da tábua, o MaréAgora oferece artigos e guias sobre marés, praias e atividades náuticas para que você entenda o fenômeno e o use a seu favor.</p>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-maritime mb-6 mt-12">Aviso de Responsabilidade</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  As previsões de marés do MaréAgora são baseadas em cálculos astronômicos e dados oficiais da Marinha do Brasil. As previsões são precisas em condições normais, mas podem diferir do nível real do mar em razão de condições meteorológicas como vento forte, frentes frias e variações de pressão atmosférica.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  O MaréAgora não se responsabiliza por acidentes ou danos decorrentes do uso das informações aqui disponibilizadas. Para navegação profissional, a Marinha do Brasil recomenda que os navegantes mantenham a bordo a publicação oficial das Tábuas das Marés.
                </p>
                <p className="text-lg font-semibold text-maritime mb-8">
                  Sempre respeite as condições do mar, observe a natureza e tome decisões seguras.
                </p>

                <h2 className="text-3xl font-bold text-maritime mb-6 mt-12">Contato</h2>
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-maritime" />
                    <span className="font-semibold text-maritime">contato@mareagora.com.br</span>
                  </div>
                  <p className="text-gray-700">Para dúvidas, sugestões ou informações sobre o site</p>
                </div>
              </div>
            )}

            {activeTab === 'privacidade' && (
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-maritime mb-2">Política de Privacidade</h2>
                <p className="text-gray-500 text-sm mb-8">Última atualização: Janeiro de 2026</p>

                <p className="text-gray-700 mb-8 leading-relaxed">
                  Esta Política de Privacidade descreve como o MaréAgora (mareagora.com.br) coleta, utiliza e protege as informações dos usuários que acessam nosso site.
                </p>

                <h3 className="text-2xl font-bold text-maritime mb-4 mt-8">1. Informações que Coletamos</h3>

                <h4 className="text-lg font-bold text-maritime mb-3">1.1 Dados de Navegação (Automáticos)</h4>
                <p className="text-gray-700 mb-4">Quando você acessa o MaréAgora, nossos servidores registram automaticamente informações técnicas de navegação, incluindo:</p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                  <li>Endereço IP (de forma anonimizada)</li>
                  <li>Tipo e versão do navegador</li>
                  <li>Sistema operacional</li>
                  <li>Páginas visitadas e tempo de permanência</li>
                  <li>Data e hora do acesso</li>
                  <li>URL de origem (referrer)</li>
                </ul>
                <p className="text-gray-700 mb-6">Essas informações são coletadas de forma agregada e anonimizada, e são utilizadas exclusivamente para análise de desempenho do site e melhoria dos nossos serviços.</p>

                <h4 className="text-lg font-bold text-maritime mb-3">1.2 Cookies e Tecnologias Similares</h4>
                <p className="text-gray-700 mb-4">O MaréAgora utiliza cookies para:</p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                  <li>Melhorar a experiência de navegação</li>
                  <li>Analisar o tráfego do site (Google Analytics)</li>
                  <li>Exibir anúncios relevantes (Google AdSense)</li>
                </ul>
                <p className="text-gray-700 mb-6">Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades do site.</p>

                <h4 className="text-lg font-bold text-maritime mb-3">1.3 Dados de Geolocalização</h4>
                <p className="text-gray-700 mb-6">O MaréAgora pode solicitar permissão para acessar sua localização geográfica para facilitar a identificação do porto mais próximo de você. Essa permissão é opcional e você pode recusá-la a qualquer momento nas configurações do seu dispositivo. Os dados de localização não são armazenados em nossos servidores.</p>

                <h3 className="text-2xl font-bold text-maritime mb-4 mt-8">2. Como Utilizamos as Informações</h3>
                <p className="text-gray-700 mb-4">As informações coletadas são utilizadas para:</p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                  <li>Fornecer e melhorar os serviços do MaréAgora</li>
                  <li>Analisar padrões de uso e otimizar a experiência do usuário</li>
                  <li>Identificar e corrigir problemas técnicos</li>
                  <li>Exibir publicidade relevante através do Google AdSense</li>
                </ul>
                <p className="text-gray-700 mb-6 font-semibold">Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto nas situações descritas nesta política.</p>

                <h3 className="text-2xl font-bold text-maritime mb-4 mt-8">3. Google AdSense e Publicidade</h3>
                <p className="text-gray-700 mb-6">O MaréAgora utiliza o Google AdSense para exibição de anúncios. O Google pode usar cookies para exibir anúncios baseados em suas visitas anteriores ao nosso site e a outros sites na internet.</p>
                <p className="text-gray-700 mb-6">Você pode optar por não participar da publicidade personalizada do Google acessando as Configurações de Anúncios do Google.</p>

                <h3 className="text-2xl font-bold text-maritime mb-4 mt-8">4. Segurança dos Dados</h3>
                <p className="text-gray-700 mb-6">Implementamos medidas técnicas e organizacionais adequadas para proteger as informações dos usuários contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela internet é 100% seguro, e não podemos garantir segurança absoluta.</p>

                <h3 className="text-2xl font-bold text-maritime mb-4 mt-8">5. Seus Direitos (LGPD)</h3>
                <p className="text-gray-700 mb-4">De acordo com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD), você tem os seguintes direitos em relação aos seus dados pessoais:</p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li><strong>Confirmação:</strong> saber se tratamos seus dados pessoais</li>
                  <li><strong>Acesso:</strong> obter acesso aos dados que mantemos sobre você</li>
                  <li><strong>Correção:</strong> solicitar a correção de dados incompletos ou incorretos</li>
                  <li><strong>Exclusão:</strong> solicitar a exclusão de dados desnecessários ou tratados em desconformidade com a LGPD</li>
                  <li><strong>Oposição:</strong> opor-se ao tratamento de dados pessoais</li>
                  <li><strong>Portabilidade:</strong> solicitar a portabilidade dos seus dados para outro fornecedor de serviço</li>
                </ul>
                <p className="text-gray-700 mb-6">Para exercer qualquer um desses direitos, entre em contato pelo e-mail: <strong>privacidade@mareagora.com.br</strong></p>

                <h3 className="text-2xl font-bold text-maritime mb-4 mt-8">6. Contato</h3>
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-maritime mb-1">Privacidade</h4>
                      <p className="text-gray-700">privacidade@mareagora.com.br</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-maritime mb-1">Geral</h4>
                      <p className="text-gray-700">contato@mareagora.com.br</p>
                    </div>
                  </div>
                </div>

                <p className="text-center text-gray-500 text-sm mt-12">
                  Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018) e com as diretrizes do Google AdSense.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Ad Space */}
        <section className="py-8 bg-gray-50 border-t border-gray-200">
          <div className="container text-center text-gray-500 text-sm">
            <p>Espaço para anúncios (AdSense)</p>
          </div>
        </section>
      </main>
    </div>
  );
}
