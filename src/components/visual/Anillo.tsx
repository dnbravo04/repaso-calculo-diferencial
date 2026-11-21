/** Medidor en anillo: cuánto de un total (aquí, entradas pasadas al cuaderno). */
export default function Anillo({ valor, total, rotulo }: { valor: number; total: number; rotulo: string }) {
  const R = 44
  const GROSOR = 10
  const L = 2 * Math.PI * R
  const frac = total ? Math.min(1, valor / total) : 0
  const porc = Math.round(frac * 100)

  return (
    <figure className="flex flex-col items-center gap-1">
      <div className="relative size-28">
        <svg viewBox="0 0 112 112" className="size-28 -rotate-90" role="img" aria-label={`${valor} de ${total} ${rotulo} (${porc} %)`}>
          <circle cx="56" cy="56" r={R} fill="none" stroke="var(--cuaderno-pista)" strokeWidth={GROSOR} />
          {valor > 0 && (
            <circle
              cx="56"
              cy="56"
              r={R}
              fill="none"
              stroke="var(--cuaderno)"
              strokeWidth={GROSOR}
              strokeLinecap="round"
              strokeDasharray={`${frac * L} ${L}`}
              className="transition-[stroke-dasharray] duration-700 ease-out"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
          <span className="text-2xl font-bold leading-none">{porc}%</span>
          <span className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            {valor} de {total}
          </span>
        </div>
      </div>
      <figcaption className="text-center text-sm text-stone-600 dark:text-stone-400">{rotulo}</figcaption>
    </figure>
  )
}
