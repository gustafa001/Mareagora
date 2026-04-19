/**
 * Home Page
 * 
 * Design: Maritime Professional
 * - Hero section with ocean imagery
 * - Featured content sections
 * - Call-to-action buttons
 * - Clean, professional layout
 */

import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, HelpCircle, Waves } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}\n      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663540123945/mVcVYXQTzdvfCdkZG2aUmm/hero-ocean-sunrise-5oCyapg8htSXDBuPr9S66F.webp"
          alt="Oceano ao amanhecer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="container">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Marés do Brasil ao Seu Alcance
              </h1>
              <p className="text-lg md:text-xl text-gray-100 mb-8">
                Consulte a tábua de marés dos principais portos brasileiros com precisão e confiabilidade. Planeje suas atividades no mar com segurança.
              </p>
              <div className="flex gap-4">
                <Link href="/blog">
                  <a>
                    <Button className="bg-accent-maritime hover:bg-amber-600 text-maritime">
                      Explorar Blog
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </Link>
                <Link href="/faq">
                  <a>
                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                      Saiba Mais
                    </Button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1">
        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-maritime mb-4">
                Por Que Usar MaréAgora?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tudo que você precisa para entender e aproveitar as marés do litoral brasileiro
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card-maritime">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Waves className="w-6 h-6 text-maritime" />
                  </div>
                  <h3 className="text-xl font-bold text-maritime">Dados Oficiais</h3>
                </div>
                <p className="text-gray-600">
                  Utilizamos as tábuas da Marinha do Brasil, a fonte mais confiável e precisa para previsão de marés.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card-maritime">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-maritime" />
                  </div>
                  <h3 className="text-xl font-bold text-maritime">Conteúdo Educativo</h3>
                </div>
                <p className="text-gray-600">
                  Artigos e guias sobre marés, praias e atividades náuticas para você entender o fenômeno.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card-maritime">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-maritime" />
                  </div>
                  <h3 className="text-xl font-bold text-maritime">Fácil de Usar</h3>
                </div>
                <p className="text-gray-600">
                  Sem cadastro necessário. Acesse, consulte e vá aproveitar o mar com segurança.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container">
            <div className="bg-gradient-to-r from-maritime to-blue-700 rounded-lg p-8 md:p-12 text-white text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comece a Consultar as Marés Agora
              </h2>
              <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
                Acesse a tábua de marés dos principais portos brasileiros e planeje suas atividades com confiança.
              </p>
              <Link href="/blog">
                <a>
                  <Button className="bg-white text-maritime hover:bg-gray-100">
                    Explorar Conteúdo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </section>

        {/* Ad Space */}
        <section className="py-8 bg-white border-t border-gray-200">
          <div className="container text-center text-gray-500 text-sm">
            <p>Espaço para anúncios (AdSense)</p>
          </div>
        </section>
      </main>
    </div>
  );
}
