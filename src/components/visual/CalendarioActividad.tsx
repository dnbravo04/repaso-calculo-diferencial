import { DIA_FINAL } from '../../lib/plan'
import type { Progreso } from '../../lib/progreso'
import { PRIMER_DIA, actividadPorDia, nivelActividad } from '../../lib/resumen'
import Calendario, { NumeroDia, fechaBreve } from './Calendario'
import { usePista } from './Pista'

const NIVELES = [0, 1, 2, 3, 4]
const RANGOS = ['ninguno', '1–2', '3–5', '6–9', '10 o más']

/** Mapa de calor de la constancia: cuántos cambios hiciste cada día (más oscuro = más). */
export default function CalendarioActividad({ hoy, progreso }: { hoy: string; progreso: Progreso }) {
  const act = actividadPorDia(progreso)
  const { caja, props, elemento } = usePista()
  const fechas = [...act.keys()].sort()
  const desde = fechas[0] && fechas[0] < PRIMER_DIA ? fechas[0] : PRIMER_DIA
  const hasta = hoy > DIA_FINAL ? hoy : DIA_FINAL

  const celda = (f: string) => {
    const n = act.get(f) ?? 0
    const futuro = f > hoy
    const texto = `${fechaBreve(f)}: ${futuro ? 'todavía no llega' : n === 0 ? 'sin cambios' : `${n} ${n === 1 ? 'cambio' : 'cambios'}`}`
    return (
      <div
        tabIndex={futuro ? -1 : 0}
        aria-label={texto}
        className={`flex aspect-square w-full items-center justify-center rounded-md text-[10px] tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
          futuro
            ? 'border border-dashed border-stone-300 text-stone-400 dark:border-stone-700 dark:text-stone-600'
            : nivelActividad(n) >= 3
              ? 'text-white dark:text-stone-900'
              : n === 0
                ? 'border border-stone-300 text-stone-500 dark:border-stone-600 dark:text-stone-400'
                : 'text-stone-800 dark:text-stone-100'
        } ${f === hoy ? 'ring-2 ring-teal-600 ring-offset-1 ring-offset-white dark:ring-teal-400 dark:ring-offset-stone-900' : ''}`}
        style={futuro ? undefined : { background: `var(--act-${nivelActividad(n)})` }}
        {...props(<span className="first-letter:uppercase">{texto}</span>)}
      >
        <span aria-hidden="true">
          <NumeroDia fecha={f} desde={desde} />
        </span>
      </div>
    )
  }

  return (
    <div ref={caja} className="relative">
      <Calendario desde={desde} hasta={hasta} celda={celda} />
      {elemento}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400" aria-label="Leyenda: cambios por día">
        <span>Menos</span>
        {NIVELES.map((n) => (
          <span
            key={n}
            title={`${RANGOS[n]} cambios`}
            className={`inline-block size-3.5 rounded-sm ${n === 0 ? 'border border-stone-300 dark:border-stone-600' : ''}`}
            style={{ background: `var(--act-${n})` }}
          />
        ))}
        <span>Más</span>
      </div>
    </div>
  )
}
