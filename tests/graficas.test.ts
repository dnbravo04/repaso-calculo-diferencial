import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import katex from 'katex'
import { INDICE } from '../src/lib/indice'
import { extraerFormulas, extraerGraficas, textoSinFormulas } from '../src/lib/markdown'
import { compilar, num, segmentos, validarGrafica, type GraficaSpec } from '../src/lib/grafica'
import { KATEX_MACROS } from '../src/lib/katex'

const DIR = join(__dirname, '..', 'src', 'content')
const disponibles = INDICE.filter((e) => existsSync(join(DIR, `${e.archivo}.md`)))
const bloques = disponibles.flatMap((e) =>
  extraerGraficas(readFileSync(join(DIR, `${e.archivo}.md`), 'utf8')).map((json, i) => ({ id: `${e.id} #${i + 1}`, json })),
)

const compila = (tex: string, bloque = false) =>
  katex.renderToString(tex, { throwOnError: true, displayMode: bloque, macros: { ...KATEX_MACROS } })

describe('bloques grafica', () => {
  it('las entradas de la Fase 3 tienen gráficas', () => {
    for (const id of ['1.2', '1.4', '1.6', '1.7', '1.8']) {
      expect(bloques.some((b) => b.id.startsWith(`${id} `)), id).toBe(true)
    }
  })

  it.each(bloques.map((b) => [b.id, b.json]))('%s: JSON válido, con descripción y expresiones que mathjs evalúa', (_id, json) => {
    const g = JSON.parse(json) as GraficaSpec
    expect(validarGrafica(g)).toEqual([])
    expect(g.descripcion.trim().length).toBeGreaterThan(0)
  })

  it.each(bloques.map((b) => [b.id, b.json]))('%s: rótulos y descripción sin matemática en texto plano y con KaTeX que compila', (_id, json) => {
    const g = JSON.parse(json) as GraficaSpec
    const textos = [g.descripcion, ...g.funciones.map((f) => f.etiqueta)]
    for (const t of textos) {
      for (const f of extraerFormulas(t)) expect(() => compila(f.tex, f.bloque), f.tex).not.toThrow()
      const plano = textoSinFormulas(t)
      expect(plano, t).not.toMatch(/[²³√≤≥π≠±∞∪∩∈ℝℤ⁻¹⌊⌋−]|\^|\\/)
    }
    for (const p of g.puntos ?? []) if (p.etiqueta) expect(() => compila(p.etiqueta!), p.etiqueta).not.toThrow()
  })

  it.each(bloques.map((b) => [b.id, b.json]))('%s: la vista incluye el origen, para que se vean los dos ejes con sus números', (_id, json) => {
    const g = JSON.parse(json) as GraficaSpec
    const [x0, x1] = g.vista.x.map(num)
    const [y0, y1] = g.vista.y.map(num)
    expect(x0 <= 0 && x1 >= 0, `x: [${x0}, ${x1}]`).toBe(true)
    expect(y0 <= 0 && y1 >= 0, `y: [${y0}, ${y1}]`).toBe(true)
  })

  it.each(bloques.map((b) => [b.id, b.json]))('%s: la descripción cubre lo que pide la regla 5', (_id, json) => {
    const { descripcion: d } = JSON.parse(json) as GraficaSpec
    expect(d).toMatch(/eje horizontal/i)
    expect(d).toMatch(/vertical/i)
    expect(d).toMatch(/curva|recta/i)
    expect(d).toMatch(/Dom|dominio/)
    expect(d).toMatch(/Img|imagen/)
  })

  it.each(bloques.map((b) => [b.id, b.json]))('%s: cada punto marcado está sobre alguna curva (o es un punto abierto de un salto)', (_id, json) => {
    const g = JSON.parse(json) as GraficaSpec
    for (const p of g.puntos ?? []) {
      const x = num(p.x)
      const y = num(p.y)
      const exprs = g.funciones.flatMap((f) => (f.tramos ? f.tramos.map((t) => t.expr) : [f.expr!]))
      // Un punto abierto en un salto está en el límite de un tramo: se mira un poco a la izquierda y a la derecha.
      const cerca = exprs.some((ex) => {
        const fn = compilar(ex)
        return [x, x - 1e-6, x + 1e-6].some((t) => Math.abs(fn(t) - y) < 1e-3)
      })
      expect(cerca, `punto (${p.x}, ${p.y})`).toBe(true)
    }
  })
})

describe('segmentos (no unir a través de asíntotas ni saltos)', () => {
  const base: GraficaSpec = { funciones: [], vista: { x: [-5, 5], y: [-5, 5] }, descripcion: '' }

  it('1/x se parte en x = 0', () => {
    const s = segmentos({ expr: '1/x', color: 'azul', etiqueta: '', discontinuidades: [0] }, base)
    expect(s).toHaveLength(2)
    expect(s[0].dominio[1]).toBeLessThan(0)
    expect(s[1].dominio[0]).toBeGreaterThan(0)
  })

  it('sqrt(x) solo se dibuja donde existe', () => {
    const s = segmentos({ expr: 'sqrt(x)', color: 'azul', etiqueta: '' }, base)
    expect(s).toHaveLength(1)
    expect(s[0].dominio[0]).toBeGreaterThanOrEqual(0)
  })

  it('una función por tramos da un segmento por tramo', () => {
    const s = segmentos(
      { tramos: [{ expr: '2 - x', dominio: [-3, 1] }, { expr: 'x^2', dominio: [1, 3] }], color: 'azul', etiqueta: '' },
      base,
    )
    expect(s.map((x) => x.dominio)).toEqual([
      [-3, 1],
      [1, 3],
    ])
  })
})

describe('validarGrafica detecta errores (control negativo)', () => {
  it('sin descripción, color repetido o expresión rota', () => {
    const errores = validarGrafica({
      funciones: [
        { expr: 'x^2', color: 'azul', etiqueta: 'a' },
        { expr: 'sqrt(', color: 'azul', etiqueta: 'b' },
      ],
      vista: { x: [-1, 1], y: [-1, 1] },
    })
    expect(errores.join(' ')).toMatch(/descripcion/)
    expect(errores.join(' ')).toMatch(/ya lo usa/)
    expect(errores.join(' ')).toMatch(/mathjs no entiende/)
  })
})
