import { visit } from 'unist-util-visit'
import type { Root, Parent, RootContent } from 'mdast'

// Convierte `:::paso` (remark-directive) en una tarjeta:
//   <div class="paso"><div class="paso-formula">…</div><div class="paso-razon">…</div></div>
// Las directivas de texto que no son nuestras (p. ej. "a:b") se devuelven como texto.

interface Directiva extends Parent {
  type: 'containerDirective' | 'leafDirective' | 'textDirective'
  name: string
  attributes?: Record<string, string | null | undefined>
  data?: { hName?: string; hProperties?: Record<string, string[]> }
}

export default function remarkPaso() {
  return (tree: Root) => {
    visit(tree, (node, index, parent) => {
      const n = node as unknown as Directiva
      if (n.type !== 'containerDirective' && n.type !== 'leafDirective' && n.type !== 'textDirective') return

      if (n.type === 'containerDirective' && n.name === 'paso') {
        const formula = n.children.filter((c) => c.type === 'math')
        const razon = n.children.filter((c) => c.type !== 'math')
        n.data = { hName: 'div', hProperties: { className: ['paso'] } }
        n.children = [
          { type: 'pasoParte', data: { hName: 'div', hProperties: { className: ['paso-formula'] } }, children: formula },
          { type: 'pasoParte', data: { hName: 'div', hProperties: { className: ['paso-razon'] } }, children: razon },
        ] as unknown as RootContent[]
        return
      }

      // Directiva desconocida: restaurar el texto original.
      if (parent && typeof index === 'number') {
        const texto = { type: 'text', value: (n.type === 'textDirective' ? ':' : '::') + n.name } as RootContent
        ;(parent as Parent).children.splice(index, 1, texto, ...(n.children as RootContent[]))
      }
    })
  }
}
