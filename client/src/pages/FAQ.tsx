import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqItems = [
  {
    category: 'Sobre Marés',
    items: [
      {
        question: 'O que é maré alta (preamar)?',
        answer: 'A preamar, ou maré alta, é o momento em que o nível do mar atinge seu ponto máximo em um determinado ciclo. Após a preamar, a maré começa a baixar (vazar) até atingir a baixamar. Em média, a maré alta dura de 1 a 2 horas antes de começar a recuar.',
      },
      {
        question: 'O que é maré baixa (baixamar)?',
        answer: 'A baixamar é o ponto mínimo do nível do mar no ciclo das marés. É o momento em que as praias ficam mais largas, surgem piscinas naturais e recifes ficam expostos. Após a baixamar, a maré começa a encher (fluir) novamente.',
      },
      {
        question: 'Quantas marés acontecem por dia no Brasil?',
        answer: 'Na maior parte do litoral brasileiro, ocorrem duas marés altas e duas marés baixas por dia — totalizando quatro eventos de maré a cada 24 horas e 50 minutos. Isso acontece porque a Lua completa uma órbita ao redor da Terra em cerca de 24h50min. Esse regime é chamado de semidiurno.',
      },
      {
        question: 'Por que as marés mudam de horário todo dia?',
        answer: 'As marés "atrasam" cerca de 50 minutos por dia. Isso acontece porque a Lua orbita a Terra na mesma direção que a Terra gira, então demora um pouco mais do que 24 horas para a Terra "alcançar" a Lua novamente. Por isso, se hoje a maré alta é às 8h, amanhã será aproximadamente às 8h50.',
      },
      {
        question: 'O que é amplitude de maré?',
        answer: 'Amplitude é a diferença em metros entre a maré alta e a maré baixa consecutivas. Uma amplitude de 1,5 metros significa que o nível do mar sobe (ou desce) 1,5 metros entre a baixamar e a preamar. Quanto maior a amplitude, mais dramática é a diferença visual na praia.',
      },
      {
        question: 'O que são marés de sizígia?',
        answer: 'Marés de sizígia ocorrem nas fases de lua nova e lua cheia, quando o Sol, a Terra e a Lua estão alinhados. Nessas fases, a força gravitacional do Sol e da Lua se somam, resultando nas marés mais altas e mais baixas do mês — ou seja, maior amplitude.',
      },
      {
        question: 'O que são marés de quadratura?',
        answer: 'Marés de quadratura ocorrem nos quartos crescente e minguante da Lua, quando Sol e Lua estão em ângulo reto em relação à Terra. As forças se opõem parcialmente, resultando em marés com menor amplitude — marés altas menos altas e marés baixas menos baixas.',
      },
      {
        question: 'As previsões de maré são sempre precisas?',
        answer: 'As previsões astronômicas de maré — como as disponibilizadas no MaréAgora — são muito precisas em condições normais. No entanto, condições meteorológicas como vento forte, frentes frias e variações de pressão atmosférica podem alterar o nível do mar em até 30-50 cm além do previsto.',
      },
    ],
  },
  {
    category: 'Sobre a Tábua de Marés',
    items: [
      {
        question: 'Posso confiar nos dados do MaréAgora para navegação?',
        answer: 'O MaréAgora utiliza dados oficiais da Diretoria de Hidrografia e Navegação (DHN) da Marinha do Brasil. Para atividades de lazer (pesca, surf, banho de mar), os dados são plenamente confiáveis. Para navegação profissional, a Marinha recomenda manter a bordo a publicação oficial das Tábuas das Marés.',
      },
      {
        question: 'Com quantos dias de antecedência posso consultar a tábua?',
        answer: 'O MaréAgora disponibiliza previsões de marés para vários dias à frente. As previsões astronômicas de maré são confiáveis com muitas semanas de antecedência — a variabilidade está nas condições meteorológicas, não nas marés em si.',
      },
      {
        question: 'O horário das marés está no fuso de Brasília?',
        answer: 'Sim. Todos os horários no MaréAgora são apresentados no Horário de Brasília (UTC-3). Atenção: os dados não são automaticamente ajustados para o Horário de Verão quando ele vigorar.',
      },
      {
        question: 'Por que a maré alta de manhã é diferente da maré alta à tarde?',
        answer: 'No regime semidiurno, as duas marés altas do dia raramente têm a mesma altura. Isso ocorre por causa da inclinação da órbita lunar em relação ao Equador terrestre. O fenômeno é chamado de desigualdade diurna e é completamente normal.',
      },
    ],
  },
  {
    category: 'Sobre Atividades Práticas',
    items: [
      {
        question: 'Qual é a melhor maré para nadar na praia?',
        answer: 'Depende da praia. Em praias com fundo irregular ou pedras, a maré baixa pode ser mais perigosa. Em praias abertas e com fundo de areia, a maré média ou alta costuma ser mais segura para banho. Sempre observe o comportamento do mar por alguns minutos antes de entrar.',
      },
      {
        question: 'Qual é a melhor maré para pescar?',
        answer: 'Os momentos de transição — maré enchendo e maré vazando — são geralmente os melhores para pesca. Os peixes ficam mais ativos quando a corrente está em movimento, pois o alimento fica em suspensão na água.',
      },
      {
        question: 'Qual é a melhor maré para visitar piscinas naturais?',
        answer: 'A maré baixa, especialmente quando a altura fica abaixo de 0,5 metros. Nas marés de lua nova e lua cheia, a maré baixa costuma ficar ainda mais seca, revelando mais dos recifes.',
      },
      {
        question: 'A maré influencia as ondas de surf?',
        answer: 'Sim, bastante. A profundidade da água sobre o banco de areia ou recife onde a onda quebra muda com a maré, alterando a forma e a potência da onda. Cada praia tem uma "maré ideal" — aprenda qual é a da sua praia favorita.',
      },
    ],
  },
];

function FAQAccordion({ item }: { item: (typeof faqItems)[0]['items'][0] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
      >
        <h3 className="font-semibold text-maritime text-lg">{item.question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-maritime transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 text-gray-700 leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-r from-maritime to-blue-700 text-white py-12 md:py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Perguntas Frequentes</h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Respostas às dúvidas mais comuns sobre marés e o MaréAgora
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container max-w-3xl">
            {faqItems.map((category, idx) => (
              <div key={idx} className="mb-12">
                <h2 className="text-2xl font-bold text-maritime mb-6">{category.category}</h2>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {category.items.map((item, itemIdx) => (
                    <FAQAccordion key={itemIdx} item={item} />
                  ))}
                </div>
              </div>
            ))}

            {/* Contact CTA */}
            <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-maritime mb-2">Tem mais perguntas?</h3>
              <p className="text-gray-700 mb-4">
                Entre em contato conosco pelo e-mail{' '}
                <a href="mailto:contato@mareagora.com.br" className="text-maritime font-semibold hover:underline">
                  contato@mareagora.com.br
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Ad Space */}
        <section className="py-8 bg-gray-50 border-t border-gray-200">
          <div className="container text-center text-gray-500 text-sm">
            <p>Espaço para anúncios (AdSense)</p>
          </div>
        </section>
      </main>
    </div>
  );
}
