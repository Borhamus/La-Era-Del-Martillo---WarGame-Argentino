# ⚔️ MANUAL DE REGLAS: [NOMBRE DE TU JUEGO]

Este sistema se basa en el **Combate Heroico de Escaramuzas**, donde cada unidad es un ser poderoso con múltiples opciones tácticas y una supervivencia detallada.

## 1. EL SISTEMA DE ACTIVACIÓN

El juego funciona mediante **Activación Alternada**.

- Un jugador activa una unidad, realiza todas sus acciones y reacciones.
- Luego, el oponente activa una de las suyas.
- Al comienzo de cada ronda, cada unidad gana una ficha de "Turno", que cuando usa su turno, la pierde, entrando en el estado "Agotado"

## 2. RECURSOS DE UNIDAD

Cada unidad gestiona dos recursos principales por ronda:

- **Puntos de Acción (PA):** Se gastan para Mover, Atacar, Escapar, Robar o realizar Reacciones.
- **Puntos de Energía (PE):** Se usan para habilidades mágicas. Pueden ser propios, del entorno o de algun objeto magico cargado.
  - _Uso del Entorno:_ Si no hay vínculo con la Gema o carga magica, el uso de PE crea una **"Zona Seca"** en el mapa donde ya no se puede extraer energía por el resto de la partida. (Cada habilidad debe especificar cuanto consume de terreno)

- Cada unidad tiene su propio valor de Puntos de Acción y Energía.

## 3. ATRIBUTOS PRINCIPALES (Escala 1-6)

Todas las tiradas de éxito utilizan el motor: **1d12 + Atributo + Modificadores**.

- **Melee Attack:** Precisión en combate cuerpo a cuerpo.
- **Range Attack:** Precisión con armas a distancia.
- **Reflejos:** Capacidad de esquiva y rapidez de reacción.
- **Bloqueo:** Capacidad defensiva con equipo o técnica.
- **Focus:** Capacidad para mantener o potenciar efectos mágicos/técnicos.
- **Resistencias (Física/Mágica):** Determinan la probabilidad de evitar estados alterados (Sangrado, Sueño, etc.).

---

## 4. SISTEMA DE COMBATE: EL POOL DE ATAQUE

Para agilizar el juego, el atacante lanza todos los dados a la vez:

1.  **1d12 (Acción):** Debe superar el valor de Bloqueo o Reflejos del defensor.
2.  **1d100 (Puntería):** Define la zona de impacto inmediata.
3.  **1d6 / 1d6+1d4 (Efecto):** Define la potencia del estado alterado que intenta aplicar.

### Ejemplo de tirada de Ataque

EL Jugado A vs Jugador B: El jugador A selecciona una unidad, y la mueve hacia la unidad enemiga(Gastando 1 PA) 
y luego ataca de forma mele, porque su arma esta dentro del rango. 
Este golpe tiene chance de dejar al enemigo con el efecto negativo "sangrado".

Para el ataque, el Jugador A tira:
- Exito en la tirada: 1D12 + STATS(+1 a +6) + Modificadores(-4 a +4) : Como tirada enfrentada para ver si logra golpearlo.
- 1D100                                                              : Para ver en que parte del cuerpo golpeará.
- 1D6 + Modificadores(-4 a +4)                                       : (Si se logra el hit de exito) Como tirada enfrentada a resistencia para ver si logra entrar el efecto.

El Jugador B, debera tirar por su unidad que esta por recibir el daño Tirada de Bloqueo:
- Tirada de Salvación: 1D12 + STATS(+1 a +6) + Modificadores(-4 a +4) : Como tirada enfrentada para ver si logra defenderse.
- 1D6 + Modificadores(-4 a +4)                                       : (Si el enemigo tiene exito, sirve esto) Como tirada enfrentada a efecto para ver si logra resistir el efecto.

### Comparativa de Tiradas: Resolución de Combate

| Fase de Dados | Jugador A (Atacante) | Jugador B (Defensor) |
| :--- | :--- | :--- |
| **Acción vs Defensa** | $1d12 + 2 + 1 = 6 + 2 + 1 = 9$ | $1d12 + 1 + 2 = 5 + 1 + 2 = 8$ |
| **Puntería (Zona)** | $1d100 = 50$ (Cuerpo) | — |
| **Efecto vs Resistencia** | $1d6 + 1 = 4 + 1 = 5$ | $1d6 + 3 = 5 + 3 = 8$ |

***

**Resultado de la acción:**
1. **Impacto:** El ataque del Jugador A (9) supera la defensa del Jugador B (8). El golpe conecta.
2. **Localización:** El dado de puntería indica la zona del **Cuerpo**.
3. **Estado:** El Jugador B resiste el efecto negativo, ya que su tirada de resistencia (8) es superior a la potencia de efecto del atacante (5).

En este caso el jugador A logra hacer que su unidad golpee a la unidad enemiga en la posicion correspondiente a 50( en este ejemplo el cuerpo) haciendo x de daño(Depende del arma).

Vamos a decir que es daño 4.
En la parte del cuerpo, debera reducirse el daño total por el valor de "Reducción de Daño" o RD para abreviar:
Daño entrante(4)-Cuerpo(RD:2)= 2 de daño.

Y como la tirada de resistencia es superior al efecto, no aplica el efecto negativo.

---

## Composicion de una "Party"

El juego podra tener varios formatos en el futuro, pero de momento el unico formato es "Estandar".
Estandar: Cada jugador tiene 60 puntos, para armar su party.

Reglas: 
* Solo unidades de una unica faccion.
* Deberas usar el Manual de tu faccion para equipar a tus heroes con "Equipo", "Artefactos" y "Magias".
* No puedes superar 60 puntos, pero si puedes tener una "Lista" de menos de 60 puntos como valida.


Cada unidad tiene espacios para equiparse, armadura, armas, reliquias, objetos, y spells.
Cada unidad tiene un costo diferente, debido a que cada unidad tendra diferentes capacidades, 
por ejemplo, habra heroes que no pueden equiparse anillos, o no podran equiparse una gema, 
como algunos que no podran usar spells y otros con una amplia capacidad de spells.


Cabeza: Casco, Hombreras.
Brazos: Guantes, Mangas, Anillo1, Anillo2
Piernas: Pantalon, Calzado
Cuerpo: Pechera, Cinturon, Collar.
Armas: 2d1Mano, 1d2Manos, 1D1Mano+Adicional(artefacto/otra arma)
Spells: 1 a 6
Gema: (Puede o no equipar una gema)
Inventario: 1 a 6.

En el inventario pueden ir consumibles.


Tunicas, Armaduras medias, pesadas:
Utiles para magos, utiles para dps, utiles para tankes.

Las tunicas, no dan armadura pero dan mejoras magicas.
Las armaduras medianas, dan poca armadura, pero no reducen la velocidad de movimiento.
Las armaduras pesadas dan mejor armadura, pero reducen la velocidad de movimiento.

Entonces:
Cada unidad tiene sus stats y caracteristicas fijas. 
Cada jugador podra gastar puntos para elegir su party y su equipo.
**Podria tener una pag web, donde te permita editar tu party, 
para que puedas imprimir tus fichas todas como las personalizaste.
Para que puedas ver cada poder, habilidad y demas. 
Como agregar guias ayuda si hace falta, para los novatos.

Y que la pagina te permita tener listas. y editar listas, copiar listas, compartir listas.
Una pagina con rankings.
Historial de peleas.


---

El Objetivo del juego:
En cada partida, cada jugador debera robar 2 cartas del maso de misiones, mescladas. y esta es informacion secreta.
Si no se puede cumplir la condicion secreta el jugador podra tirar la carta y poder volver a robar.
El objetivo general siempre es el mismo, "Aniquilar" al equipo enemigo, o "Robar" la gema enemiga y depositarla en la base.

Las misiones secretas pueden ser cosas como: 
Conquistar x puntos de control por tantas rondas.
Crear x cantidad de zonas secas.
Busqueda de Reliquia:(debera ocupar un punto de control por 1 ronda entera para poder sacar una carta de reliquias aleatoriamente) Quedara en el inventario de la unidad que la saque.
Mantener  una linea defensiva en una zona por tantas rondas.
Hacer retroceder una linea defensiva en esta ronda.

Cuando se cumple una mision secreta, se revela, se toman los puntos y se tira la carta al descarte, al comienzo de cada ronda robas 2 cartas de misiones secretas.
Se acumulan, y solo podes "descartar y robar 1" 1 vez por ronda.

---

## FICHA GENÉRICA DE UNIDAD

**Nombre del Héroe:**
**Facción:** 
**Raza:** 
**Clase:** 


### ESTADÍSTICAS (Stats)

| ATRIBUTO        |  VALOR  | DESCRIPCIÓN                             |
| :-------------- | :-----: | :-------------------------------------- |
| **P. ACCIÓN**   | 1/2/3/4 | Cantidad de Acciones posibles por ronda |
| **P. ENERGIA**  | 1/2/3/4 | Cantidad de casteos posibles por ronda  |
| **ROBAR**       |  +\_\_  | Bono a tirada de 1d12                   |
| **FOCUS**       |  +\_\_  | Bono para extender efectos/magia        |
| **MOVIMIENTO**  | \_\_ cm | Distancia por cada 1 PA                 |
| **MELEE ATK**   |  +\_\_  | Bono a tirada de 1d12                   |
| **RANGE ATK**   |  +\_\_  | Bono a tirada de 1d12                   |
| **REFLEJOS**    |  +\_\_  | Dificultad para ser impactado (Esquiva) |
| **BLOQUEO**     |  +\_\_  | Dificultad para ser impactado (Defensa) |
| **RES. FÍSICA** |  +\_\_  | Bono a 1d6 contra estados físicos       |
| **RES. MÁGICA** |  +\_\_  | Bono a 1d6 contra estados mágicos       |

**Vínculo Gema:** [ SI ] [ NO ] : 
Esto se debe marcar con un item en la ficha para indicar si esta con vinculo a la gema o no.

Para usar Reflejos deberas gastar 2PA, ya que esquivas el daño y tiene esa unidad la prioridad para moverse,
gastando por esa razon 2 puntos ya que es a modo respuesta.

### ESTADO DE SALUD (Localización de Daño)

_Tirar 1d100 para localizar impacto._

| ZONA        | RANGO 1d100 | PV MÁX | RD        | ESTADO / EFECTO 0 PV       |
| :---------- | :---------: | :----: | :-------: | :------------------------- |
| **CABEZA**  |  96 - 100   |   4    | 0/1/2/3/4 | Incapacitado / Muerte      |
| **BRAZOS**  |   81 - 95   |   6    | 0/1/2/3/4 | Incapas de usar armas      |
| **PIERNAS** |   66 - 80   |   6    | 0/1/2/3/4 | Movimiento reducido al 50% |
| **CUERPO**  |   01 - 65   |   10   | 0/1/2/3/4 | **UNIDAD ELIMINADA**       |

**RD: Reduccion de daño.**
Cada personaje tendra segun sus caracteristicas y equipo un RD Diferente.
Tanto habilidades como el equipo puede modificar este valor. modif posibles (-4 a +4).
Ningun modificador puede sumerar el minimo o el maximo de modificadores. 
Un atributo a 0 o menos, siempre sera 0. No existen negativos.
Daño entrante - RD

---

### ACCIONES DISPONIBLES (Coste Típico: 1 PA)

- **Mover:** Desplazarse según stat de Movimiento.
- **Melee/Disparar:** Realizar un ataque usando un punto de accion.
- **Placaje:** Intento de mover o derribar a una unidad enemiga.
- **Asistir:** Otorgar un bono de +2 a la siguiente tirada de un aliado cercano.
- **Robar:** Intento de interactuar con objetos o la Gema enemiga.
- **Reacción:** Acción fuera de turno (Moverse, Bloquear, Esquivar, Disparar o Hechizo Rápido).

---

Gem Control: 
Es el control que tiene el portador de la gema sobre la gema, significa la cantidad de energía que puede sacarle a la gema por ronda. Esta energía sirve para usar habilidades, magias, y activar ciertos efectos. Siempre que tus unidades estén dentro del área de influencia de esta unidad, podrá usar ésta energía, como también ésta unidad puede darle energía a las unidades dentro del rango de influencia, esta energia se gasta al final de la ronda, y no se apila, pero dura la ronda entera, por lo que si le das 2 de energía a una unidad, esa unidad podrá castear luego, dentro de la ronda sin gastar energía del entorno ni necesitando estar en el radio de influencia del que tiene la gema.

Influence Area: el área de influencia de la “unidad con gema/Líder”.
dentro de esta área los caster pueden castear gastando puntos de energía de gema.

## Hay varias formas de presentar esto mismo. cada faccion tiene su forma de presentar como es su Control point.

