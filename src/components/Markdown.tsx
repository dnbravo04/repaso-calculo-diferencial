import { Suspense, lazy } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkDirective from 'remark-directive'
import rehypeKatex from 'rehype-katex'
import remarkPaso from '../lib/remarkPaso'
import { KATEX_MACROS } from '../lib/katex'

// Mafs y mathjs pesan; se cargan solo cuando una entrada trae una gráfica.
const Grafica = lazy(() => import('./Grafica'))

const remarkPlugins = [remarkGfm, remarkMath, remarkDirective, remarkPaso]
const rehypePlugins: Parameters<typeof ReactMarkdown>[0]['rehypePlugins'] = [
  [rehypeKatex, { macros: KATEX_MACROS, throwOnError: false, strict: false }],
]

type NodoHast = { type: string; tagName?: string; value?: string; properties?: { className?: unknown }; children?: NodoHast[] }

const textoDe = (n: NodoHast): string => (n.type === 'text' ? (n.value ?? '') : (n.children ?? []).map(textoDe).join(''))

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      components={{
        // Tablas anchas: scroll horizontal dentro de su caja, no desborde de página.
        table: ({ node: _node, ...props }) => (
          <div className="tabla-scroll">
            <table {...props} />
          </div>
        ),
        // ```grafica → componente con Mafs.
        pre: ({ node, ...props }) => {
          const code = (node as NodoHast | undefined)?.children?.find((c) => c.tagName === 'code')
          const clases = code?.properties?.className
          if (code && Array.isArray(clases) && clases.includes('language-grafica')) {
            return (
              <Suspense fallback={<div className="my-6 h-80 animate-pulse rounded-xl bg-stone-200/60 dark:bg-stone-800" />}>
                <Grafica json={textoDe(code)} />
              </Suspense>
            )
          }
          return <pre {...props} />
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
