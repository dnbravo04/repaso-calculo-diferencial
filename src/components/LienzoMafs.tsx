import { Coordinates, LaTeX, Line, Mafs, Plot, Point, Text, labelPi, useTransformContext } from 'mafs'
import 'mafs/core.css'
import { colorCss, num, segmentos, type ColorNombre, type GraficaSpec } from '../lib/grafica'

/** Paso de la cuadrícula: entre ~5 y ~12 líneas en el rango visible. */
function pasoCuadricula(rango: number): number {
  for (const p of [0.25, 0.5, 1, 2, 5, 10, 20, 50]) if (rango / p <= 12) return p
  return 100
}

const DESPLAZAMIENTO: Record<string, [number, number]> = {
  n: [0, 1], s: [0, -1], e: [1, 0], o: [-1, 0], ne: [1, 1], no: [-1, 1], se: [1, -1], so: [-1, -1],
}

/** Dibuja una GraficaSpec ya validada: cuadrícula, ejes rotulados, curvas, asíntotas y puntos. */
export default function LienzoMafs({ g }: { g: GraficaSpec }) {
  const [x0, x1] = g.vista.x.map(num)
  const [y0, y1] = g.vista.y.map(num)
  const pasoX = g.radianes ? (x1 - x0 > 4 * Math.PI ? Math.PI : Math.PI / 2) : pasoCuadricula(x1 - x0)
  const pasoY = pasoCuadricula(y1 - y0)
  const colorPuntos: ColorNombre = g.funciones.find((f) => f.color !== 'gris')?.color ?? g.funciones[0].color

  return (
    <Mafs
      viewBox={{ x: [x0, x1], y: [y0, y1], padding: 0.25 }}
      preserveAspectRatio={false}
      height={g.alto ?? 320}
      pan={false}
      zoom={false}
    >
      <Coordinates.Cartesian
        xAxis={{ lines: pasoX, labels: g.radianes ? labelPi : (n) => (Math.abs(n) < 1e-9 ? '' : fmt(n)) }}
        yAxis={{ lines: pasoY, labels: (n) => (Math.abs(n) < 1e-9 ? '' : fmt(n)) }}
      />

      {/* Títulos de los ejes */}
      <Text x={x1} y={0} attach="nw" attachDistance={10} size={15} color="var(--mafs-fg)">
        {g.ejes?.x ?? 'x'}
      </Text>
      <Text x={0} y={y1} attach="se" attachDistance={10} size={15} color="var(--mafs-fg)">
        {g.ejes?.y ?? 'y'}
      </Text>

      {(g.asintotas ?? []).map((a, i) =>
        a.tipo === 'vertical' ? (
          <Line.ThroughPoints key={i} point1={[num(a.valor), 0]} point2={[num(a.valor), 1]} style="dashed" color="var(--g-asintota)" weight={1.5} />
        ) : (
          <Line.ThroughPoints key={i} point1={[0, num(a.valor)]} point2={[1, num(a.valor)]} style="dashed" color="var(--g-asintota)" weight={1.5} />
        ),
      )}

      {g.funciones.map((f, i) =>
        segmentos(f, g).map((s, k) => (
          <Plot.OfX
            key={`${i}-${k}`}
            y={(x) => {
              const v = s.fn(x)
              // Recorta valores enormes cerca de asíntotas: quedan fuera de la vista igual.
              return Math.max(y0 - 10 * (y1 - y0), Math.min(y1 + 10 * (y1 - y0), v))
            }}
            domain={s.dominio}
            color={colorCss(f.color)}
            weight={f.color === 'gris' ? 2 : 3}
            style={f.estilo === 'punteado' ? 'dashed' : 'solid'}
          />
        )),
      )}

      {(g.puntos ?? []).map((p, i) => {
        const x = num(p.x)
        const y = num(p.y)
        const color = colorCss(p.color ?? colorPuntos)
        const [ox, oy] = DESPLAZAMIENTO[p.posicion ?? 'ne']
        return (
          <g key={i}>
            <Point
              x={x}
              y={y}
              color={color}
              svgCircleProps={
                p.abierto
                  ? { stroke: color, strokeWidth: 2.5, r: 6, style: { fill: 'var(--mafs-bg)' } }
                  : { r: 6, stroke: 'var(--mafs-bg)', strokeWidth: 2 }
              }
            />
            {p.etiqueta && <EtiquetaPunto x={x} y={y} tex={p.etiqueta} dir={[ox, oy]} />}
          </g>
        )
      })}
    </Mafs>
  )
}

/** Ancho aproximado (px) de un rótulo TeX corto como "\left(\tfrac{3}{2}, 1\right)". */
function anchoTex(tex: string): number {
  const visible = tex
    .replace(/\\left|\\right|\\,|\\;|\\ /g, '')
    .replace(/\\[td]?frac\{[^}]*\}\{[^}]*\}/g, '##')
    .replace(/\\[a-zA-Z]+/g, '#')
    .replace(/[{}^_]/g, '')
  return visible.length * 7.5
}

/** Rótulo LaTeX colocado a una distancia fija en píxeles del punto, en la dirección pedida. */
function EtiquetaPunto({ x, y, tex, dir }: { x: number; y: number; tex: string; dir: [number, number] }) {
  const { viewTransform } = useTransformContext()
  const sx = Math.abs(viewTransform[0]) || 1
  const sy = Math.abs(viewTransform[4]) || 1
  const w = anchoTex(tex)
  const h = /frac/.test(tex) ? 26 : 18
  const px = dir[0] * (w / 2 + 9)
  const py = dir[1] * (h / 2 + 7)
  return <LaTeX at={[x + px / sx, y + py / sy]} tex={tex} color="var(--mafs-fg)" />
}

function fmt(n: number): string {
  const r = Math.round(n * 100) / 100
  return r < 0 ? `−${String(-r).replace('.', ',')}` : String(r).replace('.', ',')
}
