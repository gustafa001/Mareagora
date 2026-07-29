interface ComoChegarProps {
  nome: string
  cidade: string
  uf: string
  lat: number
  lon: number
  // Opcionais - só existem quando cadastrados manualmente para a praia
  principaisAcessos?: string[]
  transportePublico?: string
}

export default function ComoChegar({
  nome,
  cidade,
  uf,
  lat,
  lon,
  principaisAcessos,
  transportePublico,
}: ComoChegarProps) {
  // Coordenadas reais (mesmas usadas pela maré/ondas) - sem geocoding inventado.
  const mapsEmbedUrl = `https://www.google.com/maps?q=${lat},${lon}&z=13&output=embed`
  const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`

  return (
    <section className="pp-section" aria-labelledby="como-chegar-heading">
      <h2 className="pp-section-title" id="como-chegar-heading">
        Como chegar
      </h2>

      <div className="pp-map-wrapper">
        <iframe
          src={mapsEmbedUrl}
          title={`Mapa de ${nome}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="pp-map-iframe"
        />
      </div>

      <div className="pp-como-chegar-info">
        <p>
          <strong>Localização:</strong> {cidade}, {uf}
        </p>

        {principaisAcessos && principaisAcessos.length > 0 && (
          <div>
            <strong>Principais acessos</strong>
            <ul>
              {principaisAcessos.map((acesso) => (
                <li key={acesso}>{acesso}</li>
              ))}
            </ul>
          </div>
        )}

        {transportePublico && (
          <p>
            <strong>Transporte público:</strong> {transportePublico}
          </p>
        )}

        <a
          href={mapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pp-affiliate-link"
        >
          🧭 Traçar rota até {nome}
        </a>
      </div>
    </section>
  )
}
