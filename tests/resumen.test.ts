import { describe, expect, it } from 'vitest'
import { ponerCuaderno, ponerSemaforo, progresoVacio } from '../src/lib/progreso'
import { INDICE } from '../src/lib/indice'
import { DIA_FINAL } from '../src/lib/plan'
import { PRIMER_DIA, contar, diasDelPlan, nivelActividad, porUnidad, racha } from '../src/lib/resumen'

const d = (iso: string) => new Date(`${iso}T12:00:00`)

describe('conteos por semáforo', () => {
  it('cada entrada cae en un solo color y las sin marcar cuentan como "nada"', () => {
    let p = progresoVacio()
    p = ponerSemaforo(p, '1.1', 'verde')
    p = ponerSemaforo(p, '1.2', 'rojo')
    p = ponerCuaderno(p, '1.2', true)
    const c = contar(INDICE, p)
    expect(c).toMatchObject({ verde: 1, amarillo: 0, rojo: 1, cuaderno: 1, total: INDICE.length })
    expect(c.verde + c.amarillo + c.rojo + c.nada).toBe(INDICE.length)
  })

  it('las unidades suman el curso completo', () => {
    const total = porUnidad(progresoVacio()).reduce((s, u) => s + u.conteo.total, 0)
    expect(total).toBe(INDICE.length)
  })
})

describe('calendario del plan', () => {
  it('va del primer día del plan al día del final, sin huecos', () => {
    const dias = diasDelPlan('2026-11-21', progresoVacio())
    expect(dias[0].fecha).toBe(PRIMER_DIA)
    expect(dias.at(-1)!.fecha).toBe(DIA_FINAL)
    expect(dias.reduce((s, x) => s + x.entradas.length, 0)).toBe(INDICE.length)
  })

  it('marca hecho, atrasado y pendiente según el cuaderno y la fecha', () => {
    let p = progresoVacio()
    p = ponerCuaderno(p, '1.3', true)
    p = ponerCuaderno(p, '1.4', true) // 22 nov completo
    p = ponerCuaderno(p, '1.5', true) // 23 nov a medias
    const dias = new Map(diasDelPlan('2026-11-24', p).map((x) => [x.fecha, x]))
    expect(dias.get('2026-11-21')!.estado).toBe('atrasado')
    expect(dias.get('2026-11-22')!.estado).toBe('hecho')
    expect(dias.get('2026-11-23')).toMatchObject({ estado: 'atrasado', hechas: 1 })
    expect(dias.get('2026-11-24')!.estado).toBe('pendiente')
    expect(dias.get('2026-12-10')!.estado).toBe('libre')
  })
})

describe('racha', () => {
  it('cuenta días seguidos y no se rompe si hoy todavía no hay nada', () => {
    let p = progresoVacio()
    p = ponerSemaforo(p, '1.1', 'rojo', d('2026-11-21'))
    p = ponerSemaforo(p, '1.2', 'rojo', d('2026-11-22'))
    p = ponerSemaforo(p, '1.3', 'rojo', d('2026-11-23'))
    expect(racha(p, '2026-11-23')).toBe(3)
    expect(racha(p, '2026-11-24')).toBe(3)
    expect(racha(p, '2026-11-25')).toBe(0)
  })

  it('niveles de actividad', () => {
    expect([0, 1, 3, 7, 20].map(nivelActividad)).toEqual([0, 1, 2, 3, 4])
  })
})
