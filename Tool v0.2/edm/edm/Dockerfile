# ============================================================
# Dockerfile — La Era del Martillo V2
# Multi-stage build (Alpine) para imagen mínima
# ============================================================

# ---- Etapa 1: Dependencias ----
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

# ---- Etapa 2: Build ----
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY . .

# Variables necesarias en build time
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- Etapa 3: Runner ----
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios para producción
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# next/standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar node_modules para Prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

# Exponer en 0.0.0.0 para ser accesible desde la red local
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Al iniciar: migrar y luego arrancar
CMD ["node", "server.js"]
