const fs = require('fs');
const path = require('path');

const routes = [
  { path: 'mare-hoje', title: 'Maré Hoje', desc: 'Previsão atualizada da maré para hoje em todo o Brasil.' },
  { path: 'mare-amanha', title: 'Maré Amanhã', desc: 'Previsão de maré alta e baixa para o dia de amanhã.' },
  { path: 'mare-semana', title: 'Maré da Semana', desc: 'Tábua de maré completa para os próximos 7 dias.' },
  { path: 'mare-viva', title: 'Maré Viva (Sizígia)', desc: 'Entenda quando ocorrem as marés vivas e seu impacto.' },
  { path: 'mare-morta', title: 'Maré Morta (Quadratura)', desc: 'Calendário e explicação das marés mortas.' },
  { path: 'lua', title: 'Fases da Lua e a Maré', desc: 'Como a lua influencia as marés e o calendário lunar.' },
  { path: 'ondas', title: 'Previsão de Ondas', desc: 'Condições de surf e navegação.' },
  { path: 'coeficiente', title: 'Coeficiente de Maré', desc: 'Como interpretar o coeficiente de maré.' },
  { path: 'pesca', title: 'Maré para Pesca', desc: 'Os melhores horários de maré para pescar.' },
  { path: 'estados', title: 'Tábua de Marés por Estado', desc: 'Navegue pelas previsões de maré de todos os estados costeiros.' },
  { path: 'praias', title: 'Guia de Praias', desc: 'Condições do mar em todas as praias.' },
];

const appDir = path.join(__dirname, '../app');

for (const route of routes) {
  const dirPath = path.join(appDir, route.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const pageContent = `import type { Metadata } from 'next';
import SchemaGenerator from '@/components/seo/SchemaGenerator';

export const metadata: Metadata = {
  title: '${route.title} | MaréAgora',
  description: '${route.desc}',
  alternates: { canonical: 'https://mareagora.com.br/${route.path}' },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <SchemaGenerator 
        type="WebPage"
        url="https://mareagora.com.br/${route.path}"
        title="${route.title} | MaréAgora"
        description="${route.desc}"
      />
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 font-syne mb-6">
          ${route.title}
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          ${route.desc}
        </p>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500">Página otimizada com SEO Programático (Conteúdo em desenvolvimento dinâmico).</p>
        </div>
      </div>
    </main>
  );
}
`;
  
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), pageContent);
}

console.log('Rotas estáticas criadas com sucesso!');
