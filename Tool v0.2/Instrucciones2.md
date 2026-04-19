# Prompt: Especificación Completa - La Era del Martillo V2 (Next.js Fullstack)

**Rol:** Arquitecto de Software Senior, Experto en Game Balance y Diseño UI/UX.
**Contexto:** Desarrollo de una herramienta web (V2) para un wargame de miniaturas, reemplazando un sistema monolítico (V1) por una arquitectura modular escalable.

---

## 1. Stack Tecnológico y Arquitectura

*   **Framework:** Next.js 14+ (App Router).
*   **Lenguaje:** TypeScript (Strict).
*   **BD:** PostgreSQL + Prisma.
*   **Auth:** NextAuth.js.
*   **UI:** Tailwind CSS + shadcn/ui.
*   **Docker:** Contenedor para despliegue local/red.

---

## 2. Sistema de Economía y Puntos (Game Balance)

### Presupuestos
1.  **Presupuesto de Desarrollador (Internal BP):** El Admin balancea unidades usando una escala de **0 a 100 BP**.
2.  **Presupuesto de Jugador (Army Pts):** El usuario arma listas con un total de **60 Puntos**.
3.  **Costo por Unidad:** Cada unidad cuesta al usuario entre **5 y 15 Puntos**.

### Lógica de Conversión
*   **Unidad Base (Facción):** Aplica una "Ficha Básica" (Costo 0 BP en términos de configuración) que otorga identidad de facción (ej. Táin tiene Defensa 3).
*   **Cálculo de Costo:**
    *   `Total BP = Sum(Stats con Coeficientes) + Sum(Costos de Habilidades/Items)`.
    *   **Fórmula de Lista:** Convertir `Total BP` (0-100) a `Costo Usuario` (5-15).
    *   *Propuesta:* Usar una fórmula lineal o por escalones (analizar cuál es mejor para balanceo).

### Coeficientes de Facción (Costos de Atributos)
Cada facción tiene un "Peso" para cada stat (1=Caro, 2=Normal, 3=Barato).
*   Debe ser editable en el Admin Panel mediante botones de selección claros [CARO / NORMAL / BARATO].
*   El sistema debe guardar estas configuraciones por "Saga" o versión (Versionado).

---

## 3. Esquema de Base de Datos (Prisma)

El esquema debe soportar Unidades, Items, Misiones y Versionado.

```prisma
model GameVersion {
  id          String   @id @default(cuid())
  name        String   // "Saga 1", "V2.0"
  isActive    Boolean  @default(true)
  factions    FactionConfig[]
  units       Unit[]
  items       Item[]
  missions    Mission[]
}

model FactionConfig {
  id          String   @id @default(cuid())
  versionId   String
  factionName String   // 'tain', 'dein'...
  identityStats Json   // Stats base gratis de la facción
  costCoeffs Json      // Coeficientes { str: 1, def: 2 ... }
  @@unique([versionId, factionName])
}

model Unit {
  id          String   @id @default(cuid())
  versionId   String
  name        String
  baseStats   Json     // Punto 0 (Mínimos)
  customMods  Json     // Mejoras del Admin
  abilities   Json     // Habilidades pasivas/activas adjuntas
  calculatedBP Int     // Total 0-100
}

model Item {
  id          String   @id @default(cuid())
  versionId   String
  name        String
  type        String   // Arma, Pasiva, Objeto
  costBP      Int      // Costo interno
  description String
}

model Mission {
  id          String   @id @default(cuid())
  versionId   String
  name        String
  type        MissionType // PRINCIPAL, SECUNDARIA
  victoryPoints Int   // Puntos de victoria por completarla
  description String   // Texto del objetivo
  rules       String?  // Reglas especiales
  flavorText  String?  // Texto de historia
}

enum MissionType {
  PRINCIPAL
  SECUNDARIA
}
```

---

## 4. Editor de Misiones (Admin Panel)

El Admin debe poder crear y gestionar misiones para las partidas.

### Funcionalidades
1.  **CRUD de Misiones:** Crear, Editar, Eliminar misiones.
2.  **Campos a Editar:**
    *   Nombre de la Misión.
    *   Tipo: (Principal / Secundaria).
    *   Puntos de Victoria (VP): Número entero.
    *   Descripción: Texto principal del objetivo (puede ser largo).
    *   Reglas Especiales: Restricciones o aclaraciones.
    *   Flavor Text: Historia o ambiente.
3.  **Asignación:** Las misiones se pueden asignar a partidas o imprimir como cartas de robo para usar en mesa.

---

## 5. Sistema de Impresión (Módulo Completo)

El usuario debe elegir cómo imprimir su ejército y las misiones.

### Modos de Impresión para Unidades

1.  **Modo Integrado (Full Sheet):**
    *   Imprime la unidad completa (Stats Base + Items Equipados) en una **Tarjeta Grande** (estilo NewRecruit/Warhammer).
    *   Doble Cara: Frente (Stats) / Reverso (Reglas y Keywords).
2.  **Modulo Modular (Base + Cartas):**
    *   Imprime **Ficha Base** (Solo stats de facción, sin items).
    *   Imprime **Cartas de Items** (Tamaño Magic estándar: 63x88mm) para cada item comprado.
    *   El jugador pone las cartas encima de la ficha en la mesa.

### Impresión de Misiones (Obligatorio)

*   **Formato:** **Tarjeta Grande Magic (Oversized)**.
    *   *Tamaño:* Aprox. 89mm x 119mm (Estilo Commander/Planoswalker) para asegurar legibilidad del texto de objetivos.
*   **Layout de la Carta de Misión:**
    *   **Header:** Nombre de la Misión (Grande) + Tipo (Ícono/Texto Principal/Secundaria) + VP (Destacado).
    *   **Body (Centro):** Descripción de la misión (Objetivo). Texto legible (min 11pt).
    *   **Footer (Inferior):** Reglas Especiales y/o Flavor Text.

### Grid de Impresión
El sistema CSS Print debe manejar:
*   **Grid Fichas Grandes:** 2x2 por hoja A4 (Unidades/Misiones).
*   **Grid Cartas Pequeñas:** 4x4 o 5x4 por hoja A4 (Items).

---

## 6. Interfaz de Usuario y Responsividad

*   **Temas:** Modo Oscuro y Modo Claro.
*   **Mobile First:** La app debe funcionar perfectamente en Android/iOS (Touch targets de 44px).
*   **Admin Panel:** Vistas claras para editar Unidades, Facciones, Costos y Misiones.

---

## 7. Tu Misión (Entregables)

1.  **Análisis de Escala:** ¿Es 100 BP la mejor escala o 120? Justifica.
2.  **Esquema Prisma:** El código completo del schema incluyendo `Mission` y el manejo de versiones.
3.  **Componentes React:**
    *   `MissionEditor.tsx`: Formulario para crear misiones.
    *   `PrintManager.tsx`: Lógica para seleccionar modos de impresión (Integrado/Modular/Misiones).
    *   `BigCard.tsx`: Componente genérico para renderizar tanto Unidades como Misiones en formato grande.
4.  **CSS Print:** Estilos para imprimir Misiones en formato "Big Magic" y Unidades en "Data Sheet" o "Modular".
5.  **Lógica de Costos:** Algoritmo para calcular los BP de una unidad sumando Stats (con coeficientes) + Items.

**Prioridad:** Claridad del código, modularidad y que el sistema de impresión sea robusto y fácil de usar para un jugador en físico.