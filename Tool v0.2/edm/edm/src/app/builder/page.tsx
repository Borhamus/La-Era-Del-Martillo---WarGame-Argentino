"use client";

// src/app/builder/page.tsx
// Constructor de unidades — núcleo de la app.
// Portado de V1 a Next.js con estado Zustand y cálculo en tiempo real.

import { useBuilderStore } from "@/lib/builderStore";
import { STATS_BASE, getAffinity, effCost } from "@/lib/utils";
import { StatRow } from "@/components/builder/StatRow";
import { FactionSelector } from "@/components/builder/FactionSelector";
import { BudgetBar } from "@/components/builder/BudgetBar";
import { WEAPON_LABELS } from "@/lib/utils";
import { hasGemaWeaponConflict } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UnitCard } from "@/components/builder/UnitCard";
import { Save, Plus, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { WeaponType } from "@/lib/utils";

// Grupos de stats para renderizar las cards
const STAT_GROUPS = [
  { id: "acciones", label: "Acciones & Energía",  stats: ["pa", "pe"] },
  { id: "combate",  label: "Combate",              stats: ["mov", "melee", "range"] },
  { id: "defensas", label: "Defensas",             stats: ["reflejos", "bloqueo", "resfis", "resmag"] },
  { id: "utilidad", label: "Utilidad",             stats: ["focus", "robar"] },
  { id: "inv",      label: "Inventario",           stats: ["spells", "bag"] },
] as const;

export default function BuilderPage() {
  const store = useBuilderStore();
  const { toast } = useToast();

  const { calcResult, factionMods, costConfig, gameConfig, activeHpConfig } = store;

  // Verificar conflicto de arma+gema
  const hasConflict = hasGemaWeaponConflict({
    puedeGema: store.puedeGema,
    gemaEnMano: store.gemaEnMano,
    weapon: store.weapon,
  });

  function handleSave() {
    if (!store.unitName.trim()) {
      toast({ title: "El nombre es requerido", variant: "destructive" });
      return;
    }
    store.saveUnit();
    toast({ title: "✓ Unidad guardada" });
  }

  return (
    <div className="flex h-[calc(100vh-50px)] overflow-hidden">
      {/* ======================================================
          COLUMNA IZQUIERDA — Constructor
          ====================================================== */}
      <aside className="w-[380px] flex-shrink-0 bg-card border-r border-border overflow-y-auto p-3 flex flex-col gap-3">

        {/* Caja de presupuesto */}
        <BudgetBar
          current={calcResult.total}
          max={gameConfig.maxBP}
          armyCost={Math.max(1, Math.round(calcResult.total / gameConfig.bpPerPt))}
          maxArmyPts={gameConfig.maxArmyPts}
        />

        {/* Identidad */}
        <SectionCard title="Identidad">
          <div className="space-y-2">
            <div>
              <Label htmlFor="unitName" className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Nombre
              </Label>
              <Input
                id="unitName"
                value={store.unitName}
                onChange={(e) => store.setUnitName(e.target.value)}
                placeholder="Nombre de la unidad..."
                className="mt-1 h-8 text-sm"
              />
            </div>
            <FactionSelector value={store.faction} onChange={store.setFaction} />
          </div>
        </SectionCard>

        {/* Stats por grupo */}
        {STAT_GROUPS.map((group) => {
          const defs = STATS_BASE.filter((d) => group.stats.includes(d.id as never));
          return (
            <SectionCard key={group.id} title={group.label}>
              <div>
                {defs.map((def) => {
                  const val = store.stats[def.id] ?? def.base ?? 0;
                  const aff = getAffinity(store.faction, def.id, factionMods);
                  const cost = calcResult.breakdown[def.id] ?? 0;
                  return (
                    <StatRow
                      key={def.id}
                      def={def}
                      value={val}
                      affinity={aff}
                      costBP={cost}
                      onDecrement={() => store.changeStat(def.id, -1)}
                      onIncrement={() => store.changeStat(def.id, 1)}
                    />
                  );
                })}
              </div>
            </SectionCard>
          );
        })}

        {/* HP por localización */}
        <SectionCard title="HP por Localización">
          <div>
            {activeHpConfig.map((slot) => {
              const statId = `hp_${slot.slotId}`;
              const val = store.stats[statId] ?? slot.base;
              const def = {
                id: statId,
                name: slot.label,
                min: slot.min,
                max: slot.max,
                group: "hp" as const,
                cPt: slot.cPt,
                base: slot.base,
              };
              const cost = calcResult.breakdown[statId] ?? 0;
              return (
                <StatRow
                  key={statId}
                  def={def}
                  value={val}
                  costBP={cost}
                  onDecrement={() => store.changeStat(statId, -1)}
                  onIncrement={() => store.changeStat(statId, 1)}
                />
              );
            })}
          </div>
        </SectionCard>

        {/* Gema y Arma */}
        <SectionCard title="Gema & Arma">
          <div className="space-y-3">
            {/* Toggle gema */}
            <div className="flex items-center gap-3">
              <Switch
                id="chkGema"
                checked={store.puedeGema}
                onCheckedChange={store.setPuedeGema}
              />
              <Label htmlFor="chkGema" className="text-[12px] cursor-pointer">
                Puede Equipar Gema
                <span className="text-muted-foreground text-[10px] ml-1">(+25bp)</span>
              </Label>
            </div>

            {/* Toggle gema en mano */}
            <div
              className="flex items-center gap-3 transition-opacity"
              style={{ opacity: store.puedeGema ? 1 : 0.4, pointerEvents: store.puedeGema ? "auto" : "none" }}
            >
              <Switch
                id="chkGemaEnMano"
                checked={store.gemaEnMano}
                onCheckedChange={store.setGemaEnMano}
                disabled={!store.puedeGema}
              />
              <Label htmlFor="chkGemaEnMano" className="text-[11px] text-muted-foreground cursor-pointer">
                Gema en mano ahora
              </Label>
            </div>

            {/* Tipo de arma */}
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                Tipo de Arma
              </Label>
              <Select
                value={store.weapon}
                onValueChange={(v) => store.setWeapon(v as WeaponType)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(WEAPON_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advertencia de conflicto */}
            {hasConflict && (
              <div className="flex items-start gap-2 bg-[#2a1500] border border-[#7a3500] rounded p-2 text-[10px] text-[#f0a060]">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Arma de 2 manos inutilizable mientras sostiene la Gema.</span>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Desglose de costos */}
        <SectionCard title="Desglose de Costos">
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-0.5">
            {Object.entries(calcResult.breakdown).map(([k, v]) => {
              if (v === 0 && k !== "gema") return null;
              const label = getStatLabel(k, activeHpConfig);
              return (
                <div key={k} className="flex justify-between text-[10px] py-0.5 border-b border-[#1c1c1c]">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Botones de acción */}
        <div className="space-y-2 pb-4">
          <Button className="w-full bg-gold text-black hover:bg-gold/85 font-bold" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {store.editId ? "Actualizar Unidad" : "Guardar Unidad"}
          </Button>
          <Button variant="outline" className="w-full text-[11px]" onClick={store.resetBuilder}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Nueva Unidad (sin guardar)
          </Button>
        </div>
      </aside>

      {/* ======================================================
          COLUMNA DERECHA — Lista de unidades guardadas
          ====================================================== */}
      <main className="flex-1 bg-background overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[11px] uppercase tracking-[2px] text-gold">
            Unidades del Set
          </span>
          <span className="text-[10px] text-muted-foreground">
            {store.units.length} unidad{store.units.length !== 1 ? "es" : ""}
          </span>
        </div>

        {store.units.length === 0 ? (
          <div className="text-center text-muted-foreground py-16 text-[12px]">
            No hay unidades. ¡Construí la primera!
          </div>
        ) : (
          <div className="space-y-2">
            {store.units.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                isSelected={store.editId === unit.id}
                onSelect={() => store.loadUnit(unit.id)}
                onDelete={() => store.deleteUnit(unit.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ---- Helpers ----

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded p-3">
      <div className="text-[10px] uppercase tracking-[1.5px] text-muted-foreground mb-2.5 font-bold">
        {title}
      </div>
      {children}
    </div>
  );
}

function getStatLabel(id: string, hpConfig: { slotId: string; label: string }[]): string {
  const BK_NAMES: Record<string, string> = {
    pa: "P. Acción", pe: "P. Energía", mov: "Movimiento",
    melee: "Melee ATK", range: "Range ATK", reflejos: "Reflejos",
    bloqueo: "Bloqueo", resfis: "Res. Física", resmag: "Res. Mágica",
    focus: "Focus", robar: "Robar", spells: "Spells", bag: "Bag", gema: "Gema",
  };
  if (BK_NAMES[id]) return BK_NAMES[id];
  // HP dinámico
  const slot = hpConfig.find((s) => `hp_${s.slotId}` === id);
  return slot?.label ?? id;
}
