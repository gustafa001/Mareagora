import ConditionalSection from './ConditionalSection'

export interface PescaDetalhadaData {
  especies?: string[]
  tipoDePesca?: string[]
  melhorEpoca?: string
  iscas?: string[]
  lugaresProximos?: string[]
}

/**
 * Seção "preparada para integração futura" pedida no briefing: hoje `data`
 * nunca vem preenchido (nenhuma praia tem esses campos cadastrados ainda),
 * então a seção fica oculta. Quando uma fonte de dados de pesca for
 * integrada, basta popular `pescaDetalhada` na praia correspondente em
 * app/guia-praias/page.tsx - nenhuma outra mudança é necessária aqui.
 */
export default function PescaDetalhada({ data }: { data?: PescaDetalhadaData }) {
  return (
    <ConditionalSection data={data}>
      <section className="pp-section" aria-labelledby="pesca-detalhada-heading">
        <h2 className="pp-section-title" id="pesca-detalhada-heading">
          🎣 Pesca - detalhes
        </h2>
        <div className="pp-text-section">
          {data?.especies && data.especies.length > 0 && (
            <p>
              <strong>Espécies:</strong> {data.especies.join(', ')}
            </p>
          )}
          {data?.tipoDePesca && data.tipoDePesca.length > 0 && (
            <p>
              <strong>Tipo de pesca:</strong> {data.tipoDePesca.join(', ')}
            </p>
          )}
          {data?.melhorEpoca && (
            <p>
              <strong>Melhor época:</strong> {data.melhorEpoca}
            </p>
          )}
          {data?.iscas && data.iscas.length > 0 && (
            <p>
              <strong>Iscas recomendadas:</strong> {data.iscas.join(', ')}
            </p>
          )}
          {data?.lugaresProximos && data.lugaresProximos.length > 0 && (
            <p>
              <strong>Pontos próximos:</strong> {data.lugaresProximos.join(', ')}
            </p>
          )}
        </div>
      </section>
    </ConditionalSection>
  )
}
