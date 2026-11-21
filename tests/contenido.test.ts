import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import katex from 'katex'
import { INDICE } from '../src/lib/indice'
import {
  SECCIONES_CANONICAS,
  extraerFormulas,
  parsearEntrada,
  quitarCodigo,
  textoSinFormulas,
} from '../src/lib/markdown'
import { KATEX_MACROS } from '../src/lib/katex'

const DIR = join(__dirname, '..', 'src', 'content')
const leer = (archivo: string) => readFileSync(join(DIR, `${archivo}.md`), 'utf8')

// Unidades ya escritas. Las unidades 2–4 se escriben en la Fase 4.
const UNIDADES_ESCRITAS = new Set([0, 1])
const escritas = INDICE.filter((e) => UNIDADES_ESCRITAS.has(e.unidad))
const pendientes = INDICE.filter((e) => !UNIDADES_ESCRITAS.has(e.unidad))

describe('índice y archivos', () => {
  it.each(escritas.map((e) => [e.id, e]))('la entrada %s existe', (_id, e) => {
    expect(existsSync(join(DIR, `${e.archivo}.md`))).toBe(true)
  })

  for (const e of pendientes) {
    if (existsSync(join(DIR, `${e.archivo}.md`))) {
      it(`la entrada ${e.id} existe`, () => expect(true).toBe(true))
    } else {
      it.todo(`la entrada ${e.id} (Fase 4)`)
    }
  }

  it('todo archivo de contenido está en el índice', () => {
    const archivos = readdirSync(DIR).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
    for (const a of archivos) expect(INDICE.map((e) => e.archivo)).toContain(a)
  })

  it.each(escritas.map((e) => [e.id, e]))('el frontmatter de %s coincide con el índice', (_id, e) => {
    const { meta } = parsearEntrada(leer(e.archivo))
    expect(String(meta.id)).toBe(e.id)
    expect(meta.unidad).toBe(e.unidad)
    expect(meta.titulo).toBe(e.titulo)
    expect(meta.taller).toBe(e.taller)
    expect(meta.plan).toBe(e.plan)
  })
})

describe('los detectores funcionan (control negativo)', () => {
  it('encuentra matemática en texto plano y respeta la que está entre $', () => {
    expect(textoSinFormulas('Sea x² ≤ 4 y $x^2 \\leq 4$.')).toMatch(/²/)
    expect(textoSinFormulas('Sea $x^2 \\leq 4$ y $$\\sqrt{x}$$.')).not.toMatch(/\\leq|sqrt/)
  })
  it('el documento exportado original sí tiene texto plano (lo que se convirtió)', () => {
    const original = readFileSync(join(__dirname, '..', 'bitacora-extendida-contenido.md'), 'utf8')
    expect(textoSinFormulas(original)).toMatch(/[²√≤π]/)
  })
  it('extrae fórmulas en línea y en bloque', () => {
    const f = extraerFormulas('a $x$ b\n\n$$\ny\n$$\n')
    expect(f).toEqual([
      { tex: 'y', bloque: true },
      { tex: 'x', bloque: false },
    ])
  })
})

const disponibles = INDICE.filter((e) => existsSync(join(DIR, `${e.archivo}.md`)))

describe.each(disponibles.map((e) => [e.id, e]))('entrada %s', (_id, e) => {
  const md = leer(e.archivo)

  it('tiene las seis secciones en orden', () => {
    const titulos = parsearEntrada(md).secciones.map((s) => s.titulo)
    // Cada sección ### debe ser una de las canónicas ("Método…" puede repetirse).
    const canon = titulos.map((t) => SECCIONES_CANONICAS.find((c) => t === c || (c === 'Método' && t.startsWith('Método'))))
    expect(canon, `títulos: ${titulos.join(' | ')}`).not.toContain(undefined)
    const sinRepetir = canon.filter((c, i) => c !== canon[i - 1])
    expect(sinRepetir).toEqual([...SECCIONES_CANONICAS])
  })

  it('todas las fórmulas compilan con KaTeX', () => {
    for (const f of extraerFormulas(md)) {
      expect(() =>
        katex.renderToString(f.tex, { throwOnError: true, displayMode: f.bloque, macros: { ...KATEX_MACROS } }),
        f.tex,
      ).not.toThrow()
    }
  })

  it('no queda matemática en texto plano', () => {
    const texto = textoSinFormulas(md)
    const prohibidos: [RegExp, string][] = [
      [/²/, '²'],
      [/³/, '³'],
      [/√/, '√'],
      [/≤/, '≤'],
      [/≥/, '≥'],
      [/π/, 'π'],
      [/ sen /, ' sen '],
      // Extras: símbolos que delatan una fórmula sin convertir.
      [/[≠±∞∪∩∈ℝℤ⁻¹⌊⌋→↦∘·]/, 'símbolo matemático'],
      [/−/, 'signo menos unicode'],
      [/\\\[|\\\]/, 'corchete escapado'],
      [/\^/, '^'],
      [/\bsen\b|\bcos\b|\bln\b/, 'función sin $'],
    ]
    const lineas = texto.split('\n')
    for (const [re, nombre] of prohibidos) {
      const malas = lineas.filter((l) => re.test(l))
      expect(malas, `${nombre} fuera de $…$`).toEqual([])
    }
  })

  it('no usa \\sin ni \\sen sin \\operatorname', () => {
    const tex = extraerFormulas(md).map((f) => f.tex).join('\n')
    expect(tex).not.toMatch(/\\sin\b/)
    expect(tex).not.toMatch(/\\sen(h)?\b/)
    expect(tex).not.toMatch(/\\arcsin\b|\\sinh\b/)
  })

  it('los bloques :::paso están balanceados y traen fórmula y justificación', () => {
    const cuerpo = quitarCodigo(md)
    const bloques = [...cuerpo.matchAll(/^:::paso\s*\n([\s\S]*?)^:::\s*$/gm)].map((m) => m[1])
    const aperturas = (cuerpo.match(/^:::paso\s*$/gm) ?? []).length
    expect(bloques.length).toBe(aperturas)
    for (const b of bloques) {
      expect(b, b).toMatch(/\$\$[\s\S]+?\$\$/)
      expect(b.replace(/\$\$[\s\S]+?\$\$/g, '').trim().length, b).toBeGreaterThan(0)
    }
  })
})
