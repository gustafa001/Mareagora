import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SchemaGenerator from '@/components/seo/SchemaGenerator';

export const metadata: Metadata = {
  title: 'Best Tide Times for Fishing: How to Read Tide Charts | MaréAgora',
  description:
    'Learn how to read tide charts and pick the best times to fish. Simple guide to tides, high/low water, and practical tips for a productive day on the water.',
  alternates: {
    canonical: 'https://mareagora.com.br/tide/fishing-guide',
    languages: {
      pt: 'https://mareagora.com.br/pesca',
      en: 'https://mareagora.com.br/tide/fishing-guide',
      'x-default': 'https://mareagora.com.br/pesca',
    },
  },
};

const STEPS = [
  {
    number: '1',
    title: 'Find your local tide table',
    text: 'Start by looking up your fishing spot on a tide chart. MaréAgora provides harmonic tide predictions for over 150 beaches worldwide — just search by name or country to see the forecast for the next seven days.',
  },
  {
    number: '2',
    title: 'Identify high tide and low tide times',
    text: 'The chart shows a continuous line that rises and falls. The peaks are high tides (preamar) and the troughs are low tides (baixamar). Note the exact times and heights for each event during your planned fishing window.',
  },
  {
    number: '3',
    title: 'Check the tide direction and range',
    text: 'Look at whether the tide is flooding (coming in) or ebbing (going out). A larger tidal range means stronger currents, which often stir up baitfish and trigger feeding activity near structure and along drop-offs.',
  },
];

const RULES = [
  {
    title: 'The 1-2 Hour Rule',
    text: 'Fish are most active in the 1–2 hours before and after a high tide or low tide. During these transitional periods the moving water dislodges food and concentrates prey along edges, channels, and rocky shorelines.',
  },
  {
    title: 'Incoming Tide Beats Outgoing',
    text: 'An incoming (flood) tide generally outperforms an outgoing tide. As the water rises it pushes baitfish and crustaceans toward shallower feeding grounds, drawing larger predatory fish with them.',
  },
  {
    title: 'Spring Tides for Bigger Action',
    text: 'Spring tides occur during full and new moons and produce the strongest tidal movements. Many experienced anglers plan their most important trips around these windows because the extra current often triggers aggressive feeding.',
  },
];

const EXAMPLE = {
  portName: 'Copacabana, Rio de Janeiro',
  portLink: '/mare/rio-de-janeiro/copacabana',
  items: [
    { time: '05:48', event: 'Low tide', height: '0.6 m', note: 'Prime window — fish are actively feeding along the reef.' },
    { time: '11:52', event: 'High tide', height: '1.1 m', note: 'Excellent bite — baitfish pushed toward shore.' },
    { time: '17:55', event: 'Low tide', height: '0.5 m', note: 'Another good window before sunset.' },
  ],
};

export default function FishingGuidePage() {
  const schemas = [
    {
      '@type': 'Article',
      headline: 'Best Tide Times for Fishing: How to Read Tide Charts',
      description: metadata.description,
      author: { '@type': 'Organization', name: 'MaréAgora' },
      publisher: { '@type': 'Organization', name: 'MaréAgora' },
      datePublished: '2026-08-26',
      dateModified: '2026-08-26',
      mainEntityOfPage: 'https://mareagora.com.br/tide/fishing-guide',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mareagora.com.br' },
        { '@type': 'ListItem', position: 2, name: 'Tide Charts', item: 'https://mareagora.com.br/tide' },
        { '@type': 'ListItem', position: 3, name: 'Fishing Guide', item: 'https://mareagora.com.br/tide/fishing-guide' },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <NavBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <article className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Fishing Guide</p>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 font-syne mb-6">
            Best Tide Times for Fishing: How to Read Tide Charts
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl">
            Understanding tides is the single most impactful skill you can develop as a saltwater angler. This guide
            explains tides in plain language and gives you a simple, repeatable method for choosing when to fish.
          </p>

          <section className="mb-14">
            <h2 className="text-2xl font-bold text-slate-900 font-syne mb-4">Why Tides Matter</h2>
            <div className="text-base text-slate-700 leading-relaxed space-y-3">
              <p>
                Ocean tides are the daily rise and fall of sea level caused by the gravitational pull of the Moon and
                Sun. As the water moves in and out, it creates currents that stir up sediment, dislodge crustaceans,
                and concentrate baitfish along edges, channels, and rocky structure.
              </p>
              <p>
                Predatory fish follow these food sources. When you learn to predict where the current will be strongest
                and where prey will gather, you can position yourself in the right spot at the right time — and that is
                the difference between a slow day and a great one.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl font-bold text-slate-900 font-syne mb-6">Step-by-Step: Reading a Tide Chart</h2>
            <ol className="space-y-8">
              {STEPS.map((s) => (
                <li key={s.number} className="flex gap-5">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
                    {s.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{s.title}</h3>
                    <p className="text-base text-slate-700 leading-relaxed">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl font-bold text-slate-900 font-syne mb-6">Practical Rules for Picking Tide Times</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {RULES.map((r) => (
                <div key={r.title} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-base font-bold text-slate-900 mb-2">{r.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl font-bold text-slate-900 font-syne mb-6">Real Example — {EXAMPLE.portName}</h2>
            <p className="text-base text-slate-700 mb-6 leading-relaxed">
              Here is what a fishing-optimised reading of a typical tide chart looks like. Pick the windows around the
              transitions and plan to be on the water during those periods.
            </p>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-3 text-sm font-semibold text-slate-500">Time</th>
                      <th className="px-6 py-3 text-sm font-semibold text-slate-500">Event</th>
                      <th className="px-6 py-3 text-sm font-semibold text-slate-500">Height</th>
                      <th className="px-6 py-3 text-sm font-semibold text-slate-500">Fishing Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EXAMPLE.items.map((item) => (
                      <tr key={item.time} className="border-b border-slate-50 last:border-0">
                        <td className="px-6 py-4 text-sm font-mono text-slate-900">{item.time}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{item.event}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{item.height}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 italic">{item.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Link
              href={EXAMPLE.portLink}
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              🌊 View full tide table for {EXAMPLE.portName} →
            </Link>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl font-bold text-slate-900 font-syne mb-4">Other Factors to Watch</h2>
            <div className="text-base text-slate-700 leading-relaxed space-y-3">
              <p>
                <strong>Barometric pressure:</strong> Stable or falling pressure generally improves fishing. A rapid rise
                often signals tough conditions.
              </p>
              <p>
                <strong>Wind direction:</strong> An onshore wind can push baitfish toward the coast and create a feeding
                opportunity. A strong offshore wind can flatten the water and make fish more cautious.
              </p>
              <p>
                <strong>Water temperature:</strong> Species like snook and tarpon follow warm-water edges. Check local
                sea-surface temperature data when available.
              </p>
              <p>
                <strong>Moon phase:</strong> Full and new moons produce spring tides with stronger currents. Many anglers
                report better catches a few days before and after these phases.
              </p>
            </div>
          </section>

          <section className="bg-slate-900 rounded-2xl p-8 text-center mb-14">
            <h2 className="text-xl font-bold text-white font-syne mb-4">Ready to find your spot?</h2>
            <p className="text-sm text-slate-300 mb-6">
              Search for your local beach or port on MaréAgora and see the next seven days of tide predictions with
              exact times, heights, and fishing-relevant details.
            </p>
            <Link
              href="/tide"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Browse tide charts worldwide →
            </Link>
          </section>
        </div>
      </article>
    </main>
  );
}
