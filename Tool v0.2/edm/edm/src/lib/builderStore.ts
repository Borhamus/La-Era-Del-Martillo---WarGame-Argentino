// src/lib/builderStore.ts
// Estado global del constructor de unidades — Zustand.
// ÚNICO lugar donde vive el estado mutable del builder.
// Los componentes leen de aquí y despachan acciones aquí.

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  DEFAULT_COSTS,
  DEFAULT_FACTION_MODS,
  DEFAULT_FACTION_STD,
  DEFAULT_GAME_CONFIG,
  DEFAULT_HP_CONFIG,
  DEFAULT_HP_VALS,
  DEFAULT_STATS,
  STATS_BASE,
  calcBuildCost,
  clampStat,
  toArmyPts,
  deepClone,
  type FactionKey,
  type UnitStats,
  type WeaponType,
  type HpSlot,
  type CostConfig,
  type FactionMods,
  type GameConfig,
  type CalcResult,
} from "./utils";

// ============================================================
// TIPOS
// ============================================================

export interface SavedUnit {
  id: string;
  name: string;
  raceId: string;
  raceName: string;
  faction: FactionKey;
  stats: UnitStats & Record<string, number>;
  puedeGema: boolean;
  gemaEnMano: boolean;
  weapon: WeaponType;
  buildCost: number;
  armyCost: number;
  hpConfig: HpSlot[];
}

interface BuilderState {
  // ---- Estado del builder activo ----
  unitName: string;
  raceId: string;
  faction: FactionKey;
  stats: UnitStats & Record<string, number>;
  puedeGema: boolean;
  gemaEnMano: boolean;
  weapon: WeaponType;
  editId: string | null;

  // ---- Unidades guardadas en el set ----
  units: SavedUnit[];

  // ---- Configuración del juego (editable por admin en la pestaña Costos) ----
  costConfig: CostConfig;
  factionMods: FactionMods;
  factionStd: Record<FactionKey, Record<string, number>>;
  gameConfig: GameConfig;

  // ---- HP Config del constructor activo ----
  activeHpConfig: HpSlot[];

  // ---- Cálculo en tiempo real ----
  calcResult: CalcResult;

  // ============================================================
  // ACCIONES
  // ============================================================

  // Stat
  setStat: (id: string, val: number) => void;
  changeStat: (id: string, delta: number) => void;

  // Identidad
  setFaction: (f: FactionKey) => void;
  setUnitName: (n: string) => void;
  setRace: (raceId: string, hpConfig?: HpSlot[]) => void;

  // Gema y arma
  setPuedeGema: (v: boolean) => void;
  setGemaEnMano: (v: boolean) => void;
  setWeapon: (w: WeaponType) => void;

  // CRUD de unidades
  saveUnit: () => SavedUnit;
  loadUnit: (id: string) => void;
  deleteUnit: (id: string) => void;
  resetBuilder: () => void;

  // Config del juego
  setCostConfig: (c: CostConfig) => void;
  setFactionMod: (faction: FactionKey, statId: string, val: number) => void;
  setFactionStd: (faction: FactionKey, statId: string, val: number) => void;
  setGameConfig: (c: GameConfig) => void;
  resetConfigToDefault: () => void;

  // Import/Export
  importSet: (data: ExportData) => void;
  exportSet: (setName: string) => ExportData;
}

export interface ExportData {
  meta: {
    setName: string;
    game: string;
    version: string;
    savedAt: string;
  };
  gameConfig: GameConfig;
  costConfig: CostConfig;
  factionMods: FactionMods;
  factionStd: Record<FactionKey, Record<string, number>>;
  units: SavedUnit[];
}

// ============================================================
// FUNCIÓN DE RECALC
// ============================================================

function recalc(
  state: Pick<
    BuilderState,
    "stats" | "faction" | "puedeGema" | "activeHpConfig" | "factionMods" | "costConfig"
  >
): CalcResult {
  return calcBuildCost({
    stats: state.stats,
    faction: state.faction,
    puedeGema: state.puedeGema,
    hpConfig: state.activeHpConfig,
    factionMods: state.factionMods,
    costConfig: state.costConfig,
  });
}

function buildInitialStats(): UnitStats & Record<string, number> {
  return { ...DEFAULT_STATS, ...DEFAULT_HP_VALS };
}

// ============================================================
// STORE
// ============================================================

export const useBuilderStore = create<BuilderState>()(
  devtools(
    (set, get) => ({
      // ---- Estado inicial ----
      unitName: "",
      raceId: "",
      faction: "tain",
      stats: buildInitialStats(),
      puedeGema: false,
      gemaEnMano: false,
      weapon: "1m1m",
      editId: null,

      units: [],

      costConfig: deepClone(DEFAULT_COSTS),
      factionMods: deepClone(DEFAULT_FACTION_MODS),
      factionStd: deepClone(DEFAULT_FACTION_STD),
      gameConfig: deepClone(DEFAULT_GAME_CONFIG),

      activeHpConfig: deepClone(DEFAULT_HP_CONFIG),

      calcResult: { total: 0, breakdown: {} },

      // ============================================================
      // ACCIONES
      // ============================================================

      setStat: (id, val) =>
        set((state) => {
          // Encontrar la definición del stat para clampearlo
          const def =
            STATS_BASE.find((d) => d.id === id) ??
            state.activeHpConfig
              .map((s) => ({
                id: `hp_${s.slotId}`,
                min: s.min,
                max: s.max,
                cPt: s.cPt,
                base: s.base,
                name: s.label,
                group: "hp" as const,
              }))
              .find((d) => d.id === id);

          const clamped = def ? clampStat(def, val) : val;
          const newStats = { ...state.stats, [id]: clamped };
          const newState = { ...state, stats: newStats };
          return { stats: newStats, calcResult: recalc(newState) };
        }),

      changeStat: (id, delta) => {
        const { stats } = get();
        const cur = stats[id] ?? 0;
        get().setStat(id, cur + delta);
      },

      setFaction: (f) =>
        set((state) => {
          const newState = { ...state, faction: f };
          return { faction: f, calcResult: recalc(newState) };
        }),

      setUnitName: (n) => set({ unitName: n }),

      setRace: (raceId, hpConfig = DEFAULT_HP_CONFIG) => {
        set((state) => {
          // Inicializar HP slots de la nueva raza
          const newStats = { ...state.stats };
          for (const slot of hpConfig) {
            if (newStats[`hp_${slot.slotId}`] === undefined) {
              newStats[`hp_${slot.slotId}`] = slot.base;
            }
          }
          const newState = { ...state, stats: newStats, activeHpConfig: hpConfig };
          return {
            raceId,
            activeHpConfig: hpConfig,
            stats: newStats,
            calcResult: recalc(newState),
          };
        });
      },

      setPuedeGema: (v) =>
        set((state) => {
          const newState = { ...state, puedeGema: v };
          if (!v) {
            newState.gemaEnMano = false;
          }
          return { puedeGema: v, gemaEnMano: newState.gemaEnMano, calcResult: recalc(newState) };
        }),

      setGemaEnMano: (v) =>
        set((state) => {
          const newState = { ...state, gemaEnMano: v };
          return { gemaEnMano: v, calcResult: recalc(newState) };
        }),

      setWeapon: (w) =>
        set((state) => {
          // "1M+Gema" implica gemaEnMano
          const gemaEnMano = w === "1mgema" ? true : state.gemaEnMano;
          return { weapon: w, gemaEnMano };
        }),

      saveUnit: () => {
        const state = get();
        const { total } = state.calcResult;
        const armyCost = toArmyPts(total, state.gameConfig);

        const unit: SavedUnit = {
          id: state.editId ?? Date.now().toString(),
          name: state.unitName || "Sin nombre",
          raceId: state.raceId,
          raceName: "", // el componente puede resolver el nombre desde la lista de items
          faction: state.faction,
          stats: deepClone(state.stats),
          puedeGema: state.puedeGema,
          gemaEnMano: state.gemaEnMano,
          weapon: state.weapon,
          buildCost: total,
          armyCost,
          hpConfig: deepClone(state.activeHpConfig),
        };

        set((s) => {
          const idx = s.units.findIndex((u) => u.id === unit.id);
          const newUnits =
            idx >= 0
              ? s.units.map((u) => (u.id === unit.id ? unit : u))
              : [...s.units, unit];
          return { units: newUnits, editId: null };
        });

        return unit;
      },

      loadUnit: (id) => {
        const unit = get().units.find((u) => u.id === id);
        if (!unit) return;
        set((state) => {
          const newState = {
            ...state,
            unitName: unit.name,
            raceId: unit.raceId,
            faction: unit.faction,
            stats: deepClone(unit.stats),
            puedeGema: unit.puedeGema,
            gemaEnMano: unit.gemaEnMano,
            weapon: unit.weapon,
            editId: id,
            activeHpConfig: deepClone(unit.hpConfig),
          };
          return { ...newState, calcResult: recalc(newState) };
        });
      },

      deleteUnit: (id) =>
        set((state) => ({
          units: state.units.filter((u) => u.id !== id),
          editId: state.editId === id ? null : state.editId,
        })),

      resetBuilder: () =>
        set((state) => {
          const newStats = buildInitialStats();
          const newState = {
            ...state,
            unitName: "",
            raceId: "",
            stats: newStats,
            puedeGema: false,
            gemaEnMano: false,
            weapon: "1m1m" as WeaponType,
            editId: null,
            activeHpConfig: deepClone(DEFAULT_HP_CONFIG),
          };
          return { ...newState, calcResult: recalc(newState) };
        }),

      setFactionMod: (faction, statId, val) =>
        set((state) => {
          const clamped = Math.min(3, Math.max(0, val));
          const newMods = {
            ...state.factionMods,
            [faction]: { ...state.factionMods[faction], [statId]: clamped },
          };
          const newState = { ...state, factionMods: newMods };
          return { factionMods: newMods, calcResult: recalc(newState) };
        }),

      setFactionStd: (faction, statId, val) =>
        set((state) => ({
          factionStd: {
            ...state.factionStd,
            [faction]: { ...state.factionStd[faction], [statId]: val },
          },
        })),

      setCostConfig: (c) =>
        set((state) => {
          const newState = { ...state, costConfig: c };
          return { costConfig: c, calcResult: recalc(newState) };
        }),

      setGameConfig: (c) => set({ gameConfig: c }),

      resetConfigToDefault: () =>
        set((state) => {
          const newState = {
            ...state,
            costConfig: deepClone(DEFAULT_COSTS),
            factionMods: deepClone(DEFAULT_FACTION_MODS),
            factionStd: deepClone(DEFAULT_FACTION_STD),
            gameConfig: deepClone(DEFAULT_GAME_CONFIG),
          };
          return { ...newState, calcResult: recalc(newState) };
        }),

      importSet: (data) =>
        set((state) => {
          const newState = {
            ...state,
            costConfig: data.costConfig ?? deepClone(DEFAULT_COSTS),
            factionMods: data.factionMods ?? deepClone(DEFAULT_FACTION_MODS),
            factionStd: data.factionStd ?? deepClone(DEFAULT_FACTION_STD),
            gameConfig: data.gameConfig ?? deepClone(DEFAULT_GAME_CONFIG),
            units: data.units ?? [],
          };
          return { ...newState, calcResult: recalc(newState) };
        }),

      exportSet: (setName) => {
        const state = get();
        return {
          meta: {
            setName,
            game: "La Era del Martillo",
            version: "2",
            savedAt: new Date().toISOString(),
          },
          gameConfig: deepClone(state.gameConfig),
          costConfig: deepClone(state.costConfig),
          factionMods: deepClone(state.factionMods),
          factionStd: deepClone(state.factionStd),
          units: deepClone(state.units),
        };
      },
    }),
    { name: "builder-store" }
  )
);
