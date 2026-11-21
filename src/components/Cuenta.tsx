import { entrar, salir, useCuenta, type EstadoNube } from '../lib/cuenta'

const TEXTO: Record<EstadoNube, string> = {
  fuera: '',
  cargando: 'Conectando…',
  sincronizando: 'Guardando en la nube…',
  sincronizado: '☁ Sincronizado',
  'sin-conexion': 'Sin conexión: se sube al volver',
  error: 'Error de sincronización',
}

/** Entrar con Google para guardar el progreso en la nube (Firestore). */
export default function Cuenta() {
  const c = useCuenta()

  if (c.estado === 'fuera' || (c.estado === 'cargando' && !c.correo)) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-3 text-sm dark:border-stone-800 dark:bg-stone-900">
        <p className="text-stone-600 dark:text-stone-400">Entra para guardar tu progreso en la nube y verlo en cualquier equipo.</p>
        <button
          type="button"
          onClick={entrar}
          disabled={c.estado === 'cargando'}
          className="mt-2 w-full rounded-md bg-teal-700 px-3 py-1.5 font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {c.estado === 'cargando' ? 'Conectando…' : 'Entrar con Google'}
        </button>
        {c.mensaje && (
          <p role="alert" className="mt-2 text-xs text-red-700 dark:text-red-400">
            {c.mensaje}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3 text-sm dark:border-stone-800 dark:bg-stone-900">
      <p className="truncate font-medium" title={c.correo}>
        {c.nombre ?? c.correo}
      </p>
      <p
        className={`text-xs ${c.estado === 'error' ? 'text-red-700 dark:text-red-400' : 'text-stone-600 dark:text-stone-400'}`}
        aria-live="polite"
      >
        {TEXTO[c.estado]}
        {c.estado === 'error' && c.mensaje ? `: ${c.mensaje}` : ''}
      </p>
      <button type="button" onClick={salir} className="mt-1 text-xs text-teal-800 underline dark:text-teal-300">
        Salir
      </button>
    </div>
  )
}
