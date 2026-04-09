
import Link from "next/link";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Política de Privacidade | MaréAgora",
  description:
    "Saiba como o MaréAgora coleta, usa e protege seus dados pessoais de acordo com a LGPD.",
};

const ULTIMA_ATUALIZACAO = "09 de abril de 2026";

export default function PrivacidadePage() {
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
            🔒 Privacidade
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Política de Privacidade
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
          <Block title="1. Quem somos">
            O <strong>MaréAgora</strong> (mareagora.com.br) é uma plataforma
            independente de previsão de marés, ondas e ventos para o litoral
            brasileiro. Para dúvidas ou solicitações relacionadas a esta
            política, entre em contato pelo e-mail:{" "}
            <a
              href="mailto:cantatos@mareagora.com.br"
              className="text-blue-400 underline"
            >
              cantatos@mareagora.com.br
            </a>
          </Block>

          <Block title="2. Dados que coletamos">
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>
                <Dot />
                <strong>Dados de uso:</strong> páginas visitadas, tempo de
                acesso, portos consultados.
              </li>
              <li>
                <Dot />
                <strong>Dados de dispositivo:</strong> tipo de navegador, sistema
                operacional e resolução de tela.
              </li>
              <li>
                <Dot />
                <strong>Localização aproximada:</strong> inferida pelo endereço
                IP para sugerir portos próximos. Nenhuma geolocalização precisa é
                armazenada.
              </li>
              <li>
                <Dot />
                <strong>Dados de contato (opcional):</strong> e-mail fornecido
                voluntariamente pelo formulário de contato.
              </li>
            </ul>
          </Block>

          <Block title="3. Como usamos os dados">
            Usamos as informações coletadas exclusivamente para:
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>
                <Dot />
                Exibir previsões personalizadas pela região do usuário.
              </li>
              <li>
                <Dot />
                Melhorar a performance e a experiência do site.
              </li>
              <li>
                <Dot />
                Responder mensagens de contato enviadas pelo usuário.
              </li>
              <li>
                <Dot />
                Gerar relatórios de uso agregados e anônimos.
              </li>
            </ul>
            <p className="mt-3">
              Não vendemos, alugamos nem compartilhamos dados pessoais com
              terceiros para fins comerciais.
            </p>
          </Block>

          <Block title="4. Google Analytics (GA4)">
            Utilizamos o <strong>Google Analytics 4</strong> com anonimização
            de IP ativada para entender como os visitantes usam o site. Os
            dados são agregados e anônimos. Você pode desativar o rastreamento
            em:{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              tools.google.com/dlpage/gaoptout
            </a>
          </Block>

          <Block title="5. Google AdSense e anúncios personalizados">
            O MaréAgora exibe anúncios via <strong>Google AdSense</strong>. O
            Google utiliza cookies para veicular anúncios com base nos seus
            interesses e visitas anteriores a este e outros sites. Você pode:
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>
                <Dot />
                Verificar e ajustar suas preferências em:{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  adssettings.google.com
                </a>
              </li>
              <li>
                <Dot />
                Consultar a Política de Privacidade do Google:{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  policies.google.com/privacy
                </a>
              </li>
            </ul>
            <p className="mt-3">
              Para cumprir os requisitos do AdSense e da LGPD, este site exibe
              um aviso de cookies na primeira visita.
            </p>
          </Block>

          <Block title="6. Cookies">
            Utilizamos:
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>
                <Dot />
                <strong>Cookies funcionais:</strong> preferências de porto e
                tema (sem expiração de sessão). Não coletam dados pessoais
                identificáveis.
              </li>
              <li>
                <Dot />
                <strong>Cookies analíticos:</strong> Google Analytics 4 (com
                anonimização de IP).
              </li>
              <li>
                <Dot />
                <strong>Cookies de publicidade:</strong> Google AdSense.
              </li>
            </ul>
            <p className="mt-3">
              Você pode gerenciar ou desativar cookies nas configurações do seu
              navegador. Algumas funcionalidades podem ficar limitadas. Consulte
              nossa{" "}
              <Link href="/cookies" className="text-blue-400 underline">
                Política de Cookies
              </Link>{" "}
              para mais detalhes.
            </p>
          </Block>

          <Block title="7. Compartilhamento com terceiros">
            Compartilhamos dados apenas com:
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>
                <Dot />
                <strong>Google LLC</strong> (Analytics e AdSense) — sujeito à
                política de privacidade do Google.
              </li>
              <li>
                <Dot />
                <strong>Vercel Inc.</strong> (hospedagem) — sob acordo de
                confidencialidade.
              </li>
              <li>
                <Dot />
                Autoridades competentes, quando exigido por lei brasileira.
              </li>
            </ul>
          </Block>

          <Block title="8. Seus direitos (LGPD — Lei nº 13.709/2018)">
            Nos termos da Lei Geral de Proteção de Dados, você tem direito a:
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>
                <Dot />
                Confirmar se tratamos seus dados.
              </li>
              <li>
                <Dot />
                Acessar, corrigir ou excluir seus dados pessoais.
              </li>
              <li>
                <Dot />
                Revogar consentimento a qualquer momento.
              </li>
              <li>
                <Dot />
                Solicitar portabilidade dos dados.
              </li>
              <li>
                <Dot />
                Opor-se ao tratamento.
              </li>
            </ul>
            <p className="mt-3">
              Para exercer esses direitos, entre em contato:{" "}
              <a
                href="mailto:cantatos@mareagora.com.br"
                className="text-blue-400 underline"
              >
                cantatos@mareagora.com.br
              </a>
            </p>
          </Block>

          <Block title="9. Retenção de dados">
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>
                <Dot />
                <strong>Dados de uso (Analytics):</strong> retidos por até 14
                meses.
              </li>
              <li>
                <Dot />
                <strong>E-mails de contato:</strong> retidos pelo tempo
                necessário para resposta e pelo período mínimo exigido por lei.
              </li>
            </ul>
          </Block>

          <Block title="10. Alterações nesta política">
            Podemos atualizar esta política periodicamente. Alterações
            relevantes serão comunicadas via aviso no site. O uso contínuo após
            a publicação constitui aceite das mudanças.
          </Block>

          <Block title="11. Contato">
            Dúvidas sobre esta política? Fale conosco:
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

        <div className="mt-14 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-6 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
          >
            ← Voltar ao início
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
