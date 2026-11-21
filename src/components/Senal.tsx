import { SEMAFOROS, type Semaforo } from '../lib/progreso'

/** Semáforo + marca de cuaderno, compacto (índice lateral y listas). */
export default function Senal({ semaforo, cuaderno }: { semaforo: Semaforo | null; cuaderno: boolean }) {
  const s = SEMAFOROS.find((x) => x.valor === semaforo)
  const descripcion = [s ? `semáforo ${s.emoji} ${s.nombre}` : 'sin semáforo', cuaderno ? 'pasada al cuaderno' : null]
    .filter(Boolean)
    .join(', ')
  return (
    <span className="flex shrink-0 items-center gap-1 text-xs leading-5" title={descripcion}>
      <span className="sr-only">{descripcion}</span>
      <span aria-hidden="true" className={s ? '' : 'opacity-30 grayscale'}>
        {s ? s.emoji : '⚪'}
      </span>
      <span aria-hidden="true" className={cuaderno ? 'text-teal-700 dark:text-teal-400' : 'invisible'}>
        ✎
      </span>
    </span>
  )
}
