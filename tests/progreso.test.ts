import { describe, expect, it } from 'vitest'
import {
  describirSerie,
  diasEntre,
  estadoDe,
  exportar,
  importar,
  ponerCuaderno,
  ponerPalabras,
  ponerSemaforo,
  progresoVacio,
  serieDiaria,
  sumarDias,
} from '../src/lib/progreso'
import {
  diasParaFinal,
  entradasAtrasadas,
  entradasDeHoy,
  entradasEnRojo,
  esDiaDeRepaso,
  proximoDia,
} from '../src/lib/plan'
import { CLAVE, escribirGuardado, leerGuardado } from '../src/lib/almacen'
import { INDICE } from '../src/lib/indice'

// Fechas a mediodía local, para que el día no cambie con la zona horaria.
const d = (iso: string) => new Date(`${iso}T12:00:00`)

describe('estado por entrada', () => {
  it('el semáforo y el cuaderno guardan un registro con fecha de cada cambio', () => {
    let p = progresoVacio(d('2026-11-21'))
    p = ponerSemaforo(p, '1.1', 'rojo', d('2026-11-21'))
    p = ponerSemaforo(p, '1.1', 'verde', d('2026-11-23'))
    p = ponerCuaderno(p, '1.1', true, d('2026-11-23'))
    expect(estadoDe(p, '1.1')).toEqual({ semaforo: 'verde', cuaderno: true, palabras: '' })
    expect(p.historial.map((e) => [e.tipo, e.valor])).toEqual([
      ['semaforo', 'rojo'],
      ['semaforo', 'verde'],
      ['cuaderno', true],
    ])
  })

  it('repetir el mismo valor no ensucia el historial', () => {
    let p = ponerSemaforo(progresoVacio(), '0', 'amarillo')
    const q = ponerSemaforo(p, '0', 'amarillo')
    expect(q).toBe(p)
    p = ponerCuaderno(p, '0', false)
    expect(p.historial).toHaveLength(1)
  })

  it('"Dilo con tus palabras" se guarda sin crear registros', () => {
    const p = ponerPalabras(progresoVacio(), 'T', 'Porque el punto está en la circunferencia de radio 1.')
    expect(estadoDe(p, 'T').palabras).toMatch(/radio 1/)
    expect(p.historial).toHaveLength(0)
  })

  it('una entrada sin datos devuelve el estado vacío', () => {
    expect(estadoDe(progresoVacio(), '4.9')).toEqual({ semaforo: null, cuaderno: false, palabras: '' })
  })
})

describe('serie diaria (Mi progreso)', () => {
  it('cuenta 🟢 y cuaderno al final de cada día, desde el primer registro', () => {
    let p = progresoVacio(d('2026-11-20'))
    p = ponerSemaforo(p, '0', 'verde', d('2026-11-21'))
    p = ponerSemaforo(p, 'T', 'amarillo', d('2026-11-21'))
    p = ponerCuaderno(p, '0', true, d('2026-11-22'))
    p = ponerSemaforo(p, 'T', 'verde', d('2026-11-24'))
    p = ponerSemaforo(p, '0', 'rojo', d('2026-11-24'))
    expect(serieDiaria(p, '2026-11-25')).toEqual([
      { fecha: '2026-11-21', verdes: 1, cuaderno: 0 },
      { fecha: '2026-11-22', verdes: 1, cuaderno: 1 },
      { fecha: '2026-11-23', verdes: 1, cuaderno: 1 },
      { fecha: '2026-11-24', verdes: 1, cuaderno: 1 },
      { fecha: '2026-11-25', verdes: 1, cuaderno: 1 },
    ])
  })

  it('sin registros no hay serie', () => {
    expect(serieDiaria(progresoVacio(), '2026-11-25')).toEqual([])
  })

  it('la descripción compara solo con el punto de partida, nunca con otros', () => {
    const texto = describirSerie([
      { fecha: '2026-11-21', verdes: 1, cuaderno: 0 },
      { fecha: '2026-11-24', verdes: 4, cuaderno: 6 },
    ])
    expect(texto).toMatch(/eje horizontal/i)
    expect(texto).toMatch(/eje vertical/i)
    expect(texto).toMatch(/azul/)
    expect(texto).toMatch(/naranja/)
    expect(texto).toMatch(/\+3 desde tu punto de partida/)
    expect(texto).not.toMatch(/promedio|compañer|otros estudiantes|percentil/i)
  })
})

describe('fechas', () => {
  it('días entre fechas y sumar días cruzan bien el cambio de mes', () => {
    expect(diasEntre('2026-11-28', '2026-12-03')).toBe(5)
    expect(sumarDias('2026-11-30', 1)).toBe('2026-12-01')
  })
})

describe('plan (Hoy y Modo repaso)', () => {
  it('días para el final', () => {
    expect(diasParaFinal('2026-11-20')).toBe(21)
    expect(diasParaFinal('2026-12-11')).toBe(0)
  })

  it('el plan sigue la tabla de CLAUDE.md', () => {
    expect(entradasDeHoy('2026-11-21').map((e) => e.id)).toEqual(['0', 'T', '1.1', '1.2'])
    expect(entradasDeHoy('2026-11-24').map((e) => e.id)).toEqual(['1.7', '1.8'])
    expect(entradasDeHoy('2026-12-03').map((e) => e.id)).toEqual(['3.11'])
    // Cada unidad queda dentro de su rango de fechas.
    const rango = { 1: ['2026-11-21', '2026-11-24'], 2: ['2026-11-25', '2026-11-27'], 3: ['2026-11-28', '2026-12-03'], 4: ['2026-12-04', '2026-12-09'] } as const
    for (const e of INDICE.filter((e) => e.unidad > 0)) {
      const [a, b] = rango[e.unidad as 1 | 2 | 3 | 4]
      expect(e.plan >= a && e.plan <= b, e.id).toBe(true)
    }
    // Ningún día tiene más de dos entradas (salvo el 21, que junta Parte 0 y T con 1.1–1.2).
    const porDia = new Map<string, number>()
    for (const e of INDICE) porDia.set(e.plan, (porDia.get(e.plan) ?? 0) + 1)
    for (const [dia, n] of porDia) if (dia !== '2026-11-21') expect(n, dia).toBeLessThanOrEqual(2)
  })

  it('atrasadas: el día ya pasó y no está pasada al cuaderno', () => {
    let p = progresoVacio()
    p = ponerCuaderno(p, '1.1', true)
    p = ponerSemaforo(p, '1.2', 'verde') // el semáforo no cuenta: falta el cuaderno
    const ids = entradasAtrasadas('2026-11-23', p).map((e) => e.id)
    expect(ids).toEqual(['0', 'T', '1.2', '1.3', '1.4'])
  })

  it('si hoy no hay nada, muestra el siguiente día del plan', () => {
    expect(proximoDia('2026-11-20')).toMatchObject({ fecha: '2026-11-21' })
    expect(proximoDia('2026-12-09')).toBeNull()
  })

  it('Modo repaso lista solo las 🔴 y el 10 de diciembre es día de repaso', () => {
    let p = ponerSemaforo(progresoVacio(), '1.6', 'rojo')
    p = ponerSemaforo(p, '1.7', 'amarillo')
    expect(entradasEnRojo(p).map((e) => e.id)).toEqual(['1.6'])
    expect(esDiaDeRepaso('2026-12-10')).toBe(true)
  })
})

describe('exportar e importar', () => {
  it('ida y vuelta sin pérdidas', () => {
    let p = ponerSemaforo(progresoVacio(), '1.3', 'amarillo')
    p = ponerPalabras(p, '1.3', 'Primero g, luego f.')
    expect(importar(exportar(p))).toEqual(p)
  })

  it('rechaza archivos que no son de la bitácora, con mensaje en español', () => {
    expect(() => importar('no es json')).toThrow(/JSON válido/)
    expect(() => importar('{"a":1}')).toThrow(/version/)
    const malo = { ...progresoVacio(), entradas: { '1.1': { semaforo: 'azul', cuaderno: false, palabras: '' } } }
    expect(() => importar(JSON.stringify(malo))).toThrow(/1\.1/)
  })
})

describe('localStorage con try/catch', () => {
  const memoria = () => {
    const m = new Map<string, string>()
    return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) }
  }

  it('lo que se escribe se recupera al "recargar"', () => {
    const s = memoria()
    const p = ponerSemaforo(progresoVacio(), '0', 'verde')
    expect(escribirGuardado(p, s)).toBe(true)
    expect(leerGuardado(s)).toEqual(p)
  })

  it('si el almacenamiento falla o tiene basura, no rompe la app', () => {
    const roto = {
      getItem: () => {
        throw new Error('SecurityError')
      },
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    }
    expect(leerGuardado(roto).historial).toEqual([])
    expect(escribirGuardado(progresoVacio(), roto)).toBe(false)
    expect(leerGuardado({ getItem: (k: string) => (k === CLAVE ? '{basura' : null) }).entradas).toEqual({})
    expect(leerGuardado(undefined).entradas).toEqual({})
  })
})
