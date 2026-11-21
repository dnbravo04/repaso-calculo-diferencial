import { INDICE, type EntradaIndice } from './indice'
import { parsearEntrada, type EntradaParseada } from './markdown'

// Vite empaqueta todos los .md como texto en el build.
const archivos = import.meta.glob('../content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const porArchivo = new Map<string, string>()
for (const [ruta, md] of Object.entries(archivos)) {
  const nombre = ruta.split('/').pop()!.replace(/\.md$/, '')
  porArchivo.set(nombre, md)
}

export interface Entrada extends EntradaIndice, EntradaParseada {
  markdown: string
}

const cache = new Map<string, Entrada>()

export function disponible(id: string): boolean {
  const item = INDICE.find((e) => e.id === id)
  return !!item && porArchivo.has(item.archivo)
}

export function obtenerEntrada(id: string): Entrada | undefined {
  if (cache.has(id)) return cache.get(id)
  const item = INDICE.find((e) => e.id === id)
  if (!item) return undefined
  const md = porArchivo.get(item.archivo)
  if (!md) return undefined
  const entrada: Entrada = { ...item, ...parsearEntrada(md), markdown: md }
  cache.set(id, entrada)
  return entrada
}
