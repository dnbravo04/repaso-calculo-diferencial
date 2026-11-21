import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router'
import 'katex/dist/katex.min.css'
import './index.css'
import Layout from './components/Layout'
import Home from './components/Home'
import EntryView from './components/EntryView'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="entrada/:id" element={<EntryView />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
