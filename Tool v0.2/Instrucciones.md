# Especificación Técnica & Prompt de Desarrollo: La Era del Martillo V2

**Contexto:** Transformación de una aplicación web monolítica (V1) a una plataforma SaaS modular, escalable y responsive (V2) utilizando el stack moderno de Next.js.
**Rol Asignado:** Arquitecto de Software Senior & Desarrollador Fullstack Especialista en Next.js/React.
**Objetivo:** Entregar una aplicación funcional, modular y lista para Docker.

---

## 1. Stack Tecnológico (Estricto)

Debes utilizar las siguientes versiones o superiores, garantizando compatibilidad:

*   **Framework:** Next.js 14+ (App Router es obligatorio. No usar Pages Router).
*   **Lenguaje:** TypeScript 5+ (Configuración `strict: true` en `tsconfig.json`. No se permite el uso de `any`).
*   **Estilos:** Tailwind CSS 3.4+.
*   **Base de Datos:** PostgreSQL 15+.
*   **ORM:** Prisma (Para migraciones y queries tipo-safe).
*   **Autenticación:** Auth.js (NextAuth) v5 (beta) o v4 estable.
*   **Componentes UI:** `shadcn/ui` (basado en Radix UI y Tailwind) para consistencia.
*   **Gestión de Estado:** React Context API o Zustand para el estado global del constructor.
*   **Validación:** Zod para validación de esquemas de formularios y datos de entrada.
*   **Formularios:** React Hook Form.

---

## 2. Arquitectura y Código Limpio (Clean Code)

La aplicación debe ser extremadamente modular para facilitar el mantenimiento humano.

### Estructura de Carpetas Objetivo:

```text
/src
  /app
    /(auth)              # Grupo de rutas para Login / Register
    /(dashboard)         # Grupo de rutas privadas (Usuario logueado)
      /mis-listas        # Listas del usuario
      /comunidad         # Listas compartidas y Rankings
    /builder             # Constructor de unidades (El núcleo de la app)
      /page.tsx          # Layout principal del builder
    /admin               # Rutas protegidas (Middleware: Role === ADMIN)
      /unidades          # CRUD de Unidades Base
      /facciones         # Balanceo de juego
    /api                 # API Routes (o Server Actions) para lógica backend
    /layout.tsx          # Layout raíz (Header, Footer, ThemeProvider)
    /globals.css         # CSS Global y variables Tailwind

  /components
    /ui                  # Componentes atómicos (Button, Input, Card...)
    /builder             # Lógica visual del juego (UnitCard, StatRow, FactionTag)
    /layout              (Navbar, Sidebar, MobileMenu)
    /shared              (Toasts, Modales, LoadingSpinners)

  /lib
    db.ts                # Cliente Singleton de Prisma
    auth.ts              # Configuración de Auth.js
    utils.ts             # Funciones puras matemáticas (Cálculo de Costos)
    validaciones.ts      # Esquemas Zod

  /types
    index.d.ts           # Interfaces globales (Unit, List, User, etc.)

  prisma
    schema.prisma        # Definición de base de datos
```

### Principios de Código:
1.  **Separación de Concerns:** Los componentes en `/components` solo deben manejar renderizado. La lógica de negocio (cálculos de costos) debe vivir en `/lib/utils.ts` o Server Actions.
2.  **TypeScript Estricto:** Todas las props y funciones deben tener tipos explícitos.
3.  **Componentes Reutilizables:** Si ves código repetido (ej. un botón de editar), extraelo a `components/ui/button.tsx`.

---

## 3. Lógica del Negocio (Game Mechanics - Port de V1)

La IA debe implementar exactamente esta lógica matemática extraída de la V1.

### Atributos y Rangos
*   **Acción/Energía/Mov:** 1 a 3 (Representados visualmente como PV dots).
*   **Combate/Defensa/Utilidad:** 1 a 6 (Representados como +N).
*   **Facciones (Modificadores):**
    *   **Táin (🌿):** Resistencia Física (+2), Movimiento (+2).
    *   **Déin (💀):** Melee (+3), Robar (+2), Acción (+1).
    *   **Bisk (🌀):** Rango (+3), Energía (+3), Acción (+2).
    *   **Evol (⚡):** Magia (+3), Acción (+3), Res. Mágica (+3).
*   **Multiplicadores de Costo:** A mayor afinidad (0-3), menor el costo del stat.
    *   Afinidad 0: 100% costo.
    *   Afinidad 1: 85% costo.
    *   Afinidad 2: 70% costo.
    *   Afinidad 3: 55% costo.

### Cálculos
1.  **Costo Base (Raw Cost):** Se busca en una tabla de costos predefinida por nivel.
2.  **Costo Efectivo (Eff Cost):** `Raw Cost * MultiplicadorDeFaccion`.
3.  **Costo Total Build:** Suma de todos los `Eff Cost` + Costo de Gema (si aplica).
4.  **Costo Ejército (Army Pts):** `Math.floor(Costo Total Build / 23)`.

---

## 4. Diseño de Base de Datos (Prisma Schema)

Debe implementar una relación MxN y soportar balanceo dinámico.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  password      String   // Hasheado con bcrypt
  role          Role     @default(USER)
  lists         List[]
  matchesAsWinner Match[] @relation("WinnerMatches")
  matchesAsLoser  Match[] @relation("LoserMatches")
  createdAt     DateTime @default(now())
}

model List {
  id          String   @id @default(cuid())
  name        String
  totalPoints Int
  isPublic    Boolean  @default(false)
  description String?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  // Relación MxN implícita
  units       ListUnit[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Entidad configurada por el ADMIN (Base de datos del juego)
model UnitBase {
  id          String   @id @default(cuid())
  name        String
  faction     String   // 'tain', 'dein', 'bisk', 'evol'
  baseStats   Json     // { pa:1, pe:1, melee:1, ... }
  defaultCost Int
  description String?
  
  listUnits   ListUnit[]

  @@index([faction])
}

// Tabla Pivot con datos específicos de la instancia
model ListUnit {
  id          String   @id @default(cuid())
  listId      String
  list        List     @relation(fields: [listId], references: [id], onDelete: Cascade)
  
  unitBaseId  String
  unitBase    UnitBase @relation(fields: [unitBaseId], references: [id])
  
  // El usuario puede modificar stats dentro de su lista
  customStats Json     
  position    Int?     // Para ordenar visualmente

  @@unique([listId, unitBaseId])
  @@index([listId])
}

model Match {
  id          String   @id @default(cuid())
  winnerListId String
  loserListId  String
  
  winnerList  List     @relation("WinnerMatches", fields: [winnerListId], references: [id])
  loserList   List     @relation("LoserMatches", fields: [loserListId], references: [id])
  
  playedAt    DateTime @default(now())
}
```

---

## 5. UI/UX: Responsividad y Temas (Web / Android / iOS)

### Sistema de Temas (Dark / Light)
*   Utilizar `next-themes`.
*   **Dark Mode (Default para Gaming):** Fondo `#0f0f0f`, Texto `#ddd8cc`, Acentos Dorados `#D4AF37`.
*   **Light Mode:** Fondo `#f3f4f6`, Texto `#1f2937`, Acentos Oscuros.
*   El toggle de tema debe estar accesible siempre (Header).

### Responsividad (Mobile First)
*   **Meta Viewport:** Configurar para escalar correctamente en móviles.
*   **Touch Targets:** Botones y selects deben tener al menos `44px` de altura para facilitar el toque en iOS/Android.
*   **Inputs Numéricos:** En el constructor de stats, usar `type="number"` o selectores custom para evitar el teclado nativo si no es necesario, o manejar `inputMode="numeric"`.
*   **Layouts:**
    *   *Desktop:* Sidebar fijo o Grid de 3 columnas (Stats - Preview - Lista).
    *   *Mobile:* Pestañas inferiores o Acordeones para las secciones de stats para evitar scroll infinito.

---

## 6. Funcionalidades por Rol de Usuario

### Usuario (Jugador)
1.  **Auth:** Registro y Login.
2.  **Constructor (Builder):**
    *   Crear nueva lista.
    *   Seleccionar facción.
    *   Agregar Unidades Base desde la BD.
    *   Editar stats de esa unidad específica (Override).
    *   Cálculo en tiempo real de puntos (Client Side validation + Server save).
3.  **Gestión:**
    *   Guardar lista (Persistencia en BD).
    *   Marcar lista como "Pública" (Compartible).
    *   Descargar JSON de la lista (Botón de exportación pura).
4.  **Social:**
    *   Ver "Rankings" (Top jugadores por victorias).
    *   Ver "Listas Compartidas" (Galería con paginación).

### Admin (Desarrollador / Balanceador)
1.  **Panel de Configuración:**
    *   CRUD completo de `UnitBase` (Crear nuevas unidades, editar costos, stats por defecto).
    *   Ajustar los multiplicadores globales de costos (si se guardan en config).
    *   Gestionar Usuarios (Banear, cambiar roles).

---

## 7. Docker y Despliegue

El proyecto debe incluir los archivos necesarios para ejecutarse en un contenedor Docker.

### Archivos Requeridos:
1.  `Dockerfile`: Multi-stage build (Alpine o Slim) para optimizar el tamaño de la imagen.
2.  `docker-compose.yml`:
    *   Servicio `web`: Build del contexto actual. Puertos `3000:3000`. Dependencia de `db`. Variables de entorno para conexión a BD.
    *   Servicio `db`: Imagen oficial de PostgreSQL. Volumen para datos persistente.

### Accesibilidad de Red
La configuración debe permitir que exponiendo el puerto 3000, la aplicación sea accesible desde:
1.  `http://localhost:3000` (Local).
2.  `http://[IP-DE-LA-MAQUINA]:3000` (Red local / Móvil en la misma Wi-Fi).

---

## 8. Instrucciones para el Agente de IA

Para ejecutar esta tarea de manera efectiva:

1.  **Análisis Inicial:** Lee cuidadosamente la sección "Lógica del Negocio". Entiende las matemáticas antes de escribir código.
2.  **Configuración Inicial:** Comienza por crear el proyecto Next.js (App Router), instalar Prisma, definir el `schema.prisma` y hacer la primera migración.
3.  **Desarrollo Modular:** No generes todo el código en un solo bloque.
    *   Paso 1: Configurar Auth y Base de Datos.
    *   Paso 2: Crear modelos de Datos y componentes UI base.
    *   Paso 3: Desarrollar el Constructor (Builder) y la lógica de cálculo.
    *   Paso 4: Desarrollar el Panel de Admin.
    *   Paso 5: Estilos finales, Dark Mode y Docker.
4.  **Validación Constante:** Asegúrate de que TypeScript no arroje errores. Si usas un tipo `any`, explica por qué es necesario (idealmente nunca lo es).
5.  **Comentarios:** Usa comentarios en el código para explicar traducciones complejas de la V1 a la V2.

**Meta:** El código resultante debe ser un ejemplo de "Clean Architecture" en Next.js, listo para ser presentado en una facultad y usado por jugadores reales.