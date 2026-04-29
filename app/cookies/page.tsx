// Tarefa 7: Política de Cookies — exigida pelo Google AdSense
import Link from "next/link";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Política de Cookies | MaréAgora",
  description:
    "Saiba quais cookies o MaréAgora utiliza, para que servem e como gerenciá-los.",
};

const ULTIMA_ATUALIZACAO = "09 de abril de 2026";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <NavBar />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#0c2044] to-[#0f172a] px-6 py-16 text-center">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-blue-400"
              style={{
                width: `${(i + 1) * 18}%`,
                height: `${(i + 1) * 18}%`,
                opacity: 1 - i * 0.15,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 mx-auto max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
            🍪 Cookies
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Política de Cookies
          </h1>
          <p className="mt-4 text-sm text-slate-400">
            Última atualização:{" "}
            <span className="text-slate-300">{ULTIMA_ATUALIZACAO}</span>
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="prose prose-invert prose-slate max-w-none space-y-10">

          <Block title="O que são cookies?">
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo
            quando você visita um site. Eles permitem que o site lembre suas
            preferências e melhore sua experiência de navegação.
          </Block>

          <Block title="Quais cookies usamos?">
            <div className="space-y-6">

              <div>
                <h3 className="text-base font-bold text-white mb-2">
                  Cookies necessários (sempre ativos)
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li>
                    <Dot />
                    Preferências de porto favorito
                  </li>
                  <li>
                    <Dot />
                    Tema de interface (claro/escuro)
                  </li>
                </ul>
                <p className="mt-2 text-slate-400">
                  Esses cookies não coletam dados pessoais identificáveis e são
                  necessários para o funcionamento básico do site.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-2">
                  Cookies analíticos (Google Analytics 4)
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li>
                    <Dot />
                    <strong>Finalidade:</strong> entender como os visitantes usam
                    o site (páginas visitadas, tempo de sessão, portos consultados)
                  </li>
                  <li>
                    <Dot />
                    <strong>Provedor:</strong> Google LLC
                  </li>
                  <li>
                    <Dot />
                    <strong>Duração:</strong> até 14 meses
                  </li>
                  <li>
                    <Dot />
                    <strong>Desativar:</strong>{" "}
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      tools.google.com/dlpage/gaoptout
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-2">
                  Cookies de publicidade (Google AdSense)
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li>
                    <Dot />
                    <strong>Finalidade:</strong> exibir anúncios relevantes com
                    base nos seus interesses e histórico de navegação
                  </li>
                  <li>
                    <Dot />
                    <strong>Provedor:</strong> Google LLC
                  </li>
                  <li>
                    <Dot />
                    <strong>Duração:</strong> até 13 meses
                  </li>
                  <li>
                    <Dot />
                    <strong>Gerenciar:</strong>{" "}
                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      adssettings.google.com
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </Block>

          <Block title="Como gerenciar cookies?">
            Você pode desativar ou excluir cookies nas configurações do seu
            navegador. Veja como:
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>
                <Dot />
                <strong>Chrome:</strong>{" "}
                <code className="text-blue-300">chrome://settings/cookies</code>
              </li>
              <li>
                <Dot />
                <strong>Firefox:</strong>{" "}
                <code className="text-blue-300">about:preferences#privacy</code>
              </li>
              <li>
                <Dot />
                <strong>Safari:</strong> Preferências &gt; Privacidade
              </li>
              <li>
                <Dot />
                <strong>Edge:</strong>{" "}
                <code className="text-blue-300">edge://settings/cookies</code>
              </li>
            </ul>
            <p className="mt-3 text-slate-400">
              Atenção: desativar cookies pode limitar algumas funcionalidades do
              site, como a lembrança do porto favorito.
            </p>
          </Block>

          <Block title="Contato">
            Dúvidas sobre cookies ou sobre esta política? Entre em contato:
            <p className="mt-2 text-slate-300">
              📧{" "}
              <a
                href="mailto:cantatos@mareagora.com.br"
                className="text-blue-400 underline"
              >
                cantatos@mareagora.com.br
              </a>
            </p>
          </Block>

        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <Link
            href="/privacidade"
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-6 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
          >
            Política de Privacidade
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-6 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
          >
            ← Início
          </Link>
        </div>
      </section>
    </main>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
      <h2 className="mb-3 text-lg font-bold text-blue-300">{title}</h2>
      <div className="text-sm leading-relaxed text-slate-400">{children}</div>
    </div>
  );
}

function Dot() {
  return (
    <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-blue-400" />
  );
}
