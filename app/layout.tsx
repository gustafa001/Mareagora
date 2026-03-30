import type { Metadata } from "next";
import { Syne, DM_Sans, Fira_Code, Fira_Sans } from "next/font/google";
import "./globals.css";


const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

const firaSans = Fira_Sans({
  subsets: ["latin"],
  variable: "--font-fira-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MaréAgora — Tábua de Marés 2026",
  description: "Horários e alturas das marés com dados oficiais da Marinha do Brasil. Previsão de ondas e vento em tempo real.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${dmSans.variable} ${firaCode.variable} ${firaSans.variable}`}>
      <head>
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-2920008879492175" />
      </head>
      <body className="font-dm-sans">
        <div className="bg-waves">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="rgba(56,201,240,.6)">
            <path d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1350,40 1440,60 L1440,120 L0,120Z"/>
          </svg>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="rgba(14,127,190,.5)">
            <path d="M0,80 C200,40 400,100 600,80 C800,60 1000,110 1200,80 C1320,65 1380,85 1440,80 L1440,120 L0,120Z"/>
          </svg>
        </div>
        {children}
      </body>
    </html>
  );
}
