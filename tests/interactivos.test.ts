import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import katex from 'katex'
import { INDICE } from '../src/lib/indice'
import { extraerFormulas, extraerInteractivos, textoSinFormulas } from '../src/lib/markdown'
import { candidatosRacionales, evaluarPolinomio, numeroTex, polinomioTex, radianesTex, ruffini, validarInteractivo, valoresExactos, type InteractivoSpec } from '../src/lib/interactivo'
import { KATEX_MACROS } from '../src/lib/katex'

const DIR = join(__dirname, '..', 'src', 'content')
const bloques = INDICE.filter((e) => existsSync(join(DIR, `${e.archivo}.md`))).flatMap((e) =>
  extraerInteractivos(readFileSync(join(DIR, `${e.archivo}.md`), 'utf8')).map((json, i) => ({ id: `${e.id} #${i + 1}`, json })),
)
const compila = (tex: string) => katex.renderToString(tex, { throwOnError: true, macros: { ...KATEX_MACROS } })

describe('bloques interactivo', () => {
  it('hay al menos uno de cada tipo', () => {
    const tipos = new Set(bloques.map((b) => (JSON.parse(b.json) as InteractivoSpec).tipo))
    expect([...tipos].sort()).toEqual(['circulo-unitario', 'limite', 'pendiente', 'ruffini', 'secante'])
  })

  it.each(bloques.map((b) => [b.id, b.json]))('%s: JSON válido y datos matemáticos correctos', (_id, json) => {
    expect(validarInteractivo(JSON.parse(json))).toEqual([])
  })

  it.each(bloques.map((b) => [b.id, b.json]))('%s: TeX que compila y descripción sin matemática suelta', (_id, json) => {
    const g = JSON.parse(json) as InteractivoSpec & { tex?: string; texDerivada?: string }
    for (const t of [g.tex, g.texDerivada]) if (t) expect(() => compila(t), t).not.toThrow()
    for (const f of extraerFormulas(g.descripcion)) expect(() => compila(f.tex), f.tex).not.toThrow()
    expect(textoSinFormulas(g.descripcion)).not.toMatch(/[²³√≤≥π≠±∞⁻¹−]|\^|\\/)
  })
})

describe('validarInteractivo detecta errores (control negativo)', () => {
  it('límite equivocado, derivada equivocada y tipo desconocido', () => {
    const d = 'Una descripción suficientemente larga para pasar la regla cinco.'
    const vista = { x: [-1, 4], y: [-1, 8] }
    expect(validarInteractivo({ tipo: 'limite', expr: 'x + 3', tex: 'x+3', a: 2, L: 6, vista, descripcion: d }).join(' ')).toMatch(/no está cerca/)
    expect(validarInteractivo({ tipo: 'secante', expr: 'x^2', tex: 'x^2', a: 1, derivada: 3, hMax: 1, vista, descripcion: d }).join(' ')).toMatch(/no coincide/)
    expect(validarInteractivo({ tipo: 'pendiente', expr: 'x^2', tex: 'x^2', derivada: 'x', texDerivada: 'x', vista, vistaDerivada: vista, descripcion: d }).join(' ')).toMatch(/no coincide/)
    expect(validarInteractivo({ tipo: 'otro' }).join(' ')).toMatch(/tipo/)
  })
})

describe('círculo unitario: valores exactos', () => {
  it('coinciden con Math.sin y Math.cos en todos los ángulos notables', () => {
    // TeX → expresión de JS: primero las raíces, luego las fracciones.
    const valor = (tex: string): number =>
      Function(
        `return ${tex.replace(/\\sqrt\{(\d)\}/g, 'Math.sqrt($1)').replace(/\\tfrac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')}`,
      )()
    for (let g = 0; g < 360; g += 15) {
      const v = valoresExactos(g)
      if (g % 30 !== 0 && g % 45 !== 0) {
        expect(v).toBeNull()
        continue
      }
      const r = (g * Math.PI) / 180
      expect(valor(v!.sen), `sen ${g}`).toBeCloseTo(Math.sin(r), 10)
      expect(valor(v!.cos), `cos ${g}`).toBeCloseTo(Math.cos(r), 10)
      if (g % 180 === 90) expect(v!.tan).toMatch(/no existe/)
      else expect(valor(v!.tan), `tan ${g}`).toBeCloseTo(Math.tan(r), 10)
    }
  })

  it('radianes exactos', () => {
    expect([0, 30, 45, 90, 135, 180, 210, 270, 330].map(radianesTex)).toEqual([
      '0',
      '\\tfrac{\\pi}{6}',
      '\\tfrac{\\pi}{4}',
      '\\tfrac{\\pi}{2}',
      '\\tfrac{3\\pi}{4}',
      '\\pi',
      '\\tfrac{7\\pi}{6}',
      '\\tfrac{3\\pi}{2}',
      '\\tfrac{11\\pi}{6}',
    ])
  })
})

describe('división sintética', () => {
  it('cumple P(x) = (x − a)·Q(x) + r y el residuo es P(a)', () => {
    const casos: [number[], number][] = [
      [[2, -3, -11, 6], 3],
      [[1, 0, -3, 5, -7], -2],
      [[2, 1, 3, -2], 0.5],
      [[1, -1, -7, 1, 6], 1],
    ]
    for (const [c, a] of casos) {
      const t = ruffini(c, a)
      expect(t.residuo).toBeCloseTo(evaluarPolinomio(c, a), 10)
      for (const x of [-2.3, 0.7, 4.1]) {
        expect(evaluarPolinomio(c, x)).toBeCloseTo((x - a) * evaluarPolinomio(t.cociente, x) + t.residuo, 9)
      }
    }
    expect(ruffini([2, -3, -11, 6], 3)).toMatchObject({ cociente: [2, 3, -2], residuo: 0 })
    expect(ruffini([1, 0, -3, 5, -7], -2)).toMatchObject({ cociente: [1, -2, 1, 3], residuo: -13 })
  })

  it('candidatos ±p/q y formato TeX', () => {
    const cand = candidatosRacionales([2, -3, -11, 6])
    for (const r of [3, 0.5, -2]) expect(cand).toContain(r)
    expect(cand).toEqual([...cand].sort((a, b) => a - b))
    expect(candidatosRacionales([1, -1, -7, 1, 6])).toEqual([-6, -3, -2, -1, 1, 2, 3, 6])
    expect(numeroTex(-0.5)).toBe('-\\tfrac{1}{2}')
    expect(polinomioTex([1, -2, 1, 3])).toBe('x^{3} - 2x^{2} + x + 3')
    expect(polinomioTex([2, 0, -1])).toBe('2x^{2} - 1')
  })
})
