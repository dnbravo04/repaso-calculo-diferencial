import { useEffect, useMemo, useState } from 'react'
import type { GraficaSpec, PuntoSpec } from '../lib/grafica'
import {
  BASES,
  asintotasG,
  dominioG,
  imagenG,
  mathjsG,
  secuencia,
  texConjunto,
  texG,
  texRacional,
  texSim,
  transformarPunto,
  valor,
  type Base,
  type Parametros,
} from '../lib/transformaciones'
import { Leyenda } from './Grafica'
import LienzoMafs from './LienzoMafs'
import Markdown from './Markdown'
import TextoMat from './TextoMat'

const INICIAL: Parametros = { A: 1, B: 1, C: 0, D: 0 }
const LETRAS = ['P', 'Q', 'R']

export default function Explorador() {
  const [baseId, setBaseId] = useState('raiz')
  const [p, setP] = useState<Parametros>(INICIAL)
  const base = BASES.find((b) => b.id === baseId)!

  useEffect(() => {
    document.title = 'Explorador de transformaciones · Bitácora'
  }, [])

  const cambiarBase = (id: string) => {
    const nueva = BASES.find((b) => b.id === id)!
    // C cambia de unidad (cuartos de π en las trigonométricas): se reinicia.
    if (!!nueva.trig !== !!base.trig) setP((q) => ({ ...q, C: 0 }))
    setBaseId(id)
  }

  const spec = useMemo(() => construirGrafica(base, p), [base, p])
  const pasos = secuencia(base, p)
  const puntos = base.puntos.map((pt) => [pt, transformarPunto(base, p, pt)] as const)

  return (
    <div className="explorador">
      <h1 className="text-2xl font-bold sm:text-3xl">Explorador de transformaciones</h1>
      <p className="mt-2 text-stone-700 dark:text-stone-300">
        <TextoMat>{'Elige $f$ y mueve $A$, $B$, $C$ y $D$ en $g(x) = A\\,f\\big(B(x - C)\\big) + D$. La $f$ queda en gris y la $g$ en azul.'}</TextoMat>
      </p>

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-semibold"><TextoMat>{"Función base $f$"}</TextoMat></legend>
        <div className="flex flex-wrap gap-2">
          {BASES.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={b.id === baseId}
              onClick={() => cambiarBase(b.id)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                b.id === baseId
                  ? 'border-teal-700 bg-teal-50 font-semibold dark:border-teal-400 dark:bg-teal-950'
                  : 'border-stone-300 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800'
              }`}
            >
              <TextoMat>{`$${b.nombre}$`}</TextoMat>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Deslizador letra="A" valor={p.A} min={-4} max={4} paso={0.25} sinCero tex={texRacional(p.A)} onChange={(A) => setP({ ...p, A })} />
        <Deslizador letra="B" valor={p.B} min={-4} max={4} paso={0.25} sinCero tex={texRacional(p.B)} onChange={(B) => setP({ ...p, B })} />
        <Deslizador
          letra="C"
          valor={p.C}
          min={base.trig ? -8 : -6}
          max={base.trig ? 8 : 6}
          paso={base.trig ? 1 : 0.5}
          tex={texSim(base.trig ? { r: 0, p: p.C / 4, e: 0, ie: 0 } : { r: p.C, p: 0, e: 0, ie: 0 })}
          nota={base.trig ? 'en pasos de π/4' : undefined}
          onChange={(C) => setP({ ...p, C })}
        />
        <Deslizador letra="D" valor={p.D} min={-5} max={5} paso={0.5} tex={texRacional(p.D)} onChange={(D) => setP({ ...p, D })} />
      </div>
      <button
        type="button"
        onClick={() => setP(INICIAL)}
        className="mt-3 text-sm text-teal-700 hover:underline dark:text-teal-400"
      >
        Volver a A = 1, B = 1, C = 0, D = 0
      </button>

      <div className="contenido mt-5 overflow-x-auto text-lg">
        <TextoMat>{`$g(x) = ${texG(base, p)}$`}</TextoMat>
      </div>

      <figure className="grafica my-4 rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
        <Leyenda g={spec} />
        <div className="overflow-hidden rounded-md">
          <LienzoMafs g={spec} />
        </div>
        <figcaption className="contenido prose prose-stone prose-sm dark:prose-invert mt-3 max-w-none">
          <Markdown>{spec.descripcion}</Markdown>
        </figcaption>
      </figure>

      <section className="mt-8">
        <h2 className="mb-1 text-lg font-bold"><TextoMat>{"Secuencia de $f$ a $g$"}</TextoMat></h2>
        <p className="mb-3 text-sm text-stone-600 dark:text-stone-400">Siempre en el orden B, C, A, D.</p>
        <ol className="space-y-3">
          {pasos.map((paso, i) => (
            <li key={paso.letra} className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
              <p className="text-sm font-semibold text-teal-800 dark:text-teal-300">
                {i + 1}. {paso.letra}
              </p>
              <div className="contenido mt-1 overflow-x-auto">
                <TextoMat>{`$${paso.formula}$`}</TextoMat>
              </div>
              <p className="mt-1 text-sm">
                <TextoMat>{paso.texto}</TextoMat>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="mb-1 text-lg font-bold">Regla de los puntos</h2>
        <div className="contenido mb-3 overflow-x-auto">
          <TextoMat>{`$(u, v) \\longmapsto \\left(\\dfrac{u}{B} + C,\\ A v + D\\right) = \\left(\\dfrac{u}{${texRacional(p.B)}}${mas(base.trig ? texSim({ r: 0, p: p.C / 4, e: 0, ie: 0 }) : texRacional(p.C))},\\ ${texRacional(p.A)}\\,v${mas(texRacional(p.D))}\\right)$`}</TextoMat>
        </div>
        <div className="tabla-scroll">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-300 dark:border-stone-700">
                <th className="py-2 pr-4"><TextoMat>{"Punto de $f$"}</TextoMat></th>
                <th className="py-2"><TextoMat>{"Punto de $g$"}</TextoMat></th>
              </tr>
            </thead>
            <tbody>
              {puntos.map(([[u, v], [x, y]], i) => (
                <tr key={i} className="border-b border-stone-200 dark:border-stone-800">
                  <td className="py-2 pr-4">
                    <TextoMat>{`$${LETRAS[i]} = \\left(${texSim(u)}, ${texSim(v)}\\right)$`}</TextoMat>
                  </td>
                  <td className="py-2">
                    <TextoMat>{`$${LETRAS[i]}' = \\left(${texSim(x)}, ${texSim(y)}\\right)$`}</TextoMat>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

/** " + a" o " - a" según el signo del TeX (y nada si es 0). */
const mas = (tex: string) => (tex === '0' ? '' : tex.startsWith('-') ? ` - ${tex.slice(1)}` : ` + ${tex}`)

function Deslizador({
  letra,
  valor: v,
  min,
  max,
  paso,
  tex,
  sinCero,
  nota,
  onChange,
}: {
  letra: string
  valor: number
  min: number
  max: number
  paso: number
  tex: string
  sinCero?: boolean
  nota?: string
  onChange: (v: number) => void
}) {
  return (
    <label className="block rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
      <span className="flex items-baseline justify-between text-sm">
        <span className="font-semibold">
          {letra}
          {nota && <span className="ml-2 font-normal text-stone-500 dark:text-stone-400">({nota})</span>}
        </span>
        <span className="text-base">
          <TextoMat>{`$${letra} = ${tex}$`}</TextoMat>
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={paso}
        value={v}
        aria-valuetext={`${letra} = ${v}`}
        onChange={(ev) => {
          let n = Number(ev.target.value)
          // A y B no pueden ser 0: al cruzar el 0 se salta al otro lado.
          if (sinCero && n === 0) n = v > 0 ? -paso : paso
          onChange(n)
        }}
        className="mt-2 w-full accent-teal-700"
      />
    </label>
  )
}

function construirGrafica(base: Base, p: Parametros): GraficaSpec {
  const vistaX: [number, number] = base.trig ? [-2 * Math.PI - 0.3, 2 * Math.PI + 0.3] : [-8, 8]
  const vistaY: [number, number] = [-6, 6]
  const asint = asintotasG(base, p)
  const dom = dominioG(base, p)
  const domG = dom.length === 1 && (Number.isFinite(dom[0].a) || Number.isFinite(dom[0].b))
    ? ([Math.max(dom[0].a, vistaX[0] - 1), Math.min(dom[0].b, vistaX[1] + 1)] as [number, number])
    : undefined
  const domF = base.dom.length === 1 && Number.isFinite(base.dom[0].a) ? ([base.dom[0].a, vistaX[1] + 1] as [number, number]) : undefined

  const puntos: PuntoSpec[] = base.puntos.flatMap(([u, v], i) => {
    const [x, y] = transformarPunto(base, p, [u, v])
    return [
      { x: valor(u), y: valor(v), color: 'gris' as const, etiqueta: LETRAS[i], posicion: 'no' as const },
      { x: valor(x), y: valor(y), etiqueta: `${LETRAS[i]}'`, posicion: 'ne' as const },
    ]
  })

  const asintotas = [
    ...(asint.vertical ? [{ tipo: 'vertical' as const, valor: valor(asint.vertical) }] : []),
    ...(asint.horizontal !== undefined ? [{ tipo: 'horizontal' as const, valor: asint.horizontal }] : []),
  ]

  const txtAsint = [
    asint.vertical ? `vertical $x = ${texSim(asint.vertical)}$` : '',
    asint.horizontal !== undefined ? `horizontal $y = ${texRacional(asint.horizontal)}$` : '',
  ].filter(Boolean)

  const cambios = secuencia(base, p)
    .map((s) => s.texto)
    .filter((t) => !t.startsWith('$'))
    .map((t) => t.replace(/\.$/, '').replace(/^./, (c) => c.toLowerCase()))

  const descripcion = [
    `El eje horizontal es $x${base.trig ? '$ en radianes' : '$'} y el vertical es $y$.`,
    `La curva gris es $f(x) = ${base.nombre}$ y la azul es $g(x) = ${texG(base, p)}$.`,
    `Los puntos $P$, $Q$ y $R$ de $f$ pasan a $P'$, $Q'$ y $R'$ de $g$ (la tabla de abajo da sus coordenadas exactas).`,
    cambios.length ? `Qué cambió: ${cambios.join('; ')}.` : 'Con $A = 1$, $B = 1$, $C = 0$ y $D = 0$, $g$ es igual a $f$.',
    txtAsint.length ? `Asíntotas de $g$ (punteadas): ${txtAsint.join(' y ')}.` : '',
    `Se lee $\\operatorname{Dom}(f) = ${texConjunto(base.dom)}$, $\\operatorname{Img}(f) = ${texConjunto(base.img)}$, $\\operatorname{Dom}(g) = ${texConjunto(dom)}$ e $\\operatorname{Img}(g) = ${texConjunto(imagenG(base, p))}$.`,
  ]
    .filter(Boolean)
    .join(' ')

  return {
    funciones: [
      { expr: base.mathjs, color: 'gris', etiqueta: `$f(x) = ${base.nombre}$`, dominio: domF, discontinuidades: base.asintotaV !== undefined ? [base.asintotaV] : undefined },
      { expr: mathjsG(base, p), color: 'azul', etiqueta: `$g(x) = ${texG(base, p)}$`, dominio: domG },
    ],
    puntos,
    asintotas,
    vista: { x: vistaX, y: vistaY },
    radianes: base.trig,
    alto: 360,
    descripcion,
  }
}
