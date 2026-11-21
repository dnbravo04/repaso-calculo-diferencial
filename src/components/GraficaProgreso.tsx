import { useEffect, useRef, useState } from 'react'
import { describirSerie, fechaTexto, type PuntoSerie } from '../lib/progreso'

const SERIES = [
  { clave: 'verdes', nombre: 'En 🟢 dominado', corto: '🟢', color: 'var(--serie-1)' },
  { clave: 'cuaderno', nombre: 'Pasadas al cuaderno', corto: '✎', color: 'var(--serie-2)' },
] as const

const ALTO = 260
const M = { izq: 40, der: 56, arriba: 12, abajo: 44 }

/** Gráfica de líneas de Mi progreso: ejes rotulados, cuadrícula, leyenda, etiqueta directa y descripción. */
export default function GraficaProgreso({ serie }: { serie: PuntoSerie[] }) {
  const caja = useRef<HTMLDivElement>(null)
  const [ancho, setAncho] = useState(640)
  const [foco, setFoco] = useState<number | null>(null)

  useEffect(() => {
    const el = caja.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setAncho(Math.max(280, Math.round(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const n = serie.length
  const maxDato = Math.max(...serie.map((p) => Math.max(p.verdes, p.cuaderno)), 0)
  const yMax = Math.max(5, Math.ceil(maxDato / 5) * 5)
  const paso = yMax <= 5 ? 1 : yMax <= 20 ? 5 : 10
  const plotW = ancho - M.izq - M.der
  const plotH = ALTO - M.arriba - M.abajo
  const x = (i: number) => M.izq + (n === 1 ? plotW / 2 : (i * plotW) / (n - 1))
  const y = (v: number) => M.arriba + plotH - (v / yMax) * plotH
  const ticksY = Array.from({ length: yMax / paso + 1 }, (_, k) => k * paso)
  const cadaX = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(plotW / 70))))
  const ticksX = serie.map((_, i) => i).filter((i) => i % cadaX === 0 || i === n - 1)

  // Etiquetas directas al final: se separan si quedan encimadas.
  const ult = serie[n - 1]
  let yEtq = SERIES.map((s) => y(ult[s.clave]))
  if (Math.abs(yEtq[0] - yEtq[1]) < 14) {
    const medio = (yEtq[0] + yEtq[1]) / 2
    yEtq = ult.verdes >= ult.cuaderno ? [medio - 7, medio + 7] : [medio + 7, medio - 7]
  }

  const alMover = (ev: React.PointerEvent<SVGRectElement>) => {
    const r = ev.currentTarget.getBoundingClientRect()
    const px = ev.clientX - r.left
    const i = n === 1 ? 0 : Math.round((px / r.width) * (n - 1))
    setFoco(Math.min(n - 1, Math.max(0, i)))
  }

  const p = foco !== null ? serie[foco] : null

  return (
    <figure className="grafica-progreso">
      <figcaption className="sr-only">Entradas en 🟢 y pasadas al cuaderno por día</figcaption>
      <ul className="mb-2 flex flex-wrap gap-4 text-sm" aria-label="Leyenda">
        {SERIES.map((s) => (
          <li key={s.clave} className="flex items-center gap-2">
            <svg width="22" height="10" aria-hidden="true">
              <line x1="1" y1="5" x2="21" y2="5" stroke={s.color} strokeWidth="2" strokeLinecap="round" />
              <circle cx="11" cy="5" r="4" fill={s.color} stroke="var(--superficie)" strokeWidth="2" />
            </svg>
            {s.nombre}
          </li>
        ))}
      </ul>

      <div ref={caja} className="relative w-full overflow-hidden">
        <svg width={ancho} height={ALTO} role="img" aria-label="Gráfica de progreso; la descripción está debajo">
          {/* Cuadrícula y eje y */}
          {ticksY.map((t) => (
            <g key={t}>
              <line x1={M.izq} x2={M.izq + plotW} y1={y(t)} y2={y(t)} stroke="var(--rejilla)" strokeWidth={t === 0 ? 1.5 : 1} />
              <text x={M.izq - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-current text-[11px] text-stone-500 dark:text-stone-400">
                {t}
              </text>
            </g>
          ))}
          {/* Eje x */}
          {ticksX.map((i) => (
            <g key={i}>
              <line x1={x(i)} x2={x(i)} y1={M.arriba} y2={M.arriba + plotH} stroke="var(--rejilla)" strokeDasharray="2 4" />
              <text x={x(i)} y={M.arriba + plotH + 16} textAnchor="middle" className="fill-current text-[11px] text-stone-500 dark:text-stone-400">
                {fechaTexto(serie[i].fecha)}
              </text>
            </g>
          ))}
          <text x={M.izq + plotW / 2} y={ALTO - 6} textAnchor="middle" className="fill-current text-xs text-stone-600 dark:text-stone-300">
            Día
          </text>
          <text
            transform={`translate(12 ${M.arriba + plotH / 2}) rotate(-90)`}
            textAnchor="middle"
            className="fill-current text-xs text-stone-600 dark:text-stone-300"
          >
            Entradas
          </text>

          {/* Líneas y puntos */}
          {SERIES.map((s) => (
            <g key={s.clave}>
              {n > 1 && (
                <polyline
                  points={serie.map((d, i) => `${x(i)},${y(d[s.clave])}`).join(' ')}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              )}
              {serie.map((d, i) =>
                n <= 31 || i === n - 1 || i === foco ? (
                  <circle key={i} cx={x(i)} cy={y(d[s.clave])} r="4" fill={s.color} stroke="var(--superficie)" strokeWidth="2" />
                ) : null,
              )}
            </g>
          ))}

          {/* Etiquetas directas en el último punto (texto en color de texto, no de la serie) */}
          {SERIES.map((s, k) => (
            <text
              key={s.clave}
              x={x(n - 1) + 10}
              y={yEtq[k]}
              dy="0.32em"
              className="fill-current text-xs font-semibold text-stone-800 dark:text-stone-100"
            >
              {s.corto} {ult[s.clave]}
            </text>
          ))}

          {/* Cruz de foco */}
          {p && <line x1={x(foco!)} x2={x(foco!)} y1={M.arriba} y2={M.arriba + plotH} stroke="var(--cruz)" strokeWidth="1" />}

          <rect
            x={M.izq}
            y={M.arriba}
            width={plotW}
            height={plotH}
            fill="transparent"
            onPointerMove={alMover}
            onPointerDown={alMover}
            onPointerLeave={() => setFoco(null)}
          />
        </svg>

        {p && (
          <div
            className="pointer-events-none absolute top-2 z-10 rounded-md border border-stone-200 bg-white px-3 py-2 text-xs shadow-md dark:border-stone-700 dark:bg-stone-900"
            style={x(foco!) > ancho / 2 ? { right: ancho - x(foco!) + 10 } : { left: x(foco!) + 10 }}
          >
            <p className="mb-1 font-semibold">{fechaTexto(p.fecha)}</p>
            {SERIES.map((s) => (
              <p key={s.clave} className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                {s.nombre}: <strong className="tabular-nums">{p[s.clave]}</strong>
              </p>
            ))}
          </div>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-stone-700 dark:text-stone-300">{describirSerie(serie)}</p>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-teal-700 dark:text-teal-400">Ver los datos en tabla</summary>
        <div className="tabla-scroll">
          <table className="mt-2 w-full text-left">
            <thead>
              <tr className="border-b border-stone-300 dark:border-stone-700">
                <th className="py-1 pr-4">Día</th>
                <th className="py-1 pr-4">En 🟢</th>
                <th className="py-1">En el cuaderno</th>
              </tr>
            </thead>
            <tbody>
              {serie.map((d) => (
                <tr key={d.fecha} className="border-b border-stone-200 dark:border-stone-800">
                  <td className="py-1 pr-4">{fechaTexto(d.fecha)}</td>
                  <td className="py-1 pr-4 tabular-nums">{d.verdes}</td>
                  <td className="py-1 tabular-nums">{d.cuaderno}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
