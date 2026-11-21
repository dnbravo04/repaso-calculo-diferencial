import { Link } from 'react-router'
import { FECHA_FINAL, INDICE, etiquetaEntrada } from '../lib/indice'
import { disponible } from '../lib/contenido'

// Inicio provisional de la Fase 1. La página "Hoy" completa llega en la Fase 2.
export default function Home() {
  const dias = Math.ceil((new Date(FECHA_FINAL).getTime() - Date.now()) / 86_400_000)
  const escritas = INDICE.filter((e) => disponible(e.id))
  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Bitácora de Cálculo Diferencial</h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        Final: viernes 11 de diciembre, 2 p. m.
        {dias > 0 && <> · faltan {dias} días</>}
      </p>
      <p className="mt-6">
        Cada entrada trae lo mismo, en este orden: definición formal, idea en palabras, método, ejemplo,
        trampas y práctica. Úsala al lado del cuaderno.
      </p>
      <h2 className="mt-8 mb-3 text-lg font-bold">Entradas escritas ({escritas.length} de {INDICE.length})</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {escritas.map((e) => (
          <li key={e.id}>
            <Link
              to={`/entrada/${e.id}`}
              className="flex gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 hover:border-teal-500 dark:border-stone-800 dark:bg-stone-900"
            >
              <span className="w-12 shrink-0 font-mono text-sm text-teal-700 dark:text-teal-400">
                {etiquetaEntrada(e.id)}
              </span>
              <span className="text-sm">{e.titulo}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
