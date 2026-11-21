import { useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from 'react'

/**
 * Cajita flotante (tooltip) para las gráficas pequeñas. Aparece al pasar el mouse o al
 * enfocar con el teclado, encima de la marca, sin salirse de la caja de la gráfica.
 */
export function usePista() {
  const caja = useRef<HTMLDivElement>(null)
  const [pista, setPista] = useState<{ texto: ReactNode; x: number; y: number } | null>(null)

  const mostrar = (texto: ReactNode) => (ev: PointerEvent<Element> | FocusEvent<Element>) => {
    const c = caja.current?.getBoundingClientRect()
    if (!c) return
    const r = ev.currentTarget.getBoundingClientRect()
    const x = Math.min(Math.max(r.left + r.width / 2 - c.left, 90), Math.max(90, c.width - 90))
    setPista({ texto, x, y: r.top - c.top })
  }
  const ocultar = () => setPista(null)

  const props = (texto: ReactNode) => ({
    onPointerEnter: mostrar(texto),
    onPointerDown: mostrar(texto),
    onPointerLeave: ocultar,
    onFocus: mostrar(texto),
    onBlur: ocultar,
  })

  const elemento = pista && (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-20 w-max max-w-[16rem] -translate-x-1/2 -translate-y-full rounded-md border border-stone-200 bg-white px-3 py-2 text-xs leading-snug text-stone-800 shadow-md dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
      style={{ left: pista.x, top: pista.y - 6 }}
    >
      {pista.texto}
    </div>
  )

  return { caja, props, elemento }
}
