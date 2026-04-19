"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Swords, ListChecks, Users, Shield, LogOut, User } from "lucide-react";

const NAV_LINKS = [
  { href: "/builder",    label: "⚔ Builder",    icon: Swords },
  { href: "/mis-listas", label: "📋 Mis Listas", icon: ListChecks },
  { href: "/comunidad",  label: "🏆 Comunidad",  icon: Users },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="border-b border-border bg-gradient-to-r from-[#1a0808] to-[#08081a] flex-shrink-0 h-[50px] z-50 sticky top-0">
      <div className="h-full flex items-center gap-3 px-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-gold font-bold tracking-[2px] uppercase text-[15px] whitespace-nowrap mr-1 hover:opacity-80 transition-opacity"
        >
          ⚔ Era del Martillo
        </Link>

        {/* Nav principal (oculto en mobile, visible en md+) */}
        <nav className="hidden md:flex gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded text-[11px] uppercase tracking-[1px] border transition-all",
                pathname.startsWith(link.href)
                  ? "bg-gold text-black border-gold font-bold"
                  : "bg-transparent border-border text-muted-foreground hover:border-border/60 hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* Link de Admin (solo para admins) */}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "px-3 py-1.5 rounded text-[11px] uppercase tracking-[1px] border transition-all",
                pathname.startsWith("/admin")
                  ? "bg-dein text-white border-dein font-bold"
                  : "bg-transparent border-border text-dein hover:border-dein/60"
              )}
            >
              🛡 Admin
            </Link>
          )}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Auth */}
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-[11px] uppercase tracking-[1px] border border-border h-8 px-3"
              >
                <User className="w-3 h-3 mr-1.5" />
                {session.user?.name ?? session.user?.email}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/mis-listas" className="cursor-pointer">
                  <ListChecks className="w-4 h-4 mr-2" />
                  Mis Listas
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer text-dein">
                      <Shield className="w-4 h-4 mr-2" />
                      Panel Admin
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild className="h-8 text-[11px]">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button size="sm" asChild className="h-8 text-[11px] bg-gold text-black hover:bg-gold/85">
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
