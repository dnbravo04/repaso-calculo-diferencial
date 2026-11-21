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

/** Tabla de Ruffini paso a paso: P(x) ÷ (x − a). Se pueden probar otras raíces candidatas. */
export interface RuffiniSpec {
  tipo: 'ruffini'
  coeficientes: Num[] // de mayor a menor grado, con 0 en los grados que faltan
  raiz: Num
  descripcion: string
}

export type InteractivoSpec = CirculoSpec | LimiteSpec | SecanteSpec | PendienteSpec | RuffiniSpec

export const TIPOS = ['circulo-unitario', 'limite', 'secante', 'pendiente', 'ruffini'] as const

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
  if (g.tipo === 'ruffini') {
    const r = g as RuffiniSpec
    try {
      const c = (r.coeficientes ?? []).map(num)
      if (c.length < 2 || c.some((v) => !Number.isFinite(v))) e.push('"coeficientes" necesita al menos dos números.')
      else if (c[0] === 0) e.push('El primer coeficiente (el principal) no puede ser 0.')
      if (!Number.isFinite(num(r.raiz))) e.push('"raiz" no es un número.')
    } catch {
      e.push('mathjs no entiende "coeficientes" o "raiz".')
    }
    return e
  }

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

// ---------- División sintética (regla de Ruffini) ----------

export interface TablaRuffini {
  /** Fila del medio: productos; el primero no existe (se "baja" el coeficiente). */
  productos: (number | null)[]
  /** Fila de abajo: sumas. Las primeras n − 1 son el cociente; la última, el residuo. */
  resultados: number[]
  cociente: number[]
  residuo: number
}

/** P(x) ÷ (x − a) con coeficientes de mayor a menor grado. */
export function ruffini(coefs: number[], a: number): TablaRuffini {
  const productos: (number | null)[] = [null]
  const resultados: number[] = [coefs[0]]
  for (let i = 1; i < coefs.length; i++) {
    const p = resultados[i - 1] * a
    productos.push(p)
    resultados.push(coefs[i] + p)
  }
  return { productos, resultados, cociente: resultados.slice(0, -1), residuo: resultados[resultados.length - 1] }
}

/** Valor de P(x) por Horner. */
export const evaluarPolinomio = (coefs: number[], x: number) => coefs.reduce((s, c) => s * x + c, 0)

const divisores = (n: number) => {
  const m = Math.abs(Math.round(n))
  return Array.from({ length: m }, (_, i) => i + 1).filter((d) => m % d === 0)
}

/**
 * Raíces racionales posibles ±p/q (p divide al término independiente, q al coeficiente principal),
 * de menor a mayor. Solo para coeficientes enteros; si el término independiente es 0, incluye el 0.
 */
export function candidatosRacionales(coefs: number[]): number[] {
  if (!coefs.every(Number.isInteger)) return []
  let c = [...coefs]
  const conCero = c[c.length - 1] === 0
  while (c.length > 1 && c[c.length - 1] === 0) c = c.slice(0, -1)
  if (c.length < 2) return [0]
  const ps = divisores(c[c.length - 1])
  const qs = divisores(c[0])
  const vistos = new Set<string>()
  const salida: number[] = conCero ? [0] : []
  for (const p of ps)
    for (const q of qs)
      for (const v of [p / q, -p / q]) {
        const k = v.toFixed(9)
        if (!vistos.has(k)) {
          vistos.add(k)
          salida.push(v)
        }
      }
  return salida.sort((x, y) => x - y)
}

/** Número como TeX: entero, fracción exacta (denominador hasta 100) o decimal con coma. */
export function numeroTex(v: number): string {
  if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v))
  for (let d = 2; d <= 100; d++) {
    const n = v * d
    if (Math.abs(n - Math.round(n)) < 1e-9) {
      const k = Math.round(n)
      return `${k < 0 ? '-' : ''}\\tfrac{${Math.abs(k)}}{${d}}`
    }
  }
  return v.toFixed(3).replace('.', '{,}')
}

/** Polinomio en TeX a partir de sus coeficientes (de mayor a menor grado). */
export function polinomioTex(coefs: number[]): string {
  const n = coefs.length - 1
  const partes: string[] = []
  coefs.forEach((c, i) => {
    if (Math.abs(c) < 1e-12) return
    const g = n - i
    const x = g === 0 ? '' : g === 1 ? 'x' : `x^{${g}}`
    const abs = numeroTex(Math.abs(c))
    const cuerpo = g > 0 && abs === '1' ? x : `${abs}${x}`
    partes.push(partes.length === 0 ? (c < 0 ? `-${cuerpo}` : cuerpo) : `${c < 0 ? '-' : '+'} ${cuerpo}`)
  })
  return partes.length ? partes.join(' ') : '0'
}
