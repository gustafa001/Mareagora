import React from 'react';

interface Props {
  locationName: string;
  countryOrStateName: string;
  lat: number;
  lon: number;
  nextHigh?: { hora: string; altura_m: number } | null;
  nextLow?: { hora: string; altura_m: number } | null;
  pageUrl: string;
  parentUrl: string;
  parentName: string;
  locale?: 'pt' | 'en';
}

export default function TideSchemaMarkup({
  locationName,
  countryOrStateName,
  lat,
  lon,
  nextHigh,
  nextLow,
  pageUrl,
  parentUrl,
  parentName,
  locale = 'pt',
}: Props) {
  const isEn = locale === 'en';

  const highTimeStr = nextHigh ? `${nextHigh.hora} (${nextHigh.altura_m.toFixed(2)}m)` : (isEn ? 'Available on table' : 'Disponível na tábua');
  const lowTimeStr = nextLow ? `${nextLow.hora} (${nextLow.altura_m.toFixed(2)}m)` : (isEn ? 'Available on table' : 'Disponível na tábua');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: isEn
      ? [
          {
            '@type': 'Question',
            name: `What time is high tide in ${locationName} today?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The next high tide in ${locationName} (${countryOrStateName}) is predicted at ${highTimeStr}.`,
            },
          },
          {
            '@type': 'Question',
            name: `What time is low tide in ${locationName} today?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The next low tide in ${locationName} (${countryOrStateName}) is predicted at ${lowTimeStr}.`,
            },
          },
          {
            '@type': 'Question',
            name: `Where to check the complete 2026 tide table for ${locationName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The complete and updated 2026 tide table for ${locationName}, including wave forecasts, wind speeds, and fishing/surfing conditions, is available for free on MaréAgora.`,
            },
          },
        ]
      : [
          {
            '@type': 'Question',
            name: `Qual o horário da maré alta em ${locationName} hoje?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `A próxima maré alta em ${locationName} (${countryOrStateName}) está prevista para as ${highTimeStr}.`,
            },
          },
          {
            '@type': 'Question',
            name: `Qual o horário da maré baixa em ${locationName} hoje?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `A próxima maré baixa em ${locationName} (${countryOrStateName}) está prevista para as ${lowTimeStr}.`,
            },
          },
          {
            '@type': 'Question',
            name: `Onde consultar a tábua de marés completa de 2026 para ${locationName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `A tábua de marés completa e atualizada de 2026 para ${locationName}, com horários oficiais, coeficientes, previsão de ondas e vento, está disponível gratuitamente no MaréAgora.`,
            },
          },
        ],
  };

  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: locationName,
    description: isEn
      ? `Tide forecasts, wave data, and sea conditions for ${locationName}, ${countryOrStateName}.`
      : `Tábua de marés, previsão de ondas, vento e condições do mar para ${locationName}, ${countryOrStateName}.`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lon,
    },
    url: pageUrl,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isEn ? 'Home' : 'Início',
        item: 'https://mareagora.com.br',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: parentName,
        item: parentUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: locationName,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
