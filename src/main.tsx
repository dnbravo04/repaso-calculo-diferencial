import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router'
import 'katex/dist/katex.min.css'
import './index.css'
import Layout from './components/Layout'
import Hoy from './components/Hoy'
import EntryView from './components/EntryView'
import MiProgreso from './components/MiProgreso'
import Repaso from './components/Repaso'

// Mafs y mathjs pesan: el explorador se descarga solo cuando se abre.
const Explorador = lazy(() => import('./components/Explorador'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Hoy />} />
          <Route path="entrada/:id" element={<EntryView />} />
          <Route path="progreso" element={<MiProgreso />} />
          <Route path="repaso" element={<Repaso />} />
          <Route
            path="explorador"
            element={
              <Suspense fallback={<p className="text-stone-500">Cargando el explorador…</p>}>
                <Explorador />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
