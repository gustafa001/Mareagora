
import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade | MaréAgora",
  description:
    "Saiba como o MaréAgora coleta, usa e protege seus dados pessoais.",
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
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
            <span className="text-slate-300">01 de abril de 2026</span>
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="prose prose-invert prose-slate max-w-none space-y-10">
          <Block title="1. Sobre esta Política">
            Esta Política de Privacidade descreve como o{" "}
            <strong>MaréAgora</strong> («nós», «nosso») coleta, usa e protege as
            informações dos usuários ao acessar{" "}
            <span className="text-blue-400">mareagora.com.br</span>. Ao usar
            nosso serviço, você concorda com as práticas descritas aqui.
          </Block>

          <Block title="2. Dados que Coletamos">
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

          <Block title="3. Como Usamos seus Dados">
            Usamos as informações coletadas exclusivamente para:
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>
                <Dot />
                Exibir previsões de marés personalizadas pela localização.
              </li>
              <li>
                <Dot />
                Melhorar a performance e a experiência da plataforma.
              </li>
              <li>
                <Dot />
                Responder mensagens enviadas pelo formulário de contato.
              </li>
              <li>
                <Dot />
                Gerar relatórios de uso agregados e anônimos.
              </li>
            </ul>
            Não vendemos, alugamos ou compartilhamos seus dados pessoais com
            terceiros para fins comerciais.
          </Block>

          <Block title="4. Cookies e Tecnologias de Rastreamento">
            Utilizamos cookies de sessão para manter preferências do usuário
            (porto favorito, tema) e ferramentas de analytics (ex.: Google
            Analytics) com anonimização de IP ativada. Você pode desativar
            cookies nas configurações do seu navegador; algumas funcionalidades
            podem ficar limitadas.
          </Block>

          <Block title="5. Anúncios">
            O MaréAgora pode exibir anúncios via{" "}
            <strong>Google AdSense</strong>. O Google pode usar cookies para
            veicular anúncios personalizados com base em visitas anteriores a
            este e a outros sites. Consulte a{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Política de Privacidade do Google
            </a>{" "}
            para mais informações.
          </Block>

          <Block title="6. Compartilhamento com Terceiros">
            Podemos compartilhar dados apenas com:
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>
                <Dot />
                Provedores de infraestrutura (Vercel, Supabase) sob acordos de
                confidencialidade.
              </li>
              <li>
                <Dot />
                Autoridades competentes, quando exigido por lei.
              </li>
            </ul>
          </Block>

          <Block title="7. Segurança">
            Adotamos medidas técnicas e organizacionais adequadas — incluindo
            HTTPS e acesso restrito a banco de dados — para proteger seus dados
            contra acesso não autorizado, alteração ou divulgação indevida.
          </Block>

          <Block title="8. Seus Direitos (LGPD)">
            Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018),
            você tem direito a:
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>
                <Dot />
                Confirmar se tratamos seus dados.
              </li>
              <li>
                <Dot />
                Solicitar acesso, correção ou exclusão dos dados.
              </li>
              <li>
                <Dot />
                Revogar consentimento a qualquer momento.
              </li>
              <li>
                <Dot />
                Solicitar portabilidade dos dados.
              </li>
            </ul>
            Para exercer seus direitos, entre em contato pelo e-mail:{" "}
            <a
              href="mailto:privacidade@mareagora.com.br"
              className="text-blue-400 underline"
            >
              privacidade@mareagora.com.br
            </a>
          </Block>

          <Block title="9. Retenção de Dados">
            Dados de uso são retidos por até 12 meses. E-mails de contato são
            mantidos pelo tempo necessário para responder à solicitação e por
            período adicional exigido por lei.
          </Block>

          <Block title="10. Alterações nesta Política">
            Podemos atualizar esta política periodicamente. Notificaremos
            alterações relevantes via aviso no site. O uso contínuo após a
            publicação constitui aceite das mudanças.
          </Block>

          <Block title="11. Contato">
            Dúvidas sobre esta política? Fale conosco:
            <p className="mt-2 text-slate-300">
              📧{" "}
              <a
                href="mailto:privacidade@mareagora.com.br"
                className="text-blue-400 underline"
              >
                contatos@mareagora.com.br
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
