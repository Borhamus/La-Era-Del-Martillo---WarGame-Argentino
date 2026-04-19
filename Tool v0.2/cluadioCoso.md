

```
# Prompt Maestro: La Era del Martillo V2 — Plataforma SaaS Fullstack

**Rol:** Arquitecto de Software Senior, Experto en Game Balance y Diseño UI/UX.
**Contexto:** Transformación de una app web monolítica (V1) a una plataforma SaaS modular y escalable (V2) para un wargame de miniaturas. El resultado debe ser un ejemplo de Clean Architecture en Next.js, listo para Docker y uso real por jugadores.

---

## 1. Stack Tecnológico (Estricto)

- **Framework:** Next.js 14+ — App Router obligatorio. No usar Pages Router.
- **Lenguaje:** TypeScript 5+ — `strict: true` en `tsconfig.json`. Prohibido usar `any`.
- **Estilos:** Tailwind CSS 3.4+ + `shadcn/ui` (Radix UI) para consistencia.
- **Base de Datos:** PostgreSQL 15+ gestionado con Prisma (migraciones type-safe).
- **Auth:** Auth.js (NextAuth) v4 estable o v5 beta.
- **Estado Global:** Zustand o React Context API (para el Builder).
- **Validación:** Zod + React Hook Form.
- **Temas:** `next-themes` (Dark Mode por defecto).
- **Deploy:** Docker (multi-stage build) + docker-compose.

---

## 2. Arquitectura de Carpetas

```text
/src
  /app
    /(auth)              # Login / Registro
    /(dashboard)
      /mis-listas        # Listas del usuario
      /comunidad         # Rankings y listas públicas
    /builder             # Constructor de unidades (núcleo de la app)
    /admin               # Rutas protegidas (Middleware: role === ADMIN)
      /unidades          # CRUD de UnitBase
      /facciones         # Edición de coeficientes de costo
      /misiones          # Editor de misiones
    /api                 # API Routes / Server Actions
    /layout.tsx
    /globals.css

  /components
    /ui                  # Átomos: Button, Input, Card...
    /builder             # UnitCard, StatRow, FactionTag
    /layout              # Navbar, Sidebar, MobileMenu
    /shared              # Toasts, Modales, LoadingSpinners
    /print               # BigCard, MissionCard, PrintManager

  /lib
    db.ts                # Cliente Singleton de Prisma
    auth.ts              # Config Auth.js
    utils.ts             # Lógica pura: cálculo de BP y costos
    validaciones.ts      # Esquemas Zod

  /types
    index.d.ts           # Interfaces globales: Unit, List, User, Mission...

  /prisma
    schema.prisma
```

---

## 3. Sistema de Economía y Puntos (Game Balance)

### Escalas
- **BP Interno (Admin):** 0–100 BP. El Admin balancea unidades en esta escala.
- **Puntos de Ejército (Jugador):** Total de lista = 60 pts. Cada unidad cuesta entre 5 y 15 pts.
- **Conversión:** `Costo Usuario = 5 + ((BP_Unidad / 100) * 10)` — fórmula lineal. Evaluar si conviene escalones.

### Cálculo de BP por Unidad
```
Total BP = Σ(Valor_Stat * Coeficiente_Facción) + Σ(CostoBP_Items)
```

### Coeficientes de Facción
Cada facción define un "peso" por stat: `1 = Caro | 2 = Normal | 3 = Barato`.
Estos coeficientes son editables en el Admin Panel con botones claros [CARO / NORMAL / BARATO].

### Facciones y Modificadores (Port de V1)
| Facción | Bonos de Identidad |
|---|---|
| Táin 🌿 | Resistencia Física +2, Movimiento +2 |
| Déin 💀 | Melee +3, Robar +2, Acción +1 |
| Bisk 🌀 | Rango +3, Energía +3, Acción +2 |
| Evol ⚡ | Magia +3, Acción +3, Res. Mágica +3 |

### Multiplicadores de Afinidad (V1 legacy, conservar para compatibilidad)
| Afinidad | Multiplicador |
|---|---|
| 0 | 100% del costo |
| 1 | 85% |
| 2 | 70% |
| 3 | 55% |

### Rangos de Atributos
- Acción / Energía / Movimiento: 1–3 (visualizar como dots/PV).
- Combate / Defensa / Utilidad: 1–6 (visualizar como +N).
- Costo de Ejército: `Math.floor(CostoTotal / 23)`.

---

## 4. Esquema de Base de Datos (Prisma Schema completo)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role { USER ADMIN }
enum MissionType { PRINCIPAL SECUNDARIA }

model User {
  id              String   @id @default(cuid())
  email           String   @unique
  name            String?
  password        String
  role            Role     @default(USER)
  lists           List[]
  matchesAsWinner Match[]  @relation("WinnerMatches")
  matchesAsLoser  Match[]  @relation("LoserMatches")
  createdAt       DateTime @default(now())
}

model GameVersion {
  id        String          @id @default(cuid())
  name      String          // "Saga 1", "V2.0"
  isActive  Boolean         @default(true)
  factions  FactionConfig[]
  units     Unit[]
  items     Item[]
  missions  Mission[]
}

model FactionConfig {
  id            String      @id @default(cuid())
  versionId     String
  version       GameVersion @relation(fields: [versionId], references: [id])
  factionName   String      // 'tain', 'dein', 'bisk', 'evol'
  identityStats Json        // Stats base gratuitos de la facción
  costCoeffs    Json        // { melee: 1, def: 2, mov: 3 ... }
  @@unique([versionId, factionName])
}

model Unit {
  id            String      @id @default(cuid())
  versionId     String
  version       GameVersion @relation(fields: [versionId], references: [id])
  name          String
  faction       String
  baseStats     Json        // Mínimos de la unidad
  customMods    Json        // Mejoras configuradas por el Admin
  abilities     Json        // Habilidades pasivas/activas
  calculatedBP  Int         // Total 0–100
  description   String?
  listUnits     ListUnit[]
  @@index([faction])
}

model Item {
  id          String      @id @default(cuid())
  versionId   String
  version     GameVersion @relation(fields: [versionId], references: [id])
  name        String
  type        String      // 'arma', 'pasiva', 'objeto'
  costBP      Int
  description String
}

model Mission {
  id             String      @id @default(cuid())
  versionId      String
  version        GameVersion @relation(fields: [versionId], references: [id])
  name           String
  type           MissionType
  victoryPoints  Int
  description    String
  rules          String?
  flavorText     String?
}

model List {
  id          String     @id @default(cuid())
  name        String
  totalPoints Int
  isPublic    Boolean    @default(false)
  description String?
  userId      String
  user        User       @relation(fields: [userId], references: [id])
  units       ListUnit[]
  wonMatches  Match[]    @relation("WinnerMatches")
  lostMatches Match[]    @relation("LoserMatches")
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model ListUnit {
  id          String   @id @default(cuid())
  listId      String
  list        List     @relation(fields: [listId], references: [id], onDelete: Cascade)
  unitId      String
  unit        Unit     @relation(fields: [unitId], references: [id])
  customStats Json
  position    Int?
  @@unique([listId, unitId])
  @@index([listId])
}

model Match {
  id           String   @id @default(cuid())
  winnerListId String
  loserListId  String
  winnerList   List     @relation("WinnerMatches", fields: [winnerListId], references: [id])
  loserList    List     @relation("LoserMatches", fields: [loserListId], references: [id])
  playedAt     DateTime @default(now())
}
```

---

## 5. Componentes Clave a Desarrollar

### `MissionEditor.tsx`
Formulario con React Hook Form + Zod para crear/editar misiones. Campos: nombre, tipo (radio PRINCIPAL/SECUNDARIA), VP (number), descripción (textarea), reglas especiales, flavor text.

### `PrintManager.tsx`
Selector de modo de impresión con dos flujos:
1. **Integrado (Full Sheet):** Ficha grande con stats + items. Doble cara.
2. **Modular:** Ficha base + cartas de items separadas (63×88mm, estilo Magic).
3. **Misiones:** Tarjeta grande oversized (89×119mm).

### `BigCard.tsx`
Componente genérico que renderiza tanto unidades como misiones en formato tarjeta grande. Props tipadas para discriminar el contenido.

### CSS Print (`@media print`)
```css
/* Fichas grandes: 2×2 por hoja A4 */
.grid-big-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8mm; }

/* Cartas de items: 4×4 por hoja A4 */
.grid-item-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; }

/* Tarjeta de misión oversized */
.mission-card { width: 89mm; height: 119mm; page-break-inside: avoid; }
```

---

## 6. UI/UX

### Temas
- **Dark (default):** Fondo `#0f0f0f`, Texto `#ddd8cc`, Acento dorado `#D4AF37`.
- **Light:** Fondo `#f3f4f6`, Texto `#1f2937`, Acentos oscuros.
- Toggle siempre visible en el Header.

### Responsividad (Mobile First)
- Touch targets mínimo `44px` de altura (iOS/Android).
- Inputs numéricos: `inputMode="numeric"` o selectores custom.
- Desktop: Grid de 3 columnas (Stats | Preview | Lista).
- Mobile: Tabs inferiores o acordeones para secciones del builder.

---

## 7. Funcionalidades por Rol

### Usuario (Jugador)
- Registro / Login.
- Builder: crear lista, elegir facción, agregar unidades, editar stats (override), cálculo en tiempo real.
- Guardar lista, marcarla como pública, exportar JSON.
- Ver rankings y listas compartidas (paginadas).

### Admin
- CRUD de Unidades, Facciones y coeficientes de costo.
- CRUD de Misiones (con Editor visual).
- Gestión de versiones de juego (Sagas).
- Gestión de usuarios (banear, cambiar roles).

---

## 8. Docker

### `Dockerfile` (multi-stage, Alpine)
Build optimizado. Exponer puerto 3000.

### `docker-compose.yml`
- Servicio `web`: build local, puerto `3000:3000`, depende de `db`.
- Servicio `db`: imagen oficial PostgreSQL, volumen persistente.
- La app debe ser accesible en `localhost:3000` y desde la red local (IP de la máquina).

---

## 9. Plan de Ejecución (Orden Estricto)

1. **Configuración base:** Next.js + TypeScript + Tailwind + shadcn/ui. Definir `schema.prisma` y correr primera migración.
2. **Auth + Roles:** Login, registro, middleware de protección de rutas por role.
3. **Componentes UI atómicos:** Sistema de diseño base reutilizable.
4. **Builder + Lógica de costos:** Constructor de listas con cálculo BP en tiempo real.
5. **Admin Panel:** CRUD de Unidades, Facciones y editor de Misiones.
6. **Sistema de Impresión:** `PrintManager`, `BigCard`, CSS `@media print`.
7. **Social:** Rankings, listado de ejércitos públicos.
8. **Estilos finales + Docker.**

**En cada paso:** validar que TypeScript no arroje errores. Si se usa una decisión de diseño no obvia, comentar el código explicando el razonamiento.
```

---

Lo consolidé eliminando las redundancias entre ambos archivos (el schema aparecía duplicado y parcialmente en conflicto), unifiqué el sistema de costos en una única fórmula coherente, y agregué el módulo de misiones e impresión como ciudadanos de primera clase dentro de la arquitectura. El plan de 8 pasos al final le da al agente un orden de ejecución sin ambigüedades.