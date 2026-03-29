"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PORTS, Port } from "@/lib/ports";
import Link from "next/link";

const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export default function HeroSearch() {
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
    if (searchNormalized.length > 0) {
      const filtered = PORTS.filter(p => 
        normalize(p.name).includes(searchNormalized) || 
        normalize(p.state).includes(searchNormalized) ||
        p.searchNames?.some(sn => normalize(sn).includes(searchNormalized))
      ).slice(0, 6);
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
    <div className="w-full max-w-2xl mx-auto relative mt-8 mb-4 border border-[rgba(255,255,255,0.1)] rounded-full bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-2xl z-20" ref={menuRef}>
      <form onSubmit={handleSearch} className="flex items-center w-full px-6 py-4">
        <span className="text-xl opacity-70">🔍</span>
        <input
          type="text"
          placeholder="Procure o seu porto ou praia de eleição..."
          className="bg-transparent border-none outline-none text-white text-lg w-full px-4 placeholder:text-[rgba(255,255,255,0.5)] font-syne"
          value={search}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => search.length > 0 && setShowSuggestions(true)}
        />
        <button type="submit" className="bg-[#2a68f6] hover:bg-[#38c9f0] transition-colors text-white font-bold py-2 px-6 rounded-full text-sm">
          Avançar
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.map((p) => (
            <button
              key={p.slug}
              onClick={() => goToPort(p)}
              className="w-full text-left px-6 py-3 hover:bg-gray-50 flex items-center justify-between group transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-800 group-hover:text-[#2a68f6] transition-colors font-syne">
                  {p.searchNames && p.searchNames.some(sn => normalize(sn).includes(normalize(search))) 
                    ? p.searchNames.find(sn => normalize(sn).includes(normalize(search)))
                    : p.name
                  }
                </span>
                <span className="text-xs text-gray-500 font-inter">
                  {p.searchNames && p.searchNames.some(sn => normalize(sn).includes(normalize(search))) 
                    ? `Aprox. de ${p.name} · ${p.state}`
                    : `${p.state} · ${p.region}`
                  }
                </span>
              </div>
              <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">⚓ Ver Tábua</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
