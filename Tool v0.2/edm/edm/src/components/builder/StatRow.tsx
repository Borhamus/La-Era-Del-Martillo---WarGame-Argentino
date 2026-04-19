"use client";

// src/components/builder/StatRow.tsx
// Fila de stat: [nombre] [−] [valor/dots] [+] [afinidad] [costo bp]
// Portado exactamente del stat-row de V1.

import { cn } from "@/lib/utils";
import type { StatDef } from "@/lib/utils";
import { MOV_LABELS } from "@/lib/utils";

interface StatRowProps {
  def: StatDef;
  value: number;
  affinity?: number;    // 0–3 (modificador de facción)
  costBP: number;       // Costo efectivo calculado
  onDecrement: () => void;
  onIncrement: () => void;
  disabled?: boolean;
}

export function StatRow({
  def,
  value,
  affinity = 0,
  costBP,
  onDecrement,
  onIncrement,
  disabled = false,
}: StatRowProps) {
  const atMin = value <= def.min;
  const atMax = value >= def.max;

  return (
    <div className="flex items-center gap-1.5 py-1 border-b border-[#1a1a1a] last:border-0">
      {/* Nombre del stat */}
      <span className="w-[95px] text-[11px] flex-shrink-0 text-foreground/80">
        {def.name}
      </span>

      {/* Controles */}
      <div className="flex items-center gap-1 flex-1">
        <button
          className="btn-stat"
          onClick={onDecrement}
          disabled={atMin || disabled}
          aria-label={`Disminuir ${def.name}`}
        >
          −
        </button>

        {/* Valor — PV dots para PA/PE/MOV, +N para el resto, número para inv/hp */}
        <ValueDisplay def={def} value={value} />

        <button
          className="btn-stat"
          onClick={onIncrement}
          disabled={atMax || disabled}
          aria-label={`Aumentar ${def.name}`}
        >
          +
        </button>
      </div>

      {/* Afinidad (dots) — solo para stats con facción */}
      {def.group !== "hp" && def.group !== "inv" ? (
        <div className="w-[44px] flex gap-[2px] justify-center items-center flex-shrink-0">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn("aff-dot", i < affinity && "on")}
            >
              ●
            </span>
          ))}
        </div>
      ) : (
        <div className="w-[44px]" /> // Spacer para alinear
      )}

      {/* Costo en BP */}
      <span className="w-[34px] text-right text-[10px] text-muted-foreground flex-shrink-0">
        {costBP}bp
      </span>
    </div>
  );
}

// ---- Sub-componente: muestra el valor según el tipo de stat ----
function ValueDisplay({ def, value }: { def: StatDef; value: number }) {
  // PA / PE — puntos verdes
  if (def.pvDots && def.id !== "mov") {
    return (
      <div className="flex gap-1 min-w-[52px] justify-center items-center">
        {Array.from({ length: def.max }, (_, i) => (
          <span key={i} className={cn("pv-dot", i < value && "on")}>
            ●
          </span>
        ))}
      </div>
    );
  }

  // MOV — puntos verdes + label en cm
  if (def.id === "mov") {
    return (
      <div className="flex gap-1 min-w-[72px] justify-center items-center">
        {Array.from({ length: def.max }, (_, i) => (
          <span key={i} className={cn("pv-dot", i < value && "on")}>
            ●
          </span>
        ))}
        <span className="text-[9px] text-muted-foreground ml-1">
          {MOV_LABELS[value - 1]}
        </span>
      </div>
    );
  }

  // Slots de inventario — número simple
  if (def.group === "inv") {
    return (
      <span className="w-[36px] text-center font-bold text-[13px] text-gold">
        {value}
      </span>
    );
  }

  // HP — número simple
  if (def.group === "hp") {
    return (
      <span className="w-[36px] text-center font-bold text-[13px] text-foreground">
        {value}
      </span>
    );
  }

  // Stats de combate/defensa/utilidad — +N
  return (
    <span className="w-[36px] text-center font-bold text-[13px] text-gold">
      +{value}
    </span>
  );
}
