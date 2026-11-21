import { NavLink } from 'react-router'
import { GRUPOS, INDICE, etiquetaEntrada } from '../lib/indice'
import { disponible } from '../lib/contenido'
import { useProgreso } from '../lib/almacen'
import { estadoDe } from '../lib/progreso'
import { entradasEnRojo } from '../lib/plan'
import Senal from './Senal'
import Cuenta from './Cuenta'
import BarraSemaforo from './visual/BarraSemaforo'
import { contar } from '../lib/resumen'

const claseItem = (activo: boolean) =>
  `flex items-start gap-2 rounded-md px-3 py-1.5 leading-snug ${
    activo
      ? 'bg-teal-100 font-medium text-teal-900 dark:bg-teal-900/40 dark:text-teal-100'
      : 'hover:bg-stone-200/60 dark:hover:bg-stone-800'
  }`

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const progreso = useProgreso()
  const rojas = entradasEnRojo(progreso).length

  return (
    <nav aria-label="Índice de entradas" className="text-sm">
      <div className="mb-4 px-1">
        <Cuenta />
      </div>
      <ul className="mb-5 space-y-0.5">
        <li>
          <NavLink to="/" end onClick={onNavigate} className={({ isActive }) => claseItem(isActive)}>
            Hoy
          </NavLink>
        </li>
        <li>
          <NavLink to="/progreso" onClick={onNavigate} className={({ isActive }) => claseItem(isActive)}>
            Mi progreso
          </NavLink>
        </li>
        <li>
          <NavLink to="/repaso" onClick={onNavigate} className={({ isActive }) => claseItem(isActive)}>
            <span className="flex-1">Modo repaso</span>
            {rojas > 0 && (
              <span className="rounded-full bg-red-100 px-2 text-xs font-semibold text-red-900 dark:bg-red-950 dark:text-red-100">
                {rojas} <span className="sr-only">en rojo</span>
              </span>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/explorador" onClick={onNavigate} className={({ isActive }) => claseItem(isActive)}>
            Explorador de transformaciones
          </NavLink>
        </li>
      </ul>

      {GRUPOS.map((g) => (
        <section key={g.unidad} className="mb-5">
          <h2 className="mb-1 px-3 text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            {g.nombre}
          </h2>
          <div className="mb-2 px-3">
            <BarraSemaforo
              conteo={contar(INDICE.filter((e) => e.unidad === g.unidad), progreso)}
              alto="mini"
              nombre={`Semáforo de ${g.nombre}`}
            />
          </div>
          <ul>
            {INDICE.filter((e) => e.unidad === g.unidad).map((e) => {
              const ok = disponible(e.id)
              const estado = estadoDe(progreso, e.id)
              const contenido = (
                <>
                  <span className="w-14 shrink-0 whitespace-nowrap font-mono text-xs leading-5 text-stone-500 dark:text-stone-400">
                    {etiquetaEntrada(e.id)}
                  </span>
                  <span className="min-w-0 flex-1">{e.titulo}</span>
                  <Senal semaforo={estado.semaforo} cuaderno={estado.cuaderno} />
                </>
              )
              return (
                <li key={e.id}>
                  {ok ? (
                    <NavLink to={`/entrada/${e.id}`} onClick={onNavigate} className={({ isActive }) => claseItem(isActive)}>
                      {contenido}
                    </NavLink>
                  ) : (
                    <span
                      className="flex items-start gap-2 px-3 py-1.5 leading-snug text-stone-400 dark:text-stone-600"
                      title="Se escribe en la Fase 4"
                    >
                      {contenido}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </nav>
  )
}
