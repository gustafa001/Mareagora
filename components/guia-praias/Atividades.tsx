import ConditionalSection from './ConditionalSection'

export type Atividade =
  | 'surf'
  | 'pesca'
  | 'caiaque'
  | 'sup'
  | 'banho'
  | 'mergulho'
  | 'passeio-de-barco'
  | 'caminhada'
  | 'fotografia'

const LABELS: Record<Atividade, { label: string; icon: string }> = {
  surf: { label: 'Surf', icon: '🏄' },
  pesca: { label: 'Pesca', icon: '🎣' },
  caiaque: { label: 'Caiaque', icon: '🛶' },
  sup: { label: 'Stand Up Paddle', icon: '🏄‍♂️' },
  banho: { label: 'Banho', icon: '🏊' },
  mergulho: { label: 'Mergulho', icon: '🤿' },
  'passeio-de-barco': { label: 'Passeio de barco', icon: '⛵' },
  caminhada: { label: 'Caminhada', icon: '🥾' },
  fotografia: { label: 'Fotografia', icon: '📷' },
}

export default function Atividades({ data }: { data?: Atividade[] }) {
  return (
    <ConditionalSection data={data}>
      <section className="pp-section" aria-labelledby="atividades-heading">
        <h2 className="pp-section-title" id="atividades-heading">
          Atividades
        </h2>
        <ul className="pp-badge-list">
          {data?.map((atividade) => (
            <li key={atividade} className="pp-badge">
              <span aria-hidden="true">{LABELS[atividade].icon}</span>
              {LABELS[atividade].label}
            </li>
          ))}
        </ul>
      </section>
    </ConditionalSection>
  )
}
