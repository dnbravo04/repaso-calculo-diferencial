import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useProgreso } from '../lib/almacen'
import { diasEntre, fechaLocal } from '../lib/progreso'
import {
  diasParaFinal,
  entradasAtrasadas,
  entradasDeHoy,
  entradasEnRojo,
  esDiaDeRepaso,
  proximoDia,
} from '../lib/plan'
import ListaEntradas, { fechaCorta } from './ListaEntradas'

const fechaLarga = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })

export default function Hoy() {
  const progreso = useProgreso()
  const [params] = useSearchParams()
  // `#/?hoy=2026-11-23` permite ver cómo se verá otro día del plan.
  const forzada = params.get('hoy')
  const hoy = forzada && /^\d{4}-\d{2}-\d{2}$/.test(forzada) ? forzada : fechaLocal(new Date())

  useEffect(() => {
    document.title = 'Hoy · Bitácora'
  }, [])

  const dias = diasParaFinal(hoy)
  const deHoy = entradasDeHoy(hoy)
  const atrasadas = entradasAtrasadas(hoy, progreso)
  const proximo = deHoy.length === 0 ? proximoDia(hoy) : null
  const repaso = esDiaDeRepaso(hoy)
  const rojas = entradasEnRojo(progreso)

  return (
    <div>
      <p className="text-sm text-stone-500 first-letter:uppercase dark:text-stone-400">
        {fechaLarga(hoy)}
        {forzada && ' (fecha simulada)'}
      </p>
      <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Hoy</h1>

      <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
        {dias > 1 && (
          <p className="text-lg">
            Faltan <strong className="text-3xl tabular-nums">{dias}</strong> días para el final.
          </p>
        )}
        {dias === 1 && <p className="text-lg">El final es <strong>mañana</strong>.</p>}
        {dias === 0 && <p className="text-lg">El final es <strong>hoy</strong>.</p>}
        {dias < 0 && <p className="text-lg">El final ya pasó.</p>}
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">Viernes 11 de diciembre de 2026, 2 p. m.</p>
      </div>

      {repaso && (
        <section className="mt-8">
          <h2 className="mb-2 text-lg font-bold">Hoy toca repaso</h2>
          <p className="mb-3 text-stone-700 dark:text-stone-300">
            {rojas.length > 0
              ? `Tienes ${rojas.length} ${rojas.length === 1 ? 'entrada' : 'entradas'} en 🔴. Empieza por ahí.`
              : 'No tienes entradas en 🔴. Repasa las que estén en 🟡.'}
          </p>
          {rojas.length > 0 && <ListaEntradas entradas={rojas} />}
          <Link to="/repaso" className="mt-3 inline-block text-sm text-teal-700 hover:underline dark:text-teal-400">
            Abrir Modo repaso →
          </Link>
        </section>
      )}

      {!repaso && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold">Toca hoy</h2>
          {deHoy.length > 0 ? (
            <ListaEntradas entradas={deHoy} />
          ) : (
            <>
              <p className="mb-3 text-stone-700 dark:text-stone-300">Hoy no hay entradas en el plan.</p>
              {proximo && (
                <>
                  <p className="mb-2 text-sm text-stone-600 dark:text-stone-400">
                    Lo siguiente es el <span className="font-semibold">{fechaLarga(proximo.fecha)}</span>:
                  </p>
                  <ListaEntradas entradas={proximo.entradas} />
                </>
              )}
            </>
          )}
        </section>
      )}

      {atrasadas.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-1 text-lg font-bold">Atrasadas ({atrasadas.length})</h2>
          <p className="mb-3 text-sm text-stone-600 dark:text-stone-400">
            Su día del plan ya pasó y todavía no están marcadas como pasadas al cuaderno.
          </p>
          <ListaEntradas
            entradas={atrasadas}
            detalle={(e) => {
              const d = diasEntre(e.plan, hoy)
              return `Tocaba el ${fechaCorta(e.plan)} · hace ${d} ${d === 1 ? 'día' : 'días'}`
            }}
          />
        </section>
      )}
    </div>
  )
}
