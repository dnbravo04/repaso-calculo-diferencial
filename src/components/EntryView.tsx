import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import Markdown from './Markdown'
import ControlesEntrada from './ControlesEntrada'
import DiloConTusPalabras from './DiloConTusPalabras'
import { disponible, obtenerEntrada } from '../lib/contenido'
import { partirPractica } from '../lib/markdown'
import { INDICE, etiquetaEntrada } from '../lib/indice'

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const fechaLarga = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })

/** Practica: la pregunta "Dilo con tus palabras", el textarea justo debajo y luego los ejercicios. */
function Practica({ id, cuerpo }: { id: string; cuerpo: string }) {
  const { pregunta, resto } = partirPractica(cuerpo)
  return (
    <div className="contenido prose prose-stone dark:prose-invert max-w-none">
      {pregunta && <Markdown>{pregunta}</Markdown>}
      <DiloConTusPalabras key={id} id={id} />
      {resto && <Markdown>{resto}</Markdown>}
    </div>
  )
}

export default function EntryView() {
  const { id = '' } = useParams()
  const entrada = obtenerEntrada(id)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = entrada ? `${etiquetaEntrada(entrada.id)} · ${entrada.titulo}` : 'Bitácora'
  }, [entrada])

  if (!entrada) {
    const item = INDICE.find((e) => e.id === id)
    return (
      <div className="py-10">
        <h1 className="text-2xl font-bold">{item ? item.titulo : 'Entrada no encontrada'}</h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          {item ? 'Esta entrada todavía no está escrita.' : 'Revisa el índice.'}
        </p>
      </div>
    )
  }

  const escritas = INDICE.filter((e) => disponible(e.id))
  const pos = escritas.findIndex((e) => e.id === entrada.id)
  const anterior = escritas[pos - 1]
  const siguiente = escritas[pos + 1]

  return (
    <article>
      <header className="mb-6 border-b border-stone-200 pb-4 dark:border-stone-800">
        <p className="font-mono text-sm text-teal-700 dark:text-teal-400">{etiquetaEntrada(entrada.id)}</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight sm:text-3xl">{entrada.titulo}</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          Taller: {entrada.taller} · Plan: {fechaLarga(entrada.plan)}
        </p>
        <ControlesEntrada id={entrada.id} />
        {(entrada.id === '1.6' || entrada.id === '1.7') && (
          <Link
            to="/explorador"
            className="mt-3 inline-block rounded-md border border-teal-600 px-3 py-1 text-sm text-teal-800 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950 print:hidden"
          >
            Abrir el explorador de transformaciones →
          </Link>
        )}
        <nav aria-label="Secciones" className="mt-4 flex flex-wrap gap-2 print:hidden">
          {entrada.secciones.map((s) => (
            <a
              key={s.titulo}
              href={`#${slug(s.titulo)}`}
              onClick={(ev) => {
                ev.preventDefault()
                document.getElementById(slug(s.titulo))?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="rounded-full border border-stone-300 px-3 py-0.5 text-xs hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
            >
              {s.titulo}
            </a>
          ))}
        </nav>
      </header>

      {entrada.intro && (
        <div className="contenido prose prose-stone dark:prose-invert mb-8 max-w-none text-lg">
          <Markdown>{entrada.intro}</Markdown>
        </div>
      )}

      {entrada.secciones.map((s) => (
        <section key={s.titulo} id={slug(s.titulo)} className="mb-10 scroll-mt-20">
          <h2 className="mb-3 text-xl font-bold text-teal-800 dark:text-teal-300">{s.titulo}</h2>
          {s.titulo === 'Practica' ? (
            <Practica id={entrada.id} cuerpo={s.cuerpo} />
          ) : (
            <div className="contenido prose prose-stone dark:prose-invert max-w-none">
              <Markdown>{s.cuerpo}</Markdown>
            </div>
          )}
        </section>
      ))}

      <nav className="mt-12 flex justify-between gap-4 border-t border-stone-200 pt-4 text-sm dark:border-stone-800 print:hidden">
        {anterior ? (
          <Link to={`/entrada/${anterior.id}`} className="hover:underline">
            ← {etiquetaEntrada(anterior.id)} {anterior.titulo}
          </Link>
        ) : (
          <span />
        )}
        {siguiente && (
          <Link to={`/entrada/${siguiente.id}`} className="text-right hover:underline">
            {etiquetaEntrada(siguiente.id)} {siguiente.titulo} →
          </Link>
        )}
      </nav>
    </article>
  )
}
