import LiveCameraEmbed from '@/components/LiveCameraEmbed'
import ConditionalSection from './ConditionalSection'
import type { LiveCamera } from '@/lib/cameras-data'

export default function CamerasAoVivo({ cameras }: { cameras: LiveCamera[] }) {
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
              title={cam.title}
              sourceName={cam.sourceName}
              sourceUrl={cam.sourceUrl}
              videoId={cam.videoId}
            />
          ))}
        </div>
      </section>
    </ConditionalSection>
  )
}
