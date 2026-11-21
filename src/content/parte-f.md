---
id: "F"
unidad: 0
titulo: "Factorización, Ruffini y división sintética"
taller: "—"
plan: "2026-11-21"
---

Factorizar es escribir un polinomio como un producto de polinomios más simples. Sirve para resolver ecuaciones (un producto vale $0$ solo si algún factor vale $0$), para simplificar fracciones y, en la Unidad 2, para levantar los límites $\tfrac{0}{0}$. La división sintética, que en Colombia se llama regla de Ruffini, es el atajo para dividir entre $x - a$ y encontrar factores de polinomios de grado $3$ o más.

### Definición formal

#### F.1 Polinomio y factorización

:::paso
$$
P(x) = a_n x^n + a_{n-1} x^{n-1} + \dots + a_1 x + a_0, \qquad a_n \neq 0
$$
Un polinomio de grado $n$. $a_n$ es el coeficiente principal y $a_0$ el término independiente.
:::

:::paso
$$
P(x) = A(x)\,B(x)
$$
Factorizar es escribir $P$ como producto de polinomios de grado menor. Está **completa** cuando ningún factor se puede partir más con coeficientes reales.
:::

#### F.2 División, teorema del residuo y teorema del factor

:::paso
$$
P(x) = (x - a)\,Q(x) + r
$$
Al dividir $P(x)$ entre $x - a$ sale un cociente $Q(x)$, de un grado menos, y un residuo $r$, que es un número.
:::

:::paso
$$
P(a) = (a - a)\,Q(a) + r = r
$$
**Teorema del residuo.** Reemplazamos $x = a$ en la igualdad anterior: el primer término se anula porque $a - a = 0$. El residuo es el valor del polinomio en $a$.
:::

:::paso
$$
P(a) = 0 \iff (x - a) \text{ es factor de } P(x)
$$
**Teorema del factor.** Si $P(a) = 0$, el residuo es $0$ y queda $P(x) = (x - a)\,Q(x)$. Al revés, si $x - a$ es factor, al reemplazar $x = a$ todo el producto vale $0$.
:::

#### F.3 Raíces racionales

:::paso
$$
\frac{p}{q} \text{ raíz de } P \text{ (fracción simplificada)} \;\Longrightarrow\; p \text{ divide a } a_0 \;\text{ y }\; q \text{ divide a } a_n
$$
Vale cuando todos los coeficientes son enteros. Da una lista finita de candidatos $\pm\tfrac{p}{q}$; no dice cuáles son raíces, solo dónde buscarlas.
:::

### Idea en palabras

Factorizar es desarmar un producto ya hecho: como saber que $91 = 7 \cdot 13$, pero con polinomios. Los casos de factorización son patrones que se reconocen a la vista; cuando ninguno sirve, el teorema del factor dice qué buscar: un número $a$ que haga $P(a) = 0$.

Metáfora: la regla de Ruffini es una calculadora en tabla. Le das los coeficientes y un candidato $a$; ella te devuelve el cociente y el residuo. Si el residuo es $0$, encontraste un factor $x - a$ y el problema baja un grado.

"División sintética" y "regla de Ruffini" son el mismo procedimiento con dos nombres. Solo sirve para dividir entre $x - a$; para dividir entre $bx - c$ se usa $a = \tfrac{c}{b}$ y al final se ajusta el cociente (Método F.5, ejemplo 3).

### Método

#### F.4 Casos de factorización, en este orden

1. Saca **factor común**, siempre primero.
2. Cuenta los términos. Con **dos**: diferencia de cuadrados o suma o diferencia de cubos. Con **tres**: trinomio cuadrado perfecto, $x^2 + bx + c$ o $ax^2 + bx + c$. Con **cuatro**: agrupación.
3. Si es de grado $3$ o más y no encaja en ningún caso, busca raíces racionales con Ruffini (F.5 y F.6).
4. Revisa cada factor: si todavía se puede partir, vuelve al paso 1 con él.

**Factor común.** $4x^3 - 10x^2$.

:::paso
$$
4x^3 - 10x^2 = 2x^2(2x - 5)
$$
El máximo común divisor de $4$ y $10$ es $2$, y la menor potencia de $x$ es $x^2$. Comprobación: $2x^2 \cdot 2x = 4x^3$ y $2x^2 \cdot (-5) = -10x^2$.
:::

**Diferencia de cuadrados.** $49x^2 - 16$ y $16x^4 - 1$.

:::paso
$$
a^2 - b^2 = (a - b)(a + b)
$$
Al multiplicar, los términos cruzados $ab$ y $-ab$ se cancelan.
:::

:::paso
$$
49x^2 - 16 = (7x)^2 - 4^2 = (7x - 4)(7x + 4)
$$
Identificamos $a = 7x$ y $b = 4$.
:::

:::paso
$$
16x^4 - 1 = (4x^2 - 1)(4x^2 + 1) = (2x - 1)(2x + 1)(4x^2 + 1)
$$
Primero con $a = 4x^2$ y $b = 1$; el factor $4x^2 - 1$ es otra diferencia de cuadrados. $4x^2 + 1$ es una suma de cuadrados: no se factoriza en los reales.
:::

**Trinomio cuadrado perfecto.** $9x^2 - 30x + 25$.

:::paso
$$
a^2 - 2ab + b^2 = (a - b)^2
$$
El primero y el último son cuadrados, y el del medio es el doble de su producto.
:::

:::paso
$$
9x^2 - 30x + 25 = (3x)^2 - 2(3x)(5) + 5^2 = (3x - 5)^2
$$
$a = 3x$ y $b = 5$; el doble producto $2 \cdot 3x \cdot 5 = 30x$ coincide con el término del medio.
:::

**Trinomio $x^2 + bx + c$.** $x^2 - 2x - 35$.

:::paso
$$
x^2 - 2x - 35 = (x - 7)(x + 5)
$$
Buscamos dos números que multiplicados den $-35$ y sumados den $-2$: son $-7$ y $5$.
:::

**Trinomio $ax^2 + bx + c$ (método $ac$).** $6x^2 + 7x - 3$.

:::paso
$$
ac = 6 \cdot (-3) = -18 \qquad 9 \cdot (-2) = -18,\quad 9 + (-2) = 7
$$
Buscamos dos números que multiplicados den $ac$ y sumados den $b$.
:::

:::paso
$$
6x^2 + 9x - 2x - 3 = 3x(2x + 3) - 1(2x + 3) = (2x + 3)(3x - 1)
$$
Partimos $7x$ en $9x - 2x$ y agrupamos de a dos; sale el factor común $(2x + 3)$.
:::

**Suma y diferencia de cubos.** $27x^3 + 8$ y $8x^3 - 125$.

:::paso
$$
a^3 + b^3 = (a + b)(a^2 - ab + b^2) \qquad a^3 - b^3 = (a - b)(a^2 + ab + b^2)
$$
El signo del primer factor es el del binomio; el término $ab$ lleva el signo contrario.
:::

:::paso
$$
27x^3 + 8 = (3x)^3 + 2^3 = (3x + 2)(9x^2 - 6x + 4)
$$
$a = 3x$ y $b = 2$: $a^2 = 9x^2$, $ab = 6x$ y $b^2 = 4$.
:::

:::paso
$$
8x^3 - 125 = (2x)^3 - 5^3 = (2x - 5)(4x^2 + 10x + 25)
$$
$a = 2x$ y $b = 5$: $a^2 = 4x^2$, $ab = 10x$ y $b^2 = 25$.
:::

**Agrupación.** $x^3 + 2x^2 - 25x - 50$.

:::paso
$$
x^2(x + 2) - 25(x + 2) = (x + 2)(x^2 - 25) = (x + 2)(x - 5)(x + 5)
$$
Agrupamos de a dos y sacamos factor común en cada grupo; aparece $(x + 2)$ en los dos. Después, diferencia de cuadrados.
:::

**Cuando no hay caso: la fórmula general.** Si $\Delta = b^2 - 4ac \geq 0$, el trinomio se factoriza con sus raíces $x_1$ y $x_2$ (Parte 0.5).

:::paso
$$
ax^2 + bx + c = a(x - x_1)(x - x_2)
$$
No olvides el factor $a$ adelante. Si $\Delta < 0$, el trinomio no se factoriza en los reales.
:::

:::paso
$$
x^2 + 2x - 4: \quad x = \frac{-2 \pm \sqrt{20}}{2} = -1 \pm \sqrt{5} \;\Longrightarrow\; x^2 + 2x - 4 = \big(x + 1 - \sqrt{5}\big)\big(x + 1 + \sqrt{5}\big)
$$
Ningún par de enteros sirve, pero $\Delta = 4 + 16 = 20 > 0$. Con $x_1 = -1 + \sqrt{5}$, el factor es $x - x_1 = x + 1 - \sqrt{5}$.
:::

#### F.5 División sintética (regla de Ruffini)

1. Ordena $P(x)$ de mayor a menor grado y escribe **todos** los coeficientes, con $0$ en los grados que faltan.
2. Escribe $a$ a la izquierda. Ojo con el signo: $x + 2 = x - (-2)$, así que $a = -2$.
3. Baja el primer coeficiente.
4. Multiplica ese número por $a$, escribe el producto debajo del siguiente coeficiente y suma la columna. Repite hasta la última columna.
5. El último número es el residuo. Los anteriores son los coeficientes del cociente, que tiene un grado menos.

**Ejemplo 1: residuo cero.** $(2x^3 - 3x^2 - 11x + 6) \div (x - 3)$.

:::paso
$$
\begin{array}{r|rrrr}
 & 2 & -3 & -11 & 6 \\
3 & & 6 & 9 & -6 \\ \hline
 & 2 & 3 & -2 & 0
\end{array}
$$
Bajamos el $2$. Luego $2 \cdot 3 = 6$ y $-3 + 6 = 3$; $3 \cdot 3 = 9$ y $-11 + 9 = -2$; $-2 \cdot 3 = -6$ y $6 - 6 = 0$.
:::

:::paso
$$
2x^3 - 3x^2 - 11x + 6 = (x - 3)(2x^2 + 3x - 2) = (x - 3)(2x - 1)(x + 2)
$$
Residuo $0$: por el teorema del factor, $x - 3$ es factor. El cociente se factoriza con el método $ac$: $ac = -4 = 4 \cdot (-1)$ y $4 - 1 = 3$.
:::

```interactivo
{
  "tipo": "ruffini",
  "coeficientes": [2, -3, -11, 6],
  "raiz": 3,
  "descripcion": "Arriba están los coeficientes de $P(x) = 2x^3 - 3x^2 - 11x + 6$ y a la izquierda la raíz que se prueba. Pulsa «Siguiente paso»: se marca en verde cuando se baja un número, en naranja cuando se multiplica por la raíz y en azul cuando se suma la columna. La casilla del final es el residuo: verde si vale $0$ y roja si no. Después toca los candidatos $\\pm\\tfrac{p}{q}$ de abajo; el residuo da $0$ exactamente con $3$, con $\\tfrac{1}{2}$ y con $-2$, las tres raíces. Con cualquier otro candidato el residuo es $P(a)$, distinto de $0$."
}
```

```grafica
{
  "funciones": [{ "expr": "2x^3 - 3x^2 - 11x + 6", "color": "azul", "etiqueta": "$P(x) = 2x^3 - 3x^2 - 11x + 6$" }],
  "puntos": [
    { "x": -2, "y": 0, "etiqueta": "-2", "posicion": "no" },
    { "x": 0.5, "y": 0, "etiqueta": "\\tfrac{1}{2}", "posicion": "ne" },
    { "x": 3, "y": 0, "etiqueta": "3", "posicion": "se" }
  ],
  "vista": { "x": [-3, 4], "y": [-16, 16] },
  "descripcion": "El eje horizontal es $x$ y el vertical es $y$. La curva azul es $P(x) = 2x^3 - 3x^2 - 11x + 6 = (x - 3)(2x - 1)(x + 2)$. Corta el eje horizontal exactamente en $x = -2$, $x = \\tfrac{1}{2}$ y $x = 3$: cada factor $x - a$ corresponde a un corte en $x = a$, que es lo que dice el teorema del factor. Entre cortes consecutivos la curva cambia de signo. Como es de grado $3$, empieza abajo a la izquierda y termina arriba a la derecha. Dominio $\\mathbb{R}$; imagen $\\mathbb{R}$."
}
```

**Ejemplo 2: faltan términos y hay residuo.** $(x^4 - 3x^2 + 5x - 7) \div (x + 2)$.

:::paso
$$
\begin{array}{r|rrrrr}
 & 1 & 0 & -3 & 5 & -7 \\
-2 & & -2 & 4 & -2 & -6 \\ \hline
 & 1 & -2 & 1 & 3 & -13
\end{array}
$$
Falta el término $x^3$, así que va un $0$ en su lugar. El divisor $x + 2$ da $a = -2$.
:::

:::paso
$$
x^4 - 3x^2 + 5x - 7 = (x + 2)(x^3 - 2x^2 + x + 3) - 13
$$
Cociente de grado $3$ y residuo $-13$. Teorema del residuo: $P(-2) = 16 - 12 - 10 - 7 = -13$, el mismo número.
:::

**Ejemplo 3: divisor $2x - 1$.** $(2x^3 + x^2 + 3x - 2) \div (2x - 1)$.

:::paso
$$
\begin{array}{r|rrrr}
 & 2 & 1 & 3 & -2 \\
\tfrac{1}{2} & & 1 & 1 & 2 \\ \hline
 & 2 & 2 & 4 & 0
\end{array}
$$
$2x - 1 = 0$ da $x = \tfrac{1}{2}$, así que usamos $a = \tfrac{1}{2}$. Esta tabla divide entre $x - \tfrac{1}{2}$, no entre $2x - 1$.
:::

:::paso
$$
2x^3 + x^2 + 3x - 2 = \left(x - \tfrac{1}{2}\right)(2x^2 + 2x + 4) = (2x - 1)(x^2 + x + 2)
$$
Pasamos el $2$ del cociente al otro factor: $\left(x - \tfrac{1}{2}\right) \cdot 2 = 2x - 1$. El cociente entre $2x - 1$ es $x^2 + x + 2$, que no se factoriza: $\Delta = 1 - 8 < 0$.
:::

#### F.6 Factorizar un polinomio de grado 3 o más

1. Saca factor común.
2. Lista los candidatos $\pm\tfrac{p}{q}$ (F.3). Empieza por los más fáciles: $\pm 1$, $\pm 2$.
3. Prueba cada candidato con $P(a)$ o con Ruffini hasta que el residuo sea $0$.
4. Escribe $P(x) = (x - a)\,Q(x)$ y repite con $Q(x)$: sus raíces también son raíces de $P$.
5. Cuando el cociente sea de grado $2$, termina con los casos de F.4 o con la fórmula general.

### Ejemplo

*Viene de «F.6 Factorizar un polinomio de grado 3 o más».*

**Ejemplo.** Factorizar por completo $P(x) = x^4 - x^3 - 7x^2 + x + 6$.

:::paso
$$
a_0 = 6,\ a_n = 1 \;\Longrightarrow\; \text{candidatos: } \pm 1,\ \pm 2,\ \pm 3,\ \pm 6
$$
Paso 2: los divisores de $6$ son $1, 2, 3, 6$; como $a_n = 1$, $q = 1$ y los candidatos son enteros.
:::

:::paso
$$
P(1) = 1 - 1 - 7 + 1 + 6 = 0
$$
Paso 3: el primer candidato ya sirve, así que $x - 1$ es factor.
:::

:::paso
$$
\begin{array}{r|rrrrr}
 & 1 & -1 & -7 & 1 & 6 \\
1 & & 1 & 0 & -7 & -6 \\ \hline
 & 1 & 0 & -7 & -6 & 0
\end{array}
$$
Ruffini con $a = 1$. Cociente: $x^3 + 0x^2 - 7x - 6 = x^3 - 7x - 6$.
:::

:::paso
$$
\begin{array}{r|rrrr}
 & 1 & 0 & -7 & -6 \\
-1 & & -1 & 1 & 6 \\ \hline
 & 1 & -1 & -6 & 0
\end{array}
$$
Paso 4: repetimos con el cociente. $1$ ya no da $0$ ($1 - 7 - 6 = -12$), pero $-1$ sí: $-1 + 7 - 6 = 0$. Ojo: el $0$ del término $x^2$ se queda en la tabla.
:::

:::paso
$$
x^2 - x - 6 = (x - 3)(x + 2)
$$
Paso 5: el último cociente es de grado $2$. Dos números que multiplicados den $-6$ y sumados den $-1$: $-3$ y $2$.
:::

:::paso
$$
P(x) = (x - 1)(x + 1)(x - 3)(x + 2)
$$
Juntamos los factores. Raíces: $-2$, $-1$, $1$ y $3$.
:::

**Verificación.** $(x - 1)(x + 1) = x^2 - 1$ y $(x - 3)(x + 2) = x^2 - x - 6$. Al multiplicar: $(x^2 - 1)(x^2 - x - 6) = x^4 - x^3 - 6x^2 - x^2 + x + 6 = x^4 - x^3 - 7x^2 + x + 6$.

```grafica
{
  "funciones": [{ "expr": "x^4 - x^3 - 7x^2 + x + 6", "color": "azul", "etiqueta": "$P(x) = x^4 - x^3 - 7x^2 + x + 6$" }],
  "puntos": [
    { "x": -2, "y": 0, "etiqueta": "-2", "posicion": "no" },
    { "x": -1, "y": 0, "etiqueta": "-1", "posicion": "se" },
    { "x": 1, "y": 0, "etiqueta": "1", "posicion": "ne" },
    { "x": 3, "y": 0, "etiqueta": "3", "posicion": "se" }
  ],
  "vista": { "x": [-2.8, 3.8], "y": [-15, 15] },
  "descripcion": "El eje horizontal es $x$ y el vertical es $y$. La curva azul es $P(x) = (x - 1)(x + 1)(x - 3)(x + 2)$. Corta el eje horizontal en sus cuatro raíces: $-2$, $-1$, $1$ y $3$, una por cada factor. Como es de grado $4$ con coeficiente principal positivo, los dos extremos suben. Entre $-2$ y $-1$ y entre $1$ y $3$ la curva queda debajo del eje; entre $-1$ y $1$ queda encima, y pasa por $(0, 6)$, el término independiente. Dominio $\\mathbb{R}$; imagen $[m, \\infty)$, donde $m \\approx -12{,}95$ es el punto más bajo, cerca de $x = 2{,}25$."
}
```

### Trampas

- **Olvidar los ceros.** En $x^4 - 3x^2 + 5x - 7$ los coeficientes son $1, 0, -3, 5, -7$. Sin el $0$, la tabla divide otro polinomio, $x^3 - 3x^2 + 5x - 7$.
- **Equivocar el signo de $a$.** Para dividir entre $x + 2$ se usa $a = -2$, no $2$.
- **Dividir entre $2x - 1$ y no ajustar.** La tabla con $a = \tfrac{1}{2}$ da el cociente de dividir entre $x - \tfrac{1}{2}$; para $2x - 1$ hay que dividir ese cociente entre $2$.
- **La suma de cuadrados no se factoriza.** $x^2 + 9 \neq (x + 3)^2$, porque $(x + 3)^2 = x^2 + 6x + 9$. Con coeficientes reales, $x^2 + 9$ queda como está.
- **Factor común incompleto.** $4x^3 - 10x^2 = 2x(2x^2 - 5x)$ es cierto, pero el paréntesis todavía tiene el factor común $x$.
- **Signos en los cubos.** $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$: el término del medio lleva el signo contrario al del binomio.
- **Cancelar términos en vez de factores.** $\tfrac{x^2 + 5}{x}$ no es $x + 5$: solo se cancela lo que multiplica a todo el numerador y a todo el denominador.

### Practica

Dilo con tus palabras: ¿por qué el residuo de dividir $P(x)$ entre $x - a$ es exactamente $P(a)$, y qué te dice que ese residuo dé $0$?

1. Factoriza por completo: $12x^4 - 18x^3$, $25x^2 - 36$, $4x^2 + 12x + 9$, $x^2 + 3x - 28$, $10x^2 - 11x - 6$, $64x^3 + 27$ y $x^3 - 3x^2 - 16x + 48$.
2. Con división sintética, halla el cociente y el residuo de $(3x^3 - 5x^2 + 4) \div (x - 2)$ y de $(x^4 + 2x^3 - x + 6) \div (x + 3)$. Comprueba cada residuo con el teorema del residuo.
3. Halla $k$ para que $x - 2$ sea factor de $x^3 + kx^2 - 4x + 12$.
4. Factoriza por completo $2x^3 - 5x^2 - 4x + 3$ usando raíces racionales.
5. Simplifica $\dfrac{x^3 + 2x^2 - 5x - 6}{x^2 - x - 2}$ e indica para qué valores de $x$ vale la simplificación.
