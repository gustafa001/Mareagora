import HomeHero from '@/components/HomeHero';
import FeaturedPorts from '@/components/FeaturedPorts';
import MostSearchedTides from '@/components/MostSearchedTides';
import BestTidesToday from '@/components/BestTidesToday';
import RegionalLinks from '@/components/RegionalLinks';
import RecentBlogPosts from '@/components/RecentBlogPosts';
import AdSlot from '@/components/ads/AdSlot';
import { AD_SLOTS } from '@/lib/adConfig';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import HomeFaq from '@/components/HomeFaq';
import { PORTS, getPortBySlug } from '@/lib/ports';
import { getEventosDia } from '@/lib/mare';
import { brtNow } from '@/lib/tideNow';
import { getHomeConditions } from '@/lib/homeConditions';

export const revalidate = 3600; // ISR: classificação "hoje" não pode congelar no build

const PORT_COUNT = PORTS.length;
const REFERENCE_PORT_SLUG = 'porto-de-santos';

export const metadata = {
  title: 'MaréAgora: Tábua de Maré Hoje em Todo o Brasil',
  description: 'Tábua de marés de hoje para portos e praias do Brasil: maré alta e baixa, coeficiente, ondas e vento. Dados oficiais da Marinha do Brasil (CHM).',
  alternates: {
    canonical: 'https://mareagora.com.br',
    languages: {
      'pt': 'https://mareagora.com.br',
      'x-default': 'https://mareagora.com.br',
    },
  },
};

export default async function Home() {
  // Marés do dia (fuso de Brasília) do porto de referência, calculadas no servidor
  // e entregues já no HTML: o gauge ao vivo só assume depois da hidratação.
  const referencePort = getPortBySlug(REFERENCE_PORT_SLUG);
  const todayDate = brtNow(new Date()).dateStr;
  const todayEvents = referencePort ? getEventosDia(referencePort, todayDate) : [];
  // Condições atuais do mar (onda, vento, água) — servidor, cache 1h; null se a API falhar.
  const conditions = referencePort ? await getHomeConditions(referencePort.lat, referencePort.lon) : null;

  return (
    <main className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden">
      <SchemaGenerator
        type="Home"
        url="https://mareagora.com.br"
        title="MaréAgora: Tábua de Maré Hoje em Todo o Brasil"
        description="Tábua de marés de hoje para portos e praias do Brasil: maré alta e baixa, coeficiente, ondas e vento. Dados oficiais da Marinha do Brasil (CHM)."
      />

      {/* SEÇÃO HERO (Mantendo busca e funcionalidades originais) */}
      <HomeHero
        todayDate={todayDate}
        todayEvents={todayEvents.map(({ hora, altura_m, tipo }) => ({ hora, altura_m, tipo }))}
        conditions={conditions}
      />

      {/* SEÇÃO 1: Portos em Destaque */}
      <FeaturedPorts />

      <MostSearchedTides />

      {/* SEÇÃO 1.5: Melhores do litoral hoje (classificação qualitativa) */}
      <BestTidesToday />

      {/* SEÇÃO 2: Conteúdo Editorial (SEO) */}
      <section className="w-full max-w-4xl mx-auto px-6 py-16 text-slate-300 border-t border-white/5">
        <h2 className="text-3xl font-black text-white mb-8 font-syne tracking-tight text-center md:text-left">
          Tábua de Marés do Brasil — Dados Oficiais da Marinha
        </h2>
        
        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            A <strong className="text-blue-400">tábua de marés</strong> é uma ferramenta essencial para qualquer atividade realizada na costa. Ela registra as oscilações periódicas do nível do mar, informando os horários exatos da <strong className="text-white">maré alta (preamar)</strong> e da <strong className="text-white">maré baixa (baixamar)</strong>. Compreender o ciclo das marés é fundamental para garantir a segurança na navegação, planejar o melhor momento para a pesca ou simplesmente aproveitar uma praia com faixa de areia estendida.
          </p>

          <p>
            No MaréAgora, utilizamos os dados oficiais fornecidos pela <strong className="text-white">Diretoria de Hidrografia e Navegação (DHN) da Marinha do Brasil</strong>. Nossa plataforma processa essas informações astronômicas para oferecer uma interface moderna e intuitiva, permitindo que você consulte a <strong className="text-blue-400">previsão de marés</strong> de forma rápida e precisa em {PORT_COUNT} portos e estações costeiras brasileiras, do Rio Grande do Sul ao Amapá.
          </p>

          <p>
            Seja você um <strong className="text-white">pescador</strong> em busca do melhor coeficiente de maré, um <strong className="text-white">surfista</strong> analisando a variação da profundidade para as ondas, um <strong className="text-white">mergulhador</strong> planejando a visibilidade da água ou um <strong className="text-white">navegante</strong> atento ao calado seguro, o MaréAgora é seu parceiro confiável. Oferecemos dados consolidados para tornar sua experiência no litoral brasileiro mais produtiva e segura.
          </p>
        </div>
      </section>

      {/* SEÇÃO 2.5: Como interpretar, FAQ e localidades de destaque (SEO) */}
      <HomeFaq />

      {/* SEÇÃO 4: Posts do Blog */}
      <RecentBlogPosts />

      {/* SEÇÃO 3: Links por Região */}
      <RegionalLinks />

      {/* Publicidade / Footer */}
      <div className="w-full py-12 flex justify-center border-t border-white/5">
        <AdSlot slotId={AD_SLOTS.PREFOOTER} format="horizontal" />
      </div>

      <div className="w-full py-8 text-center bg-slate-950">
        <p className="text-slate-600 text-xs">
          Dados oficiais da Marinha do Brasil • MaréAgora © {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
