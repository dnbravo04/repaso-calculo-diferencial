---
id: "T"
unidad: 0
titulo: "Trigonometría a fondo"
taller: "—"
plan: "2026-11-21"
---

Toda la trigonometría del curso sale de una sola figura: la circunferencia de radio $1$ centrada en el origen. Si entiendes de dónde sale cada valor, las identidades dejan de ser fórmulas para memorizar.

### Definición formal

#### T.1 Radianes

Un radián es el ángulo que abarca un arco de longitud igual al radio. Una vuelta completa mide $2\pi$ rad, porque la circunferencia mide $2\pi r$.

:::paso
$$
\pi \text{ rad} = 180^\circ \qquad \text{grados} \to \text{rad: } \times\frac{\pi}{180} \qquad \text{rad} \to \text{grados: } \times\frac{180}{\pi}
$$
Regla de conversión: se multiplica por el factor que cancela la unidad que quieres quitar.
:::

**Ejemplo.** $150^\circ \cdot \tfrac{\pi}{180} = \tfrac{150\pi}{180} = \tfrac{5\pi}{6}$. Al revés: $\tfrac{5\pi}{4} \cdot \tfrac{180}{\pi} = 225^\circ$.

Unidades SI: el radián es la unidad SI de ángulo, y la longitud de arco es $s = r\theta$ con $r$ en metros y $\theta$ en radianes. Con $r = 2\ \text{m}$ y $\theta = \tfrac{\pi}{3}$ rad, $s = \tfrac{2\pi}{3}\ \text{m}$.

#### T.2 La circunferencia unitaria

Definición exacta: al ángulo $\theta$, medido desde el semieje $x$ positivo, le corresponde el punto $P(\theta)$ de la circunferencia $x^2 + y^2 = 1$.

:::paso
$$
P(\theta) = (\cos\theta,\ \operatorname{sen}\theta)
$$
El coseno es la primera coordenada del punto y el seno es la segunda.
:::

:::paso
$$
\tan\theta = \frac{\operatorname{sen}\theta}{\cos\theta} \quad \cot\theta = \frac{\cos\theta}{\operatorname{sen}\theta} \quad \sec\theta = \frac{1}{\cos\theta} \quad \csc\theta = \frac{1}{\operatorname{sen}\theta}
$$
Las otras cuatro funciones se definen a partir de seno y coseno. Cada una existe solo donde su denominador no vale $0$.
:::

### Idea en palabras

Metáfora (de T.2): imagina un personaje que da vueltas en una pista circular de radio $1$, saliendo del punto $(1, 0)$ y girando contra las manecillas del reloj. Su sombra sobre el piso (eje $x$) es el coseno; su altura (eje $y$) es el seno.

### Método

#### T.3 Valores exactos: de dónde salen

No se memorizan: salen de dos triángulos.

**Ángulo $\tfrac{\pi}{4}$ ($45^\circ$).** El triángulo es isósceles: sus dos catetos miden lo mismo, digamos $a$. Por Pitágoras con hipotenusa $1$:

:::paso
$$
a^2 + a^2 = 1 \;\Longrightarrow\; a^2 = \frac{1}{2} \;\Longrightarrow\; a = \frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2}
$$
Sumamos los cuadrados de los catetos e igualamos al cuadrado de la hipotenusa; tomamos la raíz positiva porque es una longitud, y racionalizamos multiplicando arriba y abajo por $\sqrt{2}$. Así, $\cos\tfrac{\pi}{4} = \operatorname{sen}\tfrac{\pi}{4} = \tfrac{\sqrt{2}}{2}$.
:::

**Ángulos $\tfrac{\pi}{6}$ ($30^\circ$) y $\tfrac{\pi}{3}$ ($60^\circ$).** Toma un triángulo equilátero de lado $1$ y pártelo por la mitad con su altura $h$. Queda un triángulo con hipotenusa $1$, cateto corto $\tfrac{1}{2}$ y ángulos de $30^\circ$ y $60^\circ$.

:::paso
$$
h^2 + \left(\tfrac{1}{2}\right)^2 = 1 \;\Longrightarrow\; h^2 = \frac{3}{4} \;\Longrightarrow\; h = \frac{\sqrt{3}}{2}
$$
Pitágoras otra vez. El cateto de $\tfrac{1}{2}$ queda frente al ángulo de $30^\circ$ y la altura $\tfrac{\sqrt{3}}{2}$ frente al de $60^\circ$.
:::

| Ángulo | $0$ | $\tfrac{\pi}{6}$ | $\tfrac{\pi}{4}$ | $\tfrac{\pi}{3}$ | $\tfrac{\pi}{2}$ |
| --- | --- | --- | --- | --- | --- |
| $\operatorname{sen}$ | $0$ | $\tfrac{1}{2}$ | $\tfrac{\sqrt{2}}{2}$ | $\tfrac{\sqrt{3}}{2}$ | $1$ |
| $\cos$ | $1$ | $\tfrac{\sqrt{3}}{2}$ | $\tfrac{\sqrt{2}}{2}$ | $\tfrac{1}{2}$ | $0$ |

Truco para recordarla: el seno es $\tfrac{\sqrt{0}}{2}, \tfrac{\sqrt{1}}{2}, \tfrac{\sqrt{2}}{2}, \tfrac{\sqrt{3}}{2}, \tfrac{\sqrt{4}}{2}$; el coseno es la misma fila al revés. La fila de la tangente, y los valores en $\pi$, son el TF 55: calcúlalos tú con $\tan = \operatorname{sen}/\cos$.

#### T.4 Signos por cuadrante y ángulo de referencia

| Cuadrante | Ángulos | $\operatorname{sen}$ | $\cos$ | $\tan$ |
| --- | --- | --- | --- | --- |
| I | $0 < \theta < \tfrac{\pi}{2}$ | $+$ | $+$ | $+$ |
| II | $\tfrac{\pi}{2} < \theta < \pi$ | $+$ | $-$ | $-$ |
| III | $\pi < \theta < \tfrac{3\pi}{2}$ | $-$ | $-$ | $+$ |
| IV | $\tfrac{3\pi}{2} < \theta < 2\pi$ | $-$ | $+$ | $-$ |

El signo sale de las coordenadas: en el cuadrante II el punto está a la izquierda ($x < 0$, coseno negativo) y arriba ($y > 0$, seno positivo).

**Método del ángulo de referencia** para ángulos fuera del primer cuadrante:

1. Ubica el cuadrante del ángulo.
2. Halla el ángulo de referencia: la distancia angular al eje $x$, siempre entre $0$ y $\tfrac{\pi}{2}$.
3. Toma el valor de la tabla para ese ángulo de referencia.
4. Ponle el signo que corresponde al cuadrante.

**Ejemplo.** $\operatorname{sen}\tfrac{5\pi}{4}$.

:::paso
$$
\frac{5\pi}{4} = \pi + \frac{\pi}{4}
$$
Paso 1 y 2: se pasa media vuelta y un octavo más, así que está en el cuadrante III con referencia $\tfrac{\pi}{4}$.
:::

:::paso
$$
\operatorname{sen}\frac{5\pi}{4} = -\operatorname{sen}\frac{\pi}{4} = -\frac{\sqrt{2}}{2}
$$
Paso 3 y 4: en el cuadrante III el seno es negativo; el valor de la tabla es $\tfrac{\sqrt{2}}{2}$.
:::

**Ejemplo.** $\tan\tfrac{11\pi}{6}$. Como $\tfrac{11\pi}{6} = 2\pi - \tfrac{\pi}{6}$, está en el cuadrante IV con referencia $\tfrac{\pi}{6}$. Ahí $\operatorname{sen} = -\tfrac{1}{2}$ y $\cos = \tfrac{\sqrt{3}}{2}$.

:::paso
$$
\tan\frac{11\pi}{6} = \frac{-1/2}{\sqrt{3}/2} = -\frac{1}{\sqrt{3}} = -\frac{\sqrt{3}}{3}
$$
Definición de tangente; dividir fracciones con el mismo denominador $2$ deja $-\tfrac{1}{\sqrt{3}}$, y racionalizamos.
:::

#### T.5 Las seis funciones: tabla de propiedades

| Función | Dominio | Imagen | Período | Paridad | Ceros | Asíntotas verticales |
| --- | --- | --- | --- | --- | --- | --- |
| $\operatorname{sen} x$ | $\mathbb{R}$ | $[-1, 1]$ | $2\pi$ | impar | $x = k\pi$ | no tiene |
| $\cos x$ | $\mathbb{R}$ | $[-1, 1]$ | $2\pi$ | par | $x = \tfrac{\pi}{2} + k\pi$ | no tiene |
| $\tan x$ | $x \neq \tfrac{\pi}{2} + k\pi$ | $\mathbb{R}$ | $\pi$ | impar | $x = k\pi$ | $x = \tfrac{\pi}{2} + k\pi$ |

Aquí $k$ es cualquier entero. Las filas de $\cot$, $\sec$ y $\csc$ son el TF 56; complétalas tú con estas pistas:

- **Dominio**: excluye donde el denominador de su definición (T.2) vale $0$. Esos puntos son también las asíntotas verticales.
- **Imagen de $\sec$ y $\csc$**: si $|\cos x| \leq 1$, ¿qué pasa con $\left|\tfrac{1}{\cos x}\right|$? Piensa qué valores entre $-1$ y $1$ nunca puede tomar.
- **Paridad**: hereda la de su denominador.
- **Ceros**: una fracción vale $0$ solo si su numerador vale $0$. ¿Cuál es el numerador de $\sec$?

#### T.6 Identidades fundamentales

**Pitagórica.** El punto $P(\theta) = (\cos\theta, \operatorname{sen}\theta)$ está sobre la circunferencia $x^2 + y^2 = 1$. Reemplazando $x$ e $y$:

:::paso
$$
\operatorname{sen}^2\theta + \cos^2\theta = 1
$$
Es la ecuación de la circunferencia unitaria evaluada en el punto. Va con **suma**, siempre. La notación $\operatorname{sen}^2\theta$ significa $(\operatorname{sen}\theta)^2$.
:::

:::paso
$$
1 + \tan^2\theta = \sec^2\theta \qquad (\cos\theta \neq 0)
$$
Se obtiene dividiendo la pitagórica entre $\cos^2\theta$: $\tfrac{\operatorname{sen}^2}{\cos^2} = \tan^2$, $\tfrac{\cos^2}{\cos^2} = 1$ y $\tfrac{1}{\cos^2} = \sec^2$.
:::

:::paso
$$
\cot^2\theta + 1 = \csc^2\theta \qquad (\operatorname{sen}\theta \neq 0)
$$
Se obtiene dividiendo la pitagórica entre $\operatorname{sen}^2\theta$.
:::

**Paridad.** El punto del ángulo $-\theta$ es el reflejo del punto de $\theta$ sobre el eje $x$: misma primera coordenada y segunda coordenada con signo contrario.

:::paso
$$
P(-\theta) = (\cos\theta,\ -\operatorname{sen}\theta) \;\Longrightarrow\; \cos(-\theta) = \cos\theta, \quad \operatorname{sen}(-\theta) = -\operatorname{sen}\theta
$$
Las dos salen al mismo tiempo de la misma figura; ninguna se usa para probar la otra.
:::

**Cofunción.** El seno de un ángulo es el coseno de su complemento.

:::paso
$$
\operatorname{sen}\left(\frac{\pi}{2} - \theta\right) = \cos\theta \qquad \cos\left(\frac{\pi}{2} - \theta\right) = \operatorname{sen}\theta
$$
En un triángulo rectángulo, el cateto opuesto a un ángulo agudo es el adyacente del otro, y los dos agudos suman $\tfrac{\pi}{2}$.
:::

#### T.7 Suma y resta de ángulos

:::paso
$$
\operatorname{sen}(a \pm b) = \operatorname{sen}a\cos b \pm \cos a\operatorname{sen}b
$$
El seno mezcla: seno por coseno más coseno por seno, y conserva el signo.
:::

:::paso
$$
\cos(a \pm b) = \cos a\cos b \mp \operatorname{sen}a\operatorname{sen}b
$$
El coseno no mezcla: coseno por coseno, seno por seno, y **invierte** el signo.
:::

:::paso
$$
\tan(a \pm b) = \frac{\tan a \pm \tan b}{1 \mp \tan a\tan b}
$$
Sale de dividir la fórmula del seno entre la del coseno.
:::

*El ejemplo resuelto de este tema está en la sección Ejemplo.*

#### T.8 Ángulo doble

Salen de la suma con $a = b = x$. No hay que memorizarlas aparte.

:::paso
$$
\operatorname{sen}(2x) = \operatorname{sen}(x + x) = \operatorname{sen}x\cos x + \cos x\operatorname{sen}x = 2\operatorname{sen}x\cos x
$$
Fórmula del seno de una suma con $a = b = x$; los dos términos son iguales y se suman.
:::

:::paso
$$
\cos(2x) = \cos^2 x - \operatorname{sen}^2 x
$$
Fórmula del coseno de una suma con $a = b = x$.
:::

:::paso
$$
\cos(2x) = 1 - 2\operatorname{sen}^2 x = 2\cos^2 x - 1
$$
Reemplazamos con la pitagórica: $\cos^2 x = 1 - \operatorname{sen}^2 x$ en la primera versión, o $\operatorname{sen}^2 x = 1 - \cos^2 x$ en la segunda.
:::

:::paso
$$
\tan(2x) = \frac{2\tan x}{1 - \tan^2 x}
$$
Fórmula de la tangente de una suma con $a = b = x$.
:::

#### T.9 Reducción de potencia y ángulo mitad

Despejando de las versiones de $\cos(2x)$ en T.8:

:::paso
$$
\operatorname{sen}^2 x = \frac{1 - \cos(2x)}{2} \qquad \cos^2 x = \frac{1 + \cos(2x)}{2}
$$
De $\cos(2x) = 1 - 2\operatorname{sen}^2 x$: sumamos $2\operatorname{sen}^2 x$, restamos $\cos(2x)$ y dividimos por $2$. La otra igual, desde $2\cos^2 x - 1$.
:::

Cambiando $x$ por $\tfrac{x}{2}$ salen las de ángulo mitad. El signo $\pm$ se escoge según el cuadrante de $\tfrac{x}{2}$.

$$
\operatorname{sen}\frac{x}{2} = \pm\sqrt{\frac{1 - \cos x}{2}} \qquad \cos\frac{x}{2} = \pm\sqrt{\frac{1 + \cos x}{2}}
$$

**Ejemplo.** $\operatorname{sen}\tfrac{\pi}{8}$, con $\tfrac{\pi}{8}$ la mitad de $\tfrac{\pi}{4}$.

:::paso
$$
\operatorname{sen}\frac{\pi}{8} = +\sqrt{\frac{1 - \frac{\sqrt{2}}{2}}{2}} = \sqrt{\frac{2 - \sqrt{2}}{4}} = \frac{\sqrt{2 - \sqrt{2}}}{2}
$$
Signo $+$ porque $\tfrac{\pi}{8}$ está en el cuadrante I. Multiplicamos arriba y abajo por $2$ dentro de la raíz, y sacamos $\sqrt{4} = 2$. Verificación: $\operatorname{sen}(0{,}3927) \approx 0{,}3827$ y $\tfrac{\sqrt{0{,}5858}}{2} \approx 0{,}3827$.
:::

#### T.10 Cómo demostrar una identidad

Reglas: trabaja un solo lado hasta llegar al otro, o los dos por separado hasta una misma expresión. Nunca "pases" términos de un lado al otro, porque eso supone que ya es verdad lo que quieres probar.

**(a) Enunciado.**

$$
\frac{1 - \cos(2x)}{\operatorname{sen}(2x)} = \tan x, \qquad \operatorname{sen}(2x) \neq 0
$$

**(b) Idea.** El lado izquierdo tiene ángulos dobles y el derecho no. Si cambio cada expresión de ángulo doble por su versión en ángulo simple, algo se va a cancelar.

**(c) Pasos.**

1. Numerador:

:::paso
$$
1 - \cos(2x) = 1 - (1 - 2\operatorname{sen}^2 x) = 2\operatorname{sen}^2 x
$$
Usamos $\cos(2x) = 1 - 2\operatorname{sen}^2 x$, la versión que deja el $1$ listo para cancelarse.
:::

2. Denominador:

:::paso
$$
\operatorname{sen}(2x) = 2\operatorname{sen}x\cos x
$$
Identidad del seno del ángulo doble.
:::

3. Cociente:

:::paso
$$
\frac{2\operatorname{sen}^2 x}{2\operatorname{sen}x\cos x} = \frac{\operatorname{sen}x}{\cos x} = \tan x
$$
Cancelamos $2$ y un factor $\operatorname{sen} x$, que no vale $0$ porque $\operatorname{sen}(2x) \neq 0$. Lo que queda es la definición de tangente.
:::

**(d) Conclusión.** Para todo $x$ con $\operatorname{sen}(2x) \neq 0$, se cumple $\dfrac{1 - \cos 2x}{\operatorname{sen} 2x} = \tan x$.

**(e) Verificación con $x = \tfrac{\pi}{6}$.** Izquierda: $\dfrac{1 - \frac{1}{2}}{\frac{\sqrt{3}}{2}} = \tfrac{1}{\sqrt{3}}$. Derecha: $\tan\tfrac{\pi}{6} = \tfrac{1}{\sqrt{3}}$.

#### T.11 Ecuaciones trigonométricas

Método:

1. Despeja la función trigonométrica (Parte 0).
2. Si el valor está fuera de su imagen, no hay solución. Por ejemplo, $\cos x = 2$ es imposible.
3. Halla el ángulo de referencia con el valor sin signo.
4. Usa el signo para escoger los dos cuadrantes posibles.
5. Escribe las soluciones en el intervalo pedido. Si piden todas, suma $k \cdot$ período.

**Ejemplo.** $2\cos x + \sqrt{3} = 0$ en $[0, 2\pi)$.

:::paso
$$
\cos x = -\frac{\sqrt{3}}{2}
$$
Paso 1: restamos $\sqrt{3}$ y dividimos por $2$. El valor está en $[-1, 1]$, así que hay soluciones.
:::

Paso 3: $\cos$ vale $\tfrac{\sqrt{3}}{2}$ en $\tfrac{\pi}{6}$, así que la referencia es $\tfrac{\pi}{6}$. Paso 4: el coseno es negativo en los cuadrantes II y III.

:::paso
$$
x = \pi - \frac{\pi}{6} = \frac{5\pi}{6} \qquad x = \pi + \frac{\pi}{6} = \frac{7\pi}{6}
$$
Paso 5: en el cuadrante II se resta la referencia de $\pi$; en el III se suma. Todas las soluciones: $\tfrac{5\pi}{6} + 2k\pi$ y $\tfrac{7\pi}{6} + 2k\pi$.
:::

**Ejemplo tipo cuadrática.** $2\cos^2 x + \cos x - 1 = 0$ en $[0, 2\pi)$.

:::paso
$$
u = \cos x: \quad 2u^2 + u - 1 = 0 \;\Longrightarrow\; (2u - 1)(u + 1) = 0
$$
Cambio de variable: la ecuación es cuadrática en $\cos x$. Factorizamos: $2u^2 + 2u - u - 1$.
:::

:::paso
$$
\cos x = \frac{1}{2} \Rightarrow x = \frac{\pi}{3},\ \frac{5\pi}{3} \qquad \cos x = -1 \Rightarrow x = \pi
$$
Cada factor igualado a $0$. Coseno positivo: cuadrantes I y IV. Coseno $-1$: el punto $(-1, 0)$.
:::

**Ejemplo con identidad.** $\operatorname{sen}(2x) = \operatorname{sen} x$ en $[0, 2\pi)$.

:::paso
$$
2\operatorname{sen}x\cos x - \operatorname{sen}x = 0 \;\Longrightarrow\; \operatorname{sen}x\,(2\cos x - 1) = 0
$$
Ángulo doble, restamos $\operatorname{sen} x$ y sacamos factor común.
:::

:::paso
$$
\operatorname{sen}x = 0 \Rightarrow x = 0,\ \pi \qquad \cos x = \frac{1}{2} \Rightarrow x = \frac{\pi}{3},\ \frac{5\pi}{3}
$$
Producto igual a $0$: algún factor es $0$.
:::

### Ejemplo

*Viene de «T.7 Suma y resta de ángulos».*

**Ejemplo.** $\cos\tfrac{\pi}{12}$ exacto.

:::paso
$$
\frac{\pi}{12} = \frac{\pi}{3} - \frac{\pi}{4}
$$
Buscamos dos ángulos de la tabla cuya resta dé $\tfrac{\pi}{12}$: $\tfrac{4\pi}{12} - \tfrac{3\pi}{12} = \tfrac{\pi}{12}$.
:::

:::paso
$$
\cos\frac{\pi}{12} = \cos\frac{\pi}{3}\cos\frac{\pi}{4} + \operatorname{sen}\frac{\pi}{3}\operatorname{sen}\frac{\pi}{4}
$$
Fórmula del coseno de una resta: el signo $-$ de adentro se vuelve $+$ afuera.
:::

:::paso
$$
= \frac{1}{2}\cdot\frac{\sqrt{2}}{2} + \frac{\sqrt{3}}{2}\cdot\frac{\sqrt{2}}{2} = \frac{\sqrt{2} + \sqrt{6}}{4}
$$
Valores de la tabla T.3; multiplicamos y usamos $\sqrt{3} \cdot \sqrt{2} = \sqrt{6}$.
:::

**Verificación.** $\tfrac{\pi}{12} \approx 0{,}2618$ y $\cos(0{,}2618) \approx 0{,}9659$. Por otro lado $\tfrac{1{,}4142 + 2{,}4495}{4} \approx 0{,}9659$.

### Trampas

**Trampa** (de T.8). $\cos(2x)$ no es $2\cos x$. Contraejemplo con $x = \tfrac{\pi}{3}$: $\cos\tfrac{2\pi}{3} = -\tfrac{1}{2}$, pero $2\cos\tfrac{\pi}{3} = 1$. Tampoco es $\cos^2(2x)$: con $x = \tfrac{\pi}{2}$, $\cos\pi = -1$, mientras que $\cos^2\pi = 1$.

**Trampa** (de T.11). Si divides ambos lados por $\operatorname{sen} x$, pierdes $x = 0$ y $x = \pi$. Contraejemplo: con $x = \pi$, $\operatorname{sen}(2\pi) = 0 = \operatorname{sen}\pi$, así que $\pi$ sí es solución.

### Practica

Dilo con tus palabras: ¿por qué el seno y el coseno solo pueden tomar valores entre $-1$ y $1$?

1. Calcula exacto $\operatorname{sen}\tfrac{\pi}{12}$ usando una resta de ángulos.
2. Calcula $\cos\tfrac{4\pi}{3}$ y $\operatorname{sen}\tfrac{7\pi}{4}$ con ángulo de referencia.
3. Demuestra con la estructura de T.10: $(\operatorname{sen} x + \cos x)^2 = 1 + \operatorname{sen}(2x)$.
4. Resuelve en $[0, 2\pi)$: $2\operatorname{sen} x + 1 = 0$.
5. Resuelve en $[0, 2\pi)$: $\cos(2x) = \cos x$. Pista: usa $\cos(2x) = 2\cos^2 x - 1$.
