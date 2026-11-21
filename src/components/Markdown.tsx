import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkDirective from 'remark-directive'
import rehypeKatex from 'rehype-katex'
import remarkPaso from '../lib/remarkPaso'
import { KATEX_MACROS } from '../lib/katex'

const remarkPlugins = [remarkGfm, remarkMath, remarkDirective, remarkPaso]
const rehypePlugins: Parameters<typeof ReactMarkdown>[0]['rehypePlugins'] = [
  [rehypeKatex, { macros: KATEX_MACROS, throwOnError: false, strict: false }],
]

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
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
