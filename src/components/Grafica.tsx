import { colorCss, validarGrafica, type GraficaSpec } from '../lib/grafica'
import LienzoMafs from './LienzoMafs'
import Markdown from './Markdown'
import TextoMat from './TextoMat'

/** Bloque ```grafica de una entrada: leyenda, lienzo y descripción en palabras (regla 5). */
export default function Grafica({ json }: { json: string }) {
  let g: GraficaSpec
  try {
    g = JSON.parse(json)
  } catch (err) {
    return <ErrorGrafica errores={[`El JSON del bloque está mal escrito: ${(err as Error).message}`]} />
  }
  const errores = validarGrafica(g)
  const graves = errores.filter((e) => !e.startsWith('Falta "descripcion"'))
  if (graves.length) return <ErrorGrafica errores={errores} />

  return (
    <figure className="grafica not-prose my-6 rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
      {import.meta.env.DEV && errores.length > 0 && <ErrorGrafica errores={errores} />}
      <Leyenda g={g} />
      <div className="overflow-hidden rounded-md">
        <LienzoMafs g={g} />
      </div>
      {g.descripcion && (
        <figcaption className="contenido prose prose-stone prose-sm dark:prose-invert mt-3 max-w-none">
          <Markdown>{g.descripcion}</Markdown>
        </figcaption>
      )}
    </figure>
  )
}

export function Leyenda({ g }: { g: Pick<GraficaSpec, 'funciones' | 'puntos' | 'asintotas'> }) {
  const hayAbiertos = (g.puntos ?? []).some((p) => p.abierto)
  const hayCerrados = (g.puntos ?? []).some((p) => !p.abierto)
  return (
    <ul className="mb-2 flex flex-wrap gap-x-5 gap-y-1 text-sm" aria-label="Leyenda">
      {g.funciones.map((f, i) => (
        <li key={i} className="flex items-center gap-2">
          <svg width="26" height="10" aria-hidden="true">
            <line
              x1="1"
              y1="5"
              x2="25"
              y2="5"
              stroke={colorCss(f.color)}
              strokeWidth={f.color === 'gris' ? 2 : 3}
              strokeDasharray={f.estilo === 'punteado' ? '5 4' : undefined}
              strokeLinecap="round"
            />
          </svg>
          <span>
            <TextoMat>{f.etiqueta}</TextoMat>
          </span>
        </li>
      ))}
      {(g.asintotas ?? []).length > 0 && (
        <li className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
          <svg width="26" height="10" aria-hidden="true">
            <line x1="1" y1="5" x2="25" y2="5" stroke="var(--g-asintota)" strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
          asíntota
        </li>
      )}
      {hayCerrados && (
        <li className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
          <svg width="12" height="12" aria-hidden="true">
            <circle cx="6" cy="6" r="4.5" fill="currentColor" />
          </svg>
          punto cerrado (pertenece)
        </li>
      )}
      {hayAbiertos && (
        <li className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
          <svg width="12" height="12" aria-hidden="true">
            <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          punto abierto (no pertenece)
        </li>
      )}
    </ul>
  )
}

function ErrorGrafica({ errores }: { errores: string[] }) {
  return (
    <div role="alert" className="my-3 rounded-md border-2 border-red-600 bg-red-50 p-3 text-sm text-red-900 dark:bg-red-950 dark:text-red-100">
      <p className="font-bold">Bloque grafica con problemas</p>
      <ul className="ml-5 list-disc">
        {errores.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </div>
  )
}
