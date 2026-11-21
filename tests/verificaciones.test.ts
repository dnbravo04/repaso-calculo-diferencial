import { describe, expect, it } from 'vitest'
import { evaluate } from 'mathjs'

// Cada "Verificación" numérica de los ejemplos, escrita como igualdad izquierda = derecha.
// Se evalúa con mathjs y se compara con tolerancia 1e-4.
const VERIFICACIONES: { entrada: string; donde: string; izq: string; der: string }[] = [
  // Parte 0
  { entrada: '0', donde: '0.2 (x = 13/2)', izq: '3*(2*(13/2)-5)/4 + 1', der: '7' },
  { entrada: '0', donde: '0.3 (x = 5)', izq: '5*5 - 7', der: '2*5 + 8' },
  { entrada: '0', donde: '0.4 (x = 2/3)', izq: '2/(2/3-1) + 1/(2/3+1)', der: '3/((2/3)^2-1)' },
  { entrada: '0', donde: '0.5 fórmula, x = 3', izq: '2*3^2 - 7*3 + 3', der: '0' },
  { entrada: '0', donde: '0.5 fórmula, x = 1/2', izq: '2*(1/2)^2 - 7*(1/2) + 3', der: '0' },
  { entrada: '0', donde: '0.5 cuadrado, x = -3+√7', izq: '(-3+sqrt(7))^2 + 6*(-3+sqrt(7)) + 2', der: '0' },
  { entrada: '0', donde: '0.5 cuadrado, x = -3-√7', izq: '(-3-sqrt(7))^2 + 6*(-3-sqrt(7)) + 2', der: '0' },
  { entrada: '0', donde: '0.7 (x = 9)', izq: 'sqrt(9 + 7)', der: '9 - 5' },
  { entrada: '0', donde: '0.8 (x = 5/3)', izq: 'abs(3*(5/3) + 2)', der: '7' },
  { entrada: '0', donde: '0.8 (x = -3)', izq: 'abs(3*(-3) + 2)', der: '7' },
  { entrada: '0', donde: '0.10 e^(2x-1) = 5', izq: 'exp(2*((1 + log(5))/2) - 1)', der: '5' },
  { entrada: '0', donde: '0.10 logaritmos (x = 3)', izq: 'log(3 + 1) + log(3 - 1)', der: 'log(8)' },
  // Parte T
  { entrada: 'T', donde: 'T.7 cos(π/12)', izq: 'cos(pi/12)', der: '(sqrt(2) + sqrt(6))/4' },
  { entrada: 'T', donde: 'T.9 sen(π/8)', izq: 'sin(pi/8)', der: 'sqrt(2 - sqrt(2))/2' },
  { entrada: 'T', donde: 'T.4 tan(11π/6)', izq: 'tan(11*pi/6)', der: '-sqrt(3)/3' },
  { entrada: 'T', donde: 'T.10 en x = π/6', izq: '(1 - cos(2*pi/6))/sin(2*pi/6)', der: 'tan(pi/6)' },
  { entrada: 'T', donde: 'T.11 cos x = -√3/2, x = 7π/6', izq: '2*cos(7*pi/6) + sqrt(3)', der: '0' },
  { entrada: 'T', donde: 'T.11 sen 2x = sen x, x = π/3', izq: 'sin(2*pi/3)', der: 'sin(pi/3)' },
  // 1.2
  { entrada: '1.2', donde: 'recta por (2, -3)', izq: '-2*2 + 1', der: '-3' },
  { entrada: '1.2', donde: 'perpendicular por (2, 1)', izq: '4/3*2 - 5/3', der: '1' },
  { entrada: '1.2', donde: 'ceros de 3x²-12x+7', izq: '3*(2 + sqrt(15)/3)^2 - 12*(2 + sqrt(15)/3) + 7', der: '0' },
  { entrada: '1.2', donde: 'gimnasios n = 15', izq: '50000 + 3000*15', der: '20000 + 5000*15' },
  // 1.3
  { entrada: '1.3', donde: 'cociente de diferencias (a=1, h=0.5)', izq: '((2*1.5^2 + 1.5) - (2*1^2 + 1))/0.5', der: '4*1 + 2*0.5 + 1' },
  // 1.4
  { entrada: '1.4', donde: 'tarifa q = 25', izq: '34000 + 2500*(25 - 20)', der: '46500' },
  { entrada: '1.4', donde: 'tarifa continua en q = 20', izq: '4000 + 1500*20', der: '34000' },
  // 1.6
  { entrada: '1.6', donde: 'g(3/2)', izq: '-2*sqrt(4 - 2*(3/2)) + 3', der: '1' },
  { entrada: '1.6', donde: 'g(0)', izq: '-2*sqrt(4 - 2*0) + 3', der: '-1' },
  // 1.7
  { entrada: '1.7', donde: 'mínimo en x = 2π/3', izq: '2*cos(3*(2*pi/3) - pi) + 1', der: '-1' },
  { entrada: '1.7', donde: 'tanque t = 4/3', izq: '1.5 + 0.3*cos(pi*(4/3)/4)', der: '1.65' },
  { entrada: '1.7', donde: 'tanque t = 44/3', izq: '1.5 + 0.3*cos(pi*(44/3)/4)', der: '1.65' },
  // 1.8
  { entrada: '1.8', donde: 'inversa: f⁻¹(f(0))', izq: '(3*(-1/3) + 1)/(2 - (-1/3))', der: '0' },
  { entrada: '1.8', donde: 'cos(arcsen(1/2))', izq: 'cos(asin(1/2))', der: 'sqrt(1 - 1/4)' },
  { entrada: '1.8', donde: 'cosh² - senh² en x = 1,3', izq: 'cosh(1.3)^2 - sinh(1.3)^2', der: '1' },
  { entrada: '1.8', donde: 'log₂ 8', izq: 'log(8)/log(2)', der: '3' },
  // 2.1 (cada límite se compara con la expresión evaluada a 1e-6 del punto)
  { entrada: '2.1', donde: 'sustitución directa', izq: '((-1)^3 + 2*(-1)^2 - 5)/(-1 + 3)', der: '-2' },
  { entrada: '2.1', donde: '(x²+x−6)/(x−2), x→2', izq: 'f(x) = (x^2 + x - 6)/(x - 2); f(2 + 1e-6)', der: '5' },
  { entrada: '2.1', donde: '(x³−27)/(x²−9), x→3', izq: 'f(x) = (x^3 - 27)/(x^2 - 9); f(3 + 1e-6)', der: '9/2' },
  { entrada: '2.1', donde: '(√(x+4)−2)/x, x→0', izq: 'f(x) = (sqrt(x + 4) - 2)/x; f(1e-6)', der: '1/4' },
  { entrada: '2.1', donde: '(1/x−1/3)/(x−3), x→3', izq: 'f(x) = (1/x - 1/3)/(x - 3); f(3 + 1e-6)', der: '-1/9' },
  { entrada: '2.1', donde: 'Ejemplo, x→−1', izq: 'f(x) = (x^2 - x - 2)/(x^2 + 3x + 2); f(-1 + 1e-6)', der: '-3' },
  // 2.2
  { entrada: '2.2', donde: '(x²+2x)/|x+2|, x→−2⁻', izq: 'f(x) = (x^2 + 2x)/abs(x + 2); f(-2 - 1e-6)', der: '2' },
  { entrada: '2.2', donde: '(x²+2x)/|x+2|, x→−2⁺', izq: 'f(x) = (x^2 + 2x)/abs(x + 2); f(-2 + 1e-6)', der: '-2' },
  { entrada: '2.2', donde: 'parámetro a = 1', izq: '1*2 + 1', der: '2^2 - 1' },
  { entrada: '2.2', donde: 'piso, x→2⁻', izq: 'floor(2 - 1e-6)', der: '1' },
  { entrada: '2.2', donde: 'q, x→1⁻', izq: '(1 - 1e-6)^2 + 2', der: '3' },
  { entrada: '2.2', donde: 'q, x→1⁺', izq: '5 - (1 + 1e-6)', der: '4' },
  // 2.3
  { entrada: '2.3', donde: 'x cos(1/x), x→0', izq: '1e-6*cos(1/1e-6)', der: '0' },
  { entrada: '2.3', donde: '(2+sen x)/x², x→∞', izq: '(2 + sin(1e4))/1e8', der: '0' },
  { entrada: '2.3', donde: 'sen7x/(2x)', izq: 'sin(7e-6)/(2e-6)', der: '7/2' },
  { entrada: '2.3', donde: 'tan x/(x + sen x)', izq: 'tan(1e-6)/(1e-6 + sin(1e-6))', der: '1/2' },
  { entrada: '2.3', donde: 'sen(θ²)/θ', izq: 'sin((1e-4)^2)/1e-4', der: '0' },
  { entrada: '2.3', donde: 'sen(x−1)/(x²−1)', izq: 'f(x) = sin(x - 1)/(x^2 - 1); f(1 + 1e-6)', der: '1/2' },
  { entrada: '2.3', donde: '(1−cos x)/sen x', izq: '(1 - cos(1e-4))/sin(1e-4)', der: '0' },
  { entrada: '2.3', donde: 'Ejemplo (x + tan2x)/sen3x', izq: 'f(x) = (x + tan(2x))/sin(3x); f(1e-4)', der: '1' },
  // 2.4
  { entrada: '2.4', donde: 'parámetro c = 2/3', izq: '4*(2/3) + 4', der: '8 - 2*(2/3)' },
  { entrada: '2.4', donde: 'lím √(x²+3), x→1', izq: 'sqrt(1^2 + 3)', der: '2' },
  { entrada: '2.4', donde: 'lím cos(x + sen x), x→π', izq: 'cos(pi + sin(pi))', der: '-1' },
  { entrada: '2.4', donde: 'bisección f(0,75)', izq: '0.75^3 + 0.75 - 1', der: '0.171875' },
  { entrada: '2.4', donde: 'raíz de x³+x−1 en (0,625; 0,75)', izq: 'f(x) = x^3 + x - 1; f(0.625) * f(0.75) < 0', der: '1' },
  { entrada: '2.4', donde: 'removible: lím en 2', izq: 'f(x) = (x^2 - 4)/(x^2 - x - 2); f(2 + 1e-6)', der: '4/3' },
  // 2.5
  { entrada: '2.5', donde: '(4x²−x+1)/(2x²+5), x→∞', izq: 'f(x) = (4x^2 - x + 1)/(2x^2 + 5); f(1e7)', der: '2' },
  { entrada: '2.5', donde: '√(9x²+1)/(2x−3), x→−∞', izq: 'f(x) = sqrt(9x^2 + 1)/(2x - 3); f(-1e7)', der: '-3/2' },
  { entrada: '2.5', donde: '√(x+3)−√x, x→∞', izq: 'sqrt(1e10 + 3) - sqrt(1e10)', der: '0' },
  { entrada: '2.5', donde: '(2eˣ+1)/(eˣ−3), x→∞', izq: 'f(x) = (2exp(x) + 1)/(exp(x) - 3); f(40)', der: '2' },
  { entrada: '2.5', donde: '(2eˣ+1)/(eˣ−3), x→−∞', izq: 'f(x) = (2exp(x) + 1)/(exp(x) - 3); f(-40)', der: '-1/3' },
  { entrada: '2.5', donde: 'división (x+2)(2x−1)+1', izq: 'f(x) = (x + 2)(2x - 1) + 1 - (2x^2 + 3x - 1); f(7)', der: '0' },
  { entrada: '2.5', donde: 'nRT', izq: '1 * 8.314 * 300', der: '2494.2' },
  { entrada: '2.5', donde: '(3−x)/(x−2) = −1 + 1/(x−2)', izq: 'f(x) = (3 - x)/(x - 2) - (-1 + 1/(x - 2)); f(5)', der: '0' },
  { entrada: '2.5', donde: 'Ejemplo: f(−5) = 3', izq: '(3*(-5)^2 - 3)/((-5)^2 - (-5) - 6)', der: '3' },
  { entrada: '2.5', donde: 'Ejemplo: f(0) = 1/2', izq: '(3*0 - 3)/(0 - 0 - 6)', der: '1/2' },
  { entrada: '2.5', donde: 'mínimo de la rama derecha = −5 + 2√2', izq: 'f(x) = (2x^2 + 3x - 1)/(x + 2); f(-2 + 1/sqrt(2))', der: '-5 + 2*sqrt(2)' },
  { entrada: '2.5', donde: 'extremo de la rama izquierda = (42 + 12√6)/25', izq: 'y = (42 + 12*sqrt(6))/25; 25y^2 - 84y + 36', der: '0' },
  // FIN
]

describe('verificaciones numéricas de los ejemplos', () => {
  it.each(VERIFICACIONES.map((v) => [`${v.entrada} · ${v.donde}`, v]))('%s', (_n, v) => {
    // "f(x) = …; f(2.000001)" devuelve un ResultSet: se toma el último valor.
    const valor = (expr: string) => {
      const r = evaluate(expr) as unknown
      const entradas = (r as { entries?: unknown[] })?.entries
      return Number(entradas ? entradas[entradas.length - 1] : r)
    }
    const a = valor(v.izq)
    const b = valor(v.der)
    expect(Math.abs(a - b)).toBeLessThan(1e-4)
  })
})
