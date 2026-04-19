"use client";

// src/components/builder/FactionSelector.tsx

import { cn } from "@/lib/utils";
import type { FactionKey } from "@/lib/utils";

const FACTIONS: { key: FactionKey; icon: string; label: string }[] = [
  { key: "tain", icon: "🌿", label: "Semillas de Táin" },
  { key: "dein", icon: "💀", label: "Esbirros de Déin" },
  { key: "bisk", icon: "🌀", label: "Biskrorum" },
  { key: "evol", icon: "⚡", label: "Evolgenia" },
];

interface FactionSelectorProps {
  value: FactionKey;
  onChange: (f: FactionKey) => void;
}

const FACTION_STYLES: Record<FactionKey, { base: string; active: string }> = {
  tain: { base: "text-tain",  active: "border-tain bg-[#0b1f14]" },
  dein: { base: "text-dein",  active: "border-dein bg-[#1f0b0b]" },
  bisk: { base: "text-bisk",  active: "border-bisk bg-[#130b1f]" },
  evol: { base: "text-evol",  active: "border-evol bg-[#1a1800]" },
};

export function FactionSelector({ value, onChange }: FactionSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {FACTIONS.map((fac) => {
        const isActive = value === fac.key;
        const styles = FACTION_STYLES[fac.key];
        return (
          <button
            key={fac.key}
            onClick={() => onChange(fac.key)}
            className={cn(
              "p-2 border-2 rounded text-[11px] font-semibold text-center bg-secondary transition-all touch-target",
              styles.base,
              isActive ? styles.active : "border-[#222] hover:border-border"
            )}
          >
            {fac.icon} {fac.label}
          </button>
        );
      })}
    </div>
  );
}
