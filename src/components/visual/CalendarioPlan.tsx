import { Link } from 'react-router'
import { FECHA_REPASO, etiquetaEntrada } from '../../lib/indice'
import { DIA_FINAL } from '../../lib/plan'
import type { Progreso } from '../../lib/progreso'
import { PRIMER_DIA, diasDelPlan, type DiaPlan } from '../../lib/resumen'
import Calendario, { NumeroDia, fechaBreve } from './Calendario'
import { usePista } from './Pista'

const ESTILO: Record<DiaPlan['estado'], string> = {
  hecho: 'border-transparent text-white',
  atrasado: 'border-[var(--sem-rojo)] bg-white dark:bg-stone-900',
  pendiente: 'border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-900',
  libre: 'border-transparent bg-stone-100 text-stone-500 dark:bg-stone-800/60 dark:text-stone-400',
}

/** El plan de estudio como calendario: cada día muestra cuánto de lo suyo ya pasaste al cuaderno. */
export default function CalendarioPlan({ hoy, progreso }: { hoy: string; progreso: Progreso }) {
  const dias = new Map(diasDelPlan(hoy, progreso).map((d) => [d.fecha, d]))
  const { caja, props, elemento } = usePista()

  const celda = (f: string) => {
    const d = dias.get(f)!
    const esHoy = f === hoy
    const especial = f === DIA_FINAL ? '🏁' : f === FECHA_REPASO ? 'R' : null
    const frac = d.entradas.length ? d.hechas / d.entradas.length : 0
    const marca = d.estado === 'hecho' ? '✓' : d.estado === 'atrasado' ? '!' : especial

    const detalle = (
      <>
        <span className="font-semibold first-letter:uppercase">{fechaBreve(f)}</span>
        {esHoy && ' · hoy'}
        <br />
        {f === DIA_FINAL
          ? 'Examen final, 2 p. m.'
          : f === FECHA_REPASO
            ? 'Día de repaso: las entradas en 🔴'
            : d.entradas.length === 0
              ? 'Sin entradas'
              : d.entradas.map((e) => `${etiquetaEntrada(e.id)} ${e.titulo}`).join(' · ')}
        {d.entradas.length > 0 && (
          <>
            <br />
            {d.hechas} de {d.entradas.length} en el cuaderno
            {d.estado === 'atrasado' && ' · atrasado'}
          </>
        )}
      </>
    )

    const contenido = (
      <>
        <span className="text-xs font-semibold tabular-nums leading-none sm:text-sm">
          <NumeroDia fecha={f} desde={PRIMER_DIA} />
        </span>
        <span
          aria-hidden="true"
          className={`text-sm font-bold leading-none ${d.estado === 'atrasado' ? 'text-[var(--sem-rojo)]' : ''}`}
        >
          {marca}
        </span>
        {d.estado !== 'hecho' && frac > 0 && (
          <span
            aria-hidden="true"
            className="absolute inset-x-1 bottom-1 h-1 rounded-full bg-[var(--cuaderno-pista)]"
          >
            <span className="block h-full rounded-full bg-[var(--cuaderno)]" style={{ width: `${frac * 100}%` }} />
          </span>
        )}
      </>
    )

    const clase = `relative flex aspect-square w-full flex-col items-center justify-center gap-0.5 rounded-lg border-2 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${ESTILO[d.estado]} ${
      esHoy ? 'ring-2 ring-teal-600 ring-offset-2 ring-offset-white dark:ring-teal-400 dark:ring-offset-stone-900' : ''
    }`
    const fondo = d.estado === 'hecho' ? { background: 'var(--cuaderno)' } : undefined
    const nombre = `${fechaBreve(f)}${esHoy ? ', hoy' : ''}: ${
      d.entradas.length ? `${d.hechas} de ${d.entradas.length} en el cuaderno` : especial === '🏁' ? 'examen final' : especial ? 'repaso' : 'sin entradas'
    }`

    // Un día con una sola entrada lleva directo a ella; si tiene varias, a la primera.
    return d.entradas.length > 0 ? (
      <Link to={`/entrada/${d.entradas[0].id}`} className={clase} style={fondo} aria-label={nombre} {...props(detalle)}>
        {contenido}
      </Link>
    ) : (
      <div tabIndex={0} className={clase} style={fondo} aria-label={nombre} {...props(detalle)}>
        {contenido}
      </div>
    )
  }

  return (
    <div ref={caja} className="relative max-w-md">
      <Calendario desde={PRIMER_DIA} hasta={DIA_FINAL} celda={celda} />
      {elemento}
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600 dark:text-stone-400" aria-label="Leyenda">
        <li className="flex items-center gap-1.5">
          <span className="grid size-4 place-items-center rounded text-[10px] font-bold text-white" style={{ background: 'var(--cuaderno)' }} aria-hidden="true">
            ✓
          </span>
          Todo al cuaderno
        </li>
        <li className="flex items-center gap-1.5">
          <span className="grid size-4 place-items-center rounded border-2 border-[var(--sem-rojo)] text-[10px] font-bold text-[var(--sem-rojo)]" aria-hidden="true">
            !
          </span>
          Atrasado
        </li>
        <li className="flex items-center gap-1.5">
          <span className="relative size-4 rounded border-2 border-stone-300 dark:border-stone-700" aria-hidden="true">
            <span className="absolute inset-x-0.5 bottom-0.5 h-0.5 rounded-full bg-[var(--cuaderno)]" />
          </span>
          Pendiente (la rayita es lo que llevas)
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-4 rounded ring-2 ring-teal-600 dark:ring-teal-400" aria-hidden="true" />
          Hoy
        </li>
        <li>R = repaso · 🏁 = final</li>
      </ul>
    </div>
  )
}
