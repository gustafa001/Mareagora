import HomeHero from '@/components/HomeHero';
import FeaturedPorts from '@/components/FeaturedPorts';
import RegionalLinks from '@/components/RegionalLinks';
import RecentBlogPosts from '@/components/RecentBlogPosts';
import AdSlot from '@/components/ads/AdSlot';
import { AD_SLOTS } from '@/lib/adConfig';

export const metadata = {
  title: 'MaréAgora — Tábua de Marés do Brasil em Tempo Real',
  description: 'Consulte a tábua de marés oficial da Marinha do Brasil para todos os portos. Previsão de maré alta e baixa, ondas e vento para pesca, surf e navegação.',
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden">
      {/* SEÇÃO HERO (Mantendo busca e funcionalidades originais) */}
      <HomeHero />

      {/* SEÇÃO 1: Portos em Destaque */}
      <FeaturedPorts />

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
            No MaréAgora, utilizamos os dados oficiais fornecidos pela <strong className="text-white">Diretoria de Hidrografia e Navegação (DHN) da Marinha do Brasil</strong>. Nossa plataforma processa essas informações astronômicas para oferecer uma interface moderna e intuitiva, permitindo que você consulte a <strong className="text-blue-400">previsão de marés</strong> de forma rápida e precisa em mais de 50 portos brasileiros, desde o Rio Grande do Sul até o Amapá.
          </p>

          <p>
            Seja você um <strong className="text-white">pescador</strong> em busca do melhor coeficiente de maré, um <strong className="text-white">surfista</strong> analisando a variação da profundidade para as ondas, um <strong className="text-white">mergulhador</strong> planejando a visibilidade da água ou um <strong className="text-white">navegante</strong> atento ao calado seguro, o MaréAgora é seu parceiro confiável. Oferecemos dados consolidados para tornar sua experiência no litoral brasileiro mais produtiva e segura.
          </p>
        </div>
      </section>

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
