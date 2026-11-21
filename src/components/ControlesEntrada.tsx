import { acciones, useProgreso } from '../lib/almacen'
import { SEMAFOROS, estadoDe } from '../lib/progreso'

const COLORES = {
  verde: 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
  amarillo: 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100',
  rojo: 'border-red-600 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100',
} as const

/** Semáforo de la entrada y casilla "Pasada al cuaderno". */
export default function ControlesEntrada({ id }: { id: string }) {
  const progreso = useProgreso()
  const { semaforo, cuaderno } = estadoDe(progreso, id)

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 print:hidden">
      <fieldset className="flex items-center gap-2">
        <legend className="sr-only">Semáforo</legend>
        <span className="text-sm text-stone-600 dark:text-stone-400">Semáforo:</span>
        {SEMAFOROS.map((s) => {
          const activo = semaforo === s.valor
          return (
            <button
              key={s.valor}
              type="button"
              aria-pressed={activo}
              title={activo ? 'Toca otra vez para quitarlo' : undefined}
              onClick={() => acciones.semaforo(id, activo ? null : s.valor)}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                activo
                  ? `${COLORES[s.valor]} font-semibold`
                  : 'border-stone-300 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800'
              }`}
            >
              <span aria-hidden="true">{s.emoji}</span> {s.nombre}
            </button>
          )
        })}
      </fieldset>
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={cuaderno}
          onChange={(ev) => acciones.cuaderno(id, ev.target.checked)}
          className="size-4 accent-teal-700"
        />
        Pasada al cuaderno
      </label>
    </div>
  )
}
