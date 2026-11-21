import { useState } from 'react'
import { Coordinates, Line, Mafs, Plot, Point } from 'mafs'
import { compilar, num } from '../../lib/grafica'
import type { SecanteSpec } from '../../lib/interactivo'
import TextoMat from '../TextoMat'
import { Deslizador, Lectura, Marco, ejes, fmt } from './comun'

const AZUL = 'var(--g-azul)'
const NARANJA = 'var(--g-naranja)'
const VERDE = 'var(--g-verde)'

/** La secante por x = a y x = a + h gira hasta pegarse a la tangente cuando h se achica. */
export default function Secante({ spec }: { spec: SecanteSpec }) {
  const f = compilar(spec.expr)
  const a = num(spec.a)
  const m = num(spec.derivada)
  const [x0, x1] = spec.vista.x.map(num)
  const [y0, y1] = spec.vista.y.map(num)
  const [p, setP] = useState(0)
  const [izquierda, setIzquierda] = useState(false)
  const habs = spec.hMax * 10 ** ((-3 * p) / 100)
  const h = izquierda ? -habs : habs
  const dec = Math.min(6, Math.max(2, Math.ceil(-Math.log10(habs)) + 2))
  const fa = f(a)
  const fb = f(a + h)
  const ms = (fb - fa) / h
  const izquierdaValida = Number.isFinite(f(a - spec.hMax))

  return (
    <Marco titulo="de la secante a la tangente" descripcion={spec.descripcion}>
      <div className="overflow-hidden rounded-md">
        <Mafs viewBox={{ x: [x0, x1], y: [y0, y1], padding: 0.25 }} preserveAspectRatio={false} height={300} pan={false} zoom={false}>
          <Coordinates.Cartesian {...ejes([x0, x1], [y0, y1])} />
          <Plot.OfX y={f} color={AZUL} weight={3} />
          <Line.ThroughPoints point1={[a, fa]} point2={[a + 1, fa + m]} color={VERDE} style="dashed" weight={2} />
          <Line.ThroughPoints point1={[a, fa]} point2={[a + h, fb]} color={NARANJA} weight={2.5} />
          <Point x={a} y={fa} color={AZUL} />
          <Point x={a + h} y={fb} color={NARANJA} />
        </Mafs>
      </div>

      <Deslizador
        etiqueta={<TextoMat>{'Achica $h$'}</TextoMat>}
        valor={p}
        min={0}
        max={100}
        paso={1}
        alCambiar={setP}
        texto={`h = ${fmt(h, dec)}`}
      />
      {izquierdaValida && (
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={izquierda} onChange={(e) => setIzquierda(e.target.checked)} className="accent-teal-600" />
          <TextoMat>{'Usar $h$ negativo (acercarse por la izquierda)'}</TextoMat>
        </label>
      )}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Lectura color={NARANJA}>
          <TextoMat>{`Secante: $\\dfrac{f(a + h) - f(a)}{h} = ${fmt(ms, dec)}$`}</TextoMat>
        </Lectura>
        <Lectura color={VERDE}>
          <TextoMat>{`Tangente: $f'(${fmt(a, 4)}) = ${fmt(m, 4)}$`}</TextoMat>
        </Lectura>
      </div>
      <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
        <TextoMat>{`Diferencia entre las dos pendientes: $${fmt(Math.abs(ms - m), dec)}$. Con $f(x) = ${spec.tex}$ y $a = ${fmt(a, 4)}$.`}</TextoMat>
      </p>
    </Marco>
  )
}
