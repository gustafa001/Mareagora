import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans, Fira_Code, Fira_Sans } from "next/font/google";
import "./globals.css";
import "./blog.css";
import Script from "next/script";
import MobileStickyAd from "@/components/ads/MobileStickyAd";
import Footer from "@/components/Footer";
import InstallPWA from "@/components/InstallPWA";
import { SpeedInsights } from "@vercel/speed-insights/next";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

const firaSans = Fira_Sans({
  subsets: ["latin"],
  variable: "--font-fira-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mareagora.com.br'),
  title: `MaréAgora — Tábua de Marés ${new Date().getFullYear()}`,
  description: "Horários e alturas das marés com dados oficiais da Marinha do Brasil. Previsão de ondas e vento em tempo real.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MaréAgora",
  },
  alternates: {
    languages: {
      'pt-BR': 'https://mareagora.com.br',
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${dmSans.variable} ${firaCode.variable} ${firaSans.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

        {/* Performance Preconnects */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-2920008879492175" />
        <meta name="google-site-verification" content="sHCQQ9fcGrzTM7k2FVoiEiBczB8Z4peDcz1k3Pnx6G8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-title" content="MareAgora" />
        {/* Script AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2920008879492175"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        {/* Google Analytics GA4 — G-LP14YCN9MZ */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LP14YCN9MZ"
          strategy="lazyOnload"
        />
        <Script id="ga4-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LP14YCN9MZ');
          `}
        </Script>
        {/* Microsoft Clarity — y3fk5z3a1t */}
        <Script id="ms-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "y3fk5z3a1t");
          `}
        </Script>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'MaréAgora',
              url: 'https://mareagora.com.br',
            })
          }}
        />
      </head>
      <body className="font-dm-sans">
        <div className="bg-waves">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="rgba(56,201,240,.6)">
            <path className="wave-path-1" d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1350,40 1440,60 L1440,120 L0,120Z"/>
          </svg>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="rgba(14,127,190,.5)">
            <path className="wave-path-2" d="M0,80 C200,40 400,100 600,80 C800,60 1000,110 1200,80 C1320,65 1380,85 1440,80 L1440,120 L0,120Z"/>
          </svg>
        </div>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </div>

        <InstallPWA />
        <MobileStickyAd />
        <SpeedInsights />
      </body>
    </html>
  );
}
