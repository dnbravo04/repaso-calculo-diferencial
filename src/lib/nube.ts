// Sincronización del progreso con Firestore. Se carga bajo demanda desde cuenta.ts.
// Cada usuario tiene un documento usuarios/{uid} con el progreso completo en `datos` (JSON).
import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import {
  doc,
  initializeFirestore,
  onSnapshot,
  persistentLocalCache,
  persistentMultipleTabManager,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { alCambiarLocal, aplicarRemoto, progresoActual } from './almacen'
import { ponerCuenta } from './cuenta'
import { firebaseConfig } from './firebaseConfig'
import { importar, jsonEstable, type Progreso } from './progreso'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
// Caché en IndexedDB: sin internet, lo que marques queda en cola y se sube al volver la conexión.
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
})

let cancelarDoc: Unsubscribe | null = null
let cancelarLocal: (() => void) | null = null
let ultimoSubido = ''

function subir(uid: string, p: Progreso) {
  const texto = jsonEstable(p)
  if (texto === ultimoSubido) return
  ultimoSubido = texto
  setDoc(doc(db, 'usuarios', uid), { datos: texto, actualizado: serverTimestamp() }).catch((e) => {
    ultimoSubido = ''
    ponerCuenta({ estado: 'error', mensaje: `No pude guardar en la nube (${e?.code ?? e}).` })
  })
}

function detener() {
  cancelarDoc?.()
  cancelarLocal?.()
  cancelarDoc = cancelarLocal = null
  ultimoSubido = ''
}

function sincronizar(u: User) {
  detener()
  ponerCuenta({ estado: 'sincronizando', nombre: u.displayName ?? undefined, correo: u.email ?? undefined, mensaje: undefined })
  cancelarLocal = alCambiarLocal((p) => subir(u.uid, p))
  cancelarDoc = onSnapshot(
    doc(db, 'usuarios', u.uid),
    { includeMetadataChanges: true },
    (snap) => {
      if (!snap.exists()) {
        // Primera vez con esta cuenta: se sube lo que ya hay en este navegador.
        if (!snap.metadata.fromCache) subir(u.uid, progresoActual())
      } else {
        const datos = snap.data().datos as string
        let remoto: Progreso
        try {
          remoto = importar(datos)
        } catch {
          ponerCuenta({ estado: 'error', mensaje: 'La copia en la nube está dañada; no la toqué.' })
          return
        }
        if (!snap.metadata.hasPendingWrites) ultimoSubido = datos
        // Se combina con lo de este navegador y, si quedó distinto, se sube.
        subir(u.uid, aplicarRemoto(remoto))
      }
      ponerCuenta({
        estado: snap.metadata.hasPendingWrites ? 'sincronizando' : snap.metadata.fromCache ? 'sin-conexion' : 'sincronizado',
      })
    },
    (e) => ponerCuenta({ estado: 'error', mensaje: `No pude leer la nube (${e.code}).` }),
  )
}

let iniciado = false
export function iniciar() {
  if (iniciado) return
  iniciado = true
  onAuthStateChanged(auth, (u) => {
    if (u) sincronizar(u)
    else {
      detener()
      ponerCuenta({ estado: 'fuera' })
    }
  })
}

const MENSAJES: Record<string, string> = {
  'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite ventanas emergentes para este sitio y vuelve a intentar.',
  'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase (Authentication → Settings → Authorized domains).',
  'auth/operation-not-allowed': 'El inicio con Google no está activado en Firebase (Authentication → Sign-in method).',
  'auth/configuration-not-found': 'Falta activar Authentication en la consola de Firebase.',
  'auth/network-request-failed': 'No hay conexión a internet.',
}

export async function entrarConGoogle() {
  iniciar()
  try {
    await signInWithPopup(auth, new GoogleAuthProvider())
  } catch (e) {
    const code = (e as { code?: string }).code ?? ''
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      ponerCuenta({ estado: 'fuera' })
      return
    }
    throw new Error(MENSAJES[code] ?? `No pude entrar (${code || String(e)}).`)
  }
}

export async function salir() {
  detener()
  await signOut(auth)
}
