// Bloques ```interactivo: gráficas que se manipulan con un deslizador o arrastrando un punto.
// Tipos y validación sin React, para las pruebas.
import { compilar, num } from './grafica'

type Num = number | string
type Vista = { x: [Num, Num]; y: [Num, Num] }

export interface CirculoSpec {
  tipo: 'circulo-unitario'
  descripcion: string
}

/** El punto (x, f(x)) se acerca a x = a por los dos lados; f(x) se acerca a L. */
export interface LimiteSpec {
  tipo: 'limite'
  expr: string
  tex: string // f(x) en TeX, para el rótulo
  a: Num
  L: Num
  vista: Vista
  descripcion: string
}

/** La secante por x = a y x = a + h se acerca a la tangente cuando h → 0. */
export interface SecanteSpec {
  tipo: 'secante'
  expr: string
  tex: string
  a: Num
  derivada: Num // f'(a), el valor exacto al que tienden las pendientes
  hMax: number
  vista: Vista
  descripcion: string
}

/** Se mueve x₀: arriba la tangente a f en x₀; abajo el punto (x₀, f'(x₀)) va dibujando f'. */
export interface PendienteSpec {
  tipo: 'pendiente'
  expr: string
  tex: string
  derivada: string // f'(x) como expresión de mathjs
  texDerivada: string
  vista: Vista
  vistaDerivada: Vista
  descripcion: string
}

export type InteractivoSpec = CirculoSpec | LimiteSpec | SecanteSpec | PendienteSpec

export const TIPOS = ['circulo-unitario', 'limite', 'secante', 'pendiente'] as const

/** Derivada numérica central, para comprobar los datos del bloque. */
export const derivadaNumerica = (f: (x: number) => number, x: number, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h)

/** Lista de problemas del bloque. Vacía = todo bien. */
export function validarInteractivo(datos: unknown): string[] {
  const e: string[] = []
  const g = datos as Partial<InteractivoSpec> & Record<string, unknown>
  if (!g || typeof g !== 'object') return ['El bloque no es un objeto JSON.']
  if (!TIPOS.includes(g.tipo as (typeof TIPOS)[number])) return [`"tipo" debe ser uno de: ${TIPOS.join(', ')}.`]
  if (typeof g.descripcion !== 'string' || g.descripcion.trim().length < 40) {
    e.push('Falta "descripcion" (regla 5): qué se ve, qué se mueve y qué hay que notar.')
  }
  if (g.tipo === 'circulo-unitario') return e

  const s = g as LimiteSpec | SecanteSpec | PendienteSpec
  if (!s.vista || !Array.isArray(s.vista.x) || !Array.isArray(s.vista.y)) e.push('Falta "vista" con x e y.')
  if (typeof s.tex !== 'string' || !s.tex) e.push('Falta "tex" con la función en TeX.')
  let f: (x: number) => number
  try {
    f = compilar(s.expr)
  } catch (err) {
    return [...e, `mathjs no entiende "${s.expr}" (${(err as Error).message}).`]
  }

  if (s.tipo === 'limite') {
    const a = num(s.a)
    const L = num(s.L)
    for (const d of [1e-3, -1e-3]) {
      if (!(Math.abs(f(a + d) - L) < 1e-2)) e.push(`f(${a + d}) = ${f(a + d)} no está cerca de L = ${L}.`)
    }
  }
  if (s.tipo === 'secante') {
    const a = num(s.a)
    const m = num(s.derivada)
    if (!Number.isFinite(f(a))) e.push(`f no está definida en a = ${a}.`)
    if (!(Math.abs(derivadaNumerica(f, a) - m) < 1e-4)) e.push(`"derivada" = ${m} no coincide con f'(${a}) ≈ ${derivadaNumerica(f, a)}.`)
    if (!(s.hMax > 0) || !Number.isFinite(f(a + s.hMax))) e.push('"hMax" debe ser positivo y f debe existir en a + hMax.')
  }
  if (s.tipo === 'pendiente') {
    if (!s.vistaDerivada) e.push('Falta "vistaDerivada".')
    let d: (x: number) => number
    try {
      d = compilar(s.derivada)
    } catch (err) {
      return [...e, `mathjs no entiende "${s.derivada}" (${(err as Error).message}).`]
    }
    const [x0, x1] = s.vista.x.map(num)
    for (let k = 1; k < 10; k++) {
      const x = x0 + ((x1 - x0) * k) / 10
      if (Number.isFinite(f(x)) && !(Math.abs(derivadaNumerica(f, x) - d(x)) < 1e-3 * Math.max(1, Math.abs(d(x))))) {
        e.push(`"derivada" no coincide con la derivada de "${s.expr}" en x = ${x}.`)
        break
      }
    }
  }
  return e
}

// ---------- Valores exactos del círculo unitario ----------

export interface ValorExacto {
  sen: string
  cos: string
  tan: string
}

/**
 * Valores exactos (TeX) en los ángulos notables: múltiplos de 30° y de 45°.
 * Devuelve null si el ángulo no es notable.
 */
export function valoresExactos(grados: number): ValorExacto | null {
  const g = ((Math.round(grados) % 360) + 360) % 360
  if (g % 30 !== 0 && g % 45 !== 0) return null
  const ref = g % 180 <= 90 ? g % 180 : 180 - (g % 180) // ángulo de referencia 0..90
  const base: Record<number, [string, string, string]> = {
    0: ['0', '1', '0'],
    30: ['\\tfrac{1}{2}', '\\tfrac{\\sqrt{3}}{2}', '\\tfrac{\\sqrt{3}}{3}'],
    45: ['\\tfrac{\\sqrt{2}}{2}', '\\tfrac{\\sqrt{2}}{2}', '1'],
    60: ['\\tfrac{\\sqrt{3}}{2}', '\\tfrac{1}{2}', '\\sqrt{3}'],
    90: ['1', '0', '\\text{no existe}'],
  }
  const [s, c, t] = base[ref]
  const rad = (g * Math.PI) / 180
  const signo = (v: number, tex: string) => (tex === '0' || tex.startsWith('\\text') ? tex : v < 0 ? `-${tex}` : tex)
  return {
    sen: signo(Math.sin(rad), s),
    cos: signo(Math.cos(rad), c),
    tan: ref === 90 ? t : signo(Math.tan(rad), t),
  }
}

/** Ángulo en radianes como TeX: múltiplos de π/12 se escriben exactos (π/6, 3π/4…). */
export function radianesTex(grados: number): string {
  const g = Math.round(grados)
  if (g % 15 !== 0) return ((g * Math.PI) / 180).toFixed(2).replace('.', '{,}')
  const n = g / 15 // en doceavos de π
  if (n === 0) return '0'
  const mcd = (a: number, b: number): number => (b ? mcd(b, a % b) : a)
  const k = mcd(n, 12)
  const num_ = n / k
  const den = 12 / k
  const arriba = num_ === 1 ? '\\pi' : `${num_}\\pi`
  return den === 1 ? arriba : `\\tfrac{${arriba}}{${den}}`
}
