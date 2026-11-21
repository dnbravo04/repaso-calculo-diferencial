import { Link } from 'react-router'
import { etiquetaEntrada, type EntradaIndice } from '../lib/indice'
import { disponible } from '../lib/contenido'
import { useProgreso } from '../lib/almacen'
import { estadoDe } from '../lib/progreso'
import Senal from './Senal'

export const fechaCorta = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })

export default function ListaEntradas({
  entradas,
  detalle,
}: {
  entradas: EntradaIndice[]
  detalle?: (e: EntradaIndice) => string
}) {
  const progreso = useProgreso()
  return (
    <ul className="grid gap-2">
      {entradas.map((e) => {
        const estado = estadoDe(progreso, e.id)
        const ok = disponible(e.id)
        const cuerpo = (
          <>
            <span className="w-14 shrink-0 font-mono text-sm text-teal-700 dark:text-teal-400">{etiquetaEntrada(e.id)}</span>
            <span className="min-w-0 flex-1">
              <span className="block">{e.titulo}</span>
              <span className="block text-xs text-stone-500 dark:text-stone-400">
                {detalle ? detalle(e) : `Taller: ${e.taller}`}
                {!ok && ' · aún no está escrita (Fase 4)'}
              </span>
            </span>
            <Senal semaforo={estado.semaforo} cuaderno={estado.cuaderno} />
          </>
        )
        const clase =
          'flex items-start gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2 dark:border-stone-800 dark:bg-stone-900'
        return (
          <li key={e.id}>
            {ok ? (
              <Link to={`/entrada/${e.id}`} className={`${clase} hover:border-teal-500`}>
                {cuerpo}
              </Link>
            ) : (
              <div className={`${clase} opacity-60`}>{cuerpo}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
