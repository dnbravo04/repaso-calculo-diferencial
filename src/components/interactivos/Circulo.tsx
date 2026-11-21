import { useState } from 'react'
import { Circle, Coordinates, Line, Mafs, MovablePoint, Plot, Point, labelPi } from 'mafs'
import { radianesTex, valoresExactos, type CirculoSpec } from '../../lib/interactivo'
import TextoMat from '../TextoMat'
import { Deslizador, Lectura, Marco, fmt, rotulo } from './comun'

const NOTABLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]
const AZUL = 'var(--g-azul)'
const NARANJA = 'var(--g-naranja)'
const VERDE = 'var(--g-verde)'

function cuadrante(g: number) {
  if (g % 90 === 0) return 'sobre un eje'
  return ['I', 'II', 'III', 'IV'][Math.floor(g / 90)]
}

/** Circunferencia unitaria: arrastra el punto; el coseno es su x y el seno su y. A la derecha, la onda del seno. */
export default function Circulo({ spec }: { spec: CirculoSpec }) {
  const [grados, setGrados] = useState(30)
  const t = (grados * Math.PI) / 180
  const c = Math.cos(t)
  const s = Math.sin(t)
  const exactos = valoresExactos(grados)
  // Valor exacto y, si no es un entero, también el decimal: "√2/2 ≈ 0,707"; "1" se queda solo.
  const valor = (exacto: string | undefined, v: number) =>
    exacto && !exacto.includes('\\') ? exacto : `${exacto ? `${exacto} \\approx ` : ''}${fmt(v, 3)}`
  const ref = grados % 180 <= 90 ? grados % 180 : 180 - (grados % 180)

  const mover = ([x, y]: [number, number]) => {
    let g = (Math.atan2(y, x) * 180) / Math.PI
    if (g < 0) g += 360
    const cerca = Math.round(g / 15) * 15
    setGrados(Math.abs(g - cerca) < 3 ? cerca % 360 : Math.round(g))
  }

  return (
    <Marco titulo="circunferencia unitaria" descripcion={spec.descripcion}>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="overflow-hidden rounded-md">
          <Mafs viewBox={{ x: [-1.3, 1.3], y: [-1.3, 1.3] }} preserveAspectRatio="contain" height={300} pan={false} zoom={false}>
            <Coordinates.Cartesian xAxis={{ lines: 0.5, labels: rotulo }} yAxis={{ lines: 0.5, labels: rotulo }} />
            <Circle center={[0, 0]} radius={1} color="var(--g-gris)" fillOpacity={0} weight={2} />
            {t > 0.01 && <Plot.Parametric xy={(u) => [0.25 * Math.cos(u), 0.25 * Math.sin(u)]} domain={[0, t]} color={VERDE} weight={2.5} />}
            <Line.Segment point1={[0, 0]} point2={[c, s]} color="var(--g-gris)" weight={2} />
            <Line.Segment point1={[0, 0]} point2={[c, 0]} color={AZUL} weight={5} />
            <Line.Segment point1={[c, 0]} point2={[c, s]} color={NARANJA} weight={5} />
            <MovablePoint
              point={[c, s]}
              color={VERDE}
              constrain={([x, y]) => {
                const r = Math.hypot(x, y) || 1
                return [x / r, y / r]
              }}
              onMove={mover}
            />
          </Mafs>
        </div>
        <div className="overflow-hidden rounded-md">
          <Mafs viewBox={{ x: [0, 2 * Math.PI], y: [-1.3, 1.3] }} preserveAspectRatio={false} height={300} pan={false} zoom={false}>
            <Coordinates.Cartesian xAxis={{ lines: Math.PI / 2, labels: labelPi }} yAxis={{ lines: 0.5, labels: rotulo }} />
            <Plot.OfX y={Math.sin} domain={[0, 2 * Math.PI]} color="var(--g-gris)" weight={1.5} style="dashed" />
            {t > 0.01 && <Plot.OfX y={Math.sin} domain={[0, t]} color={NARANJA} weight={3} />}
            <Line.Segment point1={[t, 0]} point2={[t, s]} color={NARANJA} weight={5} />
            <Point x={t} y={s} color={NARANJA} />
          </Mafs>
        </div>
      </div>

      <Deslizador
        etiqueta={<TextoMat>{'Ángulo $\\theta$ (o arrastra el punto verde)'}</TextoMat>}
        valor={grados}
        min={0}
        max={359}
        paso={1}
        alCambiar={setGrados}
        texto={`${grados}°`}
      />
      <div className="mt-2 flex flex-wrap gap-1" role="group" aria-label="Ángulos notables">
        {NOTABLES.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGrados(g)}
            aria-pressed={g === grados}
            className={`rounded-full border px-2 py-0.5 text-xs tabular-nums ${
              g === grados
                ? 'border-teal-700 bg-teal-700 text-white'
                : 'border-stone-300 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800'
            }`}
          >
            {g}°
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Lectura>
          <TextoMat>{`$\\theta = ${grados}^\\circ = ${radianesTex(grados)}$ · cuadrante ${cuadrante(grados)} · referencia $${ref}^\\circ$`}</TextoMat>
        </Lectura>
        <Lectura color={AZUL}>
          <TextoMat>{`$\\cos\\theta = ${valor(exactos?.cos, c)}$ (la $x$ del punto)`}</TextoMat>
        </Lectura>
        <Lectura color={NARANJA}>
          <TextoMat>{`$\\operatorname{sen}\\theta = ${valor(exactos?.sen, s)}$ (la $y$ del punto)`}</TextoMat>
        </Lectura>
        <Lectura>
          <TextoMat>
            {Math.abs(c) < 1e-9
              ? '$\\tan\\theta$ no existe: $\\cos\\theta = 0$'
              : `$\\tan\\theta = \\dfrac{\\operatorname{sen}\\theta}{\\cos\\theta} = ${valor(exactos?.tan, s / c)}$`}
          </TextoMat>
        </Lectura>
      </div>
    </Marco>
  )
}
