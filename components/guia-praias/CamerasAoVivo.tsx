import LiveCameraEmbed from '@/components/LiveCameraEmbed'
import ConditionalSection from './ConditionalSection'
import type { BeachCamera } from '@/lib/cameras-data'

export default function CamerasAoVivo({ cameras }: { cameras: BeachCamera[] }) {
  return (
    <ConditionalSection data={cameras}>
      <section className="pp-section" aria-labelledby="cameras-heading">
        <h2 className="pp-section-title" id="cameras-heading">
          <span className="pp-live-dot" /> Câmeras ao vivo
        </h2>
        <div className="pp-cameras-grid">
          {cameras.map((cam) => (
            <LiveCameraEmbed
              key={cam.id}
              title={cam.name}
              sourceName={cam.credit}
              sourceUrl={cam.creditUrl}
              videoId={cam.embedId}
            />
          ))}
        </div>
      </section>
    </ConditionalSection>
  )
}
