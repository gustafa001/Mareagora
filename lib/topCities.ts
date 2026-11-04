import { getPortBySlug } from '@/lib/ports';
import { getStateSlug } from '@/lib/states';

// Cidades com mais impressões no Google e CTR baixo. Ordem = prioridade.
// `label` é o texto da âncora (mesmo termo que as pessoas pesquisam).
const TOP_CITY_DEFS = [
  { slug: 'sao-luis', label: 'São Luís' },
  { slug: 'porto-de-maceio', label: 'Maceió' },
  { slug: 'porto-de-santos', label: 'Santos' },
  { slug: 'guaruja', label: 'Guarujá' },
  { slug: 'praia-do-forte', label: 'Praia do Forte' },
  { slug: 'maracaipe', label: 'Maracaípe' },
  { slug: 'arquipelago-de-fernando-de-noronha', label: 'Fernando de Noronha' },
  { slug: 'ilha-do-mosqueiro', label: 'Mosqueiro' },
  { slug: 'terminal-de-barra-do-riacho', label: 'Barra do Riacho' },
  { slug: 'porto-de-florianopolis', label: 'Florianópolis' },
  { slug: 'porto-de-salvador', label: 'Salvador' },
  { slug: 'porto-de-tutoia', label: 'Tutóia' },
] as const;

export interface TopCity {
  slug: string;
  label: string;
  href: string;
}

/** Só devolve cidades que existem em PORTS, com a URL canônica /mare/<estado>/<slug>. */
export function getTopCities(): TopCity[] {
  return TOP_CITY_DEFS.flatMap(c => {
    const port = getPortBySlug(c.slug);
    if (!port) return [];
    return [{ slug: c.slug, label: c.label, href: `/mare/${getStateSlug(port.state)}/${port.slug}` }];
  });
}
