import katex from 'katex'
import { KATEX_MACROS } from '../lib/katex'

/** Texto corto con fórmulas $…$ en línea (leyendas, rótulos). El contenido es nuestro, no del usuario. */
export default function TextoMat({ children }: { children: string }) {
  const partes = children.split(/(\$[^$]+\$)/g)
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith('$') && p.endsWith('$') && p.length > 2 ? (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(p.slice(1, -1), { throwOnError: false, macros: { ...KATEX_MACROS } }),
            }}
          />
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}
