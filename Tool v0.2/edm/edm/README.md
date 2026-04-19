# ⚔ La Era del Martillo — V2

Plataforma SaaS fullstack para construir y gestionar ejércitos del wargame de miniaturas **La Era del Martillo**.
Construida con Next.js 14 (App Router), TypeScript estricto, PostgreSQL y desplegable en Docker.

---

## Roadmap de Versiones

| Versión | Estado | Descripción |
|---------|--------|-------------|
| **V1** | ✅ Completa | HTML monolítico — generador de unidades offline |
| **V2** | 🚧 En desarrollo | Plataforma SaaS fullstack con auth, BD, listas públicas y sistema de impresión |
| **V3** | 📋 Planificada | Motor de juego online 2D — partidas en tiempo real, replay de batallas |

---

## Stack Tecnológico

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript 5+ (`strict: true`)
- **Estilos:** Tailwind CSS 3.4+ + shadcn/ui
- **Base de datos:** PostgreSQL 15+
- **ORM:** Prisma
- **Auth:** NextAuth.js v4
- **Estado global:** Zustand
- **Validación:** Zod + React Hook Form
- **Temas:** next-themes
- **Deploy:** Docker + docker-compose

---

## Requisitos previos

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para correr con docker-compose)
- O PostgreSQL 15+ instalado localmente (para desarrollo sin Docker)

---

## Instalación y Setup

### Opción A — Docker (recomendado, para compartir en red local)

1. **Clonar el repo**
```bash
git clone <repo-url>
cd era-del-martillo-v2
```

2. **Copiar variables de entorno**
```bash
cp .env.example .env
```
Editá `.env` y completá los valores (ver sección Variables de Entorno).

3. **Levantar la app completa**
```bash
docker-compose up --build
```

La app queda disponible en:
- `http://localhost:3000` — tu máquina
- `http://<TU-IP-LAN>:3000` — desde otros dispositivos en la misma red Wi-Fi

Para saber tu IP local:
```bash
# Linux/Mac
ip addr show | grep "inet " | grep -v 127
# Windows
ipconfig | findstr IPv4
```

4. **Correr migraciones** (primera vez)
```bash
docker-compose exec web npx prisma migrate deploy
```

5. **Crear admin inicial**
```bash
docker-compose exec web npx prisma db seed
```

---

### Opción B — Desarrollo local (sin Docker)

1. **Instalar dependencias**
```bash
npm install
```

2. **Copiar y configurar .env**
```bash
cp .env.example .env
# Editá DATABASE_URL con tu PostgreSQL local
```

3. **Migraciones**
```bash
npx prisma migrate dev --name init
```

4. **Seed inicial**
```bash
npx prisma db seed
```

5. **Correr en desarrollo**
```bash
npm run dev
```

---

## Variables de Entorno

Copiá `.env.example` como `.env` y completá:

```env
# Base de datos
DATABASE_URL="postgresql://postgres:password@localhost:5432/era_del_martillo"

# NextAuth — generá un secret seguro con: openssl rand -base64 32
NEXTAUTH_SECRET="tu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Seed (usuario admin inicial)
ADMIN_EMAIL="admin@eradelMartillo.com"
ADMIN_PASSWORD="cambiar-esto"
```

---

## Comandos útiles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build
npm start

# Prisma
npx prisma studio          # GUI para la BD
npx prisma migrate dev     # Nueva migración en desarrollo
npx prisma migrate deploy  # Aplicar migraciones en producción
npx prisma generate        # Regenerar cliente después de cambiar schema

# Linting
npm run lint
npm run typecheck

# Docker
docker-compose up --build          # Primera vez
docker-compose up -d               # Background
docker-compose down                # Apagar
docker-compose logs -f web         # Ver logs
docker-compose exec web sh         # Shell dentro del container
```

---

## Estructura del Proyecto

```
/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                  # Rutas públicas de auth
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/             # Rutas privadas (usuario logueado)
│   │   │   ├── mis-listas/page.tsx  # Gestión de listas del usuario
│   │   │   └── comunidad/page.tsx   # Listas públicas + rankings
│   │   ├── builder/                 # Constructor de unidades (núcleo)
│   │   │   └── page.tsx
│   │   ├── admin/                   # Panel de administración
│   │   │   ├── unidades/page.tsx    # CRUD de UnitBase
│   │   │   ├── facciones/page.tsx   # Editor de coeficientes
│   │   │   └── misiones/page.tsx    # CRUD de misiones
│   │   ├── api/                     # API Routes
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── units/
│   │   │   ├── lists/
│   │   │   └── missions/
│   │   ├── layout.tsx               # Layout raíz (Header, Footer, ThemeProvider)
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                      # Átomos base (shadcn/ui extendidos)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── builder/                 # Lógica visual del juego
│   │   │   ├── StatRow.tsx          # Fila de stat con − val + barra costo
│   │   │   ├── FactionSelector.tsx  # Selector de facciones con colores
│   │   │   ├── BudgetBar.tsx        # Barra de presupuesto heroico
│   │   │   ├── UnitCard.tsx         # Card de unidad en el roster
│   │   │   ├── CostBreakdown.tsx    # Desglose de costos en tiempo real
│   │   │   ├── GemaToggle.tsx       # Toggle gema + tipo de arma
│   │   │   └── WeaponSelector.tsx
│   │   ├── layout/                  # Estructura de la app
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── shared/                  # Componentes transversales
│   │   │   ├── Toast.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── print/                   # Módulo de impresión
│   │       ├── BigCard.tsx          # Tarjeta grande (unidades o misiones)
│   │       ├── MissionCard.tsx      # Tarjeta oversized de misión
│   │       └── PrintManager.tsx     # Selector de modo de impresión
│   │
│   ├── lib/
│   │   ├── db.ts                    # Prisma client singleton
│   │   ├── auth.ts                  # Config NextAuth
│   │   ├── utils.ts                 # Lógica de costos (PORT exacto de V1)
│   │   └── validaciones.ts          # Schemas Zod
│   │
│   └── types/
│       └── index.d.ts               # Interfaces globales
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                      # Seed inicial (admin + facciones base)
│
├── public/
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Lógica de Negocio (Game Mechanics)

Toda la lógica matemática del juego vive en `src/lib/utils.ts`.
**Nunca** debe estar embebida en componentes React.

### Conversión de costos
```
rawCost(stat, valor)     → costo base de la tabla predefinida
effCost(stat, val, fac)  → rawCost × multiplicadorFacción
calcBuildCost(unit)      → Σ effCost + 25 si tiene Gema
toArmyPts(bp)            → Math.max(1, Math.round(bp / bpPerPt))
```

### Multiplicadores de Afinidad por Facción
| Afinidad | Multiplicador |
|----------|---------------|
| 0 | 1.00 (100%) |
| 1 | 0.85 (85%) |
| 2 | 0.70 (70%) |
| 3 | 0.55 (55%) |

---

## Acceso por Roles

| Rol | Acceso |
|-----|--------|
| **USER** | Builder, mis listas, comunidad |
| **ADMIN** | Todo lo anterior + panel admin (CRUD de unidades, facciones, misiones, usuarios) |

El usuario admin inicial se crea con `npx prisma db seed`.

---

## Sistema de Impresión

El módulo de impresión (`/components/print`) soporta tres modos:

1. **Full Sheet** — Ficha grande con stats + items (doble cara)
2. **Modular** — Ficha base + cartas de items separadas (63×88mm, tamaño Magic)
3. **Misiones** — Tarjeta oversized (~89×119mm, estilo Commander)

Los estilos CSS `@media print` manejan los grids automáticamente:
- Fichas grandes: 2×2 por hoja A4
- Cartas de items: 4×4 por hoja A4

---

## V3 — Motor de Juego Online (Roadmap)

La V3 agrega un motor de juego 2D para testear ejércitos antes de imprimirlos.

### Funcionalidades planificadas
- **Salas de partida** — crear sala, invitar amigo por link o lista de amigos
- **Tablero 2D top-down** — mapa con grid hexagonal o cuadrado
- **Movimiento asistido** — al seleccionar unidad, muestra alcance de movimiento
- **Sistema de combate** — tirada de dados con resultados animados en pantalla
- **Log de batalla** — registro movimiento a movimiento con reproducción (adelante/atrás)
- **Historial** — guardado de hasta 3 batallas en servidor, descarga local para el resto
- **Lista de amigos** — agregar por username, ver estado online
- **Registro de partidas** — W/L con lista usada y fecha

### Dependencias adicionales para V3
- `socket.io` — comunicación en tiempo real
- `@react-three/fiber` o canvas 2D — renderizado del tablero
- Sistema de salas con Redis (para estado efímero de partidas)

### Consideraciones de arquitectura V2 → V3
La V2 ya deja el terreno preparado:
- El schema de BD incluye `Match` para registro de partidas
- Las `List` tienen `isPublic` y pueden referenciarse en partidas
- El sistema de `GameVersion` permite que las reglas sean versionadas sin romper partidas en curso

---

## Contribuir

1. Crear rama desde `main`
2. Respetar TypeScript strict (cero `any`)
3. Lógica de juego solo en `/lib/utils.ts`
4. Tests unitarios para funciones de costo
5. Comentar en español las traducciones no triviales de V1 → V2

---

## Licencia

Proyecto privado — La Era del Martillo © 2025
