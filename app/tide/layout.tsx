import AdcashLoader from "@/components/ads/AdcashLoader";

export default function TideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Adcash — carregado somente nas páginas internacionais (/tide/*) */}
      <AdcashLoader />

      {children}
    </>
  );
}