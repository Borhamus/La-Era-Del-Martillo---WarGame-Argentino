"use client";

// src/components/builder/UnitCard.tsx
// Card de unidad en el roster — muestra stats clave, BP y pts de ejército.

import { cn } from "@/lib/utils";
import { MOV_LABELS, WEAPON_LABELS } from "@/lib/utils";
import type { SavedUnit } from "@/lib/builderStore";
import { X } from "lucide-react";

const FAC_META = {
  tain: { icon: "🌿", label: "Semillas de Táin", colorClass: "text-tain border-tain" },
  dein: { icon: "💀", label: "Esbirros de Déin",  colorClass: "text-dein border-dein" },
  bisk: { icon: "🌀", label: "Biskrorum",          colorClass: "text-bisk border-bisk" },
  evol: { icon: "⚡", label: "Evolgenia",          colorClass: "text-evol border-evol" },
};

interface UnitCardProps {
  unit: SavedUnit;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function UnitCard({ unit, isSelected, onSelect, onDelete }: UnitCardProps) {
  const fac = FAC_META[unit.faction];
  const movLabel = MOV_LABELS[(unit.stats.mov ?? 1) - 1];
  const pvText = (v: number, max = 3) =>
    "●".repeat(v) + "○".repeat(max - v);

  return (
    <div
      className={cn(
        "bg-card border rounded p-2.5 flex items-start gap-2.5 cursor-pointer transition-colors",
        isSelected ? "border-gold" : "border-border hover:border-border/60"
      )}
      onClick={onSelect}
    >
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[13px] mb-0.5">{unit.name}</div>
        {unit.raceName && (
          <div className="text-[10px] text-muted-foreground mb-1">🧬 {unit.raceName}</div>
        )}

        {/* Mini stats */}
        <div className="flex gap-1.5 flex-wrap">
          {[
            { label: "PA",  val: pvText(unit.stats.pa) },
            { label: "PE",  val: pvText(unit.stats.pe) },
            { label: "MOV", val: movLabel },
            { label: "MEL", val: `+${unit.stats.melee}` },
            { label: "RNG", val: `+${unit.stats.range}` },
            { label: "REF", val: `+${unit.stats.reflejos}` },
          ].map(({ label, val }) => (
            <span
              key={label}
              className="bg-background rounded px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {label} <span className="text-gold font-bold">{val}</span>
            </span>
          ))}
        </div>

        <div className="text-[10px] text-muted-foreground mt-1">
          HP:{" "}
          {unit.hpConfig.map((s) => `${s.label}:${unit.stats[`hp_${s.slotId}`] ?? s.base}`).join(" / ")}
          {" · "}
          {WEAPON_LABELS[unit.weapon] ?? unit.weapon}
          {unit.puedeGema && " · 💎 Gema"}
        </div>
      </div>

      {/* Badge de costo */}
      <div className="text-center flex-shrink-0">
        <div className="bg-card border border-border rounded px-2 py-1">
          <div className="text-[22px] font-bold text-bisk leading-none">{unit.armyCost}</div>
          <div className="text-[8px] text-muted-foreground uppercase">pts</div>
        </div>
        <div className="text-[9px] text-muted-foreground mt-1">{unit.buildCost}bp</div>

        {/* Facción tag */}
        <div className={cn("fac-tag mt-1.5", fac.colorClass)}>
          {fac.icon}
        </div>
      </div>

      {/* Botón eliminar */}
      <button
        className="text-muted-foreground/30 hover:text-dein transition-colors flex-shrink-0 p-0.5"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Eliminar unidad"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
