// Índice completo del curso, en el orden del programa.
// `archivo` es el nombre del .md en src/content (sin extensión).

export interface EntradaIndice {
  id: string
  unidad: number
  titulo: string
  taller: string
  plan: string // YYYY-MM-DD
  archivo: string
}

export interface Grupo {
  unidad: number
  nombre: string
}

export const GRUPOS: Grupo[] = [
  { unidad: 0, nombre: 'Bases' },
  { unidad: 1, nombre: 'Unidad 1 — Funciones' },
  { unidad: 2, nombre: 'Unidad 2 — Límites y continuidad' },
  { unidad: 3, nombre: 'Unidad 3 — Derivadas' },
  { unidad: 4, nombre: 'Unidad 4 — Aplicaciones de la derivada' },
]

const e = (
  id: string,
  unidad: number,
  titulo: string,
  taller: string,
  plan: string,
): EntradaIndice => ({
  id,
  unidad,
  titulo,
  taller,
  plan,
  archivo: id === '0' ? 'parte-0' : id === 'T' ? 'parte-t' : id.replace('.', '-'),
})

export const INDICE: EntradaIndice[] = [
  e('0', 0, 'Despeje de ecuaciones', '—', '2026-11-21'),
  e('T', 0, 'Trigonometría a fondo', '—', '2026-11-21'),

  e('1.1', 1, 'Definición, dominio y rango', 'TF 1–12', '2026-11-21'),
  e('1.2', 1, 'Gráficas, recta vertical, rectas y parábolas', 'TF 13–24', '2026-11-21'),
  e('1.3', 1, 'Álgebra de funciones y composición', 'TF 25–36', '2026-11-22'),
  e('1.4', 1, 'Por partes, valor absoluto y parte entera', 'TF 37–48', '2026-11-22'),
  e('1.5', 1, 'Paridad y monotonía', 'TF 49–54', '2026-11-23'),
  e('1.6', 1, 'Transformaciones', 'TT', '2026-11-23'),
  e('1.7', 1, 'Trigonométricas en el taller', 'TF 55–60', '2026-11-24'),
  e('1.8', 1, 'Exponencial, inversa, logaritmo, trigonométricas inversas e hiperbólicas', 'Stewart', '2026-11-24'),

  e('2.1', 2, 'Reglas de límites y manejo algebraico', 'T2: 1, 2', '2026-11-25'),
  e('2.2', 2, 'Límites laterales y por tramos', 'T2: 2g, 2h, 2w, 3, 8, 10', '2026-11-25'),
  e('2.3', 2, 'Emparedado y límites trigonométricos', 'T2: 4, 5, 6', '2026-11-26'),
  e('2.4', 2, 'Continuidad y teorema del valor intermedio', 'Stewart', '2026-11-26'),
  e('2.5', 2, 'Límites al infinito, límites infinitos y asíntotas', 'T2: 7, 9, 11–14, Aplicaciones 1–3', '2026-11-27'),

  e('3.1', 3, 'Definición de derivada; razones de cambio', 'Stewart', '2026-11-28'),
  e('3.2', 3, 'Recta tangente', 'T5: 5, 7, 13, 14, 16', '2026-11-28'),
  e('3.3', 3, 'Potencia, suma, producto, cociente', 'T5: 9, 6a', '2026-11-29'),
  e('3.4', 3, 'Regla de la cadena', 'T5: 1, 2, 3, 19, 20', '2026-11-29'),
  e('3.5', 3, 'Derivadas trigonométricas', 'T5: 1c, 1d, 1f, 1h, 2a, 2e, 2k, 6c, 6d', '2026-11-30'),
  e('3.6', 3, 'Exponencial y logarítmica', 'T5: 1b, 1e, 1i, 2b, 2i, 2l, 4a, 4b, 10', '2026-11-30'),
  e('3.7', 3, 'Trigonométricas inversas', 'T5: 2g, 2j, 4c, 4d, 6f', '2026-12-01'),
  e('3.8', 3, 'Derivación implícita', 'T5: 22, 23, 25', '2026-12-01'),
  e('3.9', 3, 'Derivación logarítmica', 'T5: 24, 2h', '2026-12-02'),
  e('3.10', 3, 'Derivadas de orden superior', 'T5: 6, 9', '2026-12-02'),
  e('3.11', 3, 'Dónde una función no es derivable', 'T5: 11, 12, 15, 17, 21', '2026-12-03'),

  e('4.1', 4, 'Linealización y diferenciales', 'Stewart', '2026-12-04'),
  e('4.2', 4, 'Razones relacionadas', 'Stewart', '2026-12-04'),
  e('4.3', 4, 'Extremos; crecimiento y decrecimiento', 'T6: 4, 5', '2026-12-05'),
  e('4.4', 4, 'Rolle y valor medio', 'T6: 2, 3', '2026-12-06'),
  e('4.5', 4, 'Concavidad y puntos de inflexión', 'T6: 4, 5, 6', '2026-12-06'),
  e('4.6', 4, 'Trazado de curvas', 'T6: 5', '2026-12-07'),
  e('4.7', 4, 'Método de Newton', 'Stewart', '2026-12-08'),
  e('4.8', 4, "L'Hôpital", 'T6: 1', '2026-12-08'),
  e('4.9', 4, 'Optimización', 'T6: 7–12', '2026-12-09'),
]

export const FECHA_FINAL = '2026-12-11T14:00:00-05:00'
export const FECHA_REPASO = '2026-12-10'

export const etiquetaEntrada = (id: string) =>
  id === '0' ? 'Parte 0' : id === 'T' ? 'Parte T' : id
