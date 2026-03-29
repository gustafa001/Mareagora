"use client";

import Link from "next/link";
import { PORTS, Port } from "@/lib/ports";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export default function NavBar() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Port[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (val: string) => {
    setSearch(val);
    const searchNormalized = normalize(val);
    if (searchNormalized.length > 1) {
      const filtered = PORTS.filter(p => 
        normalize(p.name).includes(searchNormalized) || 
        normalize(p.state).includes(searchNormalized) ||
        p.searchNames?.some(sn => normalize(sn).includes(searchNormalized))
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      goToPort(suggestions[0]);
    }
  };

  const goToPort = (port: Port) => {
    setSearch("");
    setShowSuggestions(false);
    router.push(`/mare/${port.slug}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 bg-[rgba(6,16,30,0.9)] backdrop-blur-xl border-b border-[rgba(56,201,240,0.08)]">
      <Link href="/" className="font-syne font-extrabold text-xl text-[var(--white)]">
        Maré<span className="text-[var(--foam)]">Agora</span>
      </Link>

      <div className="flex items-center gap-4">
        <div className="relative" ref={menuRef}>
          <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(56,201,240,0.15)] rounded-full px-4 py-1.5 overflow-hidden focus-within:border-[var(--foam)] transition-all">
            <span className="text-sm">🔍</span>
            <input
              type="text"
              placeholder="Buscar porto ou cidade…"
              className="bg-transparent border-none outline-none text-[var(--white)] text-sm w-48 placeholder:text-[var(--muted)]"
              value={search}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => search.length > 1 && setShowSuggestions(true)}
            />
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-[rgba(13,34,64,0.95)] border border-[rgba(56,201,240,0.2)] rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {suggestions.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => goToPort(p)}
                  className="w-full text-left px-4 py-2.5 hover:bg-[rgba(56,201,240,0.12)] flex items-center justify-between group transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[var(--white)] group-hover:text-[var(--foam)]">
                      {p.searchNames && p.searchNames.some(sn => normalize(sn).includes(normalize(search))) 
                        ? `${p.searchNames.find(sn => normalize(sn).includes(normalize(search)))} (${p.name})`
                        : p.name
                      }
                    </span>
                    <span className="text-[0.7rem] text-[var(--muted)]">{p.state} · {p.region}</span>
                  </div>
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">⚓</span>
                </button>
              ))}
            </div>
          )}
        </div>

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
