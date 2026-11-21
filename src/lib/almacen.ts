// Almacén del progreso en localStorage, expuesto a React con useSyncExternalStore.
// Toda lectura y escritura va en try/catch: en modo privado o con el almacenamiento
// bloqueado, la app sigue funcionando (solo que no recuerda).
import { useSyncExternalStore } from 'react'
import {
  combinar,
  iguales,
  importar,
  ponerCuaderno,
  ponerPalabras,
  ponerSemaforo,
  progresoVacio,
  type Progreso,
  type Semaforo,
} from './progreso'

export const CLAVE = 'bitacora-calculo:progreso:v1'

export function leerGuardado(storage: Pick<Storage, 'getItem'> | undefined = globalThis.localStorage): Progreso {
  try {
    const texto = storage?.getItem(CLAVE)
    if (texto) return importar(texto)
  } catch {
    // Dato ilegible o almacenamiento bloqueado: se arranca de cero sin romper la app.
  }
  return progresoVacio()
}

export function escribirGuardado(p: Progreso, storage: Pick<Storage, 'setItem'> | undefined = globalThis.localStorage): boolean {
  try {
    storage?.setItem(CLAVE, JSON.stringify(p))
    return !!storage
  } catch {
    return false
  }
}

/** ¿Se puede escribir en localStorage? (falla en algunos modos privados). */
function sePuedeGuardar(): boolean {
  try {
    const s = globalThis.localStorage
    if (!s) return false
    s.setItem(`${CLAVE}:prueba`, '1')
    s.removeItem(`${CLAVE}:prueba`)
    return true
  } catch {
    return false
  }
}

let estado: Progreso = leerGuardado()
let guardadoOk = sePuedeGuardar()
const oyentes = new Set<() => void>()

function emitir() {
  for (const o of oyentes) o()
}

// Quien quiera enterarse de los cambios hechos aquí (la sincronización con la nube).
const oyentesLocales = new Set<(p: Progreso) => void>()
export function alCambiarLocal(o: (p: Progreso) => void) {
  oyentesLocales.add(o)
  return () => {
    oyentesLocales.delete(o)
  }
}
export const progresoActual = () => estado

function poner(nuevo: Progreso) {
  estado = nuevo
  guardadoOk = escribirGuardado(estado)
  emitir()
}

function actualizar(nuevo: Progreso) {
  if (nuevo === estado) return
  poner(nuevo)
  for (const o of oyentesLocales) o(estado)
}

/**
 * Llega una copia desde la nube: se combina con la de este navegador y se devuelve el resultado
 * (la sincronización lo sube si quedó distinto de lo que había en la nube).
 */
export function aplicarRemoto(remoto: Progreso): Progreso {
  const combinado = combinar(estado, remoto)
  if (!iguales(combinado, estado)) poner(combinado)
  return estado
}

// Si la bitácora está abierta en dos pestañas, se sincronizan.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (ev) => {
    if (ev.key !== CLAVE) return
    estado = leerGuardado()
    emitir()
  })
}

function suscribir(o: () => void) {
  oyentes.add(o)
  return () => oyentes.delete(o)
}

export const useProgreso = () => useSyncExternalStore(suscribir, () => estado)
export const useGuardadoOk = () => useSyncExternalStore(suscribir, () => guardadoOk)

export const acciones = {
  semaforo: (id: string, valor: Semaforo | null) => actualizar(ponerSemaforo(estado, id, valor)),
  cuaderno: (id: string, valor: boolean) => actualizar(ponerCuaderno(estado, id, valor)),
  palabras: (id: string, texto: string) => actualizar(ponerPalabras(estado, id, texto)),
  reemplazar: (p: Progreso) => actualizar(p),
}
