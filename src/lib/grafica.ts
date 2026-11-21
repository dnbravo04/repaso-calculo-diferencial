// Bloques ```grafica: tipos, validación y cálculo de tramos (sin React, para las pruebas).
import { compile, evaluate } from 'mathjs'

export const COLORES = ['gris', 'azul', 'naranja', 'verde'] as const
export type ColorNombre = (typeof COLORES)[number]

/** Variables CSS definidas en index.css (claro y oscuro). Paleta validada para daltonismo. */
export const colorCss = (c: ColorNombre) => `var(--g-${c})`

type Num = number | string // número o expresión de mathjs ("pi/3")

export interface TramoSpec {
  expr: string
  dominio: [Num, Num]
}

export interface FuncionSpec {
  expr?: string
  tramos?: TramoSpec[]
  color: ColorNombre
  etiqueta: string // puede llevar $…$
  dominio?: [Num, Num]
  discontinuidades?: Num[]
  estilo?: 'solido' | 'punteado'
}

export interface PuntoSpec {
  x: Num
  y: Num
  abierto?: boolean
  etiqueta?: string // TeX sin $
  posicion?: 'n' | 's' | 'e' | 'o' | 'ne' | 'no' | 'se' | 'so'
  color?: ColorNombre
}

export interface AsintotaSpec {
  tipo: 'vertical' | 'horizontal'
  valor: Num
}

export interface GraficaSpec {
  funciones: FuncionSpec[]
  puntos?: PuntoSpec[]
  asintotas?: AsintotaSpec[]
  vista: { x: [Num, Num]; y: [Num, Num] }
  ejes?: { x?: string; y?: string }
  radianes?: boolean
  alto?: number
  descripcion: string
}

export const num = (v: Num): number => (typeof v === 'number' ? v : Number(evaluate(v)))

export type Fn = (x: number) => number

export function compilar(expr: string): Fn {
  const c = compile(expr)
  return (x: number) => {
    try {
      const v = c.evaluate({ x })
      return typeof v === 'number' ? v : Number.NaN
    } catch {
      return Number.NaN
    }
  }
}

export interface Segmento {
  fn: Fn
  dominio: [number, number]
}

/**
 * Parte cada función en segmentos continuos para que Mafs no una puntos a través de
 * asíntotas, saltos o zonas donde la función no existe.
 */
export function segmentos(f: FuncionSpec, g: GraficaSpec): Segmento[] {
  const [vx0, vx1] = g.vista.x.map(num)
  const margen = (vx1 - vx0) * 0.02
  const eps = (vx1 - vx0) * 1e-6
  const cortes = [
    ...(f.discontinuidades ?? []).map(num),
    ...(g.asintotas ?? []).filter((a) => a.tipo === 'vertical').map((a) => num(a.valor)),
  ]
  const piezas: { fn: Fn; a: number; b: number }[] = f.tramos
    ? f.tramos.map((t) => ({ fn: compilar(t.expr), a: num(t.dominio[0]), b: num(t.dominio[1]) }))
    : [
        {
          fn: compilar(f.expr ?? 'NaN'),
          a: f.dominio ? num(f.dominio[0]) : vx0 - margen,
          b: f.dominio ? num(f.dominio[1]) : vx1 + margen,
        },
      ]

  const salida: Segmento[] = []
  for (const p of piezas) {
    const a = Math.max(p.a, vx0 - margen)
    const b = Math.min(p.b, vx1 + margen)
    if (!(b > a)) continue
    const internos = cortes.filter((c) => c > a && c < b).sort((m, n) => m - n)
    const bordes = [a, ...internos, b]
    for (let i = 0; i < bordes.length - 1; i++) {
      const ini = i === 0 ? bordes[i] : bordes[i] + eps
      const fin = i === bordes.length - 2 ? bordes[i + 1] : bordes[i + 1] - eps
      salida.push(...partesFinitas(p.fn, ini, fin))
    }
  }
  return salida
}

/** Dentro de [a, b], devuelve los subintervalos donde la función da valores finitos. */
function partesFinitas(fn: Fn, a: number, b: number, n = 400): Segmento[] {
  const res: Segmento[] = []
  let inicio: number | null = null
  let ultimo = a
  for (let k = 0; k <= n; k++) {
    const x = a + ((b - a) * k) / n
    const ok = Number.isFinite(fn(x))
    if (ok && inicio === null) inicio = x
    if (!ok && inicio !== null) {
      res.push({ fn, dominio: [inicio, ultimo] })
      inicio = null
    }
    if (ok) ultimo = x
  }
  if (inicio !== null) res.push({ fn, dominio: [inicio, ultimo] })
  return res.filter((s) => s.dominio[1] > s.dominio[0])
}

/** Lista de problemas del bloque. Vacía = todo bien. */
export function validarGrafica(datos: unknown): string[] {
  const e: string[] = []
  const g = datos as Partial<GraficaSpec>
  if (!g || typeof g !== 'object') return ['El bloque no es un objeto JSON.']
  if (typeof g.descripcion !== 'string' || g.descripcion.trim().length < 40) {
    e.push('Falta "descripcion" (regla 5): ejes, qué curva es cuál, puntos clave, qué cambió, dominio e imagen.')
  }
  if (!g.vista || !Array.isArray(g.vista.x) || !Array.isArray(g.vista.y)) e.push('Falta "vista" con x e y.')
  if (!Array.isArray(g.funciones) || g.funciones.length === 0) e.push('Falta al menos una función en "funciones".')
  const colores = new Set<string>()
  for (const [i, f] of (g.funciones ?? []).entries()) {
    const quien = `funciones[${i}]`
    if (!f.etiqueta) e.push(`${quien}: falta "etiqueta".`)
    if (!COLORES.includes(f.color)) e.push(`${quien}: color "${f.color}" no existe (usa ${COLORES.join(', ')}).`)
    if (colores.has(f.color)) e.push(`${quien}: el color "${f.color}" ya lo usa otra curva (una curva por color).`)
    colores.add(f.color)
    const exprs = f.tramos ? f.tramos.map((t) => t.expr) : [f.expr]
    if (!f.tramos && !f.expr) e.push(`${quien}: falta "expr" o "tramos".`)
    for (const ex of exprs) {
      if (!ex) continue
      try {
        const fn = compilar(ex)
        compile(ex) // lanza si la sintaxis está mal
        const [a, b] = g.vista ? g.vista.x.map(num) : [-5, 5]
        const muestras = Array.from({ length: 41 }, (_, k) => fn(a + ((b - a) * k) / 40))
        if (!muestras.some(Number.isFinite)) e.push(`${quien}: "${ex}" no da ningún valor real en la vista.`)
      } catch (err) {
        e.push(`${quien}: mathjs no entiende "${ex}" (${(err as Error).message}).`)
      }
    }
  }
  for (const [i, p] of (g.puntos ?? []).entries()) {
    try {
      if (!Number.isFinite(num(p.x)) || !Number.isFinite(num(p.y))) e.push(`puntos[${i}]: coordenadas no numéricas.`)
    } catch {
      e.push(`puntos[${i}]: mathjs no entiende las coordenadas.`)
    }
  }
  return e
}
