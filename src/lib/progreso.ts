// Modelo del progreso: funciones puras (probadas con vitest) sin React ni localStorage.

export type Semaforo = 'verde' | 'amarillo' | 'rojo'

export const SEMAFOROS: { valor: Semaforo; emoji: string; nombre: string }[] = [
  { valor: 'verde', emoji: '🟢', nombre: 'dominado' },
  { valor: 'amarillo', emoji: '🟡', nombre: 'casi' },
  { valor: 'rojo', emoji: '🔴', nombre: 'repasar' },
]

export interface EstadoEntrada {
  semaforo: Semaforo | null
  cuaderno: boolean
  palabras: string
}

export type Evento =
  | { fecha: string; id: string; tipo: 'semaforo'; valor: Semaforo | null }
  | { fecha: string; id: string; tipo: 'cuaderno'; valor: boolean }

export interface Progreso {
  version: 1
  creado: string // ISO
  entradas: Record<string, EstadoEntrada>
  historial: Evento[] // un registro con fecha por cada cambio de semáforo o de cuaderno
}

export const progresoVacio = (ahora = new Date()): Progreso => ({
  version: 1,
  creado: ahora.toISOString(),
  entradas: {},
  historial: [],
})

export const estadoVacio = (): EstadoEntrada => ({ semaforo: null, cuaderno: false, palabras: '' })

export const estadoDe = (p: Progreso, id: string): EstadoEntrada => p.entradas[id] ?? estadoVacio()

function conEntrada(p: Progreso, id: string, cambio: Partial<EstadoEntrada>): Progreso {
  return { ...p, entradas: { ...p.entradas, [id]: { ...estadoDe(p, id), ...cambio } } }
}

export function ponerSemaforo(p: Progreso, id: string, valor: Semaforo | null, ahora = new Date()): Progreso {
  if (estadoDe(p, id).semaforo === valor) return p
  const q = conEntrada(p, id, { semaforo: valor })
  return { ...q, historial: [...q.historial, { fecha: ahora.toISOString(), id, tipo: 'semaforo', valor }] }
}

export function ponerCuaderno(p: Progreso, id: string, valor: boolean, ahora = new Date()): Progreso {
  if (estadoDe(p, id).cuaderno === valor) return p
  const q = conEntrada(p, id, { cuaderno: valor })
  return { ...q, historial: [...q.historial, { fecha: ahora.toISOString(), id, tipo: 'cuaderno', valor }] }
}

export function ponerPalabras(p: Progreso, id: string, texto: string): Progreso {
  if (estadoDe(p, id).palabras === texto) return p
  return conEntrada(p, id, { palabras: texto })
}

// ---------- Fechas locales (YYYY-MM-DD) ----------

const dos = (n: number) => String(n).padStart(2, '0')
export const fechaLocal = (d: Date) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`

/** Días de calendario entre dos fechas YYYY-MM-DD (b − a). */
export function diasEntre(a: string, b: string): number {
  const [ya, ma, da] = a.split('-').map(Number)
  const [yb, mb, db] = b.split('-').map(Number)
  return Math.round((Date.UTC(yb, mb - 1, db) - Date.UTC(ya, ma - 1, da)) / 86_400_000)
}

export function sumarDias(fecha: string, n: number): string {
  const [y, m, d] = fecha.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, d + n))
  return `${t.getUTCFullYear()}-${dos(t.getUTCMonth() + 1)}-${dos(t.getUTCDate())}`
}

// ---------- Serie en el tiempo (Mi progreso) ----------

export interface PuntoSerie {
  fecha: string // YYYY-MM-DD
  verdes: number
  cuaderno: number
}

/**
 * Reproduce el historial y devuelve, para cada día desde el primer registro hasta `hasta`,
 * cuántas entradas estaban en 🟢 y cuántas pasadas al cuaderno al final de ese día.
 */
export function serieDiaria(p: Progreso, hasta: string): PuntoSerie[] {
  if (p.historial.length === 0) return []
  const eventos = [...p.historial].sort((a, b) => a.fecha.localeCompare(b.fecha))
  const primerDia = fechaLocal(new Date(eventos[0].fecha))
  const semaforo = new Map<string, Semaforo | null>()
  const cuaderno = new Map<string, boolean>()
  const serie: PuntoSerie[] = []
  let i = 0
  for (let dia = primerDia; diasEntre(dia, hasta) >= 0; dia = sumarDias(dia, 1)) {
    while (i < eventos.length && fechaLocal(new Date(eventos[i].fecha)) <= dia) {
      const ev = eventos[i++]
      if (ev.tipo === 'semaforo') semaforo.set(ev.id, ev.valor)
      else cuaderno.set(ev.id, ev.valor)
    }
    serie.push({
      fecha: dia,
      verdes: [...semaforo.values()].filter((v) => v === 'verde').length,
      cuaderno: [...cuaderno.values()].filter(Boolean).length,
    })
  }
  return serie
}

const fechaTexto = (iso: string) => {
  const [, m, d] = iso.split('-').map(Number)
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${d} ${meses[m - 1]}`
}
export { fechaTexto }

const conSigno = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : 'sin cambio')

/** Descripción en lenguaje natural de la gráfica de Mi progreso (regla 5). */
export function describirSerie(serie: PuntoSerie[]): string {
  if (serie.length === 0) return 'Todavía no hay registros, así que no hay nada que graficar.'
  const ini = serie[0]
  const fin = serie[serie.length - 1]
  const maxV = serie.reduce((a, b) => (b.verdes > a.verdes ? b : a))
  const partes = [
    `El eje horizontal son los días, desde tu primer registro (${fechaTexto(ini.fecha)}) hasta ${fechaTexto(fin.fecha)}; el eje vertical es el número de entradas.`,
    'La línea azul cuenta las entradas en 🟢 dominado y la naranja las entradas pasadas al cuaderno.',
    `Tu punto de partida, al final del ${fechaTexto(ini.fecha)}: ${ini.verdes} en 🟢 y ${ini.cuaderno} en el cuaderno.`,
  ]
  if (serie.length > 1) {
    partes.push(
      `El ${fechaTexto(fin.fecha)}: ${fin.verdes} en 🟢 (${conSigno(fin.verdes - ini.verdes)} desde tu punto de partida) y ${fin.cuaderno} en el cuaderno (${conSigno(fin.cuaderno - ini.cuaderno)}).`,
    )
    if (maxV.verdes > fin.verdes) partes.push(`El máximo de 🟢 fue ${maxV.verdes}, el ${fechaTexto(maxV.fecha)}.`)
  } else {
    partes.push('Por ahora hay un solo día registrado; la línea aparece cuando haya más días.')
  }
  return partes.join(' ')
}

// ---------- Exportar / importar ----------

export function exportar(p: Progreso): string {
  return JSON.stringify(p, null, 2)
}

const esSemaforo = (v: unknown): v is Semaforo | null => v === null || v === 'verde' || v === 'amarillo' || v === 'rojo'

/** Valida un JSON exportado. Lanza un Error con un mensaje en español si no sirve. */
export function importar(texto: string): Progreso {
  let datos: unknown
  try {
    datos = JSON.parse(texto)
  } catch {
    throw new Error('El archivo no es un JSON válido.')
  }
  const d = datos as Partial<Progreso>
  if (!d || typeof d !== 'object' || d.version !== 1) throw new Error('No es un archivo de progreso de esta bitácora (falta "version": 1).')
  if (typeof d.creado !== 'string' || !d.entradas || typeof d.entradas !== 'object' || !Array.isArray(d.historial)) {
    throw new Error('Al archivo le faltan partes (creado, entradas o historial).')
  }
  const entradas: Record<string, EstadoEntrada> = {}
  for (const [id, e] of Object.entries(d.entradas as Record<string, Partial<EstadoEntrada>>)) {
    if (!e || typeof e !== 'object' || !esSemaforo(e.semaforo ?? null) || typeof (e.cuaderno ?? false) !== 'boolean') {
      throw new Error(`La entrada ${id} tiene datos que no entiendo.`)
    }
    entradas[id] = { semaforo: e.semaforo ?? null, cuaderno: e.cuaderno ?? false, palabras: typeof e.palabras === 'string' ? e.palabras : '' }
  }
  const historial: Evento[] = []
  for (const ev of d.historial as Evento[]) {
    const okFecha = ev && typeof ev.fecha === 'string' && !Number.isNaN(Date.parse(ev.fecha)) && typeof ev.id === 'string'
    const okValor = ev && ((ev.tipo === 'semaforo' && esSemaforo(ev.valor)) || (ev.tipo === 'cuaderno' && typeof ev.valor === 'boolean'))
    if (!okFecha || !okValor) throw new Error('El historial tiene un registro dañado.')
    historial.push(ev)
  }
  return { version: 1, creado: d.creado, entradas, historial }
}
