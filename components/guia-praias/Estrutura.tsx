import ConditionalSection from './ConditionalSection'

export interface EstruturaData {
  banheiros?: boolean
  quiosques?: boolean
  restaurantes?: boolean
  hoteis?: boolean
  estacionamento?: boolean
  camping?: boolean
  salvaVidas?: boolean
  chuveiros?: boolean
  acessibilidade?: boolean
  wifi?: boolean
  animaisPermitidos?: boolean
}

const LABELS: Record<keyof EstruturaData, { label: string; icon: string }> = {
  banheiros: { label: 'Banheiros', icon: '🚻' },
  quiosques: { label: 'Quiosques', icon: '🏝️' },
  restaurantes: { label: 'Restaurantes', icon: '🍽️' },
  hoteis: { label: 'Hotéis', icon: '🏨' },
  estacionamento: { label: 'Estacionamento', icon: '🅿️' },
  camping: { label: 'Camping', icon: '⛺' },
  salvaVidas: { label: 'Salva-vidas', icon: '🛟' },
  chuveiros: { label: 'Chuveiros', icon: '🚿' },
  acessibilidade: { label: 'Acessibilidade', icon: '♿' },
  wifi: { label: 'Wi-Fi', icon: '📶' },
  animaisPermitidos: { label: 'Animais permitidos', icon: '🐾' },
}

export default function Estrutura({ data }: { data?: EstruturaData }) {
  const disponiveis = data
    ? (Object.keys(data) as (keyof EstruturaData)[]).filter((k) => data[k] === true)
    : []

  return (
    <ConditionalSection data={disponiveis}>
      <section className="pp-section" aria-labelledby="estrutura-heading">
        <h2 className="pp-section-title" id="estrutura-heading">
          Estrutura
        </h2>
        <ul className="pp-icon-grid">
          {disponiveis.map((key) => (
            <li key={key} className="pp-icon-item">
              <span aria-hidden="true">{LABELS[key].icon}</span>
              <span>{LABELS[key].label}</span>
            </li>
          ))}
        </ul>
      </section>
    </ConditionalSection>
  )
}
