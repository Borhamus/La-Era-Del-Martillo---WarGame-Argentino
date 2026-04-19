"use client";

// src/components/builder/BudgetBar.tsx
// Barra de presupuesto heroico con semáforo de colores.

import { getBudgetBarColor } from "@/lib/utils";

interface BudgetBarProps {
  current: number;
  max: number;
  armyCost: number;
  maxArmyPts: number;
}

export function BudgetBar({ current, max, armyCost, maxArmyPts }: BudgetBarProps) {
  const pct = (current / max) * 100;
  const clampedPct = Math.min(100, pct);
  const barColor = getBudgetBarColor(pct);

  return (
    <div className="bg-card border border-border rounded p-3 space-y-2">
      {/* Fila principal: BP totales y costo de ejército */}
      <div className="grid grid-cols-2 gap-2 items-center">
        {/* Build Points */}
        <div className="bg-gradient-to-br from-[#130e00] to-[#080813] border-2 border-gold rounded p-2 text-center">
          <div className="text-[40px] font-bold text-gold leading-none">{current}</div>
          <div className="text-[9px] uppercase tracking-[1.5px] text-muted-foreground mt-0.5">
            Build Points
          </div>
        </div>

        {/* Army Cost */}
        <div className="bg-gradient-to-br from-[#080813] to-[#130813] border-2 border-bisk rounded p-2 text-center">
          <div className="text-[34px] font-bold text-bisk leading-none">{armyCost}</div>
          <div className="text-[9px] uppercase tracking-[1.5px] text-muted-foreground mt-0.5">
            Costo Ejército
          </div>
          <div className="text-[10px] text-muted-foreground">
            {armyCost}/{maxArmyPts} pts
          </div>
        </div>
      </div>

      {/* Barra de presupuesto */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] uppercase tracking-[1px] text-muted-foreground">
            Presupuesto heroico
          </span>
          <span className="text-[13px] font-bold">
            <span style={{ color: barColor }}>{current}</span>
            <span className="text-muted-foreground text-[11px]"> / {max} bp</span>
          </span>
        </div>
        <div className="h-1.5 bg-background rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${clampedPct}%`, background: barColor }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
          <span>Base</span>
          <span>{Math.round(pct)}%</span>
          <span>Élite</span>
        </div>
      </div>
    </div>
  );
}
