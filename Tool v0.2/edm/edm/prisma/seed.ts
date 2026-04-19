// prisma/seed.ts
// Crea el admin inicial y la versión base del juego con las facciones.
// Ejecutar con: npx prisma db seed

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  DEFAULT_FACTION_MODS,
  DEFAULT_FACTION_STD,
  DEFAULT_GAME_CONFIG,
} from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // ---- Admin ----
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@eradelMartillo.com";
  const adminPass = process.env.ADMIN_PASSWORD ?? "cambiar-esto";
  const hashedPassword = await bcrypt.hash(adminPass, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Administrador",
      username: "admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin creado: ${admin.email}`);

  // ---- GameVersion inicial ----
  const version = await prisma.gameVersion.upsert({
    where: { id: "set-de-inicio" },
    update: {},
    create: {
      id: "set-de-inicio",
      name: "Set de Inicio",
      description: "Versión inicial del juego — Las cuatro facciones base.",
      isActive: true,
    },
  });
  console.log(`✅ GameVersion: ${version.name}`);

  // ---- Facciones ----
  const factions = [
    {
      key: "tain",
      name: "Semillas de Táin",
      icon: "🌿",
      colorPrimary: "#4CAF7D",
      identityStats: { pa: 2, pe: 2, mov: 3, resfis: 3 },
    },
    {
      key: "dein",
      name: "Esbirros de Déin",
      icon: "💀",
      colorPrimary: "#E05252",
      identityStats: { pa: 2, pe: 3, melee: 4, robar: 2 },
    },
    {
      key: "bisk",
      name: "Biskrorum",
      icon: "🌀",
      colorPrimary: "#A87FD6",
      identityStats: { pa: 3, pe: 4, range: 3, focus: 4 },
    },
    {
      key: "evol",
      name: "Evolgenia",
      icon: "⚡",
      colorPrimary: "#E8C84A",
      identityStats: { pa: 3, resmag: 4, focus: 3, melee: 2 },
    },
  ] as const;

  for (const fac of factions) {
    await prisma.factionConfig.upsert({
      where: {
        versionId_factionKey: {
          versionId: version.id,
          factionKey: fac.key,
        },
      },
      update: {},
      create: {
        versionId: version.id,
        factionKey: fac.key,
        factionName: fac.name,
        icon: fac.icon,
        colorPrimary: fac.colorPrimary,
        identityStats: fac.identityStats,
        factionMods: DEFAULT_FACTION_MODS[fac.key],
        standardStats: DEFAULT_FACTION_STD[fac.key],
      },
    });
    console.log(`  ✅ Facción: ${fac.icon} ${fac.name}`);
  }

  console.log("\n🎮 Seed completado exitosamente.");
  console.log(`   Admin: ${adminEmail}`);
  console.log(`   Version activa: ${version.name}`);
  console.log(`   GameConfig: ${JSON.stringify(DEFAULT_GAME_CONFIG)}`);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
