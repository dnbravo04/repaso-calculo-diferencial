// Macros de respaldo: si alguien escribe \sen, KaTeX lo muestra como "sen".
export const KATEX_MACROS: Record<string, string> = {
  '\\sen': '\\operatorname{sen}',
  '\\senh': '\\operatorname{senh}',
  '\\arcsen': '\\operatorname{arcsen}',
  '\\Dom': '\\operatorname{Dom}',
  '\\Img': '\\operatorname{Img}',
}
