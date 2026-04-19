// middleware.ts
// Protección de rutas por autenticación y rol.
// Next.js ejecuta esto en el edge antes de cada request.

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Rutas de admin: requieren role === ADMIN
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // authorized se corre antes del middleware fn de arriba
      // Si retorna false, redirige a /login automáticamente
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Rutas que requieren autenticación
        const protectedPrefixes = ["/mis-listas", "/comunidad", "/admin", "/builder"];
        const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

        if (isProtected) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/builder/:path*",
    "/mis-listas/:path*",
    "/comunidad/:path*",
    "/admin/:path*",
  ],
};
