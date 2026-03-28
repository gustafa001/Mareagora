"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PORTS } from "@/lib/ports";

const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export default function NavBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = normalize(search);
    if (query) {
      // Mapeamento manual para termos comuns (já normalizados)
      const aliases: Record<string, string> = {
        "guaruja": "porto-de-santos",
        "bertioga": "porto-de-santos",
        "caraguatatuba": "porto-de-sao-sebastiao",
        "ubatuba": "porto-de-sao-sebastiao",
      };

      if (aliases[query]) {
        router.push(`/mare/${aliases[query]}`);
        setSearch("");
        return;
      }

      // Busca por nome ou slug
      const match = PORTS.find(p => 
        normalize(p.name).includes(query) || 
        p.slug.includes(query) ||
        normalize(p.state).includes(query)
      );

      if (match) {
        router.push(`/mare/${match.slug}`);
      } else {
        // Fallback para o comportamento original
        router.push(`/mare/${query.replace(/ /g, "-")}`);
      }
      setSearch("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 bg-[rgba(6,16,30,0.9)] backdrop-blur-xl border-b border-[rgba(56,201,240,0.08)]">
      <Link href="/" className="font-syne font-extrabold text-xl text-[var(--foam)]">
        Maré<span className="text-[var(--sun)]">Agora</span>
      </Link>

      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(56,201,240,0.15)] rounded-full px-4 py-1.5 overflow-hidden">
          <span className="text-sm">🔍</span>
          <input
            type="text"
            placeholder="Outra cidade…"
            className="bg-transparent border-none outline-none text-[var(--white)] text-sm w-40 placeholder:text-[var(--muted)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <button className="hidden sm:block bg-[rgba(56,201,240,0.15)] border border-[rgba(56,201,240,0.3)] text-[var(--foam)] font-syne font-bold text-xs px-4 py-1.5 rounded-full hover:bg-[rgba(56,201,240,0.3)] transition-all">
          📲 Instalar app
        </button>
      </div>
      
      <style jsx>{`
        nav {
          font-family: var(--font-dm-sans);
        }
        .font-syne {
          font-family: var(--font-syne);
        }
      `}</style>
    </nav>
  );
}
