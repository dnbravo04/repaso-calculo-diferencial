import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { evaluate } from 'mathjs'
import {
  BASES,
  asintotasG,
  dominioG,
  imagenG,
  mathjsG,
  secuencia,
  texConjunto,
  texG,
  texSim,
  transformarPunto,
  valor,
  type Parametros,
} from '../src/lib/transformaciones'
import { KATEX_MACROS } from '../src/lib/katex'

const base = (id: string) => BASES.find((b) => b.id === id)!
const compila = (tex: string) => katex.renderToString(tex, { throwOnError: true, macros: { ...KATEX_MACROS } })

describe('explorador: ejemplo de 1.6 (de √x a −2√(4 − 2x) + 3)', () => {
  const f = base('raiz')
  const p: Parametros = { A: -2, B: -2, C: 2, D: 3 }

  it('la secuencia sale en el orden B, C, A, D con los nombres de la clase', () => {
    const s = secuencia(f, p)
    expect(s.map((x) => x.letra)).toEqual(['B', 'C', 'A', 'D'])
    expect(s[0].texto).toMatch(/contracción horizontal por el factor \$\\tfrac\{1\}\{2\}\$ y reflexión sobre el eje \$y\$/i)
    expect(s[1].texto).toMatch(/Traslación de \$2\$ hacia la derecha/)
    expect(s[2].texto).toMatch(/dilatación vertical por el factor \$2\$ y reflexión sobre el eje \$x\$/i)
    expect(s[3].texto).toMatch(/Traslación de \$3\$ hacia arriba/)
  })

  it('nunca usa "horizontal" o "vertical" para nombrar una reflexión', () => {
    for (const b of BASES) {
      for (const q of [p, { A: -0.5, B: 3, C: -1, D: -2 }]) {
        for (const paso of secuencia(b, q)) expect(paso.texto).not.toMatch(/reflexión (horizontal|vertical)/)
      }
    }
  })

  it('la regla de los puntos coincide con la tabla de 1.6', () => {
    const r = f.puntos.map((pt) => transformarPunto(f, p, pt).map(texSim))
    expect(r).toEqual([
      ['2', '3'],
      ['\\tfrac{3}{2}', '1'],
      ['0', '-1'],
    ])
  })

  it('dominio e imagen de g', () => {
    expect(texConjunto(dominioG(f, p))).toBe('(-\\infty, 2]')
    expect(texConjunto(imagenG(f, p))).toBe('(-\\infty, 3]')
  })
})

describe('explorador: todas las bases', () => {
  const casos: Parametros[] = [
    { A: 1, B: 1, C: 0, D: 0 },
    { A: 2, B: 3, C: 1, D: -1 },
    { A: -0.5, B: -0.25, C: -2, D: 1.5 },
  ]

  it.each(BASES.map((b) => [b.id, b]))('%s: cada punto transformado está sobre g y todo el TeX compila', (_id, b) => {
    for (const p of casos) {
      const expr = mathjsG(b, p)
      for (const pt of b.puntos) {
        const [x, y] = transformarPunto(b, p, pt)
        const gx = Number(evaluate(expr, { x: valor(x) }))
        expect(Math.abs(gx - valor(y)), `${b.id} ${JSON.stringify(p)}`).toBeLessThan(1e-9)
        expect(() => compila(`\\left(${texSim(x)}, ${texSim(y)}\\right)`)).not.toThrow()
      }
      expect(() => compila(`g(x) = ${texG(b, p)}`)).not.toThrow()
      expect(() => compila(texConjunto(dominioG(b, p)))).not.toThrow()
      expect(() => compila(texConjunto(imagenG(b, p)))).not.toThrow()
      for (const paso of secuencia(b, p)) {
        expect(() => compila(paso.formula)).not.toThrow()
        for (const m of paso.texto.matchAll(/\$([^$]+)\$/g)) expect(() => compila(m[1])).not.toThrow()
      }
    }
  })

  it('las asíntotas se mueven con C y con A, D', () => {
    const a = asintotasG(base('inv'), { A: 3, B: 2, C: 2, D: 1 })
    expect(valor(a.vertical!)).toBe(2)
    expect(a.horizontal).toBe(1)
  })

  it('1/x: dominio de g sin el punto de la asíntota', () => {
    expect(texConjunto(dominioG(base('inv'), { A: 3, B: 2, C: 2, D: 1 }))).toBe('\\mathbb{R} \\setminus \\{2\\}')
  })

  it('trigonométricas: C va en cuartos de π', () => {
    const s = secuencia(base('cos'), { A: 2, B: 3, C: 4, D: 1 })
    expect(s[1].texto).toMatch(/Traslación de \$\\pi\$ hacia la derecha/)
    expect(texG(base('cos'), { A: 2, B: 3, C: 4, D: 1 })).toBe('2\\,\\cos\\left(3\\,(x - \\pi)\\right) + 1')
  })
})
