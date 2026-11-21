import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import Sidebar from './Sidebar'

export default function Layout() {
  const [abierto, setAbierto] = useState(false)
  const { pathname } = useLocation()

  // Cierra el menú del celular al cambiar de página.
  useEffect(() => setAbierto(false), [pathname])

  return (
    <div className="min-h-dvh bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      {/* Barra superior: solo en pantallas pequeñas */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-stone-200 bg-stone-50/95 px-4 py-2 backdrop-blur md:hidden dark:border-stone-800 dark:bg-stone-950/95 print:hidden">
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-indice"
          className="rounded-md border border-stone-300 px-3 py-1 text-sm font-medium dark:border-stone-700"
        >
          {abierto ? 'Cerrar' : 'Índice'}
        </button>
        <span className="truncate text-sm font-semibold">Bitácora de Cálculo Diferencial</span>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Índice lateral: fijo en escritorio, cajón desplegable en celular */}
        <aside
          id="menu-indice"
          className={`${abierto ? 'block' : 'hidden'} fixed inset-x-0 top-[45px] bottom-0 z-20 overflow-y-auto bg-stone-50 px-2 py-4 md:sticky md:top-0 md:block md:h-dvh md:w-72 md:shrink-0 md:border-r md:border-stone-200 dark:bg-stone-950 md:dark:border-stone-800 print:hidden`}
        >
          <p className="mb-4 hidden px-3 text-base font-bold md:block">Bitácora de Cálculo Diferencial</p>
          <Sidebar onNavigate={() => setAbierto(false)} />
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 md:py-10">
          <div className="mx-auto max-w-3xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
