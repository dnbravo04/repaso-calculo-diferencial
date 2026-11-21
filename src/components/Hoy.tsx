import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useProgreso } from '../lib/almacen'
import { diasEntre, fechaLocal } from '../lib/progreso'
import { INDICE } from '../lib/indice'
import { PRIMER_DIA, contar, racha } from '../lib/resumen'
import Anillo from './visual/Anillo'
import BarraSemaforo, { LeyendaSemaforo } from './visual/BarraSemaforo'
import CalendarioPlan from './visual/CalendarioPlan'
import {
  DIA_FINAL,
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
  const conteo = contar(INDICE, progreso)
  const rachaActual = racha(progreso, hoy)
  const totalDias = diasEntre(PRIMER_DIA, DIA_FINAL) + 1
  const diaDelPlan = Math.min(totalDias, Math.max(1, diasEntre(PRIMER_DIA, hoy) + 1))
  const avancePlan = Math.round((diaDelPlan / totalDias) * 100)

  return (
    <div>
      <p className="text-sm text-stone-500 first-letter:uppercase dark:text-stone-400">
        {fechaLarga(hoy)}
        {forzada && ' (fecha simulada)'}
      </p>
      <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Hoy</h1>

      <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="min-w-0">
            {dias > 1 && (
              <p className="text-lg">
                Faltan
                <strong className="mx-2 align-[-0.1em] text-6xl font-bold leading-none text-teal-700 dark:text-teal-400">{dias}</strong>
                días para el final
              </p>
            )}
            {dias === 1 && <p className="text-2xl">El final es <strong>mañana</strong>.</p>}
            {dias === 0 && <p className="text-2xl">El final es <strong>hoy</strong>.</p>}
            {dias < 0 && <p className="text-2xl">El final ya pasó.</p>}
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Viernes 11 de diciembre de 2026, 2 p. m.</p>
            {dias >= 0 && (
              <div className="mt-3 max-w-xs">
                <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-700" aria-hidden="true">
                  <div className="h-full rounded-full bg-teal-600 dark:bg-teal-500" style={{ width: `${avancePlan}%` }} />
                </div>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  Día {diaDelPlan} de {totalDias} del plan
                </p>
              </div>
            )}
            {rachaActual > 0 && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-100">
                <span aria-hidden="true">🔥</span> Racha de {rachaActual} {rachaActual === 1 ? 'día' : 'días'} estudiando
              </p>
            )}
          </div>
          <Anillo valor={conteo.cuaderno} total={conteo.total} rotulo="del curso en el cuaderno" />
        </div>

        <div className="mt-5 border-t border-stone-200 pt-4 dark:border-stone-800">
          <p className="mb-2 text-sm font-semibold">
            Tu semáforo{' '}
            <span className="font-normal text-stone-500 dark:text-stone-400">
              · {conteo.total - conteo.nada} de {conteo.total} entradas marcadas
            </span>
          </p>
          <BarraSemaforo conteo={conteo} alto="alta" nombre="Semáforo de todo el curso" />
          <LeyendaSemaforo conteo={conteo} />
        </div>
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

      <section className="mt-8">
        <h2 className="mb-1 text-lg font-bold">Tu plan, día a día</h2>
        <p className="mb-3 text-sm text-stone-600 dark:text-stone-400">
          Pasa el dedo o el mouse por un día para ver qué toca; tócalo para abrir su primera entrada.
        </p>
        <CalendarioPlan hoy={hoy} progreso={progreso} />
      </section>

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
