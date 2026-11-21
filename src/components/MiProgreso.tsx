import { useEffect, useRef, useState } from 'react'
import { acciones, useGuardadoOk, useProgreso } from '../lib/almacen'
import { INDICE } from '../lib/indice'
import { SEMAFOROS, estadoDe, exportar, fechaLocal, importar, serieDiaria } from '../lib/progreso'
import GraficaProgreso from './GraficaProgreso'

export default function MiProgreso() {
  const progreso = useProgreso()
  const guardadoOk = useGuardadoOk()
  const archivo = useRef<HTMLInputElement>(null)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  useEffect(() => {
    document.title = 'Mi progreso · Bitácora'
  }, [])

  const hoy = fechaLocal(new Date())
  const serie = serieDiaria(progreso, hoy)
  const conteo = (v: string) => INDICE.filter((e) => estadoDe(progreso, e.id).semaforo === v).length
  const enCuaderno = INDICE.filter((e) => estadoDe(progreso, e.id).cuaderno).length
  const inicio = serie[0]
  const actual = serie[serie.length - 1]

  const descargar = () => {
    const blob = new Blob([exportar(progreso)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bitacora-progreso-${hoy}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setMensaje({ tipo: 'ok', texto: 'Listo: se descargó el archivo con tu progreso.' })
  }

  const cargar = async (f: File) => {
    try {
      const nuevo = importar(await f.text())
      const n = Object.keys(nuevo.entradas).length
      const ok = window.confirm(
        `Vas a reemplazar el progreso de este navegador por el del archivo (${n} entradas, ${nuevo.historial.length} registros). ¿Sigo?`,
      )
      if (!ok) return
      acciones.reemplazar(nuevo)
      setMensaje({ tipo: 'ok', texto: 'Progreso importado.' })
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e instanceof Error ? e.message : 'No pude leer el archivo.' })
    } finally {
      if (archivo.current) archivo.current.value = ''
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Mi progreso</h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        Medido solo contra tu propio punto de partida: el primer día que marcaste algo.
      </p>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Resumen de hoy">
        {SEMAFOROS.map((s) => (
          <div key={s.valor} className="rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              {s.emoji} {s.nombre}
            </p>
            <p className="text-2xl font-bold tabular-nums">{conteo(s.valor)}</p>
          </div>
        ))}
        <div className="rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-sm text-stone-600 dark:text-stone-400">✎ en el cuaderno</p>
          <p className="text-2xl font-bold tabular-nums">{enCuaderno}</p>
        </div>
      </section>
      <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">De {INDICE.length} entradas del curso.</p>

      {inicio && actual && serie.length > 1 && (
        <p className="mt-4">
          Desde tu punto de partida ({inicio.verdes} en 🟢, {inicio.cuaderno} en el cuaderno) llevas{' '}
          <strong>{actual.verdes - inicio.verdes >= 0 ? '+' : ''}{actual.verdes - inicio.verdes}</strong> en 🟢 y{' '}
          <strong>{actual.cuaderno - inicio.cuaderno >= 0 ? '+' : ''}{actual.cuaderno - inicio.cuaderno}</strong> en el cuaderno.
        </p>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">A lo largo del tiempo</h2>
        {serie.length > 0 ? (
          <GraficaProgreso serie={serie} />
        ) : (
          <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-stone-600 dark:border-stone-700 dark:text-stone-400">
            Todavía no hay registros. Marca el semáforo o la casilla del cuaderno en una entrada y aquí empieza tu línea.
          </p>
        )}
      </section>

      <section className="mt-10 rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="text-lg font-bold">Guardar o pasar a otro navegador</h2>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          El progreso vive solo en este navegador. Descárgalo de vez en cuando y, si cambias de navegador o de equipo, impórtalo allá.
        </p>
        {!guardadoOk && (
          <p className="mt-2 text-sm font-semibold text-red-700 dark:text-red-400">
            Este navegador no está dejando guardar (¿modo privado?): lo que marques se pierde al cerrar.
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={descargar}
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Descargar progreso (JSON)
          </button>
          <label className="cursor-pointer rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800">
            Importar progreso…
            <input
              ref={archivo}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(ev) => ev.target.files?.[0] && cargar(ev.target.files[0])}
            />
          </label>
        </div>
        {mensaje && (
          <p
            role="status"
            className={`mt-3 text-sm ${mensaje.tipo === 'ok' ? 'text-teal-800 dark:text-teal-300' : 'text-red-700 dark:text-red-400'}`}
          >
            {mensaje.texto}
          </p>
        )}
      </section>
    </div>
  )
}
