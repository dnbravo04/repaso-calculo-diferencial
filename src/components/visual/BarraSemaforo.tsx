import type { Conteo } from '../../lib/resumen'
import { usePista } from './Pista'

export const PARTES = [
  { clave: 'verde', emoji: '🟢', nombre: 'dominado', color: 'var(--sem-verde)', tinta: 'text-white' },
  { clave: 'amarillo', emoji: '🟡', nombre: 'casi', color: 'var(--sem-amarillo)', tinta: 'text-stone-900' },
  { clave: 'rojo', emoji: '🔴', nombre: 'repasar', color: 'var(--sem-rojo)', tinta: 'text-white' },
  { clave: 'nada', emoji: '⚪', nombre: 'sin marcar', color: 'var(--sem-nada)', tinta: 'text-stone-800 dark:text-stone-100' },
] as const

const pct = (n: number, total: number) => (total ? Math.round((n / total) * 100) : 0)

export const resumenTexto = (c: Conteo) =>
  PARTES.filter((p) => c[p.clave] > 0)
    .map((p) => `${c[p.clave]} ${p.emoji} ${p.nombre}`)
    .join(', ')

/**
 * Barra segmentada del semáforo: un todo (las entradas) partido en sus colores.
 * `alta` (28 px) imprime el porcentaje dentro de cada bloque; `fina` (8 px) y `mini` (4 px) no llevan texto.
 */
export default function BarraSemaforo({
  conteo,
  alto = 'fina',
  nombre,
}: {
  conteo: Conteo
  alto?: 'alta' | 'fina' | 'mini'
  nombre: string
}) {
  const { caja, props, elemento } = usePista()
  const partes = PARTES.filter((p) => conteo[p.clave] > 0)
  const altura = alto === 'alta' ? 'h-7' : alto === 'fina' ? 'h-2' : 'h-1'
  const esquinas = alto === 'alta' ? 'rounded' : 'rounded-full'
  const interactiva = alto !== 'mini'

  return (
    <div ref={caja} className="relative">
      <div
        role={interactiva ? 'group' : 'img'}
        aria-label={`${nombre}: ${resumenTexto(conteo)}`}
        className={`flex w-full gap-0.5 ${altura}`}
      >
        {partes.map((p) => {
          const n = conteo[p.clave]
          const porc = pct(n, conteo.total)
          const texto = (
            <>
              <span className="font-semibold">
                {p.emoji} {p.nombre}
              </span>
              <br />
              {n} de {conteo.total} entradas ({porc} %)
            </>
          )
          return (
            <div
              key={p.clave}
              className={`${esquinas} ${p.tinta} flex min-w-1 items-center overflow-hidden px-1.5 text-xs font-semibold outline-offset-2 focus-visible:outline-2 focus-visible:outline-teal-600`}
              style={{ flexGrow: n, flexBasis: 0, background: p.color }}
              {...(interactiva
                ? { tabIndex: 0, 'aria-label': `${p.emoji} ${p.nombre}: ${n} de ${conteo.total}`, ...props(texto) }
                : {})}
            >
              {alto === 'alta' && porc >= 12 && <span aria-hidden="true">{porc} %</span>}
            </div>
          )
        })}
      </div>
      {elemento}
    </div>
  )
}

/** Leyenda del semáforo con los conteos (identidad nunca solo por color: emoji + nombre). */
export function LeyendaSemaforo({ conteo }: { conteo: Conteo }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-700 dark:text-stone-300" aria-label="Leyenda">
      {PARTES.map((p) => (
        <li key={p.clave} className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm" style={{ background: p.color }} aria-hidden="true" />
          {p.nombre} <strong className="font-semibold text-stone-900 dark:text-stone-100">{conteo[p.clave]}</strong>
        </li>
      ))}
    </ul>
  )
}
