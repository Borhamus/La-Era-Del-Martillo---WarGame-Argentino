"use client";

// src/app/(auth)/login/page.tsx

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validaciones";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email o contraseña incorrectos");
    } else {
      router.push("/builder");
      router.refresh();
    }
  }

  return (
    <div className="min-h-[calc(100vh-50px)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">⚔</div>
          <h1 className="text-2xl font-bold text-gold tracking-wider uppercase">
            La Era del Martillo
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Iniciá sesión para continuar</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register("email")}
              className="h-10"
            />
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="h-10"
            />
            {errors.password && (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded p-3 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-10 bg-gold text-black hover:bg-gold/85 font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Iniciar sesión
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="text-gold hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
