// Resúmenes para las gráficas pequeñas (Hoy, Mi progreso, índice). Funciones puras.
import { GRUPOS, INDICE, type EntradaIndice, type Grupo } from './indice'
import { DIA_FINAL } from './plan'
import { estadoDe, fechaLocal, sumarDias, type Progreso, type Semaforo } from './progreso'

export type Clase = Semaforo | 'nada'

export interface Conteo {
  verde: number
  amarillo: number
  rojo: number
  nada: number
  cuaderno: number
  total: number
}

/** Cuántas entradas hay en cada color del semáforo y cuántas pasadas al cuaderno. */
export function contar(entradas: EntradaIndice[], p: Progreso): Conteo {
  const c: Conteo = { verde: 0, amarillo: 0, rojo: 0, nada: 0, cuaderno: 0, total: entradas.length }
  for (const e of entradas) {
    const s = estadoDe(p, e.id)
    c[s.semaforo ?? 'nada']++
    if (s.cuaderno) c.cuaderno++
  }
  return c
}

export const porUnidad = (p: Progreso): { grupo: Grupo; conteo: Conteo }[] =>
  GRUPOS.map((grupo) => ({ grupo, conteo: contar(INDICE.filter((e) => e.unidad === grupo.unidad), p) }))

// ---------- Calendario del plan ----------

export const PRIMER_DIA = INDICE.map((e) => e.plan).sort()[0]

export type EstadoDia = 'libre' | 'hecho' | 'atrasado' | 'pendiente'

export interface DiaPlan {
  fecha: string
  entradas: EntradaIndice[]
  hechas: number // cuántas de ese día están pasadas al cuaderno
  estado: EstadoDia
}

/** Cada día del plan, del primero al día del final, con cuánto se ha pasado al cuaderno. */
export function diasDelPlan(hoy: string, p: Progreso): DiaPlan[] {
  const dias: DiaPlan[] = []
  for (let f = PRIMER_DIA; f <= DIA_FINAL; f = sumarDias(f, 1)) {
    const entradas = INDICE.filter((e) => e.plan === f)
    const hechas = entradas.filter((e) => estadoDe(p, e.id).cuaderno).length
    const estado: EstadoDia =
      entradas.length === 0 ? 'libre' : hechas === entradas.length ? 'hecho' : f < hoy ? 'atrasado' : 'pendiente'
    dias.push({ fecha: f, entradas, hechas, estado })
  }
  return dias
}

// ---------- Constancia ----------

/** Cambios registrados (semáforo o cuaderno) por día local. */
export function actividadPorDia(p: Progreso): Map<string, number> {
  const m = new Map<string, number>()
  for (const ev of p.historial) {
    const dia = fechaLocal(new Date(ev.fecha))
    m.set(dia, (m.get(dia) ?? 0) + 1)
  }
  return m
}

/**
 * Días seguidos con al menos un registro. Cuenta hacia atrás desde hoy; si hoy todavía
 * no hay nada, la racha de ayer sigue viva (no se rompe hasta que termine el día).
 */
export function racha(p: Progreso, hoy: string): number {
  const act = actividadPorDia(p)
  let dia = act.has(hoy) ? hoy : sumarDias(hoy, -1)
  let n = 0
  while (act.has(dia)) {
    n++
    dia = sumarDias(dia, -1)
  }
  return n
}

/** Nivel 0–4 para pintar la actividad de un día (0 = nada). */
export const nivelActividad = (n: number) => (n <= 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 9 ? 3 : 4)
