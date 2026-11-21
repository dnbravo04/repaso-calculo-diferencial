import type { ReactNode } from 'react'
import Markdown from '../Markdown'

/** Número con coma decimal y signo menos tipográfico. */
export function fmt(n: number, decimales = 2): string {
  if (!Number.isFinite(n)) return '—'
  const r = Number(n.toFixed(decimales))
  const s = Math.abs(r).toFixed(decimales).replace(/\.?0+$/, '').replace('.', ',')
  return r < 0 ? `−${s}` : s || '0'
}

/** Rótulos de eje: sin el 0 (ya lo marca el origen). */
export const rotulo = (n: number) => (Math.abs(n) < 1e-9 ? '' : fmt(n))

/** Paso de la cuadrícula: entre ~5 y ~12 líneas en el rango visible. */
export function paso(rango: number): number {
  for (const p of [0.25, 0.5, 1, 2, 5, 10, 20, 50]) if (rango / p <= 12) return p
  return 100
}

/** Ejes con cuadrícula espaciada según la vista. */
export const ejes = (x: [number, number], y: [number, number]) => ({
  xAxis: { lines: paso(x[1] - x[0]), labels: rotulo },
  yAxis: { lines: paso(y[1] - y[0]), labels: rotulo },
})

/** Marco común: etiqueta "Interactivo", contenido y descripción en palabras (regla 5). */
export function Marco({ titulo, descripcion, children }: { titulo: string; descripcion: string; children: ReactNode }) {
  return (
    <figure className="grafica interactivo not-prose my-6 rounded-xl border-2 border-teal-600/40 bg-white p-3 shadow-sm dark:border-teal-500/40 dark:bg-stone-900">
      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-teal-800 dark:text-teal-300">
        <span aria-hidden="true">✋</span> Interactivo · {titulo}
      </p>
      {children}
      <figcaption className="contenido prose prose-stone prose-sm dark:prose-invert mt-3 max-w-none">
        <Markdown>{descripcion}</Markdown>
      </figcaption>
    </figure>
  )
}

/** Deslizador accesible con su rótulo y su valor. */
export function Deslizador({
  etiqueta,
  valor,
  min,
  max,
  paso,
  alCambiar,
  texto,
}: {
  etiqueta: ReactNode
  valor: number
  min: number
  max: number
  paso: number
  alCambiar: (v: number) => void
  texto: string
}) {
  return (
    <label className="mt-3 block text-sm">
      <span className="flex items-baseline justify-between gap-3">
        <span className="font-medium">{etiqueta}</span>
        <output className="font-mono text-xs tabular-nums text-stone-600 dark:text-stone-300">{texto}</output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={paso}
        value={valor}
        aria-valuetext={texto}
        onChange={(e) => alCambiar(Number(e.target.value))}
        className="mt-1 w-full cursor-pointer accent-teal-600"
      />
    </label>
  )
}

/** Cajita de lectura: muestra de color + rótulo + valor. */
export function Lectura({ color, children }: { color?: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-stone-100 px-2.5 py-1.5 text-sm dark:bg-stone-800">
      {color && <span className="inline-block h-3 w-1.5 shrink-0 rounded-full" style={{ background: color }} aria-hidden="true" />}
      <span className="min-w-0">{children}</span>
    </div>
  )
}
