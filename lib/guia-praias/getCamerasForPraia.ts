import { beachCameras, type BeachCamera } from '@/lib/cameras-data'

/**
 * Retorna apenas câmeras REAIS e ativas (status 'active', com videoId/channelId
 * já confirmados em lib/cameras-data.ts) cuja cidade ou nome bate com a praia atual.
 * Nunca inventa câmera: se não houver correspondência, retorna array vazio e a
 * seção some da página (ver <CamerasAoVivo />).
 */
export function getCamerasForPraia(nomePraia: string, uf: string): BeachCamera[] {
  const nomeLower = nomePraia.toLowerCase()

  return beachCameras.filter((cam) => {
    if (cam.status !== 'active') return false
    if (cam.source !== 'youtube') return false // LiveCameraEmbed hoje só suporta YouTube
    if (!cam.embedId) return false
    if (cam.state.toUpperCase() !== uf.toUpperCase()) return false

    const cidadeLower = cam.city.toLowerCase()
    const camNomeLower = cam.name.toLowerCase()

    return (
      nomeLower.includes(cidadeLower) ||
      cidadeLower.includes(nomeLower) ||
      nomeLower.includes(camNomeLower) ||
      camNomeLower.includes(nomeLower)
    )
  })
}
