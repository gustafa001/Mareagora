import Script from "next/script";

export default function TideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Adcash — carregado somente nas páginas internacionais (/tide/*) */}
      <Script
        id="aclib"
        src="//acscdn.com/script/aclib.js"
        strategy="afterInteractive"
        onReady={() => {
          (window as unknown as { aclib?: { runAutoTag?: (opts: { zoneId: string }) => void } }).aclib?.runAutoTag?.({ zoneId: 'zeprbiznxb' });
        }}
      />

      {children}
    </>
  );
}