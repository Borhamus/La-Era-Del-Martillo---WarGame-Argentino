// src/app/page.tsx
// Landing page

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Swords, ListChecks, Trophy, Printer } from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-[calc(100vh-50px)] flex flex-col items-center justify-center p-8 text-center">
      {/* Hero */}
      <div className="mb-12">
        <div className="text-6xl mb-4">⚔</div>
        <h1 className="text-5xl font-bold text-gold tracking-[4px] uppercase mb-3">
          La Era del Martillo
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Herramienta de construcción de ejércitos para el wargame de miniaturas.
          Diseñá tus unidades, armá tus listas e imprimí tus fichas.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex gap-3 flex-wrap justify-center mb-16">
        {session ? (
          <>
            <Button size="lg" asChild className="bg-gold text-black hover:bg-gold/85 font-bold">
              <Link href="/builder">⚔ Ir al Builder</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/mis-listas">📋 Mis Listas</Link>
            </Button>
          </>
        ) : (
          <>
            <Button size="lg" asChild className="bg-gold text-black hover:bg-gold/85 font-bold">
              <Link href="/register">Empezar gratis</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl w-full">
        {[
          {
            icon: <Swords className="w-8 h-8 text-gold" />,
            title: "Constructor",
            desc: "Armá unidades con las 4 facciones. Cálculo de BP en tiempo real.",
          },
          {
            icon: <ListChecks className="w-8 h-8 text-bisk" />,
            title: "Listas de Ejército",
            desc: "Guardá, compartí y exportá tus listas de 60 puntos.",
          },
          {
            icon: <Printer className="w-8 h-8 text-tain" />,
            title: "Impresión",
            desc: "Fichas de unidades, cartas de items y misiones listas para imprimir.",
          },
          {
            icon: <Trophy className="w-8 h-8 text-evol" />,
            title: "Comunidad",
            desc: "Rankings, listas compartidas y registro de partidas.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-card border border-border rounded p-5 text-left"
          >
            <div className="mb-3">{f.icon}</div>
            <div className="font-bold mb-1">{f.title}</div>
            <div className="text-sm text-muted-foreground">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* V3 teaser */}
      <div className="mt-12 bg-gradient-to-r from-[#1a0808] to-[#08081a] border border-gold/30 rounded p-6 max-w-xl w-full">
        <div className="text-gold/50 text-[10px] uppercase tracking-wider mb-1">Próximamente — V3</div>
        <div className="font-bold text-lg mb-2">Motor de Juego Online 🎲</div>
        <div className="text-sm text-muted-foreground">
          Jugá partidas online con tus amigos en un tablero 2D. Movimiento asistido, combate con dados, replay de batallas.
        </div>
      </div>
    </div>
  );
}
