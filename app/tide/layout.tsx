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
      />
      <Script id="adcash-autotag" strategy="afterInteractive">
        {`
          if (window.aclib) {
            aclib.runAutoTag({ zoneId: 'zeprbiznxb' });
          } else {
            document.getElementById('aclib').addEventListener('load', function () {
              aclib.runAutoTag({ zoneId: 'zeprbiznxb' });
            });
          }
        `}
      </Script>

      {children}
    </>
  );
}