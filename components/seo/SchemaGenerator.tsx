import React from 'react';
import { Port } from '@/lib/ports';
import { getStateName, getStateSlug } from '@/lib/states';

interface SchemaProps {
  port?: Port;
  type: 'Beach' | 'Port' | 'State' | 'Home' | 'Blog' | 'WebPage';
  url: string;
  title: string;
  description: string;
  image?: string;
  faq?: { question: string; answer: string }[];
  datePublished?: string;
  dateModified?: string;
  referencePortName?: string;
}

export default function SchemaGenerator({
  port,
  type,
  url,
  title,
  description,
  image,
  faq,
  datePublished,
  dateModified,
  referencePortName,
}: SchemaProps) {
  const schemas: Record<string, unknown>[] = [];
  const base = 'https://mareagora.com.br';
  const logo = `${base}/icons/icon-512x512.png`;
  const defaultImage = image || `${base}/opengraph-image.png`;

  // 1. Organization & WebSite (sempre incluídos)
  schemas.push({
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: 'MaréAgora',
    url: base,
    logo: {
      '@type': 'ImageObject',
      url: logo,
    },
  });

  schemas.push({
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    url: base,
    name: 'MaréAgora',
    alternateName: ['Maré Agora', 'Mare Agora', 'MareAgora'],
    description: 'A tábua de marés mais completa do Brasil',
    publisher: { '@id': `${base}/#organization` },
  });

  // 2. WebPage
  // datePublished e dateModified só são incluídos quando há uma data real vinda
  // de fonte confiável (ex.: post de blog). Em páginas de tábua de maré (SSG/ISR)
  // não existe "data de modificação" significativa — omitir é mais honesto para o
  // Google do que usar a data do build/render.
  const webPageEntry: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': `${base}/#website` },
    about: { '@id': `${base}/#organization` },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: defaultImage,
    },
  };
  if (datePublished) webPageEntry.datePublished = datePublished;
  if (dateModified) webPageEntry.dateModified = dateModified;
  schemas.push(webPageEntry);

  // 3. SoftwareApplication (PWA)
  if (type === 'Home') {
    schemas.push({
      '@type': 'SoftwareApplication',
      name: 'MaréAgora App',
      operatingSystem: 'Any',
      applicationCategory: 'WeatherApplication',
      url: base,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'BRL',
      },
    });
  }

  // 4. Place / Beach / Port / TouristAttraction
  if (port) {
    const isCommercial =
      port.name.toLowerCase().includes('porto') ||
      port.name.toLowerCase().includes('terminal');

    const placeType = type === 'Beach' ? 'Beach' : isCommercial ? 'CivicStructure' : 'TouristAttraction';

    schemas.push({
      '@type': placeType,
      '@id': `${url}#place`,
      name: port.name,
      description: `Informações de maré e clima para ${port.name}, ${port.state}.`,
      url,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: port.lat,
        longitude: port.lon,
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: port.cityName,
        addressRegion: port.state,
        addressCountry: 'BR',
      },
      image: defaultImage,
    });

    // 5. Dataset (Official Tide Data)
    const datasetDescription = referencePortName
      ? `Horários e alturas de marés oficiais em ${port.cityName}, ${port.state}. Dados oficiais da Marinha do Brasil (DHN) referenciados na estação de ${referencePortName}.`
      : `Horários e alturas de marés oficiais em ${port.cityName}, ${port.state}. Dados oficiais da Marinha do Brasil (DHN).`;

    schemas.push({
      '@type': 'Dataset',
      '@id': `${url}#dataset`,
      name: `Tábua de Marés ${port.cityName} ${new Date().getFullYear()}`,
      description: datasetDescription,
      url,
      creator: { '@id': `${base}/#organization` },
      // Google exige Organization ou Person em provider/creator/publisher de Dataset;
      // subtipos como GovernmentOrganization são rejeitados pelo validador.
      provider: {
        '@type': 'Organization',
        name: 'Marinha do Brasil - Centro de Hidrografia da Marinha (CHM/DHN)',
        url: 'https://www.marinha.mil.br/chm/',
      },
      license: 'https://www.gov.br/marinha/pt-br',
      temporalCoverage: `${new Date().getFullYear()}`,
      ...(referencePortName ? { isBasedOn: `Estação de referência: ${referencePortName}` } : {}),
    });

    // 6. BreadcrumbList
    schemas.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: base },
        { '@type': 'ListItem', position: 2, name: 'Tábua de Marés', item: `${base}/portos` },
        {
          '@type': 'ListItem',
          position: 3,
          name: getStateName(port.state),
          item: `${base}/estados/${getStateSlug(port.state)}`,
        },
        { '@type': 'ListItem', position: 4, name: port.name, item: url },
      ],
    });
  }

  // 7. FAQPage
  if (faq && faq.length > 0) {
    schemas.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': schemas,
        }),
      }}
      suppressHydrationWarning
    />
  );
}
