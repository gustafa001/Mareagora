import { getLiveCameras, type LiveCamera } from '@/lib/cameras-data'

/**
 * Retorna apenas câmeras REAIS (já confirmadas em PORTS via lib/cameras-data.ts)
 * cuja cidade ou nome bate com a praia atual.
 * Nunca inventa câmera: se não houver correspondência, retorna array vazio e a
 * seção some da página (ver <CamerasAoVivo />).
 */
export function getCamerasForPraia(nomePraia: string, uf: string): LiveCamera[] {
  const nomeLower = nomePraia.toLowerCase()

  return getLiveCameras().filter((cam) => {
    if (cam.state.toUpperCase() !== uf.toUpperCase()) return false

    const cidadeLower = cam.cityName.toLowerCase()
    const camNomeLower = cam.title.toLowerCase()

    return (
      nomeLower.includes(cidadeLower) ||
      cidadeLower.includes(nomeLower) ||
      nomeLower.includes(camNomeLower) ||
      camNomeLower.includes(nomeLower)
    )
  })
}
