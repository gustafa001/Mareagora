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

      {/* Stats Bar */}
      <section className="bg-[var(--ocean)] border-b border-[rgba(56,201,240,0.12)]">
        <div className="container py-8">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { val: '122', lbl: 'Portos monitorados' },
              { val: '7.400 km', lbl: 'De litoral coberto' },
              { val: '365', lbl: 'Dias de previsão' },
              { val: '2026', lbl: 'Dados oficiais da Marinha' },
            ].map(s => (
              <div key={s.lbl}>
                <div className="font-syne font-extrabold text-3xl text-[var(--foam)]">{s.val}</div>
                <div className="text-[rgba(255,255,255,0.5)] text-xs mt-1 uppercase tracking-wider">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 container py-16">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Missão */}
          <div className="classic-card p-8 md:p-10">
            <h2 className="font-syne font-bold text-2xl mb-4">Nossa Missão</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              O <strong>MaréAgora</strong> nasceu com um objetivo claro: tornar as previsões de marés, ventos e ondas do vasto litoral brasileiro acessíveis, instantâneas e fáceis de entender para todos que dependem do mar.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Seja um pescador buscando a próxima virada de maré, um surfista em busca do melhor swell, ou um navegador amador planejando uma saída segura, nossa plataforma combina credibilidade institucional com uma experiência moderna e intuitiva — direto no celular, sem complicação.
            </p>
            <p className="text-gray-600 leading-relaxed">
              O Brasil tem mais de 7.400 km de costa e uma das maiores populações de pescadores artesanais do mundo. Apesar disso, o acesso a informações de maré precisas sempre foi limitado a tabelas impressas ou PDFs da Marinha de difícil leitura. O MaréAgora resolve esse problema digitalizando e apresentando esses dados de forma clara, moderna e gratuita para toda a população.
            </p>
          </div>

          {/* Dados */}
          <div className="classic-card p-8 md:p-10">
            <h2 className="font-syne font-bold text-2xl mb-4">De Onde Vêm os Nossos Dados</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              A confiabilidade dos dados é o pilar central do MaréAgora. Utilizamos exclusivamente fontes oficiais e reconhecidas internacionalmente:
            </p>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-2">⚓ Tábua de Marés — Marinha do Brasil</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Todos os horários e alturas de preamar e baixa-mar são extraídos das publicações anuais do <strong>Centro de Hidrografia da Marinha (CHM)</strong>, órgão oficial responsável pela segurança da navegação no Brasil. Esses são os mesmos dados utilizados por capitanias dos portos, embarcações comerciais e órgãos de defesa civil em todo o país. O MaréAgora processa as tábuas de 2026 cobrindo 122 pontos de referência ao longo de todo o litoral nacional.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-2">🌬️ Meteorologia — Open-Meteo</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  As previsões de vento, ondas e condições do tempo são integradas em tempo real com a API da <strong>Open-Meteo</strong>, referência global em dados meteorológicos abertos. O Open-Meteo combina modelos de previsão numérica como GFS, ECMWF e ICON, oferecendo alta precisão sem custo para o usuário final — um compromisso direto com a democratização da informação marítima no Brasil.
                </p>
              </div>
            </div>
          </div>

          {/* Tecnologia */}
          <div className="classic-card p-8 md:p-10">
            <h2 className="font-syne font-bold text-2xl mb-4">Tecnologia</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              O MaréAgora utiliza algoritmos de <strong>interpolação harmônica</strong> para calcular o nível da água a qualquer minuto do dia, transformando os dados estáticos publicados em tabelas pela Marinha em gráficos dinâmicos e interativos em tempo real.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              A plataforma foi desenvolvida com foco total em <strong>performance e acessibilidade mobile</strong>. O resultado é uma experiência fluida e responsiva que funciona perfeitamente em qualquer smartphone, sem necessidade de instalação de aplicativo.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Toda a infraestrutura é hospedada em servidores de alta disponibilidade, garantindo que os dados estejam acessíveis 24 horas por dia, 7 dias por semana — inclusive nos horários de madrugada, quando muitos pescadores e navegadores estão se preparando para sair ao mar.
            </p>
          </div>

          {/* Público */}
          <div className="classic-card p-8 md:p-10">
            <h2 className="font-syne font-bold text-2xl mb-4">Para Quem É o MaréAgora</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Desenvolvemos a plataforma pensando em todos que têm o mar como parte do dia a dia:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '🎣', title: 'Pescadores', desc: 'Planejam a saída com base nos horários exatos de virada da maré, quando os peixes estão mais ativos e as condições são mais favoráveis.' },
                { icon: '🏄', title: 'Surfistas', desc: 'Combinam previsão de ondas, vento e maré para escolher o pico e o momento certo de entrar na água com mais qualidade.' },
                { icon: '⛵', title: 'Navegantes', desc: 'Verificam o nível da maré antes de atracar ou navegar em áreas rasas, evitando encalhes e garantindo segurança na travessia.' },
                { icon: '🤿', title: 'Mergulhadores e caiaqueiros', desc: 'Dependem de condições seguras de corrente e visibilidade, diretamente ligadas ao ciclo das marés ao longo do dia.' },
                { icon: '🏖️', title: 'Turistas e veranistas', desc: 'Aproveitam a praia nos melhores horários, sabendo com antecedência quando a maré estará alta ou baixa.' },
                { icon: '🏗️', title: 'Engenheiros e técnicos', desc: 'Utilizam os dados para projetos costeiros, obras portuárias, monitoramento ambiental e estudos oceanográficos.' },
              ].map(item => (
                <div key={item.title} className="flex gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <div className="font-bold text-gray-800 text-sm mb-1">{item.title}</div>
                    <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div className="classic-card p-8 md:p-10">
            <h2 className="font-syne font-bold text-2xl mb-4">Contato</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Tem sugestões, encontrou algum erro nos dados ou quer entrar em contato com nossa equipe? Ficamos felizes em ouvir você. O MaréAgora é um projeto em constante evolução, e o feedback dos usuários é fundamental para melhorarmos a plataforma continuamente.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Você pode solicitar a inclusão de novas localidades, reportar inconsistências nas tábuas ou sugerir novas funcionalidades. Todas as mensagens são lidas pela equipe responsável pelo projeto.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Envie um e-mail para:{' '}
              <a href="mailto:contato@mareagora.com.br" className="text-blue-600 hover:underline font-medium">
                contato@mareagora.com.br
              </a>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
