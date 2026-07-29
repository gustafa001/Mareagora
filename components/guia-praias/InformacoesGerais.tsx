import { getStateName } from '@/lib/states'

interface InformacoesGeraisProps {
  nome: string
  estado: string
  uf: string
  regiao: string
  tags: string[]
  melhorEpoca?: string
  // Campos opcionais - só aparecem quando a praia tiver esse dado cadastrado
  // (ver `informacoesGerais?` no tipo Praia em app/guia-praias/page.tsx).
  extra?: {
    tipoDePraia?: string
    aguaDoceOuSalgada?: 'doce' | 'salgada'
    extensaoKm?: number
    faixaDeAreia?: string
    marPredominante?: string
  }
}

function Item({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="pp-info-item">
      <span className="pp-info-label">{label}</span>
      <span className="pp-info-value">{value}</span>
    </div>
  )
}

export default function InformacoesGerais({
  nome,
  estado,
  uf,
  regiao,
  tags,
  melhorEpoca,
  extra,
}: InformacoesGeraisProps) {
  const regiaoLabel = regiao.charAt(0).toUpperCase() + regiao.slice(1)

  return (
    <section className="pp-section" aria-labelledby="info-gerais-heading">
      <h2 className="pp-section-title" id="info-gerais-heading">
        Informações gerais
      </h2>
      <div className="pp-info-card">
        <Item label="Nome" value={nome} />
        <Item label="Estado" value={`${getStateName(uf) || estado} (${uf})`} />
        <Item label="Região" value={regiaoLabel} />
        <Item label="Tipo de praia" value={extra?.tipoDePraia} />
        <Item
          label="Água"
          value={
            extra?.aguaDoceOuSalgada
              ? extra.aguaDoceOuSalgada === 'doce'
                ? 'Doce'
                : 'Salgada'
              : undefined
          }
        />
        <Item
          label="Extensão"
          value={extra?.extensaoKm ? `${extra.extensaoKm} km` : undefined}
        />
        <Item label="Faixa de areia" value={extra?.faixaDeAreia} />
        <Item label="Mar predominante" value={extra?.marPredominante} />
        <Item label="Melhor época" value={melhorEpoca} />
        {tags.length > 0 && (
          <div className="pp-info-item">
            <span className="pp-info-label">Ideal para</span>
            <span className="pp-info-value pp-info-tags">
              {tags.map((tag) => (
                <span key={tag} className="pp-tag">
                  {tag}
                </span>
              ))}
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
