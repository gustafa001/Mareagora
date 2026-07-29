import type { ReactNode } from 'react'

function isEmptyValue(data: unknown): boolean {
  if (data === null || data === undefined) return true
  if (Array.isArray(data)) return data.length === 0
  if (typeof data === 'object') return Object.keys(data as object).length === 0
  if (typeof data === 'string') return data.trim().length === 0
  return false
}

/**
 * Regra central do Guia de Praias: nunca renderizar um bloco vazio.
 * Se `data` não existir (ou for array/objeto vazio), a seção inteira
 * não é montada - em vez de mostrar um card em branco ou texto genérico.
 */
export default function ConditionalSection({
  data,
  children,
}: {
  data: unknown
  children: ReactNode
}) {
  if (isEmptyValue(data)) return null
  return <>{children}</>
}
