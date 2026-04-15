# ⚔️ LA ERA DEL MARTILLO — BRAINSTORM DE IDEAS
> Documento de trabajo — dump sin filtro. Agregar, tachar, priorizar según avance el diseño.
> Basado en: reglas actuales del juego + referencia al estilo Warmachine/Hordes (Cygnar).

---

## 🗺️ 1. INTERACCIÓN CON EL CAMPO DE BATALLA

### 1.1 Terreno Destructible

- **Pasto / Vegetación baja:** Al pasar una unidad encima queda "aplastado". Las unidades que estaban detrás pierden la cobertura. El campo cambia durante la partida.
- **Arbustos / Matorrales:** Bloquean LOS si la unidad está completamente detrás. Una unidad dentro puede disparar con -1 a Range ATK del enemigo (cobertura parcial). Al salir, el arbusto queda aplastado.
- **Muros bajos:** Dan cobertura parcial (+1 RD) pero no bloquean LOS. Se pueden destruir (PV del muro definido en la carta de escenario).
- **Estructuras:** Edificios con PV que pueden ser demolidos. Si una unidad está dentro y la estructura cae → tira de daño por escombros.
- **Terreno elevado:** Unidades en altura ganan +1 Range ATK. Unidades abajo tienen -1 para atacar hacia arriba.

### 1.2 Line of Sight (LOS)

- **Definición:** Se traza una línea recta desde el centro de la peana atacante al centro de la peana objetivo. Si la línea es interrumpida por terreno sólido → sin LOS → no se puede atacar a distancia.
- **Cobertura parcial:** Si la línea pasa por terreno de cobertura pero llega al objetivo → el objetivo tiene cobertura → -1 a Range ATK del atacante.
- **Unidades como obstáculo:** Una unidad Grande bloquea LOS para unidades Pequeñas detrás de ella.
- **Habilidades que ignoran LOS:** Deben indicarlo explícitamente en la carta.
- **Oscuridad como LOS:** Los Daemons pueden crear zonas que bloquean LOS para enemigos.

### 1.3 Terreno con Identidad Elemental

- **Zona de Luz** (Táin): Los hijos de Táin dentro recuperan 1 PV de Cuerpo al inicio de cada ronda. Los no-vivos reciben 1 daño directo al entrar.
- **Zona de Oscuridad** (Déin): Los Daemons dentro ganan +1 a todos sus atributos. Los enemigos no pueden recuperar PE de reserva propia dentro de la zona.
- **Zona Seca** (ya en reglas): Nadie puede extraer PE del entorno. -1 a Focus.
- **Zona Inestable** (colisión Éter-Vacío): 50% de chance de que el uso de PE falle.
- **Zona de Vacío** (Biskrorum): Desorienta a unidades no-Biskrorum. Altera gravedad (-2 MOV efectivo para enemigos).
- **Nodo de Éter** (Evol): Alta concentración de Éter. Las habilidades de Éter cuestan 1 PE menos. Si colisiona con Vacío → explosión grande.

---

## 👁️ 2. VISIBILIDAD Y OCULTAMIENTO

- **Estado: Oculto** — Una unidad en arbusto/sombra puede gastar 1 PA para volverse Oculta. No puede ser objetivo de ataques a distancia. Pierde el estado al moverse o atacar.
- **Detección automática:** Una unidad a menos de 5cm de una unidad Oculta la detecta automáticamente.
- **Hijos de Táin:** Pueden "ver" almas vivas. No necesitan LOS para *detectar* unidades vivas, pero sí para atacar.
- **Hijos de Biskrorum:** Sus sentidos adaptados a la oscuridad les dan visión de 360° para detectar.
- **Niebla / Humo:** Marcador de 10cm de radio que bloquea LOS para todos. Se disipa al final de la ronda.

---

## 🌿 3. HABILIDADES DE MODIFICACIÓN DEL CAMPO

### 3.1 Invocaciones de Terreno
- **Árbol Invocado** (Táin): Ya en reglas. Bloquea LOS, da bonus a hijos de Táin.
- **Espinas Raíz** (Táin): Franja de 10cm de terreno difícil. Los enemigos que entren reciben 1d4 daño.
- **Muro de Sombra** (Déin): Muro de 15cm largo que bloquea LOS para no-Daemons por 2 rondas.
- **Campo de Vacío** (Biskrorum): Zona de 8cm donde -2 de MOV para enemigos. Los Biskrorum ignoran el efecto.
- **Nodo de Éter** (Evol): Artefacto que genera 2 PE adicionales por ronda para aliados en 15cm. Si es destruido (4 PV) explota 1d6 en 5cm.

### 3.2 Trampas y Preparación
- **Trampa Física:** Se coloca boca abajo. Al pasar encima, la unidad la activa. Efectos: daño, enmarañado, ralentización.
- **Mina de Vacío** (Biskrorum): Al activarse, crea mini-zona de vacío de 3cm. Unidades en 5cm quedan Desorientadas.
- **Reliquia de Campo:** Objetos ocultos en puntos de control que otorgan bonus al ser recogidos.

---

## 🎯 4. MECÁNICAS DE COMBATE ADICIONALES

### 4.1 Ataques Especiales
- **Ataque de Arco:** Viaja en parábola. Puede saltear cobertura baja. No requiere LOS limpia.
- **Proyectil Perforante:** Ignora el penalizador de cobertura parcial.
- **Ataque de Barrida:** Melee que afecta a todas las unidades en contacto con la peana.
- **Embestida:** Corre al doble de MOV (gasta 2 PA) y al terminar ataca Melee con +2 daño.
- **Ataque desde Altura:** +1d4 de daño si la unidad ataca desde terreno elevado en Melee.

### 4.2 Acciones de Control
- **Empuje de Campo:** Como Placaje pero con arma de 2 manos. Empuja hasta 8cm. Si choca con muro recibe daño extra.
- **Derribo de Cobertura:** 1 PA para destruir cobertura ligera en contacto (se convierte en escombro).

### 4.3 Sinergia
- **Asistencia de Flanco:** Si dos aliados atacan al mismo objetivo en el mismo turno, la segunda unidad gana +2 al ataque.
- **Cadena de Energía:** Un aliado con Vínculo activo puede pasar 1 PE a un aliado adyacente como acción gratuita (sin PA).
- **Boost (relanzar dado):** Gastar 1 PE extra al declarar un ataque para relanzar el 1d12 de Éxito una vez.

---

## 🎲 5. MISIONES SECUNDARIAS (NUEVAS IDEAS)

- **"El Exterminador":** Elimina 3 unidades enemigas en una sola ronda.
- **"La Sombra":** Mantén una unidad Oculta durante 2 rondas consecutivas.
- **"Zona Controlada":** Ocupa el punto central una ronda entera sin perder ninguna unidad en él.
- **"El Drenador":** Crea 3 Zonas Secas antes del final de la ronda 3.
- **"Último en Pie":** Lleva una unidad aliada a menos de 2 PV de Cuerpo y mantenla viva hasta el final de la ronda.
- **"El Heraldo":** Mata al Líder enemigo con tu Líder.
- **"La Reliquia":** Ocupa el punto de reliquia, saca una carta, y úsala en la misma ronda.
- **"Sin Bajas":** Termina una ronda completa sin perder ninguna unidad. (Alto valor en puntos.)

---

## 🃏 6. CARTAS DE RELIQUIA (IDEAS)

- **Fragmento de Gema Rota:** Una vez por partida, la unidad puede usar PE sin crear Zona Seca.
- **Armadura del Caído:** +2 RD en todas las zonas por 1 ronda. Luego se destruye.
- **Ojo del Moderador:** Una vez por partida, la unidad puede ver el LOS de cualquier otra unidad.
- **Elixir de Combate:** Recupera todos los PV de una zona a elección.
- **Arma Legendaria:** Equipa un arma extra con propiedades únicas por 1 ronda.
- **El Contrato del Moderador:** Revela una carta de misión secundaria enemiga por 1 ronda.

---

## 🏛️ 7. IDEAS DE ESCENARIOS

- **Centro de Gravedad:** El punto central vale 3 puntos. Los de los flancos valen 1. 5 rondas.
- **El Puente:** Mapa lineal. El que cruce más unidades al otro lado en 4 rondas gana.
- **La Trampa:** El Equipo A despliega todo. El Equipo B comienza en el borde y debe llegar al fondo en 5 rondas.
- **El Tesoro Compartido:** 3 reliquias en el campo. Más reliquias al final = gana.
- **Defensa de la Gema:** Un jugador defiende la Gema en su base. El otro debe robarla y depositarla. El defensor recibe unidades adicionales.
- **Noche Permanente** (mapa Déin): LOS reducida a 20cm para todos. Los Daemons ignoran la limitación.
- **Bosque Viviente** (mapa Táin): Al inicio de cada ronda, 1d6 arbustos se mueven 3cm en dirección aleatoria.
- **La Máquina Funciona** (mapa Evol/Biskrorum): Estructuras mecánicas que disparan automáticamente a unidades que pasen cerca.

---

## 🎖️ 8. SISTEMA DE HAZAÑA (inspirado en Feats de Warmachine)

Cada Líder tiene una habilidad llamada **HAZAÑA** que se usa **una sola vez por partida**. Es el poder más dramático e impactante del Líder. Ejemplos:

- **Hazaña de César (Daemon):** "El Ejército de los Caídos" — Todos los cuerpos en el tablero se reaniman como esqueletos con stats básicos durante 1 ronda. Luego se derrumban.
- **Hazaña de Ghordikkal (Táin):** "Crecimiento Masivo" — En toda la zona de influencia crecen 1d6 árboles instantáneamente en posiciones a elección.
- **Hazaña de Thuriom (Biskrorum):** "Protocolo de Singularidad" — Crea un campo de Vacío gigante de 20cm de radio centrado en él por 1 ronda entera.
- **Hazaña de Bjóras (Evol):** "Sobrecarga del Nodo" — Todos los Nodos de Éter en el campo explotan simultáneamente (daño enorme) y liberan 10 PE que cualquier aliado puede usar ese turno.

---

## 📐 9. FORMATO Y PRESENTACIÓN (inspirado en Warmachine/D&D)

- **Fichas:** Tamaño carta, con borde negro, frente y dorso. Para recortar y plastificar.
- **Cartas de misión:** Formato Magic (88×63mm). Mazo separado por tipo.
- **Tokens de estado:** Discos de colores. Un color por estado.
- **Marcadores de Zona:** Círculos de acetato en varios radios. Colores: rojo = Zona Seca, violeta = Vacío, dorado = Éter, verde = Luz, negro = Oscuridad.
- **Regla de LOS:** Hilo de piolín fino tensado entre peanas. Si toca un obstáculo → sin LOS.
- **Dados de facción:** d12 personalizados con el símbolo de cada facción en el 12 (el "Crítico" de facción).
- **Peanas de colores:** Un color por facción para identificar a distancia.

---

## ✅ 10. PENDIENTES DE DISEÑO

- [ ] Regla formal de terreno destructible con ejemplos y tabla de PV de estructuras
- [ ] Sistema de LOS formal con diagrama explicativo
- [ ] Estado "Oculto" completo con condiciones de entrada/salida
- [ ] Mínimo 30 cartas de Misión Secundaria para el mazo
- [ ] Mazo de Reliquias (15–20 cartas)
- [ ] Estados extendidos: Aterrado, Enceguecido, Silenciado, Inmovilizado
- [ ] HAZAÑA para cada Líder del juego
- [ ] Boost (relanzar dado gastando PE) — agregar al manual
- [ ] Categorías formales de unidades: Tropa, Solo, Construcción, Líder
- [ ] Escenarios específicos por par de facciones
- [ ] Reglas de campaña (progresión entre partidas)
- [ ] App/Web de armado de lista

---

*Última actualización: Abril 2026.*
*Próxima tarea: revisar con manuales de Warmachine, Hordes, Infinity y otros wargames de escaramuza.*
