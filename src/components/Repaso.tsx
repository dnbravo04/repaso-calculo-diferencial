import { useEffect } from 'react'
import { useProgreso } from '../lib/almacen'
import { entradasEnRojo } from '../lib/plan'
import ListaEntradas from './ListaEntradas'

export default function Repaso() {
  const rojas = entradasEnRojo(useProgreso())

  useEffect(() => {
    document.title = 'Modo repaso · Bitácora'
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Modo repaso</h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        Solo las entradas que marcaste en 🔴 repasar. Está pensado para el jueves 10 de diciembre, pero sirve cualquier día.
      </p>
      <div className="mt-6">
        {rojas.length > 0 ? (
          <ListaEntradas entradas={rojas} />
        ) : (
          <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-stone-600 dark:border-stone-700 dark:text-stone-400">
            No tienes entradas en 🔴. Cuando marques una, aparece aquí.
          </p>
        )}
      </div>
    </div>
  )
}
