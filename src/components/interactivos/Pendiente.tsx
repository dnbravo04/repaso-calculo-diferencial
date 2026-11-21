import { useState } from 'react'
import { Coordinates, Line, Mafs, MovablePoint, Plot, Point } from 'mafs'
import { compilar, num } from '../../lib/grafica'
import type { PendienteSpec } from '../../lib/interactivo'
import TextoMat from '../TextoMat'
import { Deslizador, Lectura, Marco, ejes, fmt } from './comun'

const AZUL = 'var(--g-azul)'
const NARANJA = 'var(--g-naranja)'
const VERDE = 'var(--g-verde)'

/** Arriba, la tangente a f en x₀; abajo, el punto (x₀, f'(x₀)): al moverlo va dibujando la derivada. */
export default function Pendiente({ spec }: { spec: PendienteSpec }) {
  const f = compilar(spec.expr)
  const d = compilar(spec.derivada)
  const [x0, x1] = spec.vista.x.map(num)
  const [y0, y1] = spec.vista.y.map(num)
  const [dy0, dy1] = spec.vistaDerivada.y.map(num)
  const margen = (x1 - x0) * 0.05
  const lo = x0 + margen
  const hi = x1 - margen
  const paso = (x1 - x0) / 400
  const [x, setX] = useState(Number((lo + (hi - lo) * 0.15).toFixed(2)))
  const y = f(x)
  const m = d(x)
  const plano = Math.abs(m) < 0.03

  const fijar = (v: number) => setX(Math.min(hi, Math.max(lo, v)))

  return (
    <Marco titulo="la derivada es la pendiente" descripcion={spec.descripcion}>
      <div className="overflow-hidden rounded-md">
        <Mafs viewBox={{ x: [x0, x1], y: [y0, y1], padding: 0.25 }} preserveAspectRatio={false} height={260} pan={false} zoom={false}>
          <Coordinates.Cartesian {...ejes([x0, x1], [y0, y1])} />
          <Plot.OfX y={f} color={AZUL} weight={3} />
          <Line.ThroughPoints point1={[x, y]} point2={[x + 1, y + m]} color={NARANJA} weight={2.5} />
          <MovablePoint point={[x, y]} color={AZUL} constrain={([px]) => [Math.min(hi, Math.max(lo, px)), f(Math.min(hi, Math.max(lo, px)))]} onMove={([px]) => fijar(px)} />
        </Mafs>
      </div>
      <p className="mt-1 text-xs font-semibold text-stone-600 dark:text-stone-400">
        <TextoMat>{`Abajo: la gráfica de $f'(x) = ${spec.texDerivada}$, que se va dibujando`}</TextoMat>
      </p>
      <div className="mt-1 overflow-hidden rounded-md">
        <Mafs viewBox={{ x: [x0, x1], y: [dy0, dy1], padding: 0.25 }} preserveAspectRatio={false} height={200} pan={false} zoom={false}>
          <Coordinates.Cartesian {...ejes([x0, x1], [dy0, dy1])} />
          <Plot.OfX y={d} color="var(--g-gris)" weight={1.5} style="dashed" />
          {x > x0 + paso && <Plot.OfX y={d} domain={[x0, x]} color={VERDE} weight={3} />}
          <Line.Segment point1={[x, 0]} point2={[x, m]} color={NARANJA} weight={3} />
          <Point x={x} y={m} color={VERDE} />
        </Mafs>
      </div>

      <Deslizador
        etiqueta={<TextoMat>{'Mueve $x_0$ (o arrastra el punto azul)'}</TextoMat>}
        valor={x}
        min={lo}
        max={hi}
        paso={paso}
        alCambiar={fijar}
        texto={`x₀ = ${fmt(x, 2)}`}
      />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Lectura color={AZUL}>
          <TextoMat>{`Punto: $\\big(${fmt(x, 2)};\\ ${fmt(y, 3)}\\big)$ sobre $f(x) = ${spec.tex}$`}</TextoMat>
        </Lectura>
        <Lectura color={NARANJA}>
          <TextoMat>{`Pendiente de la tangente: $f'(${fmt(x, 2)}) = ${fmt(m, 3)}$`}</TextoMat>
        </Lectura>
      </div>
      <p className="mt-2 text-sm text-stone-700 dark:text-stone-300" aria-live="polite">
        {plano
          ? 'Tangente horizontal: la pendiente es 0 y la gráfica de la derivada cruza el eje x.'
          : m > 0
            ? 'La curva sube aquí: la pendiente es positiva y el punto verde está arriba del eje x.'
            : 'La curva baja aquí: la pendiente es negativa y el punto verde está debajo del eje x.'}
      </p>
    </Marco>
  )
}
