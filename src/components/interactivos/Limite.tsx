import { useState } from 'react'
import { Coordinates, Line, Mafs, Plot, Point } from 'mafs'
import { compilar, num } from '../../lib/grafica'
import type { LimiteSpec } from '../../lib/interactivo'
import TextoMat from '../TextoMat'
import { Deslizador, Lectura, Marco, ejes, fmt } from './comun'

const AZUL = 'var(--g-azul)'
const NARANJA = 'var(--g-naranja)'
const VERDE = 'var(--g-verde)'
const GUIA = 'var(--g-asintota)'

/** Dos puntos se acercan a x = a, uno por cada lado; sus alturas se acercan a L aunque en a no haya nada. */
export default function Limite({ spec }: { spec: LimiteSpec }) {
  const f = compilar(spec.expr)
  const a = num(spec.a)
  const L = num(spec.L)
  const [x0, x1] = spec.vista.x.map(num)
  const [y0, y1] = spec.vista.y.map(num)
  const dMax = (x1 - x0) / 4
  const [p, setP] = useState(0) // 0 → lejos, 100 → muy cerca
  const d = dMax * 10 ** ((-3 * p) / 100)
  const dec = Math.min(6, Math.max(2, Math.ceil(-Math.log10(d)) + 2))
  const xi = a - d
  const xd = a + d
  const eps = (x1 - x0) * 1e-4

  const guias = (x: number, color: string) => (
    <>
      <Line.Segment point1={[x, 0]} point2={[x, f(x)]} color={color} style="dashed" weight={1.5} />
      <Line.Segment point1={[0, f(x)]} point2={[x, f(x)]} color={color} style="dashed" weight={1.5} />
    </>
  )

  return (
    <Marco titulo="un límite de cerca" descripcion={spec.descripcion}>
      <div className="overflow-hidden rounded-md">
        <Mafs viewBox={{ x: [x0, x1], y: [y0, y1], padding: 0.25 }} preserveAspectRatio={false} height={300} pan={false} zoom={false}>
          <Coordinates.Cartesian {...ejes([x0, x1], [y0, y1])} />
          <Line.ThroughPoints point1={[0, L]} point2={[1, L]} color={GUIA} style="dashed" weight={1} />
          <Plot.OfX y={f} domain={[x0, a - eps]} color={AZUL} weight={3} />
          <Plot.OfX y={f} domain={[a + eps, x1]} color={AZUL} weight={3} />
          {guias(xi, NARANJA)}
          {guias(xd, VERDE)}
          <Point x={a} y={L} color={AZUL} svgCircleProps={{ stroke: AZUL, strokeWidth: 2.5, r: 6, style: { fill: 'var(--mafs-bg)' } }} />
          <Point x={xi} y={f(xi)} color={NARANJA} />
          <Point x={xd} y={f(xd)} color={VERDE} />
        </Mafs>
      </div>

      <Deslizador
        etiqueta={<TextoMat>{`Acerca $x$ a $${fmt(a, 4)}$`}</TextoMat>}
        valor={p}
        min={0}
        max={100}
        paso={1}
        alCambiar={setP}
        texto={`distancia ${fmt(d, dec)}`}
      />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Lectura color={NARANJA}>
          <TextoMat>{`Por la izquierda: $f(${fmt(xi, dec)}) = ${fmt(f(xi), dec)}$`}</TextoMat>
        </Lectura>
        <Lectura color={VERDE}>
          <TextoMat>{`Por la derecha: $f(${fmt(xd, dec)}) = ${fmt(f(xd), dec)}$`}</TextoMat>
        </Lectura>
      </div>
      <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
        <TextoMat>{`Las dos alturas se acercan a $L = ${fmt(L, 4)}$, aunque $f(x) = ${spec.tex}$ no está definida en $x = ${fmt(a, 4)}$ (el círculo vacío).`}</TextoMat>
      </p>
    </Marco>
  )
}
