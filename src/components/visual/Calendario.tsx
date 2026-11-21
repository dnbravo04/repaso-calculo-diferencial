import type { ReactNode } from 'react'
import { sumarDias } from '../../lib/progreso'

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const NOMBRES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

/** 0 = lunes … 6 = domingo. */
export function diaSemana(fecha: string) {
  const [y, m, d] = fecha.split('-').map(Number)
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
export const fechaBreve = (fecha: string) => {
  const [, m, d] = fecha.split('-').map(Number)
  return `${NOMBRES[diaSemana(fecha)].slice(0, 3)} ${d} ${MESES[m - 1]}`
}

/** Número del día; el primero del calendario y cada día 1 llevan el mes al lado. */
export function NumeroDia({ fecha, desde }: { fecha: string; desde: string }) {
  const d = Number(fecha.slice(8))
  return (
    <span className="whitespace-nowrap">
      {d}
      {(d === 1 || fecha === desde) && (
        <span className="ml-0.5 text-[9px] font-normal opacity-80">{MESES[Number(fecha.slice(5, 7)) - 1]}</span>
      )}
    </span>
  )
}

/** Cuadrícula de semanas (lunes a domingo) entre dos fechas; cada día lo dibuja `celda`. */
export default function Calendario({
  desde,
  hasta,
  celda,
}: {
  desde: string
  hasta: string
  celda: (fecha: string) => ReactNode
}) {
  const inicio = sumarDias(desde, -diaSemana(desde))
  const fin = sumarDias(hasta, 6 - diaSemana(hasta))
  const fechas: string[] = []
  for (let f = inicio; f <= fin; f = sumarDias(f, 1)) fechas.push(f)

  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
      {DIAS.map((d, i) => (
        <div key={d} className="pb-1 text-center text-xs font-semibold text-stone-500 dark:text-stone-400">
          <abbr title={NOMBRES[i]} className="no-underline">
            {d}
          </abbr>
        </div>
      ))}
      {fechas.map((f) => (
        <div key={f} className="min-w-0">
          {f >= desde && f <= hasta ? celda(f) : null}
        </div>
      ))}
    </div>
  )
}
