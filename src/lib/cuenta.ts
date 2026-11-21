// Estado de la cuenta (entrar con Google y sincronizar con Firestore), sin importar Firebase:
// el SDK pesa, así que src/lib/nube.ts se descarga solo cuando hace falta.
import { useSyncExternalStore } from 'react'

export type EstadoNube = 'fuera' | 'cargando' | 'sincronizando' | 'sincronizado' | 'sin-conexion' | 'error'

export interface Cuenta {
  estado: EstadoNube
  nombre?: string
  correo?: string
  mensaje?: string
}

const MARCA = 'bitacora-calculo:nube'

let cuenta: Cuenta = { estado: 'fuera' }
const oyentes = new Set<() => void>()

export function ponerCuenta(c: Partial<Cuenta> & { estado: EstadoNube }) {
  cuenta = c.estado === 'fuera' ? { estado: 'fuera', mensaje: c.mensaje } : { ...cuenta, ...c }
  try {
    if (c.estado === 'fuera') globalThis.localStorage?.removeItem(MARCA)
    else if (c.correo) globalThis.localStorage?.setItem(MARCA, '1')
  } catch {
    // Sin almacenamiento: solo no se recuerda que había sesión.
  }
  for (const o of oyentes) o()
}

export const useCuenta = () =>
  useSyncExternalStore(
    (o) => {
      oyentes.add(o)
      return () => oyentes.delete(o)
    },
    () => cuenta,
  )

const cargarNube = () => import('./nube')

export async function entrar() {
  ponerCuenta({ estado: 'cargando', mensaje: undefined })
  try {
    await (await cargarNube()).entrarConGoogle()
  } catch (e) {
    ponerCuenta({ estado: 'fuera', mensaje: e instanceof Error ? e.message : 'No pude entrar.' })
  }
}

export async function salir() {
  await (await cargarNube()).salir()
}

// Si la última vez había sesión, se reabre sola al cargar la página.
function habiaSesion() {
  try {
    return globalThis.localStorage?.getItem(MARCA) === '1'
  } catch {
    return false
  }
}
if (typeof window !== 'undefined' && habiaSesion()) {
  cuenta = { estado: 'cargando' }
  cargarNube()
    .then((n) => n.iniciar())
    .catch(() => ponerCuenta({ estado: 'error', mensaje: 'No pude cargar la sincronización (¿sin internet?).' }))
}
