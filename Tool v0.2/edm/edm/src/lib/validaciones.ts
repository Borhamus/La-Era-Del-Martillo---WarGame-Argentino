// src/lib/validaciones.ts
// Schemas Zod para validación de formularios y datos de entrada

import { z } from "zod";

// ============================================================
// AUTH
// ============================================================

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Email inválido"),
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    username: z
      .string()
      .min(3, "El username debe tener al menos 3 caracteres")
      .max(20)
      .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guion bajo"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// ============================================================
// UNIDADES
// ============================================================

export const unitBaseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  faction: z.enum(["tain", "dein", "bisk", "evol"]),
  description: z.string().max(500).optional(),
  baseStats: z.record(z.string(), z.number().int().min(0).max(30)),
  hpConfig: z.array(
    z.object({
      slotId: z.string(),
      label: z.string(),
      min: z.number().int().min(0),
      max: z.number().int().min(1),
      cPt: z.number().int().min(1),
      base: z.number().int().min(0),
    })
  ),
  defaultWeapon: z.enum(["1m1m", "2m", "1mesc", "1mart", "1mgema"]),
  canEquipGem: z.boolean().default(false),
  versionId: z.string().min(1),
});

// ============================================================
// LISTAS
// ============================================================

export const listSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  description: z.string().max(300).optional(),
  isPublic: z.boolean().default(false),
  faction: z.enum(["tain", "dein", "bisk", "evol"]).optional().nullable(),
});

// ============================================================
// ITEMS
// ============================================================

export const itemSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  type: z.enum([
    "raza",
    "pasiva",
    "habilidad",
    "spell",
    "consumible",
    "equipo",
    "arma",
    "artefacto",
  ]),
  description: z.string().max(500).optional(),
  costPts: z.number().int().min(0).max(100),
  factions: z.array(z.enum(["tain", "dein", "bisk", "evol"])).default([]),
  raceId: z.string().optional().nullable(),
  versionId: z.string().min(1),
});

// ============================================================
// MISIONES
// ============================================================

export const missionSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  type: z.enum(["PRINCIPAL", "SECUNDARIA"]),
  victoryPoints: z.number().int().min(0).max(99),
  description: z.string().min(1, "La descripción es requerida").max(1000),
  rules: z.string().max(500).optional(),
  flavorText: z.string().max(300).optional(),
  versionId: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UnitBaseInput = z.infer<typeof unitBaseSchema>;
export type ListInput = z.infer<typeof listSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export type MissionInput = z.infer<typeof missionSchema>;
