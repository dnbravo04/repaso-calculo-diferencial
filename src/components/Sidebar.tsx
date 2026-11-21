import { NavLink } from 'react-router'
import { GRUPOS, INDICE, etiquetaEntrada } from '../lib/indice'
import { disponible } from '../lib/contenido'

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Índice de entradas" className="text-sm">
      <NavLink
        to="/"
        end
        onClick={onNavigate}
        className={({ isActive }) =>
          `mb-4 block rounded-md px-3 py-2 font-semibold ${isActive ? 'bg-teal-100 text-teal-900 dark:bg-teal-900/40 dark:text-teal-100' : 'hover:bg-stone-200/60 dark:hover:bg-stone-800'}`
        }
      >
        Inicio
      </NavLink>
      {GRUPOS.map((g) => (
        <section key={g.unidad} className="mb-5">
          <h2 className="mb-1 px-3 text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            {g.nombre}
          </h2>
          <ul>
            {INDICE.filter((e) => e.unidad === g.unidad).map((e) => {
              const ok = disponible(e.id)
              const etiqueta = (
                <>
                  <span className="w-12 shrink-0 font-mono text-xs text-stone-500 dark:text-stone-400">
                    {etiquetaEntrada(e.id)}
                  </span>
                  <span className="min-w-0 flex-1">{e.titulo}</span>
                </>
              )
              return (
                <li key={e.id}>
                  {ok ? (
                    <NavLink
                      to={`/entrada/${e.id}`}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `flex gap-2 rounded-md px-3 py-1.5 leading-snug ${isActive ? 'bg-teal-100 font-medium text-teal-900 dark:bg-teal-900/40 dark:text-teal-100' : 'hover:bg-stone-200/60 dark:hover:bg-stone-800'}`
                      }
                    >
                      {etiqueta}
                    </NavLink>
                  ) : (
                    <span
                      className="flex gap-2 px-3 py-1.5 leading-snug text-stone-400 dark:text-stone-600"
                      title="Se escribe en la Fase 4"
                    >
                      {etiqueta}
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
