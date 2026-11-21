// Utilidades puras sobre el Markdown de las entradas (sin React),
// para que las use tanto la app como las pruebas.

export type Frontmatter = Record<string, string | number>

export interface Seccion {
  titulo: string
  cuerpo: string
}

export interface EntradaParseada {
  meta: Frontmatter
  intro: string
  secciones: Seccion[]
}

export const SECCIONES_CANONICAS = [
  'Definición formal',
  'Idea en palabras',
  'Método',
  'Ejemplo',
  'Trampas',
  'Practica',
] as const

/** Frontmatter YAML mínimo: solo pares `clave: valor` de una línea. */
export function separarFrontmatter(md: string): { meta: Frontmatter; cuerpo: string } {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { meta: {}, cuerpo: md }
  const meta: Frontmatter = {}
  for (const linea of m[1].split(/\r?\n/)) {
    const kv = linea.match(/^(\w+):\s*(.*?)\s*(#.*)?$/)
    if (!kv) continue
    let valor: string | number = kv[2]
    if (/^".*"$/.test(valor)) valor = valor.slice(1, -1)
    else if (/^-?\d+(\.\d+)?$/.test(valor)) valor = Number(valor)
    meta[kv[1]] = valor
  }
  return { meta, cuerpo: md.slice(m[0].length) }
}

/** Parte el cuerpo en intro + secciones `###`, respetando bloques de código. */
export function parsearEntrada(md: string): EntradaParseada {
  const { meta, cuerpo } = separarFrontmatter(md)
  const lineas = cuerpo.split(/\r?\n/)
  const secciones: Seccion[] = []
  const intro: string[] = []
  let actual: { titulo: string; lineas: string[] } | null = null
  let enCodigo = false
  for (const linea of lineas) {
    if (/^\s*(```|~~~)/.test(linea)) enCodigo = !enCodigo
    const h = !enCodigo && linea.match(/^###\s+(.+?)\s*$/)
    if (h) {
      if (actual) secciones.push({ titulo: actual.titulo, cuerpo: actual.lineas.join('\n').trim() })
      actual = { titulo: h[1], lineas: [] }
    } else if (actual) actual.lineas.push(linea)
    else intro.push(linea)
  }
  if (actual) secciones.push({ titulo: actual.titulo, cuerpo: actual.lineas.join('\n').trim() })
  return { meta, intro: intro.join('\n').trim(), secciones }
}

/**
 * Parte la sección Practica en el párrafo "Dilo con tus palabras: …" y el resto.
 * Si no encuentra ese párrafo, todo queda en `resto` (y el textarea va arriba).
 */
export function partirPractica(cuerpo: string): { pregunta: string; resto: string } {
  const parrafos = cuerpo.split(/\n\s*\n/)
  const i = parrafos.findIndex((p) => /^\s*Dilo con tus palabras/i.test(p))
  if (i < 0) return { pregunta: '', resto: cuerpo }
  return {
    pregunta: parrafos.slice(0, i + 1).join('\n\n').trim(),
    resto: parrafos.slice(i + 1).join('\n\n').trim(),
  }
}

/** Devuelve el JSON (texto) de cada bloque ```grafica. */
export function extraerGraficas(md: string): string[] {
  return [...md.matchAll(/^```grafica\s*\n([\s\S]*?)^```\s*$/gm)].map((m) => m[1])
}

/** Quita bloques de código cercados (```...```), que no son matemática. */
export function quitarCodigo(md: string): string {
  return md.replace(/^(```|~~~)[\s\S]*?^\1\s*$/gm, '')
}

/** Extrae las fórmulas `$$...$$` (bloque) y `$...$` (en línea). */
export function extraerFormulas(md: string): { tex: string; bloque: boolean }[] {
  const sinCodigo = quitarCodigo(separarFrontmatter(md).cuerpo)
  const formulas: { tex: string; bloque: boolean }[] = []
  const resto = sinCodigo.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex: string) => {
    formulas.push({ tex: tex.trim(), bloque: true })
    return ' '
  })
  for (const m of resto.matchAll(/(?<![\\$])\$([^$\n]+?)\$(?!\$)/g)) {
    formulas.push({ tex: m[1], bloque: false })
  }
  return formulas
}

/** Devuelve el texto sin fórmulas ni código: lo que se ve como prosa. */
export function textoSinFormulas(md: string): string {
  return quitarCodigo(separarFrontmatter(md).cuerpo)
    .replace(/\$\$[\s\S]+?\$\$/g, ' ')
    .replace(/(?<![\\$])\$[^$\n]+?\$(?!\$)/g, ' ')
}
