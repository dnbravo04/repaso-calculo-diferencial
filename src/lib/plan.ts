// Cálculos del plan de estudio (página Hoy y Modo repaso). Funciones puras.
import { FECHA_FINAL, FECHA_REPASO, INDICE, type EntradaIndice } from './indice'
import { diasEntre, estadoDe, type Progreso } from './progreso'

export const DIA_FINAL = FECHA_FINAL.slice(0, 10)

/** Días de calendario que faltan para el final (0 = hoy es el final; negativo = ya pasó). */
export const diasParaFinal = (hoy: string) => diasEntre(hoy, DIA_FINAL)

export const entradasDeHoy = (hoy: string): EntradaIndice[] => INDICE.filter((e) => e.plan === hoy)

/** Atrasada: su día del plan ya pasó y todavía no está pasada al cuaderno. */
export const entradasAtrasadas = (hoy: string, p: Progreso): EntradaIndice[] =>
  INDICE.filter((e) => e.plan < hoy && !estadoDe(p, e.id).cuaderno)

/** El siguiente día del plan con entradas, después de hoy. */
export function proximoDia(hoy: string): { fecha: string; entradas: EntradaIndice[] } | null {
  const futuras = INDICE.filter((e) => e.plan > hoy).map((e) => e.plan).sort()
  if (futuras.length === 0) return null
  return { fecha: futuras[0], entradas: entradasDeHoy(futuras[0]) }
}

export const esDiaDeRepaso = (hoy: string) => hoy === FECHA_REPASO

export const entradasEnRojo = (p: Progreso): EntradaIndice[] =>
  INDICE.filter((e) => estadoDe(p, e.id).semaforo === 'rojo')
