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
}: SchemaProps) {
  const schemas: any[] = [];
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
    description: 'A tábua de marés mais completa do Brasil',
    publisher: { '@id': `${base}/#organization` },
  });

  // 2. WebPage
  schemas.push({
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': `${base}/#website` },
    about: { '@id': `${base}/#organization` },
    datePublished: datePublished || '2026-01-01T00:00:00.000Z',
    dateModified: dateModified || '2026-01-01T00:00:00.000Z',
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: defaultImage,
    },
  });

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
    schemas.push({
      '@type': 'Dataset',
      '@id': `${url}#dataset`,
      name: `Tábua de Marés ${port.cityName} ${new Date().getFullYear()}`,
      description: `Horários e alturas de marés oficiais em ${port.cityName}, ${port.state}. Dados da Marinha do Brasil.`,
      url,
      creator: { '@id': `${base}/#organization` },
      license: 'https://www.gov.br/marinha/pt-br',
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
