// ============================================================
// src/lib/utils.ts
// Lógica pura del juego — PORT EXACTO de V1 (generador-unidades.html)
// REGLA: Esta es la única fuente de verdad para cálculos de costos.
//        Los componentes React NUNCA deben calcular costos directamente.
// ============================================================

// ============================================================
// TIPOS
// ============================================================

export type FactionKey = "tain" | "dein" | "bisk" | "evol";

export type StatId =
  | "pa"
  | "pe"
  | "mov"
  | "melee"
  | "range"
  | "reflejos"
  | "bloqueo"
  | "resfis"
  | "resmag"
  | "focus"
  | "robar"
  | "spells"
  | "bag";

export type WeaponType = "1m1m" | "2m" | "1mesc" | "1mart" | "1mgema";

export interface StatDef {
  id: StatId | string;
  name: string;
  min: number;
  max: number;
  group: "acciones" | "combate" | "defensas" | "utilidad" | "inv" | "hp";
  pvDots?: boolean; // Mostrar como puntos verdes (PA, PE, MOV)
  cPt?: number;     // Costo lineal por punto (HP, Slots)
  base?: number;    // Valor base por defecto
}

export interface HpSlot {
  slotId: string;
  label: string;
  min: number;
  max: number;
  cPt: number;
  base: number;
}

export interface UnitStats {
  pa: number;
  pe: number;
  mov: number;
  melee: number;
  range: number;
  reflejos: number;
  bloqueo: number;
  resfis: number;
  resmag: number;
  focus: number;
  robar: number;
  spells: number;
  bag: number;
  [key: string]: number; // HP dinámico (hp_cab, hp_bra, etc.)
}

export interface FactionMods {
  [factionKey: string]: {
    [statId: string]: number; // 0–3 (afinidad)
  };
}

export interface CostConfig {
  [statId: string]: number[]; // Tabla de costos indexada por nivel
}

export interface GameConfig {
  maxBP: number;      // Presupuesto heroico máximo (default: 300)
  bpPerPt: number;    // BP por punto de ejército (default: 23)
  maxArmyPts: number; // Puntos máximos de ejército (default: 60)
}

export interface CostBreakdown {
  [statId: string]: number;
}

export interface CalcResult {
  total: number;
  breakdown: CostBreakdown;
}

// ============================================================
// CONSTANTES (portadas directamente de V1)
// ============================================================

export const STATS_BASE: StatDef[] = [
  { id: "pa",       name: "P. Acción",   min: 1, max: 3, group: "acciones",  pvDots: true },
  { id: "pe",       name: "P. Energía",  min: 1, max: 3, group: "acciones",  pvDots: true },
  { id: "mov",      name: "Movimiento",  min: 1, max: 3, group: "combate",   pvDots: true },
  { id: "melee",    name: "Melee ATK",   min: 1, max: 6, group: "combate" },
  { id: "range",    name: "Range ATK",   min: 1, max: 6, group: "combate" },
  { id: "reflejos", name: "Reflejos",    min: 1, max: 6, group: "defensas" },
  { id: "bloqueo",  name: "Bloqueo",     min: 1, max: 6, group: "defensas" },
  { id: "resfis",   name: "Res. Física", min: 1, max: 6, group: "defensas" },
  { id: "resmag",   name: "Res. Mágica", min: 1, max: 6, group: "defensas" },
  { id: "focus",    name: "Focus",       min: 1, max: 6, group: "utilidad" },
  { id: "robar",    name: "Robar",       min: 1, max: 6, group: "utilidad" },
  { id: "spells",   name: "Slots Spells", min: 0, max: 6, group: "inv", cPt: 7, base: 0 },
  { id: "bag",      name: "Slots Bag",    min: 0, max: 6, group: "inv", cPt: 3, base: 0 },
];

export const DEFAULT_HP_CONFIG: HpSlot[] = [
  { slotId: "cab", label: "Cabeza",  min: 1, max: 10, cPt: 2, base: 1 },
  { slotId: "bra", label: "Brazos",  min: 1, max: 10, cPt: 2, base: 1 },
  { slotId: "pie", label: "Piernas", min: 1, max: 10, cPt: 2, base: 1 },
  { slotId: "cue", label: "Cuerpo",  min: 5, max: 30, cPt: 1, base: 5 },
];

// Tabla de costos base por nivel (portada de V1)
export const DEFAULT_COSTS: CostConfig = {
  pa:       [0, 8, 20, 40,  0,  0,  0],
  pe:       [0, 5, 15, 30,  0,  0,  0],
  mov:      [0, 4, 10, 20,  0,  0,  0],
  melee:    [0, 4,  8, 13, 19, 27, 37],
  range:    [0, 4,  8, 13, 19, 27, 37],
  reflejos: [0, 4,  8, 13, 19, 27, 37],
  bloqueo:  [0, 3,  7, 12, 18, 25, 34],
  resfis:   [0, 3,  7, 12, 18, 25, 34],
  resmag:   [0, 3,  7, 12, 18, 25, 34],
  focus:    [0, 4,  8, 13, 19, 27, 37],
  robar:    [0, 3,  6, 10, 15, 21, 28],
};

// Valores estándar de referencia por facción (balance)
export const DEFAULT_FACTION_STD: Record<FactionKey, Record<string, number>> = {
  tain: { pa:2, pe:2, mov:3, melee:2, range:2, reflejos:3, bloqueo:2, resfis:3, resmag:1, focus:2, robar:1 },
  dein: { pa:2, pe:3, mov:1, melee:4, range:1, reflejos:2, bloqueo:1, resfis:1, resmag:2, focus:3, robar:3 },
  bisk: { pa:3, pe:4, mov:2, melee:1, range:4, reflejos:3, bloqueo:1, resfis:1, resmag:2, focus:4, robar:1 },
  evol: { pa:3, pe:2, mov:1, melee:3, range:3, reflejos:2, bloqueo:2, resfis:2, resmag:4, focus:1, robar:1 },
};

// Modificadores de afinidad por defecto (V1: DEFAULT_FMODS)
export const DEFAULT_FACTION_MODS: FactionMods = {
  tain: { pa:0, pe:1, mov:2, melee:1, range:0, reflejos:2, bloqueo:1, focus:1, robar:0, resfis:2, resmag:0 },
  dein: { pa:1, pe:2, mov:0, melee:3, range:0, reflejos:0, bloqueo:0, focus:2, robar:2, resfis:0, resmag:1 },
  bisk: { pa:2, pe:3, mov:1, melee:0, range:3, reflejos:2, bloqueo:0, focus:3, robar:0, resfis:0, resmag:1 },
  evol: { pa:3, pe:2, mov:0, melee:2, range:2, reflejos:1, bloqueo:1, focus:0, robar:0, resfis:1, resmag:3 },
};

// Multiplicadores de costo según afinidad (0–3)
const AFFINITY_MULT: Record<string, number> = {
  "0": 1.00,
  "1": 0.85,
  "2": 0.70,
  "3": 0.55,
};

export const DEFAULT_GAME_CONFIG: GameConfig = {
  maxBP: 300,
  bpPerPt: 23,
  maxArmyPts: 60,
};

// Labels de movimiento en cm
export const MOV_LABELS = ["5cm", "10cm", "15cm"] as const;

// Labels de tipos de arma
export const WEAPON_LABELS: Record<WeaponType, string> = {
  "1m1m":   "1 Mano + 1 Mano",
  "2m":     "2 Manos",
  "1mesc":  "1 Mano + Escudo",
  "1mart":  "1 Mano + Artefacto",
  "1mgema": "1 Mano + Gema",
};

export const DEFAULT_STATS: UnitStats = {
  pa: 1, pe: 1, mov: 1,
  melee: 1, range: 1,
  reflejos: 1, bloqueo: 1, resfis: 1, resmag: 1,
  focus: 1, robar: 1,
  spells: 0, bag: 0,
};

export const DEFAULT_HP_VALS: Record<string, number> = {
  hp_cab: 3, hp_bra: 3, hp_pie: 3, hp_cue: 8,
};

// ============================================================
// FUNCIONES DE CÁLCULO (PORT exacto de V1)
// ============================================================

/**
 * Costo base (raw) de un stat en un nivel dado.
 * Para HP y Slots: costo lineal (cPt × delta sobre base).
 * Para el resto: lookup en tabla de costos.
 */
export function rawCost(
  def: StatDef | HpSlot,
  val: number,
  costConfig: CostConfig = DEFAULT_COSTS
): number {
  // HP y Slots tienen costo lineal
  if ("cPt" in def && def.cPt !== undefined) {
    return (val - (def.base ?? 0)) * def.cPt;
  }

  // Stats normales: lookup en tabla
  if ("id" in def) {
    const arr = costConfig[def.id];
    if (arr) return arr[val] ?? 0;
  }

  return 0;
}

/**
 * Costo efectivo de un stat considerando el modificador de facción.
 * HP y Slots NO se modifican por facción.
 */
export function effCost(
  def: StatDef,
  val: number,
  faction: FactionKey,
  factionMods: FactionMods = DEFAULT_FACTION_MODS,
  costConfig: CostConfig = DEFAULT_COSTS
): number {
  // HP y Slots: sin multiplicador de facción
  if (def.group === "hp" || def.group === "inv") {
    return rawCost(def, val, costConfig);
  }

  const mod = (factionMods[faction] ?? {})[def.id] ?? 0;
  const mult = AFFINITY_MULT[String(mod)] ?? 1.0;
  return Math.round(rawCost(def, val, costConfig) * mult);
}

/**
 * Calcula el costo total de build (BP) de una unidad.
 * Incluye todos los stats, HP dinámico, slots y gema.
 */
export function calcBuildCost(params: {
  stats: UnitStats;
  faction: FactionKey;
  puedeGema: boolean;
  hpConfig?: HpSlot[];
  factionMods?: FactionMods;
  costConfig?: CostConfig;
}): CalcResult {
  const {
    stats,
    faction,
    puedeGema,
    hpConfig = DEFAULT_HP_CONFIG,
    factionMods = DEFAULT_FACTION_MODS,
    costConfig = DEFAULT_COSTS,
  } = params;

  let total = 0;
  const breakdown: CostBreakdown = {};

  // Stats base (no HP)
  for (const def of STATS_BASE) {
    const val = stats[def.id] ?? def.base ?? 0;
    const cost = effCost(def, val, faction, factionMods, costConfig);
    total += cost;
    breakdown[def.id] = cost;
  }

  // HP dinámico por localización
  for (const slot of hpConfig) {
    const hpDef: StatDef = {
      id: `hp_${slot.slotId}` as StatId,
      name: slot.label,
      min: slot.min,
      max: slot.max,
      group: "hp",
      cPt: slot.cPt,
      base: slot.base,
    };
    const val = stats[`hp_${slot.slotId}`] ?? slot.base;
    const cost = rawCost(hpDef, val, costConfig);
    total += cost;
    breakdown[`hp_${slot.slotId}`] = cost;
  }

  // Gema
  if (puedeGema) {
    total += 25;
    breakdown["gema"] = 25;
  } else {
    breakdown["gema"] = 0;
  }

  return { total, breakdown };
}

/**
 * Convierte BP totales a puntos de ejército.
 * Fórmula: Math.max(1, Math.round(bp / bpPerPt))
 */
export function toArmyPts(
  bp: number,
  gameConfig: GameConfig = DEFAULT_GAME_CONFIG
): number {
  return Math.max(1, Math.round(bp / gameConfig.bpPerPt));
}

/**
 * Verifica si hay conflicto de arma + gema.
 * Retorna true si hay advertencia activa.
 */
export function hasGemaWeaponConflict(params: {
  puedeGema: boolean;
  gemaEnMano: boolean;
  weapon: WeaponType;
}): boolean {
  const { puedeGema, gemaEnMano, weapon } = params;
  if (!puedeGema) return false;
  // Si el arma seleccionada es "1M+Gema", la gema está en mano por definición
  if (weapon === "1mgema") return false;
  return gemaEnMano && weapon === "2m";
}

/**
 * Obtiene el valor de display de un stat.
 * PA/PE/MOV: dots de PV. Resto: +N.
 */
export function displayStatValue(def: StatDef, val: number): string {
  if (def.pvDots) {
    if (def.id === "mov") return MOV_LABELS[val - 1] ?? `${val}`;
    return "●".repeat(val) + "○".repeat(def.max - val);
  }
  if (def.group === "inv") return String(val);
  return `+${val}`;
}

/**
 * Obtiene el modificador de afinidad de un stat en una facción.
 */
export function getAffinity(
  faction: FactionKey,
  statId: string,
  factionMods: FactionMods = DEFAULT_FACTION_MODS
): number {
  return (factionMods[faction] ?? {})[statId] ?? 0;
}

/**
 * Calcula el total de BP estándar de una facción (para la tabla de balance).
 */
export function calcFactionStandardBP(
  faction: FactionKey,
  factionStd: Record<FactionKey, Record<string, number>> = DEFAULT_FACTION_STD,
  factionMods: FactionMods = DEFAULT_FACTION_MODS,
  costConfig: CostConfig = DEFAULT_COSTS
): number {
  const stdStats = factionStd[faction] ?? {};
  return Object.entries(stdStats).reduce((acc, [statId, val]) => {
    const def = STATS_BASE.find((d) => d.id === statId);
    if (!def) return acc;
    return acc + effCost(def, val, faction, factionMods, costConfig);
  }, 0);
}

// ============================================================
// UTILS GENERALES
// ============================================================

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function clampStat(def: StatDef | HpSlot, val: number): number {
  return Math.min(def.max, Math.max(def.min, val));
}

/**
 * Calcula el color de la barra de presupuesto según el porcentaje.
 */
export function getBudgetBarColor(pct: number): string {
  if (pct <= 60) return "#4ade80";  // verde
  if (pct <= 100) return "#D4AF37"; // dorado
  return "#ef4444";                  // rojo (sobre presupuesto)
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
