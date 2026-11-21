// Explorador de transformaciones: g(x) = A·f(B(x − C)) + D. Lógica pura y valores exactos.

// ---------- Números simbólicos: r + p·π + e·e + ie·(1/e), con coeficientes racionales ----------

export interface Sim {
  r: number
  p: number
  e: number
  ie: number
}
export const sim = (r = 0, p = 0, e = 0, ie = 0): Sim => ({ r, p, e, ie })
export const valor = (s: Sim) => s.r + s.p * Math.PI + s.e * Math.E + s.ie / Math.E
const escalar = (s: Sim, k: number): Sim => sim(s.r * k, s.p * k, s.e * k, s.ie * k)
const sumar = (a: Sim, b: Sim): Sim => sim(a.r + b.r, a.p + b.p, a.e + b.e, a.ie + b.ie)

/** Fracción n/d con d ≤ 256 (los deslizadores usan pasos de 1/4 y 1/2). */
export function fraccion(x: number): [number, number] {
  for (let d = 1; d <= 256; d++) {
    const n = Math.round(x * d)
    if (Math.abs(x - n / d) < 1e-9) return [n, d]
  }
  return [Math.round(x * 1000), 1000]
}

/** Racional a TeX: 3, -\tfrac{1}{2}. */
export function texRacional(x: number): string {
  const [n, d] = fraccion(x)
  if (d === 1) return String(n)
  return `${n < 0 ? '-' : ''}\\tfrac{${Math.abs(n)}}{${d}}`
}

function texTermino(c: number, unidad: string): string {
  // unidad: '\\pi', 'e', '\\tfrac{1}{e}' (este último se escribe aparte)
  const [n, d] = fraccion(c)
  const signo = n < 0 ? '-' : ''
  const an = Math.abs(n)
  if (unidad === 'ie') return d === 1 ? `${signo}\\tfrac{${an}}{e}` : `${signo}\\tfrac{${an}}{${d}e}`
  const num = an === 1 ? unidad : `${an}${unidad}`
  return d === 1 ? `${signo}${num}` : `${signo}\\tfrac{${num}}{${d}}`
}

/** Número simbólico a TeX: \tfrac{\pi}{4} + \tfrac{1}{2}, e - 1, … */
export function texSim(s: Sim): string {
  const t: string[] = []
  if (Math.abs(s.p) > 1e-12) t.push(texTermino(s.p, '\\pi'))
  if (Math.abs(s.e) > 1e-12) t.push(texTermino(s.e, 'e'))
  if (Math.abs(s.ie) > 1e-12) t.push(texTermino(s.ie, 'ie'))
  if (Math.abs(s.r) > 1e-12 || t.length === 0) t.push(texRacional(s.r))
  return t.reduce((acc, x, i) => (i === 0 ? x : x.startsWith('-') ? `${acc} - ${x.slice(1)}` : `${acc} + ${x}`), '')
}

// ---------- Conjuntos (uniones de intervalos) ----------

export interface Intervalo {
  a: number
  b: number
  ca: boolean // cerrado en a
  cb: boolean // cerrado en b
}
export type Conjunto = Intervalo[]

const R: Conjunto = [{ a: -Infinity, b: Infinity, ca: false, cb: false }]

/** Imagen de un conjunto por t ↦ k·t + m (k ≠ 0). */
export function afin(c: Conjunto, k: number, m: number): Conjunto {
  const f = (t: number) => (Number.isFinite(t) ? k * t + m : k * t)
  return c
    .map((i) => (k > 0 ? { a: f(i.a), b: f(i.b), ca: i.ca, cb: i.cb } : { a: f(i.b), b: f(i.a), ca: i.cb, cb: i.ca }))
    .sort((x, y) => x.a - y.a)
}

const texExtremo = (x: number) => (x === Infinity ? '\\infty' : x === -Infinity ? '-\\infty' : texRacional(x))

export function texConjunto(c: Conjunto): string {
  if (c.length === 1 && c[0].a === -Infinity && c[0].b === Infinity) return '\\mathbb{R}'
  if (c.length === 2 && c[0].a === -Infinity && c[1].b === Infinity && c[0].b === c[1].a && !c[0].cb && !c[1].ca) {
    return `\\mathbb{R} \\setminus \\{${texRacional(c[0].b)}\\}`
  }
  return c.map((i) => `${i.ca ? '[' : '('}${texExtremo(i.a)}, ${texExtremo(i.b)}${i.cb ? ']' : ')'}`).join(' \\cup ')
}

// ---------- Funciones base ----------

export interface Base {
  id: string
  nombre: string // TeX de f(x)
  mathjs: string // expresión en x
  arg: (a: string) => string // TeX de f(a)
  dom: Conjunto
  img: Conjunto
  puntos: [Sim, Sim][]
  trig?: boolean
  asintotaV?: number // en f
  asintotaH?: number // en f
}

const desdeCero = (cerrado: boolean): Conjunto => [{ a: 0, b: Infinity, ca: cerrado, cb: false }]
const sinCero: Conjunto = [
  { a: -Infinity, b: 0, ca: false, cb: false },
  { a: 0, b: Infinity, ca: false, cb: false },
]

export const BASES: Base[] = [
  { id: 'x2', nombre: 'x^2', mathjs: 'x^2', arg: (a) => `\\left(${a}\\right)^2`, dom: R, img: desdeCero(true), puntos: [[sim(0), sim(0)], [sim(1), sim(1)], [sim(2), sim(4)]] },
  { id: 'abs', nombre: '|x|', mathjs: 'abs(x)', arg: (a) => `\\left|${a}\\right|`, dom: R, img: desdeCero(true), puntos: [[sim(-2), sim(2)], [sim(0), sim(0)], [sim(1), sim(1)]] },
  { id: 'raiz', nombre: '\\sqrt{x}', mathjs: 'sqrt(x)', arg: (a) => `\\sqrt{${a}}`, dom: desdeCero(true), img: desdeCero(true), puntos: [[sim(0), sim(0)], [sim(1), sim(1)], [sim(4), sim(2)]] },
  { id: 'inv', nombre: '\\tfrac{1}{x}', mathjs: '1/x', arg: (a) => `\\dfrac{1}{${a}}`, dom: sinCero, img: sinCero, puntos: [[sim(-1), sim(-1)], [sim(1), sim(1)], [sim(2), sim(0.5)]], asintotaV: 0, asintotaH: 0 },
  { id: 'sen', nombre: '\\operatorname{sen} x', mathjs: 'sin(x)', arg: (a) => `\\operatorname{sen}\\left(${a}\\right)`, dom: R, img: [{ a: -1, b: 1, ca: true, cb: true }], puntos: [[sim(0), sim(0)], [sim(0, 0.5), sim(1)], [sim(0, 1), sim(0)]], trig: true },
  { id: 'cos', nombre: '\\cos x', mathjs: 'cos(x)', arg: (a) => `\\cos\\left(${a}\\right)`, dom: R, img: [{ a: -1, b: 1, ca: true, cb: true }], puntos: [[sim(0), sim(1)], [sim(0, 0.5), sim(0)], [sim(0, 1), sim(-1)]], trig: true },
  { id: 'exp', nombre: 'e^x', mathjs: 'exp(x)', arg: (a) => `e^{${a}}`, dom: R, img: desdeCero(false), puntos: [[sim(-1), sim(0, 0, 0, 1)], [sim(0), sim(1)], [sim(1), sim(0, 0, 1)]], asintotaH: 0 },
  { id: 'ln', nombre: '\\ln x', mathjs: 'log(x)', arg: (a) => `\\ln\\left(${a}\\right)`, dom: desdeCero(false), img: R, puntos: [[sim(0, 0, 0, 1), sim(-1)], [sim(1), sim(0)], [sim(0, 0, 1), sim(1)]], asintotaV: 0 },
]

// ---------- Parámetros y resultados ----------

export interface Parametros {
  A: number
  B: number
  /** Para las trigonométricas, C se da en cuartos de π: C = c·π/4. */
  C: number
  D: number
}

/** C como número simbólico (en π para las trigonométricas). */
export const simC = (base: Base, C: number): Sim => (base.trig ? sim(0, C / 4) : sim(C))

const coef = (k: number) => (k === 1 ? '' : k === -1 ? '-' : `${texRacional(k)}\\,`)

/** TeX del argumento B(x − C). */
export function texArgumento(base: Base, { B, C }: Parametros): string {
  const c = simC(base, C)
  const cero = valor(c) === 0
  const resta = cero ? 'x' : texSim(c).startsWith('-') ? `x + ${texSim(escalar(c, -1))}` : `x - ${texSim(c)}`
  if (B === 1) return resta
  return cero ? `${coef(B)}x` : `${coef(B)}(${resta})`
}

/** TeX completo de g(x). */
export function texG(base: Base, p: Parametros): string {
  const D = p.D === 0 ? '' : p.D > 0 ? ` + ${texRacional(p.D)}` : ` - ${texRacional(-p.D)}`
  return `${coef(p.A)}${base.arg(texArgumento(base, p))}${D}`
}

/** Expresión de mathjs para g. */
export function mathjsG(base: Base, { A, B, C, D }: Parametros): string {
  const c = base.trig ? `(${C}*pi/4)` : `(${C})`
  const dentro = `((${B})*(x-${c}))`
  return `(${A})*(${base.mathjs.replace(/\bx\b/g, dentro)})+(${D})`
}

/** Regla de los puntos: (u, v) ↦ (u/B + C, A·v + D), con valores exactos. */
export function transformarPunto(base: Base, p: Parametros, [u, v]: [Sim, Sim]): [Sim, Sim] {
  return [sumar(escalar(u, 1 / p.B), simC(base, p.C)), sumar(escalar(v, p.A), sim(p.D))]
}

export interface Paso {
  letra: 'B' | 'C' | 'A' | 'D'
  formula: string // TeX de la función después de este paso
  texto: string // con $…$
}

const factorTex = (k: number) => texRacional(k)

/** Secuencia en el orden B, C, A, D con los nombres de la clase (regla 3). */
export function secuencia(base: Base, p: Parametros): Paso[] {
  const { A, B, C, D } = p
  const c = simC(base, C)
  const pasos: Paso[] = []

  const partesB: string[] = []
  if (Math.abs(B) > 1) partesB.push(`contracción horizontal por el factor $${factorTex(1 / Math.abs(B))}$`)
  if (Math.abs(B) < 1) partesB.push(`dilatación horizontal por el factor $${factorTex(1 / Math.abs(B))}$`)
  if (B < 0) partesB.push('reflexión sobre el eje $y$')
  pasos.push({
    letra: 'B',
    formula: `f(${B === 1 ? 'x' : `${coef(B)}x`})`,
    texto: partesB.length ? `${mayus(partesB.join(' y '))}.` : `$B = 1$: no hay contracción, dilatación ni reflexión horizontal.`,
  })

  const vc = valor(c)
  pasos.push({
    letra: 'C',
    formula: `f\\big(${texArgumento(base, { A, B, C, D })}\\big)`,
    texto:
      vc === 0
        ? '$C = 0$: no hay traslación horizontal.'
        : `Traslación de $${texSim(vc > 0 ? c : escalar(c, -1))}$ hacia la ${vc > 0 ? 'derecha' : 'izquierda'}.`,
  })

  const partesA: string[] = []
  if (Math.abs(A) > 1) partesA.push(`dilatación vertical por el factor $${factorTex(Math.abs(A))}$`)
  if (Math.abs(A) < 1) partesA.push(`contracción vertical por el factor $${factorTex(Math.abs(A))}$`)
  if (A < 0) partesA.push('reflexión sobre el eje $x$')
  pasos.push({
    letra: 'A',
    formula: `${coef(A)}f\\big(${texArgumento(base, p)}\\big)`,
    texto: partesA.length ? `${mayus(partesA.join(' y '))}.` : '$A = 1$: no hay dilatación, contracción ni reflexión vertical.',
  })

  pasos.push({
    letra: 'D',
    formula: `${coef(A)}f\\big(${texArgumento(base, p)}\\big)${D === 0 ? '' : D > 0 ? ` + ${texRacional(D)}` : ` - ${texRacional(-D)}`}`,
    texto: D === 0 ? '$D = 0$: no hay traslación vertical.' : `Traslación de $${texRacional(Math.abs(D))}$ hacia ${D > 0 ? 'arriba' : 'abajo'}.`,
  })
  return pasos
}

const mayus = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const dominioG = (base: Base, p: Parametros): Conjunto => afin(base.dom, 1 / p.B, valor(simC(base, p.C)))
export const imagenG = (base: Base, p: Parametros): Conjunto => afin(base.img, p.A, p.D)

/** Asíntotas de g (las de f, movidas). */
export function asintotasG(base: Base, p: Parametros): { vertical?: Sim; horizontal?: number } {
  return {
    vertical: base.asintotaV !== undefined ? sumar(escalar(sim(base.asintotaV), 1 / p.B), simC(base, p.C)) : undefined,
    horizontal: base.asintotaH !== undefined ? p.A * base.asintotaH + p.D : undefined,
  }
}
