"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      // Logic for search would go here, for now let's just go to the slug if it exists
      // or a search results page if we had one.
      // For this migration, we'll keep it simple.
      router.push(`/mare/${search.toLowerCase().replace(/ /g, "-")}`);
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
