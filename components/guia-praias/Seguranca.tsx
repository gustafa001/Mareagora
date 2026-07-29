import ConditionalSection from './ConditionalSection'

export interface SegurancaData {
  bandeira?: 'verde' | 'amarela' | 'vermelha'
  correnteDeRetorno?: boolean
  pedras?: boolean
  ondasFortes?: boolean
  areasPerigosas?: string[]
  cuidadosImportantes?: string[]
}

const BANDEIRA_LABEL: Record<NonNullable<SegurancaData['bandeira']>, string> = {
  verde: '🟢 Bandeira verde - mar seguro para banho',
  amarela: '🟡 Bandeira amarela - atenção redobrada',
  vermelha: '🔴 Bandeira vermelha - banho não recomendado',
}

export default function Seguranca({ data }: { data?: SegurancaData }) {
  return (
    <ConditionalSection data={data}>
      <section className="pp-section" aria-labelledby="seguranca-heading">
        <h2 className="pp-section-title" id="seguranca-heading">
          Segurança
        </h2>
        <div className="pp-text-section">
          {data?.bandeira && <p>{BANDEIRA_LABEL[data.bandeira]}</p>}
          {data?.correnteDeRetorno && <p>⚠️ Correnteza de retorno registrada nesta praia.</p>}
          {data?.pedras && <p>⚠️ Presença de pedras em parte da faixa de areia ou no mar.</p>}
          {data?.ondasFortes && <p>⚠️ Ondas fortes - atenção redobrada para banho.</p>}

          {data?.areasPerigosas && data.areasPerigosas.length > 0 && (
            <>
              <p>
                <strong>Áreas de atenção:</strong>
              </p>
              <ul>
                {data.areasPerigosas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </>
          )}

          {data?.cuidadosImportantes && data.cuidadosImportantes.length > 0 && (
            <>
              <p>
                <strong>Cuidados importantes:</strong>
              </p>
              <ul>
                {data.cuidadosImportantes.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </ConditionalSection>
  )
}
