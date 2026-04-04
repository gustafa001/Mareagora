
import Link from "next/link";

export const metadata = {
  title: "Sobre | MaréAgora",
  description:
    "Conheça o MaréAgora — a plataforma brasileira de previsão de marés em tempo real.",
};

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#0c2044] to-[#0f172a] px-6 py-20 text-center">
        {/* decorative waves */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-blue-400"
              style={{
                width: `${(i + 1) * 20}%`,
                height: `${(i + 1) * 20}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="mb-6 flex items-center justify-center gap-3">
            {/* wave emoji or logo placeholder */}
            <span className="text-5xl">🌊</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Sobre o MaréAgora
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Previsão de marés precisa, gratuita e pensada para quem vive o mar
            brasileiro.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-3xl px-6 py-14">
        <Card accent>
          <h2 className="mb-4 text-xl font-bold text-blue-300">
            Nossa Missão
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            O <strong className="text-white">MaréAgora</strong> nasceu para
            democratizar o acesso a dados de marés no Brasil. Pescadores,
            surfistas, mergulhadores, náuticos e curiosos merecem informações
            confiáveis — sem precisar decifrar PDFs da Marinha ou pagar por
            apps importados que ignoram a costa brasileira.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Combinamos os{" "}
            <span className="text-blue-300">
              dados oficiais da Marinha do Brasil (DHN)
            </span>{" "}
            com previsões de ondas e vento da{" "}
            <span className="text-blue-300">Open-Meteo Marine API</span>, tudo
            apresentado de forma clara, visual e em tempo real.
          </p>
        </Card>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "31+", label: "Portos cobertos" },
            { value: "24h", label: "Atualização contínua" },
            { value: "100%", label: "Dados oficiais" },
            { value: "Gratuito", label: "Para todos" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-center"
            >
              <p className="text-2xl font-extrabold text-blue-400">{s.value}</p>
              <p className="mt-1 text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-10">
          <h2 className="mb-6 text-xl font-bold text-white">
            Como funciona?
          </h2>
          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Dados da Marinha do Brasil",
                desc: "As tábuas de maré são extraídas dos PDFs oficiais da DHN para todos os portos cadastrados e armazenadas em banco de dados atualizado anualmente.",
              },
              {
                step: "02",
                title: "Previsão de ondas e vento",
                desc: "Integramos a Open-Meteo Marine API para oferecer dados de altura de swell, período de ondas e direção e intensidade do vento em tempo real.",
              },
              {
                step: "03",
                title: "Visualização intuitiva",
                desc: "Tudo é apresentado em gráficos interativos — curva de maré, swell e vento — com horários ajustados ao fuso horário local (UTC-3).",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-5 rounded-2xl border border-white/5 bg-white/[0.03] p-5"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-xs font-bold text-blue-300">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-white">Fontes de dados</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <SourceCard
              icon="⚓"
              title="Marinha do Brasil — DHN"
              desc="Tábuas de maré oficiais para todos os portos brasileiros, publicadas anualmente pela Diretoria de Hidrografia e Navegação."
              href="https://www.marinha.mil.br/dhn/"
            />
            <SourceCard
              icon="🌐"
              title="Open-Meteo Marine API"
              desc="API gratuita de previsão marítima com dados de ondas, swell, vento e correntes com resolução de até 1 km."
              href="https://open-meteo.com/en/docs/marine-weather-api"
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 text-sm text-yellow-200/80">
          ⚠️{" "}
          <strong className="text-yellow-300">Aviso importante:</strong> As
          previsões do MaréAgora são baseadas em modelos computacionais e dados
          históricos oficiais. Elas{" "}
          <strong>não substituem instrumentos náuticos profissionais</strong> nem
          a consulta às autoridades marítimas em situações de risco. Sempre
          priorize sua segurança no mar.
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
          <Link
            href="/portos"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Ver tábua de maré →
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-7 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
          >
            ← Voltar ao início
          </Link>
        </div>
      </section>
    </main>
  );
}

function Card({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        accent
          ? "border-blue-500/20 bg-blue-500/5"
          : "border-white/5 bg-white/[0.03]"
      }`}
    >
      {children}
    </div>
  );
}

function SourceCard({
  icon,
  title,
  desc,
  href,
}: {
  icon: string;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition hover:border-blue-500/30 hover:bg-blue-500/5"
    >
      <span className="text-2xl">{icon}</span>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-xs leading-relaxed text-slate-400">{desc}</p>
      <span className="mt-auto text-xs text-blue-400">Visitar fonte →</span>
    </a>
  );
}
