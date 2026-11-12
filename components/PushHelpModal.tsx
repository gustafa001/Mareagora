'use client';

import { useEffect } from 'react';
import { X, Share, SquarePlus, Settings } from 'lucide-react';
import { getOS, type PushEnv } from '@/lib/pushEnv';

interface Props {
  kind: Exclude<PushEnv, 'ok'>;
  onClose: () => void;
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center justify-center">
        {n}
      </span>
      <span className="text-slate-300 text-sm leading-relaxed">{children}</span>
    </li>
  );
}

export default function PushHelpModal({ kind, onClose }: Props) {
  const os = getOS();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  let title = '';
  let intro = '';
  let steps: React.ReactNode[] = [];

  if (kind === 'ios-install') {
    title = 'Instale o MaréAgora no iPhone';
    intro = 'No iPhone, os alertas só funcionam com o site instalado na Tela de Início. Leva 10 segundos:';
    steps = [
      <>Toque no botão <Share size={14} className="inline -mt-1" /> <b>Compartilhar</b> do Safari (barra inferior).</>,
      <>Escolha <SquarePlus size={14} className="inline -mt-1" /> <b>Adicionar à Tela de Início</b>.</>,
      <>Abra o <b>MaréAgora</b> pelo ícone novo na tela e toque em <b>Ativar alertas</b> de novo.</>,
      <>Quando aparecer &quot;MaréAgora gostaria de enviar notificações&quot;, toque em <b>Permitir</b>.</>,
    ];
  } else if (kind === 'denied') {
    title = 'Libere as notificações';
    intro = 'As notificações estão bloqueadas neste aparelho, e o navegador não pergunta de novo. Libere manualmente:';
    if (os === 'ios') {
      steps = [
        <>Abra <Settings size={14} className="inline -mt-1" /> <b>Ajustes</b> do iPhone → <b>Notificações</b>.</>,
        <>Toque em <b>MaréAgora</b> e ative <b>Permitir Notificações</b>.</>,
        <>Volte ao app e toque em <b>Ativar alertas</b>.</>,
      ];
    } else if (os === 'android') {
      steps = [
        <>Toque no <b>cadeado</b> (ou ícone ⓘ) ao lado do endereço do site.</>,
        <>Entre em <b>Permissões</b> → <b>Notificações</b> e escolha <b>Permitir</b>.</>,
        <>Se não aparecer: <b>Configurações do Android</b> → <b>Apps</b> → <b>Chrome</b> (ou o app MaréAgora) → <b>Notificações</b> → ativar.</>,
        <>Recarregue a página e toque em <b>Ativar alertas</b>.</>,
      ];
    } else {
      steps = [
        <>Clique no <b>cadeado</b> ao lado do endereço do site.</>,
        <>Em <b>Notificações</b>, escolha <b>Permitir</b>.</>,
        <>Recarregue a página e clique em <b>Ativar alertas</b>.</>,
      ];
    }
  } else {
    title = 'Navegador sem suporte';
    intro = 'Este navegador não suporta alertas no celular. Tente abrir o MaréAgora no Chrome (Android) ou no Safari atualizado (iPhone, iOS 16.4 ou mais novo).';
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-slate-100 font-bold text-lg leading-tight">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-slate-400 hover:text-slate-200 shrink-0"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-slate-400 text-sm mb-4">{intro}</p>
        {steps.length > 0 && (
          <ol className="flex flex-col gap-3 mb-5">
            {steps.map((s, i) => (
              <Step key={i} n={i + 1}>{s}</Step>
            ))}
          </ol>
        )}
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-colors"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
