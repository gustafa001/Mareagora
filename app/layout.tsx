import type { Metadata } from "next";
import { Syne, DM_Sans, Fira_Code, Fira_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["400","600","700","800"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", weight: ["300","400","500"] });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });
const firaSans = Fira_Sans({ subsets: ["latin"], variable: "--font-fira-sans", weight: ["300","400","500","600","700"] });

export const metadata: Metadata = {
  title: "MaréAgora — Tábua de Marés 2026",
  description: "Horários e alturas das marés com dados oficiais da Marinha do Brasil. Previsão de ondas e vento em tempo real.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${dmSans.variable} ${firaCode.variable} ${firaSans.variable}`}>
      <head>
        {/* ✅ Meta tag do AdSense fica no head normalmente */}
        <meta name="google-adsense-account" content="ca-pub-2920008879492175" />
        <style>{`
          @keyframes wave1 { ... }
          @keyframes wave2 { ... }
          .wave-path-1 { animation: wave1 8s ease-in-out infinite; }
          .wave-path-2 { animation: wave2 6s ease-in-out infinite; }
          .mobile-ad-container {
            position: fixed;
            bottom: 0; left: 0; right: 0;
            background: white;
            border-top: 1px solid #e5e7eb;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            z-index: 40;
            height: 90px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-bottom: env(safe-area-inset-bottom);
          }
          @media (min-width: 768px) {
            .mobile-ad-container { display: none; }
          }
        `}</style>
      </head>
      <body className="font-dm-sans">

        {/* ✅ Scripts FORA do <head>, direto no body */}
        
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2920008879492175"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Analytics GA4 */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LP14YCN9MZ"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LP14YCN9MZ');
          `}
        </Script>

        <div className="bg-waves">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="rgba(56,201,240,.6)">
            <path className="wave-path-1" d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1350,40 1440,60 L1440,120 L0,120Z"/>
          </svg>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="rgba(14,127,190,.5)">
            <path className="wave-path-2" d="M0,80 C200,40 400,100 600,80 C800,60 1000,110 1200,80 C1320,65 1380,85 1440,80 L1440,120 L0,120Z"/>
          </svg>
        </div>

        {children}

        {/* ✅ Banner mobile com width explícito no ins */}
        <div className="mobile-ad-container">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '90px' }}
            data-ad-client="ca-pub-2920008879492175"
            data-ad-slot="7494638408"
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        </div>

        {/* ✅ Init do AdSense DEPOIS do ins existir no DOM */}
        <Script id="adsense-init" strategy="afterInteractive">
          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </Script>

      </body>
    </html>
  );
}
