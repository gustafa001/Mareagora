import Link from "next/link";
import { Port } from "@/lib/ports";

interface NearbyPortsProps {
  ports: Port[];
}

export default function NearbyPorts({ ports }: NearbyPortsProps) {
  return (
    <div className="other-section mt-12 mb-20 container">
      <div className="other-title font-syne font-extrabold text-[1.3rem] mb-5 text-[var(--white)]">
        Outras cidades <span className="text-[var(--foam)]">próximas</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
        {ports.map((p) => (
          <Link 
            key={p.slug} 
            href={`/mare/${p.slug}`}
            className="block bg-[rgba(13,34,64,0.6)] border border-[rgba(56,201,240,0.1)] rounded-2xl p-4.5 hover:border-[rgba(56,201,240,0.35)] hover:bg-[rgba(14,127,190,0.15)] hover:-translate-y-0.5 transition-all"
          >
            <div className="font-syne font-bold text-[0.9rem] text-[var(--white)]">{p.name}</div>
            <div className="text-[var(--muted)] text-[0.78rem] mt-0.5">{p.state}</div>
            <div className="text-[var(--foam)] text-[0.82rem] mt-1.5 font-medium">Ver tábua de maré</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
