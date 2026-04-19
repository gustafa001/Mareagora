
'use client';

import { useState } from 'react';

interface ShareButtonProps {
  portName: string;
  slug: string;
}

export default function ShareButton({ portName, slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `https://www.mareagora.com.br/mare/${slug}`;
    if (navigator.share) {
      await navigator.share({ title: `Tábua de Maré ${portName}`, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-14 h-14 rounded-full bg-[#2a68f6] text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all"
      aria-label="Compartilhar"
    >
      {copied ? '✓' : '🔗'}
    </button>
  );
}
