export interface FaqItem {
  pergunta: string
  resposta: string
}

/**
 * Monta a FAQ a partir dos dados reais já disponíveis para a praia - nunca
 * de texto genérico solto. Cada pergunta só entra na lista se a informação
 * que ela responde realmente existir (ver comentários por item).
 */
export function buildFaq(params: {
  nome: string
  uf: string
  temPesca: boolean
  melhorEpoca?: string
  idealParaFamilia: boolean
  temEstacionamento?: boolean
  temQuiosques?: boolean
  temSalvaVidas?: boolean
  temAnimaisPermitidos?: boolean
  temCameras: boolean
  principaisAcessos?: string[]
}): FaqItem[] {
  const {
    nome,
    temPesca,
    melhorEpoca,
    idealParaFamilia,
    temEstacionamento,
    temQuiosques,
    temSalvaVidas,
    temAnimaisPermitidos,
    temCameras,
    principaisAcessos,
  } = params

  const faq: FaqItem[] = []

  // Sempre disponível: a maré é buscada em tempo real (TideCardLive) para toda praia.
  faq.push({
    pergunta: `Qual é a maré hoje em ${nome}?`,
    resposta: `A maré em tempo real de ${nome} é atualizada a cada hora com dados oficiais da Marinha do Brasil e pode ser vista no card "Condições atuais" desta página.`,
  })

  faq.push({
    pergunta: `As ondas estão boas em ${nome} hoje?`,
    resposta: `As condições de ondas, vento e temperatura da água em ${nome} são calculadas em tempo real via Open-Meteo Marine API e exibidas no card "Condições atuais" acima.`,
  })

  if (melhorEpoca) {
    faq.push({
      pergunta: `Qual a melhor época para visitar ${nome}?`,
      resposta: melhorEpoca,
    })
  }

  if (idealParaFamilia) {
    faq.push({
      pergunta: `${nome} é boa para crianças?`,
      resposta: `Sim, ${nome} está entre as praias recomendadas para famílias com crianças.`,
    })
  }

  if (typeof temEstacionamento === 'boolean') {
    faq.push({
      pergunta: `${nome} tem estacionamento?`,
      resposta: temEstacionamento
        ? `Sim, ${nome} conta com estacionamento.`
        : `Não há estacionamento estruturado confirmado em ${nome}.`,
    })
  }

  if (typeof temQuiosques === 'boolean') {
    faq.push({
      pergunta: `${nome} tem quiosques?`,
      resposta: temQuiosques
        ? `Sim, ${nome} conta com quiosques.`
        : `Não há quiosques confirmados em ${nome}.`,
    })
  }

  if (temPesca) {
    faq.push({
      pergunta: `${nome} é boa para pesca?`,
      resposta: `Sim - veja detalhes na seção "Pesca" desta página, incluindo horários e dicas específicas para ${nome}.`,
    })
    faq.push({
      pergunta: `Quando é o melhor horário para pescar em ${nome}?`,
      resposta: `Em geral, os melhores horários são 1 hora antes e depois da virada de maré (enchente ou vazante). Consulte o card de maré em tempo real acima para o horário exato de hoje.`,
    })
  }

  if (typeof temSalvaVidas === 'boolean') {
    faq.push({
      pergunta: `${nome} tem salva-vidas?`,
      resposta: temSalvaVidas
        ? `Sim, ${nome} conta com posto de salva-vidas.`
        : `Não há posto de salva-vidas confirmado em ${nome}.`,
    })
  }

  if (typeof temAnimaisPermitidos === 'boolean') {
    faq.push({
      pergunta: `Pode levar cachorro em ${nome}?`,
      resposta: temAnimaisPermitidos
        ? `Sim, animais são permitidos em ${nome}.`
        : `Não há confirmação de que animais sejam permitidos em ${nome}.`,
    })
  }

  if (principaisAcessos && principaisAcessos.length > 0) {
    faq.push({
      pergunta: `Como chegar em ${nome}?`,
      resposta: `Os principais acessos a ${nome} são: ${principaisAcessos.join(', ')}. Veja o mapa na seção "Como chegar" desta página.`,
    })
  }

  if (temCameras) {
    faq.push({
      pergunta: `Tem câmera ao vivo em ${nome}?`,
      resposta: `Sim, ${nome} tem transmissão ao vivo disponível na seção "Câmeras ao vivo" desta página.`,
    })
  }

  return faq
}

export default function Faq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null

  return (
    <section className="pp-section pp-faq" aria-labelledby="faq-heading">
      <h2 className="pp-section-title" id="faq-heading">
        Perguntas frequentes
      </h2>
      {items.map((item) => (
        <details key={item.pergunta} className="pp-faq-item">
          <summary>{item.pergunta}</summary>
          <p>{item.resposta}</p>
        </details>
      ))}
    </section>
  )
}
