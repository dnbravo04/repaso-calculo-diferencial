import { useState } from 'react'
import { num } from '../../lib/grafica'
import { candidatosRacionales, numeroTex, polinomioTex, ruffini, type RuffiniSpec } from '../../lib/interactivo'
import TextoMat from '../TextoMat'
import { Marco } from './comun'

// Colores de las tres operaciones (mismos tokens que las gráficas).
const BAJAR = 'var(--g-verde)'
const MULTIPLICAR = 'var(--g-naranja)'
const SUMAR = 'var(--g-azul)'

const t = (v: number) => `$${numeroTex(v)}$`
const entreParentesis = (v: number) => (v < 0 ? `(${numeroTex(v)})` : numeroTex(v))

/**
 * Tabla de Ruffini paso a paso. Paso 1: bajar el primer coeficiente. Después, por cada columna,
 * dos pasos: multiplicar por a (fila del medio) y sumar (fila de abajo). El último número es el residuo.
 */
export default function Ruffini({ spec }: { spec: RuffiniSpec }) {
  const coefs = spec.coeficientes.map(num)
  const [a, setA] = useState(num(spec.raiz))
  const [paso, setPaso] = useState(0)
  const n = coefs.length
  const total = 2 * n - 1
  const tabla = ruffini(coefs, a)
  const candidatos = candidatosRacionales(coefs)
  const fin = paso >= total

  // ¿Qué se ve en cada celda? Paso 1 → resultados[0]; paso 2k → productos[k]; paso 2k+1 → resultados[k].
  const verProducto = (k: number) => k >= 1 && paso >= 2 * k
  const verResultado = (k: number) => (k === 0 ? paso >= 1 : paso >= 2 * k + 1)
  const actual = paso === 0 ? null : paso === 1 ? { tipo: 'bajar', k: 0 } : paso % 2 === 0 ? { tipo: 'multiplicar', k: paso / 2 } : { tipo: 'sumar', k: (paso - 1) / 2 }

  let explicacion = 'Escribe los coeficientes en la fila de arriba y la raíz a la izquierda. Pulsa «Siguiente paso».'
  if (actual?.tipo === 'bajar') explicacion = `Bajamos el primer coeficiente, ${t(coefs[0])}, tal cual.`
  if (actual?.tipo === 'multiplicar') {
    const k = actual.k
    explicacion = `Multiplicamos $${numeroTex(tabla.resultados[k - 1])} \\cdot ${entreParentesis(a)} = ${numeroTex(tabla.productos[k]!)}$ y lo escribimos debajo de ${t(coefs[k])}.`
  }
  if (actual?.tipo === 'sumar') {
    const k = actual.k
    explicacion = `Sumamos la columna: $${numeroTex(coefs[k])} + ${entreParentesis(tabla.productos[k]!)} = ${numeroTex(tabla.resultados[k])}$.${
      k === n - 1 ? ' Es la última columna: ese número es el residuo.' : ''
    }`
  }

  const elegir = (v: number) => {
    setA(v)
    setPaso(total)
  }

  const resaltar = (fila: 'producto' | 'resultado', k: number) => {
    if (!actual || actual.k !== k) return undefined
    if (fila === 'resultado' && (actual.tipo === 'bajar' || actual.tipo === 'sumar')) return actual.tipo === 'bajar' ? BAJAR : SUMAR
    if (fila === 'producto' && actual.tipo === 'multiplicar') return MULTIPLICAR
    return undefined
  }

  const celda = 'flex h-11 min-w-11 items-center justify-center px-1.5 text-base tabular-nums sm:min-w-14'

  return (
    <Marco titulo="regla de Ruffini paso a paso" descripcion={spec.descripcion}>
      <p className="mb-3 text-sm">
        <TextoMat>{`$P(x) = ${polinomioTex(coefs)}$ dividido entre $${a < 0 ? `x + ${numeroTex(-a)}` : a === 0 ? 'x' : `x - ${numeroTex(a)}`}$, o sea $a = ${numeroTex(a)}$.`}</TextoMat>
      </p>

      <div className="overflow-x-auto">
        <div
          className="mx-auto grid w-max rounded-lg bg-stone-50 p-2 dark:bg-stone-800/60"
          style={{ gridTemplateColumns: `auto repeat(${n}, auto)` }}
          role="table"
          aria-label="Tabla de Ruffini"
        >
          {/* Fila 1: coeficientes */}
          <div className={celda} role="cell" />
          {coefs.map((c, k) => (
            <div key={`c${k}`} role="cell" className={`${celda} font-semibold`}>
              <TextoMat>{t(c)}</TextoMat>
            </div>
          ))}
          {/* Fila 2: raíz y productos */}
          <div role="cell" className={`${celda} border-r-2 border-stone-500 font-bold text-teal-700 dark:text-teal-300`}>
            <TextoMat>{t(a)}</TextoMat>
          </div>
          {coefs.map((_, k) => {
            const color = resaltar('producto', k)
            return (
              <div
                key={`p${k}`}
                role="cell"
                className={`${celda} rounded-md transition-colors`}
                style={color ? { boxShadow: `inset 0 0 0 2px ${color}` } : undefined}
              >
                {verProducto(k) && <TextoMat>{t(tabla.productos[k]!)}</TextoMat>}
              </div>
            )
          })}
          {/* Fila 3: resultados */}
          <div role="cell" className={`${celda} border-t-2 border-stone-500`} />
          {coefs.map((_, k) => {
            const color = resaltar('resultado', k)
            const esResiduo = k === n - 1
            return (
              <div
                key={`r${k}`}
                role="cell"
                className={`${celda} border-t-2 border-stone-500 font-semibold transition-colors ${
                  esResiduo && verResultado(k)
                    ? tabla.residuo === 0
                      ? 'rounded-md bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100'
                      : 'rounded-md bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100'
                    : ''
                }`}
                style={color ? { boxShadow: `inset 0 0 0 2px ${color}` } : undefined}
              >
                {verResultado(k) && <TextoMat>{t(tabla.resultados[k])}</TextoMat>}
              </div>
            )
          })}
        </div>
      </div>

      <p className="mt-3 min-h-12 rounded-md bg-stone-100 px-3 py-2 text-sm dark:bg-stone-800" aria-live="polite">
        <span className="mr-1 font-semibold">
          Paso {paso} de {total}:
        </span>
        <TextoMat>{explicacion}</TextoMat>
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPaso((p) => Math.max(0, p - 1))}
          disabled={paso === 0}
          className="rounded-md border border-stone-300 px-3 py-1.5 text-sm font-medium hover:bg-stone-100 disabled:opacity-40 dark:border-stone-700 dark:hover:bg-stone-800"
        >
          ◀ Anterior
        </button>
        <button
          type="button"
          onClick={() => setPaso((p) => Math.min(total, p + 1))}
          disabled={fin}
          className="rounded-md bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-40"
        >
          Siguiente paso ▶
        </button>
        <button
          type="button"
          onClick={() => setPaso(fin ? 0 : total)}
          className="rounded-md border border-stone-300 px-3 py-1.5 text-sm font-medium hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
        >
          {fin ? 'Empezar de nuevo' : 'Ver todo'}
        </button>
      </div>

      {fin && (
        <div className="mt-3 rounded-md border border-stone-200 p-3 text-sm dark:border-stone-700">
          <p>
            <TextoMat>{`Cociente: $Q(x) = ${polinomioTex(tabla.cociente)}$ (un grado menos). Residuo: $r = ${numeroTex(tabla.residuo)} = P(${numeroTex(a)})$.`}</TextoMat>
          </p>
          <p className={`mt-1 font-semibold ${tabla.residuo === 0 ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
            {tabla.residuo === 0 ? (
              <TextoMat>{`Residuo 0: $x = ${numeroTex(a)}$ es raíz y $P(x) = \\big(x ${a < 0 ? '+' : '-'} ${numeroTex(Math.abs(a))}\\big)\\big(${polinomioTex(tabla.cociente)}\\big)$.`}</TextoMat>
            ) : (
              <TextoMat>{`Residuo distinto de 0: $x = ${numeroTex(a)}$ no es raíz. Prueba otro candidato.`}</TextoMat>
            )}
          </p>
        </div>
      )}

      {candidatos.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-sm font-medium">
            <TextoMat>{'Prueba otra raíz candidata $\\pm\\tfrac{p}{q}$:'}</TextoMat>
          </p>
          <div className="flex flex-wrap gap-1" role="group" aria-label="Raíces candidatas">
            {candidatos.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => elegir(v)}
                aria-pressed={Math.abs(v - a) < 1e-12}
                className={`rounded-full border px-2.5 py-0.5 text-xs ${
                  Math.abs(v - a) < 1e-12
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : 'border-stone-300 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800'
                }`}
              >
                <TextoMat>{t(v)}</TextoMat>
              </button>
            ))}
          </div>
        </div>
      )}
    </Marco>
  )
}
