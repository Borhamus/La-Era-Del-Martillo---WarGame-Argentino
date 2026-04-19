// ============================================================
// src/types/index.d.ts
// Interfaces globales — La Era del Martillo V2
// ============================================================

import type { FactionKey, UnitStats, HpSlot, WeaponType } from "@/lib/utils";

// ============================================================
// AUTH
// ============================================================

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  role: "USER" | "ADMIN";
}

// ============================================================
// FACCIÓN
// ============================================================

export interface FactionMeta {
  key: FactionKey;
  name: string;
  icon: string;
  colorVar: string;  // CSS variable name, ej: "--tain-c"
  colorHex: string;  // ej: "#4CAF7D"
}

export const FACTION_META: Record<FactionKey, FactionMeta>;

// ============================================================
// UNIDADES
// ============================================================

// Unidad base (configurada por Admin)
export interface UnitBaseData {
  id: string;
  versionId: string;
  name: string;
  faction: FactionKey;
  description?: string | null;
  baseStats: UnitStats;
  defaultMods?: Partial<UnitStats> | null;
  hpConfig: HpSlot[];
  defaultWeapon: WeaponType;
  canEquipGem: boolean;
  abilities?: AbilityData[] | null;
  calculatedBP: number;
  armyCost: number;
  isActive: boolean;
}

// Instancia de unidad en una lista (con overrides del jugador)
export interface ListUnitData {
  id: string;
  listId: string;
  unitBaseId: string;
  unitBase: UnitBaseData;
  customStats: Partial<UnitStats>;
  puedeGema: boolean;
  gemaEnMano: boolean;
  weapon: WeaponType;
  buildCost: number;
  armyCost: number;
  items: ItemData[];
  position?: number | null;
  displayName?: string | null;
}

// Stats efectivos de una unidad (base + overrides fusionados)
export interface EffectiveUnitStats extends UnitStats {
  [key: string]: number;
}

// ============================================================
// ITEMS
// ============================================================

export interface ItemData {
  id: string;
  versionId: string;
  name: string;
  type: ItemType;
  description?: string | null;
  costPts: number;
  factions: FactionKey[];
  raceId?: string | null;
  hpConfig?: HpSlot[] | null;
  mechanics?: ItemMechanics | null;
  isActive: boolean;
}

export type ItemType =
  | "raza"
  | "pasiva"
  | "habilidad"
  | "spell"
  | "consumible"
  | "equipo"
  | "arma"
  | "artefacto";

// Efectos mecánicos de un item (usados en V3 por el motor de juego)
export interface ItemMechanics {
  statBonus?: Partial<Record<keyof UnitStats, number>>;
  keywords?: string[];
  onAttack?: string;   // descripción del efecto al atacar
  onDefend?: string;
  onActivate?: string;
}

// ============================================================
// MISIONES
// ============================================================

export interface MissionData {
  id: string;
  versionId: string;
  name: string;
  type: "PRINCIPAL" | "SECUNDARIA";
  victoryPoints: number;
  description: string;
  rules?: string | null;
  flavorText?: string | null;
  isActive: boolean;
}

// ============================================================
// LISTAS DE EJÉRCITO
// ============================================================

export interface ListData {
  id: string;
  name: string;
  description?: string | null;
  totalPoints: number;
  faction?: FactionKey | null;
  isPublic: boolean;
  userId: string;
  units: ListUnitData[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// PARTIDAS
// ============================================================

export interface MatchData {
  id: string;
  winnerUserId: string;
  loserUserId: string;
  winnerListId: string;
  loserListId: string;
  playedAt: Date;
  gameRoomId?: string | null;
}

// ============================================================
// V3: ESTADO DEL JUEGO
// ============================================================

// Estado de una unidad en el tablero durante una partida
export interface BoardUnit {
  listUnitId: string;
  unitBaseId: string;
  name: string;
  faction: FactionKey;
  playerId: string;

  // Posición en el tablero (coordenadas de grid)
  position: { x: number; y: number };

  // HP actual por localización
  currentHp: Record<string, number>;

  // Acciones restantes en el turno
  actionsLeft: number;
  energyLeft: number;

  // Estado de condiciones
  conditions: string[]; // "stunned", "poisoned", etc.

  isAlive: boolean;
}

// Evento del log de batalla (para replay movimiento a movimiento)
export interface BattleEvent {
  turn: number;
  playerId: string;
  eventType: "move" | "attack" | "spell" | "item" | "end_turn";
  unitId: string;
  data: Record<string, unknown>;
  timestamp: number;
}

// Estado completo del juego (almacenado en GameRoom.gameState)
export interface GameState {
  turn: number;
  phase: "setup" | "playing" | "finished";
  activePlayerId: string;
  hostUnits: BoardUnit[];
  guestUnits: BoardUnit[];
  battleLog: BattleEvent[];
  winner?: string | null;
}

// ============================================================
// UI / COMPONENTES
// ============================================================

// Para el builder de unidades (estado de Zustand)
export interface BuilderState {
  unitName: string;
  raceId: string;
  faction: FactionKey;
  stats: UnitStats & Record<string, number>; // HP dinámico incluido
  puedeGema: boolean;
  gemaEnMano: boolean;
  weapon: WeaponType;
  editId: string | null; // null = nueva unidad
}

// Para el modo de impresión
export type PrintMode = "full-sheet" | "modular" | "missions";

export interface PrintOptions {
  mode: PrintMode;
  units?: ListUnitData[];
  missions?: MissionData[];
  showRules?: boolean;
  showFlavorText?: boolean;
}

// Habilidad de una unidad
export interface AbilityData {
  id?: string;
  label: string;
  description: string;
  isPassive: boolean;
  mechanic?: string;  // Código legible por el motor de V3
}
