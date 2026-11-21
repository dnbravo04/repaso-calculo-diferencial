import { useEffect, useRef, useState } from 'react'
import { acciones, useGuardadoOk, useProgreso } from '../lib/almacen'
import { estadoDe } from '../lib/progreso'
import { useCuenta } from '../lib/cuenta'

/**
 * Textarea para escribir la respuesta con mis palabras. La app no responde nada: solo guarda.
 * Se monta con `key={id}`, así que cada entrada tiene su propia instancia.
 */
export default function DiloConTusPalabras({ id }: { id: string }) {
  const guardado = estadoDe(useProgreso(), id).palabras
  const guardadoOk = useGuardadoOk()
  const enNube = !!useCuenta().correo
  const [texto, setTexto] = useState(guardado)
  const pendiente = useRef<string | null>(null)
  const temporizador = useRef<number | undefined>(undefined)

  const guardar = () => {
    window.clearTimeout(temporizador.current)
    if (pendiente.current !== null) {
      acciones.palabras(id, pendiente.current)
      pendiente.current = null
    }
  }

  // Si llega un valor desde otra pestaña y aquí no hay nada sin guardar, se sincroniza.
  useEffect(() => {
    if (pendiente.current === null) setTexto(guardado)
  }, [guardado])

  // Al salir de la entrada (o cerrar la pestaña) se guarda lo que falte.
  useEffect(() => {
    window.addEventListener('beforeunload', guardar)
    return () => {
      window.removeEventListener('beforeunload', guardar)
      guardar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const escribiendo = texto !== guardado

  return (
    <div className="not-prose my-4 print:hidden">
      <label htmlFor={`palabras-${id}`} className="mb-1 block text-sm font-semibold">
        Mi respuesta
      </label>
      <textarea
        id={`palabras-${id}`}
        value={texto}
        rows={5}
        placeholder="Escríbelo como se lo explicarías a alguien que no vio la clase."
        onChange={(ev) => {
          setTexto(ev.target.value)
          pendiente.current = ev.target.value
          window.clearTimeout(temporizador.current)
          temporizador.current = window.setTimeout(guardar, 600)
        }}
        onBlur={guardar}
        className="w-full rounded-lg border border-stone-300 bg-white p-3 text-base leading-relaxed focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/30 dark:border-stone-700 dark:bg-stone-900"
      />
      <p className="mt-1 text-xs text-stone-500 dark:text-stone-400" aria-live="polite">
        {!guardadoOk
          ? 'Este navegador no deja guardar (¿modo privado?). Copia tu respuesta antes de cerrar.'
          : escribiendo
            ? 'Escribiendo…'
            : texto
              ? enNube
                ? 'Guardado en tu cuenta.'
                : 'Guardado en este navegador.'
              : 'Se guarda solo mientras escribes.'}
      </p>
    </div>
  )
}
