---
id: "0"
unidad: 0
titulo: "Despeje de ecuaciones"
taller: "—"
plan: "2026-11-21"
---

Despejar es aislar la incógnita aplicando a ambos lados la operación inversa de lo que le hicieron, en orden contrario. Todo lo demás son cuidados para no ganar ni perder soluciones.

### Definición formal

#### 0.1 La regla de oro: la balanza

Una ecuación es una balanza en equilibrio. Cualquier operación válida que hagas a un lado tienes que hacerla al otro, y el equilibrio se conserva.

| Si a la $x$ le hicieron… | Se deshace con… | Cuidado |
| --- | --- | --- |
| sumar $a$ | restar $a$ | ninguno |
| restar $a$ | sumar $a$ | ninguno |
| multiplicar por $a$ | dividir por $a$ | solo si $a \neq 0$; nunca dividir por algo que pueda valer $0$ |
| dividir por $a$ | multiplicar por $a$ | $a \neq 0$ |
| elevar al cuadrado | sacar raíz cuadrada | aparecen dos signos: $\pm$ |
| sacar raíz cuadrada | elevar al cuadrado | puede crear soluciones falsas: verificar siempre |
| aplicar $e^x$ | aplicar $\ln$ | solo si el otro lado es $> 0$ |
| aplicar $\ln$ | aplicar $e^x$ | el argumento del $\ln$ debe ser $> 0$ |
| aplicar $\operatorname{sen}$ | usar la circunferencia unitaria | hay infinitas soluciones (Parte T) |

"Pasar a restar" o "pasar a dividir" es un atajo de lenguaje. Lo que de verdad pasa es que restas o divides en ambos lados.

### Idea en palabras

#### 0.2 El orden: deshacer como desequipar

Metáfora: a la $x$ le pusieron un equipo por capas, como un personaje de videojuego. Para dejarla sola se quita primero la última pieza que le pusieron, o sea, la operación más externa.

Concepto exacto: si la expresión se armó aplicando operaciones en el orden 1, 2, 3, se deshace aplicando las inversas en el orden 3, 2, 1.

### Método

#### 0.3 La $x$ en ambos lados

Método: junta los términos con $x$ a un lado y los números al otro; luego factoriza la $x$.

:::paso
$$
5x - 7 = 2x + 8
$$
Ecuación de partida.
:::

:::paso
$$
5x - 2x = 8 + 7
$$
Restamos $2x$ y sumamos $7$ en ambos lados.
:::

:::paso
$$
3x = 15 \quad\Longrightarrow\quad x = 5
$$
Sumamos términos semejantes y dividimos por $3$. Verificación: $5 \cdot 5 - 7 = 18$ y $2 \cdot 5 + 8 = 18$.
:::

#### 0.4 Ecuaciones con fracciones

Método:

1. Anota las restricciones: ningún denominador puede valer $0$. Esto va **antes** de simplificar.
2. Factoriza los denominadores y busca el mínimo común múltiplo (mcm).
3. Multiplica toda la ecuación por el mcm; las fracciones desaparecen.
4. Resuelve la ecuación que queda.
5. Descarta las soluciones que choquen con las restricciones del paso 1.

**Ejemplo.**

$$
\frac{2}{x-1} + \frac{1}{x+1} = \frac{3}{x^2-1}
$$

Restricciones: $x - 1 \neq 0$ y $x + 1 \neq 0$, o sea $x \neq 1$ y $x \neq -1$.

:::paso
$$
x^2 - 1 = (x-1)(x+1)
$$
Diferencia de cuadrados: $a^2 - b^2 = (a - b)(a + b)$. Entonces el mcm es $(x - 1)(x + 1)$.
:::

:::paso
$$
2(x+1) + (x-1) = 3
$$
Multiplicamos cada término por $(x - 1)(x + 1)$. En cada fracción se cancela su propio denominador; se puede porque ya exigimos que no valga $0$.
:::

:::paso
$$
3x + 1 = 3 \quad\Longrightarrow\quad x = \frac{2}{3}
$$
Propiedad distributiva, términos semejantes, restar $1$ y dividir por $3$. Como $\tfrac{2}{3}$ no es $1$ ni $-1$, la solución sirve.
:::

#### 0.5 Ecuaciones cuadráticas

Forma general: $ax^2 + bx + c = 0$ con $a \neq 0$. Hay tres caminos: factorizar, la fórmula general o completar el cuadrado.

:::paso
$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
Fórmula general. El discriminante $\Delta = b^2 - 4ac$ decide: $\Delta > 0$ da dos soluciones reales, $\Delta = 0$ da una sola, $\Delta < 0$ no da soluciones reales.
:::

**Ejemplo con fórmula.** $2x^2 - 7x + 3 = 0$, con $a = 2$, $b = -7$, $c = 3$.

:::paso
$$
\Delta = (-7)^2 - 4(2)(3) = 49 - 24 = 25
$$
Calculamos el discriminante; como $25 > 0$, hay dos soluciones reales.
:::

:::paso
$$
x = \frac{7 \pm 5}{4} \quad\Longrightarrow\quad x = 3 \;\text{ o }\; x = \frac{1}{2}
$$
Reemplazamos en la fórmula: $-b = 7$ y $\sqrt{25} = 5$. Con $+$ da $\tfrac{12}{4} = 3$; con $-$ da $\tfrac{2}{4} = \tfrac{1}{2}$. Comprobación por factorización: $(2x - 1)(x - 3) = 2x^2 - 7x + 3$.
:::

```grafica
{
  "funciones": [
    {
      "expr": "2x^2 - 7x + 3",
      "color": "azul",
      "etiqueta": "$y = 2x^2 - 7x + 3$"
    }
  ],
  "puntos": [
    {
      "x": 0.5,
      "y": 0,
      "etiqueta": "\\tfrac{1}{2}",
      "posicion": "no"
    },
    {
      "x": 3,
      "y": 0,
      "etiqueta": "3",
      "posicion": "ne"
    }
  ],
  "vista": {
    "x": [
      -1,
      4.5
    ],
    "y": [
      -4,
      6
    ]
  },
  "descripcion": "El eje horizontal es $x$ y el vertical es $y$. La curva azul es la parábola $y = 2x^2 - 7x + 3$. Resolver $2x^2 - 7x + 3 = 0$ es buscar dónde la curva corta el eje horizontal, porque ahí $y = 0$: en $x = \\tfrac{1}{2}$ y en $x = 3$, las dos soluciones. Como $\\Delta = 25 > 0$, hay dos cortes; con $\\Delta = 0$ la parábola apenas tocaría el eje y con $\\Delta < 0$ no lo tocaría. Se lee $\\operatorname{Dom} = \\mathbb{R}$ e $\\operatorname{Img} = \\left[-\\tfrac{25}{8}, \\infty\\right)$, pues el vértice está en $\\left(\\tfrac{7}{4}, -\\tfrac{25}{8}\\right)$."
}
```

**Ejemplo completando el cuadrado.** $x^2 + 6x + 2 = 0$.

:::paso
$$
x^2 + 6x = -2
$$
Restamos $2$ en ambos lados para dejar solo los términos con $x$.
:::

:::paso
$$
x^2 + 6x + 9 = -2 + 9
$$
Sumamos en ambos lados el cuadrado de la mitad del coeficiente de $x$: $\left(\tfrac{6}{2}\right)^2 = 9$.
:::

:::paso
$$
(x+3)^2 = 7
$$
El lado izquierdo es un trinomio cuadrado perfecto: $(x + 3)^2 = x^2 + 6x + 9$.
:::

:::paso
$$
x + 3 = \pm\sqrt{7} \quad\Longrightarrow\quad x = -3 \pm \sqrt{7}
$$
Sacamos raíz en ambos lados; salen dos signos porque tanto $\sqrt{7}$ como $-\sqrt{7}$ elevados al cuadrado dan $7$. Luego restamos $3$.
:::

#### 0.6 Despejar una letra en una fórmula

Esto lo vas a usar para hallar rangos y funciones inversas. Método: deja todos los términos con $x$ a un lado, factoriza la $x$ y divide.

**Ejemplo.** Despejar $x$ en $y = \dfrac{3x + 1}{x - 2}$, con $x \neq 2$.

:::paso
$$
y(x-2) = 3x + 1
$$
Multiplicamos ambos lados por $x - 2$, que no vale $0$.
:::

:::paso
$$
yx - 2y = 3x + 1
$$
Propiedad distributiva.
:::

:::paso
$$
yx - 3x = 2y + 1
$$
Restamos $3x$ y sumamos $2y$ en ambos lados: los términos con $x$ quedan a la izquierda.
:::

:::paso
$$
x(y-3) = 2y + 1
$$
Factor común $x$.
:::

:::paso
$$
x = \frac{2y+1}{y-3}, \qquad y \neq 3
$$
Dividimos por $y - 3$, lo que solo se puede si $y \neq 3$. Lectura: todo $y \neq 3$ tiene una $x$ que lo produce, así que la imagen de la función es $\mathbb{R} \setminus \{3\}$.
:::

#### 0.7 Ecuaciones con raíces

Método:

1. Aísla la raíz a un lado.
2. Exige que el otro lado sea $\geq 0$, porque una raíz cuadrada nunca es negativa.
3. Eleva al cuadrado ambos lados.
4. Resuelve y **verifica en la ecuación original**: elevar al cuadrado puede crear soluciones falsas.

**Ejemplo.** $\sqrt{x + 7} = x - 5$.

:::paso
$$
x - 5 \geq 0 \quad\Longrightarrow\quad x \geq 5
$$
Condición: el lado derecho debe ser no negativo, porque es igual a una raíz.
:::

:::paso
$$
x + 7 = x^2 - 10x + 25
$$
Elevamos al cuadrado ambos lados; a la derecha usamos $(a - b)^2 = a^2 - 2ab + b^2$.
:::

:::paso
$$
x^2 - 11x + 18 = 0 \quad\Longrightarrow\quad (x-9)(x-2) = 0
$$
Pasamos todo a un lado y factorizamos: buscamos dos números que multiplicados den $18$ y sumados den $-11$.
:::

:::paso
$$
x = 9 \;\text{ o }\; x = 2
$$
Un producto es $0$ solo si algún factor es $0$. Pero $x = 2$ incumple $x \geq 5$; en la original da $\sqrt{9} = 3$ frente a $-3$. La única solución es $x = 9$: $\sqrt{16} = 4 = 9 - 5$.
:::

```grafica
{
  "funciones": [
    {
      "expr": "sqrt(x + 7)",
      "color": "azul",
      "etiqueta": "$y = \\sqrt{x + 7}$"
    },
    {
      "expr": "x - 5",
      "color": "naranja",
      "etiqueta": "$y = x - 5$"
    }
  ],
  "puntos": [
    {
      "x": 9,
      "y": 4,
      "etiqueta": "(9, 4)",
      "posicion": "no"
    },
    {
      "x": 2,
      "y": 3,
      "color": "azul",
      "etiqueta": "(2, 3)",
      "posicion": "n"
    },
    {
      "x": 2,
      "y": -3,
      "color": "naranja",
      "etiqueta": "(2, -3)",
      "posicion": "e"
    }
  ],
  "vista": {
    "x": [
      -8,
      12
    ],
    "y": [
      -6,
      6
    ]
  },
  "descripcion": "El eje horizontal es $x$ y el vertical es $y$. La curva azul es $y = \\sqrt{x + 7}$, que empieza en $(-7, 0)$ y nunca baja del eje; la recta naranja es $y = x - 5$. Las soluciones de $\\sqrt{x + 7} = x - 5$ son los cortes entre las dos: hay uno solo, en $(9, 4)$. El candidato falso $x = 2$ se ve en la gráfica: ahí la raíz vale $3$ y la recta vale $-3$, dos puntos distintos. Elevar al cuadrado los volvió iguales porque $3^2 = (-3)^2$. La raíz tiene dominio $[-7, \\infty)$ e imagen $[0, \\infty)$; la recta, dominio e imagen $\\mathbb{R}$."
}
```

#### 0.8 Valor absoluto

El valor absoluto $|A|$ es la distancia de $A$ al $0$. De ahí salen tres reglas, todas con $b \geq 0$:

:::paso
$$
|A| = b \iff A = b \;\text{ o }\; A = -b
$$
Dos números están a distancia $b$ del $0$: $b$ y $-b$.
:::

:::paso
$$
|A| < b \iff -b < A < b
$$
Estar a menos de $b$ del $0$ es estar entre $-b$ y $b$.
:::

:::paso
$$
|A| > b \iff A < -b \;\text{ o }\; A > b
$$
Estar a más de $b$ del $0$ es estar afuera de ese intervalo.
:::

**Ejemplo.** $|3x + 2| = 7$ da $3x + 2 = 7$ o $3x + 2 = -7$, o sea $x = \tfrac{5}{3}$ o $x = -3$.

**Ejemplo.** $|x - 4| \leq 2$ da $-2 \leq x - 4 \leq 2$. Sumando $4$ en las tres partes queda $2 \leq x \leq 6$, o sea el intervalo $[2, 6]$.

Si $b < 0$, la ecuación $|A| = b$ no tiene solución, porque una distancia nunca es negativa.

#### 0.9 Desigualdades

Se despejan igual que las ecuaciones, con una regla extra: **multiplicar o dividir por un número negativo invierte el sentido de la desigualdad.**

Contraejemplo de por qué: $2 < 3$, pero al multiplicar por $-1$ queda $-2 > -3$.

:::paso
$$
-3x + 4 > 10 \;\Longrightarrow\; -3x > 6 \;\Longrightarrow\; x < -2
$$
Restamos $4$ en ambos lados y luego dividimos por $-3$; como es negativo, $>$ se vuelve $<$.
:::

**Desigualdades con fracciones: tabla de signos.** Nunca multipliques por una expresión con $x$, porque no sabes si es positiva o negativa.

$$
\frac{x-1}{x+3} \geq 0
$$

Puntos críticos: donde el numerador vale $0$ ($x = 1$) y donde el denominador vale $0$ ($x = -3$). Dividen la recta en tres tramos.

| Tramo | $x - 1$ | $x + 3$ | Cociente |
| --- | --- | --- | --- |
| $x < -3$ (prueba $x = -4$) | $-$ | $-$ | $+$ |
| $-3 < x < 1$ (prueba $x = 0$) | $-$ | $+$ | $-$ |
| $x > 1$ (prueba $x = 2$) | $+$ | $+$ | $+$ |

El cociente es $\geq 0$ en los tramos con $+$, y vale $0$ en $x = 1$. En $x = -3$ no existe. Solución: $(-\infty, -3) \cup [1, \infty)$, con $-3$ abierto y $1$ cerrado.

#### 0.10 Exponenciales y logaritmos

| Propiedad | Fórmula | Condición |
| --- | --- | --- |
| Inversas | $\ln(e^x) = x$ y $e^{\ln x} = x$ | la segunda, $x > 0$ |
| Producto | $\ln(ab) = \ln a + \ln b$ | $a, b > 0$ |
| Cociente | $\ln(a/b) = \ln a - \ln b$ | $a, b > 0$ |
| Potencia | $\ln(a^r) = r \ln a$ | $a > 0$ |
| Exponentes | $e^a \cdot e^b = e^{a+b}$ y $(e^a)^b = e^{ab}$ | ninguna |

**Ejemplo.** $e^{2x - 1} = 5$.

:::paso
$$
2x - 1 = \ln 5
$$
Aplicamos $\ln$ a ambos lados; se puede porque $5 > 0$, y $\ln$ deshace a $e^x$.
:::

:::paso
$$
x = \frac{1 + \ln 5}{2}
$$
Sumamos $1$ y dividimos por $2$. Es un valor exacto: no lo pases a decimal salvo que te lo pidan.
:::

**Ejemplo.** $\ln(x + 1) + \ln(x - 1) = \ln 8$.

:::paso
$$
x + 1 > 0 \;\text{ y }\; x - 1 > 0 \;\Longrightarrow\; x > 1
$$
Restricción primero: los argumentos de los logaritmos deben ser positivos.
:::

:::paso
$$
\ln\big((x+1)(x-1)\big) = \ln 8 \;\Longrightarrow\; x^2 - 1 = 8
$$
Propiedad del producto; luego, como $\ln$ es inyectiva, argumentos iguales.
:::

:::paso
$$
x^2 = 9 \;\Longrightarrow\; x = 3 \;\text{ o }\; x = -3
$$
Sumamos $1$ y sacamos raíz con $\pm$. Pero $x = -3$ incumple $x > 1$. La única solución es $x = 3$.
:::

#### 0.11 Lista de chequeo antes de despejar

- [ ] Anoté las restricciones: denominadores $\neq 0$, radicandos pares $\geq 0$, argumentos de $\ln$ $> 0$.
- [ ] Deshice las operaciones de afuera hacia adentro.
- [ ] No dividí por algo que pudiera valer $0$.
- [ ] Puse $\pm$ al sacar raíz cuadrada.
- [ ] Invertí la desigualdad al multiplicar o dividir por un negativo.
- [ ] Verifiqué en la ecuación original y descarté las soluciones prohibidas.

### Ejemplo

**Ejemplo (de 0.2).** Despejar $x$.

$$
\frac{3(2x-5)}{4} + 1 = 7
$$

La última operación que se hizo fue sumar $1$; esa capa sale primero.

:::paso
$$
\frac{3(2x-5)}{4} = 6
$$
Restamos $1$ en ambos lados: $7 - 1 = 6$.
:::

:::paso
$$
3(2x-5) = 24
$$
Multiplicamos ambos lados por $4$, que es distinto de $0$, para deshacer la división.
:::

:::paso
$$
2x-5 = 8
$$
Dividimos ambos lados por $3$, que es distinto de $0$.
:::

:::paso
$$
2x = 13
$$
Sumamos $5$ en ambos lados.
:::

:::paso
$$
x = \frac{13}{2}
$$
Dividimos ambos lados por $2$. Es la capa más interna, la primera que le pusieron a la $x$.
:::

**Verificación.** $2 \cdot \tfrac{13}{2} - 5 = 8$; luego $3 \cdot 8 / 4 = 6$; luego $6 + 1 = 7$. Coincide con el lado derecho.

### Trampas

**Trampa: simplificar no recupera puntos excluidos** (de 0.4). Resolver $\dfrac{x^2 - 4}{x - 2} = 4$. La restricción es $x \neq 2$. Si simplificas a $x + 2 = 4$ sale $x = 2$, que está prohibido. Conclusión: la ecuación **no tiene solución**.

**Trampa: dividir por $x$** (de 0.5). En $x^2 = 5x$, si divides por $x$ te queda $x = 5$ y pierdes $x = 0$. Lo correcto es $x^2 - 5x = 0$, $x(x - 5) = 0$, así que $x = 0$ o $x = 5$. Contraejemplo: $0^2 = 5 \cdot 0$ es verdadero.

**Trampa: la raíz de un cuadrado** (de 0.5). $\sqrt{x^2} = |x|$, no $x$. Contraejemplo: con $x = -3$, $\sqrt{(-3)^2} = \sqrt{9} = 3$, que no es $-3$. Por eso $x^2 = 9$ da $x = 3$ o $x = -3$.

**Trampa** (de 0.10). $\ln(a + b)$ no es $\ln a + \ln b$. Contraejemplo: $\ln(1 + 1) = \ln 2 \approx 0{,}693$, mientras que $\ln 1 + \ln 1 = 0$.

### Practica

Dilo con tus palabras: ¿por qué elevar al cuadrado puede crear soluciones falsas, y dividir por $x$ puede borrar soluciones?

1. Despeja $x$: $\dfrac{5 - 2x}{3} + 4 = 1$.
2. Resuelve $\sqrt{2x + 3} = x$.
3. Despeja $x$ en $y = \dfrac{2x - 1}{x + 4}$ y di qué valor de $y$ queda prohibido.
4. Resuelve $\dfrac{x + 2}{x - 5} < 0$ con tabla de signos.
5. Resuelve $3e^{x+2} = 12$.
